async page => {
  /* ── 分组会话截断(默认前 5 + 显示全部/收起)行为门禁 ──
     覆盖:默认截断态、展开全部、收起复位、平铺视图不截断;
     搜索视图走同一 results 分支(与分组分支隔离),不在此实测。
     前置:verify-gate.js 跑完后侧栏应为展开态;若在 rail 折叠态则先展开。 */
  await page.waitForTimeout(600);
  const hasWide = await page.evaluate(() => !!document.querySelector('[data-slot=sidebar] .au-ws.au-ws-wide'));
  if (!hasWide) {
    await page.click('[data-slot=sidebar] .rail-logo');
    await page.waitForTimeout(800);
  }
  const failures = [];
  const snap = () => page.evaluate(() => [...document.querySelectorAll('[data-slot=sidebar] .au-wsg')].map(g => {
    const btn = g.querySelector('.au-s-more');
    return {
      label: (g.querySelector('.au-wsg-head b') || {}).textContent || '',
      rows: g.querySelectorAll('.au-srowwrap').length,
      btnText: btn ? btn.textContent : null,
      aria: btn ? btn.getAttribute('aria-expanded') : null
    };
  }));
  const before = await snap();
  if (before.length === 0) failures.push('未找到任何 .au-wsg 分组(侧栏未展开或无会话)');
  const target = before.findIndex(g => g.btnText && /显示全部/.test(g.btnText));
  if (target === -1) {
    return { note: '数据无 >5 会话的分组,截断路径未触发', groups: before, failures: failures.length + 1 };
  }
  /* 断言 1:默认截断 —— 有按钮的组行数必须为 5;无按钮的组行数必须 ≤5 */
  for (const g of before) {
    if (g.btnText === null && g.rows > 5) failures.push('未截断:' + g.label + ' rows=' + g.rows);
    if (g.btnText !== null && g.rows !== 5) failures.push('截断组行数!=5:' + g.label + ' rows=' + g.rows);
    if (g.btnText !== null && !/显示全部 \d+ 条/.test(g.btnText)) failures.push('按钮文案异常:' + g.btnText);
    if (g.btnText !== null && g.aria !== 'false') failures.push('默认态 aria-expanded 应为 false');
  }
  const N = parseInt((before[target].btnText.match(/(\d+)/) || [0, '0'])[1], 10);
  /* 断言 2:点击展开全部(原生 click 冒泡触发 React 合成事件) */
  await page.evaluate(i => { document.querySelectorAll('[data-slot=sidebar] .au-wsg')[i].querySelector('.au-s-more').click(); }, target);
  await page.waitForTimeout(400);
  const g2 = (await snap())[target];
  if (g2.rows !== N) failures.push('展开后行数 ' + g2.rows + ' != 全量 ' + N);
  if (g2.btnText !== '收起') failures.push('展开后按钮应=收起,实际=' + g2.btnText);
  if (g2.aria !== 'true') failures.push('展开态 aria-expanded 应为 true');
  /* 断言 3:收起复位 */
  await page.evaluate(i => { document.querySelectorAll('[data-slot=sidebar] .au-wsg')[i].querySelector('.au-s-more').click(); }, target);
  await page.waitForTimeout(400);
  const g3 = (await snap())[target];
  if (g3.rows !== 5) failures.push('收起后行数 ' + g3.rows + ' != 5');
  if (!/显示全部 \d+ 条/.test(g3.btnText || '')) failures.push('收起后按钮应=显示全部,实际=' + g3.btnText);
  /* 断言 4:平铺视图不截断(flat 分支无截断按钮、行数=全量) */
  await page.click('[data-slot=sidebar] .au-ws-ibtn[title="视图选项"]');
  await page.waitForTimeout(300);
  await page.evaluate(() => { const m = [...document.querySelectorAll('.menu .mi')].find(x => /平铺会话列表/.test(x.textContent)); if (m) m.click(); });
  await page.waitForTimeout(300);
  const flatState = await page.evaluate(() => ({
    rows: document.querySelectorAll('[data-slot=sidebar] .au-srowwrap').length,
    more: document.querySelectorAll('[data-slot=sidebar] .au-s-more').length
  }));
  if (flatState.more !== 0) failures.push('平铺视图不应有截断按钮,实测 ' + flatState.more + ' 个');
  if (flatState.rows <= before.reduce((a, g) => a + g.rows, 0)) failures.push('平铺行数(' + flatState.rows + ')未多于截断态总和');
  /* 还原:切回分组视图 */
  await page.click('[data-slot=sidebar] .au-ws-ibtn[title="视图选项"]');
  await page.waitForTimeout(300);
  await page.evaluate(() => { const m = [...document.querySelectorAll('.menu .mi')].find(x => /平铺会话列表/.test(x.textContent)); if (m) m.click(); });
  await page.waitForTimeout(300);
  return { target: before[target].label, total: N, flatRows: flatState.rows, failures };
}