// P15 微调门禁:① 表格分隔线恢复;② 工具卡 ease-in-out 曲线
async page => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  await sleep(1800);
  // 找 Markdown 测试会话(有表格)
  for (let i = 0; i < 10; i++) {
    const hit = await page.evaluate(() => document.querySelectorAll('[data-chat-flow-kind=assistant-step] table').length > 0);
    if (hit) break;
    await page.evaluate((idx) => {
      const rows = [...document.querySelectorAll('.au-srow')].filter(r => r.offsetParent !== null);
      if (rows[idx]) rows[idx].click();
    }, i);
    await sleep(900);
  }
  const out = {};
  // ① 表格
  out.table = await page.evaluate(() => {
    const t = document.querySelector('[data-chat-flow-kind=assistant-step] table');
    if (!t) return 'no-table';
    const td = t.querySelector('td') || t.querySelector('th');
    const s = td ? getComputedStyle(td) : null;
    return {
      rows: t.querySelectorAll('tr').length,
      tdBorder: s ? s.borderTopWidth + ' ' + s.borderTopColor : null,
      visible: s ? (parseFloat(s.borderTopWidth) > 0 && !/transparent/i.test(s.borderTopColor) && !/rgba\(0, 0, 0, 0\)/.test(s.borderTopColor)) : false,
      headBg: (() => { const h = t.querySelector('th') || t.querySelector('tr'); return h ? getComputedStyle(h).backgroundColor.slice(0, 44) : null; })()
    };
  });
  // ② 曲线:点开第一张工具卡,量 transition
  out.curve = await page.evaluate(() => {
    const main = document.querySelector('.au-tool .au-main');
    if (!main) return 'no-card';
    main.click();
    const x = document.querySelector('.au-tool .au-x');
    const cs = getComputedStyle(x);
    return cs.transitionDuration + ' ' + cs.transitionTimingFunction;
  });
  await sleep(650);
  out.openRows = await page.evaluate(() => {
    const x = document.querySelector('.au-tool .au-x');
    return getComputedStyle(x).gridTemplateRows;
  });
  // 收回再量
  out.curveClose = await page.evaluate(() => {
    const main = document.querySelector('.au-tool .au-main');
    if (main) main.click();
    const x = document.querySelector('.au-tool .au-x');
    return getComputedStyle(x).transitionTimingFunction;
  });
  return JSON.stringify(out, null, 1);
}
