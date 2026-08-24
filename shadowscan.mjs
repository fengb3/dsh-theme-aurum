/**
 * shadowscan.mjs — 侧栏卡阴影横向渐变验证:卡右缘→主区扫一行像素。
 * 用法:node shadowscan.mjs [theme:light|dark]
 * 判读:x 270→350 亮度应从卡片面色经阴影谷底单调回升至画布底色;
 * 若列界 280 处出现台阶(相邻采样差 >6/255)即仍是硬分割线。
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

await page.evaluate(() => {
  const rows = [...document.querySelectorAll('[data-slot=sidebar] .au-srow')];
  const target = rows.find(r => /What We Left/i.test(r.textContent || '')) || rows[1];
  if (target) target.click();
});
await page.waitForTimeout(1500);

if (theme === 'dark') {
  const t = await page.$('[data-slot=sidebar] .aurum-footRow');
  await t.click();
  await page.waitForTimeout(600);
}

const buf = await page.screenshot({ timeout: 60000 });
await browser.close();

const png = PNG.sync.read(buf);
const W = png.width, H = png.height;
/* y=420:会话流中部空白行(避开卡片/文本);x 268..352 跨卡缘 276/列界 280 */
const Y = 420;
const lum = x => {
  const i = (Y * W + x) * 4;
  const r = png.data[i], g = png.data[i + 1], b = png.data[i + 2];
  return Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
};
const samples = [];
for (let x = 268; x <= 352; x += 4) samples.push({ x, l: lum(x) });
console.log(`theme=${theme}  y=${Y}`);
console.log(samples.map(s => `${s.x}:${s.l}`).join('  '));
/* 台阶检测:列界 280 前后(278→282)跳变 */
const stepAtBoundary = Math.abs(lum(282) - lum(278));
/* 渐变检测:282(阴影最深处附近)到 340 应单调回升允许 ±2 抖动 */
let nonMono = 0;
for (let x = 284; x < 340; x += 2) if (Math.abs(lum(x + 2) - lum(x)) > 3) nonMono++;
console.log(`列界跳变(278→282)= ${stepAtBoundary}  ${stepAtBoundary > 6 ? '仍是硬切!' : '无台阶'}`);
console.log(`渐变段粗粞度(>3/2px 的跳点)= ${nonMono}  ${nonMono === 0 ? '平滑渐变' : '有起伏(检查)'}`);
