/* P21 目检:todo-bar 展开态深色截图 + 浅色 token 分支截图(token 双色自适应) */
async page => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const out = {};
  await __au.openTodoSession(page);
  const found = await page.evaluate(() => !!document.querySelector('.todo-bar'));
  if (!found) return { note: '未找到带 todo 的会话 —— skip', failures: 0, skip: true };
  await page.evaluate(() => { document.querySelector('.todo-bar .todo-fold').click(); });
  await sleep(600);
  out.darkStyles = await page.evaluate(() => {
    const bar = document.querySelector('.todo-bar');
    const btn = bar.querySelector('.todo-fold');
    const cs = getComputedStyle(btn);
    return { barBg: getComputedStyle(bar).backgroundColor, btnColor: cs.color, btnBg: cs.backgroundColor, btnR: cs.borderRadius, svgW: cs.width };
  });
  await page.screenshot({ path: 'screenshots/aurum-todofold-open-dark.png' });
  await page.evaluate(() => { document.body.removeAttribute('data-ds-dark-theme'); });
  await sleep(400);
  out.lightStyles = await page.evaluate(() => {
    const bar = document.querySelector('.todo-bar');
    const btn = bar.querySelector('.todo-fold');
    const cs = getComputedStyle(btn);
    return { barBg: getComputedStyle(bar).backgroundColor, btnColor: cs.color, pillBg: getComputedStyle(bar.querySelector('.todo-it')).backgroundColor };
  });
  await page.screenshot({ path: 'screenshots/aurum-todofold-open-light.png' });
  return out;
}
