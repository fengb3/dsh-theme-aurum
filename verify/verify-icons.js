// P15 前修订 VI 门禁:图标全部 DSH 官方原版(viewBox 14/16 = 官方;24 = 自绘残留)
async page => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  await sleep(1800);
  const out = {};
  // 1. primitives 模块加载成功?
  out.moduleLoaded = await page.evaluate(() => {
    // 插件作用域变量不可直达;以渲染产物判定(下面 viewBox 普查)
    return 'by-viewbox';
  });
  // 2. 文件夹图标(分组头)
  out.folder = await page.evaluate(() => {
    const ic = document.querySelector('.au-ws-ic');
    if (!ic) return 'no-ic';
    const svgs = [...ic.querySelectorAll('svg')];
    return svgs.map(s => ({ cls: s.parentElement.className || '(svg-direct)', vb: s.getAttribute('viewBox'), w: Math.round(s.getBoundingClientRect().width) }));
  });
  // 3. 打开会话,工具卡图标普查
  for (let i = 0; i < 8; i++) {
    if (await page.evaluate(() => document.querySelectorAll('.au-callrow').length > 0)) break;
    await page.evaluate((idx) => {
      const rows = [...document.querySelectorAll('.au-srow')].filter(r => r.offsetParent !== null);
      if (rows[idx]) rows[idx].click();
    }, i);
    await sleep(800);
  }
  out.toolIcons = await page.evaluate(() => {
    const seen = {};
    for (const card of document.querySelectorAll('.au-tool')) {
      const tool = card.getAttribute('data-tool') || '?';
      if (seen[tool]) continue;
      const svg = card.querySelector('.au-ico svg');
      seen[tool] = svg ? { vb: svg.getAttribute('viewBox'), w: Math.round(svg.getBoundingClientRect().width) } : null;
    }
    return seen;
  });
  // 4. 自绘残留普查(任何 au-* 里 viewBox=0 0 24 24 且属我们图标的)
  out.residual24 = await page.evaluate(() => {
    const hits = [];
    for (const svg of document.querySelectorAll('[data-slot=sidebar] svg, .au-tool svg, .kid svg')) {
      const vb = svg.getAttribute('viewBox');
      if (vb === '0 0 24 24') {
        const area = svg.closest('.au-ws-ic,.au-ico,.kid,.au-wsg-act,.au-ws-ibtn,.au-ws-sbtn');
        if (area) hits.push({ areaCls: String(area.className).slice(0, 24), kind: 'icon' });
      }
    }
    return hits.slice(0, 8);
  });
  return JSON.stringify(out, null, 1);
}
