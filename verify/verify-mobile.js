// P15 追补 V 门禁:移动端顶栏 + 抽屉
async page => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  await sleep(1800);
  await page.setViewportSize({ width: 390, height: 844 });
  await sleep(1000);
  const out = {};
  // 1) 布局:grid 两行,侧栏列=顶栏 48px 满宽
  out.layout = await page.evaluate(() => {
    const grid = document.querySelector('[data-slot=root]>div');
    const col1 = grid.children[0], col2 = grid.children[1];
    const g = getComputedStyle(grid);
    return {
      cols: g.gridTemplateColumns, rows: g.gridTemplateRows,
      col1: { x: Math.round(col1.getBoundingClientRect().x), y: Math.round(col1.getBoundingClientRect().y), w: Math.round(col1.getBoundingClientRect().width), h: Math.round(col1.getBoundingClientRect().height) },
      col2y: Math.round(col2.getBoundingClientRect().y),
      hScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    };
  });
  // 2) rail 横排
  out.rail = await page.evaluate(() => {
    const rail = document.querySelector('.au-ws-rail');
    if (!rail) return 'no-rail';
    const cs = getComputedStyle(rail);
    const btns = [...rail.querySelectorAll('.rail-btn,.rail-logo')].map(b => { const r = b.getBoundingClientRect(); return Math.round(r.x) + ',' + Math.round(r.y); });
    return { dir: cs.flexDirection, btnCount: btns.length, sameRow: new Set(btns.map(p => p.split(',')[1])).size === 1, btns: btns.slice(0, 3) };
  });
  // 3) 点 rail-logo → 抽屉
  await page.evaluate(() => document.querySelector('.rail-logo')?.click());
  await sleep(600);
  out.drawer = await page.evaluate(() => {
    const d = document.querySelector('.au-drawer'), sc = document.querySelector('.au-drawer-scrim');
    if (!d) return 'no-drawer';
    const r = d.getBoundingClientRect();
    return {
      present: true, scrim: !!sc,
      rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
      hasWide: !!d.querySelector('.au-ws.au-ws-wide'),
      rowCount: d.querySelectorAll('.au-srow').length,
      groupCount: d.querySelectorAll('.au-wsg').length,
      z: getComputedStyle(d).zIndex
    };
  });
  // 4) 选中会话 → 自动关闭
  if (out.drawer !== 'no-drawer') {
    await page.evaluate(() => document.querySelector('.au-drawer .au-srow')?.click());
    await sleep(700);
    out.closeOnSelect = await page.evaluate(() => !document.querySelector('.au-drawer'));
    // 5) 重开 → Esc 关闭
    await page.evaluate(() => document.querySelector('.rail-logo')?.click());
    await sleep(400);
    await page.keyboard.press('Escape');
    await sleep(300);
    out.closeOnEsc = await page.evaluate(() => !document.querySelector('.au-drawer'));
    // 6) 重开 → 遮罩点击关闭
    await page.evaluate(() => document.querySelector('.rail-logo')?.click());
    await sleep(400);
    await page.evaluate(() => document.querySelector('.au-drawer-scrim')?.click());
    await sleep(300);
    out.closeOnScrim = await page.evaluate(() => !document.querySelector('.au-drawer'));
  }
  // 7) 桌面回归:恢复宽视口后常规布局
  await page.setViewportSize({ width: 1440, height: 900 });
  await sleep(1000);
  out.desktop = await page.evaluate(() => {
    const grid = document.querySelector('[data-slot=root]>div');
    return { cols: getComputedStyle(grid).gridTemplateColumns.split(' ').map(Math.round), drawerGone: !document.querySelector('.au-drawer') };
  });
  return JSON.stringify(out, null, 1);
}
