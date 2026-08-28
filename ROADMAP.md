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
3. **每阶段收尾跑「几何门禁」**(playwright-cli;脚本 2026-08-25 起集中 `verify/` 目录):
   - `verify/verify-gate.js` — 展开/折叠两态:卡片 rect 对原型(±1px)、递归零溢出;
   - `verify/verify-p8b.js` — 无描边审计:伪元素加号唯一 + 子树可见边框数为 0;
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
| P15 | 验收 | 全量截图 vs 原型逐节 diff + 三态几何门禁全绿,发版 1.1.0 | 验收 | ✅ |
| **P16** | **§5 残差** | **think 卡接管:思考中折叠 + 单行文字错峰入场 + 结束自动收拢** | **遮蔽 assistant-step + htm 恒等映射** | **✅** |
| **P17** | **§5 残差** | **三卡图标瓦片对齐(think 并入 au-ico 家族)+ 压缩卡接管(compaction/manual-compaction 双键)** | **CSS 家族归一 + 双键遮蔽** | **✅** |
| **P18** | **§5 残差** | **think 展开并入工具卡非线性收合(grid 0fr⇄1fr + 内容淡入)** | **机构同构(壳仍独立)** | **✅** |
| **P20** | **§4 增强** | **分组会话列表截断:默认前 5 行 + 「显示全部/收起」切换(用户报面板过长)** | **AuBrowserWide 渲染截断** | **✅** |
| **P21** | **§6 增强** | **todo 清单条可折叠:头部行常显 + 胶囊区 grid 收合,默认折叠(用户指定)** | **AuTodoBar 重构 + CSS** | **✅** |
| **P22** | **§5 增强** | **非 chat view(轨迹/数据库等)让位 70px 浮头渐变纱(用户报遮挡)** | **viewArea padding + chat 负 margin(修订 VII 起随官方 DOM 升级改靶 wSkVaW_scrollBody 单点让位)** | **✅** |
| **P23** | **架构** | **主题接入改 theme.overrideTokens 常驻层:修复「设置·外观」切换丢细节(用户报两切换不兼容)** | **删双主题注册与重断言 hack;左下角按钮改切官方 preference** | **✅** |
| **P24** | **§7 修缮** | **三卡壳去 1px transparent border:工具卡 hover「细边框」消除(用户报 + 用户定位)** | **.au-tool/.au-ctx-card/.reasoning 去 border;verify-p24-hover 门禁** | **✅** |
| **P25** | **§7 修缮** | **图标瓦片 svg display:block:Mac 上工具卡图标向下偏移修复(用户报+定位)** | **au-ico/au-chev/.chev 五条 svg 规则补 display:block** | **✅** |

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
  修订(2026-08-24 用户报「假半透明底板」):官方 pI_x6G_sidebarCol 自带
  overflow:hidden 裁掉卡阴影 → 4px 窗口硬切成竖线;放开列裁切 + 阴影调长调柔
  (18/56/.45、18/52/.16),shadowscan.mjs 像素验证列界跳变 ≤2/255、渐变单调,
  点阵连续(残留粗粞点=点阵圆点)。
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
  P15 前修订 IV(2026-08-24 用户报三处):目录分组头图标交叉淡切修复(Ic 不挂类
  致双图标常显重叠)—— 非悬浮=文件夹/悬浮=折叠三角(closed 指右),opacity+scale
  淡切;分组收合改 grid-rows 0fr⇄1fr 非线性插值 + 内容渐隐渐显 + visibility
  延迟摘除;会话行 stagger 入场(animation-name 随 .au-closed 切换,每次展开
  纯 CSS 逐行重播)。verify-group.js 门禁 + 全量回归绿。
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
- ✅ sh-head 主区标题栏(P15 前修订 V 重造,2026-08-24):按原型 .sh-head 方案 ——
  absolute 浮头(高 70,z30,不占文档流)+ 渐变纱(底色 92%→透明 52%),消息从纱下
  滚过渐隐不再硬截断;scroll padding-top 86 让位;单行 flex:标题/tabs/actions
  同一水平线;同轴 delta=0(字标中心 47 ≡ 标题中心 47,padding-top 24 校准);
  tab 选中横杠(:after 底线)移除;主题切换文案去「鎏金」= 深色/浅色主题。
  此前形态(双行带、两列 grid)被本方案取代。
- ✅ 修订 VII(P15 前收尾,2026-08-26,用户指定):撤渐变纱,header 背景
  background:none 全透明;渐隐职责转移至滚动区 mask-image(180deg,
  transparent 0 → #000 70px),内容滚入顶部真透明透出画布。连带考古:官方
  DOM 升级后滚动区类名 Md3f7G_scroll → wSkVaW_scrollBody(root 直接子级),
  P22 的 viewArea padding + Md3f7G_root 负 margin 让位链选择器已空挂,
  一并改靶/删除(窄屏 ≤820px 档 mask 延至 100px / padding-top 130)。
- ✅ 修订 XV(顶部渐隐带加倍,2026-08-28,用户指定):scrollBody mask 70→140px
  (窄屏 100→200),让位 padding-top 86→156 / 130→230(渐隐区 + 原留白 16/30),
  消息初始态仍在渐隐带下方完整可见;浮头高 70 不变。新增 verify/verify-topfade.js
  四象限实测(140/156、200/230 双主题一致),三门禁复跑全绿。
- ✅ 修订 XVI(渐隐带回调,2026-08-28 续,用户指定):顶部渐隐带 140→110px
  (窄屏 200→160),让位 126/190 —— 完全透明区变矮,仍比原始 70/100 高约六成;
  verify-topfade.js 期望值同步,四象限 + 三门禁复跑全绿。
- ✅ assistant 节:reasoning 折叠段 → P16 全面接管(遮蔽 assistant-step:AuThinkCard
  原型 .reasoning 类;运行态折叠壳内单行实时流,行号 key 换行 remount 重播入场
  au-think-in 淡入+上浮+轻模糊,图标金色呼吸;结束自动收拢,摘要=firstLine;
  text 块委托官方 MarkdownText,image 块 AuImg,正文视觉不变;鲸鱼头像已于 P15
  追补 III 移除)+ a-actions 悬停操作(P9 turn-tail 内)。
- ✅ md 装饰(P9):衬线正文、li ◆ 金点、code 金 pill、ul/ol 去官方 padding。
- ✅ compress→P17 并入 au-tool 卡壳(compaction/manual-compaction 双键);row-err/row-retry/turn-tail(P9);typing 三金点→记「不适用」
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

### P15 · 验收发版 ✅ 2026-08-24(v1.1.0)
- **全量门禁终跑全绿**:gate(展开 264/折叠 56/细条三态零溢出)/ p8b(无描边)/
  p8c(浮动菜单·拖拽·F2)/ p10(输入坞)/ p11(49 callrow 全接管、官方行 0、
  glob/mcp 兜底)/ p13(hero+cmdMenu+设置)/ p14(360–1920 五档零横滚)/
  icons(viewBox 普查全官方)/ group(交叉淡切+收合+stagger)/ header5
  (同轴 delta=0)/ proto-diff(failures=0;期间修 turn-tail tx line-height
  1.34 对齐原型行高 14)。
- **双主题视觉验收**:浅/深会话整页截图 vision 复核 —— 结构完整、金色统一、
  header 渐变衔接自然、无缺陷。
- **发版动作**:version 1.1.0;package.json inject 补 `dsh-client-ui-primitives`
  (图标官方依赖显式化);README 全面重写(功能总览/结构/链接安装语义/验证命令);
  历次用户修订(背景去晕染、输入坞实色、卡片间距、双星兜底、图标官方化、
  header 浮头、分组动画、阴影渐变、设置段删除、文案去「鎏金」)全部记档于
  client.js 头注释与本文件。
- **遗留(记档不阻塞)**:toast 形态无活实例(token 已对齐);tool-kids 无
  嵌套数据样本(渲染与官方同源);视图/添加工作区两钮自绘图标(自建功能,
  官方无对应原语)。
- **发版后追补(同日)**:工具卡展开/收合曲线统一 ease-in-out(.45,0,.55,1,
  两头慢中间快,去过冲);Markdown 表格分隔线修复(border token 全 transparent
  误伤 md 表格网格,scoped 直写 fg 12% tint 分隔线 + 表头 surface-2 底)。
- **追补 II/III(同日,用户连续报)**:◈ 上下文注入与 reasoning 折叠态统一为
  au-tool 同款卡壳(紧凑 header + chevron 点击展开;替换 II 的悬停展开方案);
  连续 ◈ 平铺 → 逐节点紧凑卡;assistant 鲸鱼头像移除(原型无);运行态
  「Deep diving」滚字 → 原型三点 bob(5px 金点 1.2s delay .15/.3);md li 因
  去头像宽于原型 42px,proto-diff 记 INFO_ONLY。verify-cards3.js 门禁 +
  gate/p11/proto-diff 回归绿。
- **追补 IV(同日)**:消息流滚动缓动 —— scrollBody scroll-behavior:smooth
  (JS scrollTop 直赋也被 CSS 平滑接管)+ 入场 rise 去 translateY 改纯淡入
  (原地展开,不再顶动刚滚到底的视口,0.6→0.42s);程序滚动实测 22 帧渐进
  到达(加速-减速)。reduced-motion 降级。回归全绿。
- **追补 V · 移动端顶栏+抽屉(同日,用户报手机屏侧栏占宽)**:≤820 时 root
  grid 改两行 —— 侧栏列 = 48px 顶栏(rail 横排:鲸鱼=抽屉开关/新建/搜索 +
  右侧主题/设置),聊天区独占全宽;rail-logo 点按开左侧 fixed 抽屉(320px
  r20 卡面,内嵌 AuBrowserWide 完整浏览器),Esc/遮罩/选中关闭;搜索复用
  __auFocusSearch 握手。实测 390×844:顶栏 390×48、抽屉 63 行/7 组、三种
  关闭全过、无横滚、桌面不变。注:mobile CSS 必须放 CSS3 末(数组拼接顺序,
  CSS1/2 基础规则会后到覆盖)。verify-mobile.js 门禁 + gate/p8c/p14 回归绿。
- **追补 VI · 窄屏 header 上下两行(同日,修标题被挤)**:仅记于 client.js
  CSS 段注释(上标题、下 tabs+按钮),此处补记编号占位。
- **追补 VII · 上下文注入卡展开无内容(同日,用户报)**:根因 = 通用
  `.au-in{opacity:0;translateY(-6px)}` 是工具卡"展开淡入"设计,恢复规则
  只写了 `.au-tool.au-open .au-in`,追补 III 的 ◈ ctx 卡壳类名
  `.au-ctx-card` 漏配 → 展开后高度正常撑开(294px)、全文在 DOM,但内容
  永远透明。修复:补 `.au-ctx-card.au-open .au-in{opacity:1;transform:none}`
  (淡入曲线与工具卡一致)。实测:computed opacity 0→1、transform→none,
  深色 vision 复核卡内全文清晰;浅色分支同样 opacity 1/高 278px —— 纯状态
  恢复规则与主题无关。gate/p8b/proto-diff 回归绿。
- **追补 VIII · md 表格可读性重制(2026-08-25,用户报分割线看不到)**:横竖
  分隔线 fg alpha 分档(22%/16%)、表头鎏金底线 gold 45%、偶数行斑马、无 thead
  表首行按表头处理;实测:深色真实 md 表格 11/11 断言绿(横 0.22/竖 0.16 alpha、
  金底线 0.45、斑马 tint、md 对齐保留、712px 零横向溢出)、浅色探针 11/11
  (assistant-step 容器内临时探针表格,移除 data-ds-dark-theme 近似,token 级联
  一致);collapse 模式下 1.5px 表头底线被浏览器吸附为 1px 设备像素(视觉区分
  靠金色,alpha 断言过)。回归 gate/p8b/proto-diff 全绿。根因与决策详见
  client.js 头注释「P15 追补 VIII」段。
- **追补 IX · TODO 面板拉满整行(同日,用户报"应与输入框等宽")**:根因 =
  追补 VI 插入的 `@media(max-width:820px){` 漏配对 `"}"`,块吞到抽屉媒体
  自己的 `"}"`(只闭内层)、外层 EOF 静默闭合 —— P10 todo-bar 宽度适配、
  P11 .kid 全家、全局 reduced-motion 被吞进 ≤820,桌面端全灭;todo-bar 回落
  `flex:1` 在 composerStack 拉满 1150px(输入卡 780px,左右各溢 185px)。
  修复:VI header 规则后补 `"}"`。实测:todo-bar 1122→748px、flex 0 0 auto、
  对输入卡左右各让 16px(官方 TodoDock 同款面板几何)。新增
  **verify-css-nesting.js** 门禁(断言 todo/kid/reduced-motion 规则不嵌宽度
  媒体块,防漏括号复发);p10/p11/p14/mheader/mobile/p8b/proto-diff 全绿。
  另:gate 存在跑序依赖(p14 还原视口后首拍读过渡中间帧 52px/r0 假阳性)
  → gate 起手加 800ms settle,任意顺序跑绿。

### P16 · think 卡接管(§5 残差,用户指定)✅ 2026-08-25
- **需求**:think 卡思考中折叠;内容改「每行文字错峰入场」;思考结束自动收拢。
  官方 ReasoningRow 摘要/正文均为单文本节点,纯 CSS 无法拆行 —— 走 P11 同法
  遮蔽 conversation.chat.node key=assistant-step(priority:-1 + locale
  "conversation" 复用官方词条),AuAssistantStep/AuAssistantMarkdown 复刻官方
  逻辑:text 块直调官方 MarkdownText(primitives 通道)、image 块走 AuImg、
  unknown 走 JsonBlock(AU_PI 缺席 pre 兜底)、tool-call 跳过(独立节点)、
  interrupted 徽章保留、根/正文容器沿用官方 Sxvs8a_*(几何一致)。
- **AuThinkCard**(原型 .reasoning/.reasoning-head/.reasoning-body 类名,几何沿用
  P15 追补 III 用户指定形态 r14/pad 10 13/hover 面):运行态折叠壳内单行实时流 =
  latestLine,行号作 key —— 同行流式追加不重播,换行 remount 重播入场
  (au-think-in);图标金色呼吸(au-think-pulse);官方横滚 ticker+金扫光退役;
  结束 running→false 自动 setOpen(false)(点开的也收),摘要=firstLine;
  aria-expanded + au-sr 运行中字幕;reduced-motion 动画全关。
- **修订(2026-08-25,用户三处)**:① 不随单行文本量横向滚动 —— follow-end
  scrollLeft 撤除,长行原地裁切(起点恒左对齐),入场动画固定同一可视位置;
  ② 入场透明度 = 全透明→不透明(叠加模糊消散 blur 2.5→0;初版方向系口误,
  当日修订 II 纠正);③ 时长 .38s→.76s(慢一倍)。
- **修订 II(同日,用户两处)**:① 透明度方向纠正回全透明→不透明;
  ② 思考中卡壳补「执行中」背景辉光 = 工具卡 au-tool 同款 105° 金 15% 光带 +
  au-sweep 1.9s 横扫。坑记:辉光规则必须带 body:not(#aurum-boost) 前缀 ——
  [data-state=running]::after 一揽子 90° 通用覆盖含 ID 特异性,裸类规则会被盖
  成宽光带(页内探针实测 parity=false 后修正);reduced-motion 与工具卡同
  display:none。verify-think.js 增页内离屏探针断言 think 卡 ::after 与工具卡
  .au-main::after computed 逐字一致(sweepParityWithTool)。
- **修订 III(同日,用户报 icon/Think 与右侧实时行未对齐)**:稳态错位 3.59px
  —— .r-live-wrap 原为 display:block,继承头部行 16/28 strut,12/19.2 的
  inline-block 文本按基线挂上 28px 行框,半行距不对称压低文本;修:wrap 改
  display:flex + align-items:center(strut 消失,文本中心=wrap 中心)。
  探针实测:修前 live 中心 +3.59,修后 icon/Think/wrap/live/chev 五元素中心
  全等(delta 0);verify-think.js 固化 headAlign 稳态断言(≤1.2px,等当前行
  入场动画播完采样)。
- **修订 IV(同日,用户指定)**:正文 = 运行态同款透明模糊错峰级联 —— reasoning
  正文按 `\n` 拆行渲染(.r-line,key=行号),与单行同一入场动画(au-think-in
  透明→不透明+模糊消散 .76s);行仅展开时挂载 → 收拢再展开整段重播,流式
  期间新行单独入场(行内追加不重播);空行 nbsp 保行高;reduced-motion 关。
  断言口径同步:正文行仅展开时挂载,收拢态 body.textContent 为空 →
  sumIsFirstLine 改在展开后由行重构全文比对。
- **修订 V(同日,用户报"没有每行单独入场")**:初版 delay 第 9 行封顶
  (min(i,8)×50ms)→ 长思考(49 行)第 9 行起全部同时入场糊成一块,错峰感
  消失;改递减步长 min(i,10)×40+(i-10)×15ms:每行独立 delay、波纹全程
  可见,100 行约 1.75s 不拖沓。门禁新增 strictlyDistinct / flatRuns(=0)断言。
  实测(86 行思考):strictlyDistinct=true、flatRuns=0、末行 delay 1525ms
  与公式吻合、delayStep2=40ms、sumIsFirstLine=true。
- **修订 VII(同日,用户澄清「正文」= 模型输出的 markdown,非 thinking)**:
  thinking 展开体撤全部行级动画(.r-line/修订 IV-VI 作废,还原普通 pre-wrap
  文本);错峰级联移到 assistant 正文 —— 官方 MarkdownText 根
  `div[class*=_markdown_]` 的块级子元素(p/ul/pre/table…)统一 au-think-in
  1.2s(透明→不透明+模糊消散),delay 阶梯 nth-child 1-12 ×70ms
  (AU_MD_STAGGER 生成)、12+ 恒 .77s:历史挂载整段波纹展开,流式新段落
  单独入场(React 按位 reconcile,老段落不重播);标签限定不误伤 think 卡。
  实测:3 块 firstDelays [0,.07,.14]s 单调、animAllSame=true、
  thinkBodyAnim=none、.r-line=0;回归 gate/p8b/cards3/proto-diff 全绿。
- **修订 VI(同日,用户报"太快了看不出来")**:行时长 .76s→1.2s、步长加至
  前 12 行 ×70ms + 之后 ×30ms —— 相邻行相位差从 40/760≈5% 放大到 70/1200,
  叠加更长行时长肉眼可辨;运行态单行保持 .76s(用户既定参数);86 行思考
  约 3s 扫完 + 1.2s 收尾。实测(46 行):lineDur=1.2s、delayStep2=70ms、
  strictlyDistinct=true、flatRuns=0、末行 1830ms 与公式 12×70+33×30 吻合。
- **实测**(verify-think.js,新会话真实触发思考回合):lineReplay=true(换行后
  动画 currentTime 回落 = key remount 重播实锤)、duration 760ms、keyframes
  opacity 0→1、sweep=105deg + au-sweep、sweepParityWithTool=true、
  headAlign 三 delta 全 0(icon/Think/live/chev 稳态同轴)、
  maxScrollLeft=0(全程零横向滚动)、bodyHidden /
  expandedWhileRunning / done.autoCollapsed / sumIsFirstLine / liveGone /
  textBlockRendered / officialGone(QWLzlG 全程 0)全 ✓;回归 gate(三态零溢出)/
  p8b(无描边)/ cards3(r14 pad 10 13、button 头、bodyDisplay none)/ darkskin
  (light 面色 oklab .985/.55 + JetBrains Mono)/ proto-diff(failures=0)全绿,
  双主题过。
- 记档:旧 QWLzlG_* 换皮规则保留为死代码(遮蔽期不渲染,零成本防御,停插件
  即还原官方渲染且主题 CSS 一并卸载);Ic 补 think 映射(官方 IconThinkOutline14,
  兜底思绪灯泡自绘);verify-cards3/darkskin 选择器随接管更新;截图
  aurum-think-running.png / aurum-think-done.png 过程产物(2026-08-25 起集中
  screenshots/ 并 git-ignore,verify 脚本落点同步改写)。
- **修订 VIII(2026-08-25,用户报"输出完成后又从头重播一遍")**:回合结算
  streaming 翻 false → 官方 MarkdownText 流式⇄成稿切换整树重挂载,级联动画
  整段重播。根治:级联规则限定 `.Sxvs8a_root[data-streaming]`(仅流式期在册)
  —— 动画只属于正在生成的内容,结算/历史挂载一律静态。verify-think 门禁重构:
  ④a 思考结束后采流式级联(think ok ≠ 正文完)、④½ 等整节点结算(data-streaming
  全摘除)、⑤ markdown 根带重试(换树一瞬查空,稳态必在 —— tmp 探针实测)。
  实测:streamingCascade=au-think-in/delays 单调 ✓、settledStatic 8 块
  animAllNone=true + anyStreamingAttr=false(结算零重播实锤)✓。
- **修订 IX(同日,用户指定两条)**:① 聊天流所有卡片统一「模糊透明入场」
  —— aurum-rise 升级为 au-think-in 同款签名(全透明→不透明 + blur 2.5→0
  消散,1.2s 同曲线),挂官方 flowItem 行全覆盖;不带 translateY(P15 追补 IV
  教训:位移顶起刚滚到底的视口);fill backwards(动画结束 filter 不残留,
  含 filter 元素是 fixed 后代 containing block,常驻有险)。② 流内间距紧凑化:
  flowItem margin-bottom 12→4 + Md3f7G_column gap 8→4 + .reasoning/
  .au-user-row margin 2→1 → 相邻卡实际缝 20→8px。verify-cards3 增 flowTight
  断言。实测:entranceAnim=aurum-rise 1.2s backwards、colGap/marginBottom=4px、
  minItemSeamPx=8;回归 gate/p8b/proto-diff/darkskin 全绿。
- **事故记档(同日)**:一次 pwsh -replace 运算符优先级笔误把仓库 client.js
  写成 0 字节 —— 从部署副本(最后 IN-SYNC 态,实体拷贝非链接)完整恢复后
  重做本轮四处改动;教训:脚本化写盘前必须先断言替换结果非空。

### P17 · 三卡图标瓦片对齐 + 压缩卡接管(用户两报)✅ 2026-08-25

- **需求 ①(用户报「think 卡与其他工具卡的图片水平方向没有对齐」)**:think 头
  .r-ico 裸图标(起点 x=13)与工具卡/上下文卡 .au-ico 27×27 金瓦片(瓦片 x=13、
  glyph 居中 x=19.5)视觉错位。修:think 头改挂 `au-ico r-ico` 双类 —— 瓦片几何/
  金 tint 由 .au-ico 统一承担,.r-ico 仅留运行态钩子(呼吸动画移到 svg,瓦片
  底色不闪);chev 11→13px 对齐 au-chev;浅色补 reasoning 底色 80% 分层(深浅
  同构 au-tool,此前浅色仍是 55% 深色值)。实测:think/tool/compact 三卡 padL=13、
  瓦片 27×27、标题列 x=51 全等(allEqual=true),headAlign 三 delta 仍全 0。
- **需求 ②(用户报「上下文压缩 compact 没有做进卡片的样式」)**:compaction 原为
  P9 原型 .compress 平推行;manual-compaction(手动 /compact)官方渲染此前完全
  裸奔(_Xvjua_/gdEzaW_)。P17 双键遮蔽,统一 au-tool 卡壳家族:
  - auCompactCard 内核:au-ico 瓦片 + au-name/au-sum + 可选胶囊(运行 au-run/
    错误 au-err)+ expandable 时 chevron + AuBody grid 收合,正文走官方
    MarkdownText(AU_PI 通道,pre 兜底);不可展开态(au-noexp)去手型与悬停底色;
  - AuCompress(compaction):摘要口径复刻官方 CompactionItem —— items/tokens
    插值优先(auT 扩参对齐 t(key,params))→ expand/unavailable 兜底链;
  - AuCompactCmd(manual-compaction):复刻官方 CompactionCommandCard 三分支 —
    compaction 落地→标记卡(fallback=outcome 文本);仅 outcome→错误/完成卡;
    全空→运行态(105° 金辉光扫 + 运行中胶囊 + 正在压缩…);
  - Ic 补 compact 映射(官方 IconApiOutline14,兜底层叠菱形);旧 .compress CSS
    留作死代码防御;proto-diff 清单撤 compress-head 行(平推行与卡壳不可比)。
- **实测**(verify-compact.js):离屏三卡几何全等 allEqual=true;真实 /compact
  本环境 compact 插件不可用 → error 分支落地(err 胶囊 + outcome 文本,语义正确),
  官方 gdEzaW_/_Xvjua_ DOM 全程 0;离屏机构探针:运行辉光与工具卡 computed 逐字
  parity(sweepParity=true)、展开 grid 1fr(解算 23px)+ 内容 opacity 恢复 + chev
  90° 旋转、noexp 手型 default。回归 think/gate/p8b/cards3/proto-diff/darkskin
  全绿。
- **顺带修门禁 bug**:verify-darkskin 旧版盲切一次主题 —— 起始为 dark 时量的
  是 light 值(reasoning 底色双主题分化后暴露,历史输出 mode:"light" 即此误);
  改按起始模式定向切换,现输出 dark 55% / light 80% 两组实测值并还原起始模式。

### P18 · think 展开并入工具卡非线性收合(用户问)✅ 2026-08-25

- **背景(用户问「现在 think 卡片是单独的实现吗?让它的展开也带有其他工具
  调用展开的非线性动画」)**:think 卡确为独立实现 —— 遮蔽 assistant-step、
  原型 .reasoning 类名体系(AuThinkCard),不在 .au-tool 家族;其展开原为
  display:none⇄block 瞬切,与工具卡 .au-x 的 grid 0fr⇄1fr 非线性插值不同构。
- **归一(壳独立、机构同构)**:.reasoning-body 改 grid 0fr⇄1fr 壳 ——
  transition 与 .au-x 逐字同参(展开 .5s/收合 .34s,cubic-bezier(.45,0,.55,1)
  两头慢中间快);内包 .r-bclip(overflow:hidden 裁切)+ .r-bin(承接原 body
  全部正文样式:serif italic/1.9 行距/虚线顶边/pre-wrap,加 opacity+translateY
  淡入 —— 曲线同 .au-in:收合 .18s/.24s 快隐,展开 .4s 延迟 .06s/.5s 延迟
  .04s)。reduced-motion 下容器与内容 transition none(au-tool 同款豁免)。
  P16 修订 VII 决策不变:所撤为行级文字级联(au-think-in),容器高度过渡与
  家族同款内容整体淡入不在其列。
- **实测**(verify-think.js):expParity=true(与离屏 .au-x transition 三元组
  逐字相等);展开瞬间插值采样 h=88.5px/rows=12.19px(0fr→1fr 进行中),
  终态 rows 解算 765.6px + binOpacity 1;结算自动收拢归 0px、autoCollapsed
  true;Chrome 将 0fr/1fr 解算为 0px/Npx(computed),断言按 parseFloat 口径
  (首跑 bodyFolded/autoCollapsed 误按字符串 '0fr' 比对,已修正 —— 行为本身
  一直正确,settledStatic.thinkBodyRows=0px 为证)。回归 cards3(reasoning
  bodyRows 0px、flowTight 缝 8px)/gate/p8b/proto-diff(failures 0)/darkskin
  (深 55%/浅 80%,还原)全绿。

### P19 · 添加工作区改走系统目录选择框(用户指定)✅ 2026-08-25

- **背景(用户:「左侧添加新工作区按钮,点击后改为弹出一个 file picker,
  选择目录后打开,用浏览器自带的就可以」)**:原交互为点击展开手动路径
  输入行(au-ws-addrow,↵ 添加 / Esc 取消)。
- **方案决策**:浏览器自带 picker(showDirectoryPicker / webkitdirectory)
  经评估不可行 —— 浏览器安全沙箱不暴露所选目录的绝对路径(仅目录名),而
  host `workspace.create` 需 realpath 可解析的真实绝对路径(`fs.realpath`
  校验,相对路径按 host 进程 cwd 解析必错位)。用户确认改用**系统原生
  目录选择框**:官方 `workspacesSvc.pickDirectory()`(host native
  capability;本机 127.0.0.1 + Windows = 用户眼前弹出的文件夹选择对话框,
  返回绝对路径)。
- **改动**(纯行为,零几何):auActions 增 `pickWorkspaceDirectory`(透传
  service `pickDirectory(): Promise<path|null>`,null=取消);按钮 onClick 改
  `addViaPicker` —— 选中即以绝对路径 create(选完即开),取消静默;picker
  不可用(SSH/远程场景 capability 退 browse,报 directory-picker-unavailable)
  或服务缺失时回退展开原手动输入行,输入流原样保留。
- **实测**:node --check 过;按钮 title=添加工作区在册、默认无 .au-ws-addrow
  (旧交互为点击即展开);回归 gate/p8b/proto-diff 全绿。系统对话框链路需
  用户桌面手动点验(headless 下原生框无法自动断言)。

### P20 · 分组会话列表截断:默认前 5 + 显示全部(用户报)✅ 2026-08-25

- **背景(用户:「左侧历史会话浏览,每一个折叠面板里面的会话过多,需要有
  一个显示最新的 5 个会话 + 一个按钮可以显示全部」)**:分组(工作区)面板
  此前全量渲染,长列表把侧栏撑得过长。
- **方案决策(用户三项拍板)**:取「列表前 5 条」(当前排序序 —— manual 序
  即手动置顶优先,非按 updatedAt 挑选);展开后按钮转「收起」可切回;
  more 状态内存态不持久化(刷新复位,行为可预期)。
- **改动**:AuBrowserWide 增 moreSt state;分组分支(groups.map)按
  more[key] 截取 shown = sessions.slice(0,5),>5 条的组在 .au-slist-in 尾部
  渲染 .au-s-more 按钮(「显示全部 N 条」⇄「收起」,aria-expanded 同步);
  CSS 新增 .au-s-more 三条(mono 11px tertiary,hover 金,focus 金环,无描边)。
  搜索/平铺视图走 results/flatAll 分支,天然不受截断影响。
- **实测(verify/verify-sbmore.js)**:dsh-theme-aurum 组 53 条 → 默认 5 行;
  点开 53 行 + 按钮转「收起」;收起复位 5 行;平铺 88 行全量、0 截断钮。
  回归 verify-gate 三态 264×876 / 56×876 零溢出全绿;深浅双色目检过
  (verify-sbmore-light.js:token 双色自适应,浅色约 4.5:1 可读)。

### P21 · todo 清单条可折叠(用户指定:聊天栏上部 TODO 清单)✅ 2026-08-25

- **背景(用户:「底部(聊天栏上部)的 TODO 清单变成可折叠的!」)**:P10 起
  AuTodoBar 恒等映射原型 §6,胶囊列表永远全量平铺;官方 TodoDock 本就带折叠
  列表,此番补回折叠能力。
- **方案决策(用户拍板:默认折叠)**:头部行(清单 n/m + goal-track 进度条 +
  .todo-fold 折叠钮)常显;todo-items 胶囊区移入 .todo-foldwrap>.todo-foldin,
  grid-rows 0fr⇄1fr + 淡隐收合(与侧栏 .au-slist 同机构);chevdown 收起
  转 -90° 指右(与分组头 chev2 同语言);aria-expanded 同步;内存态不持久化。
- **踩坑实录**:折叠后的 .todo-foldwrap(flex-basis:100% 空行)仍吃 .todo-bar
  的 11px flex 行距,折叠态 49px 超出 min-height:38 —— 修法为 row-gap 归零、
  展开间距改由 .todo-foldwrap margin-top 过渡承担,折叠态精确回到 38px。
- **实测(verify/verify-todofold.js)**:6 项 todo 折叠 38px / 胶囊区 0px /
  aria false,展开 133px / 胶囊区 84px / aria true,收起复位;gate/p10/
  sbmore 回归全绿;深浅双色目检过(verify-todofold-light.js)。

### P22 · 非 chat view 让位浮头(用户报:切 tab 后内容顶屏幕顶)✅ 2026-08-26

- **背景(用户:「除了主聊天界面以外,顶部 tab 栏切换页面后,内容都顶着屏幕顶部,
  被顶栏渐变遮挡」)**:P15 修订 V 把 `wSkVaW_header` 改成 absolute 浮头
  (70px,底色 92% → 透明渐变纱),但顶部让位只做在 chat 的滚动容器
  `Md3f7G_scroll`(padding-top:86)。顶部 tabs(对话/轨迹/数据库,由
  `conversation.view` 槽位注册者提供)切到非 chat view 时,内容 y=0 直接
  顶屏幕顶,首行被纱遮住。
- **方案**:`wSkVaW_viewArea` 自身 `padding-top:86px` 统一让位 —— 未来插件
  注册新 view 自动覆盖,不逐类名点名;chat 例外,`Md3f7G_root` 加
  `margin-top:-86px` 拉回:`[data-conversation-scroll]` 模式下真正的滚动容器
  是外层 `wSkVaW_scrollBody`(viewArea 在滚动流内),padding 与负 margin
  净效果为零,「消息从纱下穿行渐隐」的原设计语义原样保留。移动端(≤820)
  同步 130px(header 两行,与 Md3f7G_scroll 让位同值)。
- **废案实录**:先试 `wSkVaW_viewArea > :not(.Md3f7G_root)` 把 padding 打在
  view 根上 —— viewArea 与各 view 根之间隔着官方 React provider wrapper
  (无类名,`display:contents`),padding 无法穿透布局,改打 viewArea 自身。
- **实测(verify/verify-viewyield.js)**:轨迹(qBU-ya_root)/数据库(dbb-view)
  首元素 y 0 → 86(> 纱底 70);chat 顶滚后首内容 y=86 不变 + margin/pad
  三值断言;深浅双色全绿;verify-gate/p8b/proto-diff 回归无回归。

### P23 · 主题接入改 overrideTokens:设置·外观切换兼容(用户报两切换不兼容)✅ 2026-08-28

- **背景(用户:「左下角有一个明暗配色切换,设置里也有个明暗切换,两个不兼容,
  设置里的切换选择后会丢失主题细节」)**:官方设置→外观行(dsh-client-ui-theme
  的 AppearanceRow,settings.general.item 槽 id=appearance)三个 cube(浅色/
  深色/跟随系统)的语义是 **preference=内置主题 id**,onClick=setTheme("light"/
  "dark"/"system") 且持久化写设置文档;ThemePresenter.apply 先摘 body 全部
  内联 token 再写 active.tokens,而官方内置主题 tokens 为空对象 → 旧方案
  (注册 aurum-dark/aurum-light 双主题、aurum 视觉全靠 active 主题的 120 个
  token)被一键清零,注入 CSS 与遮蔽组件却仍在 → 「半鎏金半官方」丢细节。
  左下角按钮旧走 setTheme("aurum-*"),非 preference 不持久化,刷新被官方
  adopt() 盖回 —— 两个切换各写各的状态,互不知晓。
- **诊断实测(修复前)**:基线 120 内联 token;设置点 Light 后 120→0,
  --dsw-alias-bg-base 回 #fff、bubble 回官方 #edf3fe;aurum style 标签仍在。
- **方案**:删双主题注册与 0ms/1.2s 启动重断言 timers,改
  theme.overrideTokens("dsh-theme-aurum",{token:{light,dark}}) 常驻层
  (theme 服务的 token 级遮蔽,与槽位遮蔽同哲学)——composeActive 按 active.
  colorScheme 逐 token 取 aurum 对应色,官方 light/dark/system 任何
  preference 下双色都正确;左下角按钮改切官方 preference(同通道、持久化、
  「跟随系统」media 监听免费获得);停插件 dispose 层即还原官方,回退路径不变。
- **实测(verify/verify-p23-compat.js)**:基线(dark)120 token aurum 值;设置
  点 Light 后 120 保持且整组翻 aurum light(bg-base oklch(94.5% 0.012 82)、
  bubble oklch(93% 0.035 83)——修复前同位 #fff/#edf3fe);左下角切深色
  darkAttr 挂上、整组翻 aurum dark(gold 83%.115 88);gate/p8b/proto-diff(0)/
  darkskin(深 55%/浅 80%)回归全绿。

### P24 · 三卡壳去 1px transparent border:hover 细边框消除(用户报)✅ 2026-08-28

- **背景(用户:「工具卡片 hover 状态会有一个细 border,我们的风格是完全无边的
  风格」,随后自己定位:「看起来就是卡片背景和 hover 变色的部分大小不一致导致」)**:
  `.au-tool`/`.au-ctx-card`/`.reasoning` 三个同款卡壳都带
  `border:1px solid transparent`,头行 hover 背景(`.au-main`/`.reasoning-head`
  的 `layer-2 50%` tint)从 border 内缘起画 —— hover 色块比卡几何小一圈,四边
  露出 1px 卡面色(`layer-1 55%` mix)环;两色一亮一暗,hover 时显形为 1px
  「假边框」(深色 read 卡顶部亮线最易察觉)。
- **排查路径(实录)**:全样式表扫 `:hover`+border 规则 = 0 条 → 卡子树扫常驻
  可见 border/outline(深浅×展开折叠)= 0 个 → 元素截图页内 canvas 逐行像素
  采样,hover 后卡内首行 [250,247,241]=卡面色、y2 起 [243,238,229]=hover 色,
  与用户判断吻合(色块尺寸不一致,非真 border)。
- **修复**:三壳删 `border:1px solid transparent`(au-pill 等徽章的双层色环
  不存在,保留)。hover 色块与卡几何重合,圆角处仅剩正常抗锯齿。
- **实测(verify/verify-p24-hover.js)**:hover 后卡内首两个可见像素行 y1==y2
  逐字相等(浅 [243,238,229]/深 [32,25,31]),firstRowDiff=0;卡几何 -2px,
  gate/p8b/proto-diff(0)/darkskin/p23-compat/cards3/think/compact/
  ctx-repro/ctx-light 回归全绿。

### P25 · 图标瓦片 svg display:block:Mac 图标向下偏移(用户报+定位)✅ 2026-08-28

- **背景(用户:「工具卡片的图标歪了」,后精确定位:「图片没有在圆角矩形的中心,
  而是向下偏移了,Windows 上没有,换 Mac 出现」)**:Ic() 官方图标组件包在无类
  `<span>` 里,svg 保持 `display:inline` —— 行盒 strut(line-height normal 由
  字体度量决定)参与布局,svg 按基线(替换元素底边)对齐,顶部被 strut 推空 →
  图标在 27px 瓦片内整体向下偏。Mac(-apple-system/Noto Sans SC)与 Windows
  (Segoe UI)字体行高度量不同 → 平台差异。
- **复现(headless 需手动模拟)**:webfont 未加载时 strut 恰好不撑开(headless
  直测居中,一度误导排查);注入 line-height:2.4 后 svgTop 6.5→12、底隙
  6.5→1(向下偏 5.5px),与用户截图现象吻合。
- **修复**:`.au-ico svg`/`.au-chev svg`/`.reasoning-head .chev svg`(+ctx 卡
  冗余两条)五条规则补 `display:block` —— 容器均 grid/flex 布局,block 化安全;
  row-retry 等行内混排场景不动(避免 inline 包 block 拆盒风险)。
- **验证(verify/verify-p25-iconcenter.js)**:normal 与 strut 恶化(lh2.4)
  两环境 ico 6.5/6.5、chev 0/0 全居中(failures=0);全量门禁 p23/p24/gate/
  p8b/proto-diff/darkskin/cards3/think/compact/ctx-repro/ctx-light 全绿。
