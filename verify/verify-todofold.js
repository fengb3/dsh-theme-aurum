/* P21 门禁:todo-bar 折叠 —— 默认折叠态几何、展开/收起切换、reduced 无关
   布局不回归(胶囊区高度 0 / aria-expanded / 折叠钮在册)。 */
async page => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const failures = [];
  const out = { opened: null };
  // ── 1. 找一个带 todo 的会话(当前活跃会话必有 todo_write;逐行尝试)──
  const openedVia = await __au.openTodoSession(page);
  out.opened = openedVia;
  if (openedVia === null) return { note: '未找到带 todo 的会话(历史 todo 数据可能已被清空)—— skip,不挡门禁', failures: 0, skip: true };
  await sleep(400);
  // ── 2. 默认折叠态断言 ──
  const collapsed = await page.evaluate(() => {
    const bar = document.querySelector('.todo-bar');
    const wrap = bar.querySelector('.todo-foldwrap');
    const btn = bar.querySelector('.todo-fold');
    const br = bar.getBoundingClientRect();
    return {
      barCls: bar.className,
      barH: +br.height.toFixed(1),
      wrapH: +wrap.getBoundingClientRect().height.toFixed(1),
      itemsHidden: bar.querySelectorAll('.todo-it').length > 0 && wrap.getBoundingClientRect().height < 1,
      nItems: bar.querySelectorAll('.todo-it').length,
      aria: btn.getAttribute('aria-expanded'),
      btnVisible: btn.offsetParent !== null,
      overflow: bar.scrollWidth > bar.clientWidth + 1,
      labels: [...bar.querySelectorAll('.todo-label')].map(e => e.textContent.trim()),
      fill: (bar.querySelector('.goal-fill') || {}).style ? bar.querySelector('.goal-fill').style.width : null
    };
  });
  if (!/au-tdclosed/.test(collapsed.barCls)) failures.push('默认应含 au-tdclosed:' + collapsed.barCls);
  if (collapsed.aria !== 'false') failures.push('默认 aria-expanded 应 false,实际 ' + collapsed.aria);
  if (!collapsed.itemsHidden) failures.push('默认折叠态胶囊区高度应≈0,实测 wrapH=' + collapsed.wrapH);
  if (collapsed.barH > 46) failures.push('折叠态整条高度异常(应≈38):' + collapsed.barH);
  if (!collapsed.btnVisible) failures.push('折叠钮不可见');
  if (collapsed.overflow) failures.push('折叠态横向溢出');
  out.collapsed = collapsed;
  // ── 3. 展开 → 收起切换 ──
  await page.click('.todo-bar .todo-fold');
  await sleep(500);
  const open1 = await page.evaluate(() => {
    const bar = document.querySelector('.todo-bar');
    const wrap = bar.querySelector('.todo-foldwrap');
    const btn = bar.querySelector('.todo-fold');
    return {
      barCls: bar.className, aria: btn.getAttribute('aria-expanded'),
      wrapH: +wrap.getBoundingClientRect().height.toFixed(1),
      barH: +bar.getBoundingClientRect().height.toFixed(1),
      chevRot: getComputedStyle(btn.querySelector('svg') || btn).transform
    };
  });
  if (/au-tdclosed/.test(open1.barCls)) failures.push('展开后仍有 au-tdclosed');
  if (open1.aria !== 'true') failures.push('展开后 aria 应 true,实际 ' + open1.aria);
  if (open1.wrapH < 10) failures.push('展开后胶囊区高度异常:' + open1.wrapH);
  if (open1.barH <= open1.wrapH + 20) failures.push('展开后整条高度未增长:barH=' + open1.barH + ' wrapH=' + open1.wrapH);
  out.open1 = open1;
  await page.click('.todo-bar .todo-fold');
  await sleep(500);
  const closed2 = await page.evaluate(() => {
    const bar = document.querySelector('.todo-bar');
    return {
      barCls: bar.className,
      aria: bar.querySelector('.todo-fold').getAttribute('aria-expanded'),
      wrapH: +bar.querySelector('.todo-foldwrap').getBoundingClientRect().height.toFixed(1)
    };
  });
  if (!/au-tdclosed/.test(closed2.barCls)) failures.push('收起后无 au-tdclosed');
  if (closed2.aria !== 'false') failures.push('收起后 aria 应 false');
  if (closed2.wrapH >= 1) failures.push('收起后胶囊区高度应≈0:' + closed2.wrapH);
  out.closed2 = closed2;
  out.failures = failures;
  return out;
}
