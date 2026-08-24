async page => {
  await page.evaluate(() => {
    const rows = [...document.querySelectorAll('[data-slot=sidebar] .au-srow')];
    const target = rows.find(r => /What We Left/i.test(r.textContent || '')) || rows[1];
    if (target) target.click();
  });
  await page.waitForTimeout(1500);
  return await page.evaluate(() => {
    const q = s => document.querySelector(s);
    const tabs = q('.wSkVaW_tabs');
    const tabOn = q('.wSkVaW_tabActive');
    const tab = q('.wSkVaW_tab:not(.wSkVaW_tabActive)');
    const crumb = q('.wSkVaW_crumbCurrent');
    const header = q('.wSkVaW_header');
    const rroot = q('[data-chat-flow-kind=assistant-step] .QWLzlG_root');
    const think = q('.QWLzlG_thinkBody');
    const rr = el => el ? (x => ({ x: +x.x.toFixed(0), y: +x.y.toFixed(0), w: +x.width.toFixed(0), h: +x.height.toFixed(0) }))(el.getBoundingClientRect()) : null;
    const cs = el => el ? getComputedStyle(el) : null;
    const tabsCS = cs(tabs), onCS = cs(tabOn), crumbCS = cs(crumb), thinkCS = cs(think), rootCS = cs(rroot);
    return {
      header: { rect: rr(header), bg: (cs(header) || {}).backgroundImage ? 'gradient' : (cs(header) || {}).backgroundColor },
      crumb: { rect: rr(crumb), font: (crumbCS || {}).fontFamily.split(',')[0], size: (crumbCS || {}).fontSize },
      tabs: { rect: rr(tabs), radius: (tabsCS || {}).borderRadius, justify: (tabsCS || {}).justifyContent, bg: (tabsCS || {}).backgroundColor },
      tabOn: { rect: rr(tabOn), bg: (onCS || {}).backgroundColor, color: (onCS || {}).color, radius: (onCS || {}).borderRadius, pad: (onCS || {}).padding },
      tab: { color: tab ? getComputedStyle(tab).color : null },
      reasoningRoot: { rect: rr(rroot), bg: (rootCS || {}).backgroundColor, radius: (rootCS || {}).borderRadius, mb: (rootCS || {}).marginBottom },
      thinkBody: think ? { font: thinkCS.fontFamily.split(',')[0], style: thinkCS.fontStyle, size: thinkCS.fontSize, borderTop: thinkCS.borderTopStyle + ' ' + thinkCS.borderTopColor } : null
    };
  });
}
