/* 浅色近似目检:临时移除 data-ds-dark-theme,确认 .au-s-more 在浅色 token 分支下样式正常 */
async page => {
  await page.waitForTimeout(600);
  const info = await page.evaluate(() => {
    document.body.removeAttribute('data-ds-dark-theme');
    const btn = document.querySelector('[data-slot=sidebar] .au-s-more');
    if (!btn) return { found: false };
    const cs = getComputedStyle(btn);
    const r = btn.getBoundingClientRect();
    return {
      found: true, text: btn.textContent,
      color: cs.color, bg: cs.backgroundColor, radius: cs.borderRadius,
      font: cs.fontSize + ' / ' + cs.fontFamily,
      rect: { w: +r.width.toFixed(1), h: +r.height.toFixed(1) }
    };
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshots/aurum-sbmore-light.png' });
  return info;
}
