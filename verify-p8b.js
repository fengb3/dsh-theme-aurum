async page => {
  return await page.evaluate(() => {
    const sb = document.querySelector('[data-slot=sidebar]');
    const btn = sb.querySelector('.hHd-Xa_newSession');
    const lab = sb.querySelector('.hHd-Xa_newSessionLabel');
    let plusCount = 0; const plusOn = [];
    sb.querySelectorAll('*').forEach(el => {
      const c = getComputedStyle(el, '::before').content;
      if (c && c.includes('+')) { plusCount++; plusOn.push(el.className || el.tagName); }
    });
    const btnCs = getComputedStyle(btn);
    const foot = sb.querySelector('.hHd-Xa_footArea');
    const comp = document.querySelector('[data-composer-card]');
    const r = btn.getBoundingClientRect(); const labR = lab.getBoundingClientRect();
    // border sweep audit: any element in sidebar with a visible (non-transparent) border?
    const visibleBorders = [];
    sb.querySelectorAll('*').forEach(el => {
      const cs = getComputedStyle(el);
      for (const s of ['Top', 'Right', 'Bottom', 'Left']) {
        const w = parseFloat(cs['border' + s + 'Width']); const c = cs['border' + s + 'Color'];
        if (w > 0 && c !== 'rgba(0, 0, 0, 0)' && !/transparent/i.test(c)) {
          visibleBorders.push((el.className || el.tagName).toString().slice(0, 40) + ':' + s + ':' + c); break;
        }
      }
    });
    if (comp) {
      const cs = getComputedStyle(comp);
      if (parseFloat(cs.borderTopWidth) > 0 && cs.borderTopColor !== 'rgba(0, 0, 0, 0)' && !/transparent/i.test(cs.borderTopColor)) visibleBorders.push('composer:' + cs.borderTopColor);
    }
    return { plusCount, plusOn, btnBefore: getComputedStyle(btn, '::before').content, labelBefore: getComputedStyle(lab, '::before').content, btnBorder: btnCs.borderTopWidth + ' ' + btnCs.borderTopColor, labelColor: getComputedStyle(lab).color, btnRect: { x: +r.x.toFixed(1), w: +r.width.toFixed(1) }, labelRect: { x: +labR.x.toFixed(1), w: +labR.width.toFixed(1) }, footBorder: getComputedStyle(foot).borderTopColor + ' ' + getComputedStyle(foot).borderTopWidth, composerBorder: comp ? getComputedStyle(comp).borderTopColor + ' ' + getComputedStyle(comp).borderTopWidth : 'n/a', visibleBorders };
  });
}
