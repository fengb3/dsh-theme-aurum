/* verify-viewyield.js — 门禁:非 chat view(轨迹/数据库等)让位 70px 浮头渐变纱。
   断言:每个 tab 切换后,view 内容首个可见元素 y ≥ 70(纱底);chat 视图不受影响
   (Md3f7G_scroll padding-top:86px 保留,消息首元素同样在纱下);深浅双主题同测。
   容差 2px。 */
async page => {
  const failures = [];
  const YEILD_MIN = 70; // 纱高 70,内容起点必须在其下
  // 打开有内容的会话(header 可见)
  for (let i = 0; i < 8; i++) {
    const vis = await page.evaluate(() => {
      const h = document.querySelector('.wSkVaW_header');
      return h && !h.className.includes('headerHidden');
    });
    if (vis) break;
    await page.evaluate(idx => {
      const rows = [...document.querySelectorAll('button.au-srow')];
      if (rows[idx]) rows[idx].click();
    }, i);
    await page.waitForTimeout(800);
  }
  const headerVisible = await page.evaluate(() => {
    const h = document.querySelector('.wSkVaW_header');
    return h ? !h.className.includes('headerHidden') : false;
  });
  if (!headerVisible) return { failures: 1, note: '无可测会话(header 全 hidden)' };

  const measure = async () => {
    const tabs = await page.evaluate(() => {
      const el = document.querySelector('.wSkVaW_tabs');
      return el ? [...el.querySelectorAll('[role=tab]')].map(t => t.textContent.trim()) : [];
    });
    const per = {};
    for (const t of tabs) {
      await page.evaluate(txt => {
        const el = [...document.querySelectorAll('[role=tab]')].find(x => x.textContent.trim() === txt);
        if (el) el.click();
      }, t);
      await page.waitForTimeout(500);
      per[t] = await page.evaluate(() => {
        const va = document.querySelector('.wSkVaW_viewArea');
        if (!va) return { error: 'no viewArea' };
        const vaPad = getComputedStyle(va).paddingTop;
        const root = va.querySelector(':scope > * > *') || va.firstElementChild.firstElementChild; // 越过 display:contents wrapper
        if (!root) return { error: 'no view root' };
        const r = root.getBoundingClientRect();
        const cs = getComputedStyle(root);
        if (root.classList.contains('Md3f7G_root')) {
          /* chat:[data-conversation-scroll] 模式下真正的滚动容器是外层 wSkVaW_scrollBody,
             root 高=内容自然高,y 随滚动任意 → 断言 computed 几何 + 滚到顶后首内容 y */
          const sb = document.querySelector('.wSkVaW_scrollBody');
          if (sb) { sb.style.scrollBehavior = 'auto'; sb.scrollTop = 0; }
          const scroll = root.querySelector('.Md3f7G_scroll');
          const col = root.querySelector('.Md3f7G_column');
          const first = col && col.firstElementChild;
          return {
            chat: true, rootCls: 'Md3f7G_root',
            margin: cs.marginTop, vaPad, scrollPad: scroll && getComputedStyle(scroll).paddingTop,
            firstY: first ? Math.round(first.getBoundingClientRect().y) : null
          };
        }
        // view 内容首可见子元素(让位后首子元素 y 即内容起点)
        let firstY = null, firstCls = null;
        for (const c of root.querySelectorAll('*')) {
          const cr = c.getBoundingClientRect();
          if (cr.height > 4 && cr.width > 4 && cr.y > -1) { firstY = Math.round(cr.y); firstCls = String(c.className).slice(0, 40); break; }
        }
        return { rootCls: String(root.className).slice(0, 40), rootY: Math.round(r.y), vaPad, firstY, firstCls };
      });
    }
    return per;
  };

  const dark = await measure();
  await page.evaluate(() => { document.body.removeAttribute('data-ds-dark-theme'); });
  await page.waitForTimeout(300);
  const light = await measure();
  await page.screenshot({ path: 'screenshots/aurum-viewyield-light.png' });
  await page.evaluate(() => { document.body.setAttribute('data-ds-dark-theme', ''); });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'screenshots/aurum-viewyield-dark.png' });

  for (const [mode, per] of [['dark', dark], ['light', light]]) {
    for (const [tab, m] of Object.entries(per)) {
      if (m.error) { failures.push(`${mode}/${tab}: ${m.error}`); continue; }
      if (m.chat) {
        if (m.margin !== '-86px') failures.push(`${mode}/${tab}: chat margin-top=${m.margin} ≠ -86px`);
        if (m.vaPad !== '86px') failures.push(`${mode}/${tab}: viewArea pad=${m.vaPad} ≠ 86px`);
        if (m.scrollPad !== '86px') failures.push(`${mode}/${tab}: scroll pad=${m.scrollPad} ≠ 86px`);
        if (m.firstY === null || m.firstY < YEILD_MIN - 2) failures.push(`${mode}/${tab}: chat 顶滚后首内容 y=${m.firstY} < ${YEILD_MIN}`);
        continue;
      }
      if (m.firstY === null) { failures.push(`${mode}/${tab}: 无可见内容元素`); continue; }
      if (m.firstY < YEILD_MIN - 2) failures.push(`${mode}/${tab}: 首元素 y=${m.firstY} < ${YEILD_MIN}(root=${m.rootCls})`);
    }
  }
  return { failures, dark, light };
}
