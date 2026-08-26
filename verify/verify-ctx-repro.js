/* 一次性复现:上下文注入卡展开后无内容 —— 检查 .au-in 计算样式 */
async page => {
  /* 长会话虚拟滚动:先把所有大滚动容器滚到顶,让头部节点挂载 */
  await page.evaluate(() => {
    document.querySelectorAll('*').forEach(el => {
      if (el.scrollHeight > el.clientHeight + 100 && el.clientHeight > 200) el.scrollTop = 0;
    });
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(900);
  let cards = page.locator('.au-ctx-card');
  let n = await cards.count();
  /* 主区空会话时:在侧栏找标题含「上下文注入」的会话行点进去 */
  if (!n) {
    const target = page.locator('.au-s-title', { hasText: '上下文注入' }).first();
    if (await target.count()) {
      await target.click();
      await page.waitForTimeout(1600);
      await page.evaluate(() => {
        document.querySelectorAll('*').forEach(el => {
          if (el.scrollHeight > el.clientHeight + 100 && el.clientHeight > 200) el.scrollTop = 0;
        });
      });
      await page.waitForTimeout(900);
      cards = page.locator('.au-ctx-card');
      n = await cards.count();
    }
  }
  if (!n) return { cards: 0, note: '页面上没有 au-ctx-card(需要含上下文注入节点的会话)' };
  const card = cards.first();
  const snap = () => card.evaluate(el => {
    const x = el.querySelector('.au-x');
    const inEl = el.querySelector('.au-in');
    const full = el.querySelector('.au-ctx-full');
    if (!x || !inEl) return { missing: { x: !x, inEl: !inEl } };
    const cs = getComputedStyle(inEl);
    return {
      cardClass: el.className,
      xRows: getComputedStyle(x).gridTemplateRows,
      xHeight: Math.round(x.getBoundingClientRect().height * 10) / 10,
      inOpacity: cs.opacity,
      inTransform: cs.transform,
      fullLen: full ? full.textContent.length : 0,
      fullTextHead: full ? full.textContent.slice(0, 30) : null,
    };
  });
  const before = await snap();
  await card.locator('.au-main').click();
  await page.waitForTimeout(750); // 等 grid + opacity 过渡结束
  const after = await snap();
  // 顺便对照:工具卡展开态 .au-in 的样式(工作参考)
  const toolOpen = await page.evaluate(() => {
    const el = document.querySelector('.au-tool.au-open .au-in');
    return el ? { opacity: getComputedStyle(el).opacity, transform: getComputedStyle(el).transform } : null;
  });
  return { cards: n, before, after, toolOpenRef: toolOpen };
}
