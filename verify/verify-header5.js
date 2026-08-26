// P15 前修订 V 门禁:同轴对齐 + 单行 tabs + 渐变浮头 + tab 无横杠 + 主题文案
async page => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  await sleep(1800);
  // 打开会话
  for (let i = 0; i < 8; i++) {
    if (await page.evaluate(() => document.querySelectorAll('.wSkVaW_tab').length > 0)) break;
    await page.evaluate((idx) => {
      const rows = [...document.querySelectorAll('.au-srow')].filter(r => r.offsetParent !== null);
      if (rows[idx]) rows[idx].click();
    }, i);
    await sleep(800);
  }
  const out = await page.evaluate(() => {
    const r = {};
    // 1. 同轴:侧栏字标中心 vs 主区标题中心
    const brand = document.querySelector('.hHd-Xa_brandIdentity');
    const crumb = document.querySelector('.wSkVaW_crumbCurrent') || document.querySelector('.wSkVaW_crumb');
    if (brand && crumb) {
      const b = brand.getBoundingClientRect(), c = crumb.getBoundingClientRect();
      r.coAxis = { brandCenterY: +(b.y + b.height / 2).toFixed(1), crumbCenterY: +(c.y + c.height / 2).toFixed(1), delta: +Math.abs((b.y + b.height / 2) - (c.y + c.height / 2)).toFixed(1) };
    }
    // 2. tabs 与标题同行
    const tabs = document.querySelector('.wSkVaW_tabs');
    if (tabs && crumb) {
      const t = tabs.getBoundingClientRect(), c = crumb.getBoundingClientRect();
      r.tabsRow = { sameRow: Math.abs((t.top + t.height / 2) - (c.top + c.height / 2)) < 10, tabsY: +t.y.toFixed(0) };
    }
    // 3. 浮头 + 渐变
    const header = document.querySelector('.wSkVaW_header');
    if (header) {
      const hs = getComputedStyle(header);
      const hb = header.getBoundingClientRect();
      r.header = { pos: hs.position, h: Math.round(hb.height), bg: hs.backgroundImage.slice(0, 64), z: hs.zIndex };
    }
    // 消息滚到顶:进纱渐隐(scroll padding 让位)
    const scroll = document.querySelector('.Md3f7G_scroll');
    if (scroll) r.scrollPadTop = getComputedStyle(scroll).paddingTop;
    // 4. tab 横杠
    const tab = document.querySelector('.wSkVaW_tab');
    if (tab) {
      const after = getComputedStyle(tab, '::after');
      r.tabAfter = { display: after.display, content: after.content };
    }
    // 5. 主题按钮文案
    const foot = document.querySelector('.aurum-footRow');
    if (foot) r.footLabel = foot.textContent.trim();
    return r;
  });

  // 滚动验证:消息进入纱区(渐隐)而非硬切 —— 滚到顶量首条消息位置
  await page.evaluate(() => { const s = document.querySelector('.Md3f7G_scroll') || document.querySelector('[data-conversation-scroll]'); if (s) s.scrollTop = 0; });
  await sleep(400);
  out.topScroll = await page.evaluate(() => {
    const first = document.querySelector('.Md3f7G_flowItem');
    if (!first) return null;
    const r = first.getBoundingClientRect();
    return { top: Math.round(r.top), underVeil: r.top < 70 };
  });
  return JSON.stringify(out, null, 1);
}
