// P14 门禁:降档实测(选中会话后在各档量字号/几何),360-1920 无横向滚动
async page => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  await sleep(1500);
  // 开一个有内容的会话
  for (let i = 0; i < 8; i++) {
    if (await page.evaluate(() => document.querySelectorAll('.au-callrow').length > 0)) break;
    await page.evaluate((idx) => {
      const rows = [...document.querySelectorAll('.au-srow')].filter(r => r.offsetParent !== null);
      if (rows[idx]) rows[idx].click();
    }, i);
    await sleep(800);
  }
  const widths = [1280, 820, 640, 480, 360];
  const out = [];
  for (const w of widths) {
    await page.setViewportSize({ width: w, height: 900 });
    await sleep(600);
    out.push(await page.evaluate((w) => {
      const r = { vw: window.innerWidth };
      const doc = document.documentElement;
      r.hScroll = doc.scrollWidth > doc.clientWidth + 1;
      const crumb = document.querySelector('.wSkVaW_crumbCurrent');
      if (crumb) r.crumbFs = getComputedStyle(crumb).fontSize;
      const tab = document.querySelector('.wSkVaW_tab');
      if (tab) { const s = getComputedStyle(tab); r.tab = s.padding + ' ' + s.fontSize; }
      const bub = document.querySelector('.au-bubble');
      if (bub) { const s = getComputedStyle(bub); r.bubble = s.fontSize + ' max' + s.maxWidth; }
      const track = document.querySelector('.goal-track');
      if (track) r.goalTrackW = getComputedStyle(track).width;
      const sep = document.querySelector('.FJxK0a_sep');
      if (sep) r.statsSepM = getComputedStyle(sep).margin;
      const em = document.querySelector('.au-name em');
      r.emDisplay = em ? getComputedStyle(em).display : 'n/a';
      const card = document.querySelector('[data-composer-card]');
      if (card) { const rect = card.getBoundingClientRect(); r.cardW = Math.round(rect.width); r.cardOverflow = card.scrollWidth > card.clientWidth + 1; }
      const todo = document.querySelector('.todo-bar');
      if (todo) r.todoOverflow = todo.scrollWidth > todo.clientWidth + 1;
      return r;
    }, w));
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  return JSON.stringify(out, null, 1);
}
