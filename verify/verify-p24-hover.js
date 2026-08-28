/* P24 门禁:工具卡 hover 无边 —— 头行 hover 后,卡内首两个可见像素行必须同色
   (y1==y2,差 ≤2),证明 hover 色块铺满卡、无「卡面色细环」。深浅双色各断言。
   背景:三卡壳曾带 border:1px solid transparent,hover 色块从内缘起画露 1px
   卡面色环(用户看到的 hover 细边框);修复 = 去 border(y0 是截图对齐的卡外
   画布行,不参与断言)。 */
async page => {
  const openSession = async () => { await __au.openToolSession(page); };

  const probe = async mode => {
    await openSession();
    const card = await page.$('.au-tool');
    if (!card) return { mode, error: 'no card' };
    const head = (await card.$('.au-main')) || card;
    await head.hover();
    await page.waitForTimeout(450);
    const b64 = (await card.screenshot()).toString('base64');
    const prof = await page.evaluate(async src => {
      const im = await new Promise(res => { const i = new Image(); i.onload = () => res(i); i.src = 'data:image/png;base64,' + src; });
      const cv = document.createElement('canvas'); cv.width = im.width; cv.height = im.height;
      const cx = cv.getContext('2d'); cx.drawImage(im, 0, 0);
      const d = cx.getImageData(0, 0, im.width, im.height).data;
      const w = im.width;
      const rowAvg = y => { let r = 0, g = 0, b = 0, n = 0; for (let x = 60; x < w - 60; x += 2) { const i = (y * w + x) * 4; r += d[i]; g += d[i + 1]; b += d[i + 2]; n++; } return [Math.round(r / n), Math.round(g / n), Math.round(b / n)]; };
      return { y1: rowAvg(1), y2: rowAvg(2) };
    }, b64);
    await page.mouse.move(5, 500);
    const diff = Math.max(
      Math.abs(prof.y1[0] - prof.y2[0]),
      Math.abs(prof.y1[1] - prof.y2[1]),
      Math.abs(prof.y1[2] - prof.y2[2])
    );
    return { mode, y1: prof.y1, y2: prof.y2, firstRowDiff: diff };
  };

  const results = [];
  let mode = await page.evaluate(() => document.body.hasAttribute('data-ds-dark-theme') ? 'dark' : 'light');
  results.push(await probe(mode));
  await __au.toggleTheme(page);
  mode = await page.evaluate(() => document.body.hasAttribute('data-ds-dark-theme') ? 'dark' : 'light');
  results.push(await probe(mode));
  /* 还原起始模式 */
  await __au.toggleTheme(page);

  const failures = results.filter(r => (r.firstRowDiff === undefined || r.firstRowDiff > 2)).length;
  return { failures, results };
}
