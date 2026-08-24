/**
 * bgscan.mjs — 主区背景像素量化:截图后按行平均主区中列颜色,输出顶/中/底色差。
 * 用法:node bgscan.mjs [theme:light|dark]
 * 判读:各行 avgRGB 若从上到下单调漂移 >2/255,即存在真实渐变;否则为感知误差。
 */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const pw = require('playwright-core');
const { PNG } = require('pngjs');

const theme = process.argv[2] === 'dark' ? 'dark' : 'light';
const browser = await pw.chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('http://127.0.0.1:3080', { waitUntil: 'load', timeout: 30000 });
await page.waitForTimeout(1800);

/* 打开会话(避免 hero 居中态干扰) */
await page.evaluate(() => {
  const rows = [...document.querySelectorAll('[data-slot=sidebar] .au-srow')];
  const target = rows.find(r => /What We Left/i.test(r.textContent || '')) || rows[1];
  if (target) target.click();
});
await page.waitForTimeout(1500);

/* 若要测深色,切主题 */
if (theme === 'dark') {
  const t = await page.$('[data-slot=sidebar] .aurum-footRow');
  await t.click();
  await page.waitForTimeout(600);
}

const buf = await page.screenshot({ timeout: 60000 });
await browser.close();

const png = PNG.sync.read(buf);
const W = png.width, H = png.height;
/* 纯画布采样带:对话列(x≈494..1206)左侧留白 x=330..430,无任何内容卡 */
const X0 = 330, X1 = 430;
const rowAvg = y => {
  let r = 0, g = 0, b = 0, n = 0;
  for (let x = X0; x < X1; x++) {
    const i = (y * W + x) * 4;
    r += png.data[i]; g += png.data[i + 1]; b += png.data[i + 2]; n++;
  }
  return [Math.round(r / n), Math.round(g / n), Math.round(b / n)];
};
const rows = {};
for (const y of [40, 120, 200, 300, 420, 540, 660, 740, 800, 860, 885]) rows[y] = rowAvg(y);
console.log(`theme=${theme} 采样带 x=${X0}-${X1}(主区中线)`);
for (const [y, c] of Object.entries(rows)) console.log(`y=${String(y).padStart(3)}  rgb(${c.join(',')})`);
const top = rows[120], bottom = rows[860];
const drift = Math.abs(bottom[0] - top[0]) + Math.abs(bottom[1] - top[1]) + Math.abs(bottom[2] - top[2]);
console.log(`顶/底总漂移: ${drift} (${drift > 6 ? '存在真实渐变' : '无实质渐变(±2/通道内)'})`);
