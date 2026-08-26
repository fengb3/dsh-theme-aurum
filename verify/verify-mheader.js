// 门禁:390 下 header 上下两行(标题行在上、tabs+按钮行在下),无重叠溢出
async page => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  await sleep(1800);
  await page.setViewportSize({ width: 390, height: 844 });
  await sleep(900);
  // 窄屏:先开抽屉,在里面选会话
  await page.evaluate(() => document.querySelector('.rail-logo')?.click());
  await sleep(600);
  await page.evaluate(() => {
    const rows = [...document.querySelectorAll('.au-srow')];
    const t = rows.find(r => /What We Left|帮我把 GLM/i.test(r.textContent)) || rows[1];
    if (t) t.click();
  });
  await sleep(1400);
  const out = await page.evaluate(() => {
    const h = document.querySelector('.wSkVaW_header');
    const crumbs = document.querySelector('.wSkVaW_titleCluster');
    const tabs = document.querySelector('.wSkVaW_tabs');
    const utils = document.querySelector('.wSkVaW_headerUtilities');
    const r = { headerH: Math.round(h.getBoundingClientRect().height), dir: getComputedStyle(h).flexDirection };
    const cr = crumbs ? crumbs.getBoundingClientRect() : null;
    const tr = tabs ? tabs.getBoundingClientRect() : null;
    const ur = utils && utils.children.length ? utils.getBoundingClientRect() : null;
    if (cr) { r.titleRow = { y: Math.round(cr.y), h: Math.round(cr.height) }; r.titleVisible = cr.width > 40; }
    if (tr) r.tabsRow = { y: Math.round(tr.y), h: Math.round(tr.height), w: Math.round(tr.width) };
    if (ur) r.utilsRow = { y: Math.round(ur.y), h: Math.round(ur.height) };
    r.titleAboveTabs = !!(cr && tr && cr.bottom <= tr.top + 2);
    r.tabsLeftOfUtils = !!(tr && ur && tr.right <= ur.left + 1);
    // 标题完整可见:crumb 没被裁(溢出隐藏下 scrollWidth 对比)
    if (crumbs) r.titleOverflow = crumbs.scrollWidth > crumbs.clientWidth + 2;
    // header 内子元素是否越出 header
    const hb = h.getBoundingClientRect();
    r.overflowsHeader = [...h.children].filter(c => { const b = c.getBoundingClientRect(); return b.right > hb.right + 1 || b.bottom > hb.bottom + 1; }).length;
    // 滚动让位是否同步(两行更高,scroll padding 应≥header 高)
    const sc = document.querySelector('.Md3f7G_scroll');
    r.scrollPadTop = sc ? getComputedStyle(sc).paddingTop : null;
    r.hScroll = document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
    return r;
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  return JSON.stringify(out, null, 1);
}
