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

  // ② reasoning 卡壳(P16:AuThinkCard 原型 .reasoning 类,遮蔽官方 QWLzlG)
  out.reasoning = await page.evaluate(() => {
    const r = document.querySelector('[data-chat-flow-kind=assistant-step] .reasoning');
    if (!r) return 'none';
    const head = r.querySelector('.reasoning-head');
    const chev = r.querySelector('.chev');
    return {
      radius: getComputedStyle(r).borderRadius,
      headPad: getComputedStyle(head).padding,
      headCursor: getComputedStyle(head).cursor,
      headIsButton: head.tagName === 'BUTTON',
      chevTransition: chev ? getComputedStyle(chev).transition : null,
      titleFont: getComputedStyle(r.querySelector('.r-title')).fontSize,
      bodyDisplay: getComputedStyle(r.querySelector('.reasoning-body')).display, bodyRows: getComputedStyle(r.querySelector('.reasoning-body')).gridTemplateRows, // P18:grid 收合机构
      officialGone: !document.querySelector('.QWLzlG_root')
    };
  });

  // ②½ P16 修订 IX:流卡片统一模糊透明入场 + 紧凑间距
  out.flowTight = await page.evaluate(() => {
    const col = document.querySelector('.Md3f7G_column');
    const item = document.querySelector('[data-chat-anchor-key]');
    if (!col || !item) return 'no-flow';
    const cs = getComputedStyle(item);
    // 相邻 flowItem 实际垂直缝(gap + margin-bottom)
    const items = [...col.querySelectorAll(':scope > [data-chat-anchor-key]')];
    let gapPx = null;
    for (let i = 1; i < items.length; i++) {
      const a = items[i - 1].getBoundingClientRect();
      const b = items[i].getBoundingClientRect();
      const g = Math.round(b.top - a.bottom);
      if (gapPx === null || g < gapPx) gapPx = g; // 取最小缝(排除展开态撑开)
    }
    return {
      entranceAnim: cs.animationName + ' ' + cs.animationDuration + ' ' + cs.animationFillMode, // 应 aurum-rise 1.2s backwards
      colGap: getComputedStyle(col).gap,        // 应 4px
      itemMarginBottom: cs.marginBottom,        // 应 4px
      minItemSeamPx: gapPx                      // 相邻卡实际缝,应 ≤ 8px
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
