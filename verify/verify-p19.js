async page => {
  /* P19 · 添加工作区按钮改走系统目录选择框 —— 静态断言(展开态侧栏):
     1) 按钮在册:title/aria=添加工作区、au-ws-ibtn 图标钮类、可见;
     2) 默认无手动输入行(.au-ws-addrow 不渲染)。
     交互链路(host 原生对话框弹出 → 选中 create / 取消静默 / 不可用回退输入行)
     需桌面手动点验:headless 下点击会触发 host 原生文件夹选择框并阻塞 RPC,
     无法自动断言,故此处只验静态结构,绝不在脚本里点击该按钮。 */
  await page.waitForTimeout(600);
  const out = await page.evaluate(() => {
    const btn = document.querySelector('button.au-ws-ibtn[title="添加工作区"]');
    return {
      btn: btn ? {
        title: btn.getAttribute('title'),
        aria: btn.getAttribute('aria-label'),
        cls: btn.className,
        visible: btn.offsetParent !== null
      } : null,
      addrowDefault: document.querySelector('.au-ws-addrow') !== null
    };
  });
  const failures = [];
  if (!out.btn) failures.push('add-workspace button missing');
  else {
    if (out.btn.title !== '添加工作区') failures.push('title=' + out.btn.title);
    if (out.btn.aria !== '添加工作区') failures.push('aria=' + out.btn.aria);
    if (out.btn.cls.indexOf('au-ws-ibtn') === -1) failures.push('cls=' + out.btn.cls);
    if (!out.btn.visible) failures.push('button not visible');
  }
  if (out.addrowDefault) failures.push('.au-ws-addrow rendered by default');
  return { failures, out, pass: failures.length === 0 };
}
