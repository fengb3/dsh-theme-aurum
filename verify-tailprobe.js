// 取证:turn-tail 实况结构(tx 行高/颜色为何与原型差)
async page => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  await sleep(1800);
  for (let i = 0; i < 8; i++) {
    if (await page.evaluate(() => document.querySelectorAll('.turn-tail').length > 0)) break;
    await page.evaluate((idx) => {
      const rows = [...document.querySelectorAll('.au-srow')].filter(r => r.offsetParent !== null);
      if (rows[idx]) rows[idx].click();
    }, i);
    await sleep(800);
  }
  return await page.evaluate(() => {
    const tail = document.querySelector('.turn-tail');
    if (!tail) return 'no-tail';
    const tx = tail.querySelector('.tx');
    const cs = tx ? getComputedStyle(tx) : null;
    return JSON.stringify({
      txCount: document.querySelectorAll('.turn-tail').length,
      txText: tx ? tx.textContent : null,
      txFont: cs ? cs.fontSize + '/' + cs.lineHeight : null,
      txH: tx ? tx.getBoundingClientRect().height : null,
      tailH: tail.getBoundingClientRect().height
    });
  });
}
