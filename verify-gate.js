async page => {
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
  const collapsedPlus = await page.evaluate(() => {
    const b = document.querySelector('[data-slot=sidebar] .hHd-Xa_newSession');
    const pr = b.getBoundingClientRect();
    const pb = getComputedStyle(b, '::before');
    return { btn: { x: +pr.x.toFixed(1), w: +pr.width.toFixed(1) }, before: pb.content + ' left:' + pb.left + ' transform:' + pb.transform };
  });
  await page.click('[data-slot=sidebar] .hHd-Xa_toggle');
  await page.waitForTimeout(700);
  return { expanded, collapsed, collapsedPlus };
}
