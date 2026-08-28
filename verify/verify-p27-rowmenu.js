/* P27 验证:sidebar.workspaces.row-menu 扩展点承接 —— aurum 自绘工作区 … 菜单
   尾接官方 slot 注入行(dsh-open-in-vscode 等)。断言:子槽 outlet 在菜单内、
   插件行可见可点、onClose 关菜单、未分组桶无 outlet、双主题下均渲染。 */
async page => {
  const consoleErrors = [];
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 160)); });
  await page.waitForSelector('.au-wsg', { timeout: 8000 }).catch(() => {});
  const out = {};

  /* 1. 打开第一个真实工作区(非未分组)的 … 菜单 */
  const opened = await page.evaluate(() => {
    const groups = [...document.querySelectorAll('.au-wsg')];
    const real = groups.find(g => {
      const head = g.querySelector('.au-wsg-head');
      return head && (head.title || '') !== ''; /* g.ws 存在时 title=path */
    });
    if (!real) return false;
    const btn = [...real.querySelectorAll('.au-wsg-act')].find(x => /目录操作/.test(x.title || ''));
    if (!btn) return false;
    btn.click();
    return true;
  });
  await page.waitForTimeout(400);
  out.menuOpened = opened;

  /* 2. row-menu outlet + 插件行(插槽由 aurum 声明,插件注入行由 SlotOutlet 渲染)
        + 风格归流断言:与 .mi 同菜单项逐项对齐(字号/行高/图标列/文字色) */
  out.rowBlock = await page.evaluate(() => {
    const m = document.querySelector('.menu.open');
    if (!m) return null;
    const outlet = m.querySelector('[data-slot="sidebar.workspaces.row-menu"]');
    const row = outlet && outlet.querySelector('.dsh-open-in-vscode-row');
    const seps = [...m.querySelectorAll('.menu-sep')];
    if (!outlet || !row) return { outlet: !!outlet, row: !!row, menuText: m.textContent.trim().slice(0, 60) };
    const mi = m.querySelector('.mi');
    const r = row.getBoundingClientRect();
    const mir = mi ? mi.getBoundingClientRect() : null;
    const cs = getComputedStyle(row);
    const mics = mi ? getComputedStyle(mi) : null;
    const svg = row.querySelector('svg');
    const misvg = mi ? mi.querySelector('svg') : null;
    const sepBefore = seps.some(s => s.compareDocumentPosition(outlet) & Node.DOCUMENT_POSITION_FOLLOWING);
    return {
      outlet: true, row: true, sepBefore,
      label: row.textContent.trim(),
      role: row.getAttribute('role'),
      visible: r.width > 0 && r.height > 0 && cs.visibility !== 'hidden',
      geom: { w: +r.width.toFixed(1), h: +r.height.toFixed(1) },
      anchorDisplay: getComputedStyle(outlet).display,
      style: {
        font: cs.fontSize + '/' + cs.lineHeight,
        miFont: mics ? mics.fontSize + '/' + mics.lineHeight : null,
        fontMatch: mics ? Math.abs(parseFloat(cs.fontSize) - parseFloat(mics.fontSize)) < 0.15 : null,
        hMatch: mir ? Math.abs(r.height - mir.height) <= 1.5 : null,
        iconW: svg ? getComputedStyle(svg).width : null,
        miIconW: misvg ? getComputedStyle(misvg).width : null,
        colorMatch: mics ? cs.color === mics.color : null,
      },
    };
  });

  /* 3. 深色主题下截图留档 */
  await page.screenshot({ path: 'screenshots/p27-rowmenu-dark.png' }).catch(() => {});

  /* 4. 浅色主题复检(双色都要过;风格归流两色同判) */
  await __au.toggleTheme(page);
  await page.waitForTimeout(300);
  out.lightTheme = await page.evaluate(() => {
    const m = document.querySelector('.menu.open');
    const row = m && m.querySelector('.dsh-open-in-vscode-row');
    const mi = m && m.querySelector('.mi');
    if (!row || !mi) return { row: !!row };
    const cs = getComputedStyle(row);
    const r = row.getBoundingClientRect(), mr = mi.getBoundingClientRect();
    return {
      row: true, color: cs.color, visible: r.width > 0 && r.height > 0,
      fontMatch: Math.abs(parseFloat(cs.fontSize) - parseFloat(getComputedStyle(mi).fontSize)) < 0.15,
      hMatch: Math.abs(r.height - mr.height) <= 1.5,
    };
  });
  await __au.toggleTheme(page); /* 还原深色 */
  await page.waitForTimeout(300);

  /* 5. 点击插件行:onClose 应关闭菜单(remote open 在宿主侧,页面只管菜单收起) */
  out.clickCloses = await page.evaluate(() => {
    const row = document.querySelector('.menu.open .dsh-open-in-vscode-row');
    if (!row) return null;
    row.click();
    return new Promise(resolve => setTimeout(() => {
      resolve(!document.querySelector('.menu.open'));
    }, 350));
  });
  await page.waitForTimeout(400);

  /* 6. 未分组桶(若有):菜单不渲染 row-menu outlet(无 cwd,与官方契约一致) */
  out.ungrouped = await page.evaluate(() => {
    const groups = [...document.querySelectorAll('.au-wsg')];
    const stray = groups.find(g => {
      const head = g.querySelector('.au-wsg-head');
      return head && (head.title || '') === '';
    });
    if (!stray) return 'absent';
    const btn = [...stray.querySelectorAll('.au-wsg-act')].find(x => /目录操作/.test(x.title || ''));
    if (!btn) return 'no-btn';
    btn.click();
    return true;
  });
  if (out.ungrouped === true) {
    await page.waitForTimeout(350);
    out.ungroupedNoOutlet = await page.evaluate(() => {
      const m = document.querySelector('.menu.open');
      if (!m) return 'no-menu';
      return !m.querySelector('[data-slot="sidebar.workspaces.row-menu"]');
    });
    await page.keyboard.press('Escape');
  }

  out.consoleErrors = consoleErrors.slice(0, 5);
  const rb = out.rowBlock || {};
  const st = rb.style || {};
  const failures = [
    out.menuOpened ? null : 'ws menu not opened',
    rb.outlet ? null : 'row-menu outlet missing in menu',
    rb.row ? null : 'plugin row missing in outlet',
    rb.sepBefore ? null : 'separator before plugin block missing',
    rb.visible ? null : 'plugin row not visible',
    rb.role === 'menuitem' ? null : 'row role!=menuitem',
    st.fontMatch ? null : 'font size mismatch vs .mi (' + st.font + ' vs ' + st.miFont + ')',
    st.hMatch ? null : 'row height mismatch vs .mi (' + JSON.stringify(rb.geom) + ')',
    st.iconW === st.miIconW ? null : 'icon size mismatch vs .mi (' + st.iconW + ' vs ' + st.miIconW + ')',
    st.colorMatch ? null : 'text color mismatch vs .mi',
    out.lightTheme.row ? null : 'plugin row missing in light theme',
    out.lightTheme.hMatch === false ? 'light theme row height mismatch' : null,
    out.clickCloses === true ? null : 'click did not close menu (' + out.clickCloses + ')',
    out.ungrouped === true ? (out.ungroupedNoOutlet === true ? null : 'ungrouped menu has outlet') : null,
  ].filter(Boolean);
  return { failures: failures.length, details: failures, ...out };
}
