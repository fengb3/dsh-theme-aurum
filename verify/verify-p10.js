// P10 输入坞门禁:todo-bar 遮蔽 + composer 换皮 + ctx-ring/c-stats + 双主题
// node verify-run.mjs verify/verify-p10.js --shot screenshots/aurum-p10.png
async page => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const out = { opened: null };

  // ── 1. 找一个带 todo 的会话(当前活跃会话必有 todo_write;逐行尝试)──
  for (let i = 0; i < 6; i++) {
    await sleep(600);
    const has = await page.evaluate(() => !!document.querySelector('[data-testid=todo-panel].todo-bar'));
    if (has) { out.opened = 'already-open(row' + i + ')'; break; }
    const clicked = await page.evaluate((idx) => {
      const rows = [...document.querySelectorAll('.au-srow')];
      const row = rows.filter(r => r.offsetParent !== null)[idx];
      if (!row) return null;
      const title = row.textContent.slice(0, 30);
      row.click();
      return title;
    }, i);
    if (clicked === null) break;
    await sleep(900);
    const has2 = await page.evaluate(() => !!document.querySelector('[data-testid=todo-panel].todo-bar'));
    if (has2) { out.opened = 'row' + i + ':' + clicked; break; }
  }

  // ── 2. 深色态测量 ──
  out.dark = await page.evaluate(() => {
    const r = {};
    const bars = document.querySelectorAll('[data-testid=todo-panel]');
    r.todoPanelCount = bars.length;
    const bar = document.querySelector('.todo-bar');
    if (bar) {
      const bs = getComputedStyle(bar);
      r.todoBarBg = bs.backgroundColor; r.todoBarRadius = bs.borderRadius;
      const rect = bar.getBoundingClientRect();
      r.todoBarRect = { w: +rect.width.toFixed(1), h: +rect.height.toFixed(1) };
      r.todoLabels = [...bar.querySelectorAll('.todo-label')].map(e => e.textContent.trim());
      const fill = bar.querySelector('.goal-fill');
      r.goalFillW = fill ? fill.style.width : null;
      r.goalFillBg = fill ? getComputedStyle(fill).backgroundImage.slice(0, 60) : null;
      const its = [...bar.querySelectorAll('.todo-it')];
      r.todoIts = its.length;
      r.doneIts = its.filter(e => e.classList.contains('done')).length;
      r.nowIts = its.filter(e => e.classList.contains('now')).length;
      r.todoOverflow = bar.scrollWidth > bar.clientWidth + 1;
    }
    // 卡上卡下:todo-bar 应在输入卡上方
    const card = document.querySelector('[data-composer-card]');
    if (bar && card) r.dockAboveCard = bar.getBoundingClientRect().bottom <= card.getBoundingClientRect().top + 1;
    if (card) {
      r.cardOverflow = card.scrollWidth > card.clientWidth + 1;
      const ta = card.querySelector('.uV2eYG_input'), mi = card.querySelector('.uV2eYG_mirror');
      r.taFont = ta ? getComputedStyle(ta).fontSize + '/' + getComputedStyle(ta).lineHeight : null;
      r.mirrorFont = mi ? getComputedStyle(mi).fontSize : null;
      const send = card.querySelector('.uV2eYG_primary');
      if (send) {
        const ss = getComputedStyle(send);
        r.sendBg = ss.backgroundImage.slice(0, 70); r.sendRadius = ss.borderRadius;
        r.sendDisabled = send.disabled; r.sendOpacity = ss.opacity;
      }
      const add = card.querySelector('.uV2eYG_add');
      r.addRadius = add ? getComputedStyle(add).borderRadius : null;
    }
    // ctx-ring
    const cm = document.querySelector('.JObwrW_root');
    r.ctxMeter = cm ? 'present' : 'absent(no pressure data)';
    if (cm) {
      r.ctxFill = getComputedStyle(cm.querySelector('.JObwrW_fill') || cm).stroke;
      r.ctxTriggerW = getComputedStyle(cm.querySelector('.JObwrW_trigger')).width;
    }
    // c-stats
    const st = document.querySelector('.FJxK0a_root');
    if (st) { const s = getComputedStyle(st); r.statsFont = s.fontSize + ' ' + s.fontFamily.slice(0, 24); }
    return r;
  });

  // ── 3. 浅色态复核(send ink / todo-bar 面)──
  const toggled = await page.evaluate(() => {
    const btn = document.querySelector('.aurum-footRow');
    if (!btn) return false;
    btn.click();
    return true;
  });
  if (toggled) {
    await sleep(700);
    out.light = await page.evaluate(() => {
      const r = {};
      const bar = document.querySelector('.todo-bar');
      if (bar) r.todoBarBg = getComputedStyle(bar).backgroundColor;
      const send = document.querySelector('[data-composer-card] .uV2eYG_primary');
      if (send) r.sendInk = getComputedStyle(send).color;
      const ta = document.querySelector('.uV2eYG_input');
      if (ta) r.taFont = getComputedStyle(ta).fontSize;
      return r;
    });
    await page.evaluate(() => document.querySelector('.aurum-footRow')?.click());
    await sleep(500);
  }
  return JSON.stringify(out, null, 1);
}
