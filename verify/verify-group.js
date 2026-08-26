// P15 前修订 IV 门禁:目录头图标交叉淡切 + 收合动画 + 行 stagger
async page => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const out = {};
  await sleep(1800);
  // hover 模拟:classList 加不了 :hover,用真实 mouse.move
  const head = await page.$('.au-wsg-head');
  out.foundHead = !!head;
  if (!head) return JSON.stringify(out);

  // ── 1. 非悬浮:文件夹显、三角隐 ──
  out.idle = await page.evaluate(() => {
    const ic = document.querySelector('.au-ws-ic');
    if (!ic) return null;
    const fld = ic.querySelector('.au-fld'), chev = ic.querySelector('.au-chev2');
    const r = {};
    if (fld) { const s = getComputedStyle(fld); r.fldOpacity = s.opacity; r.fldPos = s.position; }
    if (chev) { const s = getComputedStyle(chev); r.chevOpacity = s.opacity; }
    r.bothMounted = !!fld && !!chev;
    r.box = (() => { const b = ic.getBoundingClientRect(); return Math.round(b.width) + 'x' + Math.round(b.height); })();
    return r;
  });

  // ── 2. 悬浮:三角显、文件夹隐(交叉淡切)──
  await head.hover();
  await sleep(320);
  out.hover = await page.evaluate(() => {
    const ic = document.querySelector('.au-ws-ic');
    const fld = ic.querySelector('.au-fld'), chev = ic.querySelector('.au-chev2');
    const s1 = getComputedStyle(fld), s2 = getComputedStyle(chev);
    return { fldOpacity: s1.opacity, chevOpacity: s2.opacity, chevTransform: s2.transform, fldTransform: s1.transform };
  });

  // ── 3. 收合动画:点第一个组头收起 ──
  const firstHead = await page.$('.au-wsg-head');
  await firstHead.click();
  await sleep(80); // 过渡中抽查
  out.midTransition = await page.evaluate(() => {
    const slist = document.querySelector('.au-slist');
    return getComputedStyle(slist).gridTemplateRows;
  });
  await sleep(600); // 终态
  out.closedState = await page.evaluate(() => {
    const g = document.querySelector('.au-wsg');
    const slist = g.querySelector('.au-slist');
    const inEl = g.querySelector('.au-slist-in');
    const row = g.querySelector('.au-srow');
    return {
      cls: g.className,
      rows: getComputedStyle(slist).gridTemplateRows,
      slistH: Math.round(slist.getBoundingClientRect().height),
      inOpacity: getComputedStyle(inEl).opacity,
      inVisibility: getComputedStyle(inEl).visibility,
      rowAnim: row ? getComputedStyle(row).animationName : null,
      rowVisible: row ? row.getBoundingClientRect().height : null
    };
  });

  // ── 4. 重新展开:行 stagger 重播(animation-name 切换)──
  await page.evaluate(() => document.querySelector('.au-wsg-head').click());
  await sleep(60);
  out.reopening = await page.evaluate(() => {
    const row = document.querySelector('.au-wsg .au-srow');
    const cs = row ? getComputedStyle(row) : null;
    return cs ? { animName: cs.animationName, delay: cs.animationDelay, rows: getComputedStyle(document.querySelector('.au-slist')).gridTemplateRows } : null;
  });
  await sleep(700);
  out.reopened = await page.evaluate(() => {
    const slist = document.querySelector('.au-slist');
    const row = document.querySelector('.au-wsg .au-srow');
    return { rows: getComputedStyle(slist).gridTemplateRows, slistH: Math.round(slist.getBoundingClientRect().height), rowH: row ? Math.round(row.getBoundingClientRect().height) : 0 };
  });

  // 行点击仍可用(功能回归)
  const clickOk = await page.evaluate(() => {
    const row = document.querySelector('.au-wsg .au-srow');
    if (!row) return false;
    row.click();
    return true;
  });
  out.rowClickable = clickOk;
  await sleep(500);
  return JSON.stringify(out, null, 1);
}
