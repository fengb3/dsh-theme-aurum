/* P25 验证:图标瓦片/箭头 svg 在 strut 恶化环境下(line-height:2.4 注入)仍居中。 */
async page => {
  await __au.openToolSession(page);
  await page.evaluate(() => {
    document.querySelectorAll('.au-tool:not(.au-open) .au-main').forEach(m => m.click());
  });
  await page.waitForTimeout(500);

  const measure = async label => await page.evaluate(label2 => {
    const probe = (sel, wrapSel) => {
      const el = document.querySelector(sel);
      if (!el) return { sel, missing: true };
      const wrap = wrapSel ? el.closest(wrapSel) : el.parentElement;
      if (!wrap) return { sel, noWrap: true };
      const r = wrap.getBoundingClientRect();
      const vr = el.getBoundingClientRect();
      return { sel, wrapH: +r.height.toFixed(1), topGap: +(vr.y - r.y).toFixed(2), bottomGap: +(r.y + r.height - vr.y - vr.height).toFixed(2), centered: Math.abs((vr.y - r.y) - (r.y + r.height - vr.y - vr.height)) < 0.6 };
    };
    return {
      label: label2,
      ico: probe('.au-tool .au-ico svg', '.au-ico'),
      chev: probe('.au-tool .au-chev svg', '.au-chev')
    };
  }, label);

  const normal = await measure('normal');
  /* 恶化:全局大行高(strut 模拟 Mac 字体度量) */
  await page.evaluate(() => {
    const s = document.createElement('style');
    s.id = '__diag_lh_all';
    s.textContent = '.au-ico,.au-chev,.reasoning-head .chev{line-height:2.4}';
    document.head.appendChild(s);
  });
  await page.waitForTimeout(200);
  const stressed = await measure('strut(line-height:2.4)');
  await page.evaluate(() => { const s = document.getElementById('__diag_lh_all'); if (s) s.remove(); });

  const failures = [normal, stressed].flatMap(m => [m.ico, m.chev]).filter(r => r.missing || r.noWrap || !r.centered).length;
  return { failures, normal, stressed };
}
