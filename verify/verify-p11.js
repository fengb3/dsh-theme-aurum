// P11 门禁:未知工具兜底卡 + tool-kids + 底条实色 + 详情栏收敛
// node verify-run.mjs verify/verify-p11.js --shot screenshots/aurum-p11.png
async page => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const out = {};

  // ── 1. 开当前会话(有 glob/真实未知工具与子调用)──
  for (let i = 0; i < 8; i++) {
    await sleep(500);
    const n = await page.evaluate(() => document.querySelectorAll('.au-callrow').length);
    if (n > 0) { out.openedAt = 'row' + i; break; }
    await page.evaluate((idx) => {
      const rows = [...document.querySelectorAll('.au-srow')].filter(r => r.offsetParent !== null);
      if (rows[idx]) rows[idx].click();
    }, i);
    await sleep(800);
  }

  out.dark = await page.evaluate(() => {
    const r = {};
    // 兜底卡:每个 callrow 里应有 .au-tool;data-tool 名单外工具(如 glob)也要有卡
    const rows = [...document.querySelectorAll('.au-callrow')];
    r.callRowCount = rows.length;
    r.cardsInRows = rows.filter(x => x.querySelector(':scope > .au-tool')).length;
    const KNOWN = ['grep','read','edit','write','todo_write','web_search','web_fetch','pwsh','bash'];
    const tools = [...document.querySelectorAll('.au-tool')].map(e => e.getAttribute('data-tool'));
    r.toolCensus = tools.reduce((m, t) => (m[t] = (m[t] || 0) + 1, m), {});
    const unknown = [...new Set(tools.filter(t => !KNOWN.includes(t)))];
    r.unknownTools = unknown;
    const fb = unknown.map(t => document.querySelector('.au-tool[data-tool="' + (t || '') + '"]')).filter(Boolean)[0];
    if (fb) {
      r.fallbackCard = {
        tool: fb.getAttribute('data-tool'),
        hasName: !!fb.querySelector('.au-name'),
        hasIcon: !!fb.querySelector('.au-ico svg'),
        hasPill: !!fb.querySelector('.au-pill'),
        hasFootStat: !!fb.querySelector('.au-fstat'),
        nameText: fb.querySelector('.au-name') ? fb.querySelector('.au-name').textContent.slice(0, 40) : null
      };
    }
    // 官方 GenericToolCard/ToolRow 不应再出现(抽 obfuscated 卡类)
    r.officialRowLeft = document.querySelectorAll('[data-chat-call-id] > div:not(.au-tool):not(.tool-kids)').length;
    // tool-kids(本会话 subagent 调用产生的子调用)
    const kids = document.querySelectorAll('.tool-kids');
    r.kidContainers = kids.length;
    r.kidRows = document.querySelectorAll('.kid').length;
    if (kids.length) {
      const k = kids[0];
      const ks = getComputedStyle(k);
      r.kidIndent = ks.marginLeft + ' / pad ' + ks.paddingLeft;
      r.kidBorderL = ks.borderLeftWidth + ' ' + ks.borderLeftColor;
      const row = k.querySelector('.kid');
      r.kidSum = row && row.querySelector('.k-sum') ? row.querySelector('.k-sum').textContent : null;
    }
    // 底条实色
    const bar = document.querySelector('.todo-bar');
    if (bar) {
      const bg = getComputedStyle(bar).backgroundColor;
      r.todoBarBg = bg;
      r.todoBarSolid = !/\/\s*[\d.]+\)$/.test(bg) || /\/\s*1\)$/.test(bg);
    }
    const goalBar = document.querySelector('.nLMEza_bar');
    if (goalBar) r.goalBarBg = getComputedStyle(goalBar).backgroundColor;
    // 详情栏:root 网格第三列
    const grid = document.querySelector('[data-slot=root]>div');
    if (grid) {
      const cols = getComputedStyle(grid).gridTemplateColumns.split(' ');
      r.rootCols = cols;
      r.detailsCol = cols[2] || '(无第三列)';
    }
    r.detailsPaneVisible = (() => { const d = document.querySelector('[data-slot=details]'); if (!d) return false; const r2 = d.getBoundingClientRect(); return r2.width > 4; })();
    return r;
  });

  // ── 2. kid 行点击展开 ──
  const kidTest = await page.evaluate(() => {
    const kid = document.querySelector('.kid');
    if (!kid) return 'no-kids-present';
    kid.click();
    return 'clicked';
  });
  out.kidClick = kidTest;
  if (kidTest === 'clicked') {
    await sleep(300);
    out.kidExpanded = await page.evaluate(() => {
      const k = document.querySelector('.tool-kids');
      return k ? !!k.querySelector('.au-tool') : false;
    });
    await page.evaluate(() => { const kid = document.querySelector('.kid'); if (kid) kid.click(); });
  }

  // ── 3. 浅色复核(kid hover 面 + 兜底卡面色)──
  await page.evaluate(() => document.querySelector('.aurum-footRow')?.click());
  await sleep(700);
  out.light = await page.evaluate(() => {
    const r = {};
    const bar = document.querySelector('.todo-bar');
    if (bar) { r.todoBarBg = getComputedStyle(bar).backgroundColor; }
    const fb = document.querySelector('.au-tool[data-tool=glob]');
    if (fb) r.globCardVisible = fb.offsetParent !== null;
    return r;
  });
  await page.evaluate(() => document.querySelector('.aurum-footRow')?.click());
  await sleep(400);
  return JSON.stringify(out, null, 1);
}
