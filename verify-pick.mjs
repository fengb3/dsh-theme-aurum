/**
 * verify-pick.mjs — 按 git diff 自动挑选相关 verify 子集(零 LLM,规则本地跑)。
 *
 * 用法:
 *   node verify-pick.mjs [--base <ref>] [--run]
 *     --base <ref>   diff 基线(默认 HEAD,即未提交改动;可传 HEAD~1 等)
 *     --run          直接执行挑选结果
 *
 * 规则(verify-sets.json 单一事实源):
 *   - diff 按文件分块,只对产品代码(client.js/index.js/package.json/
 *     cordis.patch.yml)的增删行做域触发词匹配;verify 工具/文档改动不触发;
 *   - 命中域的脚本合并去重输出;0 命中 → 建议不跑(可 --set core 兜底);
 *   - 命中 ≥4 个域 → 改动面大,建议全量;
 *   - AGENTS.md 纪律不变:阶段收尾/提交前仍跑 --set all。
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repoRoot = path.dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(readFileSync(path.join(repoRoot, 'verify-sets.json'), 'utf8'));
const sets = cfg.sets;
const ALL = [...new Set(Object.entries(sets).filter(([k]) => k !== 'live').flatMap(([, v]) => v.scripts))];
const PRODUCT_RE = /^(client|index)\.js$|^package\.json$|^cordis\.patch\.yml$/;

const argv = process.argv.slice(2);
const baseIdx = argv.indexOf('--base');
const base = baseIdx !== -1 ? argv[baseIdx + 1] : 'HEAD';
const doRun = argv.includes('--run');

/* ── 1. diff 按文件分块 ── */
let raw = '';
try {
  raw = execFileSync('git', ['diff', '--unified=0', base], { cwd: repoRoot, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
} catch (e) {
  console.error(`[verify-pick] git diff ${base} 失败: ${e.message.split('\n')[0]}`);
  process.exit(1);
}
const files = [];
let cur = null;
for (const line of raw.split('\n')) {
  const m = /^diff --git a\/(.+) b\/(.+)$/.exec(line);
  if (m) { cur = { name: m[2], lines: [] }; files.push(cur); continue; }
  if (cur && (line.startsWith('+') || line.startsWith('-')) && !line.startsWith('+++') && !line.startsWith('---')) cur.lines.push(line);
}
const productChanges = files.filter(f => PRODUCT_RE.test(f.name));
const productDiff = productChanges.flatMap(f => f.lines).join('\n');

/* ── 2. 域匹配(仅产品代码增删行)── */
const hits = [];
for (const [domain, pattern] of Object.entries(cfg.triggers)) {
  try { if (productDiff && new RegExp(pattern, 'i').test(productDiff)) hits.push(domain); } catch (e) { console.error(`[verify-pick] 域 ${domain} 正则无效: ${e.message}`); }
}

/* ── 3. 挑选 ── */
let pick = [], verdict = '';
if (productChanges.length === 0) {
  verdict = `无产品代码改动(${files.length} 个非产品文件:verify 工具/文档),无需跑样式门禁`;
} else if (hits.length === 0) {
  verdict = `产品代码改动未命中任何域触发词(${productChanges.map(f => f.name).join(',')})—— 请人工确认;可 --set core 兜底`;
} else if (hits.length >= 4) {
  verdict = `命中 ${hits.length} 个域(${hits.join('/')}),改动面大 → 全量`;
  pick = ALL;
} else {
  pick = [...new Set(hits.flatMap(d => (sets[d] || { scripts: [] }).scripts))];
  verdict = `命中域: ${hits.join(' + ')}(${productChanges.map(f => f.name).join(',')})`;
}

console.log(`[verify-pick] base=${base} 改动文件=${files.length} 产品文件=${productChanges.length}`);
console.log(`[verify-pick] ${verdict}`);
if (pick.length) {
  console.log(`[verify-pick] 建议命令:\n  node verify-run.mjs ${pick.join(' ')}`);
  if (doRun) {
    console.log(`[verify-pick] --run 执行中…`);
    const { status } = spawnSync('node', ['verify-run.mjs', ...pick], { cwd: repoRoot, stdio: 'inherit' });
    process.exit(status || 0);
  }
} else {
  console.log('[verify-pick] 无需执行(阶段收尾仍按 AGENTS.md 跑 --set all)');
}
process.exit(0);
