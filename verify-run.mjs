/**
 * verify-run.mjs — 门禁 runner(playwright-cli 缺席时的 Node 替代)。
 *
 * 用法:node verify-run.mjs <verify/verify-*.js> [更多脚本…] | --set <预设>
 *   - 从仓库 node_modules(devDependency)解析 playwright-core;
 *   - 浏览器用本机 Chrome(channel:"chrome"),失败回退 Edge(channel:"msedge"),
 *     再失败回退 PLAYWRIGHT_EXECUTABLE 环境变量指定的可执行文件;
 *   - 打开 http://127.0.0.1:3080(LIVE_URL 环境变量可覆盖),等侧栏首行出现
 *     (条件就绪,不再固定 1.8s);
 *   - 设置全局 __AU_PROTO_URL__(原型 file:// URL,供 verify-proto-diff.js);
 *   - 注入共享 helper globalThis.__au(条件等待/目标会话定位缓存 —— 脚本内
 *     直接以全局变量 __au 使用;indirect eval 全局作用域可见):
 *       __au.wait(page, fn, timeout)   页内条件轮询,满足即返(默认 5s);
 *       __au.openToolSession(page)     打开一个含工具卡的会话(结果缓存:
 *                                     首次逐行试,后续直接点已知标题);
 *       __au.openTodoSession(page)     同上,目标为含 todo-bar 的会话;
 *       __au.toggleTheme(page)         左下角主题切换(等 body 属性翻转);
 *   - 套件预设 --set <core|theme|icons|cards|sidebar|live|all>(映射在 verify-sets.json);
 *     默认串行执行;--parallel 双页面并行(会话状态互踩风险自担);--serial 显式串行;
 *   - 读取 verify 脚本(格式 `async page => {}`),在 Node 侧 indirect-eval 成函数
 *     后以真实 page 调用(= playwright-cli eval 的执行模型:脚本跑在 Node,
 *     页面交互走脚本内部的 page.evaluate),结果 JSON 打到 stdout。
 *
 * 注意:verify-*.js 本身不改格式 —— 它们仍是 `async page => {}`。
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

/* ── 套件预设:verify-sets.json 单一事实源(verify-pick.mjs 共用);
     日常迭代跑子集,提交前跑 all ── */
const SETS = JSON.parse(readFileSync(path.join(repoRoot, 'verify-sets.json'), 'utf8')).sets;
const allSets = [...new Set(Object.values(SETS).flatMap(v => v.scripts))];

const argv = process.argv.slice(2);
let scripts = argv.filter(a => a !== '--shot' && !a.endsWith('.png'));
const setIdx = argv.findIndex(a => a.startsWith('--set'));
if (setIdx !== -1) {
  const name = (argv[setIdx].includes(':') ? argv[setIdx].split(':')[1] : argv[setIdx + 1] || '').trim();
  const list = name === 'all' ? allSets : (SETS[name] || {}).scripts;
  if (!list) { console.error(`[verify-run] 未知预设 "${name}";可选:${[...Object.keys(SETS), 'all'].join('/')}`); process.exit(1); }
  scripts = list;
}
if (!scripts.length) {
  console.error('用法: node verify-run.mjs <verify/verify-*.js>… | --set <' + [...Object.keys(SETS), 'all'].join('/') + '>');
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

/* ── 共享 helper:条件等待 + 目标会话缓存(跨脚本复用,消除逐行扫描重复)── */
globalThis.__au = {
  cache: {},
  async wait(page, fn, timeout) {
    await page.waitForFunction(fn, undefined, { timeout: timeout || 5000, polling: 120 });
  },
  async openTarget(page, probeSel, cacheKey) {
    if (await page.evaluate(s => !!document.querySelector(s), probeSel)) return 'already-open';
    /* 展开全部分组(截断默认 5)再逐行试;点击后 recent 实时重排,按文本指纹去重;
       扫完还原截断态(au-s-more 转回收起),不污染后续脚本对默认态的断言 */
    await page.evaluate(() => { document.querySelectorAll('.au-s-more[aria-expanded="false"]').forEach(b => b.click()); });
    await page.waitForTimeout(250);
    const restore = async () => { await page.evaluate(() => { document.querySelectorAll('.au-s-more[aria-expanded="true"]').forEach(b => b.click()); }); };
    const tried = [];
    for (let round = 0; round < 60; round++) {
      /* 每轮重确保分组展开:会话升顶跨组移动可能令组组件重挂、more 展开态/
         折叠态(均为内存态)被重置 —— 截断恢复或整组折叠都会让未扫的行不可见 */
      const openedClosed = await page.evaluate(() => {
        document.querySelectorAll('.au-s-more[aria-expanded="false"]').forEach(b => b.click());
        const closed = document.querySelectorAll('.au-wsg.au-closed .au-wsg-head');
        closed.forEach(h => h.click());
        return closed.length;
      });
      if (openedClosed > 0) await page.waitForTimeout(650); /* 组收合 grid 过渡 .34-.5s */
      const picked = await page.evaluate(keys => {
        const rows = [...document.querySelectorAll('[data-slot=sidebar] .au-srow')].filter(r => r.offsetParent !== null);
        for (const r of rows) {
          const key = (r.textContent || '').trim().slice(0, 60);
          if (!keys.includes(key)) { r.click(); return key; }
        }
        return null;
      }, tried);
      if (picked === null) break;
      tried.push(picked);
      await page.waitForTimeout(450); /* 会话渲染窗口;空行快速跳过,不等超时 */
      if (await page.evaluate(s => !!document.querySelector(s), probeSel)) { this.cache[cacheKey] = picked; await restore(); return picked; }
    }
    await restore();
    return null;
  },
  async openToolSession(page) {
    if (this.cache.tool) {
      /* 缓存命中:直接点已知标题(一次点击,替代整轮扫描) */
      const clicked = await page.evaluate(title => {
        const rows = [...document.querySelectorAll('[data-slot=sidebar] .au-srow')].filter(r => r.offsetParent !== null);
        const row = rows.find(r => (r.textContent || '').trim().slice(0, 60) === title);
        if (row) { row.click(); return true; }
        return false;
      }, this.cache.tool);
      if (clicked) {
        try { await this.wait(page, () => !!document.querySelector('.au-tool[data-tool]'), 3000); return this.cache.tool; } catch (e) { /* 缓存失效回退全扫 */ }
      }
    }
    return await this.openTarget(page, '.au-tool[data-tool]', 'tool'); /* data-tool 限定真工具卡(压缩卡 au-comp 复用 .au-tool 类但无 chev/data-tool) */
  },
  async openTodoSession(page) {
    if (this.cache.todo) {
      const clicked = await page.evaluate(title => {
        const rows = [...document.querySelectorAll('[data-slot=sidebar] .au-srow')].filter(r => r.offsetParent !== null);
        const row = rows.find(r => (r.textContent || '').trim().slice(0, 60) === title);
        if (row) { row.click(); return true; }
        return false;
      }, this.cache.todo);
      if (clicked) {
        try { await this.wait(page, () => !!document.querySelector('.todo-bar'), 3000); return this.cache.todo; } catch (e) { /* 回退全扫 */ }
      }
    }
    return await this.openTarget(page, '[data-testid=todo-panel].todo-bar, .todo-bar', 'todo');
  },
  async toggleTheme(page) {
    const before = await page.evaluate(() => document.body.hasAttribute('data-ds-dark-theme'));
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(el => /切换到(深色|浅色)主题/.test((el.getAttribute('title') || '') + (el.getAttribute('aria-label') || '')));
      if (btn) btn.click();
    });
    await page.waitForFunction(b => document.body.hasAttribute('data-ds-dark-theme') !== b, before, { timeout: 4000, polling: 100 }).catch(() => {});
    await page.waitForTimeout(220); /* 主题 CSS transition 收尾 */
  },
};

const browser = await launch();
let failed = 0;
globalThis.__AU_PROTO_URL__ = PROTO_URL;
const serial = process.argv.includes('--serial');
const parallel = process.argv.includes('--parallel');
try {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const openPage = async () => {
    const page = await ctx.newPage();
    await page.goto(LIVE_URL, { waitUntil: 'load', timeout: 30000 });
    await page.waitForSelector('.au-srow, [data-slot=sidebar] [class*=session]', { timeout: 15000 }).catch(() => page.waitForTimeout(1800)); /* 条件就绪,兜底旧等待 */
    return page;
  };
  const runList = async (list, label) => {
    const page = await openPage();
    for (const s of list) {
      const file = path.resolve(repoRoot, s);
      const tag = path.basename(s);
      try {
        const src = readFileSync(file, 'utf8');
        const fn = (0, eval)(`(${src})`); // indirect eval:全局作用域,得 async page=>{} 函数
        const t0 = Date.now();
        const result = await fn(page);
        console.log(`===== ${tag} ===== [${label}] (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
        console.log(JSON.stringify(result, null, 2));
        if (result && typeof result.failures === 'number' && result.failures > 0) failed += result.failures;
        if (result && Array.isArray(result.failures) && result.failures.length > 0) failed += result.failures.length;
      } catch (e) {
        failed++;
        console.error(`===== ${tag} ===== [${label}] ERROR: ${e.message}`);
      }
    }
    return page;
  };
  let pages;
  if (!parallel || serial || scripts.length < 3) {
    /* 默认串行:实测双 tab 并行会互踩 —— dsh 的会话打开是共享状态,
       B 组会把 A 组刚打开的目标会话切走(p25 missing / ctx-light
       「未找到目标会话」实录);要并行显式 --parallel,风险自担 */
    pages = [await runList(scripts, 'A')];
  } else {
    const a = scripts.filter((_, i) => i % 2 === 0);
    const b = scripts.filter((_, i) => i % 2 === 1);
    pages = await Promise.all([runList(a, 'A'), runList(b, 'B')]);
  }
  /* --shot <path>:全部脚本跑完后截视口 png */
  const shotIdx = process.argv.indexOf('--shot');
  if (shotIdx !== -1 && process.argv[shotIdx + 1]) {
    await pages[0].screenshot({ path: process.argv[shotIdx + 1], fullPage: false });
    console.log(`[shot] ${process.argv[shotIdx + 1]}`);
  }
} finally {
  await browser.close();
}
process.exit(failed ? 1 : 0);
