// 修订门禁:① 字标宽度恒定(不随卡窄缩小);② header 行2 = tabs 左 · utilities 右
async page => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  await sleep(1500);
  // 先开一个会话(header 出现 tabs + utilities)
  for (let i = 0; i < 8; i++) {
    if (await page.evaluate(() => document.querySelectorAll('.wSkVaW_tab').length > 0)) break;
    await page.evaluate((idx) => {
      const rows = [...document.querySelectorAll('.au-srow')].filter(r => r.offsetParent !== null);
      if (rows[idx]) rows[idx].click();
    }, i);
    await sleep(800);
  }
  const out = {};
  // ① header 布局
  out.header = await page.evaluate(() => {
    const r = {};
    const tabs = document.querySelector('.wSkVaW_tabs');
    const utils = document.querySelector('.wSkVaW_headerUtilities');
    const actions = document.querySelector('.wSkVaW_headerActions');
    const crumbs = document.querySelector('.wSkVaW_titleCluster');
    if (tabs && utils && utils.children.length) {
      const t = tabs.getBoundingClientRect(), u = utils.getBoundingClientRect();
      r.sameRow = Math.abs((t.top + t.height / 2) - (u.top + u.height / 2)) < 8;
      r.tabsLeftOfUtils = t.right <= u.left + 1;
      r.gap = +(u.left - t.right).toFixed(1);
    } else r.utilitiesEmpty = true;
    if (tabs) { const tr = tabs.getBoundingClientRect(); r.tabsRect = { x: Math.round(tr.x), w: Math.round(tr.width) }; }
    if (crumbs && tabs) { const c = crumbs.getBoundingClientRect(); r.crumbsAboveTabs = c.bottom <= tabs.top + 4; }
    if (actions && actions.children.length) { const a = actions.getBoundingClientRect(); r.actionsRow1 = a.bottom < (tabs ? tabs.top : 1e9); }
    return r;
  });
  // ② 字标宽度恒定(先记原始列定义,结束还原而非清空 —— 清空会抹掉 React inline)
  const origCols = await page.evaluate(() => document.querySelector('[data-slot=root]>div').style.gridTemplateColumns || null);
  const widths = [];
  for (const w of [280, 240, 210, 190]) {
    await page.evaluate((w) => {
      const g = document.querySelector('[data-slot=root]>div');
      g.style.gridTemplateColumns = w + 'px minmax(0px,1fr) 0px';
    }, w);
    await sleep(300);
    widths.push(await page.evaluate(() => {
      const nameSvg = document.querySelector('.hHd-Xa_brandName svg');
      const name = document.querySelector('.hHd-Xa_brandName');
      const mark = document.querySelector('.hHd-Xa_brandMark svg');
      return {
        nameSvgW: nameSvg ? +nameSvg.getBoundingClientRect().width.toFixed(1) : null,
        nameDisplay: name ? getComputedStyle(name).display : null,
        markW: mark ? +mark.getBoundingClientRect().width.toFixed(1) : null
      };
    }));
  }
  out.brandAcrossWidths = widths;
  await page.evaluate((c) => { document.querySelector('[data-slot=root]>div').style.gridTemplateColumns = c; }, origCols === null ? '' : origCols);
  await sleep(300);
  // 回归:侧栏卡几何无损
  out.sideCard = await page.evaluate(() => {
    const sb = document.querySelector('[data-slot=sidebar]>div:first-child');
    const r = sb.getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
  });
  return JSON.stringify(out, null, 1);
}
