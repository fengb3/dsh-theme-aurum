/* verify-topfade.js — 门禁:顶部渐隐带(修订 XV 加倍 → XVI 回调一档)。
   断言 scrollBody mask 透明→#000 终点 = 110px(窄屏 ≤820 档 160px),
   让位 padding-top = 126px / 190px;滚到顶首内容 y ≥ 渐隐终点(初始态完整可见)。
   深浅双主题 + 宽/窄视口四象限同测。 */
async page => {
  const failures = [];
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  /* 打开有内容的会话(scrollBody 进入 [data-phase=active] 会话态) */
  for (let i = 0; i < 8; i++) {
    const ok = await page.evaluate(() => {
      const sb = document.querySelector('.wSkVaW_scrollBody');
      return !!sb && document.querySelectorAll('[data-chat-flow-kind]').length > 0;
    });
    if (ok) break;
    await page.evaluate(idx => {
      const rows = [...document.querySelectorAll('button.au-srow')];
      if (rows[idx]) rows[idx].click();
    }, i);
    await sleep(800);
  }

  const probe = () => page.evaluate(() => {
    const sb = document.querySelector('.wSkVaW_scrollBody');
    if (!sb) return { error: 'no scrollBody' };
    const cs = getComputedStyle(sb);
    /* mask-image 计算值形如 linear-gradient(180deg, transparent 0px, rgb(0, 0, 0) 140px) */
    const m = String(cs.maskImage || cs.webkitMaskImage || '').match(/#\d+px|\brgb\([^)]+\)\s+(\d+)px/);
    const fadeEnd = m ? +(m[1] ?? m[0].match(/(\d+)px/)[1]) : null;
    const pad = parseFloat(cs.paddingTop);
    /* 滚到顶,量首条消息 y(应在渐隐带下方完整可见) */
    sb.style.scrollBehavior = 'auto'; sb.scrollTop = 0;
    const first = sb.querySelector('[data-chat-flow-kind]');
    return {
      fadeEnd, pad,
      firstY: first ? Math.round(first.getBoundingClientRect().y) : null
    };
  });

  const quad = async (label, vw) => {
    await page.setViewportSize({ width: vw, height: 900 });
    await sleep(600);
    const dark = await probe();
    await page.evaluate(() => { document.body.removeAttribute('data-ds-dark-theme'); });
    await sleep(300);
    const light = await probe();
    await page.evaluate(() => { document.body.setAttribute('data-ds-dark-theme', ''); });
    await sleep(300);
    return { label, dark, light };
  };

  const wide = await quad('wide(1440)', 1440);
  const narrow = await quad('narrow(700)', 700);
  await page.setViewportSize({ width: 1440, height: 900 });

  for (const q of [wide, narrow]) {
    const exp = q.label.startsWith('wide') ? { fade: 110, pad: 126 } : { fade: 160, pad: 190 };
    for (const [mode, m] of [['dark', q.dark], ['light', q.light]]) {
      if (m.error) { failures.push(`${q.label}/${mode}: ${m.error}`); continue; }
      if (m.fadeEnd !== exp.fade) failures.push(`${q.label}/${mode}: mask 渐隐终点=${m.fadeEnd} ≠ ${exp.fade}px`);
      if (m.pad !== exp.pad) failures.push(`${q.label}/${mode}: padding-top=${m.pad} ≠ ${exp.pad}px`);
      if (m.firstY === null || m.firstY < exp.fade - 2) failures.push(`${q.label}/${mode}: 顶滚首内容 y=${m.firstY} < 渐隐终点 ${exp.fade}`);
    }
  }
  return { failures, wide, narrow };
}
