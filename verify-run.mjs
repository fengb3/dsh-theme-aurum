/**
 * verify-run.mjs — 门禁 runner(playwright-cli 缺席时的 Node 替代)。
 *
 * 用法:node verify-run.mjs <verify-*.js> [更多脚本…]
 *   - 从仓库 node_modules(devDependency)解析 playwright-core;
 *   - 浏览器用本机 Chrome(channel:"chrome"),失败回退 Edge(channel:"msedge"),
 *     再失败回退 PLAYWRIGHT_EXECUTABLE 环境变量指定的可执行文件;
 *   - 打开 http://127.0.0.1:3080(LIVE_URL 环境变量可覆盖),等 networkidle;
 *   - 设置全局 __AU_PROTO_URL__(原型 file:// URL,供 verify-proto-diff.js);
 *   - 读取 verify 脚本(格式 `async page => {}`),在 Node 侧 indirect-eval 成函数
 *     后以真实 page 调用(= playwright-cli eval 的执行模型:脚本跑在 Node,
 *     页面交互走脚本内部的 page.evaluate),结果 JSON 打到 stdout。
 *
 * 注意:verify-*.js 本身不改 —— 它们仍是 `async page => {}` 格式。
 */
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const repoRoot = path.dirname(fileURLToPath(import.meta.url));
let pw;
try {
  pw = require('playwright-core');
} catch {
  console.error('[verify-run] playwright-core 未安装:先在仓库跑 npm install');
  process.exit(1);
}

const scripts = process.argv.slice(2).filter(a => a !== '--shot' && !a.endsWith('.png'));
if (!scripts.length) {
  console.error('用法: node verify-run.mjs <verify-*.js> [更多脚本…]');
  process.exit(1);
}
const LIVE_URL = process.env.LIVE_URL || 'http://127.0.0.1:3080';
const PROTO_URL = 'file:///' + path.join(repoRoot, 'prototype', 'dsh-agent-workspace.html').replace(/\\/g, '/');

async function launch() {
  for (const opt of [{ channel: 'chrome' }, { channel: 'msedge' }]) {
    try { return await pw.chromium.launch({ ...opt, headless: true }); }
    catch (e) { console.error(`[verify-run] launch ${opt.channel} 失败: ${e.message.split('\n')[0]}`); }
  }
  if (process.env.PLAYWRIGHT_EXECUTABLE) {
    return pw.chromium.launch({ executablePath: process.env.PLAYWRIGHT_EXECUTABLE, headless: true });
  }
  throw new Error('无可用浏览器:装 Chrome/Edge 或设 PLAYWRIGHT_EXECUTABLE');
}

const browser = await launch();
let failed = 0;
globalThis.__AU_PROTO_URL__ = PROTO_URL;
try {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(LIVE_URL, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(1800); // 等 React 挂载与主题落定(live 页常开 WS,networkidle 永不触发)
  for (const s of scripts) {
    const file = path.resolve(repoRoot, s);
    const src = readFileSync(file, 'utf8');
    const tag = path.basename(s);
    try {
      const fn = (0, eval)(`(${src})`); // indirect eval:全局作用域,得 async page=>{} 函数
      const result = await fn(page);
      console.log(`===== ${tag} =====`);
      console.log(JSON.stringify(result, null, 2));
      if (result && typeof result.failures === 'number' && result.failures > 0) failed += result.failures;
    } catch (e) {
      failed++;
      console.error(`===== ${tag} ===== ERROR: ${e.message}`);
    }
  }
  /* --shot <path>:全部脚本跑完后截视口 png */
  const shotIdx = process.argv.indexOf('--shot');
  if (shotIdx !== -1 && process.argv[shotIdx + 1]) {
    await page.screenshot({ path: process.argv[shotIdx + 1], fullPage: false });
    console.log(`[shot] ${process.argv[shotIdx + 1]}`);
  }
} finally {
  await browser.close();
}
process.exit(failed ? 1 : 0);
