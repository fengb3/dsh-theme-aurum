// P16 门禁:think 卡运行态 —— 折叠壳 + 单行实时流(每换行重播入场);结束自动收拢。
// 触发一轮真实思考(新会话发消息),轮询断言:
//   ① 运行态出现:body 折叠(grid 0fr)、.r-live 带 au-think-in 动画、图标呼吸、官方 QWLzlG 缺席;
//   ①½ P18:收拢态 transition 三元组与工具卡 .au-x 逐字 parity(expParity);
//   ② 换行重播:轮询行文本 + 动画进度,文本换行后 currentTime 回落 = key remount 重播;
//   ③ 运行中可展开:grid 0fr→1fr 非线性插值(过渡中高度 0<h<满高,终态 rows=1fr+opacity 1);
//   ④ 结束(data-state=ok):自动收拢(rows 归 0fr 即使展开过)、摘要 = 首行、正文块 Sxvs8a 在册。
async page => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const out = {};
  await sleep(1500);

  // 新会话 → 发一条会触发思考的消息
  await page.evaluate(() => { const btn = document.querySelector('button[class*=newSession]'); if (btn) btn.click(); });
  await sleep(900);
  await page.fill('.uV2eYG_input', '先认真思考再回答,分三步:9x8 等于多少?为什么?');
  await page.keyboard.press('Enter');

  // ① 等运行态 think 卡(最长 60s)
  let seen = false;
  for (let i = 0; i < 120 && !seen; i++) {
    await sleep(500);
    seen = await page.evaluate(() => !!document.querySelector('[data-chat-flow-kind=assistant-step] .reasoning[data-state=running]'));
  }
  out.runningSeen = seen;
  if (!seen) return JSON.stringify(out);

  out.running = await page.evaluate(() => {
    const r = document.querySelector('[data-chat-flow-kind=assistant-step] .reasoning[data-state=running]');
    const live = r.querySelector('.r-live');
    const cs = live ? getComputedStyle(live) : null;
    const a = live ? live.getAnimations()[0] : null;
    const kf = a ? a.effect.getKeyframes() : null;
    return {
      bodyFolded: (() => { const cs = getComputedStyle(r.querySelector('.reasoning-body')); return cs.display === 'grid' && parseFloat(cs.gridTemplateRows) === 0; })(), // 0fr 解算为 0px
      // P18:与工具卡收合机构对比 —— 页内离屏探针(.au-x 收拢态 transition 三元组逐字相等)
      expParity: (() => {
        const probe = document.createElement('div'); probe.className = 'au-tool';
        probe.style.cssText = 'position:fixed;left:-9999px;top:0';
        const x = document.createElement('div'); x.className = 'au-x'; probe.appendChild(x);
        document.body.appendChild(probe);
        const pc = getComputedStyle(x);
        const tool = pc.transitionProperty + '|' + pc.transitionDuration + '|' + pc.transitionTimingFunction;
        probe.remove();
        const bc = getComputedStyle(r.querySelector('.reasoning-body'));
        return tool === bc.transitionProperty + '|' + bc.transitionDuration + '|' + bc.transitionTimingFunction;
      })(),
      liveText: live ? live.textContent.slice(0, 42) : null,
      animName: cs ? cs.animationName + ' ' + cs.animationDuration : null,
      animCount: live ? live.getAnimations().length : 0,
      animDurationMs: a ? a.effect.getTiming().duration.valueOf() : null,
      opacityFrom: kf && kf.length ? String(kf[0].opacity) : null,        // P16 修订 II:应为 0(全透明)
      opacityTo: kf && kf.length ? String(kf[kf.length - 1].opacity) : null, // P16 修订 II:应为 1(不透明)
      sweepAnim: getComputedStyle(r, '::after').animationName,            // P16 修订 II:应为 au-sweep
      sweepBg: getComputedStyle(r, '::after').backgroundImage.slice(0, 46),
      // P16 修订 II:与工具卡「执行中」辉光实效对比 —— 页内离屏探针(同规则链 computed)
      sweepParityWithTool: (() => {
        const probe = document.createElement('div');
        probe.className = 'au-tool'; probe.dataset.state = 'running';
        probe.style.cssText = 'position:fixed;left:-9999px;top:0';
        const main = document.createElement('div'); main.className = 'au-main';
        probe.appendChild(main); document.body.appendChild(probe);
        const pc = getComputedStyle(main, '::after');
        const tool = pc.animationName + '|' + pc.backgroundImage;
        probe.remove();
        const think = getComputedStyle(r, '::after');
        return tool === think.animationName + '|' + think.backgroundImage;
      })(),
      iconAnim: getComputedStyle(r.querySelector('.r-ico svg')).animationName, icoTileW: Math.round(r.querySelector('.r-ico').getBoundingClientRect().width),
      titleFont: getComputedStyle(r.querySelector('.r-title')).fontFamily.split(',')[0],
      officialGone: !document.querySelector('.QWLzlG_root'),
      rootRadius: getComputedStyle(r).borderRadius
    };
  });
  // ①½ P16 修订 III:头部行垂直对齐 —— 等当前行入场动画播完(steady),五元素中心一致
  let align = null;
  for (let i = 0; i < 40 && !align; i++) {
    const s = await page.evaluate(() => {
      const r = document.querySelector('.reasoning[data-state=running]');
      if (!r) return null;
      const live = r.querySelector('.r-live');
      if (!live) return null;
      const a = live.getAnimations()[0];
      if (!a || a.playState !== 'finished') return null;
      const cy = el => { const b = el.getBoundingClientRect(); return (b.top + b.bottom) / 2; };
      const title = cy(r.querySelector('.r-title'));
      return {
        icoDelta: +(cy(r.querySelector('.r-ico')) - title).toFixed(2),
        liveDelta: +(cy(live) - title).toFixed(2),
        chevDelta: +(cy(r.querySelector('.chev')) - title).toFixed(2)
      };
    });
    if (s) align = s; else await sleep(250);
  }
  out.headAlign = align; // 断言:三个 delta 绝对值 ≤ 1.2px

  await page.screenshot({ path: 'screenshots/aurum-think-running.png' });

  // ② 换行重播检测:同行追加动画进度单调增,换行 remount 后 currentTime 回落;
  //    同时断言 r-live-wrap 全程零横向滚动(P16 修订:不随单行文本量滚动)
  let replay = false, lineChanges = 0, lastTxt = null, lastT = null, maxScrollLeft = 0;
  for (let i = 0; i < 100 && !replay; i++) {
    const s = await page.evaluate(() => {
      const live = document.querySelector('.reasoning[data-state=running] .r-live');
      const wrap = document.querySelector('.reasoning[data-state=running] .r-live-wrap');
      if (!live) return null;
      const a = live.getAnimations()[0];
      return { txt: live.textContent, t: a ? a.currentTime.valueOf() : null, sl: wrap ? wrap.scrollLeft.valueOf() : 0 };
    });
    if (s && lastTxt !== null && s.txt !== lastTxt) {
      lineChanges++;
      if (lastT !== null && s.t !== null && s.t < lastT) replay = true; // 进度回落 = 重播
    }
    if (s) { lastTxt = s.txt; lastT = s.t; if (s.sl > maxScrollLeft) maxScrollLeft = s.sl; }
    await sleep(200);
  }
  out.lineReplay = replay;
  out.lineTextChanges = lineChanges;
  out.maxScrollLeft = maxScrollLeft; // P16 修订断言:恒 0(无横向滚动)

  // ③ 运行中点击展开 → grid 0fr→1fr 非线性插值(P18:与 au-tool 同款收合机构;
  //    修订 VII 撤的是行级级联,容器高度过渡 ≠ 内容级联,两决策并行不悖)
  const stillRunning = await page.evaluate(() => !!document.querySelector('.reasoning[data-state=running]'));
  if (stillRunning) {
    await page.evaluate(() => { const b = document.querySelector('.reasoning[data-state=running] .reasoning-head'); if (b) b.click(); });
    await sleep(140); // 过渡中采样:0<h<满高 = 插值进行中(非线性动画存在)
    out.expandingMid = await page.evaluate(() => {
      const r = document.querySelector('[data-chat-flow-kind=assistant-step] .reasoning');
      const b2 = r ? r.querySelector('.reasoning-body') : null;
      if (!r || !b2) return null;
      return { h: +b2.getBoundingClientRect().height.toFixed(1), rows: getComputedStyle(b2).gridTemplateRows };
    });
    await sleep(660); // .5s 过渡收尾 + 余量
    out.expandedWhileRunning = await page.evaluate(() => {
      const r = document.querySelector('[data-chat-flow-kind=assistant-step] .reasoning');
      if (!r) return null;
      const b2 = r.querySelector('.reasoning-body');
      const cs = getComputedStyle(b2);
      return { open: r.classList.contains('open'), state: r.getAttribute('data-state'), display: cs.display, rows: cs.gridTemplateRows, binOpacity: getComputedStyle(r.querySelector('.r-bin')).opacity };
    });
  }

  // ④ 等思考结束(data-state=ok,最长 180s)→ 自动收拢断言
  let done = false;
  for (let i = 0; i < 360 && !done; i++) {
    await sleep(500);
    done = await page.evaluate(() => {
      const rs = [...document.querySelectorAll('[data-chat-flow-kind=assistant-step] .reasoning')];
      const last = rs[rs.length - 1];
      return last ? last.getAttribute('data-state') === 'ok' : false;
    });
  }
  out.doneSeen = done;
  // ④a P16 修订 VIII:思考结束后正文进入流式窗口 —— 采 [data-streaming] 级联
  //    (think 卡 ok 只是推理完,markdown 块此间陆续挂载;轮询最长 30s)
  if (done) {
    let liveCascade = null;
    for (let i = 0; i < 60 && !liveCascade; i++) {
      liveCascade = await page.evaluate(() => {
        const roots = [...document.querySelectorAll('[data-chat-flow-kind=assistant-step] .Sxvs8a_root[data-streaming] div[class*=_markdown_]')];
        const last = roots[roots.length - 1];
        if (!last || !last.children.length) return null;
        const kids = [...last.children];
        const delays = kids.map(k => parseFloat(getComputedStyle(k).animationDelay));
        return {
          blockCount: kids.length,
          animName: getComputedStyle(kids[0]).animationName, // 应为 au-think-in
          firstDelays: delays.slice(0, 4), // 应含 0 / 0.07 递增(s)
          delaysMonotonic: delays.every((d, i) => i === 0 || d >= delays[i - 1])
        };
      });
      if (!liveCascade) await sleep(500);
    }
    out.streamingCascade = liveCascade || 'not-sampled';
  }
  // ④½ P16 修订 VIII:think 卡 ok 只代表推理结束,正文可能仍在流式 —— 等
  //     整个 assistant 节点结算(.Sxvs8a_root[data-streaming] 全部摘除)
  let settled = false;
  if (done) {
    for (let i = 0; i < 240 && !settled; i++) {
      await sleep(500);
      settled = await page.evaluate(() => !document.querySelector('[data-chat-flow-kind=assistant-step] .Sxvs8a_root[data-streaming]'));
    }
  }
  out.turnSettled = settled;
  if (done) {
    out.done = await page.evaluate(() => {
      const rs = [...document.querySelectorAll('[data-chat-flow-kind=assistant-step] .reasoning')];
      const r = rs[rs.length - 1];
      const sum = r.querySelector('.r-sum');
      const body = r.querySelector('.reasoning-body');
      return {
        autoCollapsed: !r.classList.contains('open'), // 类级自动收拢;视觉 0fr 归零由 settledStatic.thinkBodyRows 断言(解算 0px)
        sumText: sum ? sum.textContent.slice(0, 42) : null,
        liveGone: !r.querySelector('.r-live'),
        textBlockRendered: !!document.querySelector('[data-chat-flow-kind=assistant-step] .Sxvs8a_root'),
        officialGone: !document.querySelector('.QWLzlG_root')
      };
    });
    await page.screenshot({ path: 'screenshots/aurum-think-done.png' });

    // ⑤ P16 修订 VIII:结算后零重播(仅在 turnSettled 后断言)—— data-streaming
    //    摘除,markdown 块 animationName 全为 none(结算重挂载直接静态呈现);
    //    thinking 展开体同样无动画。markdown 根带重试(streaming⇄成稿换树一瞬
    //    可能查空,稳态必在 —— tmp-settled-dump 实测)
    if (settled) {
      let st = null;
      for (let i = 0; i < 8 && !st; i++) {
        st = await page.evaluate(() => {
          const roots = [...document.querySelectorAll('[data-chat-flow-kind=assistant-step] .Sxvs8a_body div[class*=_markdown_]')];
          const last = roots[roots.length - 1];
          if (!last || !last.children.length) return null;
          const kids = [...last.children];
          const anims = kids.map(k => getComputedStyle(k).animationName);
          const rs = [...document.querySelectorAll('[data-chat-flow-kind=assistant-step] .reasoning')];
          const thinkBody = rs.length ? rs[rs.length - 1].querySelector('.reasoning-body') : null;
          return {
            blockCount: kids.length,
            animAllNone: anims.every(a => a === 'none'), // 修订 VIII 断言:结算后不重播
            anyStreamingAttr: !!document.querySelector('[data-chat-flow-kind=assistant-step] .Sxvs8a_root[data-streaming]'), // 应为 false
            thinkBodyAnim: thinkBody ? getComputedStyle(thinkBody).animationName : null, // 应为 none(容器是 transition 非动画)
            thinkBodyRows: thinkBody ? getComputedStyle(thinkBody).gridTemplateRows : null, // P18:结算后收拢应归 0fr
            thinkLineEls: rs.length ? rs[rs.length - 1].querySelectorAll('.r-line').length : -1 // 应为 0
          };
        });
        if (!st) await sleep(500);
      }
      out.settledStatic = st || 'no-markdown';
      await page.screenshot({ path: 'screenshots/aurum-think-done-open.png' });
    }
  }
  return JSON.stringify(out);
}
