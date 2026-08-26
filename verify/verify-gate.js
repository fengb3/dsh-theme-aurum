async page => {
  /* 跑序稳定:前置脚本(如 p14)可能刚把视口从窄档还原 1440,布局/过渡未 settle,
     首拍立即测量会读到中间帧(实测 52px/radius 0 + 全树溢出假阳性)——先等一拍 */
  await page.waitForTimeout(800);
  const gate = async () => await page.evaluate(() => {
    const root = document.querySelector('[data-slot=sidebar]>div');
    const r = root.getBoundingClientRect();
    const overflows = [];
    const walk = el => { for (const c of el.children) { const cr = c.getBoundingClientRect(); if (cr.width > 0 && cr.height > 0 && (cr.right > r.right + 0.6 || cr.left < r.left - 0.6)) overflows.push((c.className || c.tagName).toString().slice(0, 30)); walk(c); } };
    walk(root);
    return { card: { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) }, radius: getComputedStyle(root).borderRadius, overflows };
  });
  const expanded = await gate();
  await page.click('[data-slot=sidebar] .hHd-Xa_toggle');
  await page.waitForTimeout(700);
  const collapsed = await gate();
  /* P8c:折叠态官方 newSession/logoRow 已隐藏,细条自建 rail(56px 卡、rail 钮 40 居中
     左右各 8);展开经 rail-logo(官方 toggle 钮随 logoRow 隐藏) */
  const rail = await page.evaluate(() => {
    const card = document.querySelector('[data-slot=sidebar]>div');
    const cr = card.getBoundingClientRect();
    const btn = document.querySelector('[data-slot=sidebar] .rail-new');
    const br = btn.getBoundingClientRect();
    const logo = document.querySelector('[data-slot=sidebar] .rail-logo');
    const lr = logo.getBoundingClientRect();
    const whale = logo.querySelector('.rl-whale');
    return {
      card: { x: +cr.x.toFixed(1), w: +cr.width.toFixed(1) },
      railNew: { x: +br.x.toFixed(1), w: +br.width.toFixed(1), leftPad: +(br.x - cr.x).toFixed(1) },
      railLogo: { x: +lr.x.toFixed(1), w: +lr.width.toFixed(1) },
      whaleOpacity: getComputedStyle(whale).opacity,
      whaleW: whale.getBoundingClientRect().width.toFixed(1)
    };
  });
  await page.click('[data-slot=sidebar] .rail-logo');
  await page.waitForTimeout(700);
  const reexpanded = await gate();
  return { expanded, collapsed, rail, reexpanded };
}
