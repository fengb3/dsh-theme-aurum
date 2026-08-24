// P15 追补 III 门禁:① ◈=工具卡壳(可点展开);② reasoning=同款卡壳;③ 运行态三点 bob
async page => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  await sleep(1800);
  const out = {};

  // 开 Umm 会话(有 3 条 context + reasoning)
  await page.evaluate(() => {
    const rows = [...document.querySelectorAll('.au-srow')].filter(r => r.offsetParent !== null);
    if (rows[1]) rows[1].click();
  });
  await sleep(1200);

  // ① 上下文卡
  out.ctxCards = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('.au-ctx-card')];
    if (!cards.length) return 'none';
    const c = cards[0];
    const x = c.querySelector('.au-x');
    return {
      count: cards.length,
      firstCard: { radius: getComputedStyle(c).borderRadius, hasIcon: !!c.querySelector('.au-ico svg'), nameText: c.querySelector('.au-name') ? c.querySelector('.au-name').childNodes[0].textContent : null, emText: c.querySelector('.au-name em') ? c.querySelector('.au-name em').textContent.slice(0, 26) : null },
      collapsedRowsH: Math.round(c.querySelector('.au-clip').getBoundingClientRect().height)
    };
  });
  // 点击展开
  if (out.ctxCards !== 'none') {
    await page.evaluate(() => document.querySelector('.au-ctx-card .au-main').click());
    await sleep(650);
    out.ctxExpanded = await page.evaluate(() => {
      const c = document.querySelector('.au-ctx-card');
      return { open: c.classList.contains('au-open'), clipH: Math.round(c.querySelector('.au-clip').getBoundingClientRect().height), chevRot: getComputedStyle(c.querySelector('.au-chev')).transform };
    });
    await page.evaluate(() => document.querySelector('.au-ctx-card .au-main').click());
    await sleep(400);
  }

  // ② reasoning 卡壳
  out.reasoning = await page.evaluate(() => {
    const r = document.querySelector('.QWLzlG_root');
    if (!r) return 'none';
    const row = r.querySelector('.QWLzlG_row');
    const chev = r.querySelector('.QWLzlG_chevron');
    return {
      radius: getComputedStyle(r).borderRadius,
      rowPad: getComputedStyle(row).padding,
      rowCursor: getComputedStyle(row).cursor,
      chevRot: chev ? getComputedStyle(chev).transform : null,
      titleFont: getComputedStyle(r.querySelector('.QWLzlG_title')).fontSize,
      sepDisplay: getComputedStyle(r.querySelector('.QWLzlG_separator') || r).display
    };
  });

  // ③ 触发一轮运行 → 三点
  await page.evaluate(() => {
    const ta = document.querySelector('.uV2eYG_input');
    const btn = document.querySelector('button[class*=newSession]');
    if (btn) btn.click();
  });
  await sleep(900);
  await page.fill('.uV2eYG_input', '用一句话回复:好');
  await sleep(200);
  await page.keyboard.press('Enter');
  await sleep(2500);
  out.dots = await page.evaluate(() => {
    const el = document.querySelector('.Md3f7G_turnStatus');
    if (!el) return 'not-running-now';
    const cs = getComputedStyle(el);
    return {
      w: cs.width, h: cs.height, radius: cs.borderRadius,
      anim: cs.animationName + ' ' + cs.animationDuration,
      bg: cs.backgroundColor,
      textHidden: cs.fontSize === '0px',
      clockDisplay: (() => { const c = el.querySelector('.Md3f7G_turnStatusClock'); return c ? getComputedStyle(c).display : 'no-clock-el'; })(),
      beforeDelay: getComputedStyle(el, '::before').animationDelay,
      afterDelay: getComputedStyle(el, '::after').animationDelay,
      rect: (() => { const r = el.getBoundingClientRect(); return Math.round(r.width) + 'x' + Math.round(r.height) + '@' + Math.round(r.x) + ',' + Math.round(r.y); })()
    };
  });
  await sleep(9000); // 等回合结束再截图(三点期间也可截,先等门禁数据)
  return JSON.stringify(out, null, 1);
}
