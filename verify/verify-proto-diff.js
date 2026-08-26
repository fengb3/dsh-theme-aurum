/**
 * verify-proto-diff.js — 双页恒等映射门禁(P9 起生效)。
 *
 * 用法:playwright-cli eval,page = 实况页(http://127.0.0.1:3080)。
 * 同一 context 开第二页加载原型 HTML,按 SELECTORS 清单在两页各测
 * rect / 字号 / 圆角 / padding / 颜色,输出逐项 diff:
 *   - w/h/字号:断言 |Δ| ≤ 容差(rect 1.5px / font 0.5px),超差 ok:false;
 *   - x/y:仅输出不断言(两页 viewport/滚动不可控,横向对齐由 CSS 拷贝保证);
 *   - 颜色:仅并排输出(oklch→rgb 跨页换算不稳,人工复核);
 *   - selector 在任一页缺失:标 missing(不计失败)——尾部节点(turn-tail/compress/
 *     row-err/row-retry)是数据驱动的,实况页要有对应事件才会渲染,属预期。
 *
 * SELECTORS 条目 = [label, protoSelector, liveSelector?]:
 *   省略第三项 = 恒等映射(两边同 selector);提供第三项 = 异构映射
 *   (如 md 装饰 scoped 到实况的 assistant-step flowItem)。
 * 随阶段逐项追加;P9 首批见下。
 */
async page => {
  /* 原型 URL 机器无关:runner(verify-run.mjs)在 Node 全局设 __AU_PROTO_URL__;
     手动 playwright-cli 场景可先在控制台设该全局(window 属性亦可),未设时报错退出。 */
  const PROTO_URL = (typeof __AU_PROTO_URL__ !== 'undefined' && __AU_PROTO_URL__)
    || (() => { throw new Error('set __AU_PROTO_URL__ = file:///<repo>/prototype/dsh-agent-workspace.html before eval'); })();
  const SELECTORS = [
    // ── P9 · 会话流尾部节点(恒等映射)──
    ['turn-tail', '.turn-tail'],
    ['turn-tail tx', '.turn-tail .tx'],
    // P17:compress-head 退役 —— compaction/manual-compaction 已并入 au-tool 卡壳家族
    // (原型平推行与卡壳几何不可比,差异记录见 ROADMAP P17;不再进 diff 清单)
    ['row-err', '.row-err'],
    ['row-retry', '.row-retry'],
    // ── P9 · md 装饰(异构:实况 scoped 到 assistant-step flowItem)──
    ['md li', '.md li', '[data-chat-flow-kind=assistant-step] li'],
    ['inline code', '.md code', '[data-chat-flow-kind=assistant-step] :not(pre)>code'],
  ];
  const TOL_RECT = 1.5, TOL_FONT = 0.5;
  /* 文本内容驱动宽度的元素:只断言 h/字号,不断言 w(两页文本本就不同) */
  const NO_W = new Set(['turn-tail tx', 'inline code']);
  /* P15 追补 III:md li 高度受文本行数驱动、宽度受「去头像」用户决策影响
     (原型 md 内缩于 42px 头像列 → 666;实况已去头像 → 712 列满宽),
     记录不断言(字号/padding 仍可比对,人工看数值) */
  const INFO_ONLY = new Set(['md li']);
  const measure = ([list, which]) => list.map(entry => {
    const label = entry[0];
    const sel = which === 'live' && entry[2] ? entry[2] : entry[1];
    const el = document.querySelector(sel);
    if (!el) return { label, sel, missing: true };
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      label, sel,
      rect: { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) },
      font: cs.fontSize, family: cs.fontFamily.split(',')[0].replace(/['"]/g, ''),
      radius: cs.borderRadius, padding: cs.padding, color: cs.color, bg: cs.backgroundColor
    };
  });

  const live = await page.evaluate(measure, [SELECTORS, 'live']);
  const protoPage = await page.context().newPage();
  let rows;
  try {
    await protoPage.goto(PROTO_URL, { waitUntil: 'load' });
    await protoPage.waitForTimeout(400); // 等字体与入场动画落定
    const proto = await protoPage.evaluate(measure, [SELECTORS, 'proto']);
    let failures = 0;
    rows = proto.map((a, i) => {
      const b = live[i];
      if (!b) return { label: SELECTORS[i][0], error: 'live measure missing' };
      if (a.missing || b.missing) return { label: a.label, missing: a.missing ? 'proto' : 'live', sel: a.sel };
      const d = (x, y) => +(x - y).toFixed(1);
      const dw = d(a.rect.w, b.rect.w), dh = d(a.rect.h, b.rect.h);
      const fa = parseFloat(a.font), fb = parseFloat(b.font);
      const ok = INFO_ONLY.has(a.label) || ((NO_W.has(a.label) || Math.abs(dw) <= TOL_RECT) && Math.abs(dh) <= TOL_RECT && Math.abs(fa - fb) <= TOL_FONT);
      if (!ok) failures++;
      return {
        label: a.label, ok,
        dw, dh, dfont: +(fa - fb).toFixed(1),
        proto: { w: a.rect.w, h: a.rect.h, font: a.font + ' ' + a.family, radius: a.radius, padding: a.padding, color: a.color, bg: a.bg },
        live: { w: b.rect.w, h: b.rect.h, font: b.font + ' ' + b.family, radius: b.radius, padding: b.padding, color: b.color, bg: b.bg }
      };
    });
    return { failures, rows };
  } finally {
    await protoPage.close();
  }
}
