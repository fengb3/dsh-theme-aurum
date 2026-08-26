// P17 门禁:① think/tool/compact 三卡图标瓦片水平对齐(离屏探针,真实 CSS 链);
// ② 真实 /compact 手动压缩 → manual-compaction 压缩卡落地(卡壳几何/展开/官方 DOM 缺席)。
async page => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  await sleep(1800);
  const out = {};

  // ① 三卡头部几何探针:think 头(.reasoning-head)与 tool/compact 头(.au-main)
  //    必须同 padding(10 13)、同瓦片(x=13,w=27)、同标题列(x=51)
  out.iconAlign = await page.evaluate(() => {
    const fixed = 'position:fixed;left:0;top:-9999px;width:640px';
    const host = document.createElement('div');
    host.setAttribute('data-chat-flow-kind', 'assistant-step');
    host.style.cssText = fixed;
    host.innerHTML =
      '<div class="reasoning" data-state="ok"><button type="button" class="reasoning-head">' +
      '<span class="au-ico r-ico"><svg></svg></span><span class="r-title">Think</span>' +
      '<span class="r-live-wrap"><span class="r-sum">…</span></span><span class="chev"><svg></svg></span></button></div>';
    const tool = document.createElement('div');
    tool.className = 'au-tool';
    tool.style.cssText = fixed;
    tool.innerHTML = '<div class="au-main"><span class="au-ico"><svg></svg></span>' +
      '<span class="au-txt"><span class="au-name">grep</span></span><span class="au-chev"><svg></svg></span></div>';
    const comp = document.createElement('div');
    comp.className = 'au-tool au-comp';
    comp.style.cssText = fixed;
    comp.innerHTML = '<div class="au-main"><span class="au-ico"><svg></svg></span>' +
      '<span class="au-txt"><span class="au-name">compact</span></span></div>';
    document.body.appendChild(host); document.body.appendChild(tool); document.body.appendChild(comp);
    const geo = (head, icoSel, titleSel) => {
      const hb = head.getBoundingClientRect();
      const ib = head.querySelector(icoSel).getBoundingClientRect();
      const tb = titleSel ? head.querySelector(titleSel).getBoundingClientRect() : null;
      return {
        padL: +(ib.left - hb.left).toFixed(2),
        icoW: +ib.width.toFixed(2),
        icoH: +ib.height.toFixed(2),
        titleL: tb ? +(tb.left - hb.left).toFixed(2) : null,
        headPad: getComputedStyle(head).padding
      };
    };
    const think = geo(host.querySelector('.reasoning-head'), '.au-ico', '.r-title');
    const toolG = geo(tool.querySelector('.au-main'), '.au-ico', '.au-name');
    const compG = geo(comp.querySelector('.au-main'), '.au-ico', '.au-name');
    host.remove(); tool.remove(); comp.remove();
    return {
      think, toolCard: toolG, compCard: compG,
      allEqual: think.padL === toolG.padL && toolG.padL === compG.padL &&
        think.icoW === toolG.icoW && toolG.icoW === compG.icoW &&
        think.titleL === toolG.titleL && toolG.titleL === compG.titleL
    };
  });

  // ①½ 离屏探针:本环境 compact 插件不可用(/compact 恒 error),运行辉光与
  //     可展开机构无法真实触发 —— 探针验证 CSS 实效(与 think 门禁 sweepParity 同法):
  //     a) 运行态辉光:au-comp 卡 ::after 与工具卡逐字一致;
  //     b) 展开机构:au-open 态 grid 1fr + 内容 opacity 恢复 + chevron 90°;
  //     c) noexp:不可展开态无手型
  out.offlineMachinery = await page.evaluate(() => {
    const fixed = 'position:fixed;left:0;top:-9999px;width:640px';
    const mk = (cls, inner) => { const d = document.createElement('div'); d.className = cls; d.style.cssText = fixed; d.innerHTML = inner; document.body.appendChild(d); return d; };
    const runTool = mk('au-tool', '<div class="au-main"></div>');
    runTool.dataset.state = 'running';
    const runComp = mk('au-tool au-comp', '<div class="au-main"></div>');
    runComp.dataset.state = 'running';
    const cs = (el, pseudo) => getComputedStyle(el, pseudo || null);
    const a = cs(runTool.querySelector('.au-main'), '::after');
    const b = cs(runComp.querySelector('.au-main'), '::after');
    const sweepParity = a.animationName + '|' + a.backgroundImage === b.animationName + '|' + b.backgroundImage
      && b.animationName === 'au-sweep';
    runTool.remove(); runComp.remove();
    const open = mk('au-tool au-comp au-open',
      '<div class="au-main"><span class="au-ico"></span><span class="au-txt"></span><span class="au-chev"></span></div>' +
      '<div class="au-x"><div class="au-clip"><div class="au-in"><div class="_markdown_"></div></div></div></div>');
    const x = open.querySelector('.au-x'), inEl = open.querySelector('.au-in'), chev = open.querySelector('.au-chev');
    const clipH = Math.round(open.querySelector('.au-clip').getBoundingClientRect().height);
    const openState = {
      gridRows: cs(x).gridTemplateRows,
      inOpacity: cs(inEl).opacity,
      chevRot: cs(chev).transform,
      clipH: clipH
    };
    open.remove();
    const noexp = mk('au-tool au-noexp', '<div class="au-main"></div>');
    const noexpCursor = cs(noexp.querySelector('.au-main')).cursor;
    noexp.remove();
    return { sweepParity, openState, noexpCursor };
  });

  // ② 新会话 → 一轮短对话 → /compact → 等压缩卡成稿(最长 120s)
  await page.evaluate(() => { const btn = document.querySelector('button[class*=newSession]'); if (btn) btn.click(); });
  await sleep(900);
  await page.fill('.uV2eYG_input', '只回复两个字:收到');
  await page.keyboard.press('Enter');
  let settled = false;
  for (let i = 0; i < 90 && !settled; i++) {
    await sleep(500);
    settled = await page.evaluate(() =>
      !document.querySelector('.Sxvs8a_root[data-streaming]') && !document.querySelector('.reasoning[data-state=running]'));
  }
  out.firstTurnSettled = settled;

  await page.fill('.uV2eYG_input', '/compact');
  await page.keyboard.press('Enter');
  let runSeen = false, done = false;
  for (let i = 0; i < 240 && !done; i++) {
    await sleep(500);
    const s = await page.evaluate(() => {
      const c = document.querySelector('[data-chat-flow-kind=manual-compaction] .au-tool');
      return c ? c.getAttribute('data-state') : null;
    });
    if (s === 'running') runSeen = true;
    if (s !== null && s !== 'running') done = true;
  }
  out.compactRunSeen = runSeen;
  out.compactDone = done;

  out.compact = await page.evaluate(() => {
    const c = document.querySelector('[data-chat-flow-kind=manual-compaction] .au-tool');
    if (!c) return 'none';
    const main = c.querySelector('.au-main');
    const ib = c.querySelector('.au-ico').getBoundingClientRect();
    const mb = main.getBoundingClientRect();
    return {
      state: c.getAttribute('data-state'),
      radius: getComputedStyle(c).borderRadius,
      headPad: getComputedStyle(main).padding,
      icoPadL: +(ib.left - mb.left).toFixed(2),
      icoW: +ib.width.toFixed(2),
      title: c.querySelector('.au-name') ? c.querySelector('.au-name').textContent : null,
      summary: c.querySelector('.au-sum') ? c.querySelector('.au-sum').textContent.slice(0, 44) : null,
      expandable: !c.classList.contains('au-noexp'),
      officialGone: !document.querySelector('.gdEzaW_compactionRow') && !document.querySelector('._Xvjua_root')
    };
  });

  // 可展开 → 点击展开断言(chevron 旋转 / clip 高度 / MarkdownText 在册)
  if (out.compact !== 'none' && out.compact.expandable) {
    await page.evaluate(() => document.querySelector('[data-chat-flow-kind=manual-compaction] .au-main').click());
    await sleep(650);
    out.compactExpanded = await page.evaluate(() => {
      const c = document.querySelector('[data-chat-flow-kind=manual-compaction] .au-tool');
      return {
        open: c.classList.contains('au-open'),
        clipH: Math.round(c.querySelector('.au-clip').getBoundingClientRect().height),
        hasMarkdown: !!c.querySelector('.au-in div[class*=_markdown_]'),
        chevRot: getComputedStyle(c.querySelector('.au-chev')).transform
      };
    });
    await page.screenshot({ path: 'screenshots/aurum-compact-open.png' });
  }
  await page.screenshot({ path: 'screenshots/aurum-compact-card.png' });
  return JSON.stringify(out, null, 1);
}
