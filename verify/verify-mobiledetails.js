// 门禁:≤820 详情列隐藏(rows 恰两轨)+ 桌面详情列 0px 不回归
async page => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  await sleep(1800);
  await page.setViewportSize({ width: 390, height: 844 });
  await sleep(900);
  const mobile = await page.evaluate(() => {
    const grid = document.querySelector('[data-slot=root]>div');
    const col3 = grid.children[2];
    return {
      rows: getComputedStyle(grid).gridTemplateRows,
      trackCount: getComputedStyle(grid).gridTemplateRows.split(' ').length,
      col3Display: col3 ? getComputedStyle(col3).display : 'absent',
      col3H: col3 ? Math.round(col3.getBoundingClientRect().height) : null,
      hScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    };
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await sleep(900);
  const desktop = await page.evaluate(() => {
    const grid = document.querySelector('[data-slot=root]>div');
    return { cols: getComputedStyle(grid).gridTemplateColumns.split(' ').map(v => Math.round(parseFloat(v)) || 0), col3Display: getComputedStyle(grid.children[2]).display };
  });
  return JSON.stringify({ mobile, desktop }, null, 1);
}
