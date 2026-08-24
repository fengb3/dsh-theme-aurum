// P15 终验 b:切深色 → 会话截图;再 hero 截图
async page => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  await page.evaluate(() => document.querySelector('.aurum-footRow')?.click());
  await sleep(700);
  return 'switched-dark';
}
