/* 浅色近似目检:临时移除 data-ds-dark-theme(token 分叉点),确认 ctx 卡展开内容可见 */
async page => {
  const target = page.locator('.au-s-title', { hasText: '上下文注入' }).first();
  if (!await target.count()) return { note: '未找到目标会话' };
  await target.click();
  await page.waitForTimeout(1600);
  await page.evaluate(() => {
    document.querySelectorAll('*').forEach(el => {
      if (el.scrollHeight > el.clientHeight + 100 && el.clientHeight > 200) el.scrollTop = 0;
    });
    document.body.removeAttribute('data-ds-dark-theme'); // 近似浅色:token 全部走 :not([data-ds-dark-theme]) 分支
  });
  await page.waitForTimeout(500);
  const card = page.locator('.au-ctx-card').first();
  await card.locator('.au-main').click();
  await page.waitForTimeout(750);
  const r = await card.evaluate(el => {
    const inEl = el.querySelector('.au-in');
    const full = el.querySelector('.au-ctx-full');
    const cs = getComputedStyle(inEl);
    const fcs = full ? getComputedStyle(full) : null;
    return {
      darkAttr: document.body.getAttribute('data-ds-dark-theme'),
      openClass: el.className,
      inOpacity: cs.opacity,
      fullColor: fcs ? fcs.color : null,
      fullBg: fcs ? fcs.backgroundColor : null,
      fullH: full ? Math.round(full.getBoundingClientRect().height) : 0,
      textHead: full ? full.textContent.slice(0, 20) : null,
    };
  });
  return r;
}
