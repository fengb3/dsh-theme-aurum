async page => {
  /* 先打开带历史的会话(保证 header/crumb 存在) */
  await page.evaluate(() => {
    const rows = [...document.querySelectorAll('[data-slot=sidebar] .au-srow')];
    const target = rows.find(r => /What We Left/i.test(r.textContent || '')) || rows[1];
    if (target) target.click();
  });
  await page.waitForTimeout(1500);
  /* 深色主题下复核 sh-head/reasoning(切 aurum-dark → 量 → 切回浅色) */
  const toggle = await page.$('[data-slot=sidebar] .aurum-footRow');
  await toggle.click();
  await page.waitForTimeout(600);
  const dark = await page.evaluate(() => {
    const q = s => document.querySelector(s);
    const onCS = getComputedStyle(q('.wSkVaW_tabActive'));
    const crumbCS = getComputedStyle(q('.wSkVaW_crumbCurrent'));
    const root = q('[data-chat-flow-kind=assistant-step] .QWLzlG_root');
    const rootCS = root ? getComputedStyle(root) : null;
    return {
      mode: document.body.getAttribute('data-ds-dark-theme') !== null ? 'dark' : 'light',
      crumbFont: crumbCS.fontFamily.split(',')[0],
      tabOnBg: onCS.backgroundColor, tabOnColor: onCS.color,
      reasoningBg: rootCS ? rootCS.backgroundColor : null,
      reasoningRadius: rootCS ? rootCS.borderRadius : null,
      titleFont: rootCS ? getComputedStyle(q('.QWLzlG_title')).fontFamily.split(',')[0] : null
    };
  });
  const toggle2 = await page.$('[data-slot=sidebar] .aurum-footRow');
  await toggle2.click();
  await page.waitForTimeout(400);
  const back = await page.evaluate(() => document.body.getAttribute('data-ds-dark-theme') !== null ? 'dark' : 'light');
  return { dark, back };
}
