// P15 终验:双主题 × 三场景(会话/hero/设置)截图集
async page => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  await sleep(1800);
  // 场景1:会话流(浅色)
  for (let i = 0; i < 8; i++) {
    if (await page.evaluate(() => document.querySelectorAll('.au-callrow').length > 0)) break;
    await page.evaluate((idx) => {
      const rows = [...document.querySelectorAll('.au-srow')].filter(r => r.offsetParent !== null);
      if (rows[idx]) rows[idx].click();
    }, i);
    await sleep(800);
  }
  return 'session-light';
}
