# dsh-theme-aurum · 逐步构建路线图

以 `prototype/dsh-agent-workspace.html`(下称「原型」,仓库内副本)为唯一视觉基准,
按阶段逐步把 DSH Web 换成鎏金皮肤。每一阶段 = 原型的一个编号章节,独立可交付、可验证、可回退。

## 总原则(每阶段必须遵守)

0. **无描边原则(P8b 起为设计铁律)**:原型 `--border/--border-soft` 全透明,一切分隔靠
   面色 tint / 阴影 / 透明度差实现,任何元素不得出现可见描边。注意:官方默认主题在 body 层
   定义 `--dsw-alias-border-*`(实测解析为 `rgba(255,255,255,.12)`),主题 token 无法覆盖,
   必须**直写元素级 transparent**(侧栏/详情栏/输入卡子树已有一揽子
   `border-color:transparent!important` 扫除规则;会话流内 au-* 类逐个字面量 transparent)。
   属性子串选择器必须收紧到标签限定(如 `button[class*=newSession]`),否则会同时命中
   `hHd-Xa_newSessionLabel` 之类的官方子类,产生双伪元素等诡异缺陷。

1. **卡片即容器**:凡是原型里带圆角/阴影的浮卡,样式必须落在「承载内容的那个元素」上,
   并带 `overflow:hidden`。绝不许用 `::before` 画一层卡再把内容铺到卡外 —— P8 之前的教训:
   内容根有内联 `width:280px`,列横向 padding 为 0,行/hover 态整体超出卡片圆角 12px。
2. **不与内联样式拔河,要顺势**:官方宽度/状态由 React 内联样式驱动(grid-template-columns、
   width)。需要覆盖时用 `width:auto!important` 让内容「填充」而非「固定」,拖拽调宽即自动跟随。
   优先 `width:auto`,避免写死像素。
3. **每阶段收尾跑「几何门禁」**(playwright-cli,脚本已备):
   - `verify-gate.js` — 展开/折叠两态:卡片 rect 对原型(±1px)、递归零溢出;
   - `verify-p8b.js` — 无描边审计:伪元素加号唯一 + 子树可见边框数为 0;
   - 容器 `scrollWidth == clientWidth`(无横向滚动);拖拽调宽手动补测一次。
4. **部署同步**:`client.js` 在 `C:\Users\fengb\.dsh\profiles\web\node_modules\dsh-theme-aurum\`
   是硬链接,但**每次编辑都会断链**。编辑后必须执行 `./sync-deploy.ps1`,再 reload 页面验证。
5. **遮蔽注册而不是删除**:官方组件一律 `priority:-1` 遮蔽(插件停止即还原官方),槽位
   (`sidebar.settings` / `sidebar.footer.action` / `settings.general.item`)保持兼容,给其他插件留活口。
6. 每阶段在 `client.js` 头注释追加一段 `── Pn · ……` 说明改动与实测数据。

7. **原型恒等映射流水(P9 起,消灭双重翻译返工)**:此前「HTML→手写 createElement + 类名
   双轨(.s-row→.au-srow,CSS 人工重译变量)」每次视觉对齐都要人肉同步两边,是返工大头。
   自 P9 起:
   - **结构**:把 `vendor/htm.js`(htm@3.1.1 官方 mini UMD,~1.2KB)内联进 client.js 头部,
     `htm.bind(React.createElement)` 后用 tagged template 写组件 —— 与原型 HTML 逐字同构,
     原型片段贴进来只把静态文本换 `${}` 绑定、补 `onClick`。产物仍是真实 React element,
     hooks/槽位注册全部照旧,不是 innerHTML;
   - **类名与变量**:自建组件一律沿用原型类名与 CSS 变量(`.turn-tail`/`--gold`…),CSS 从原型
     **整段拷贝**,仅做两个固定机械替换:`:root`→`body[data-ds-dark-theme]`、
     `html[data-theme="light"]`→`body:not([data-ds-dark-theme])`。「原型→实现」映射恒等,
     视觉对齐从肉眼截图降级为文本 diff;
   - **验证**:`verify-proto-diff.js` 双页门禁 —— 同 selector 在原型页与实况页各量 rect/字号,
     自动断言 ±1.5px;selector 随阶段填入;
   - **边界**:存量 au-*(P6–P8 侧栏)不迁移(翻新即返工);官方 DOM 上的 CSS 瞄准(混淆类名)
     仍走 CSS1 数组,与原型 CSS 两轨隔离不混流;类名落地前查与官方全局类冲突
     (官方是 `hHd-Xa_*` 前缀,预期无冲突,真撞了套 `.au-root` 容器作用域)。

## 阶段总览

| 阶段 | 原型章节 | 内容 | 手段 | 状态 |
|---|---|---|---|---|
| P1–P4 | §1–§3 | 主题令牌 aurum-dark/light、点阵画布+金辉、字体、输入卡金圈 | theme 服务 + 全局 CSS | ✅ |
| P5 | §5 | 用户气泡、◈上下文行、9 类工具卡 | conversation.chat.node / tool.call.toolview | ✅ |
| P6–P7 | §4 | 左栏会话浏览器整体重写(目录头/分组/状态槽/搜索/平铺) | sidebar.workspaces 遮蔽 | ✅ |
| P8 | §4 | 侧栏几何修正:卡片即容器,零溢出 | CSS(列留白+根卡片化) | ✅ |
| **P8c** | **§4 残差** | **侧栏残留差异:折叠 56 细条、rail-logo 淡切、拖拽排序、行/视图菜单形态** | **CSS + AuBrowser 补齐** | **✅** |
| P9 | §5 | 会话流尾部节点:turn-tail/compress/retry/err/max-tokens + md 装饰 + 头像 + 列宽712 + sh-head/tabs + reasoning 皮肤 | htm 恒等映射 + CSS 瞄准 | ✅ |
| P10 | §6 | 输入坞全面接管:todo 进度条、chips、命令/模式/模型菜单、ctx-ring 圆环+面板、金色 send、c-stats | CSS + composer 槽位 | ⬜ |
| P11 | §7 | 工具卡补全:subagent/workflow/goal/ask/interrupt/job_* 等剩余类型 + 子调用缩进 + 统计尾注 | tool.call.toolview 补 key | ⬜ |
| P12 | §8 | Trajectory 瀑布图(若 DSH 有对应视图则映射,无则跳过) | 视图槽位 | ⬜ |
| P13 | §9 | hero 新会话居中态、菜单/Toast/scrim 金色化、设置弹窗左导航双栏 | CSS + settings 槽位 | ⬜ |
| P14 | §10 | 响应式:≤1024 抽屉侧栏、≤820/≤640/≤480 降档 | @media | ⬜ |
| P15 | 验收 | 全量截图 vs 原型逐节 diff + 三态几何门禁全绿,发版 1.1.0 | 验收 | ⬜ |

## 现状 vs 原型 · 逐节差异盘点(2026-08-24 复核)

> 对照原型 §1–§10 与 `client.js`(P1–P8b)逐节复核的结果,是 P8c–P14 的施工依据。
> 标记:✅ 已对齐 · ◐ 部分对齐 · ⬜ 缺失。
> 自 P9 起新增组件按总原则第 7 条「恒等映射流水」施工 —— 下列原型类名可直接当作
> `verify-proto-diff.js` 的 selector 与 CSS 拷贝源,无需再翻译成 au-* 体系。

### §1–§3 令牌 / 基础 / 骨架

- ✅ oklch 金粉双主题令牌、点阵画布(24px 栅距)、四族字体、
  `::selection` 金、`:focus-visible` 金 outline、`prefers-reduced-motion` 降级。
- ✅ 背景去晕染(2026-08-24 用户决策,偏离原型):body 只留底色+点阵,撤金辉/玫粉
  radial 两层 —— 此前两片晕染横向压在主区(50%/-12%、88%/112%),侧栏区没有,
  造成左右分界、主区浑浊;sh-head 渐隐纱同步撤(background:none);输入卡由官方
  solid input-major 换 surface 半透明(深 70%/浅 82%),点阵隐约透过。
- ✅ 侧栏浮动卡(264px、radius 20、渐变面+阴影、`overflow:hidden`)、折叠细条卡片化。
- ◐→✅ 滚动条(P9 已做):10px 宽 / thumb 26% 透明度 / hover 金,几何按原型微调。
- ◐→✅ 栏头同轴机制(P9 近似):侧栏 logoRow 58px + sh-head 换皮;官方双行带(82px 实测)
  vs 原型 70 单行,中心线差约 12px —— 结构性残差,接受(重排=DOM 手术)。
- ✅ 详情栏去留(已决策 2026-08-24):**去除右侧详情栏**,详情并入工具卡,在 P11 执行
  (原型本就取消右栏,§7 注释「原详情栏内容并入卡片」;隐藏走 CSS 收宽,不动官方注册)。

### §4 侧栏(P8+P8c 已对齐,2026-08-24 实测)

- ✅ 折叠细条宽度:折叠卡 `56×876@(12,12)` r17,与原型 `.app.no-sb .sidebar{width:56}` 一致;
  轨道覆写 68px(12 留白+56 卡,与官方内联同形 px/minmax/px,0.3s grid 过渡正常插值),
  卡几何直写 56+margin12(折叠轨为常量,与拖拽调宽无拔河)。
- ✅ 折叠过渡(近似):React 重挂载使主内容⇄细条无法同元素交叉淡切,以挂载动画近似
  (rail 淡入 .26s .18s / wide 淡入 .22s .2s),宽度动画交官方 grid 过渡。
- ✅ rail-logo 交叉淡切:悬停「鲸鱼⇄展开面板」透明度+缩放互切,点击展开(实测鲸鱼 21px)。
- ✅ 细条按钮组:logo / 新建(金 tint,当前工作区)/ 搜索(展开后 300ms 聚焦搜索框)/ flex;
  底部设置/主题为官方壳收 40px 方钮。
- ✅ 会话行拖拽排序:drop-before/after 金线 + .dragging 半透明,持久化走
  `workspacesSvc.insertSessionBefore`(合成 DragEvent 全链实测 DOM 序翻转)。
- ✅ 行操作形态(已决策落地):原型浮动菜单 `.menu/.mi/.mk/.menu-sep`(fixed 免卡裁切),
  会话=重命名(F2)/分支/归档(danger),目录=重命名/删除(二次确认);置顶/导出无 DSH API
  不渲染;F2 悬停行重命名;点外/Esc 关闭。
- ✅ 视图选项:排序三态(最近活动/名称/手动序,默认手动序=服务端真实顺序)+ 平铺开关;
  导出目录无 API 记「不适用」。
- ◐ 品牌字标:原型 DSH wordmark SVG 182×24 + 金 badge;当前官方 brand(高 22px)。
  微残差,并入 P13 一并处理。
- ✅ 行操作形态(已落地):对齐原型浮动菜单(重命名 F2/分支/归档 danger + 分隔线 +
  mk 快捷键列),菜单项按 DSH 实际 API 映射,置顶/导出无 API 不渲染。
- ✅ 视图选项(已落地):视图菜单含排序三态(最近活动/名称/手动序)+ 平铺开关;
  导出全部目录无 API 记「不适用」。
- ◐ 品牌字标:原型 DSH wordmark SVG 182×24,尾部带金色 badge(反白小字);当前用官方
  brand(高 22px),badge 形态不同。微残差,并入 P13 一并处理。

### §5 会话流(P5+P9 已对齐)

- ✅ 用户气泡(右对齐、22px 圆角、金渐变 tint、≤525px/82%)、◈ 上下文行、图片附件。
- ⬜→记「不适用」◈ 行 in-tok 标注:DSH context 节点数据无 token 计数,无法标注(2026-08-24)。
- ✅ sh-head 主区标题栏(2026-08-24,CSS 瞄准 wSkVaW_*):渐隐底、DISPLAY 18.5 标题
  (Cormorant 实测)、mono 弱化 chips、tabs 胶囊右置金 on(官方本就有对话/轨迹 tabs)。
  残差:官方=76px 双行带 vs 原型 70 单行浮头,同轴机制以双行近似(重排=DOM 手术,不做)。
- ✅ assistant 节:鲸鱼头像(P9 纯 CSS mask)+ reasoning 折叠段(2026-08-24,官方
  ReasoningRow QWLzlG_* CSS 换皮:surface 卡 r12 + mono 头 + serif italic 体 + 虚线分隔 +
  金扫光;官方 disclosure 交互原样保留)+ a-actions 悬停操作(P9 turn-tail 内)。
- ✅ md 装饰(P9):衬线正文、li ◆ 金点、code 金 pill、ul/ol 去官方 padding。
- ✅ compress/row-err/row-retry/turn-tail(P9);typing 三金点→记「不适用」
  (官方无独立 typing 行,运行态由 ReasoningRow/工具卡扫光承载)。
- ✅ 入场节奏(P9):逐节点阶梯 rise。

### §6 输入坞(→ P10,当前仅 composer 金圈 focus)

- ⬜ input-zone/iz-inner:812px 居中列 + 8/28/14 padding。
- ⬜ dock·todo-bar:「清单」label + n/m 计数 + `goal-track` 130px 进度条(金→玫渐变填充、
  .8s 过渡)+ todo-items 胶囊(done 删除线 / now 金 tint 脉冲点)。
- ⬜ chips 附加上下文胶囊(金 tint、✕ hover 变红)。
- ⬜ c-tools 行:cmd 命令方钮 + cmdMenu(斜杠命令列表,mono 名+说明);mode 工作模式钮 +
  菜单(read only / workspace write / full access,图标+meta+✓);model 模型钮 + 菜单;
  `ctx-ring` 31px 上下文圆环(进度弧金色、≥80% 变玫 `.hot`,title 带 token 数)+ 点开的
  **ctxPanel 构成面板**(23px DISPLAY 大数字 + 三段构成条 sys/tools/msgs + 图例行);
  send 34×34 金渐变方钮(gold-ink 图标、禁用 opacity .35)。
- ⬜ c-stats 统计行(轮/步 · LLM/工具时长 · 首 token/tok/s · 缓存命中 · 输入输出 token,
  mono 10.5px、`|` 分隔)。

### §7 工具卡(9 类已接管,残差 → P11)

- ✅ grep/read/edit/write/todo_write/web_search/web_fetch/pwsh/bash 卡片框架
  (药丸状态 + grid 展开插值 + 运行中金色扫光 + 详情体:diff/term/gline/todo/s-res)。
- ◐ 尾注形态:原型 `.t-foot` 是 mono **统计尾注**(命中数/耗时/tokens/重试次数);当前
  `au-foot` 是「打开文件/在轨迹中查看」操作链接行。可并存:统计左、操作右。
- ⬜ 剩余工具类型:subagent/workflow/goal/ask_user_question/interrupt_agent/job_* 等按 DSH
  实际 tool 名补 key,复用 AuToolCard 框架兜底。
- ⬜ tool-kids 子调用列表:原型缩进 19px + 左竖线 13px、kid 行 hover、`k-sum` 右对齐摘要
  (subagent/后台 job 的嵌套调用映射到这里)。

### §8 Trajectory(→ P12)

- ⬜ tabs「轨迹」视图 + 瀑布图:`traj-grid`(118px 标签列 + lane 行)、lane 26px 条带底
  (1/6 刻度线)、`tbar` 金/玫/danger/think 斜纹四态、图例、尾注(峰值上下文/缓存命中/最长调用)。
  前置:确认 DSH 是否有等价轨迹/统计视图槽,无则记「不适用」。

### §9 全局浮层(→ P13)

- ⬜ hero 新会话空态:`conversation.is-hero` —— session-body 隐藏、input-zone 垂直居中、
  `hero-stack` 760px、`hero-glow` 金辉光斑、`hero-headline`(33px DISPLAY + 「预览版」badge)、
  工作区/Agent 预设双胶囊菜单(hero-menu,mi sel 金)、hero-foot 返回链接;新会话时 dock/c-stats 隐藏。
- ⬜ 通用 menu 金色化:radius 13 + surface-2 + `mi` hover 金 tint + danger 红 + `mk` 快捷键列
  + menu-sep。当前菜单仅靠 token 换色。
- ⬜ toast:fixed 底部 100px 居中、surface-2、radius 12、.3s 上滑。
- ⬜ 设置弹窗:原型=屏幕居中 `set-modal`(mask blur 3px)+ `set-dialog` 680×424 双栏
  (188px 左 nav:通用/模型/插件/Agent 预设,pane 切换记忆 localStorage,≤640 折叠为顶部横 nav);
  当前=官方设置面板 + 注入的 AurumSettingsRow 段选。差异最大的一块。
- ◐ scrim 遮罩:官方已有同类(色彩经 token 对齐即可)。

### §10 响应式(→ P14)

- ⬜ ≤1024:侧栏 fixed 抽屉(top/left/bottom 10、translateX 滑入)+ scrim + burger 显示 ——
  先检查 DSH 移动端结构是否已有抽屉,有则只换皮。
- ⬜ ≤820:sh-head 收 padding、flow/traj 收边距、hero 缩(25px/210px)、traj-grid 92px、lane 22px。
- ⬜ ≤640:标题 16px、tab/bubble 90%、goal-track 64px、c-stats 分隔收窄。
- ⬜ ≤480:seg 缩、mode/model 钮折叠为 m-chip 双字码、todo-bar 整行、`t-name em` 隐藏、tx 缩。

## P8 实测记录(2026-08-24,基准门禁样例)

- 展开:卡片 `264×696 @ (12,12)`,radius 20,`overflow:hidden`,递归零溢出,无横向滚动;
- 折叠:卡片 `40×696 @ (8,12)`,radius 17,newSession/footRow 均 40px 方钮,零溢出;
- 拖拽:列 340px → 卡 324px,零溢出(width:auto 跟随);
- 原型同页实测:`.sidebar 264×696 @ (12,12)` —— 完全一致(±1px 来自原型透明 border)。
- 注:折叠宽度 40 ≠ 原型 56,已列入 P8c 残差(见 §4 盘点)。

## 各阶段要点

### P8c · 侧栏残差(原型 §4)✅ 2026-08-24
**实测**:折叠卡 `56×876@(12,12)` r17(railNew leftPad=8 对齐原型);展开/回展 264@(12,12) 无损;
浮动菜单 items=[重命名F2/分支/归档]+sep+danger、Esc 关闭、F2 行内改名聚焦、视图菜单 4 项
manual✓;拖拽合成 DragEvent 全链 reorder 持久化(insertSessionBefore);aurum-light 同门禁全绿
(用户默认即浅色)。verify-p8c.js 为功能门禁、verify-gate.js 三态复跑零溢出。
- 折叠细条 40→56px(rail 钮 40 居中、左右 8 留白),展开⇄折叠宽度过渡 + 主内容⇄细条交叉淡切(挂载动画近似);
- rail-logo 悬停「鲸鱼⇄展开面板」交叉淡切,点击展开;细条补新建/搜索钮(展开+300ms 聚焦);
- 会话行拖拽排序(drop 金线落点);
- 决策已落地:行操作=原型**浮动菜单**(`.menu/.mi` + mk 快捷键列),菜单项按 DSH 实际 API
  映射(重命名/分支/归档实义;置顶/导出无 API 不渲染);视图选项补排序(最近活动/名称/手动序)。

### P9 · 会话流非工具节点(原型 §5)—— 恒等映射流水首个试点 ✅(残留 2026-08-24 收口)
**已完成(2026-08-24,双页门禁 failures=0)**:htm 内联 + CSS3 原型变量组;turn-tail /
compaction / model-retry / turn-error / turn-max-tokens 五类节点接管;md 装饰(◆ 金点、
inline code 金 pill、:is(ul,ol) 去官方 18px padding);assistant 鲸鱼头像(纯 CSS mask);
列宽 712 对齐;逐节点阶梯 rise;滚动条几何;主题激活竞态修复(0/1200ms 重断言)。
实测:row-retry 712=712 · md li 666=666 · inline code h19=19;侧栏几何回归无损。
**残留收口(2026-08-24,双主题实测)**:sh-head 换皮完成(wSkVaW_* CSS 瞄准:渐隐底 +
Cormorant 18.5 crumb + mono chips + tabs 胶囊右置金 on);reasoning 折叠段完成
(QWLzlG_* CSS 换皮:surface 卡 r12 + mono 头 + serif italic 体 + 虚线分隔 + 金扫光,
官方 disclosure 交互保留);typing 三金点与 ◈ in-tok 记「不适用」(官方无独立 typing 行、
context 节点无 token 数据);浅色 --font-* 四族补齐。verify-head.js / verify-darkskin.js
为对应门禁;全套回归(gate/p8b/p8c/proto-diff)零溢出 failures=0。
- 前置(P9 首日)已兑现:`vendor/htm.js` 内联;body 级注入原型 §1 变量组;
  `verify-proto-diff.js` SELECTORS 已填 P9 清单。试点流水跑通,P10+ 复制此流水。
- sh-head 浮动渐变头(高 70=12+58,与侧栏品牌行同轴)+ DISPLAY 标题 + mono meta + tabs 胶囊;
- assistant 节接管:金鲸鱼头像、reasoning 折叠段(serif italic)、a-actions 悬停(复制/分支);
- md 装饰:li ◆ 金点、code 金色 pill、hl、text-wrap:pretty;◈ 行补 in-tok 标注;
- 尾部节点:turn-tail、typing 三点、compress 折叠段、row-err/row-retry;
- 逐 node 阶梯 rise 入场(75ms/节点);滚动条几何按原型微调。
- 全部走 `conversation.chat.node` 的 key 遮蔽,与 P5 的 user/context 同文件组件化;
- 门禁:节点 max-width 不超 `.flow` 内容宽(768px),pill/run 动画不产生横向滚动。

### P10 · 输入坞(原型 §6,工作量最大)
- 现状只有 `[data-composer-card]` 金圈 focus;原型还有:todo-bar(进度 goal-track 金→玫渐变)、
  chips、命令/模式/模型菜单、ctx-ring 上下文圆环(点开构成面板)、send 金渐变方钮、c-stats 行;
- 先做纯 CSS(send/seg/chips 圆角金 tint),再评估 ctx-ring/命令菜单是否接 composer 槽位注册;
- 门禁:输入坞在 480/640/820/1280 四档宽度下均不横向溢出,send 钮禁用态 opacity .35。

### P11 · 工具卡补全(原型 §7)
- 已覆盖 9 类;剩余按 DSH 实际 tool 名补 key(subagent、workflow、goal、ask_user_question、
  interrupt_agent、job_* 等),复用 AuToolCard 框架(药丸状态+grid 展开插值);
- 子调用 tool-kids(缩进+左竖线+k-sum);t-foot 统计尾注(命中/耗时/tokens)与操作链接并存;
- 决策已定(2026-08-24):**去除右侧详情栏**,详情并入工具卡(CSS 收宽隐藏,不动官方注册);
- 门禁:长路径 `word-break:break-all` 不撑卡;运行中扫光不越卡边界。

### P12 · Trajectory(原型 §8)
- 先确认 DSH 是否有等价轨迹/统计视图槽;有则映射 lane/tbar 金玫配色,无则记入「不适用」跳过。

### P13 · 全局浮层(原型 §9)
- 菜单(menu/mi)、Toast、scrim、设置弹窗(set-modal 左导航双栏,≤640 折叠为顶部横nav);
- hero 空态:居中 composer 栈 + hero-glow 金辉 + 徽标字 + 工作区/预设胶囊;
- 注意浮层挂 body 层,不受卡片 overflow:hidden 裁切(原型注释同样强调)。

### P14 · 响应式(原型 §10)
- ≤1024:侧栏变 fixed 抽屉(transform 滑入,burger 显示)——需检查 DSH 移动端结构是否已有抽屉,
  有则只换皮;≤820/≤640/≤480 逐档收 padding、字号、隐藏次要文字;
- 门禁:每档 360–1920 拖一遍无横向滚动、无元素越出对应卡片。

### P15 · 验收发版
- 原型与实况同 viewport 截图,逐节 ui-diff + `verify-proto-diff.js` 全绿 + 三态几何门禁全绿
  → version 1.1.0,更新 README。
