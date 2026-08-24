// 品牌子树终检:鲸鱼贴左、字标紧随、无空隙;窄档行为
async page => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  await sleep(1800);
  const measure = () => page.evaluate(() => {
    const btn = document.querySelector('.hHd-Xa_brand');
    const mark = document.querySelector('.hHd-Xa_brandMark');
    const name = document.querySelector('.hHd-Xa_brandName');
    const svg = document.querySelector('.hHd-Xa_brandName svg');
    if (!btn || !mark || !name) return 'missing';
    const box = (el) => { const r = el.getBoundingClientRect(); return { x: +r.x.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; };
    const b = box(btn), m = box(mark), n = box(name);
    const s = svg ? box(svg) : null;
    return {
      btn: b, mark: m, name: n, svg: s,
      whaleNearLeft: +(m.x - b.x).toFixed(1),
      gapMarkToName: +(n.x - (m.x + m.w)).toFixed(1),
      svgFollowsName: s ? +(s.x - n.x).toFixed(1) : null,
      svgW: s ? s.w : null,
      markFlex: getComputedStyle(mark).flex,
      nameFlex: getComputedStyle(name).flex,
      nameH: n.h
    };
  });
  const out = { wide: await measure() };
  // 窄档:240px 列(卡 ~224 < 236 → 字标应隐藏)
  const orig = await page.evaluate(() => document.querySelector('[data-slot=root]>div').style.gridTemplateColumns || null);
  await page.evaluate(() => { document.querySelector('[data-slot=root]>div').style.gridTemplateColumns = '240px minmax(0px,1fr) 0px'; });
  await sleep(400);
  out.narrow240 = await page.evaluate(() => {
    const name = document.querySelector('.hHd-Xa_brandName');
    const mark = document.querySelector('.hHd-Xa_brandMark');
    return { nameDisplay: name ? getComputedStyle(name).display : null, markVisible: mark ? mark.getBoundingClientRect().width > 0 : false };
  });
  // 中间档:260(卡 ~244 > 236 → 字标可见,svg 裁尾)
  await page.evaluate(() => { document.querySelector('[data-slot=root]>div').style.gridTemplateColumns = '260px minmax(0px,1fr) 0px'; });
  await sleep(400);
  out.mid260 = await measure();
  await page.evaluate((c) => { document.querySelector('[data-slot=root]>div').style.gridTemplateColumns = c; }, orig === null ? '' : orig);
  return JSON.stringify(out, null, 1);
}
