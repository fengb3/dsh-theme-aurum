// P13 门禁:hero 空态换皮 + 通用菜单金色化 + 设置弹窗双栏换皮(双主题)
// node verify-run.mjs verify-p13.js --shot aurum-p13.png
async page => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const out = {};

  // ── 1. hero 空态(回到新会话:点侧栏「新会话」或新建钮)──
  await sleep(1500);
  await page.evaluate(() => {
    const btn = document.querySelector('button[class*=newSession]') || document.querySelector('.rail-new');
    if (btn) btn.click();
  });
  await sleep(900);
  out.hero = await page.evaluate(() => {
    const r = {};
    const stack = document.querySelector('[class*=composerHero]');
    r.heroActive = !!stack;
    const h1 = document.querySelector('.pXSMma_headline');
    if (h1) { const s = getComputedStyle(h1); r.h1Font = s.fontSize + ' ' + s.fontFamily.slice(0, 18); }
    const badge = document.querySelector('.pXSMma_previewBadge');
    if (badge) { const s = getComputedStyle(badge); r.badge = { font: s.fontSize + '/' + s.fontFamily.slice(0, 14), radius: s.borderRadius, color: s.color }; }
    const glow = document.querySelector('.wSkVaW_heroGlow');
    if (glow) { const s = getComputedStyle(glow); r.glow = { bg: s.backgroundImage.slice(0, 60), artHidden: ![...glow.querySelectorAll('*')].some(e => getComputedStyle(e).display !== 'none') }; }
    const ws = document.querySelector('.pXSMma_workspace');
    if (ws) { const s = getComputedStyle(ws); r.wsChip = { radius: s.borderRadius, pad: s.padding }; }
    return r;
  });

  // ── 2. 命令菜单(add 钮)──
  await page.evaluate(() => { const b = document.querySelector('.uV2eYG_add'); if (b) b.click(); });
  await sleep(600);
  out.cmdMenu = await page.evaluate(() => {
    const m = document.querySelector('._3e4SsG_menu');
    if (!m) return 'absent';
    const s = getComputedStyle(m);
    const it = m.querySelector('._3e4SsG_item');
    const its = it ? getComputedStyle(it) : null;
    return { radius: s.borderRadius, bg: s.backgroundColor, itemRadius: its ? its.borderRadius : null, itemCount: m.querySelectorAll('._3e4SsG_item').length };
  });
  await page.evaluate(() => { const b = document.querySelector('.uV2eYG_add'); if (b) b.click(); });
  await sleep(300);

  // ── 3. 设置弹窗 ──
  await page.evaluate(() => { const b = document.querySelector('.VOzbGW_trigger'); if (b) b.click(); });
  await sleep(900);
  out.settings = await page.evaluate(() => {
    const r = {};
    const panel = document.querySelector('.VOzbGW_panel');
    if (!panel) return 'absent';
    const ps = getComputedStyle(panel);
    r.panel = { w: Math.round(panel.getBoundingClientRect().width), radius: ps.borderRadius, bg: ps.backgroundColor };
    const nav = document.querySelector('.VOzbGW_nav');
    if (nav) { const ns = getComputedStyle(nav); r.nav = { w: Math.round(nav.getBoundingClientRect().width), bg: ns.backgroundColor }; }
    const cell = document.querySelector('.VOzbGW_navCell.VOzbGW_active') || document.querySelector('.VOzbGW_navCell');
    if (cell) { const cs = getComputedStyle(cell); r.navCell = { radius: cs.borderRadius, fontSize: cs.fontSize }; }
    r.navItems = [...document.querySelectorAll('.VOzbGW_navCell')].map(c => c.textContent.trim().slice(0, 10));
    r.aurumRow = !!document.querySelector('.aurum-row');
    return r;
  });
  await page.keyboard.press('Escape');
  await sleep(300);

  // ── 4. 浅色复核 ──
  await page.evaluate(() => document.querySelector('.aurum-footRow')?.click());
  await sleep(700);
  out.light = await page.evaluate(() => {
    const r = {};
    const h1 = document.querySelector('.pXSMma_headline');
    if (h1) r.h1Font = getComputedStyle(h1).fontSize;
    return r;
  });
  await page.evaluate(() => document.querySelector('.aurum-footRow')?.click());
  await sleep(400);
  return JSON.stringify(out, null, 1);
}
