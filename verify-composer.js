// P10 前置探针:输入坞(composer card + dock 区)真实 DOM 结构与几何
// node verify-run.mjs verify-composer.js --shot aurum-composer-probe.png
async page => {
  const data = await page.evaluate(() => {
    const out = { seat: [], card: null, dock: [], goalBar: null, cardSubtree: [] };
    const seat = document.querySelector('[data-composer-seat]');
    if (seat) {
      out.seatRect = seat.getBoundingClientRect().toJSON();
      out.seatChildren = [...seat.children].map(c => ({
        cls: c.className, attrs: [...c.attributes].filter(a => a.name.startsWith('data-')).map(a => `${a.name}=${a.value}`),
      }));
    }
    const card = document.querySelector('[data-composer-card]');
    if (card) {
      const r = card.getBoundingClientRect();
      const cs = getComputedStyle(card);
      out.card = { rect: { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) }, radius: cs.borderRadius, pad: cs.padding, font: cs.fontSize + '/' + cs.lineHeight, cls: card.className };
      // 卡内两层结构(不做样式,只记录类名与标签)
      const walk = (el, depth) => {
        for (const c of el.children) {
          if (depth <= 2) {
            const cr = c.getBoundingClientRect();
            out.cardSubtree.push(`${'  '.repeat(depth)}<${c.tagName.toLowerCase()} class="${String(c.className).slice(0, 90)}" ${[...c.attributes].filter(a => a.name.startsWith('data-') || a.name === 'title' || a.name === 'aria-label' || a.name === 'placeholder').map(a => `${a.name}=${a.value.slice(0, 40)}`).join(' ')} ${Math.round(cr.width)}x${Math.round(cr.height)}>`);
          }
          if (depth < 2) walk(c, depth + 1);
        }
      };
      walk(card, 0);
    }
    // dock 区:composer 卡之外的兄弟(composerStack 内)
    const stack = document.querySelector('[class*=composerStack]');
    if (stack) out.stackChildren = [...stack.children].map(c => ({ cls: String(c.className).slice(0, 90), h: Math.round(c.getBoundingClientRect().height) }));
    // nLMEza goal 条
    const goal = document.querySelector('[class*=nLMEza]');
    if (goal) {
      const r = goal.getBoundingClientRect();
      out.goalBar = { cls: goal.className.slice(0, 120), rect: { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) }, html: goal.outerHTML.slice(0, 1500) };
    } else out.goalBar = 'ABSENT';
    // 全页搜含「目标/进行中」的元素
    const probe = [...document.querySelectorAll('div,section')].filter(e => /进行中的目标|goal/i.test(e.className + '') && e.children.length);
    out.goalSearch = probe.slice(0, 3).map(e => String(e.className).slice(0, 100));
    return out;
  });
  return JSON.stringify(data, null, 1);
}
