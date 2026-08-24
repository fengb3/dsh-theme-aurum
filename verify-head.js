async page => {
  await page.evaluate(() => {
    const rows = [...document.querySelectorAll('[data-slot=sidebar] .au-srow')];
    const target = rows.find(r => /What We Left/i.test(r.textContent || '')) || rows[1];
    if (target) target.click();
  });
  await page.waitForTimeout(1500);
  return await page.evaluate(() => {
    const bcs = getComputedStyle(document.body);
    const hcs = document.querySelector('.wSkVaW_header');
    const comp = document.querySelector('[data-composer-card]');
    return {
      body: {
        bgImage: bcs.backgroundImage,
        bgSize: bcs.backgroundSize,
        layers: bcs.backgroundImage.split('radial-gradient').length - 1
      },
      header: hcs ? { bg: getComputedStyle(hcs).backgroundImage, color: getComputedStyle(hcs).backgroundColor } : null,
      composer: comp ? { bg: getComputedStyle(comp).backgroundColor } : null
    };
  });
}
