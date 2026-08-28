/* P26 验证:workspace 组头菜单按钮(props.menuSlot 修复)与 '+' 图标居中(display:block)。 */
async page => {
  await page.waitForSelector('.au-wsg', { timeout: 8000 }).catch(() => {});
  const out = {};

  /* 1. dots(目录操作)按钮现在应存在;hover 组后可见;点击弹菜单 */
  out.dotsFound = await page.evaluate(() => {
    const b = [...document.querySelectorAll('.au-wsg-act')].find(x => /目录操作/.test(x.title || ''));
    return !!b;
  });
  const head = await page.$('.au-wsg-head');
  if (head) { await head.hover(); await page.waitForTimeout(300); }
  out.menuOpened = await page.evaluate(() => {
    const b = [...document.querySelectorAll('.au-wsg-act')].find(x => /目录操作/.test(x.title || ''));
    if (!b) return false;
    b.click();
    return true;
  });
  await page.waitForTimeout(500);
  out.menuPanel = await page.evaluate(() => {
    const m = document.querySelector('.menu.open');
    if (!m) return null;
    const items = [...m.querySelectorAll('button,[role=menuitem],li')].map(el => el.textContent.trim()).filter(t => t && t.length < 20);
    return { text: m.textContent.trim().slice(0, 50), items: items.slice(0, 8) };
  });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  /* 2. '+' svg 居中(顶隙==底隙,差 ≤0.6) */
  out.plusGeom = await page.evaluate(() => {
    const plus = [...document.querySelectorAll('.au-wsg-act')].find(b => /新建会话/.test(b.title || ''));
    if (!plus) return { found: false };
    const r = plus.getBoundingClientRect();
    const svg = plus.querySelector('svg');
    const vr = svg.getBoundingClientRect();
    const top = vr.y - r.y, bottom = r.y + r.height - vr.y - vr.height;
    return { found: true, top: +top.toFixed(2), bottom: +bottom.toFixed(2), display: getComputedStyle(svg).display, centered: Math.abs(top - bottom) < 0.6 };
  });

  /* 3. dots svg 同样居中 */
  out.dotsGeom = await page.evaluate(() => {
    const b = [...document.querySelectorAll('.au-wsg-act')].find(x => /目录操作/.test(x.title || ''));
    if (!b) return { found: false };
    const r = b.getBoundingClientRect();
    const vr = b.querySelector('svg').getBoundingClientRect();
    const top = vr.y - r.y, bottom = r.y + r.height - vr.y - vr.height;
    return { found: true, top: +top.toFixed(2), bottom: +bottom.toFixed(2), centered: Math.abs(top - bottom) < 0.6 };
  });

  const failures = [out.dotsFound ? null : 'dots button missing', out.menuOpened ? null : 'dots click failed', out.menuPanel ? null : 'menu panel not open',
    out.plusGeom.found ? (out.plusGeom.centered ? null : 'plus not centered ' + JSON.stringify(out.plusGeom)) : 'plus missing',
    out.dotsGeom.found ? (out.dotsGeom.centered ? null : 'dots not centered ' + JSON.stringify(out.dotsGeom)) : 'dots geom missing'].filter(Boolean);
  return { failures: failures.length, details: failures, ...out };
}
