async page => {
  const out = {};
  /* 1 · 会话行浮动菜单:悬停 ··· 可见 → 点击 → .menu fixed 渲染,含 重命名/分支/归档 */
  const rows = await page.$$('[data-slot=sidebar] .au-srow');
  out.rowCount = rows.length;
  if (rows.length >= 1) {
    await rows[0].hover();
    const menuBtn = await rows[0].$('.au-s-menu');
    out.menuBtnVisible = menuBtn ? await menuBtn.isVisible() : false;
    if (menuBtn) {
      await menuBtn.click();
      await page.waitForTimeout(350);
      out.sessionMenu = await page.evaluate(() => {
        const m = document.querySelector('.menu.fixed');
        if (!m) return null;
        const r = m.getBoundingClientRect();
        return {
          pos: getComputedStyle(m).position,
          rect: { x: +r.x.toFixed(0), y: +r.y.toFixed(0), w: +r.width.toFixed(0) },
          items: [...m.querySelectorAll('.mi')].map(b => b.textContent.trim()),
          hasSep: !!m.querySelector('.menu-sep'),
          dangerCount: m.querySelectorAll('.mi.danger').length,
          f2Mk: (m.querySelector('.mi .mk') || {}).textContent || null
        };
      });
      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);
      out.menuClosedByEsc = await page.evaluate(() => !document.querySelector('.menu.fixed'));
    }
  }
  /* 2 · 视图菜单:排序三态 + 平铺开关 */
  const viewBtn = await page.$('[data-slot=sidebar] .au-ws-acts .au-ws-ibtn[title="视图选项"]');
  if (viewBtn) {
    await viewBtn.click();
    await page.waitForTimeout(300);
    out.viewMenu = await page.evaluate(() => {
      const m = document.querySelector('.menu.fixed');
      if (!m) return null;
      return { items: [...m.querySelectorAll('.mi')].map(b => b.textContent.trim()), onCount: m.querySelectorAll('.mi .mk.on').length };
    });
    await page.keyboard.press('Escape');
  }
  /* 3 · 拖拽排序:合成 DragEvent 走 React 全链(dragstart→dragover→drop→dragend),
     第 1 行拖到第 2 行下沿(after)→ DOM 顺序变化(insertSessionBefore 持久化) */
  const rows2 = await page.$$('[data-slot=sidebar] .au-srow');
  if (rows2.length >= 2) {
    const before = await page.evaluate(() => [...document.querySelectorAll('[data-slot=sidebar] .au-srow .au-s-title')].map(s => s.textContent.trim()));
    try {
      await page.evaluate(() => {
        const qs = document.querySelectorAll('[data-slot=sidebar] .au-srow');
        window.__auT = { src: qs[1], dst: qs[2], dt: new DataTransfer() };
        window.__auT.src.dispatchEvent(new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer: window.__auT.dt }));
      });
      await page.waitForTimeout(120); // 等 React 重渲染(drag 状态入闭包)
      await page.evaluate(() => {
        const t = window.__auT;
        const r = t.dst.getBoundingClientRect();
        const at = { clientX: r.x + 60, clientY: r.y + r.height - 2 };
        t.dst.dispatchEvent(new DragEvent('dragover', Object.assign({ bubbles: true, cancelable: true, dataTransfer: t.dt }, at)));
        t.dst.dispatchEvent(new DragEvent('drop', Object.assign({ bubbles: true, cancelable: true, dataTransfer: t.dt }, at)));
        t.src.dispatchEvent(new DragEvent('dragend', { bubbles: true, cancelable: true, dataTransfer: t.dt }));
      });
      await page.waitForTimeout(900);
      const after = await page.evaluate(() => [...document.querySelectorAll('[data-slot=sidebar] .au-srow .au-s-title')].map(s => s.textContent.trim()));
      out.drag = { ok: before.join('|') !== after.join('|'), before: before.slice(0, 3), after: after.slice(0, 3) };
    } catch (e) {
      out.drag = { ok: false, error: e.message.split('\n')[0] };
    }
  }
  /* 4 · F2 重命名悬停行 */
  const rows3 = await page.$$('[data-slot=sidebar] .au-srow');
  if (rows3.length >= 1) {
    await rows3[0].hover();
    await page.keyboard.press('F2');
    await page.waitForTimeout(250);
    out.f2Rename = await page.evaluate(() => {
      const i = document.querySelector('[data-slot=sidebar] .au-s-rename');
      return i ? { visible: true, focused: document.activeElement === i } : { visible: false };
    });
    await page.keyboard.press('Escape');
  }
  return out;
}
