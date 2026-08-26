/* 门禁:插件 CSS 规则的媒体嵌套归属断言。
   背景(P15 追补 VIII):CSS 数组纯字符串拼接无语法检查,追补 VI 曾漏配对 "}",
   把 P10 todo-bar 宽度适配/P11 .kid/全局 reduced-motion 吞进 @media(max-width:820px),
   桌面端全部静默失效。本门禁扫描插件 style tag,断言这些规则不再嵌在宽度媒体块下。 */
async page => {
  const found = await page.evaluate(() => {
    const tag = document.querySelector('style[data-plugin-css="dsh-theme-aurum/aurum.css"]');
    if (!tag) return null;
    const out = [];
    const walk = (rules, path) => {
      for (const r of rules) {
        if (r.selectorText && /todo-bar|\.kid|tool-kids|data-chat-anchor-key/.test(r.selectorText)) {
          out.push({ sel: r.selectorText.slice(0, 55), nesting: path, cssHead: r.style.cssText.slice(0, 60) });
        }
        if (r.media && r.cssRules && r.cssRules.length) walk(r.cssRules, path.concat('@' + r.conditionText));
      }
    };
    walk(tag.sheet.cssRules, []);
    return out;
  });
  if (!found) return { failures: 1, note: '插件 style tag 不存在' };
  const bad = [];
  for (const f of found) {
    const widthMedia = f.nesting.some(n => /max-width/.test(n));
    /* .kid/.tool-kids 必须顶层(桌面端子调用样式);
       .todo-bar 宽度适配(含 flex: 0 0 auto)必须顶层;
       body .todo-bar 的 480 降档、reduced-motion 条件嵌套属预期,放行 */
    const isAdapt = f.sel === '.todo-bar' && /flex:\s*0 0 auto/.test(f.cssHead);
    if (widthMedia && (/\.kid|tool-kids/.test(f.sel) || isAdapt)) {
      bad.push(f.sel + ' ← ' + f.nesting.join(' '));
    }
  }
  return { failures: bad.length, swallowed: bad, rules: found.length };
}
