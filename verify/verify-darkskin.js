async page => {
  /* 先打开带历史的会话(保证 header/crumb 存在) */
  await page.evaluate(() => {
    const rows = [...document.querySelectorAll('[data-slot=sidebar] .au-srow')];
    const target = rows.find(r => /What We Left/i.test(r.textContent || '')) || rows[1];
    if (target) target.click();
  });
  await page.waitForTimeout(1500);
  /* P17 修正:按起始模式定向切换(旧版盲切一次,起始为 dark 时量到的是 light 值 ——
     reasoning 底色双主题分化后暴露);量完还原起始模式 */
  const modeOf = () => page.evaluate(() => document.body.getAttribute('data-ds-dark-theme') !== null ? 'dark' : 'light');
  const toggle = async () => {
    const t = await page.$('[data-slot=sidebar] .aurum-footRow');
    if (t) { await t.click(); await page.waitForTimeout(600); }
  };
  const startMode = await modeOf();
  if (startMode !== 'dark') await toggle(); /* 进入深色 */
  const dark = await page.evaluate(() => {
    const q = s => document.querySelector(s);
    const onCS = getComputedStyle(q('.wSkVaW_tabActive'));
    const crumbCS = getComputedStyle(q('.wSkVaW_crumbCurrent'));
    const root = q('[data-chat-flow-kind=assistant-step] .reasoning');
    const rootCS = root ? getComputedStyle(root) : null;
    return {
      mode: document.body.getAttribute('data-ds-dark-theme') !== null ? 'dark' : 'light',
      crumbFont: crumbCS.fontFamily.split(',')[0],
      tabOnBg: onCS.backgroundColor, tabOnColor: onCS.color,
      reasoningBg: rootCS ? rootCS.backgroundColor : null,   /* 深=55% 分层,浅=80%(P17 对齐 au-tool) */
      reasoningRadius: rootCS ? rootCS.borderRadius : null,
      titleFont: rootCS ? getComputedStyle(q('[data-chat-flow-kind=assistant-step] .r-title')).fontFamily.split(',')[0] : null
    };
  });
  const light = await (async () => { if (startMode === 'dark') { await toggle(); } return page.evaluate(() => {
    const root = document.querySelector('[data-chat-flow-kind=assistant-step] .reasoning');
    const rootCS = root ? getComputedStyle(root) : null;
    return {
      mode: document.body.getAttribute('data-ds-dark-theme') !== null ? 'dark' : 'light',
      reasoningBg: rootCS ? rootCS.backgroundColor : null,
      reasoningRadius: rootCS ? rootCS.borderRadius : null
    };
  }); })();
  if ((await modeOf()) !== startMode) await toggle(); /* 还原 */
  const back = await modeOf();
  return { startMode, dark, light, back };
}
