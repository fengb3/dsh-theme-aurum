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
| P10 | §6 | 输入坞全面接管:todo 进度条、chips、命令/模式/模型菜单、ctx-ring 圆环+面板、金色 send、c-stats | CSS + composer 槽位 | ✅ |
| P11 | §7 | 工具卡补全:subagent/workflow/goal/ask/interrupt/job_* 等剩余类型 + 子调用缩进 + 统计尾注 | tool.call.toolview 补 key | ✅ |
| P12 | §8 | Trajectory 瀑布图(若 DSH 有对应视图则映射,无则跳过) | 视图槽位 | ⏭ 跳过(用户决策 2026-08-24) |
| P13 | §9 | hero 新会话居中态、菜单/Toast/scrim 金色化、设置弹窗左导航双栏 | CSS + settings 槽位 | ✅ |
| P14 | §10 | 响应式:≤1024 抽屉侧栏、≤820/≤640/≤480 降档 | @media | ✅ |
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
- ✅ 品牌字标(P15 前修订收口,2026-08-24):维持官方 brand SVG,布局锚点修正
  (详见 §4 盘点同条)。
- ✅ 行操作形态(已落地):对齐原型浮动菜单(重命名 F2/分支/归档 danger + 分隔线 +
  mk 快捷键列),菜单项按 DSH 实际 API 映射,置顶/导出无 API 不渲染。
- ✅ 视图选项(已落地):视图菜单含排序三态(最近活动/名称/手动序)+ 平铺开关;
  导出全部目录无 API 记「不适用」。
- ✅ 品牌字标(P15 前修订收口,2026-08-24):squish 根因 = P6 裸 [class*=brand]
  命中官方三个子 span(铁律 6 二次翻车)。修正后按原型 .sb-brand 锚点:字标 svg
  flex:none 定内在尺寸 156×24 永不收缩,窄卡按钮裁尾,<236px 卡宽容器查询隐藏
  只留鲸鱼;鲸鱼贴左间隔 8、字标 0 偏移满尺寸、官方高度 24 恢复。实测三档全过。

### §5 会话流(P5+P9 已对齐)

- ✅ 用户气泡(右对齐、22px 圆角、金渐变 tint、≤525px/82%)、◈ 上下文行、图片附件。
- ⬜→记「不适用」◈ 行 in-tok 标注:DSH context 节点数据无 token 计数,无法标注(2026-08-24)。
- ✅ sh-head 主区标题栏(2026-08-24,CSS 瞄准 wSkVaW_*):渐隐底、DISPLAY 18.5 标题
  (Cormorant 实测)、mono 弱化 chips、tabs 胶囊右置金 on(官方本就有对话/轨迹 tabs)。
  残差:官方=76px 双行带 vs 原型 70 单行浮头,同轴机制以双行近似(重排=DOM 手术,不做)。
  P15 前修订(2026-08-24):header 改两列 grid + titleRow display:contents ——
  行2 = [tabs …… utilities] 同行左右排布(实测 sameRow、gap 34),不再右侧堆叠。
- ✅ assistant 节:鲸鱼头像(P9 纯 CSS mask)+ reasoning 折叠段(2026-08-24,官方
  ReasoningRow QWLzlG_* CSS 换皮:surface 卡 r12 + mono 头 + serif italic 体 + 虚线分隔 +
  金扫光;官方 disclosure 交互原样保留)+ a-actions 悬停操作(P9 turn-tail 内)。
- ✅ md 装饰(P9):衬线正文、li ◆ 金点、code 金 pill、ul/ol 去官方 padding。
- ✅ compress/row-err/row-retry/turn-tail(P9);typing 三金点→记「不适用」
  (官方无独立 typing 行,运行态由 ReasoningRow/工具卡扫光承载)。
- ✅ 入场节奏(P9):逐节点阶梯 rise。

### §6 输入坞(P10 已对齐,2026-08-24)

- ✅ 底栏画布清洁(2026-08-24,续「背景去晕染」):撤 composerSeat 官方滚出渐隐纱
  (active 相位 36px 渐变+实底,特异性反超),点阵直通视口底部;输入卡最终 **solid
  surface 实色**(用户明确不要半透明;实测 alpha=1,bgscan.mjs 像素级验证画布顶/底
  漂移=0,双主题)。
- ✅ 结构盘点:官方 composerStack=[conversation.input.dock 条目, 输入卡, 卡内 footer];
  input.dock 恰在卡上方(=原型 .dock 位),footer=StatsLine(=原型 .c-stats 位)。
- ✅ dock·todo-bar(AuTodoBar htm 恒等映射,遮蔽官方 TodoDock id=todo):「清单」+
  n/m 计数 + goal-track 130px 金→玫渐变进度条(宽=done/total%)+ todo-items 胶囊
  (done 删除线 / now 金 tint 脉冲点)。CSS3 §6 整段拷贝;唯一适配:flex:1→flex:none
  +官方 lXshSW 同形几何(官方 dock 区是 column-flex,flex:1 会纵向拔高)。
- ✅ dock·goal 条(nLMEza_*)/queue 条(_7yHdaG_*)CSS 换皮:todo-bar 半透明面
  (深 oklch(20% .016 328 / .5)/浅 .8)+ mono label + 金 hover + 无描边。
- ✅ 输入卡内部(uV2eYG_*):textarea/mirror/backdrop 三件套 14.5/1.7(防 caret 错位);
  mention 芯片(uV2eYG_chip)金 tint = 原型 .chips 对应物;add 命令钮 r10 金 hover
  (原型 .c-btn.sq,几何 28px 官方不动);mode 钮(Sh0Q9G_*)/model 钮(_7KE1Ra_*)
  mono 11 + 金 hover;model 菜单 surface-2 r13 + 金 option hover/check。
- ✅ ctx-ring/ctxPanel(官方 ContextMeter JObwrW_* 与原型同构:圆环+点击展开构成面板):
  金弧 2.6 / 面板 DISPLAY 23px 大数字 pct / 三段条 sys=fg40%·tools=玫·msgs=金 /
  圆 swatch / 图例行。⚠️「≥80% 变玫 .hot」记不适用 —— CSS 无法读 dasharray 占用率。
- ✅ send(uV2eYG_primary 官方本就 34×34)→ 原型 .send 金渐变 r12 + disabled .35 +
  浅色反白 ink;运行态(stop 方块图标)同皮。
- ✅ c-stats(官方 StatsLine FJxK0a_*)→ mono 10.5 / 字距 .04em / `|` 分隔弱化。
- ⬜ cmdMenu 斜杠命令列表形态(官方命令菜单由通用 Popmenu 渲染):与 §9 通用菜单
  金色化同源,并入 P13 一并处理(点 add 钮展开的菜单即其形态)。

### §7 工具卡(P11 已对齐,2026-08-24)

- ✅ 9 类特判卡(grep/read/edit/write/todo_write/web_search/web_fetch/pwsh/bash:
  药丸状态 + grid 展开插值 + 运行中金色扫光 + 详情体 diff/term/gline/todo/s-res)。
- ✅ **未知工具兜底卡(2026-08-24 用户要求)**:官方对未知工具的兜底是硬编码在
  ToolCall 内的 GenericToolCard(renderSlot fallback 参数,插件不可替换)→ 遮蔽上层
  节点 `conversation.chat.node` key=tool-call(AuToolCallTree,priority:-1),
  由 AuToolCard 渲染一切工具名:已知名特判,未知名走兜底分支(AU_TOOL_META 图标
  登记 18 名 + auArgEm 参数摘要 + 结果首行 summary)。实测 glob×3 /
  ask_user_question×1 / mcp__glm-vision__analyze_image×1 全走兜底,官方行残留 0。
- ✅ tool-kids 子调用(原型 §7 整段拷贝):缩进 19px+左竖线 13px、kid 行 mono+
  k-sum 右对齐、点击就地展开子卡;与官方 ToolCallBranch 消费同一 subCalls 字段
  (逐字同源)。注:当前构建 subagent/workflow 子调用落子会话日志,平铺窗口无
  嵌套样本(code-dispatch 边存在时自动出现),非渲染缺陷。
- ✅ t-foot 统计尾注:耗时/命中/行数/源数(左)与「打开文件/在轨迹中查看」
  操作链接(右)并存。
- ✅ 尾注形态(收口):原型 .t-foot 的 mono 统计即上述 au-fstat,操作链接保留。
- ✅ 详情栏去除(2026-08-24 既定决策)执行:全 UI 被本插件组件接管后无任何
  openDetails 调用方 → root 第三列恒 0px(实测 [280,1160,0],pane 不可见);
  官方 details 注册原样保留,停插件即还原。

### §8 Trajectory(⏭ 跳过 · 2026-08-24 用户决策)

- 不做。官方「轨迹」tab 保持官方原样;原型 §8 的 traj-grid/lane/tbar 瀑布图不移植。

### §9 全局浮层(P13 已对齐,2026-08-24)

- ✅ hero 新会话空态:官方 HeroShell(pXSMma_*)本就居中 —— headline 换 DISPLAY 33px
  (实测 Cormorant)+ 鱼图标金色;previewBadge → hero-badge(mono 10 金字胶囊边);
  workspace 芯片 → hero-pill(r99+金 hover 边);heroGlow 官方 SVG 插画藏画,容器改
  原型径向金辉(gold 15%→72% 渐隐)。hero-foot 返回链接无官方对应物,不适用。
- ✅ 通用菜单金色化:命令菜单/hero 工作区菜单同源(_3e4SsG_* MenuView)—— r13 +
  surface-2 + item 金 hover + mono 名 + 分组头 mono 大写字距(= 原型 cmdMenu 形态)。
- ✅ 设置弹窗:官方 VOzbGW_* 本就是居中 modal + 左导航双栏(nav 188px 与原型一致)——
  mask 深紫 50%+blur3、panel surface r18、nav tint + 金 hover/on、DISPLAY 标题、
  修订(2026-08-24 用户决策):设置内「主题风格 · 鎏金」段删除(注册/组件/CSS 全撤),
  主题切换唯一入口 = 侧栏底部 aurum-footRow;关闭叉 28×28 归位(铁律 6 第三次翻车:
  settingsArea 泛 button 把弹窗内按钮全拉成 100%×38,收紧到 button.VOzbGW_trigger)。
  残差:几何保留官方 800px(五节内容 > 原型四节 424 高)。
- ◐ toast:官方 primitives 内部件、无稳定活实例可瞄;面色已随主题 token 对齐,
  形态微调待后续有实例时补(记档)。
- ✅ scrim:即设置 mask,色彩按原型对齐。
- ✅ 品牌字标定案:维持官方 brand SVG —— CSS 无法替换 SVG 内容,DOM 手术违铁律
  (§4 该残差就此关闭)。

### §10 响应式(P14 已对齐,2026-08-24)

- ✅ 抽屉方案「不适用」:探针实测官方无抽屉 DOM,≤900 自动收 68px 折叠轨
  (即鎏金细条)—— 跟随官方折叠行为,不自造抽屉。
- ✅ ≤820:sh-head 收 padding/crumb 16px、会话流收边距、hero 25px/栈收宽。
- ✅ ≤640:tab 12px、气泡 14.5px/90%、goal-track 64px、c-stats 分隔收窄 6px。
- ✅ ≤480:todo-bar 整行、工具卡参数摘要(au-name em)隐藏、todo-it 10.5px、
  turn-tail tx 9.5px。
- ✅ 门禁:360–1920 逐档实测零横向滚动,输入卡/清单条零溢出;360px 视觉复核
  (侧栏窄条、流/输入卡完整、无重叠)。

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

### P10 · 输入坞(原型 §6)✅ 2026-08-24
**实测**(本会话 6 todo/1 now,双主题):todo-panel×1(遮蔽无双重)、todo-bar 748×125
居中于卡上方(dockAboveCard=true)、卡/bar 零溢出、textarea=mirror=14.5px/1.7、
send=linear-gradient(135deg 金)r12、ctx 金弧 trigger 31px、c-stats=JetBrains Mono 10.5;
回归 gate(264/56 三态)/p8b(无描边)/p8c/proto-diff(failures=0)全绿。
- 结构先行:官方 input.dock 恰在卡上方、composer.dock(footer)在卡下 —— 与原型
  .dock/.c-stats 位置天然同构,ContextMeter 已是「圆环+构成面板」,CSS 换皮即可;
- 唯组件:AuTodoBar(htm 恒等)遮蔽官方 TodoDock(id=todo same-id 替换);
- 记「不适用」:ctx-ring ≥80% 变玫(CSS 读不到占用率);cmdMenu 形态并入 P13;
- 决策记录:todo-bar 拷贝段唯一适配 flex:1→flex:none(column-flex 拔高),pulse→au-pulse。

### P11 · 工具卡补全(原型 §7)✅ 2026-08-24
**实测**(「帮 GLM MCP」会话 48 callrow,双主题):全 au-tool 卡、官方 GenericToolCard
残留 0;未知工具 glob/ask_user_question/mcp__glm-vision__analyze_image 全走兜底
(name/icon/pill/fstat 齐);详情栏第三列 0px 不可见;回归 gate/p8b/p8c/proto-diff 全绿。
- 用户决策(同日):输入坞底条(todo/goal/queue)实色化 —— var(--surface),同输入卡;
- 修订(同日,用户两条):① 卡片间距收窄 —— 会话流列 gap 16→8、callrow 2→0、
  tool 2→1、reasoning mb 14→10、用户气泡 4→2(实测 columnGap=8px);
  ② 兜底工具图标 = 双四角星(Ic stars,大星+小星金色填充),兜底与 kid 行统一;
- 兜底实现:遮蔽 conversation.chat.node key=tool-call(官方 fallback 硬编码不可替换,
  只能接管整棵树);AU_TOOL_META 18 名图标登记 + auArgEm 摘要推导;
- tool-kids 与官方同源(subCalls 字段逐字一致);当前数据面无嵌套样本,记档不视为缺陷;
- P12 前置已就绪:轨迹视图(inspect)链接保留可用。

### P12 · Trajectory(原型 §8)—— ⏭ 跳过(2026-08-24 用户决策)
- 不做瀑布图映射;官方轨迹 tab 保持官方原样,不做皮肤接管。

### P13 · 全局浮层(原型 §9)✅ 2026-08-24
**实测**(双主题):hero h1=33px Cormorant + badge mono r99 金 + glow 画隐径向金辉 +
工作区芯片 r99;命令菜单 r13/item r9 金 hover(7 项);设置 panel 802 r18 surface +
nav 188 tint + 五节导航(通用设置/模型/插件/Agent 预设/豆包模式)+ aurumRow 在列;
回归 gate/p8b/proto-diff 全绿。
- 结构先行:hero(HeroShell)/设置(VOzbGW 居中双栏)/命令菜单(MenuView)官方
  全部同构 —— 纯 CSS 换皮,零组件接管;
- heroGlow:官方 SVG 插画藏画换原型径向金辉;
- 记档:toast 无活实例(token 已对齐);品牌字标维持官方(CSS 换不了 SVG,定案);
  设置几何保留 800px(内容五节 > 原型四节)。

### P14 · 响应式(原型 §10)✅ 2026-08-24
**实测**(1280/820/640/480/360 五档):全程零横向滚动;820 crumb 16px 收窄、
640 气泡 14.5px/90% + goal-track 64px + stats 分隔 6px、480 参数摘要隐藏 +
todo-it 10.5px;输入卡 250-780px 逐档缩、零溢出。回归 gate/p8b/proto-diff 全绿。
- 抽屉记「不适用」:官方 ≤900 自动 68px 折叠轨(即鎏金细条),无抽屉 DOM;
- 降档选择器全部走已遮蔽/已换皮类名(wSkVaW_/au-/goal-track/FJxK0a_/todo-*),
  与既有两轨 CSS 一致,不新增体系。

### P15 · 验收发版
- 原型与实况同 viewport 截图,逐节 ui-diff + `verify-proto-diff.js` 全绿 + 三态几何门禁全绿
  → version 1.1.0,更新 README。
