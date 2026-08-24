/**
 * dsh-theme-aurum — 鎏金主题 browser half (loader-format bundle, zero build)。
 * 由 dsh-agent-workspace.html 原型移植:oklch 金粉配色 + 点阵画布 + 浮动卡片侧栏 +
 * 左侧历史会话栏整体重写(目录头/分组折叠/会话状态槽/行内操作/搜索/平铺) +
 * 用户气泡/上下文节点/9 类工具卡片接管。主题经 theme 服务注册 aurum-dark/aurum-light。
 */
window.__ModuleLoader__.load({
	id: "dsh-theme-aurum",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		const react = require("react");
		const React = react;
		/* ── htm@3.1.1(vendor/htm.js 官方 mini UMD;仅改尾部恒挂 self.htm,
		      避开本 loader 文件的 module.exports 语义)· P9 恒等映射流水基础设施 ── */
		!function(){var n=function(t,e,s,u){var r;e[0]=0;for(var h=1;h<e.length;h++){var p=e[h++],a=e[h]?(e[0]|=p?1:2,s[e[h++]]):e[++h];3===p?u[0]=a:4===p?u[1]=Object.assign(u[1]||{},a):5===p?(u[1]=u[1]||{})[e[++h]]=a:6===p?u[1][e[++h]]+=a+"":p?(r=t.apply(a,n(t,a,s,["",null])),u.push(r),a[0]?e[0]|=2:(e[h-2]=0,e[h]=r)):u.push(a)}return u},t=new Map,e=function(e){var s=t.get(this);return s||(s=new Map,t.set(this,s)),(s=n(this,s.get(e)||(s.set(e,s=function(n){for(var t,e,s=1,u="",r="",h=[0],p=function(n){1===s&&(n||(u=u.replace(/^\s*\n\s*|\s*\n\s*$/g,"")))?h.push(0,n,u):3===s&&(n||u)?(h.push(3,n,u),s=2):2===s&&"..."===u&&n?h.push(4,n,0):2===s&&u&&!n?h.push(5,0,!0,u):s>=5&&((u||!n&&5===s)&&(h.push(s,0,u,e),s=6),n&&(h.push(s,n,0,e),s=6)),u=""},a=0;a<n.length;a++){a&&(1===s&&p(),p(a));for(var o=0;o<n[a].length;o++)t=n[a][o],1===s?"<"===t?(p(),h=[h],s=3):u+=t:4===s?"--"===u&&">"===t?(s=1,u=""):u=t+u[0]:r?t===r?r="":u+=t:'"'===t||"'"===t?r=t:">"===t?(p(),s=1):s&&("="===t?(s=5,e=u,u=""):"/"===t&&(s<5||">"===n[a][o+1])?(p(),3===s&&(h=h[0]),s=h,(h=h[0]).push(2,0,s),s=0):" "===t||"\t"===t||"\n"===t||"\r"===t?(p(),s=2):u+=t),3===s&&"!--"===u&&(s=4,h=h[0])}return p(),h}(e)),s),arguments,[])).length>1?s:s[0]};self.htm=e}();
		const html = self.htm.bind(React.createElement);
/* ═══ Aurum 鎏金主题 — P7 = P5 + 左侧历史会话栏整体重写(原型级) ═══
   按 dsh-agent-workspace.html 原型重写左侧会话栏:
   1. 以 priority:-1 遮蔽注册 sidebar.workspaces(官方浏览器保留在册, 插件停止即还原),
      用 ctx.sessions / ctx.workspaces + 全局 useSessions/useWorkspaces 钩子自建:
      工作区目录头(标签 + 展开式搜索 + 视图切换 + 添加工作区)、分组折叠(chev⇄folder 图标
      交叉淡切)、会话行(状态槽: working 旋转/waiting 金点/done 绿点, 悬停 ··· 展开操作条:
      重命名(行内)/分支/归档)、平铺模式、本地标题搜索。
   2. 壳层(hHd-Xa_*: 品牌行/新建按钮/底部)CSS 重塑为原型样式: 去 padding、58px 头行、
      金色 tint 新建钮(+图标)、30px 圆角图标钮、底部 border-top 行;折叠态 40px rail 几何。
   3. AurumFootToggle 支持 wide 属性(折叠态渲染为 40px 图标钮)。
   槽位保留: sidebar.settings/sidebar.footer.action 原样由官方组件渲染(样式化)。

   ── P8 · 侧栏几何修正(卡片即容器) ─────────────────────────────
   旧实现以栏列 ::before(inset:12px, z-index:-1) 画卡,列横向 padding 为 0,
   内容根带内联 width:280px 铺满整列 → 会话行/hover 态超出卡片圆角边界 12px。
   P8 改为「内容根即卡片」,对齐原型 .sidebar 语义:
   1. 栏列只留白(padding 12px 4px 12px 12px → 卡片恰为原型 264px;折叠态 12px 8px → 40px 细条);
   2. [data-slot=sidebar]>div 卡片化: 渐变面+阴影+radius20(折叠17)+overflow:hidden,
      width:auto!important 压过内联宽度,拖拽调宽时卡片自动跟随;
   3. 折叠态 newSession / aurum-footRow 收为 40px 方钮,settingsArea 钮去负 margin。
   实测: 展开 264×696@(12,12) 零溢出;折叠 40×696@(8,12) 零溢出;调宽 340→卡 324。

   ── P8b · 验收修正(双加号 + 无描边) ─────────────────────────
   1. 双加号根因: [class*=newSession] 子串同时命中按钮 hHd-Xa_newSession 与官方标签
      hHd-Xa_newSessionLabel(两者都 position:relative),各自渲染一条 ::before "+";
      收紧为 button[class*=newSession] 后仅按钮持有一个加号(标签 ::before 归 none)。
   2. 无描边原则: 官方默认主题在 body 层定义 --dsw-alias-border-*(解析 rgba(255,255,255,.12)),
      主题 token 压不过 → 侧栏/详情栏/输入卡子树 border-color:transparent!important 一揽子扫除,
      会话流 au-* 类边框逐个改字面量 transparent, 双主题 border token 亦置 transparent(保险)。
   ── P9 · 会话流尾部节点 + 恒等映射流水首批(htm + 原型类名) ──────
   1. 基础设施: 内联 htm@3.1.1(self.htm) + htm.bind(React.createElement);CSS3 层注入
      原型 §1 变量组(gold/surface/rail 族与四族字体, 深浅双主题)——新组件直接消费
      原型类名(.turn-tail/.compress/.row-err/.row-retry/.pill/.ibtn/.a-actions),CSS 整段拷贝。
   2. 节点接管(priority:-1 遮蔽, 官方同名 key 保留): turn-tail(a-actions 独立行+细线 tx)、
      compaction(.compress 折叠段+in-tok)、model-retry(倒计时)、turn-error、turn-max-tokens。
      turn-tail 永远普通注册: children 槽位声明存在加载顺序竞态,插件先注册会炸掉官方
      conversation 包的同名声明(2026-08-24 实测复现并回退)。
   3. md 装饰(scoped 到 [data-chat-flow-kind=assistant-step]): 金点列表、inline code 金
      pill(12.5px!important 压官方 .875em)、:is(ul,ol) 去官方 18px 内边距;assistant 头像 =
      flowItem padding-left:42px + ::before/::after(鲸鱼 mask data URI) 纯 CSS 实现。
   4. 列宽 712 对齐原型 .flow 内容宽: 官方在 viewArea-root-scroll 多层重定义
      --dsh-chat-content-width=748,以 [data-conversation-scroll] 结构锚 + 通配逐元素定义压继承。
   5. 主题激活修正: apply 期 setTheme 会被启动后期主题初始化盖回官方,改为 0ms/1.2s 两次
      延迟重断言(一次性, 不与用户后续选择打架)。
   6. 逐节点入场: [data-chat-anchor-key] 阶梯 rise(官方列 gap16+行距12 约等于原型 28px 节奏)。
   实测(2026-08-24, verify-proto-diff 双页门禁): failures=0 —— row-retry 712=712、
   md li 666=666(dh 0.1)、inline code h19=19 字号同;turn-tail/compress/row-err 为数据驱动
   (回合闭合才渲染, 本次窗口未含, 结构已由前轮实测);侧栏几何门禁回归无损(264x696)。

   ── P8c · 侧栏残差收口(原型 §4)──────────────────────────
   1. 折叠细条 56px:官方折叠列宽 56、列 padding 归零 → 卡满栏(原型 .app.no-sb .sidebar
      56px, rail 钮 40 居中左右各 8);展开⇄折叠交叉淡切以挂载动画近似(rail 淡入
      .26s .18s / wide 淡入 .22s .2s, 宽度动画仍交官方 grid 过渡)。
   2. AuBrowserRail 自建细条:logo 悬停「鲸鱼⇄展开面板」交叉淡切(rl-whale 内联 SVG =
      P9 头像同源 path)点击展开;新建 = 金 tint 钮(当前工作区 startSession);搜索 =
      展开后 300ms 聚焦搜索框(window.__auFocusSearch 握手);官方 logoRow/newSession
      折叠态隐藏,底部设置/主题钮保留(CSS1 40px 方钮)。
   3. 行操作对齐原型浮动菜单(已决策): .menu/.mi/.mk/.menu-sep 整段拷贝, fixed 定位
      免卡裁切;会话 = 重命名(F2)/分支/归档(danger), 目录 = 重命名/删除(二次确认);
      置顶/导出无 DSH API 不渲染;F2 悬停行重命名;点外/Esc 关闭。
   4. 拖拽排序:draggable + drop-before/after 金线 + .dragging 半透明(原型 CSS),
      持久化走 workspacesSvc.insertSessionBefore(手动序);视图菜单补排序切换
      (最近活动/名称/手动序)+ 平铺开关,默认手动序(= 服务端 sessionIds 真实顺序)。
   实测(2026-08-24):折叠卡 56×876@(12,12) r17(轨道 68=12+56, 与官方内联同形
   px/minmax/px 覆写, 0.3s grid 过渡可插值;卡几何 56+margin12 直写 —— 折叠轨为常量,
   与拖拽调宽无拔河);railNew leftPad=8=(56-40)/2 对齐原型;展开/回展 264@(12,12)
   无损;浮动菜单 items=[重命名F2/分支/归档]+sep+danger、Esc 关、F2 行内改名聚焦、
   视图菜单 4 项 manual✓;拖拽合成 DragEvent 全链 reorder 持久化(DOM 序翻转实测);
   aurum-light 同门禁全绿。

   ── P9 残留收口(sh-head + reasoning,2026-08-24)─────────────
   1. sh-head 主区头部(官方 DOM CSS 瞄准 wSkVaW_*,不重排结构):渐隐底、crumb 换
      DISPLAY 18.5、模式 chip/Session log 换 mono 10.5 faint、tabs 胶囊右置
      (radius999+bg-deep 底,tabActive 金 on,深浅双份)。官方=76px 双行带,原型=70 单行
      浮头 —— 保留双行(重排=DOM 手术,违背铁律),同轴机制记残差。
   2. reasoning 折叠段(官方 ReasoningRow QWLzlG_*,CSS 换皮):surface tint 卡 r12 +
      mono 头 11.5 faint + thinkBody serif italic 13/1.9 + 虚线分隔 + 运行扫光换金。
      不接管组件 —— 官方 disclosure 交互(chevron/流式摘要)原样保留。
   3. in-tok/typing 记「不适用」:context 节点数据无 token 计数;官方无独立 typing 行
      (运行态由 ReasoningRow/工具卡扫光承载)。
   4. 浅色 --font-* 四族补齐(CSS3 light 块此前漏定义,DISPLAY/serif 在浅色全部失效)。
   实测:crumb=Cormorant Garamond 18.5px(双主题)、tabs x=1292 r999 右置金 on、
   reasoning 卡 oklab surface .55 r12 mb14、QWLzlG_title=JetBrains Mono;
   verify-gate/p8b/p8c/proto-diff 回归全绿,主题切换往返无损。

   ── 背景去晕染(2026-08-24 用户决策,偏离原型 §1)────────────
   主区「浑浊 vs 侧栏区清爽」的分界由 body 两片 radial 晕染造成(定位 50%/-12% 与
   88%/112% 都压主区);撤晕染 + 撤 sh-head 渐隐纱 + 输入卡 solid→surface 半透明
   (深 70%/浅 82%)。body 只留底色+点阵;background-size 收回单值 24px(两值配单层
   会被浏览器截断成 auto,点阵栅距失效 —— 已实测修正)。
   补刀(同日):底栏分界残雾 = composerSeat 官方滚出渐隐纱(.wSkVaW_root[data-phase=active]
   选择器 0-3-0 特异性,画「36px 透明→bg 渐变 + 下方实底」,色=body 底色 → 点阵在底栏
   分界被半透明渐变吞掉)。body 前缀同形选择器(0-3-1)反超撤除;点阵现直通视口底部,
   输入卡(半透明)与目标条(nLMEza_* 实底)各自浮于画布。实测:深浅两主题 seat
   bg-image 均解析 none、涂层普查仅剩内容层;verify-gate/p8b 回归全绿。

    ── P10 · 输入坞(2026-08-24)─────────────────────────────
    官方结构盘点(uV2eYG_card 输入卡 / composerStack=[input.dock 条目,卡,卡内 footer]):
    input.dock 恰在卡上方(=原型 .dock 位),footer=StatsLine(=原型 .c-stats 位),
    ContextMeter 已是「圆环+构成面板」与原型 ctx-ring/ctxPanel 同构 —— 全部 CSS 换皮可达,
    唯 todo 需组件:官方 TodoDock 仅文本进度,原型要 goal-track 进度条+胶囊。
    1. AuTodoBar(htm 恒等)遮蔽 conversation.input.dock id=todo(same-id 替换+order0
       保位):清单 n/m + goal-track 金→玫渐变(宽=done/total%)+ todo-it 胶囊
       (done 删除线/now 金 tint 脉冲点,复用 au-pulse);空清单渲染 null 同官方;
       data-testid=todo-panel 沿用。CSS3 §6 整段拷贝,唯一适配:flex:1→flex:none
       +lXshSW 同形几何(官方 dock 区是 column-flex,flex:1 会纵向拔高)。
    2. CSS1 换皮:textarea/mirror/backdrop 三件套 14.5/1.7(防 caret 错位);
       mention 芯片/斜杠高亮金 tint;add 命令钮 r10 金 hover;primary(send)金渐变
       34×34 r12+disabled .35+浅色反白 ink;mode(Sh0Q9G)/model(_7KE1Ra)钮 mono 11
       +金 hover,model 菜单 surface-2 r13+金 option;ContextMeter 金弧 2.6/面板
       DISPLAY 23px 大数字/三段条 sys=fg40%/tools=玫/msgs=金/圆 swatch;
       StatsLine mono 10.5+`|` 分隔弱化;goal 条(nLMEza)/queue 条(_7yHdaG)/
       TodoPanel 残影(lXshSW,详情栏内)同 todo-bar 半透明面+无描边。
    3. 「≥80% ctx 变玫 .hot」记不适用:CSS 无法读 dasharray 占用率。
    实测(本会话 6 todo/1 now):todo-panel×1(无双重)、dockAboveCard=true、
    卡/bar 零溢出、ta=mirror=14.5px/1.7、send=linear-gradient(135deg 金)r12、
    ctx fill=金 trigger 31px、stats=JetBrains Mono 10.5;深浅双主题面色/ink 互换正确;
    回归 gate(264/56 三态零溢出)/p8b(无描边)/p8c/proto-diff(failures=0)全绿。

    ── P11 · 工具卡补全 + 兜底(2026-08-24)──────────────────
    0. 用户决策(同日):输入坞底条(todo-bar/goal/queue/TodoPanel)一律实色 —— 半透明
       面全部换 solid var(--surface)(深浅各自解析),与输入卡同族。
    1. 关键机制:官方对未知工具的兜底是硬编码在 ToolCall 内的 GenericToolCard
       (renderSlot("tool.call.toolview",…,{entryKey,fallback}) 的 fallback 参数,
       插件不可替换)→ 唯一全接管路径 = 遮蔽上层节点 conversation.chat.node
       key=tool-call(官方 ToolCallTree,priority:-1)。
    2. AuToolCallTree/AuToolBranch/AuKid:AuToolCard 渲染一切工具名;已知名走
       特判,未知名走兜底分支(AU_TOOL_META 图标登记 18 名 + auArgEm 参数摘要
       推导 + 结果首行 summary)。t-foot 补统计位(耗时/命中/行数/源数,左)与
       操作链接(右)并存。
    3. tool-kids(原型 §7 整段拷贝):AuToolBranch 递归 block.subCalls —— 与官方
       ToolCallBranch 消费同一字段(逐字同源契约);kid 行 mono+k-sum,点击就地
       展开子卡。注:当前构建 subagent/workflow 子调用落子会话日志,平铺窗口
       无嵌套样本(code-dispatch 边存在时自动出现),非渲染缺陷。
    4. 详情栏去除(2026-08-24 既定决策)执行:全 UI 已被本插件组件接管,无任何
       openDetails 调用方 → 第三列恒 0px(实测 rootCols=[280,1160,0],
       pane 不可见);官方 details 注册原样保留(停插件即还原)。
    实测:「帮 GLM MCP」会话 48 callrow 全 au-tool 卡、官方行残留 0;未知工具
    glob×3 / ask_user_question×1 / mcp__glm-vision__analyze_image×1 全走兜底
    (name/icon/pill/fstat 齐);回归 gate/p8b/p8c/proto-diff 全绿,双主题无损。

    ── P11 修订(2026-08-24,用户两条)──────────────────────────
    1. 卡片间距收窄:官方会话流列 Md3f7G_column gap 16→8 + au-callrow margin
       2→0 + au-tool margin 2→1 + reasoning 卡 mb 14→10 + 用户气泡 4→2 —— 相邻
       卡间距约减半(实测 columnGap=8px,卡间视觉 8-10px 缝)。
    2. 兜底工具图标 = 双四角星(用户指定):Ic("stars") 大星左下+小星右上,
       金色填充;兜底分支与 kid 行统一用它(废弃 META 图标登记表)。

    ── P13 · 全局浮层(2026-08-24)────────────────────────────
    结构先行盘点:官方 hero 本就是 HeroShell(pXSMma_*)居中栈 + heroGlow;
    设置本就是 VOzbGW_ 居中 modal + 左导航双栏(nav 188px 与原型一致);
    命令菜单 = _3e4SsG_* MenuView —— 三块全部 CSS 换皮可达,零组件接管。
    1. hero:pXSMma_headline 衬线 33px(实测 Cormorant);previewBadge → 原型
       hero-badge(mono 10px 金字胶囊边);workspace 芯片 → 原型 hero-pill
       (r99 + 金 hover 边);heroGlow 官方 SVG 插画藏画,容器改原型径向金辉
       (gold 15% → 72% 渐隐,实测 bg=radial oklab 金)。
    2. 通用菜单(_3e4SsG_,add 命令菜单/hero 工作区菜单同源):r13 + surface-2 +
       item 金 hover + mono 名金 + 分组头 mono 大写字距。
    3. 设置弹窗(VOzbGW_*):mask 深紫 50% + blur3;panel surface r18(几何保留
       官方 800px,内容五节多于原型四节,原型 424 高装不下 —— 记残差);nav tint +
       navCell 金 hover/on + DISPLAY 标题;无描边扫除覆盖子树;鎏金段在列实测。
    4. 记「不适用/残差」:Toast 官方 primitives 内部件、无稳定活实例可瞄(面色已
       随 token 对齐);品牌字标维持官方 brand(CSS 无法换 SVG 内容,DOM 手术
       违铁律)—— ROADMAP §4 品牌残差就此定案;scrim 色彩即上述 mask。
    实测:hero h1=33px Cormorant + badge mono r99 金 + glow artHidden=true +
    芯片 r99;cmdMenu r13 item r9(7 项);settings panel 802 r18 surface +
    nav 188 tint + 五节导航 + aurumRow 在列;回归 gate/p8b/proto-diff 全绿。

    ── P14 · 响应式(2026-08-24)──────────────────────────────
    探针实测:官方无抽屉 DOM,≤900 自动收 68px 折叠轨(即我们的细条)——
    原型 §10 的 fixed 抽屉方案「不适用」,跟随官方折叠行为,只做逐档降密度:
    ≤820 头部/流/输入坞收 padding、hero 25px;≤640 tab 12px、气泡 90%、
    goal-track 64px、stats 分隔收窄;≤480 todo-bar 整行、工具卡参数摘要隐藏、
    todo-it 10.5px。360-1920 全档零横向滚动(输入卡/清单条零溢出)。 */

const SERIF = "'Noto Serif SC','Palatino Linotype',Georgia,serif";
const DISPLAY = "'Cormorant Garamond','Noto Serif SC','Palatino Linotype',Georgia,serif";
const UI = "'Noto Sans SC',-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei','Helvetica Neue',Helvetica,Arial,sans-serif";
const MONO = "'JetBrains Mono','SF Mono','Fira Code',Consolas,'Liberation Mono',Menlo,'PingFang SC','Microsoft YaHei'";

const FONT_TOKENS = {
  "--dsw-font-family": UI,
  "--ds-font-family-code": MONO,
  "--dsw-font-markdown-base": "15.5px/30px " + SERIF,
  "--dsw-font-markdown-base-font-family": SERIF,
  "--dsw-font-markdown-base-strong": "600 15.5px/30px " + SERIF,
  "--dsw-font-markdown-base-strong-font-family": SERIF,
  "--dsw-font-markdown-base-italic": "italic 15.5px/30px " + SERIF,
  "--dsw-font-markdown-base-italic-font-family": SERIF,
  "--dsw-font-markdown-base-strong-italic": "italic 600 15.5px/30px " + SERIF,
  "--dsw-font-markdown-base-strong-italic-font-family": SERIF,
  "--dsw-font-markdown-small": "14px/26px " + SERIF,
  "--dsw-font-markdown-small-font-family": SERIF,
  "--dsw-font-markdown-small-strong": "600 14px/26px " + SERIF,
  "--dsw-font-markdown-small-strong-font-family": SERIF,
  "--dsw-font-markdown-small-italic": "italic 14px/26px " + SERIF,
  "--dsw-font-markdown-small-italic-font-family": SERIF,
  "--dsw-font-markdown-small-strong-italic": "italic 600 14px/26px " + SERIF,
  "--dsw-font-markdown-small-strong-italic-font-family": SERIF,
  "--dsw-font-markdown-table": "14.5px/25px " + SERIF,
  "--dsw-font-markdown-table-font-family": SERIF,
  "--dsw-font-markdown-table-head": "600 14.5px/25px " + SERIF,
  "--dsw-font-markdown-table-head-font-family": SERIF,
  "--dsw-font-markdown-h1": "600 26px/36px " + DISPLAY,
  "--dsw-font-markdown-h1-font-family": DISPLAY,
  "--dsw-font-markdown-h2": "600 23px/33px " + DISPLAY,
  "--dsw-font-markdown-h2-font-family": DISPLAY,
  "--dsw-font-markdown-h3": "600 20px/30px " + DISPLAY,
  "--dsw-font-markdown-h3-font-family": DISPLAY,
  "--dsw-font-markdown-h4": "600 16px/28px " + DISPLAY,
  "--dsw-font-markdown-h4-font-family": DISPLAY
};

const DARK_TOKENS = {
  "--dsw-alias-bg-base": "oklch(16% 0.014 330)",
  "--dsw-alias-bg-layer-1": "oklch(21% 0.016 328)",
  "--dsw-alias-bg-layer-2": "oklch(25.5% 0.018 326)",
  "--dsw-alias-bg-layer-3": "oklch(27.5% 0.02 326)",
  "--dsw-alias-bg-overlay": "oklch(26.5% 0.019 327)",
  "--dsw-alias-bg-module-platform": "oklch(22% 0.017 327)",
  "--dsw-alias-bg-multi-select": "oklch(24% 0.018 327)",
  "--dsw-alias-bg-mask-1": "oklch(8% 0.02 330 / 0.5)",
  "--dsw-alias-bg-mask-2": "oklch(8% 0.02 330 / 0.2)",
  "--dsw-alias-bg-mask-3": "oklch(8% 0.02 330 / 0.48)",
  "--dsw-alias-bg-mask-photo": "oklch(8% 0.02 330 / 0.88)",
  "--dsw-alias-bg-mask-drop": "oklch(20% 0.03 70 / 0.35)",
  "--dsw-alias-bg-skeleton": "oklch(83% 0.115 88 / 0.06)",
  "--dsw-alias-border-l1": "transparent",
  "--dsw-alias-border-l2": "transparent",
  "--dsw-alias-border-l2-darkmode-thin": "transparent",
  "--dsw-alias-border-l3": "transparent",
  "--dsw-alias-border-l4": "transparent",
  "--dsw-alias-border-inverted": "transparent",
  "--dsw-alias-border-inverted2": "transparent",
  "--dsw-alias-brand-primary": "oklch(79% 0.13 84)",
  "--dsw-alias-brand-primary-invert": "oklch(21% 0.03 60)",
  "--dsw-alias-brand-primary-new-colorprimary-new-color": "oklch(83% 0.115 88)",
  "--dsw-alias-brand-text": "oklch(70% 0.1 85)",
  "--dsw-alias-label-primary-inverted": "oklch(21% 0.03 60)",
  "--dsw-alias-label-primary-foreground": "oklch(21% 0.03 60)",
  "--dsw-alias-button-primary-fill": "oklch(79% 0.13 84)",
  "--dsw-alias-button-primary-hover": "oklch(74% 0.13 83)",
  "--dsw-alias-button-primary-dimmed": "oklch(23% 0.018 327)",
  "--dsw-alias-button-contrast-fill": "oklch(93% 0.015 85)",
  "--dsw-alias-button-elevated-fill": "oklch(23.5% 0.018 328)",
  "--dsw-alias-button-floating-fill": "oklch(21% 0.016 328)",
  "--dsw-alias-button-floating-hover": "oklch(25.5% 0.018 326)",
  "--dsw-alias-button-ghost-active-border": "transparent",
  "--dsw-alias-button-ghost-active-fill": "oklch(24% 0.018 327)",
  "--dsw-alias-button-ghost-active-hover": "oklch(27% 0.019 327)",
  "--dsw-alias-button-info-fill": "oklch(79% 0.13 84)",
  "--dsw-alias-button-info-hover": "oklch(74% 0.13 83)",
  "--dsw-alias-button-tool-bar-fill-invisible": "rgba(31, 31, 31, 0.36)",
  "--dsw-alias-button-tool-bar-fill": "rgba(84, 85, 87, 0.5)",
  "--dsw-alias-button-tool-bar-hover": "rgba(84, 85, 87, 0.6)",
  "--dsw-alias-interactive-bg-hover": "oklch(83% 0.115 88 / 0.08)",
  "--dsw-alias-interactive-bg-hover-accent": "oklch(83% 0.115 88 / 0.16)",
  "--dsw-alias-interactive-bg-hover-danger": "oklch(68% 0.16 15 / 0.14)",
  "--dsw-alias-interactive-bg-hover-solid": "oklch(25.5% 0.018 326)",
  "--dsw-alias-interactive-bg-active": "oklch(83% 0.115 88 / 0.14)",
  "--dsw-alias-label-primary": "oklch(93% 0.015 85)",
  "--dsw-alias-label-secondary": "oklch(74% 0.022 328)",
  "--dsw-alias-label-tertiary": "oklch(56% 0.022 330)",
  "--dsw-alias-label-caption": "oklch(52% 0.022 330)",
  "--dsw-alias-label-quaternary": "oklch(48% 0.02 330)",
  "--dsw-alias-label-dimmed": "oklch(40% 0.02 330)",
  "--dsw-alias-label-primary-dimmed": "oklch(75% 0.02 85)",
  "--dsw-alias-label-primary-bluish": "oklch(83% 0.115 88)",
  "--dsw-alias-markdown-code-block": "oklch(13.5% 0.012 330)",
  "--dsw-alias-markdown-code-block-banner": "oklch(15% 0.013 330)",
  "--dsw-alias-markdown-inline-code": "oklch(25.5% 0.018 326)",
  "--dsw-alias-markdown-code-segment-selected": "oklch(23.5% 0.018 328)",
  "--dsw-alias-markdown-code-segment-unselected": "oklch(19% 0.015 329)",
  "--dsw-alias-markdown-citation": "oklch(24% 0.018 327)",
  "--dsw-alias-markdown-placeholder": "oklch(22% 0.017 327)",
  "--dsw-alias-markdown-tag": "oklch(23.5% 0.018 328)",
  "--dsw-alias-scrollbar-bg-l1": "oklch(74% 0.022 328 / 0.24)",
  "--dsw-alias-scrollbar-bg-l2": "oklch(74% 0.022 328 / 0.24)",
  "--dsw-alias-scrollbar-hover-l1": "oklch(83% 0.115 88 / 0.55)",
  "--dsw-alias-scrollbar-hover-l2": "oklch(83% 0.115 88 / 0.55)",
  "--dsw-alias-state-business-primary": "oklch(83% 0.115 88)",
  "--dsw-alias-state-business-tertiary": "oklch(30% 0.05 70)",
  "--dsw-alias-state-error-primary": "oklch(68% 0.16 15)",
  "--dsw-alias-state-error-secondary": "oklch(70% 0.14 18)",
  "--dsw-alias-state-success-primary": "oklch(78% 0.1 155)",
  "--dsw-alias-state-success-secondary": "oklch(76% 0.1 150)",
  "--dsw-alias-state-success-tertiary": "oklch(28% 0.05 150)",
  "--dsw-alias-state-warn-label": "oklch(72% 0.11 70)",
  "--dsw-alias-state-warn-primary": "oklch(80% 0.13 80)",
  "--dsw-alias-state-warn-secondary": "oklch(78% 0.12 78)",
  "--dsw-alias-state-warn-tertiary": "oklch(30% 0.05 70)",
  "--dsw-alias-toast-bg": "oklch(26.5% 0.019 327)",
  "--dsw-alias-tooltip-bg": "oklch(26.5% 0.019 327)",
  "--dsw-specific-bubble": "oklch(30% 0.045 82)",
  "--dsw-specific-bubble-highlight": "oklch(33% 0.05 82)",
  "--dsw-specific-input-major": "oklch(19% 0.015 329)",
  "--dsw-specific-login-input": "oklch(16.5% 0.014 330)",
  "--dsw-specific-menu": "oklch(26.5% 0.019 327)",
  "--dsw-specific-selector": "oklch(22% 0.017 327)",
  "--dsw-specific-sidebar-fill": "oklch(21.5% 0.016 329)",
  "--dsw-specific-sidebar-nav-item-active": "oklch(27% 0.03 84)",
  "--dsw-specific-sidebar-nav-item-active-accent": "oklch(30% 0.04 84)",
  "--dsw-specific-sidebar-nav-item-hover": "oklch(23.5% 0.018 328)",
  "--dsw-specific-tip": "oklch(24% 0.018 327)"
};

const LIGHT_TOKENS = {
  "--dsw-alias-bg-base": "oklch(96.5% 0.012 82)",
  "--dsw-alias-bg-layer-1": "oklch(98.5% 0.008 82)",
  "--dsw-alias-bg-layer-2": "oklch(92% 0.016 84)",
  "--dsw-alias-bg-layer-3": "oklch(90.5% 0.018 84)",
  "--dsw-alias-bg-overlay": "oklch(97% 0.01 83)",
  "--dsw-alias-bg-module-platform": "oklch(95% 0.014 83)",
  "--dsw-alias-bg-multi-select": "oklch(93.5% 0.015 83)",
  "--dsw-alias-bg-mask-1": "oklch(30% 0.05 330 / 0.32)",
  "--dsw-alias-bg-mask-2": "oklch(30% 0.05 330 / 0.12)",
  "--dsw-alias-bg-mask-3": "oklch(30% 0.05 330 / 0.45)",
  "--dsw-alias-bg-mask-photo": "oklch(20% 0.03 330 / 0.85)",
  "--dsw-alias-bg-mask-drop": "oklch(96% 0.015 82 / 0.7)",
  "--dsw-alias-bg-skeleton": "oklch(50% 0.115 80 / 0.08)",
  "--dsw-alias-border-l1": "transparent",
  "--dsw-alias-border-l2": "transparent",
  "--dsw-alias-border-l2-darkmode-thin": "transparent",
  "--dsw-alias-border-l3": "transparent",
  "--dsw-alias-border-l4": "transparent",
  "--dsw-alias-border-inverted": "transparent",
  "--dsw-alias-border-inverted2": "transparent",
  "--dsw-alias-brand-primary": "oklch(50% 0.12 78)",
  "--dsw-alias-brand-primary-invert": "oklch(99% 0.005 85)",
  "--dsw-alias-brand-primary-new-colorprimary-new-color": "oklch(55% 0.115 80)",
  "--dsw-alias-brand-text": "oklch(50% 0.12 78)",
  "--dsw-alias-label-primary-inverted": "oklch(99% 0.005 85)",
  "--dsw-alias-label-primary-foreground": "oklch(24% 0.04 60)",
  "--dsw-alias-button-primary-fill": "oklch(50% 0.12 78)",
  "--dsw-alias-button-primary-hover": "oklch(45% 0.12 76)",
  "--dsw-alias-button-primary-dimmed": "oklch(91% 0.016 84)",
  "--dsw-alias-button-contrast-fill": "oklch(28% 0.05 330)",
  "--dsw-alias-button-elevated-fill": "oklch(99% 0.006 82)",
  "--dsw-alias-button-floating-fill": "oklch(98.5% 0.008 82)",
  "--dsw-alias-button-floating-hover": "oklch(96% 0.013 83)",
  "--dsw-alias-button-ghost-active-border": "transparent",
  "--dsw-alias-button-ghost-active-fill": "oklch(93.5% 0.015 83)",
  "--dsw-alias-button-ghost-active-hover": "oklch(91% 0.017 84)",
  "--dsw-alias-button-info-fill": "oklch(55% 0.115 80)",
  "--dsw-alias-button-info-hover": "oklch(50% 0.12 78)",
  "--dsw-alias-button-tool-bar-fill-invisible": "rgba(31, 31, 31, 0.36)",
  "--dsw-alias-button-tool-bar-fill": "rgba(84, 85, 87, 0.5)",
  "--dsw-alias-button-tool-bar-hover": "rgba(84, 85, 87, 0.6)",
  "--dsw-alias-interactive-bg-hover": "oklch(50% 0.115 80 / 0.08)",
  "--dsw-alias-interactive-bg-hover-accent": "oklch(50% 0.115 80 / 0.14)",
  "--dsw-alias-interactive-bg-hover-danger": "oklch(52% 0.16 18 / 0.07)",
  "--dsw-alias-interactive-bg-hover-solid": "oklch(94% 0.014 83)",
  "--dsw-alias-interactive-bg-active": "oklch(50% 0.115 80 / 0.12)",
  "--dsw-alias-label-primary": "oklch(28% 0.05 330)",
  "--dsw-alias-label-secondary": "oklch(46% 0.035 330)",
  "--dsw-alias-label-tertiary": "oklch(62% 0.03 330)",
  "--dsw-alias-label-caption": "oklch(60% 0.03 330)",
  "--dsw-alias-label-quaternary": "oklch(70% 0.025 330)",
  "--dsw-alias-label-dimmed": "oklch(78% 0.025 330)",
  "--dsw-alias-label-primary-dimmed": "oklch(35% 0.045 330)",
  "--dsw-alias-label-primary-bluish": "oklch(45% 0.115 78)",
  "--dsw-alias-markdown-code-block": "oklch(94.5% 0.014 82)",
  "--dsw-alias-markdown-code-block-banner": "oklch(95.5% 0.013 82)",
  "--dsw-alias-markdown-inline-code": "oklch(92% 0.016 84)",
  "--dsw-alias-markdown-code-segment-selected": "oklch(96% 0.013 83)",
  "--dsw-alias-markdown-code-segment-unselected": "oklch(94% 0.014 82)",
  "--dsw-alias-markdown-citation": "oklch(93% 0.015 83)",
  "--dsw-alias-markdown-placeholder": "oklch(95% 0.014 83)",
  "--dsw-alias-markdown-tag": "oklch(94.5% 0.014 82)",
  "--dsw-alias-scrollbar-bg-l1": "oklch(46% 0.035 330 / 0.3)",
  "--dsw-alias-scrollbar-bg-l2": "oklch(46% 0.035 330 / 0.3)",
  "--dsw-alias-scrollbar-hover-l1": "oklch(55% 0.115 80 / 0.5)",
  "--dsw-alias-scrollbar-hover-l2": "oklch(55% 0.115 80 / 0.5)",
  "--dsw-alias-state-business-primary": "oklch(55% 0.115 80)",
  "--dsw-alias-state-business-tertiary": "oklch(92% 0.04 80)",
  "--dsw-alias-state-error-primary": "oklch(52% 0.16 18)",
  "--dsw-alias-state-error-secondary": "oklch(58% 0.14 20)",
  "--dsw-alias-state-success-primary": "oklch(52% 0.11 155)",
  "--dsw-alias-state-success-secondary": "oklch(50% 0.11 150)",
  "--dsw-alias-state-success-tertiary": "oklch(91% 0.05 150)",
  "--dsw-alias-state-warn-label": "oklch(48% 0.11 55)",
  "--dsw-alias-state-warn-primary": "oklch(52% 0.12 60)",
  "--dsw-alias-state-warn-secondary": "oklch(55% 0.12 62)",
  "--dsw-alias-state-warn-tertiary": "oklch(92% 0.05 75)",
  "--dsw-alias-toast-bg": "oklch(28% 0.05 330)",
  "--dsw-alias-tooltip-bg": "oklch(28% 0.05 330)",
  "--dsw-specific-bubble": "oklch(93% 0.035 83)",
  "--dsw-specific-bubble-highlight": "oklch(90% 0.045 83)",
  "--dsw-specific-input-major": "oklch(97.5% 0.01 82)",
  "--dsw-specific-login-input": "oklch(95.5% 0.012 82)",
  "--dsw-specific-menu": "oklch(97% 0.01 83)",
  "--dsw-specific-selector": "oklch(95% 0.014 83)",
  "--dsw-specific-sidebar-fill": "oklch(96.5% 0.012 82)",
  "--dsw-specific-sidebar-nav-item-active": "oklch(91% 0.03 82)",
  "--dsw-specific-sidebar-nav-item-active-accent": "oklch(89% 0.04 82)",
  "--dsw-specific-sidebar-nav-item-hover": "oklch(96% 0.013 83)",
  "--dsw-specific-tip": "oklch(95% 0.014 83)"
};

const AURUM_DARK = { id: "aurum-dark", colorScheme: "dark", tokens: Object.assign({}, FONT_TOKENS, DARK_TOKENS) };
const AURUM_LIGHT = { id: "aurum-light", colorScheme: "light", tokens: Object.assign({}, FONT_TOKENS, LIGHT_TOKENS) };

const CSS1 = [
  "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Noto+Serif+SC:wght@400;500;600&family=Noto+Sans+SC:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');",
  "body[data-ds-dark-theme]{--aurum-gold:oklch(83% .115 88);--aurum-gold-strong:oklch(79% .13 84);--aurum-gold-dim:oklch(70% .10 85);--aurum-dot:oklch(83% .115 88 / .08);--aurum-sheen-top:oklch(83% .115 88 / .07);--aurum-sheen-rose:oklch(77% .095 350 / .05);--aurum-rail-1:oklch(19% .015 329);--aurum-rail-2:oklch(21.5% .016 329);--aurum-rail-shadow:0 16px 48px oklch(8% .02 330 / .55);--aurum-ring:oklch(79% .13 84 / .22);--aurum-ring-glow:oklch(79% .13 84 / .12);--aurum-focus:oklch(83% .115 88 / .55);--aurum-selection:oklch(79% .13 84 / .35);--aurum-sweep:oklch(83% .115 88 / .18)}",
  "body:not([data-ds-dark-theme]){--aurum-gold:oklch(55% .115 80);--aurum-gold-strong:oklch(50% .12 78);--aurum-gold-dim:oklch(66% .11 82);--aurum-dot:oklch(28% .05 330 / .13);--aurum-sheen-top:oklch(60% .11 80 / .06);--aurum-sheen-rose:transparent;--aurum-rail-1:oklch(94.5% .014 82);--aurum-rail-2:oklch(96.5% .012 82);--aurum-rail-shadow:0 16px 44px oklch(30% .05 330 / .18);--aurum-ring:oklch(55% .115 80 / .2);--aurum-ring-glow:oklch(55% .115 80 / .1);--aurum-focus:oklch(55% .115 80 / .6);--aurum-selection:oklch(55% .115 80 / .3);--aurum-sweep:oklch(55% .115 80 / .2)}",
  /* 背景画布(2026-08-24 用户决策:去晕染):只留底色 + 点阵,不再叠金辉/玫粉 radial ——
     此前两片晕染横向压在主区(50%/-12% 与 88%/112%),侧栏区没有,造成左右分界、主区浑浊 */
  "body{background-color:var(--dsw-alias-bg-base);background-image:radial-gradient(circle,var(--aurum-dot) 1px,transparent 1.35px);background-size:24px 24px}",
  "body #root,body [data-slot=root]>div,body [data-slot=conversation]>div{background-color:transparent}",
  /* 栏几何: 内容根即卡片本体(原型 .sidebar), 列只负责四向留白 — 左12/右4 使卡片恰为 264px;
     卡片自带 overflow:hidden, 内部行/hover 永不溢出圆角边界 */
  "body [data-slot=root]>div>div:first-child{background:transparent;border-right:none;padding:12px 4px 12px 12px;box-sizing:border-box}",
  /* P8c 折叠细条:轨道 68 = 12 留白 + 56 卡(原型 .app.no-sb margin 12 + width 56)。
     覆写与官方内联同形(px/minmax/px),0.3s grid 过渡可正常插值;仅折叠态生效,
     展开轨宽(用户拖拽值)不受影响 —— 折叠轨本就是常量 56,无动态可跟 */
  "body [data-slot=root]>div[data-sidebar-collapsed]{grid-template-columns:68px minmax(0px,1fr) 0px!important}",
  "body [data-slot=root]>div[data-sidebar-collapsed]>div:first-child{padding:12px 0}",
  "body [data-slot=root]>div>div:nth-child(3){background:transparent;border-left:none;padding:12px;box-sizing:border-box}",
  "body [data-slot=sidebar]>div:first-child{background:linear-gradient(180deg,var(--aurum-rail-1),var(--aurum-rail-2) 36%);box-shadow:var(--aurum-rail-shadow);border-radius:20px;overflow:hidden;width:auto!important;font-size:13px;--dsh-sidebar-inline-padding:0px;transition:border-radius .42s cubic-bezier(.22,.8,.26,1)}",
  "body [data-slot=sidebar]>div:first-child[class*=collapsed]{padding:0;border-radius:17px;width:56px!important;margin-left:12px}",
  "body [data-slot=details]>div:first-child{background:linear-gradient(180deg,var(--aurum-rail-1),var(--aurum-rail-2) 36%);box-shadow:var(--aurum-rail-shadow);border-radius:20px;overflow:hidden;width:auto!important}",
  "body [data-slot=sidebar] [class*=logoRow]{height:58px;margin:0;padding:0 12px 0 14px;gap:6px;flex:none}",
  "body [data-slot=sidebar] [class*=logoRow] [class*=brand]{flex:1;min-width:0;height:38px;border-radius:11px;padding:0 10px;transition:background .18s,color .18s,transform .1s}",
  "body [data-slot=sidebar] [class*=logoRow] [class*=brand]:hover{background:var(--dsw-alias-interactive-bg-hover-solid)}",
  "body [data-slot=sidebar] [class*=logoRow] [class*=brand]:active{transform:scale(.985)}",
  "body [data-slot=sidebar] [class*=logoRow] [class*=brand] svg{width:auto;height:22px}",
  "body [data-slot=sidebar] [class*=iconButton]{width:30px;height:30px;border-radius:9px;color:var(--dsw-alias-label-tertiary);transition:.18s}",
  "body [data-slot=sidebar] [class*=iconButton]:hover{background:var(--dsw-alias-interactive-bg-hover-solid);color:var(--aurum-gold)}",
  "body [data-slot=sidebar] [class*=iconButton]:active{transform:scale(.96)}",
  "body [data-slot=sidebar] [class*=iconButton] svg{width:15px;height:15px}",
  "body [data-slot=sidebar] button[class*=newSession]{position:relative;height:36px;margin:2px 12px 10px;border:none;border-radius:11px;background:color-mix(in oklab,var(--aurum-gold) 15%,var(--dsw-alias-bg-layer-1));color:var(--aurum-gold-strong);font-size:13px;font-weight:600;letter-spacing:.02em;justify-content:center;gap:0;padding:0 14px;transition:background .18s,transform .1s;flex:none}",
  "body [data-slot=sidebar] button[class*=newSession]:hover{background:color-mix(in oklab,var(--aurum-gold) 22%,var(--dsw-alias-bg-layer-1))}",
  "body [data-slot=sidebar] button[class*=newSession]:active{transform:scale(.985)}",
  "body [data-slot=sidebar] button[class*=newSession] svg{display:none}",
  "body [data-slot=sidebar] button[class*=newSession]::before{content:\"+\";position:absolute;left:14px;top:50%;transform:translateY(-50%);font:300 17px/1 var(--ds-font-family-code);color:var(--aurum-gold-strong)}",
  "body [data-slot=sidebar] button[class*=newSession] span{margin:0;color:inherit}",
  "body [data-slot=sidebar] [class*=regionArea]{flex:1;min-height:0;padding:0;margin:0;display:flex;flex-direction:column;overflow:hidden}",
  "body [data-slot=sidebar] [class*=footArea]{flex:none;border-top:1px solid var(--dsw-alias-border-l2);padding:8px;margin:0;gap:0}",
  "body [data-slot=sidebar] [class*=footerActions],body [data-slot=sidebar] [class*=settingsArea]{display:flex;flex-direction:column;gap:0}",
  "body [data-slot=sidebar] [class*=settingsArea] button,body [data-slot=sidebar] [class*=settingsArea] [role=button]{display:flex;align-items:center;gap:10px;width:100%;height:38px;margin:0;padding:0 10px;border:none;border-radius:10px;background:transparent;color:var(--dsw-alias-label-secondary);font:400 13px/20px var(--dsw-font-family);cursor:pointer;transition:background .18s,color .18s;text-align:left}",
  "body [data-slot=sidebar] [class*=settingsArea] button:hover,body [data-slot=sidebar] [class*=settingsArea] [role=button]:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}",
  "body [data-slot=sidebar] [class*=settingsArea] svg{width:15px;height:15px;flex:none;color:var(--dsw-alias-label-tertiary);transition:color .18s}",
  "body [data-slot=sidebar] [class*=settingsArea] :hover>svg,body [data-slot=sidebar] [class*=settingsArea] button:hover svg{color:var(--aurum-gold)}",
  /* P8c 折叠细条:顶部 logo/新建/搜索由 AuBrowserRail 自建(原型 .sb-rail),
     由 AuBrowserRail 自建(原型 .sb-rail),官方 logoRow/newSession 隐藏;底部设置/主题钮保留 */
  "body [data-slot=sidebar] [class*=collapsed] [class*=logoRow]{display:none}",
  "body [data-slot=sidebar] [class*=collapsed] button[class*=newSession]{display:none}",
  "body [data-slot=sidebar] [class*=collapsed] [class*=footArea]{border-top:none;padding:6px 0}",
  "body [data-slot=sidebar] [class*=collapsed] .aurum-footRow{width:40px;height:40px;justify-content:center;padding:0;border-radius:12px;gap:0}",
  "body [data-slot=sidebar] [class*=collapsed] .aurum-footRow span{display:none}",
  "body [data-slot=sidebar] [class*=collapsed] [class*=footerActions],body [data-slot=sidebar] [class*=collapsed] [class*=settingsArea]{align-items:center}",
  "body [data-slot=sidebar] [class*=collapsed] [class*=settingsArea] button,body [data-slot=sidebar] [class*=collapsed] [class*=settingsArea] [role=button]{width:40px;height:40px;justify-content:center;padding:0;border-radius:12px;gap:0}",
  "body [data-slot=sidebar] [class*=collapsed] [class*=settingsArea] span{display:none}",
  /* P9:逐节点入场(原型 .node rise)——挂在官方 flowItem 行上;列 gap16+行距12=原型 .node 28px 节奏 */
  "body [data-chat-anchor-key]{margin-bottom:12px;animation:aurum-rise .6s cubic-bezier(.22,.8,.26,1) both}",
  "@keyframes aurum-rise{from{opacity:0;transform:translateY(12px)}}",
  /* ── P9 残留 · sh-head 主区头部(官方 DOM 瞄准 wSkVaW_*,原型 §5 sh-head/tabs)──
     官方=76px 双行带(标题行32+tabs行27),原型=单行浮头(高70);不重排 DOM,只换皮:
     mono 弱化 chips、tabs 胶囊右置金 on。(渐隐底纱 2026-08-24 撤:用户不要主区任何背景色) */
  "body .wSkVaW_header{background:none;border-bottom:none}",
  /* ── P13 · hero 空态(官方 HeroShell pXSMma_* / composerHero,原型 §9 hero 栈)── */
  "body .wSkVaW_composerHero{max-width:760px}",
  "body .pXSMma_stack{gap:12px}",
  "body .pXSMma_headline{font-family:var(--font-display);font-weight:500;font-size:33px;letter-spacing:.05em;line-height:1.25;color:var(--fg)}",
  "body .pXSMma_headline .pXSMma_fish{color:var(--gold)}",
  "body .pXSMma_previewBadge{font-family:var(--font-mono);font-size:10px;letter-spacing:.16em;color:var(--gold-strong);border:1px solid oklch(79% 0.13 84 / .35);border-radius:99px;padding:3px 10px 3px 11px;transform:translateY(1px);background:none}",
  "body:not([data-ds-dark-theme]) .pXSMma_previewBadge{border-color:oklch(55% 0.115 80 / .35)}",
  "body .pXSMma_workspace{background:var(--surface);border:1px solid var(--border-soft);border-radius:99px;padding:8px 14px;font-size:12.5px;color:var(--muted);transition:border-color .18s,color .18s}",
  "body .pXSMma_workspace:hover:not(:disabled),body .pXSMma_workspace[aria-expanded=true]{border-color:color-mix(in oklab,var(--gold) 42%,var(--border-soft));color:var(--fg)}",
  "body .pXSMma_workspace svg{color:var(--faint)}",
  "body .pXSMma_workspace:hover:not(:disabled) svg{color:var(--gold-strong)}",
  /* hero-glow:官方是 SVG 插画 → 藏画,容器改原型径向金辉(gold 15% → 72% 渐隐) */
  "body .wSkVaW_heroGlow *{display:none}",
  "body .wSkVaW_heroGlow{background:radial-gradient(50% 50% at 50% 50%,color-mix(in oklab,var(--gold) 15%,transparent),transparent 72%)}",
  /* 底栏滚出渐隐纱撤除(2026-08-24 续「背景去晕染」):composerSeat 官方画
     「transparent→bg 36px 渐变 + 下方实底」,色=body 底色 → 视觉=点阵在底栏
     分界处被半透明渐变吞掉。原型输入区是文档流内 .input-zone,无任何纱,
     点阵直通底部;撤后输入卡(半透明)与目标条(实底)各自浮于画布上 */
  "body .wSkVaW_root[data-phase=active] .wSkVaW_composerSeat,body .wSkVaW_composerSeat{background:none}",
  "body .wSkVaW_header *{border-color:transparent!important}",
  "body .wSkVaW_crumb,body .wSkVaW_crumbCurrent{font-family:var(--font-display);font-weight:500;font-size:18.5px;letter-spacing:.02em;color:var(--fg)}",
  "body .wSkVaW_crumbs{min-width:0;overflow:hidden}",
  "body .wSkVaW_headerActions .SVAs4q_label{font-family:var(--font-mono);font-size:10.5px;color:var(--faint);letter-spacing:.14em}",
  "body .nL4_yW_sessionLogButton{font-family:var(--font-mono);font-size:10.5px;color:var(--faint);letter-spacing:.1em}",
  "body .wSkVaW_tabs{display:flex;justify-content:flex-end;width:max-content;margin-left:auto;gap:2px;border:1px solid transparent;border-radius:999px;padding:3px;background:color-mix(in oklab,var(--bg-deep) 84%,transparent)}",
  "body .wSkVaW_tab{padding:5px 15px;border-radius:999px;font-size:12.5px;color:var(--muted);transition:.18s;white-space:nowrap}",
  "body .wSkVaW_tab:hover{color:var(--fg)}",
  "body .wSkVaW_tabActive,body .wSkVaW_tab.wSkVaW_tabActive{background:oklch(79% 0.13 84 / .16);color:var(--gold-strong)}",
  "body:not([data-ds-dark-theme]) .wSkVaW_tabActive{background:oklch(55% 0.115 80 / .13)}",
  /* ── P9 残留 · reasoning 折叠段(官方 ReasoningRow QWLzlG_*,原型 .reasoning)──
     卡片化(surface tint r12)+ mono 头 + serif italic 思路体 + 虚线分隔;运行扫光换金 */
  "body [data-chat-flow-kind=assistant-step] .QWLzlG_root{background:color-mix(in oklab,var(--surface) 55%,transparent);border-radius:12px;margin-bottom:10px;overflow:hidden}",
  "body .QWLzlG_row{padding:8px 13px}",
  "body .QWLzlG_title{font-family:var(--font-mono);font-weight:400;font-size:11.5px;color:var(--faint);letter-spacing:.04em}",
  "body .QWLzlG_summary{font-family:var(--font-mono);font-size:11.5px;color:var(--faint);line-height:1.7}",
  "body .QWLzlG_chevron{color:var(--gold-dim)}",
  "body .QWLzlG_thinkBody{font-family:var(--font-serif);font-style:italic;font-size:13px;line-height:1.9;color:var(--muted);padding:8px 15px 12px;margin:0 13px;border-top:1px dashed color-mix(in oklab,var(--muted) 25%,transparent)}",
  "body .QWLzlG_root[data-state=running] .QWLzlG_row:after{background:linear-gradient(90deg,transparent 0%,color-mix(in oklab,var(--gold) 16%,transparent) 55%,transparent 100%)}",
  "body ::selection{background:var(--aurum-selection)}",
  "body :focus-visible{outline:2px solid var(--aurum-focus);outline-offset:2px}",
  "body [data-composer-card]{border-radius:22px;transition:box-shadow .25s ease}",
  /* 输入卡实色(2026-08-24 用户决策:不要任何半透明)—— solid surface,与侧栏/推理卡
     同族面色,点阵不再透过;金圈 focus 与阴影保留 */
  "body [data-composer-card]{background:var(--surface)}",
  /* 无描边原则(原型 --border 全透明): 侧栏/输入卡/详情栏子树内一律去描边,
     元素仅以面色 tint 与背景区分 — 官方默认主题在 body 层定义 --dsw-alias-border-*,
     主题 token 无法覆盖, 故直写 transparent */
  "body [data-slot=sidebar] *,body [data-slot=details] *,body [data-composer-card],body [data-composer-card] *{border-color:transparent!important}",
  "body [data-composer-card]:focus-within{box-shadow:0 0 0 2px var(--aurum-ring),0 0 28px var(--aurum-ring-glow),var(--aurum-rail-shadow)}",
  "body:not(#aurum-boost) [data-state=running]::after,body:not(#aurum-boost) [data-state=running]>div::after{background:linear-gradient(90deg,transparent 0%,var(--aurum-sweep) 50%,transparent 100%)}",
  ".aurum-footRow{display:flex;align-items:center;gap:10px;width:100%;height:38px;padding:0 10px;border:none;border-radius:10px;background:transparent;color:var(--dsw-alias-label-secondary);font:400 13px/20px var(--dsw-font-family);cursor:pointer;transition:background .18s,color .18s;text-align:left}",
  ".aurum-footRow:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}",
  ".aurum-footRow svg{width:15px;height:15px;flex:none;color:var(--dsw-alias-label-tertiary);transition:color .18s}",
  ".aurum-footRow:hover svg{color:var(--aurum-gold)}",
  ".aurum-row{border-bottom:1px solid transparent;display:flex;flex-direction:column;gap:8px;padding:16px 0}",
  ".aurum-rowTitle{color:var(--dsw-alias-label-primary);font-size:14px;font-weight:400;line-height:22px}",
  ".aurum-seg{display:flex;gap:2px;border:1px solid transparent;border-radius:999px;padding:3px;background:var(--dsw-alias-bg-layer-2);width:max-content;max-width:100%;flex-wrap:wrap}",
  ".aurum-segBtn{padding:5px 14px;border:none;border-radius:999px;background:transparent;color:var(--dsw-alias-label-tertiary);font:400 12px/18px var(--dsw-font-family);cursor:pointer;transition:color .18s,background .18s;white-space:nowrap}",
  ".aurum-segBtn:hover{color:var(--dsw-alias-label-primary)}",
  ".aurum-segBtn[aria-pressed=true]{background:color-mix(in oklab,var(--aurum-gold) 16%,transparent);color:var(--aurum-gold-strong);font-weight:500}",
  ".aurum-hint{color:var(--dsw-alias-label-tertiary);font:400 12px/19px var(--dsw-font-family);margin:0}",
  "@media (prefers-reduced-motion:reduce){body [data-chat-anchor-key]{animation:none}body [data-composer-card]{transition:none}body [data-slot=root]>div>div:first-child::before{transition:none}}",
  /* ── P10 · 输入坞 composer 卡内部(uV2eYG_*,原型 §6 .composer/.c-tools)──
     排版 14.5/1.7 对齐原型 textarea;input/mirror/backdrop 三件套必须同步改,
     否则 caret 测量(mirror)与背景层错位 */
  "body .uV2eYG_input,body .uV2eYG_mirror,body .uV2eYG_backdrop{font-size:14.5px;line-height:1.7}",
  "body .uV2eYG_input::placeholder{color:var(--faint)}",
  /* mention 芯片/斜杠命令高亮 → 原型 .chip 金 tint(只换色不 repad,防行高错位) */
  "body .uV2eYG_chip{background:oklch(79% 0.13 84 / .12);color:var(--gold-strong)}",
  "body .uV2eYG_hlToken{color:var(--gold-strong);background:oklch(79% 0.13 84 / .07)}",
  "body .uV2eYG_chipInvalid{color:var(--danger)}",
  /* 命令方钮 → 原型 .c-btn.sq 色(几何 28px 官方不动,不与行高斗) */
  "body .uV2eYG_add{color:var(--muted);border-radius:10px;transition:color .15s,background .15s}",
  "body .uV2eYG_add:hover:not(:disabled){color:var(--fg);background:color-mix(in oklab,var(--gold) 12%,var(--surface))}",
  /* send 钮 → 原型 .send 金渐变方钮(官方本就 34×34) */
  "body .uV2eYG_primary{background:linear-gradient(135deg,var(--gold),var(--gold-strong));color:var(--gold-ink);border-radius:12px;box-shadow:0 4px 14px oklch(79% 0.13 84 / .25);transition:.2s}",
  "body .uV2eYG_primary:hover:not(:disabled){filter:brightness(1.08)}",
  "body .uV2eYG_primary:disabled{opacity:.35;box-shadow:none;filter:none}",
  "body:not([data-ds-dark-theme]) .uV2eYG_primary{color:oklch(99% 0.005 85)}",
  /* ── P10 · mode 钮(Sh0Q9G_* → 原型 .mode-btn/.m-name mono)── */
  "body .Sh0Q9G_triggerLabel{font-family:var(--font-mono);font-size:11px}",
  "body .Sh0Q9G_trigger:hover:not(:disabled){background:color-mix(in oklab,var(--gold) 12%,var(--surface))}",
  "body .Sh0Q9G_trigger:focus-visible{box-shadow:0 0 0 2px var(--aurum-focus)}",
  /* ── P10 · model 钮与菜单(_7KE1Ra_* → 原型 .model-btn;菜单吃 .mi 金 hover 风)── */
  "body ._7KE1Ra_triggerLabel{font-family:var(--font-mono);font-size:11px}",
  "body ._7KE1Ra_trigger:hover:not(:disabled){background:color-mix(in oklab,var(--gold) 12%,var(--surface))}",
  "body ._7KE1Ra_menu{border-color:transparent;border-radius:13px;background:var(--surface-2);box-shadow:var(--shadow-panel,0 16px 48px oklch(8% .02 330 / .55))}",
  "body ._7KE1Ra_option:hover:not(:disabled),body ._7KE1Ra_option:focus-visible{background:oklch(79% 0.13 84 / .1)}",
  "body ._7KE1Ra_check{color:var(--gold-strong)}",
  /* ── P10 · ctx-ring/ctxPanel(官方 ContextMeter JObwrW_* 与原型同构:圆环+构成面板)──
     金弧 / tools=玫 / msgs=金 / 大数字 pct;「≥80% 变玫 .hot」不可达 —— CSS 无法读
     dasharray 占用率,记不适用(ROADMAP §6) */
  "body .JObwrW_trigger{width:31px;height:31px;border-radius:50%;background:color-mix(in oklab,var(--surface),var(--bg) 55%);transition:.15s}",
  "body .JObwrW_trigger:hover{background:color-mix(in oklab,var(--gold) 12%,var(--surface))}",
  "body .JObwrW_trigger svg{width:19px;height:19px}",
  "body .JObwrW_track{stroke:color-mix(in oklab, var(--fg) 13%, transparent);stroke-width:2.6}",
  "body .JObwrW_fill{stroke:var(--gold);stroke-width:2.6}",
  "body .JObwrW_panel{border-color:transparent;background:var(--surface-2);border-radius:13px;min-width:238px;padding:12px 13px 9px;box-shadow:var(--shadow-panel,0 16px 48px oklch(8% .02 330 / .55))}",
  "body .JObwrW_header{align-items:baseline;gap:8px;padding:1px 2px 0}",
  "body .JObwrW_headline{font-size:11.5px;color:var(--muted)}",
  "body .JObwrW_percent{font-family:var(--font-display);font-weight:600;font-size:23px;line-height:1;color:var(--gold-strong)}",
  "body .JObwrW_figures{font-family:var(--font-mono);font-size:10.5px;color:var(--faint)}",
  "body .JObwrW_bar{height:6px;border-radius:99px;gap:0;margin:10px 2px 12px;background:color-mix(in oklab, var(--fg) 9%, transparent)}",
  "body .JObwrW_segment{border-radius:99px;min-width:3px}",
  "body .JObwrW_colorSystem{--meter-tint:color-mix(in oklab, var(--fg) 40%, var(--bg))}",
  "body .JObwrW_colorTools{--meter-tint:var(--rose)}",
  "body .JObwrW_colorMessages{--meter-tint:var(--gold)}",
  "body .JObwrW_swatch{border-radius:50%;width:8px;height:8px;margin-right:9px}",
  "body .JObwrW_row dt{font-size:12px;color:var(--muted)}",
  "body .JObwrW_row dd{font-family:var(--font-mono);font-size:11px;color:var(--fg)}",
  "body .JObwrW_row:last-child dd{color:var(--gold-strong)}",
  /* ── P10 · c-stats(官方 StatsLine FJxK0a_* → 原型 .c-stats mono 10.5)── */
  "body .FJxK0a_root{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.04em;color:var(--faint);padding:4px 6px 0}",
  "body .FJxK0a_sep{color:color-mix(in oklab, var(--faint) 45%, transparent);margin:0 9px}",
  /* ── P10 · goal 条(nLMEza_* → 原型 todo-bar 面;P11 起实色,同输入卡决策)── */
  "body .nLMEza_bar{background:var(--surface);border-radius:13px;border-color:transparent}",
  "body .nLMEza_bar,body .nLMEza_bar *{border-color:transparent!important}",
  "body .nLMEza_goalGlyph{color:var(--gold-dim)}",
  "body .nLMEza_label{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.14em;color:var(--faint)}",
  "body .nLMEza_iconBtn:hover:not(:disabled){background:color-mix(in oklab,var(--gold) 12%,var(--surface-2));color:var(--gold-strong)}",
  /* ── P10 · queue 条(_7yHdaG_*)与 TodoPanel 残影(lXshSW_*,详情栏内)同面(实色)── */
  "body ._7yHdaG_panel{background:var(--surface)}",
  "body ._7yHdaG_panel:after{border-color:transparent}",
  "body ._7yHdaG_panel,body ._7yHdaG_panel *{border-color:transparent!important}",
  "body .lXshSW_root{background:var(--surface);border-color:transparent}",
  "body .lXshSW_root,body .lXshSW_root *{border-color:transparent!important}",
  "body ._7yHdaG_header:hover{background:color-mix(in oklab,var(--gold) 10%,transparent)}",
  "body .lXshSW_header:hover{background:color-mix(in oklab,var(--gold) 10%,transparent)}",
  /* ── P13 · 通用菜单金色化(官方 MenuView _3e4SsG_*,含 add 钮命令菜单;
     hero 工作区菜单同源)── 原型 .menu r13 + surface-2 + mi 金 hover */
  "body ._3e4SsG_menu{background:var(--surface-2);border-color:transparent;border-radius:13px;box-shadow:var(--shadow-panel,0 16px 48px oklch(8% .02 330 / .55))}",
  "body ._3e4SsG_item{border-radius:9px;font-size:12.5px;color:var(--muted)}",
  "body ._3e4SsG_item:hover,body ._3e4SsG_item._3e4SsG_active{background:oklch(79% 0.13 84 / .1);color:var(--fg)}",
  "body ._3e4SsG_itemName{font-family:var(--font-mono);font-size:12px;color:var(--fg)}",
  "body ._3e4SsG_itemDescription{font-size:11px;color:var(--faint)}",
  "body ._3e4SsG_item:hover ._3e4SsG_itemName,body ._3e4SsG_item._3e4SsG_active ._3e4SsG_itemName{color:var(--gold-strong)}",
  "body ._3e4SsG_itemIcon{color:var(--faint)}",
  "body ._3e4SsG_item:hover ._3e4SsG_itemIcon,body ._3e4SsG_item._3e4SsG_active ._3e4SsG_itemIcon{color:var(--gold-strong)}",
  "body ._3e4SsG_sectionTitle,body ._3e4SsG_groupTitle{font-family:var(--font-mono);font-size:10px;letter-spacing:.14em;color:var(--faint);text-transform:uppercase}",
  /* ── P13 · 设置弹窗(官方 SettingsRoot VOzbGW_*;官方本就是居中 modal+左导航双栏,
     nav 188px 与原型一致)── 原型 set-dialog:r18 + surface 面 + nav tint + 金 on。
     几何保留官方 800px(内容量多于原型 4 节,424 高装不下,记残差) */
  "body .VOzbGW_mask{background:oklch(8% 0.02 330 / .5);backdrop-filter:blur(3px)}",
  "body .VOzbGW_panel{background:var(--surface);border:1px solid var(--border-soft);border-radius:18px;box-shadow:var(--shadow-panel,0 16px 48px oklch(8% .02 330 / .55))}",
  "body .VOzbGW_nav{border-right:1px solid var(--border-soft);background:color-mix(in oklab, var(--fg) 2.5%, transparent);padding:14px 8px 10px;gap:2px}",
  "body .VOzbGW_navTitle{font-family:var(--font-display);font-weight:600;font-size:13.5px;letter-spacing:.01em;color:var(--fg);padding:0 10px 10px}",
  "body .VOzbGW_navCell{border-radius:9px;font-size:12.5px;color:var(--muted);height:auto;padding:8px 10px;transition:.15s}",
  "body .VOzbGW_navCell:hover{background:oklch(79% 0.13 84 / .07);color:var(--fg)}",
  "body .VOzbGW_navCell.VOzbGW_active{background:oklch(79% 0.13 84 / .12);color:var(--fg);font-weight:500}",
  "body .VOzbGW_navCell.VOzbGW_active .VOzbGW_navIcon{color:var(--gold-strong)}",
  "body .VOzbGW_close{color:var(--faint)}",
  "body .VOzbGW_close:hover{background:color-mix(in oklab, var(--fg) 7%, transparent);color:var(--fg)}",
  "body .VOzbGW_panel,body .VOzbGW_panel *{border-color:transparent!important}",
  "body .VOzbGW_nav{border-right-color:color-mix(in oklab, var(--fg) 8%, transparent)!important}",
];

const CSS2 = [
  ".au-user-row{display:flex;justify-content:flex-end;margin:2px 0}",
  ".au-bubble{max-width:min(525px,82%);border-radius:22px;padding:13px 19px;background:linear-gradient(135deg,color-mix(in oklab,var(--aurum-gold-strong) 16%,transparent),color-mix(in oklab,var(--aurum-gold-strong) 7%,transparent));font-family:var(--dsw-font-markdown-base-font-family);font-size:15px;line-height:1.85;color:var(--dsw-alias-label-primary);white-space:pre-wrap;word-break:break-word}",
  ".au-img{max-width:100%;border-radius:14px;display:block;margin-top:8px}",
  ".au-ctx-row{font-family:var(--ds-font-family-code);font-size:11.5px;color:var(--aurum-gold-dim);padding:2px 4px;letter-spacing:.03em;display:flex;align-items:center;gap:8px}",
  ".au-callrow{margin:0}",
  ".au-fstat{font-family:var(--ds-font-family-code);font-size:10.5px;color:var(--dsw-alias-label-tertiary);letter-spacing:.04em;margin-right:auto}",
  ".au-tool{border:1px solid transparent;border-radius:14px;overflow:hidden;position:relative;background:color-mix(in oklab,var(--dsw-alias-bg-layer-1) 55%,transparent);margin:1px 0}",
  "body:not([data-ds-dark-theme]) .au-tool{background:color-mix(in oklab,var(--dsw-alias-bg-layer-1) 80%,transparent)}",
  ".au-main{display:flex;align-items:center;gap:11px;padding:10px 13px;cursor:pointer;user-select:none}",
  ".au-main:hover{background:color-mix(in oklab,var(--dsw-alias-bg-layer-2) 50%,transparent)}",
  ".au-ico{width:27px;height:27px;border-radius:8px;flex:none;display:grid;place-items:center;background:color-mix(in oklab,var(--aurum-gold-strong) 13%,transparent);color:var(--aurum-gold-strong)}",
  ".au-ico svg{width:14px;height:14px}",
  ".au-txt{flex:1;min-width:0;text-align:left}",
  ".au-name{font-family:var(--ds-font-family-code);font-size:12.5px;color:var(--dsw-alias-label-primary);display:flex;gap:8px;align-items:baseline}",
  ".au-name em{font-style:normal;color:var(--dsw-alias-label-tertiary);font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:340px}",
  ".au-sum{display:block;font-size:12px;color:var(--dsw-alias-label-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}",
  ".au-chev{width:13px;height:13px;color:var(--dsw-alias-label-tertiary);flex:none;transition:transform .34s cubic-bezier(.3,1.35,.45,1)}",
  ".au-chev svg{width:13px;height:13px}",
  ".au-tool.au-open .au-chev{transform:rotate(90deg)}",
  ".au-pill{font-family:var(--ds-font-family-code);font-size:10.5px;padding:2.5px 9px;border-radius:999px;border:1px solid transparent;color:var(--dsw-alias-label-secondary);white-space:nowrap;flex:none}",
  ".au-pill.au-ok{color:var(--dsw-alias-state-success-primary);background:color-mix(in oklab,var(--dsw-alias-state-success-primary) 13%,transparent)}",
  ".au-pill.au-run{color:var(--aurum-gold-strong);background:color-mix(in oklab,var(--aurum-gold-strong) 13%,transparent);display:flex;align-items:center;gap:6px}",
  ".au-pill.au-run::before{content:\"\";width:5px;height:5px;border-radius:50%;background:var(--aurum-gold-strong);animation:au-pulse 1.2s ease-in-out infinite}",
  ".au-pill.au-err{color:var(--dsw-alias-state-error-primary);background:color-mix(in oklab,var(--dsw-alias-state-error-primary) 12%,transparent)}",
  "@keyframes au-pulse{50%{opacity:.25}}",
  ".au-x{display:grid;grid-template-rows:0fr;background:color-mix(in oklab,var(--dsw-alias-bg-base) 45%,transparent);transition:grid-template-rows .3s cubic-bezier(.62,.04,.82,.28)}",
  ".au-tool.au-open .au-x{grid-template-rows:1fr;transition:grid-template-rows .56s cubic-bezier(.3,1.18,.34,1)}",
  ".au-clip{overflow:hidden;min-height:0}",
  ".au-in{padding:11px 15px;border-top:1px dashed transparent;opacity:0;transform:translateY(-6px);transition:opacity .18s ease,transform .2s cubic-bezier(.55,.05,.8,.3)}",
  ".au-tool.au-open .au-in{opacity:1;transform:none;transition:opacity .42s .08s ease,transform .54s .06s cubic-bezier(.26,1.22,.36,1)}",
  "body:not(#aurum-boost) .au-tool[data-state=running] .au-main::after{content:\"\";position:absolute;inset:0;pointer-events:none;background:linear-gradient(105deg,transparent 42%,color-mix(in oklab,var(--aurum-gold-strong) 15%,transparent) 50%,transparent 58%);animation:au-sweep 1.9s linear infinite}",
  "@keyframes au-sweep{from{transform:translateX(-100%)}to{transform:translateX(100%)}}",
  ".au-sec{font-family:var(--ds-font-family-code);font-size:10px;letter-spacing:.22em;color:var(--dsw-alias-label-tertiary);margin:4px 0 10px;text-transform:uppercase}",
  ".au-dim{font-family:var(--ds-font-family-code);font-size:10.5px;color:var(--dsw-alias-label-tertiary);letter-spacing:.04em;margin-top:6px}",
  ".au-foot{margin-top:11px;padding-top:9px;border-top:1px dashed transparent;display:flex;gap:14px;flex-wrap:wrap}",
  ".au-link{font-family:var(--ds-font-family-code);font-size:10.5px;color:var(--aurum-gold-strong);background:none;border:none;padding:0;cursor:pointer;letter-spacing:.04em}",
  ".au-link:hover{color:var(--aurum-gold)}",
  ".au-gfile{margin-bottom:12px}",
  ".au-gfile b{display:flex;align-items:center;gap:8px;font-family:var(--ds-font-family-code);font-weight:500;font-size:12px;color:var(--dsw-alias-label-primary);margin-bottom:6px}",
  ".au-gfile b i{font-style:normal;font-size:10px;color:var(--aurum-gold-strong);background:color-mix(in oklab,var(--aurum-gold-strong) 13%,transparent);border:1px solid transparent;border-radius:99px;padding:1px 8px}",
  ".au-gline{font-family:var(--ds-font-family-code);font-size:11.5px;line-height:1.9;color:var(--dsw-alias-label-secondary);background:color-mix(in oklab,var(--dsw-alias-bg-layer-2) 50%,transparent);border:1px solid transparent;border-radius:8px;padding:5px 11px;margin-bottom:4px;white-space:pre-wrap;word-break:break-all}",
  ".au-gline .au-ln{color:var(--dsw-alias-label-tertiary);margin-right:10px}",
  ".au-diff{border:1px solid transparent;border-radius:12px;overflow:hidden;font-family:var(--ds-font-family-code);font-size:11.5px}",
  ".au-dl{display:grid;grid-template-columns:34px 1fr;align-items:baseline;padding:1.5px 0;white-space:pre-wrap;word-break:break-all}",
  ".au-dl .au-no{color:var(--dsw-alias-label-tertiary);text-align:right;padding-right:9px;user-select:none;font-size:10px}",
  ".au-dl .au-co{padding-right:12px}",
  ".au-dl.au-add{background:color-mix(in oklab,var(--dsw-alias-state-success-primary) 9%,transparent);color:var(--dsw-alias-state-success-primary)}",
  ".au-dl.au-del{background:color-mix(in oklab,var(--dsw-alias-state-error-primary) 9%,transparent);color:var(--dsw-alias-state-error-primary)}",
  ".au-dl.au-hk{background:color-mix(in oklab,var(--aurum-gold-strong) 8%,transparent);color:var(--aurum-gold-strong);margin:3px 0}",
  ".au-term{font-family:var(--ds-font-family-code);font-size:11.5px;line-height:2;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-base);border:1px solid transparent;border-radius:12px;padding:13px 15px;white-space:pre-wrap;word-break:break-all;max-height:340px;overflow:auto;margin:0}",
  ".au-read{background:color-mix(in oklab,var(--dsw-alias-bg-layer-2) 40%,transparent);border-radius:10px;padding:8px 6px;max-height:340px;overflow:auto;font-family:var(--ds-font-family-code)}",
  ".au-rl{display:grid;grid-template-columns:40px 1fr;font-size:11.5px;line-height:1.85}",
  ".au-rl .au-ln{color:var(--dsw-alias-label-tertiary);text-align:right;padding-right:9px;user-select:none;font-size:10px}",
  ".au-rc{color:var(--dsw-alias-label-secondary);white-space:pre-wrap;word-break:break-all;padding-right:8px}",
  ".au-todo{display:flex;flex-direction:column;gap:8px}",
  ".au-td{display:flex;align-items:center;gap:9px;font-size:12.5px;color:var(--dsw-alias-label-secondary);border:1px solid transparent;border-radius:10px;padding:8px 12px;background:color-mix(in oklab,var(--dsw-alias-bg-layer-2) 55%,transparent)}",
  ".au-td .au-dot{width:5px;height:5px;border-radius:50%;background:var(--dsw-alias-label-tertiary);flex:none}",
  ".au-td.au-done{color:var(--dsw-alias-label-tertiary);text-decoration:line-through;text-decoration-color:color-mix(in oklab,var(--dsw-alias-label-tertiary) 50%,transparent)}",
  ".au-td.au-done .au-dot{background:var(--dsw-alias-state-success-primary)}",
  ".au-td.au-now{color:var(--aurum-gold-strong);background:color-mix(in oklab,var(--aurum-gold-strong) 16%,transparent)}",
  ".au-td.au-now .au-dot{background:var(--aurum-gold-strong);animation:au-pulse 1.2s infinite}",
  ".au-sres{display:flex;flex-direction:column;gap:10px}",
  ".au-sr{display:flex;flex-direction:column;border:1px solid transparent;background:color-mix(in oklab,var(--dsw-alias-bg-layer-2) 50%,transparent);border-radius:11px;padding:11px 13px}",
  ".au-sr b{font-size:13px;font-weight:500;color:var(--dsw-alias-label-primary);font-family:var(--dsw-font-markdown-base-font-family)}",
  ".au-sr .au-u{font-family:var(--ds-font-family-code);font-size:10.5px;color:var(--aurum-gold-dim);margin:3px 0 5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
  ".au-sr p{font-size:12px;color:var(--dsw-alias-label-secondary);line-height:1.7;margin:0}",
  "@media (prefers-reduced-motion:reduce){.au-tool[data-state=running] .au-main::after{display:none}.au-x,.au-in,.au-chev{transition:none!important}.au-pill.au-run::before,.au-td.au-now .au-dot{animation:none!important}}",
  ".au-ws{flex:1;min-height:0;display:flex;flex-direction:column;color:var(--dsw-alias-label-primary);font-size:13px;--dsh-scrollbar-thumb:var(--dsw-alias-scrollbar-bg-l2);--dsh-scrollbar-thumb-hover:var(--dsw-alias-scrollbar-hover-l2)}",
  ".au-ws-head{display:flex;align-items:center;gap:4px;padding:11px 12px 6px 16px;flex:none}",
  ".au-ws-label{flex:none;white-space:nowrap;overflow:hidden;max-width:72px;font-family:var(--ds-font-family-code);font-weight:500;font-size:10.5px;letter-spacing:.24em;color:var(--dsw-alias-label-tertiary);transition:max-width .3s cubic-bezier(.22,.8,.26,1),opacity .2s}",
  ".au-ws-head.au-searching .au-ws-label{max-width:0;opacity:0}",
  ".au-ws-search{display:flex;align-items:center;margin-left:auto;min-width:24px;height:26px;flex:0 1 auto;border-radius:9px;transition:flex-basis .32s cubic-bezier(.22,.8,.26,1),background .25s,padding .3s}",
  ".au-ws-search.au-open{flex:1 1 auto;background:var(--dsw-alias-bg-layer-2);padding:0 7px 0 3px}",
  ".au-ws-search.au-open:focus-within{box-shadow:0 0 0 2.5px color-mix(in oklab,var(--aurum-gold) 28%,transparent)}",
  ".au-ws-sbtn{width:24px;height:24px;border:none;border-radius:7px;display:grid;place-items:center;flex:none;color:var(--dsw-alias-label-tertiary);background:transparent;cursor:pointer;transition:.15s;padding:0}",
  ".au-ws-sbtn:hover{color:var(--aurum-gold);background:var(--dsw-alias-interactive-bg-hover-solid)}",
  ".au-ws-search.au-hasq .au-ws-sbtn{color:var(--aurum-gold-strong)}",
  ".au-ws-sbtn svg{width:13.5px;height:13.5px}",
  ".au-ws-input{width:0;opacity:0;min-width:0;height:100%;border:none;background:none;outline:none;font-size:12px;color:var(--dsw-alias-label-primary);padding:0;transition:width .32s cubic-bezier(.22,.8,.26,1),opacity .2s}",
  ".au-ws-search.au-open .au-ws-input{width:100%;opacity:1;padding:0 2px}",
  ".au-ws-input::placeholder{color:var(--dsw-alias-label-tertiary)}",
  ".au-ws-acts{display:flex;gap:1px;flex:none}",
  ".au-ws-ibtn{width:27px;height:27px;border:none;border-radius:8px;display:grid;place-items:center;color:var(--dsw-alias-label-tertiary);background:transparent;cursor:pointer;transition:.15s;padding:0}",
  ".au-ws-ibtn:hover{color:var(--aurum-gold);background:var(--dsw-alias-interactive-bg-hover-solid)}",
  ".au-ws-ibtn.au-on{color:var(--aurum-gold-strong)}",
  ".au-ws-ibtn svg{width:15px;height:15px}",
  ".au-ws-addrow{display:flex;align-items:center;gap:8px;margin:3px 12px 8px 16px;height:30px;flex:none;border-radius:9px;background:color-mix(in oklab,var(--aurum-gold) 8%,var(--dsw-alias-bg-layer-1));padding:0 10px;animation:au-pop .18s cubic-bezier(.22,.8,.26,1) both}",
  "@keyframes au-pop{from{opacity:0;transform:translateY(-4px)}}",
  ".au-ws-addrow svg{width:13px;height:13px;color:var(--aurum-gold-dim);flex:none}",
  ".au-ws-addrow input{flex:1;min-width:0;background:none;border:none;outline:none;font-family:var(--ds-font-family-code);font-size:11.5px;color:var(--dsw-alias-label-primary);padding:0}",
  ".au-ws-addrow input::placeholder{color:var(--dsw-alias-label-tertiary)}",
  ".au-ws-addhint{font-family:var(--ds-font-family-code);font-size:9.5px;color:var(--dsw-alias-label-tertiary);white-space:nowrap;flex:none}",
  ".au-ws-body{flex:1;overflow-y:auto;overflow-x:hidden;padding-bottom:8px;min-height:0}",
  ".au-wsg{margin-bottom:2px;position:relative}",
  ".au-wsg-head{display:flex;align-items:center;gap:7px;padding:9px 15px 5px;cursor:pointer;user-select:none;font-size:12px;color:var(--dsw-alias-label-tertiary);border:none;background:transparent;width:100%;text-align:left;border-radius:8px;position:relative}",
  ".au-wsg-head:hover{color:var(--dsw-alias-label-secondary)}",
  ".au-ws-ic{position:relative;width:13px;height:13px;flex:none}",
  ".au-ws-ic svg{position:absolute;inset:0;width:13px;height:13px;transition:opacity .16s,transform .25s}",
  ".au-ws-ic .au-chev2{color:var(--dsw-alias-label-tertiary);opacity:0}",
  ".au-ws-ic .au-fld{color:var(--aurum-gold-dim)}",
  ".au-wsg-head:hover .au-chev2{opacity:1}",
  ".au-wsg-head:hover .au-fld{opacity:0}",
  ".au-wsg.au-closed .au-chev2{transform:rotate(-90deg)}",
  ".au-wsg.au-closed .au-fld{opacity:1}",
  ".au-wsg.au-closed .au-wsg-head:hover .au-fld{opacity:0}",
  ".au-wsg-head b{font-weight:500;font-size:12.5px;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:var(--ds-font-family-code);color:inherit}",
  ".au-wsg-acts{display:flex;gap:1px;flex:none;opacity:0;transition:opacity .16s}",
  ".au-wsg:hover .au-wsg-acts,.au-wsg-acts:focus-within{opacity:1}",
  ".au-wsg-act{width:22px;height:22px;border:none;border-radius:7px;display:grid;place-items:center;color:var(--dsw-alias-label-tertiary);background:transparent;cursor:pointer;transition:.15s;padding:0}",
  ".au-wsg-act:hover{color:var(--aurum-gold-strong);background:var(--dsw-alias-interactive-bg-hover-solid)}",
  ".au-wsg-act svg{width:13px;height:13px}",
  ".au-wsg-rename{flex:1;min-width:0;font-family:var(--ds-font-family-code);font-size:11px;color:var(--dsw-alias-label-primary);background:color-mix(in oklab,var(--aurum-gold) 14%,var(--dsw-alias-bg-layer-1));border:1px solid transparent;border-radius:6px;padding:2px 6px;outline:none}",
  ".au-wsg.au-curgroup .au-wsg-head b{color:var(--dsw-alias-label-secondary)}",
  ".au-slist{display:flex;flex-direction:column;padding:0 6px;min-height:12px}",
  ".au-wsg.au-closed .au-slist{display:none}",
  ".au-srowwrap{display:flex;flex-direction:column}",
  ".au-srow{display:flex;align-items:center;gap:7px;height:34px;padding:0 9px;margin:1px 0;border-radius:9px;cursor:pointer;color:var(--dsw-alias-label-secondary);font-size:13px;position:relative;border:none;background:transparent;width:100%;text-align:left;transition:background .15s,color .15s}",
  ".au-srow:hover{background:var(--dsw-alias-interactive-bg-hover-solid);color:var(--dsw-alias-label-primary)}",
  ".au-srow.au-cur{background:color-mix(in oklab,var(--aurum-gold-strong) 14%,transparent);color:var(--dsw-alias-label-primary)}",
  ".au-s-ic{position:relative;width:13px;height:13px;flex:none}",
  ".au-s-ic::after{content:none;position:absolute;inset:0;margin:auto}",
  ".au-srow.au-waiting .au-s-ic::after{content:\"\";width:6px;height:6px;border-radius:50%;background:var(--aurum-gold);box-shadow:0 0 8px var(--aurum-gold)}",
  ".au-srow.au-working .au-s-ic::after{content:\"\";width:11px;height:11px;border-radius:50%;border:1.5px solid color-mix(in oklab,var(--aurum-gold) 22%,transparent);border-top-color:var(--aurum-gold);animation:au-rot .8s linear infinite}",
  ".au-srow.au-done .au-s-ic::after{content:\"\";width:6px;height:6px;border-radius:50%;background:var(--dsw-alias-state-success-primary)}",
  "@keyframes au-rot{to{transform:rotate(360deg)}}",
  ".au-s-title{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
  ".au-s-meta{font-family:var(--ds-font-family-code);font-size:10px;color:var(--aurum-gold-dim);margin-right:6px;flex:none;max-width:90px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
  ".au-s-rename{flex:1;min-width:0;font-size:12px;color:var(--dsw-alias-label-primary);background:color-mix(in oklab,var(--aurum-gold) 14%,var(--dsw-alias-bg-layer-1));border:1px solid transparent;border-radius:6px;padding:3px 7px;outline:none;font-family:inherit}",
  ".au-s-menu{opacity:0;width:24px;height:24px;border:none;border-radius:7px;display:grid;place-items:center;color:var(--dsw-alias-label-tertiary);flex:none;background:transparent;cursor:pointer;padding:0;transition:opacity .15s,color .15s,background .15s}",
  ".au-srow:hover .au-s-menu{opacity:1}",
  ".au-s-menu:hover{color:var(--aurum-gold-strong);background:var(--dsw-alias-interactive-bg-hover-solid)}",
  ".au-s-menu svg{width:14px;height:14px}",
  ".au-s-actions{display:grid;grid-template-rows:0fr;transition:grid-template-rows .25s cubic-bezier(.62,.04,.82,.28)}",
  ".au-s-actions.au-open2{grid-template-rows:1fr}",
  ".au-s-clip{overflow:hidden;min-height:0}",
  ".au-s-actrow{display:flex;gap:4px;padding:2px 8px 8px 29px;flex-wrap:wrap}",
  ".au-s-abtn{height:26px;padding:0 10px;border:none;border-radius:8px;background:color-mix(in oklab,var(--dsw-alias-bg-layer-2) 60%,transparent);color:var(--dsw-alias-label-secondary);font:400 11.5px/1 var(--dsw-font-family);cursor:pointer;display:inline-flex;align-items:center;gap:5px;transition:color .15s,background .15s}",
  ".au-s-abtn:hover{color:var(--aurum-gold-strong);background:color-mix(in oklab,var(--aurum-gold) 12%,transparent)}",
  ".au-s-abtn.au-danger:hover{color:var(--dsw-alias-state-error-primary);background:var(--dsw-alias-interactive-bg-hover-danger)}",
  ".au-ws-empty{padding:18px 16px;font-size:12px;color:var(--dsw-alias-label-tertiary);text-align:center}",
  /* P8c:细条容器=原型 .sb-rail 几何(padding 9 0 12,logo 中心线 12+9+20=41 与主区标题同轴);
     淡入 delay .18s 等面板先收窄(原型 sb-rail .26s .18s 交叉淡切的挂载近似) */
  ".au-ws-rail{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;padding:9px 0 12px;animation:au-rail-in .26s .18s cubic-bezier(.22,.8,.26,1) both}",
  "@keyframes au-rail-in{from{opacity:0}}",
  /* wide 内容回场淡入(原型 sb-main .22s .2s) */
  ".au-ws.au-ws-wide{animation:au-main-in .22s .2s ease both}",
  "@keyframes au-main-in{from{opacity:0}}",
  ".au-ws-railbtn{width:40px;height:40px;border:none;border-radius:12px;display:grid;place-items:center;color:var(--dsw-alias-label-tertiary);background:transparent;cursor:pointer;transition:.18s;padding:0}",
  ".au-ws-railbtn:hover{background:var(--dsw-alias-interactive-bg-hover-solid);color:var(--aurum-gold)}",
  ".au-ws-railbtn:active{transform:scale(.96)}",
  ".au-ws-railbtn svg{width:17px;height:17px}",
  ".aurum-footRow.au-rail{width:40px;height:40px;justify-content:center;padding:0;border-radius:12px;gap:0}",
  ".aurum-footRow.au-rail span{display:none}",
  "@media (prefers-reduced-motion:reduce){.au-s-actions,.au-ws-search,.au-ws-input,.au-ws-label{transition:none!important}.au-ws-addrow{animation:none}}"
];

/* ═══ CSS3 · P9 原型恒等映射层 ═══
   §1 变量组(原型 :root / html[data-theme=light] → body 主题属性级) +
   §5 尾部节点 CSS 整段拷贝(.compress/.row-err/.row-retry/.turn-tail/.pill/.ibtn/.a-actions) +
   md 装饰(◆ 金点/inline code 金 pill,scoped 到 assistant-step flowItem)+ 滚动条几何。
   自建组件从这里起直接消费原型类名与变量,不再翻译成 au-* 体系。 */
const CSS3 = [
  "body[data-ds-dark-theme]{--bg:oklch(16% .014 330);--bg-deep:oklch(13.5% .012 330);--surface:oklch(21% .016 328);--surface-2:oklch(25.5% .018 326);--rail-1:oklch(19% .015 329);--rail-2:oklch(21.5% .016 329);--rail-raised:oklch(23.5% .018 328);--fg:oklch(93% .015 85);--muted:oklch(74% .022 328);--faint:oklch(56% .022 330);--border:transparent;--border-soft:transparent;--gold:oklch(83% .115 88);--gold-strong:oklch(79% .13 84);--gold-dim:oklch(70% .10 85);--gold-ink:oklch(21% .03 60);--rose:oklch(77% .095 350);--rose-strong:oklch(73% .115 350);--success:oklch(78% .10 155);--danger:oklch(68% .16 15);--font-display:" + DISPLAY + ";--font-serif:" + SERIF + ";--font-ui:" + UI + ";--font-mono:" + MONO + "}",
  "body:not([data-ds-dark-theme]){--bg:oklch(96.5% .012 82);--bg-deep:oklch(94.5% .014 82);--surface:oklch(98.5% .008 82);--surface-2:oklch(92% .016 84);--rail-1:oklch(94.5% .014 82);--rail-2:oklch(96.5% .012 82);--rail-raised:oklch(98.5% .008 82);--fg:oklch(28% .05 330);--muted:oklch(46% .035 330);--faint:oklch(62% .03 330);--border:transparent;--border-soft:transparent;--gold:oklch(55% .115 80);--gold-strong:oklch(50% .12 78);--gold-dim:oklch(66% .11 82);--gold-ink:oklch(99% .005 85);--rose:oklch(58% .14 350);--rose-strong:oklch(53% .15 350);--success:oklch(52% .11 155);--danger:oklch(52% .16 18);--font-display:" + DISPLAY + ";--font-serif:" + SERIF + ";--font-ui:" + UI + ";--font-mono:" + MONO + "}",
  /* ── §5 尾部节点(整段拷贝)── */
  ".compress-head{display:flex;align-items:center;gap:8px;width:100%;padding:8px 4px;font-family:var(--font-mono);font-size:11.5px;color:var(--faint);letter-spacing:.04em;text-align:left;background:none;border:none;cursor:pointer}",
  ".compress-head:hover{color:var(--muted)}",
  ".compress-head .chev{width:12px;height:12px;transition:transform .25s;flex:none}",
  ".compress.open .compress-head .chev{transform:rotate(90deg)}",
  ".compress-head .in-tok{color:var(--faint)}",
  ".compress-body{display:none;margin-top:6px;padding:12px 16px;border-radius:12px;border:1px dashed var(--border-soft);background:var(--surface);font-family:var(--font-serif);font-size:13.5px;line-height:1.9;color:var(--muted);white-space:pre-wrap}",
  ".compress.open .compress-body{display:block}",
  ".row-err{display:flex;align-items:center;gap:10px;font-size:12.5px;color:var(--danger);border:1px solid transparent;background:oklch(69% .15 15 / .12);border-radius:11px;padding:9px 13px;font-family:var(--font-mono)}",
  ".row-err svg{width:14px;height:14px;flex:none}",
  ".row-err .pill{margin-left:auto}",
  ".row-retry{display:flex;align-items:center;gap:10px;font-size:12.5px;color:var(--muted);padding:2px 4px;font-family:var(--font-mono)}",
  ".row-retry svg{width:13px;height:13px;color:var(--gold-dim);flex:none}",
  ".row-retry b{color:var(--success);font-weight:500}",
  ".turn-tail{display:flex;align-items:center;gap:14px;margin:20px 0 6px;font-family:var(--font-ui);font-size:14px;line-height:1}",
  ".turn-tail .ln{flex:1;height:1px;background:color-mix(in oklab, var(--fg) 9%, transparent)}",
  ".turn-tail .tx{font-family:var(--font-mono);font-size:10.5px;color:var(--faint);letter-spacing:.06em;white-space:nowrap}",
  ".pill{font-family:var(--font-mono);font-size:10.5px;padding:2.5px 9px;border-radius:999px;border:1px solid var(--border);color:var(--muted);white-space:nowrap;flex:none}",
  ".pill.err{color:var(--danger);background:oklch(69% .15 15 / .12)}",
  ".pill.warn{color:var(--gold-strong);background:oklch(79% .13 84 / .13)}",
  ".ibtn{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;flex:none;color:var(--faint);background:none;border:none;cursor:pointer;padding:0;transition:.18s}",
  ".ibtn:hover{background:var(--surface-2);color:var(--gold)}",
  ".ibtn svg{width:15px;height:15px}",
  ".ibtn:disabled{opacity:.35;cursor:default}",
  ".a-actions{display:flex;gap:2px;margin-top:12px;opacity:0;transition:.2s}",
  ".a-actions .ibtn{width:27px;height:27px}",
  ".a-actions .ibtn svg{width:13px;height:13px}",
  "[data-chat-anchor-key]:hover .a-actions{opacity:1}",
  /* ── P11 修订:卡片间距收窄(用户要求)── 官方会话流列 gap16 是大头,
     叠加各卡自身 margin 后相邻工具卡实际隔 ~24px;gap 降 8 + 卡 margin 收拢
     → 相邻卡 ~10px。列 gap 同时管用户气泡/正文/尾节间距,整体一并收紧 */
  "body .Md3f7G_column{gap:8px}",
  /* ── md 装饰(scoped 到 assistant-step 节点,不伤工具卡/上下文行)── */
  /* 列宽对齐原型 .flow 内容宽 712:官方在 viewArea→root→scroll 多层重定义 token,
     就近继承压不过 —— 挂 [data-conversation-scroll] 结构锚并对全部后代逐元素定义
     (自有定义恒胜继承,且不耦合混淆类名) */
  "body [data-conversation-scroll],body [data-conversation-scroll] *{--dsh-chat-content-width:712px}",
  "[data-chat-flow-kind=assistant-step]{position:relative;padding-left:42px}",
  "[data-chat-flow-kind=assistant-step]::before{content:\"\";position:absolute;left:0;top:2px;width:28px;height:28px;border-radius:50%;background:color-mix(in oklab,var(--gold) 9%,transparent)}",
  "[data-chat-flow-kind=assistant-step]::after{content:\"\";position:absolute;left:4.5px;top:6.5px;width:19px;height:19px;background-color:var(--gold);-webkit-mask:url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20fill%3D%22black%22%20d%3D%22M23.0584%204.95203C22.8129%204.83203%2022.7074%205.06103%2022.5639%205.17704C22.5149%205.21454%2022.4734%205.26354%2022.4319%205.30854C22.0734%205.69155%2021.6543%205.94306%2021.1073%205.91306C20.3073%205.86806%2019.6243%206.11957%2019.0203%206.73158C18.8918%205.97706%2018.4652%205.52655%2017.8162%205.23754C17.4767%205.08753%2017.1332%204.93703%2016.8952%204.61052C16.7292%204.37801%2016.6837%204.11901%2016.6007%203.8635C16.5477%203.70949%2016.4952%203.55199%2016.3177%203.52549C16.1252%203.49549%2016.0497%203.65699%2015.9742%203.792C15.6722%204.34401%2015.5552%204.95203%2015.5667%205.56805C15.5932%206.95359%2016.1782%208.05712%2017.3407%208.84215C17.4727%208.93215%2017.5067%209.02215%2017.4652%209.15366C17.3857%209.42416%2017.2917%209.68667%2017.2087%209.95718C17.1557%2010.1297%2017.0767%2010.1677%2016.8917%2010.0922C16.2537%209.82568%2015.7027%209.43117%2015.2156%208.95465C14.3891%208.15513%2013.6416%207.2726%2012.7096%206.58158C12.4906%206.42007%2012.2716%206.27007%2012.045%206.12707C11.094%205.20354%2012.1696%204.44502%2012.4186%204.35501C12.6791%204.26101%2012.5091%203.938%2011.6675%203.942C10.826%203.9455%2010.056%204.22751%209.07446%204.60302C8.93096%204.65952%208.77995%204.70052%208.62545%204.73452C7.73492%204.56552%206.80989%204.52802%205.84386%204.63702C4.02481%204.83953%202.57177%205.69955%201.50373%207.1676C0.220694%208.93215%20-0.0813148%2010.9372%200.288196%2013.0283C0.676708%2015.2323%201.80174%2017.0569%203.53029%2018.4834C5.32285%2019.9625%207.38741%2020.6875%209.74298%2020.5485C11.1735%2020.466%2012.7661%2020.2745%2014.5626%2018.7539C15.0156%2018.9795%2015.4912%2019.0695%2016.2797%2019.137C16.8872%2019.1935%2017.4722%2019.107%2017.9252%2019.013C18.6347%2018.8629%2018.5857%2018.2059%2018.3292%2018.0854C16.2497%2017.1169%2016.7062%2017.5109%2016.2912%2017.1919C17.3477%2015.9419%2018.9618%2013.7198%2019.4598%2010.6942C19.5088%2010.3602%2019.5713%209.88968%2019.5638%209.61917C19.5598%209.45417%2019.5978%209.39016%2019.7863%209.37116C20.3073%209.31116%2020.8128%209.16866%2021.2773%208.91315C22.6249%208.17713%2023.1684%206.96809%2023.2964%205.51905C23.3154%205.29754%2023.2924%205.06853%2023.0584%204.95203ZM11.3165%2017.9954C9.30097%2016.4109%208.32344%2015.8894%207.91992%2015.9119C7.54241%2015.9344%207.61042%2016.3664%207.69342%2016.6479C7.78042%2016.9259%207.89342%2017.1174%208.05193%2017.3614C8.16143%2017.5229%208.23694%2017.7629%207.94243%2017.9434C7.29341%2018.3449%206.16487%2017.8084%206.11187%2017.7819C4.79833%2017.0084%203.7003%2015.9874%202.92628%2014.5908C2.17875%2013.2468%201.74474%2011.8047%201.67324%2010.2657C1.65424%209.89418%201.76374%209.76267%202.13375%209.69517C2.62077%209.60517%203.12278%209.58617%203.6093%209.65767C5.66636%209.95818%207.41741%2010.8777%208.88545%2012.3348C9.72348%2013.1643%2010.3575%2014.1558%2011.0105%2015.1243C11.705%2016.1529%2012.4521%2017.1329%2013.4036%2017.9364C13.7396%2018.2179%2014.0076%2018.4319%2014.2641%2018.5899C13.4906%2018.6764%2012.1996%2018.6949%2011.3165%2017.9964V17.9954ZM12.2826%2011.7817C12.2826%2011.6167%2012.4146%2011.4852%2012.5806%2011.4852C12.6181%2011.4852%2012.6521%2011.4927%2012.6826%2011.5037C12.7241%2011.5187%2012.7621%2011.5412%2012.7921%2011.5752C12.8451%2011.6277%2012.8751%2011.7027%2012.8751%2011.7817C12.8751%2011.9467%2012.7431%2012.0782%2012.5771%2012.0782C12.4111%2012.0782%2012.2826%2011.9467%2012.2826%2011.7817ZM15.2831%2013.3208C15.0906%2013.3998%2014.8981%2013.4673%2014.7131%2013.4748C14.4261%2013.4898%2014.1131%2013.3733%2013.9431%2013.2308C13.6791%2013.0093%2013.4901%2012.8853%2013.4111%2012.4988C13.3771%2012.3338%2013.3961%2012.0782%2013.4261%2011.9317C13.4941%2011.6162%2013.4186%2011.4137%2013.1961%2011.2297C13.0151%2011.0797%2012.7846%2011.0382%2012.5316%2011.0382C12.4371%2011.0382%2012.3506%2010.9967%2012.2861%2010.9632C12.1806%2010.9107%2012.0936%2010.7792%2012.1766%2010.6177C12.2031%2010.5652%2012.3316%2010.4377%2012.3616%2010.4152C12.7051%2010.2197%2013.1011%2010.2837%2013.4676%2010.4302C13.8071%2010.5692%2014.0641%2010.824%2014.4336%2011.1847C14.8111%2011.6202%2014.8791%2011.7402%2015.0941%2012.0672C15.2641%2012.3228%2015.4186%2012.5853%2015.5247%2012.8858C15.5887%2013.0733%2015.5057%2013.2268%2015.2831%2013.3208Z%22%2F%3E%3C%2Fsvg%3E\") center/contain no-repeat;mask:url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20fill%3D%22black%22%20d%3D%22M23.0584%204.95203C22.8129%204.83203%2022.7074%205.06103%2022.5639%205.17704C22.5149%205.21454%2022.4734%205.26354%2022.4319%205.30854C22.0734%205.69155%2021.6543%205.94306%2021.1073%205.91306C20.3073%205.86806%2019.6243%206.11957%2019.0203%206.73158C18.8918%205.97706%2018.4652%205.52655%2017.8162%205.23754C17.4767%205.08753%2017.1332%204.93703%2016.8952%204.61052C16.7292%204.37801%2016.6837%204.11901%2016.6007%203.8635C16.5477%203.70949%2016.4952%203.55199%2016.3177%203.52549C16.1252%203.49549%2016.0497%203.65699%2015.9742%203.792C15.6722%204.34401%2015.5552%204.95203%2015.5667%205.56805C15.5932%206.95359%2016.1782%208.05712%2017.3407%208.84215C17.4727%208.93215%2017.5067%209.02215%2017.4652%209.15366C17.3857%209.42416%2017.2917%209.68667%2017.2087%209.95718C17.1557%2010.1297%2017.0767%2010.1677%2016.8917%2010.0922C16.2537%209.82568%2015.7027%209.43117%2015.2156%208.95465C14.3891%208.15513%2013.6416%207.2726%2012.7096%206.58158C12.4906%206.42007%2012.2716%206.27007%2012.045%206.12707C11.094%205.20354%2012.1696%204.44502%2012.4186%204.35501C12.6791%204.26101%2012.5091%203.938%2011.6675%203.942C10.826%203.9455%2010.056%204.22751%209.07446%204.60302C8.93096%204.65952%208.77995%204.70052%208.62545%204.73452C7.73492%204.56552%206.80989%204.52802%205.84386%204.63702C4.02481%204.83953%202.57177%205.69955%201.50373%207.1676C0.220694%208.93215%20-0.0813148%2010.9372%200.288196%2013.0283C0.676708%2015.2323%201.80174%2017.0569%203.53029%2018.4834C5.32285%2019.9625%207.38741%2020.6875%209.74298%2020.5485C11.1735%2020.466%2012.7661%2020.2745%2014.5626%2018.7539C15.0156%2018.9795%2015.4912%2019.0695%2016.2797%2019.137C16.8872%2019.1935%2017.4722%2019.107%2017.9252%2019.013C18.6347%2018.8629%2018.5857%2018.2059%2018.3292%2018.0854C16.2497%2017.1169%2016.7062%2017.5109%2016.2912%2017.1919C17.3477%2015.9419%2018.9618%2013.7198%2019.4598%2010.6942C19.5088%2010.3602%2019.5713%209.88968%2019.5638%209.61917C19.5598%209.45417%2019.5978%209.39016%2019.7863%209.37116C20.3073%209.31116%2020.8128%209.16866%2021.2773%208.91315C22.6249%208.17713%2023.1684%206.96809%2023.2964%205.51905C23.3154%205.29754%2023.2924%205.06853%2023.0584%204.95203ZM11.3165%2017.9954C9.30097%2016.4109%208.32344%2015.8894%207.91992%2015.9119C7.54241%2015.9344%207.61042%2016.3664%207.69342%2016.6479C7.78042%2016.9259%207.89342%2017.1174%208.05193%2017.3614C8.16143%2017.5229%208.23694%2017.7629%207.94243%2017.9434C7.29341%2018.3449%206.16487%2017.8084%206.11187%2017.7819C4.79833%2017.0084%203.7003%2015.9874%202.92628%2014.5908C2.17875%2013.2468%201.74474%2011.8047%201.67324%2010.2657C1.65424%209.89418%201.76374%209.76267%202.13375%209.69517C2.62077%209.60517%203.12278%209.58617%203.6093%209.65767C5.66636%209.95818%207.41741%2010.8777%208.88545%2012.3348C9.72348%2013.1643%2010.3575%2014.1558%2011.0105%2015.1243C11.705%2016.1529%2012.4521%2017.1329%2013.4036%2017.9364C13.7396%2018.2179%2014.0076%2018.4319%2014.2641%2018.5899C13.4906%2018.6764%2012.1996%2018.6949%2011.3165%2017.9964V17.9954ZM12.2826%2011.7817C12.2826%2011.6167%2012.4146%2011.4852%2012.5806%2011.4852C12.6181%2011.4852%2012.6521%2011.4927%2012.6826%2011.5037C12.7241%2011.5187%2012.7621%2011.5412%2012.7921%2011.5752C12.8451%2011.6277%2012.8751%2011.7027%2012.8751%2011.7817C12.8751%2011.9467%2012.7431%2012.0782%2012.5771%2012.0782C12.4111%2012.0782%2012.2826%2011.9467%2012.2826%2011.7817ZM15.2831%2013.3208C15.0906%2013.3998%2014.8981%2013.4673%2014.7131%2013.4748C14.4261%2013.4898%2014.1131%2013.3733%2013.9431%2013.2308C13.6791%2013.0093%2013.4901%2012.8853%2013.4111%2012.4988C13.3771%2012.3338%2013.3961%2012.0782%2013.4261%2011.9317C13.4941%2011.6162%2013.4186%2011.4137%2013.1961%2011.2297C13.0151%2011.0797%2012.7846%2011.0382%2012.5316%2011.0382C12.4371%2011.0382%2012.3506%2010.9967%2012.2861%2010.9632C12.1806%2010.9107%2012.0936%2010.7792%2012.1766%2010.6177C12.2031%2010.5652%2012.3316%2010.4377%2012.3616%2010.4152C12.7051%2010.2197%2013.1011%2010.2837%2013.4676%2010.4302C13.8071%2010.5692%2014.0641%2010.824%2014.4336%2011.1847C14.8111%2011.6202%2014.8791%2011.7402%2015.0941%2012.0672C15.2641%2012.3228%2015.4186%2012.5853%2015.5247%2012.8858C15.5887%2013.0733%2015.5057%2013.2268%2015.2831%2013.3208Z%22%2F%3E%3C%2Fsvg%3E\") center/contain no-repeat}",
  "[data-chat-flow-kind=assistant-step] :is(ul,ol){margin:2px 0 12px 4px;list-style:none;padding:0}",
  "[data-chat-flow-kind=assistant-step] li{position:relative;padding-left:18px;margin-bottom:7px;color:var(--muted);list-style:none;font:400 15px/1.95 var(--font-serif)}",
  "[data-chat-flow-kind=assistant-step] li::before{content:\"◆\";position:absolute;left:0;top:0;font-size:8px;color:var(--gold-dim);line-height:2.6}",
  "[data-chat-flow-kind=assistant-step] li b{color:var(--fg);font-weight:500}",
  "body [data-chat-flow-kind=assistant-step] :not(pre)>code{font-family:var(--font-mono);font-size:12.5px!important;line-height:1.36;color:var(--gold);background:var(--surface-2);border-radius:6px;padding:1px 6px}",
  /* ── 滚动条几何(原型 §2)── */
  "body ::-webkit-scrollbar{width:10px;height:10px}",
  "body ::-webkit-scrollbar-thumb{background:color-mix(in oklab, var(--muted) 26%, transparent);border-radius:8px;border:3px solid transparent;background-clip:content-box}",
  "body ::-webkit-scrollbar-thumb:hover{background:var(--gold-dim);border:3px solid transparent;background-clip:content-box}",
  "body ::-webkit-scrollbar-track{background:transparent}",
  /* ── P8c · §4 折叠细条(原型 .sb-rail 子钮,整段拷贝;容器=存量 .au-ws-rail)── */
  ".rail-btn{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;flex:none;color:var(--muted);transition:.18s;background:none;border:none;cursor:pointer;padding:0}",
  ".rail-btn:hover{background:var(--surface-2);color:var(--fg)}",
  ".rail-btn:active{transform:scale(.96)}",
  ".rail-btn svg{width:17px;height:17px}",
  ".rail-new{background:color-mix(in oklab, var(--gold) 15%, var(--surface));color:var(--gold-strong)}",
  ".rail-new:hover{background:color-mix(in oklab, var(--gold) 22%, var(--surface));color:var(--gold-strong)}",
  ".rail-flex{flex:1;min-height:6px}",
  ".rail-logo{position:relative;width:40px;height:40px;border-radius:12px;flex:none;color:var(--gold);transition:background .18s;background:none;border:none;cursor:pointer;padding:0}",
  ".rail-logo:hover{background:var(--surface-2)}",
  ".rail-logo svg,.rail-logo .rl-whale{position:absolute;inset:0;margin:auto;transition:opacity .16s ease,transform .2s cubic-bezier(.22,.8,.26,1)}",
  ".rail-logo .rl-whale{width:21px;height:21px}",
  ".rail-logo .rl-panel{width:19px;height:19px;color:var(--faint);opacity:0;transform:scale(.72)}",
  ".rail-logo:hover .rl-whale{opacity:0;transform:scale(.72)}",
  ".rail-logo:hover .rl-panel{opacity:1;transform:none;color:var(--gold-strong)}",
  /* ── P8c · 会话行拖拽排序落点(原型 .s-row drop/dragging,容器适配 .au-srow)── */
  ".au-srow.drop-before::before{content:\"\";position:absolute;left:6px;right:6px;top:-2px;height:2px;background:var(--gold);border-radius:2px}",
  ".au-srow.drop-after::after{content:\"\";position:absolute;left:6px;right:6px;bottom:-2px;height:2px;background:var(--gold);border-radius:2px}",
  ".au-srow.dragging{opacity:.35}",
  /* ── P8c · §9 通用浮动菜单(原型 .menu/.mi/.mk/.menu-sep 整段拷贝;fixed 挂载避卡裁切)── */
  ".menu{position:absolute;min-width:186px;background:var(--surface-2);border:1px solid var(--border);border-radius:13px;padding:6px;box-shadow:var(--shadow-panel,0 16px 48px oklch(8% .02 330 / .55));z-index:90}",
  ".menu.open{display:block;animation:pop .16s cubic-bezier(.22,.8,.26,1)}",
  ".menu.fixed{position:fixed}",
  "@keyframes pop{from{opacity:0;transform:translateY(5px) scale(.98)}}",
  ".mi{display:flex;align-items:center;gap:9px;width:100%;padding:8px 11px;border-radius:8px;font-size:12.5px;font-family:var(--font-ui);color:var(--muted);text-align:left;background:none;border:none;cursor:pointer;transition:background .15s,color .15s}",
  ".mi:hover{background:oklch(79% 0.13 84 / .1);color:var(--fg)}",
  ".mi svg{width:13px;height:13px;color:var(--faint);flex:none}",
  ".mi:hover svg{color:var(--gold-strong)}",
  ".mi.danger,.mi.danger svg{color:var(--danger)}",
  ".mi.danger:hover{background:oklch(69% 0.15 15 / .1)}",
  ".mi .mk{margin-left:auto;font-family:var(--font-mono);font-size:10px;color:var(--faint)}",
  ".mi .mk.on{color:var(--gold-strong)}",
  ".menu-sep{height:1px;background:color-mix(in oklab, var(--fg) 8%, transparent);margin:5px 8px}",
  /* ── P10 · §6 todo-bar(整段拷贝;AuTodoBar 消费)──
     唯一机械替换外的适配:.todo-it.now .td 的 keyframes pulse → au-pulse
     (P8b 已有同名同体 50%{opacity:.25},避免全局 keyframe 名与官方冲突)。
     2026-08-24 用户决策:底条不要半透明 → 面色改 solid var(--surface)(深浅各自解析),
     与输入卡同族 */
  ".todo-bar{flex:1;min-width:230px;display:flex;align-items:center;gap:11px;flex-wrap:wrap;border:1px solid var(--border-soft);border-radius:13px;background:var(--surface);padding:7px 13px;min-height:38px}",
  ".todo-label{font-family:var(--font-mono);font-size:10.5px;color:var(--faint);letter-spacing:.14em;flex:none}",
  ".todo-items{display:flex;gap:6px;flex-wrap:wrap}",
  ".todo-it{display:flex;align-items:center;gap:6px;font-size:11.5px;color:var(--muted);border:1px solid transparent;background:color-mix(in oklab, var(--surface-2) 60%, transparent);border-radius:8px;padding:3px 9px;transition:.15s}",
  ".todo-it:hover{color:var(--fg);background:color-mix(in oklab, var(--gold) 13%, var(--surface-2))}",
  ".todo-it .td{width:5px;height:5px;border-radius:50%;background:var(--faint);flex:none}",
  ".todo-it.done{color:var(--faint);text-decoration:line-through;text-decoration-color:oklch(56% 0.022 330 / .5)}",
  ".todo-it.done .td{background:var(--success)}",
  ".todo-it.now{color:var(--gold-strong);background:color-mix(in oklab, var(--gold) 18%, var(--surface-2))}",
  ".todo-it.now .td{background:var(--gold-strong);animation:au-pulse 1.2s infinite}",
  ".goal-track{width:130px;height:4px;border-radius:99px;background:var(--surface-2);overflow:hidden;flex:none}",
  ".goal-fill{height:100%;border-radius:99px;background:linear-gradient(90deg,var(--gold-dim),var(--gold) 55%,var(--rose));transition:width .8s cubic-bezier(.22,.8,.26,1)}",
  /* ── P14 · 响应式降档(原型 §10;抽屉不适用:官方 ≤900 自动 68px 折叠轨,
     无抽屉 DOM —— 跟随官方折叠行为,只做逐档降密度)── */
  "@media (max-width:820px){body .wSkVaW_header{padding:10px 14px 0}body .wSkVaW_crumb,body .wSkVaW_crumbCurrent{font-size:16px}body .Md3f7G_scroll{padding:12px calc(var(--dsh-composer-side-clearance) + 8px)}body .uV2eYG_root{padding-bottom:6px}body .pXSMma_headline{font-size:25px}body .pXSMma_stack{max-width:calc(100vw - 48px)}}",
  "@media (max-width:640px){body .wSkVaW_tab{padding:4px 11px;font-size:12px}body .au-bubble{font-size:14.5px;max-width:90%}body .goal-track{width:64px}body .FJxK0a_sep{margin:0 6px}body .FJxK0a_root{font-size:9.5px}}",
  "@media (max-width:480px){body .todo-bar{min-width:100%}body .au-name em{display:none}body .turn-tail .tx{font-size:9.5px;letter-spacing:.02em}body .todo-it{font-size:10.5px}body .au-srow .au-s-title{font-size:11.5px}}",
  /* ── P11 · §7 子调用(整段拷贝;AuToolCallTree 消费)── */
  ".tool-kids{margin:9px 0 3px 19px;padding-left:13px;border-left:1px solid color-mix(in oklab, var(--fg) 9%, transparent);display:flex;flex-direction:column;gap:5px}",
  ".kid{display:flex;align-items:center;gap:9px;font-family:var(--font-mono);font-size:11.5px;color:var(--muted);padding:4px 2px;cursor:pointer;border-radius:7px}",
  ".kid:hover{color:var(--fg);background:oklch(24% 0.018 326 / .4)}",
  ".kid svg{width:12px;height:12px;color:var(--gold-dim);flex:none}",
  ".kid .k-sum{color:var(--faint);margin-left:auto;white-space:nowrap}",
  "body:not([data-ds-dark-theme]) .kid:hover{background:oklch(92% 0.016 84 / .6)}",
  /* 独立挂载适配(ROADMAP §6 记录):原型 .todo-bar 设计于 .dock 横排(flex:1 拉宽),
     官方 input.dock 是卡上方的 column-flex 区 —— flex:1 会变纵向拔高;
     改按官方 TodoDock(lXshSW_root)同形几何:与输入卡对齐、居中、不拔高 */
  ".todo-bar{flex:none;box-sizing:border-box;width:calc(100% - var(--dsh-composer-side-clearance)*2 - var(--dsh-composer-dock-inset)*4);max-width:calc(var(--dsh-composer-card-max-width) - var(--dsh-composer-dock-inset)*4);margin:0 auto}",
  "@media (prefers-reduced-motion:reduce){[data-chat-anchor-key]{animation:none}.compress-head .chev{transition:none}.a-actions{transition:none}.au-ws-rail,.au-ws.au-ws-wide,.menu.open{animation:none!important}.goal-fill{transition:none}}"
];

const CSS = CSS1.concat(CSS2, CSS3).join("\n");

const h = React.createElement;

function MoonIcon() {
  return h("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, h("path", { d: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" }));
}
function SunIcon() {
  return h("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, h("circle", { cx: 12, cy: 12, r: 4 }), h("path", { d: "M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" }));
}
function useAurum(api) {
  const st = React.useState(function () { return api.snapshot(); });
  React.useEffect(function () { return api.subscribe(function () { st[1](api.snapshot()); }); }, []);
  return st[0];
}
function AurumFootToggle(props) {
  const snap = useAurum(props.api);
  const isAurum = snap.id === "aurum-dark" || snap.id === "aurum-light";
  const dark = snap.mode === "dark";
  const wide = props.wide !== false;
  const label = (isAurum ? "鎏金 · " : "进入鎏金 · ") + (dark ? "深色" : "浅色");
  const title = isAurum ? (dark ? "切换到鎏金 · 浅色" : "切换到鎏金 · 深色") : "启用鎏金主题(保持当前深浅)";
  return h("button", { type: "button", className: "aurum-footRow" + (wide ? "" : " au-rail"), title: title, "aria-label": title, onClick: function () { props.api.toggle(); } }, dark ? h(MoonIcon) : h(SunIcon), wide ? h("span", null, label) : null);
}
const SEGMENT = [
  { id: "aurum-dark", label: "鎏金 · 深" },
  { id: "aurum-light", label: "鎏金 · 浅" },
  { id: "dark", label: "官方 · 深" },
  { id: "light", label: "官方 · 浅" },
  { id: "system", label: "跟随系统" }
];
function AurumSettingsRow(props) {
  const snap = useAurum(props.api);
  return h("div", { className: "aurum-row" },
    h("div", { className: "aurum-rowTitle" }, "主题风格 · 鎏金"),
    h("div", { className: "aurum-seg", role: "group", "aria-label": "主题风格" }, SEGMENT.map(function (seg) {
      return h("button", { key: seg.id, type: "button", className: "aurum-segBtn", "aria-pressed": snap.id === seg.id, onClick: function () { props.api.select(seg.id); } }, seg.label);
    })),
    h("p", { className: "aurum-hint" }, "鎏金 = 金粉奢华皮肤(香槟金 · 点阵画布 · 衬线正文),由临时插件提供,插件停止自动回退;官方 = 内置调色板。"));
}

function auText(content) {
  const out = [];
  const c = content || [];
  for (let i = 0; i < c.length; i++) {
    if (c[i] && c[i].type === "text" && typeof c[i].text === "string") out.push(c[i].text);
  }
  return out.join("\n\n");
}
function auJson(raw) {
  if (typeof raw !== "string" || raw.length === 0) return null;
  try { return JSON.parse(raw); } catch (e) { return null; }
}
function auRel(p, cwd) {
  if (!p) return "";
  if (cwd && typeof p === "string" && p.indexOf(cwd) === 0) {
    const r = p.slice(cwd.length).replace(/^[\\/]+/, "");
    return r || p;
  }
  return p;
}
function auDur(ms) {
  if (ms == null || ms < 0) return "";
  if (ms < 1000) return Math.round(ms) + "ms";
  return (ms / 1000).toFixed(1) + "s";
}
function Ic(kind) {
  const a = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" };
  if (kind === "search") return h("svg", a, h("circle", { cx: 11, cy: 11, r: 7 }), h("path", { d: "m20 20-3.5-3.5" }));
  if (kind === "read") return h("svg", a, h("path", { d: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" }), h("path", { d: "M14 3v5h5M9 13h6M9 17h4" }));
  if (kind === "edit") return h("svg", a, h("path", { d: "M11 5h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6" }), h("path", { d: "M17 3l4 4L11 17l-5 1 1-5Z" }));
  if (kind === "todo") return h("svg", a, h("path", { d: "M4 6h2m-2 6h2m-2 6h2m4-12h12M10 12h12M10 18h12" }));
  if (kind === "globe") return h("svg", a, h("circle", { cx: 12, cy: 12, r: 9 }), h("path", { d: "M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" }));
  if (kind === "terminal") return h("svg", a, h("path", { d: "m5 8 4 4-4 4M11 17h8" }));
  if (kind === "view") return h("svg", a, h("path", { d: "M4 6h7M17 6h3M4 12h3M12 12h8M4 18h11" }), h("circle", { cx: 14, cy: 6, r: 2.1 }), h("circle", { cx: 9, cy: 12, r: 2.1 }), h("circle", { cx: 17.5, cy: 18, r: 2.1 }));
  if (kind === "folderplus") return h("svg", a, h("path", { d: "M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" }), h("path", { d: "M12 10.5v5M9.5 13h5" }));
  if (kind === "folder") return h("svg", a, h("path", { d: "M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" }));
  if (kind === "folderopen") return h("svg", a, h("path", { d: "m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2" }));
  if (kind === "dots") return h("svg", Object.assign({}, a, { fill: "currentColor", stroke: "none" }), h("circle", { cx: 5, cy: 12, r: 1.6 }), h("circle", { cx: 12, cy: 12, r: 1.6 }), h("circle", { cx: 19, cy: 12, r: 1.6 }));
  if (kind === "plus") return h("svg", Object.assign({}, a, { strokeWidth: 2.2 }), h("path", { d: "M12 5v14M5 12h14" }));
  if (kind === "chevdown") return h("svg", Object.assign({}, a, { fill: "currentColor", stroke: "none" }), h("path", { d: "M7 9.2h10L12 16z" }));
  if (kind === "chevron") return h("svg", a, h("path", { d: "m9 6 6 6-6 6" }));
  if (kind === "copy") return h("svg", a, h("rect", { x: 9, y: 9, width: 12, height: 12, rx: 2.5 }), h("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" }));
  if (kind === "branch") return h("svg", a, h("circle", { cx: 6, cy: 6, r: 2.5 }), h("circle", { cx: 6, cy: 18, r: 2.5 }), h("circle", { cx: 18, cy: 8, r: 2.5 }), h("path", { d: "M6 8.5v7M6 13c6 0 6-3 10.5-3.5" }));
  if (kind === "retry") return h("svg", a, h("path", { d: "M21 12a9 9 0 1 1-2.6-6.3M21 4v5h-5" }));
  if (kind === "error") return h("svg", Object.assign({}, a, { strokeWidth: 1.9 }), h("circle", { cx: 12, cy: 12, r: 9 }), h("path", { d: "M12 8v4.5M12 16h.01" }));
  /* P11:兜底/新工具类型图标 */
  if (kind === "target") return h("svg", a, h("circle", { cx: 12, cy: 12, r: 8.6 }), h("circle", { cx: 12, cy: 12, r: 4 }), h("circle", Object.assign({}, a, { fill: "currentColor", stroke: "none", cx: 12, cy: 12, r: 1.4 })));
  if (kind === "stop") return h("svg", Object.assign({}, a, { strokeWidth: 2 }), h("rect", { x: 6, y: 6, width: 12, height: 12, rx: 3 }));
  if (kind === "list") return h("svg", a, h("path", { d: "M9 6h11M9 12h11M9 18h11" }), h("path", { d: "M4.5 6h.01M4.5 12h.01M4.5 18h.01", "stroke-linecap": "round", "stroke-width": 2.4 }));
  if (kind === "image") return h("svg", a, h("rect", { x: 4, y: 5, width: 16, height: 14, rx: 2.5 }), h("circle", { cx: 9, cy: 10, r: 1.6 }), h("path", { d: "m6 17 4.2-4.2a1.5 1.5 0 0 1 2.1 0L20 20" }));
  if (kind === "spark") return h("svg", a, h("path", { d: "M13 2 4.5 13.5H11l-1.2 8.5L18.5 10.5H12L13 2Z" }));
  /* P11 修订:兜底工具图标 = 双四角星(用户指定)—— 大星左下 + 小星右上 */
  if (kind === "stars") return h("svg", Object.assign({}, a, { fill: "currentColor", stroke: "none" }),
    h("path", { d: "M10 5C10.9 10.3 13.7 13.1 19 13 13.7 13.9 10.9 16.7 10 22 9.1 16.7 6.3 13.9 2 13 6.3 13.1 9.1 10.3 10 5Z" }),
    h("path", { d: "M19 2C19.4 4.5 20 5.1 22.5 5.5 20 5.9 19.4 6.5 19 9 18.6 6.5 18 5.9 15.5 5.5 18 5.1 18.6 4.5 19 2Z" }));
  if (kind === "question") return h("svg", a, h("circle", { cx: 12, cy: 12, r: 9 }), h("path", { d: "M9.5 9a2.5 2.5 0 1 1 3.4 2.3c-.8.3-.9 1-.9 1.7M12 17h.01" }));
  return null;
}
function AuPill(props) {
  let cls = "au-pill";
  if (props.state === "ok") cls += " au-ok";
  else if (props.state === "run") cls += " au-run";
  else if (props.state === "err") cls += " au-err";
  return h("span", { className: cls }, props.text);
}
/* P8c · 鲸鱼(原型 #dsw-whale 同源 path,与 P9 assistant 头像 mask 同一份图形) */
const AU_WHALE_PATH = "M23.0584 4.95203C22.8129 4.83203 22.7074 5.06103 22.5639 5.17704C22.5149 5.21454 22.4734 5.26354 22.4319 5.30854C22.0734 5.69155 21.6543 5.94306 21.1073 5.91306C20.3073 5.86806 19.6243 6.11957 19.0203 6.73158C18.8918 5.97706 18.4652 5.52655 17.8162 5.23754C17.4767 5.08753 17.1332 4.93703 16.8952 4.61052C16.7292 4.37801 16.6837 4.11901 16.6007 3.8635C16.5477 3.70949 16.4952 3.55199 16.3177 3.52549C16.1252 3.49549 16.0497 3.65699 15.9742 3.792C15.6722 4.34401 15.5552 4.95203 15.5667 5.56805C15.5932 6.95359 16.1782 8.05712 17.3407 8.84215C17.4727 8.93215 17.5067 9.02215 17.4652 9.15366C17.3857 9.42416 17.2917 9.68667 17.2087 9.95718C17.1557 10.1297 17.0767 10.1677 16.8917 10.0922C16.2537 9.82568 15.7027 9.43117 15.2156 8.95465C14.3891 8.15513 13.6416 7.2726 12.7096 6.58158C12.4906 6.42007 12.2716 6.27007 12.045 6.12707C11.094 5.20354 12.1696 4.44502 12.4186 4.35501C12.6791 4.26101 12.5091 3.938 11.6675 3.942C10.826 3.9455 10.056 4.22751 9.07446 4.60302C8.93096 4.65952 8.77995 4.70052 8.62545 4.73452C7.73492 4.56552 6.80989 4.52802 5.84386 4.63702C4.02481 4.83953 2.57177 5.69955 1.50373 7.1676C0.220694 8.93215 -0.0813148 10.9372 0.288196 13.0283C0.676708 15.2323 1.80174 17.0569 3.53029 18.4834C5.32285 19.9625 7.38741 20.6875 9.74298 20.5485C11.1735 20.466 12.7661 20.2745 14.5626 18.7539C15.0156 18.9795 15.4912 19.0695 16.2797 19.137C16.8872 19.1935 17.4722 19.107 17.9252 19.013C18.6347 18.8629 18.5857 18.2059 18.3292 18.0854C16.2497 17.1169 16.7062 17.5109 16.2912 17.1919C17.3477 15.9419 18.9618 13.7198 19.4598 10.6942C19.5088 10.3602 19.5713 9.88968 19.5638 9.61917C19.5598 9.45417 19.5978 9.39016 19.7863 9.37116C20.3073 9.31116 20.8128 9.16866 21.2773 8.91315C22.6249 8.17713 23.1684 6.96809 23.2964 5.51905C23.3154 5.29754 23.2924 5.06853 23.0584 4.95203ZM11.3165 17.9954C9.30097 16.4109 8.32344 15.8894 7.91992 15.9119C7.54241 15.9344 7.61042 16.3664 7.69342 16.6479C7.78042 16.9259 7.89342 17.1174 8.05193 17.3614C8.16143 17.5229 8.23694 17.7629 7.94243 17.9434C7.29341 18.3449 6.16487 17.8084 6.11187 17.7819C4.79833 17.0084 3.7003 15.9874 2.92628 14.5908C2.17875 13.2468 1.74474 11.8047 1.67324 10.2657C1.65424 9.89418 1.76374 9.76267 2.13375 9.69517C2.62077 9.60517 3.12278 9.58617 3.6093 9.65767C5.66636 9.95818 7.41741 10.8777 8.88545 12.3348C9.72348 13.1643 10.3575 14.1558 11.0105 15.1243C11.705 16.1529 12.4521 17.1329 13.4036 17.9364C13.7396 18.2179 14.0076 18.4319 14.2641 18.5899C13.4906 18.6764 12.1996 18.6949 11.3165 17.9964V17.9954ZM12.2826 11.7817C12.2826 11.6167 12.4146 11.4852 12.5806 11.4852C12.6181 11.4852 12.6521 11.4927 12.6826 11.5037C12.7241 11.5187 12.7621 11.5412 12.7921 11.5752C12.8451 11.6277 12.8751 11.7027 12.8751 11.7817C12.8751 11.9467 12.7431 12.0782 12.5771 12.0782C12.4111 12.0782 12.2826 11.9467 12.2826 11.7817ZM15.2831 13.3208C15.0906 13.3998 14.8981 13.4673 14.7131 13.4748C14.4261 13.4898 14.1131 13.3733 13.9431 13.2308C13.6791 13.0093 13.4901 12.8853 13.4111 12.4988C13.3771 12.3338 13.3961 12.0782 13.4261 11.9317C13.4941 11.6162 13.4186 11.4137 13.1961 11.2297C13.0151 11.0797 12.7846 11.0382 12.5316 11.0382C12.4371 11.0382 12.3506 10.9967 12.2861 10.9632C12.1806 10.9107 12.0936 10.7792 12.1766 10.6177C12.2031 10.5652 12.3316 10.4377 12.3616 10.4152C12.7051 10.2197 13.1011 10.2837 13.4676 10.4302C13.8071 10.5692 14.0641 10.824 14.4336 11.1847C14.8111 11.6202 14.8791 11.7402 15.0941 12.0672C15.2641 12.3228 15.4186 12.5853 15.5247 12.8858C15.5887 13.0733 15.5057 13.2268 15.2831 13.3208Z";
function AuBody(props) {
  return h("div", { className: "au-x" + (props.open ? " au-open" : "") }, h("div", { className: "au-clip" }, h("div", { className: "au-in" }, props.children)));
}

function auDiffRows(diffs) {
  const rows = [];
  for (let i = 0; i < diffs.length; i++) {
    const d = diffs[i];
    if (!d) continue;
    rows.push(h("div", { className: "au-dl au-hk", key: "hk" + i }, h("span", { className: "au-no" }, "@@"), h("span", { className: "au-co" }, d.path || "")));
    const oldLines = (d.oldText != null ? String(d.oldText) : "").split("\n");
    for (let j = 0; j < oldLines.length && j < 60; j++) {
      rows.push(h("div", { className: "au-dl au-del", key: "d" + i + "-" + j }, h("span", { className: "au-no" }, String(j + 1)), h("span", { className: "au-co" }, oldLines[j])));
    }
    const newLines = (d.newText != null ? String(d.newText) : "").split("\n");
    for (let k = 0; k < newLines.length && k < 60; k++) {
      rows.push(h("div", { className: "au-dl au-add", key: "a" + i + "-" + k }, h("span", { className: "au-no" }, String(k + 1)), h("span", { className: "au-co" }, newLines[k])));
    }
  }
  return rows;
}
function auDiffStat(diffs) {
  let add = 0, del = 0;
  for (let i = 0; i < diffs.length; i++) {
    const d = diffs[i];
    if (d.oldText != null) del += String(d.oldText).split("\n").length;
    if (d.newText != null) add += String(d.newText).split("\n").length;
  }
  return "+" + add + " −" + del;
}
function auGrepBody(view, cwd) {
  if (view.shape === "paths") {
    const rows = (view.paths || []).map(function (p, i) { return h("div", { className: "au-gline", key: i }, p); });
    return h("div", null, h("div", { className: "au-sec" }, "路径列表 · " + view.total), rows);
  }
  const files = view.files || [];
  const fEls = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const ms = f.matches || [];
    const lineEls = [];
    for (let j = 0; j < ms.length && j < 6; j++) {
      lineEls.push(h("div", { className: "au-gline", key: j }, h("span", { className: "au-ln" }, "L" + ms[j].lineNumber), " ", ms[j].line));
    }
    fEls.push(h("div", { className: "au-gfile", key: i }, h("b", null, h("span", null, auRel(f.path, cwd)), h("i", null, ms.length + " 处")), lineEls));
  }
  return h("div", null, h("div", { className: "au-sec" }, "命中 " + view.total + " 处" + (view.truncated ? " · 已截断" : "")), fEls);
}
function auReadBody(view, cwd) {
  const lines = view.lines || [];
  const max = 40;
  const rows = [];
  for (let i = 0; i < lines.length && i < max; i++) {
    const ln = lines[i];
    rows.push(h("div", { className: "au-rl", key: i }, h("span", { className: "au-ln" }, String(ln.number)), h("span", { className: "au-rc" }, ln.text || "")));
  }
  const shown = Math.min(lines.length, max);
  return h("div", null,
    h("div", { className: "au-sec" }, "读取 · " + auRel(view.path, cwd) + " · L" + view.offset + "–" + (view.offset + shown - 1) + " / " + view.totalLines + " 行"),
    h("div", { className: "au-read" }, rows),
    lines.length > max ? h("div", { className: "au-dim" }, "… 已省略 " + (lines.length - max) + " 行") : null);
}
function auWebBody(view) {
  const srcs = view.sources || [];
  const els = srcs.map(function (s, i) {
    return h("div", { className: "au-sr", key: i }, h("b", null, s.title || s.url), h("div", { className: "au-u" }, s.url), s.snippet ? h("p", null, s.snippet) : null);
  });
  const answer = view.answer ? h("div", { className: "au-term", style: { marginBottom: 10 } }, view.answer) : null;
  return h("div", null, h("div", { className: "au-sec" }, "检索结果 · " + srcs.length + (view.truncated ? " · 已截断" : "")), answer, h("div", { className: "au-sres" }, els));
}
function auTermBody(view) {
  const out = view.output != null ? String(view.output) : "";
  const exit = view.exitCode != null ? "退出码 " + view.exitCode : (view.signal ? "信号 " + view.signal : "");
  return h("div", null, h("div", { className: "au-sec" }, "终端输出"), h("pre", { className: "au-term" }, out || "(无输出)"), exit ? h("div", { className: "au-dim" }, exit) : null);
}
function auTodoBody(args) {
  const todos = args && args.todos;
  if (!Array.isArray(todos) || todos.length === 0) return null;
  const els = todos.map(function (t, i) {
    const s = t && t.status ? String(t.status) : "pending";
    let cls = "au-td";
    if (s === "completed") cls += " au-done";
    else if (s === "in_progress") cls += " au-now";
    return h("div", { className: cls, key: i }, h("span", { className: "au-dot" }), (t && t.content) || "");
  });
  return h("div", { className: "au-todo" }, els);
}

/* P11 · 兜底参数摘要推导(未知工具的 em 统一走这里) */
function auArgEm(a) {
  if (!a || typeof a !== "object") return "";
  const ks = ["description", "objective", "prompt", "query", "pattern", "command", "path", "file_path", "url", "name", "skill"];
  for (let i = 0; i < ks.length; i++) { const v = a[ks[i]]; if (typeof v === "string" && v) return v.length > 60 ? v.slice(0, 57) + "…" : v; }
  for (const k in a) {
    const v = a[k];
    if (typeof v === "string" && v) return v.length > 60 ? v.slice(0, 57) + "…" : v;
    if (Array.isArray(v) && v.length && typeof v[0] === "string") return v[0].length > 60 ? v[0].slice(0, 57) + "…" : v[0];
  }
  return "";
}
function auFirstLine(t) { if (!t) return ""; const nl = t.indexOf("\n"); return nl === -1 ? t : t.slice(0, nl); }

function AuToolCard(props) {
  const b = props.block || {};
  const settled = b.kind === "tool-result";
  const running = !settled;
  const isErr = settled && !!b.isError;
  const name = props.toolName || (settled && b.call ? b.call.name : (b.name || ""));
  const argsRaw = settled ? (b.call ? b.call.argsRaw : "") : (b.argsRaw || "");
  const args = auJson(argsRaw) || {};
  const callView = b.callView || null;
  const resultView = settled ? (b.resultView || null) : null;
  const cwd = props.cwd;
  const openFile = props.openFile;
  const inspect = props.inspect;
  const st = React.useState(false);
  const open = st[0], setOpen = st[1];

  let em = "", summary = "", filePath = null, icon = "search", body = null;

  if (name === "grep") {
    icon = "search";
    em = typeof args.pattern === "string" ? args.pattern : (Array.isArray(args.pattern) ? args.pattern.join("|") : "");
    if (resultView && resultView.card === "search") summary = resultView.shape === "paths" ? (resultView.total + " 个路径") : (resultView.total + " 处命中 · " + resultView.files.length + " 个文件");
    else summary = running ? "搜索中…" : "搜索";
    if (resultView && resultView.card === "search") body = auGrepBody(resultView, cwd);
  } else if (name === "read") {
    icon = "read";
    em = auRel(args.file_path || args.path, cwd);
    filePath = args.file_path || args.path;
    if (resultView && resultView.card === "read") summary = resultView.lines.length + " 行 · 共 " + resultView.totalLines + " 行";
    else summary = running ? "读取中…" : "读取";
    if (resultView && resultView.card === "read") body = auReadBody(resultView, cwd);
  } else if (name === "edit" || name === "write") {
    icon = "edit";
    const f1 = args.file_path || args.path || (resultView && resultView.diffs && resultView.diffs[0] && resultView.diffs[0].path);
    em = auRel(f1, cwd);
    filePath = f1;
    if (resultView && resultView.card === "diff") summary = auDiffStat(resultView.diffs);
    else summary = running ? "写入中…" : "已修改";
    if (resultView && resultView.card === "diff") body = h("div", { className: "au-diff" }, auDiffRows(resultView.diffs));
  } else if (name === "todo_write") {
    icon = "todo";
    const todos = args.todos;
    if (Array.isArray(todos)) {
      em = "清单 · " + todos.length + " 项";
      let done = 0, now = 0;
      todos.forEach(function (t) { if (t.status === "completed") done++; else if (t.status === "in_progress") now++; });
      summary = done + " 完成" + (now ? " · " + now + " 进行中" : "");
      body = auTodoBody(args);
    } else {
      em = "清单";
      summary = "";
    }
  } else if (name === "web_search" || name === "web_fetch") {
    icon = "globe";
    em = args.query || args.url || "";
    if (resultView && resultView.card === "web") summary = resultView.kind === "fetch" ? ("HTTP " + resultView.statusCode) : (resultView.sources.length + " 条结果");
    else summary = running ? "检索中…" : "检索";
    if (resultView && resultView.card === "web") body = auWebBody(resultView);
  } else if (name === "pwsh" || name === "bash") {
    icon = "terminal";
    em = args.command || (callView && callView.title) || "";
    if (resultView && resultView.card === "terminal") summary = resultView.exitCode != null ? ("退出码 " + resultView.exitCode) : (resultView.signal || "完成");
    else summary = running ? "执行中…" : "执行";
    if (resultView && resultView.card === "terminal") body = auTermBody(resultView);
  }

  if (body == null) {
    const txt = settled ? auText(b.content) : ((callView && callView.title) || argsRaw);
    if (txt) body = h("pre", { className: "au-term" }, txt);
  }

  /* P11 兜底:未特判的工具名(glob / ask_user_question / subagent / job 系列 / goal 系列
     及一切未知插件工具)—— 图标统一「双四角星」(用户指定),em 与 summary 从 args、
     结果首行推导 */
  if (summary === "" && em === "") {
    icon = "stars";
    em = auArgEm(args);
    if (running) summary = (callView && callView.title) || "执行中…";
    else {
      const fl = auFirstLine(auText(b.content));
      summary = fl ? (fl.length > 64 ? fl.slice(0, 61) + "…" : fl) : (isErr ? "调用失败" : "完成");
    }
  }

  const durMs = settled && b.callTime != null ? b.time - b.callTime : null;
  const pill = running ? h(AuPill, { state: "run", text: "运行中" }) : isErr ? h(AuPill, { state: "err", text: "失败" }) : h(AuPill, { state: "ok", text: "完成 · " + auDur(durMs) });

  /* P11 t-foot:统计(左)与操作(右)并存 —— 耗时 + 已知结果统计 */
  const statBits = [];
  if (settled) statBits.push("耗时 " + auDur(durMs));
  if (name === "grep" && resultView && resultView.total != null) statBits.push("命中 " + resultView.total);
  if ((name === "read") && resultView && resultView.lines) statBits.push(resultView.lines.length + " 行");
  if (name === "web_search" && resultView && resultView.sources) statBits.push(resultView.sources.length + " 源");
  const foot = h("div", { className: "au-foot" },
    statBits.length ? h("span", { className: "au-fstat" }, statBits.join(" · ")) : null,
    filePath && typeof openFile === "function" ? h("button", { className: "au-link", onClick: function (e) { e.stopPropagation(); openFile(filePath); } }, "打开文件") : null,
    typeof inspect === "function" ? h("button", { className: "au-link", onClick: function (e) { e.stopPropagation(); inspect(); } }, "在轨迹中查看") : null);

  return h("div", { className: "au-tool" + (open ? " au-open" : ""), "data-state": running ? "running" : (isErr ? "error" : "ok"), "data-tool": name },
    h("div", { className: "au-main", onClick: function () { setOpen(!open); } },
      h("span", { className: "au-ico" }, Ic(icon)),
      h("span", { className: "au-txt" },
        h("span", { className: "au-name" }, name, em ? h("em", null, em) : null),
        summary ? h("span", { className: "au-sum" }, summary) : null),
      pill,
      h("span", { className: "au-chev" }, Ic("chevron"))),
    h(AuBody, { open: open }, body, foot));
}

/* ═══ P11 · 工具调用树(遮蔽官方 ToolCallTree:conversation.chat.node key=tool-call)═══
   动机:官方对未知工具的兜底是硬编码在 ToolCall 内的 GenericToolCard
   (renderSlot fallback 参数,插件不可替换);遮蔽整棵树后由 AuToolCard 的
   兜底分支接管一切工具名 —— 已知名走特判,未知名走 META+推导,天然全覆盖。
   subCalls 递归 = 原型 §7 tool-kids(缩进+左竖线+kid 行+k-sum);点 kid 行
   就地展开该子调用的完整卡片。 */
function AuKid(props) {
  const b = props.block;
  const settled = b.kind === "tool-result";
  const name = settled ? ((b.call && b.call.name) || "") : (b.name || "");
  const st = React.useState(false);
  const open = st[0];
  const sum = !settled ? "运行中…" : (b.isError ? "失败" : auDur(b.callTime != null ? b.time - b.callTime : null));
  return h("div", null,
    h("div", { className: "kid", onClick: function () { st[1](!open); } },
      Ic("stars"),
      h("span", null, name),
      h("span", { className: "k-sum" }, sum)),
    open ? h(AuToolCard, props.owner) : null);
}
function AuToolBranch(props) {
  const b = props.block;
  const settled = b.kind === "tool-result";
  const toolName = settled ? ((b.call && b.call.name) || "") : (b.name || "");
  const owner = {
    callId: b.callId, toolName: toolName, block: b,
    openFile: props.openFile, cwd: props.cwd, home: props.home,
    inspect: function () { if (typeof props.inspectCall === "function") props.inspectCall(b.callId); }
  };
  const kids = (b.subCalls || []);
  return h("div", { className: "au-callrow", "data-chat-anchor-key": "call:" + b.callId, "data-chat-call-id": b.callId, "data-selected": props.selectedCallId === b.callId || undefined },
    h(AuToolCard, owner),
    kids.length ? h("div", { className: "tool-kids", "data-subcalls": true },
      kids.map(function (c) { return h(AuKid, { key: c.callId, block: c, owner: Object.assign({}, owner, { callId: c.callId, toolName: c.kind === "tool-result" ? ((c.call && c.call.name) || "") : (c.name || ""), block: c, inspect: function () { if (typeof props.inspectCall === "function") props.inspectCall(c.callId); } }) }); })) : null);
}
function AuToolCallTree(props) {
  const root = props.node && props.node.data && props.node.data.root;
  if (!root) return null;
  return h(AuToolBranch, {
    block: root, selectedCallId: props.selectedCallId, cwd: props.cwd, home: props.home,
    openFile: props.openFile, inspectCall: props.inspectCall
  });
}

function auWsLabel(w) {
  if (!w) return "未分组";
  if (w.title && typeof w.title === "string" && w.title !== "") return w.title;
  const cwd = typeof w.path === "string" ? w.path : "";
  if (cwd === "") return "未分组";
  const base = cwd.replace(/[/\\]+$/, "").split(/[/\\]/).pop();
  return base && base !== "" ? base : cwd;
}
function auTitle(s) {
  return s.blank ? "新会话" : (s.displayTitle || "未命名会话");
}
function auAgo(ts) {
  if (ts == null) return "";
  const diff = Math.max(0, Date.now() - ts);
  if (diff < 60000) return "刚刚";
  if (diff < 3600000) return Math.floor(diff / 60000) + " 分钟前";
  if (diff < 86400000) return Math.floor(diff / 3600000) + " 小时前";
  if (diff < 2592000000) return Math.floor(diff / 86400000) + " 天前";
  return Math.floor(diff / 2592000000) + " 个月前";
}
function auVisible(s, current, archived) {
  return s.origin !== "subagent" && !archived.has(s.id) && (!s.blank || s.id === current);
}
function auByRecency(a, b) {
  if ((b.updatedAt || 0) !== (a.updatedAt || 0)) return (b.updatedAt || 0) - (a.updatedAt || 0);
  return a.id < b.id ? -1 : 1;
}

function AuSessionRow(props) {
  const s = props.s;
  const au = props.au;
  const cur = props.current === s.id;
  const renaming = props.renaming === true;
  const rv = props.renameValue != null ? props.renameValue : auTitle(s);
  let stateCls = "";
  let tip = auTitle(s);
  if (s.running === true) { stateCls = "au-working"; tip += " · 运行中"; }
  else if (s.pendingInteraction !== undefined) { stateCls = "au-waiting"; tip += " · 等待交互"; }
  else if (s.completed === true && !cur) { stateCls = "au-done"; tip += " · 已完成"; }
  const ago = auAgo(s.updatedAt);
  if (ago) tip += " · " + ago;
  /* P8c:行内操作条已废 —— 悬停 ··· 开原型形态浮动菜单(.menu fixed,AuBrowserWide 渲染);
     拖拽排序:drop-before/after 金线落点 + .dragging 半透明(持久化走 insertSessionBefore) */
  const dropPos = props.dropPos;
  const cls = "au-srow" + (cur ? " au-cur" : "") + (stateCls ? " " + stateCls : "")
    + (dropPos ? " drop-" + dropPos : "") + (props.dragging ? " dragging" : "");
  const dragHandlers = props.canDrag
    ? {
        draggable: !renaming,
        onDragStart: function (e) {
          e.dataTransfer.effectAllowed = "move";
          try { e.dataTransfer.setData("text/plain", s.id); } catch (err) {}
          props.onDragState(s.id, true);
        },
        onDragEnd: function () { props.onDragState(null, false); },
        onDragOver: function (e) {
          if (!props.onCanDrop || !props.onCanDrop(s)) return;
          e.preventDefault();
          const r = e.currentTarget.getBoundingClientRect();
          props.onDropMark(s, e.clientY < r.top + r.height / 2 ? "before" : "after");
        },
        onDrop: function (e) {
          e.preventDefault();
          props.onDropCommit(s);
        }
      }
    : {};
  return h("div", { className: "au-srowwrap", onMouseEnter: props.onHover, onMouseLeave: props.onHoverEnd },
    h("button", Object.assign({ type: "button", className: cls, title: tip, onClick: function () { au.open(s.id); } }, dragHandlers),
      h("span", { className: "au-s-ic" }),
      props.wsLabel ? h("span", { className: "au-s-meta" }, props.wsLabel) : null,
      renaming
        ? h("input", { className: "au-s-rename", value: rv, autoFocus: true, spellCheck: false, onChange: function (e) { props.onRenameValue(e.target.value); }, onClick: function (e) { e.stopPropagation(); }, onKeyDown: function (e) { if (e.key === "Enter") { e.preventDefault(); props.onRenameCommit(); } if (e.key === "Escape") { e.preventDefault(); props.onRenameCancel(); } }, onBlur: function () { props.onRenameCommit(); } })
        : h("span", { className: "au-s-title" }, auTitle(s)),
      renaming ? null : h("button", { type: "button", className: "au-s-menu", title: "会话操作", "aria-label": "会话操作", onClick: function (e) { e.stopPropagation(); props.onMenuOpen(e); } }, Ic("dots"))));
}

function AuGroup(props) {
  const g = props.g;
  const au = props.au;
  const closed = props.closed === true;
  const renaming = props.renaming === true;
  const rv = props.renameValue != null ? props.renameValue : g.label;
  return h("div", { className: "au-wsg" + (closed ? " au-closed" : "") + (props.containsCurrent ? " au-curgroup" : "") },
    h("button", { type: "button", className: "au-wsg-head", title: g.ws ? (g.ws.path || g.label) : "", onClick: props.onToggle },
      h("span", { className: "au-ws-ic" }, Ic("chevdown"), Ic(closed ? "folder" : "folderopen")),
      renaming
        ? h("input", { className: "au-wsg-rename", value: rv, autoFocus: true, spellCheck: false, onChange: function (e) { props.onRenameValue(e.target.value); }, onClick: function (e) { e.stopPropagation(); }, onKeyDown: function (e) { if (e.key === "Enter") { e.preventDefault(); props.onRenameCommit(); } if (e.key === "Escape") { e.preventDefault(); props.onRenameCancel(); } }, onBlur: function () { props.onRenameCommit(); } })
        : h("b", null, g.label),
      renaming ? null : h("span", { className: "au-wsg-acts" },
        g.menuSlot,
        g.ws ? h("button", { type: "button", className: "au-wsg-act", title: "在此目录新建会话", "aria-label": "在此目录新建会话", onClick: function (e) { e.stopPropagation(); au.startSession(g.ws.workspaceId); } }, Ic("plus")) : null)),
    h("div", { className: "au-slist" }, closed ? null : props.children));
}

function AuBrowserWide(props) {
  const au = props.au;
  const list = props.useSessions(function (s) { return s; });
  const wsState = props.useWorkspaces(function (s) { return s; });
  const searchOpenSt = React.useState(false);
  const querySt = React.useState("");
  const flatSt = React.useState(false);
  const addOpenSt = React.useState(false);
  const addPathSt = React.useState("");
  const closedSt = React.useState({});
  /* P8c:menu/headMenu 带 fixed 坐标(原型 .menu.fixed);drag/over 拖拽排序;hoverId 供 F2;
     sort = manual(sessionIds 手动序,默认)| recent | name */
  const menuSt = React.useState(null);
  const headMenuSt = React.useState(null);
  const renSt = React.useState(null);
  const renValSt = React.useState("");
  const delSt = React.useState(null);
  const dragSt = React.useState(null);
  const overSt = React.useState(null);
  const hoverSt = React.useState(null);
  const sortSt = React.useState("manual");
  const inputRef = React.useRef(null);
  const searchOpen = searchOpenSt[0], setSearchOpen = searchOpenSt[1];
  const query = querySt[0], setQuery = querySt[1];
  const flat = flatSt[0], setFlat = flatSt[1];
  const addOpen = addOpenSt[0], setAddOpen = addOpenSt[1];
  const addPath = addPathSt[0], setAddPath = addPathSt[1];
  const closed = closedSt[0], setClosed = closedSt[1];
  const menu = menuSt[0], setMenu = menuSt[1];
  const headMenu = headMenuSt[0], setHeadMenu = headMenuSt[1];
  const ren = renSt[0], setRen = renSt[1];
  const renVal = renValSt[0], setRenVal = renValSt[1];
  const del = delSt[0], setDel = delSt[1];
  const drag = dragSt[0], setDrag = dragSt[1];
  const over = overSt[0], setOver = overSt[1];
  const hoverId = hoverSt[0], setHoverId = hoverSt[1];
  const sort = sortSt[0], setSort = sortSt[1];

  React.useEffect(function () {
    if (searchOpen && inputRef.current && inputRef.current.focus) inputRef.current.focus();
  }, [searchOpen]);

  /* P8c · 细条搜索钮握手:展开后 300ms 聚焦搜索框(原型行为) */
  React.useEffect(function () {
    if (window.__auFocusSearch) {
      window.__auFocusSearch = false;
      setSearchOpen(true);
      const t = setTimeout(function () { if (inputRef.current && inputRef.current.focus) inputRef.current.focus(); }, 300);
      return function () { clearTimeout(t); };
    }
  }, []);

  /* P8c · 浮动菜单:点外/Esc 关闭(原生监听,非操纵官方 DOM) */
  const menusOpen = menu !== null || headMenu !== null;
  React.useEffect(function () {
    if (!menusOpen) return;
    const onDown = function (e) {
      const t = e.target;
      if (t && t.closest && t.closest(".menu,.au-s-menu,.au-wsg-act,.au-ws-ibtn")) return;
      setMenu(null); setHeadMenu(null); setDel(null);
    };
    const onKey = function (e) {
      if (e.key === "Escape") { setMenu(null); setHeadMenu(null); setDel(null); }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return function () { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [menusOpen]);

  const archived = new Set((wsState && wsState.archivedSessionIds) || []);
  const workspaces = (wsState && wsState.items) || [];
  const current = list.current;

  /* P8c · 排序:manual = sessionIds 手动序(拖拽持久序,默认);recent/name 只影响展示 */
  const auSortFn = sort === "name"
    ? function (a, b) { return auTitle(a).localeCompare(auTitle(b), "zh") || auByRecency(a, b); }
    : auByRecency;

  const groups = [];
  const accounted = new Set();
  for (let i = 0; i < workspaces.length; i++) {
    const w = workspaces[i];
    let members = [];
    const ids = w.sessionIds || [];
    for (let j = 0; j < ids.length; j++) {
      const s = list.byId[ids[j]];
      if (s === undefined) continue;
      accounted.add(ids[j]);
      if (!auVisible(s, current, archived)) continue;
      members.push(s);
    }
    if (sort !== "manual") members = members.slice().sort(auSortFn);
    groups.push({ key: w.workspaceId, ws: w, label: auWsLabel(w), sessions: members, containsCurrent: ids.indexOf(current) !== -1 });
  }
  const stray = (list.ids || []).filter(function (id) { const s = list.byId[id]; return s !== undefined && !accounted.has(id) && auVisible(s, current, archived); }).map(function (id) { return list.byId[id]; }).sort(auByRecency);
  if (stray.length > 0) groups.push({ key: "__ungrouped__", ws: null, label: "未分组", sessions: stray, containsCurrent: stray.some(function (s) { return s.id === current; }) });

  const q = query.trim().toLowerCase();
  let results = null;
  if (q !== "") {
    results = [];
    for (let gi = 0; gi < groups.length; gi++) {
      const g = groups[gi];
      const gMatch = g.label.toLowerCase().indexOf(q) !== -1;
      for (let si = 0; si < g.sessions.length; si++) {
        const s = g.sessions[si];
        if (gMatch || auTitle(s).toLowerCase().indexOf(q) !== -1) results.push({ s: s, wsLabel: g.ws ? g.label : "" });
      }
    }
  }

  const flatAll = [];
  if (flat && results === null) {
    for (let gi = 0; gi < groups.length; gi++) for (let si = 0; si < groups[gi].sessions.length; si++) flatAll.push({ s: groups[gi].sessions[si], wsLabel: groups[gi].ws ? groups[gi].label : "" });
    const pairSort = function (a, b) { return auSortFn(a.s, b.s); };
    flatAll.sort(pairSort);
  }

  const closeMenu = function () { setMenu(null); setHeadMenu(null); setDel(null); };
  const startRename = function (kind, id, initial) { setRen({ kind: kind, id: id }); setRenVal(initial); closeMenu(); };

  /* P8c · F2 = 重命名悬停行(原型 mk 快捷键;须在 list/startRename 声明后注册) */
  React.useEffect(function () {
    const onKey = function (e) {
      if (e.key === "F2" && hoverId && list.byId[hoverId]) {
        e.preventDefault();
        startRename("s", hoverId, auTitle(list.byId[hoverId]));
      }
    };
    document.addEventListener("keydown", onKey);
    return function () { document.removeEventListener("keydown", onKey); };
  }, [hoverId, list, ren]);
  const commitRename = function () {
    if (ren === null) return;
    const v = renVal.trim();
    if (v !== "") {
      if (ren.kind === "ws") au.renameWorkspace(ren.id, v);
      else au.renameSession(ren.id, v);
    }
    setRen(null);
  };
  const commitAdd = function () {
    const p = addPath.trim();
    if (p === "") return;
    setAddOpen(false);
    setAddPath("");
    Promise.resolve(au.createWorkspace(p)).catch(function (e) { console.error("aurum: createWorkspace failed", e); });
  };

  /* P8c · 拖拽提交:insertSessionBefore(workspaceId, sessionId, beforeId) 持久化;
     after 目标 = before 目标的下一个兄弟(DOM-insertBefore 语义),末位 append */
  const onDragState = function (id, isOn) {
    if (isOn) setDrag({ id: id });
    else { setDrag(null); setOver(null); }
  };
  const onCanDrop = function (g, s) {
    return drag !== null && g && g.ws && drag.id !== s.id;
  };
  const onDropCommit = function (g, s) {
    if (drag === null || !g || !g.ws || drag.id === s.id) { setDrag(null); setOver(null); return; }
    const ids = g.ws.sessionIds || [];
    const ti = ids.indexOf(s.id);
    const before = over && over.id === s.id && over.pos === "before"
      ? s.id
      : (ti + 1 < ids.length ? ids[ti + 1] : undefined);
    au.moveSession(g.ws.workspaceId, drag.id, before);
    setDrag(null); setOver(null);
  };

  /* P8c · 原型形态浮动菜单(.menu/.mi/.mk/.menu-sep,fixed 定位免卡裁切) */
  const auMi = function (key, label, opts) {
    opts = opts || {};
    return h("button", { key: key, type: "button", className: "mi" + (opts.danger ? " danger" : ""), onClick: opts.onClick },
      opts.icon || null, label,
      opts.mkOn ? h("span", { className: "mk on" }, opts.mk || "✓") : (opts.mk ? h("span", { className: "mk" }, opts.mk) : null));
  };
  const auSep = function (key) { return h("div", { className: "menu-sep", key: key }); };
  const renderFmenu = function (pos, items) {
    const live = items.filter(Boolean);
    const H = 14 + live.length * 37;
    let top = pos.y;
    if (top + H > window.innerHeight - 8) top = Math.max(8, pos.anchorBottom - H - 4);
    const left = Math.min(Math.max(8, pos.x - 186), window.innerWidth - 194);
    return h("div", { className: "menu open fixed", role: "menu", style: { left: left + "px", top: top + "px" } }, live);
  };
  const menuItemsFor = function (m) {
    if (m.kind === "s") {
      const s = list.byId[m.id];
      if (!s) return null;
      return [
        auMi("ren", "重命名", { icon: Ic("edit"), mk: "F2", onClick: function () { startRename("s", s.id, auTitle(s)); } }),
        auMi("fork", "分支新会话", { icon: Ic("branch"), onClick: function () { au.fork(s.id); closeMenu(); } }),
        auSep("s1"),
        auMi("arch", "归档", { icon: Ic("folder"), danger: true, onClick: function () { au.archive(s.id); closeMenu(); } })
      ];
    }
    const g = groups.filter(function (x) { return x.key === m.id; })[0];
    if (!g) return null;
    const out = [auMi("ren", "重命名目录", { icon: Ic("edit"), onClick: function () { startRename("ws", g.key, g.label); } })];
    if (g.ws) {
      out.push(auSep("w0"));
      out.push(auMi("del", del === g.key ? "确认删除工作区?" : "删除工作区", { icon: Ic("error"), danger: true, onClick: function () { if (del === g.key) { au.deleteWorkspace(g.ws.workspaceId); closeMenu(); } else setDel(g.key); } }));
    }
    return out;
  };
  const viewMenuItems = function () {
    return [
      auMi("v-recent", "按最近活动排序", { mkOn: sort === "recent", onClick: function () { setSort("recent"); closeMenu(); } }),
      auMi("v-name", "按名称排序", { mkOn: sort === "name", onClick: function () { setSort("name"); closeMenu(); } }),
      auMi("v-manual", "手动顺序（拖拽）", { mkOn: sort === "manual", onClick: function () { setSort("manual"); closeMenu(); } }),
      auSep("v0"),
      auMi("v-flat", "平铺会话列表", { mkOn: flat, onClick: function () { setFlat(!flat); closeMenu(); } })
    ];
  };

  const renderRow = function (entry, gForMenu, inGroup) {
    const s = entry.s;
    return h(AuSessionRow, {
      key: s.id, s: s, au: au, current: current, wsLabel: entry.wsLabel || null,
      canDrag: inGroup === true && gForMenu && gForMenu.ws && results === null,
      onDragState: onDragState,
      onCanDrop: function (target) { return onCanDrop(gForMenu, target); },
      onDropMark: function (target, pos) { if (!over || over.id !== target.id || over.pos !== pos) setOver({ id: target.id, pos: pos }); },
      onDropCommit: function (target) { onDropCommit(gForMenu, target); },
      dropPos: over !== null && over.id === s.id ? over.pos : null,
      dragging: drag !== null && drag.id === s.id,
      onHover: function () { setHoverId(s.id); }, onHoverEnd: function () { setHoverId(function (p) { return p === s.id ? null : p; }); },
      onMenuOpen: function (e) { const r = e.currentTarget.getBoundingClientRect(); setMenu({ kind: "s", id: s.id, x: r.right, y: r.bottom + 4, anchorBottom: r.top }); },
      renaming: ren !== null && ren.kind === "s" && ren.id === s.id, renameValue: renVal,
      onRenameStart: function () { startRename("s", s.id, auTitle(s)); },
      onRenameValue: setRenVal, onRenameCommit: commitRename, onRenameCancel: function () { setRen(null); }
    });
  };

  const body = results !== null
    ? (results.length > 0
      ? results.map(function (entry) { return renderRow(entry, null, false); })
      : [h("div", { key: "empty", className: "au-ws-empty" }, "无匹配会话")])
    : (flat
      ? (flatAll.length > 0 ? flatAll.map(function (entry) { return renderRow(entry, null, false); }) : [h("div", { key: "empty", className: "au-ws-empty" }, "暂无会话")])
      : groups.map(function (g) {
        return h(AuGroup, {
          key: g.key, g: g, au: au, closed: closed[g.key] === true, containsCurrent: g.containsCurrent,
          menuSlot: h("button", { type: "button", className: "au-wsg-act", title: "目录操作", "aria-label": "目录操作", onClick: function (e) { e.stopPropagation(); const r = e.currentTarget.getBoundingClientRect(); setMenu({ kind: "ws", id: g.key, x: r.right, y: r.bottom + 4, anchorBottom: r.top }); } }, Ic("dots")),
          onToggle: function () { setClosed(function (c) { const n = Object.assign({}, c); if (n[g.key]) delete n[g.key]; else n[g.key] = true; return n; }); },
          renaming: ren !== null && ren.kind === "ws" && ren.id === g.key, renameValue: renVal,
          onRenameStart: function () { startRename("ws", g.key, g.label); },
          onRenameValue: setRenVal, onRenameCommit: commitRename, onRenameCancel: function () { setRen(null); }
        }, g.sessions.map(function (s) { return renderRow({ s: s, wsLabel: null }, g, true); }));
      }));

  return h("div", { className: "au-ws au-ws-wide" },
    h("div", { className: "au-ws-head" + (searchOpen ? " au-searching" : "") },
      h("span", { className: "au-ws-label" }, "工作区"),
      h("div", { className: "au-ws-search" + (searchOpen ? " au-open" : "") + (q !== "" ? " au-hasq" : "") },
        h("button", { type: "button", className: "au-ws-sbtn", title: "搜索会话", "aria-label": "搜索会话", onClick: function () { if (searchOpen && q === "") setSearchOpen(false); else setSearchOpen(true); } }, Ic("search")),
        h("input", { ref: inputRef, className: "au-ws-input", value: query, placeholder: "搜索会话…", type: "text", autoComplete: "off", onChange: function (e) { setQuery(e.target.value); }, onKeyDown: function (e) { if (e.key === "Escape") { setQuery(""); setSearchOpen(false); } if (e.key === "Enter" && results !== null && results.length > 0) au.open(results[0].s.id); } })),
      h("div", { className: "au-ws-acts" },
        h("button", { type: "button", className: "au-ws-ibtn" + (flat ? " au-on" : ""), title: "视图选项", "aria-label": "视图选项", onClick: function (e) { const r = e.currentTarget.getBoundingClientRect(); setHeadMenu({ x: r.right, y: r.bottom + 4, anchorBottom: r.top }); } }, Ic("view")),
        h("button", { type: "button", className: "au-ws-ibtn", title: "添加工作区", "aria-label": "添加工作区", onClick: function () { setAddOpen(!addOpen); } }, Ic("folderplus")))),
    addOpen ? h("div", { className: "au-ws-addrow" }, Ic("folder"),
      h("input", { value: addPath, placeholder: "输入路径，如 ~/repos/项目名", type: "text", spellCheck: false, autoComplete: "off", autoFocus: true, onChange: function (e) { setAddPath(e.target.value); }, onKeyDown: function (e) { if (e.key === "Enter") { e.preventDefault(); commitAdd(); } if (e.key === "Escape") { setAddOpen(false); setAddPath(""); } } }),
      h("span", { className: "au-ws-addhint" }, "↵ 添加 · Esc 取消")) : null,
    h("div", { className: "au-ws-body" }, body),
    menu !== null ? renderFmenu(menu, menuItemsFor(menu)) : null,
    headMenu !== null ? renderFmenu(headMenu, viewMenuItems()) : null);
}

function AuBrowser(props) {
  const wide = props.wide !== false;
  const au = props.au;
  if (!wide) return h(AuBrowserRail, props);
  if (typeof props.useSessions !== "function" || typeof props.useWorkspaces !== "function") {
    return h("div", { className: "au-ws-empty" }, "…");
  }
  return h(AuBrowserWide, { useSessions: props.useSessions, useWorkspaces: props.useWorkspaces, au: au });
}

/* ═══ P8c · 折叠细条(原型 .sb-rail):logo 悬停「鲸鱼⇄展开面板」交叉淡切,点击展开;
   新建(金 tint,当前工作区)/搜索(展开后 300ms 聚焦搜索框,经 window.__auFocusSearch
   与 wide 组件握手);底部设置/主题钮是官方壳(CSS1 已收为 40px 方钮)。═══ */
function AuBrowserRail(props) {
  const au = props.au;
  const expand = typeof props.expandSidebar === "function" ? props.expandSidebar : function () {};
  const wsState = typeof props.useWorkspaces === "function" ? props.useWorkspaces(function (s) { return s; }) : null;
  const list = typeof props.useSessions === "function" ? props.useSessions(function (s) { return s; }) : null;
  const current = list ? list.current : null;
  const items = (wsState && wsState.items) || [];
  let curWsId;
  for (let i = 0; i < items.length; i++) {
    if ((items[i].sessionIds || []).indexOf(current) !== -1) { curWsId = items[i].workspaceId; break; }
  }
  return h("div", { className: "au-ws-rail" },
    h("button", { type: "button", className: "rail-logo", title: "展开侧栏", "aria-label": "展开侧栏", onClick: function () { expand(); } },
      h("svg", { className: "rl-whale", viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true" }, h("path", { d: AU_WHALE_PATH })),
      h("svg", { className: "rl-panel", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" },
        h("rect", { x: 3, y: 4, width: 18, height: 16, rx: 3 }), h("path", { d: "M9.5 4v16" }), h("path", { d: "M13 12h4.5" }), h("path", { d: "m15.5 9.5 2.5 2.5-2.5 2.5" }))),
    h("button", { type: "button", className: "rail-btn rail-new", title: "新建会话", "aria-label": "新建会话", onClick: function () { au.startSession(curWsId); } },
      h("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", "aria-hidden": "true" }, h("path", { d: "M12 5v14M5 12h14" }))),
    h("button", { type: "button", className: "rail-btn", title: "搜索会话", "aria-label": "搜索会话", onClick: function () { window.__auFocusSearch = true; expand(); } }, Ic("search")),
    h("div", { className: "rail-flex" }));
}

function AuImg(props) {
  const att = props.attachment;
  const load = props.loadImage;
  const st = React.useState(null);
  React.useEffect(function () {
    let live = true;
    if (typeof load === "function" && att) {
      Promise.resolve(load(att)).then(function (u) { if (live && u) st[1](u); }).catch(function () {});
    }
    return function () { live = false; };
  }, [att, load]);
  return st[0] ? h("img", { className: "au-img", src: st[0], alt: "" }) : null;
}
function AuUserBubble(props) {
  const node = props.node || {};
  const data = node.data || node;
  const content = data.content || [];
  const texts = [], imgs = [];
  for (let i = 0; i < content.length; i++) {
    const c = content[i];
    if (c && c.type === "text" && typeof c.text === "string") texts.push(c.text);
    else if (c && c.type === "image" && c.attachment) imgs.push(c.attachment);
  }
  if (texts.length === 0 && imgs.length === 0) return null;
  return h("div", { className: "au-user-row" }, h("div", { className: "au-bubble" },
    texts.length ? h("div", null, texts.join("\n\n")) : null,
    imgs.map(function (a, i) { return h(AuImg, { key: i, attachment: a, loadImage: props.loadImage }); })));
}
function AuContext(props) {
  const node = props.node || {};
  const data = node.data || node;
  const txt = auText(data.content);
  if (!txt) return null;
  return h("div", { className: "au-ctx-row" }, "◈ " + txt);
}

/* ═══ P9 · 会话流尾部节点(htm + 原型类名,恒等映射)═══
   数据契约(逆向自官方 register-node-renderers):
   - turn-tail:      node.data = { turn, seq, closing:{finalNode:{seq,messageId},blocks,time}|null,
                                 ttftMs, tokensPerSecond, branchUnavailable }
                     node.location.turn = { status, start:{time}, end:{time} }
   - compaction:     node.data = { summary:string|null, shadowedItemCount, shadowedTokenCount }
   - model-retry:    node.data = { current:{ retryState, delayMs, retry, maxRetries, mode,
                                 failure:{message}, seq } }
   - turn-error:     node.data = { message, code? }
   - turn-max-tokens: 无 data(固定提示文案) */

function auBlocksText(blocks) {
  let out = "";
  if (Array.isArray(blocks)) {
    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      if (b && b.kind === "text" && typeof b.text === "string") out += b.text;
    }
  }
  return out;
}

function AuTurnTail(props) {
  const node = props.node || {};
  const data = node.data || {};
  const turn = node.location && (node.location.kind === "turn" || node.location.kind === "step") ? node.location.turn : null;
  if (!turn) return null;
  const closing = data.closing;
  const chain = typeof props.renderSlotChain === "function"
    ? props.renderSlotChain("conversation.chat.turnTail", { turn: turn, seq: closing && closing.finalNode ? closing.finalNode.seq : data.seq, openFile: props.openFile })
    : null;
  if (!closing) return chain || null;
  const runMs = turn.start !== undefined && turn.end !== undefined ? Math.max(0, turn.end.time - turn.start.time) : null;
  const parts = [];
  if (runMs != null) parts.push((runMs / 1000).toFixed(1) + "s");
  if (data.ttftMs != null) parts.push("首 token " + (data.ttftMs / 1000).toFixed(1) + "s");
  if (data.tokensPerSecond != null) parts.push(Math.round(data.tokensPerSecond) + " tok/s");
  const copy = function (e) {
    e.stopPropagation();
    const txt = auBlocksText(closing.blocks);
    if (navigator.clipboard && txt) { navigator.clipboard.writeText(txt).catch(function () {}); }
  };
  const branch = function (e) {
    e.stopPropagation();
    if (typeof props.forkAt === "function") props.forkAt(closing.finalNode.seq);
  };
  const extra = closing.finalNode && closing.finalNode.messageId !== undefined && typeof props.renderSlot === "function"
    ? props.renderSlot("conversation.chat.assistant-actions", { messageId: closing.finalNode.messageId })
    : null;
  return html`<${React.Fragment}>
    ${chain}
    <div className="a-actions">
      <button type="button" className="ibtn" title="复制全文" onClick=${copy}>${Ic("copy")}</button>
      <button type="button" className="ibtn" title="从此处分支" disabled=${data.branchUnavailable ? true : undefined} onClick=${branch}>${Ic("branch")}</button>
      ${extra}
    </div>
    <div className="turn-tail">
      <span className="ln"></span>
      <span className="tx">${parts.join(" · ")}</span>
      <span className="ln"></span>
    </div>
  <//>`;
}

function AuCompress(props) {
  const node = (props.node && props.node.data) || {};
  const st = React.useState(false);
  const open = st[0], setOpen = st[1];
  const n = node.shadowedItemCount;
  const tk = node.shadowedTokenCount;
  const items = n != null ? " · 更早的 " + n + " 条消息已归档" : "";
  const tok = tk != null ? (tk >= 1000 ? " −" + (tk / 1000).toFixed(1) + "k tokens" : " −" + tk + " tokens") : "";
  const expandable = typeof node.summary === "string" && node.summary !== "";
  return html`<div className=${"compress" + (open ? " open" : "")}>
    <button type="button" className="compress-head" onClick=${function () { setOpen(!open); }}>
      <span className="chev">${Ic("chevron")}</span>
      <span>◈ 上下文已压缩${items}${tok ? html`<span className="in-tok">${tok}</span>` : null}</span>
    </button>
    ${open && expandable ? html`<div className="compress-body">${node.summary}</div>` : null}
  </div>`;
}

function AuRetry(props) {
  const data = (props.node && props.node.data) || {};
  const c = data.current || {};
  const active = c.retryState === "scheduled";
  const st = React.useState(function () { return Math.max(1, Math.round((c.delayMs || 0) / 1000)); });
  const secs = st[0], setSecs = st[1];
  React.useEffect(function () {
    if (!active) return;
    const iv = window.setInterval(function () { setSecs(function (s) { return s > 1 ? s - 1 : 1; }); }, 1000);
    return function () { window.clearInterval(iv); };
  }, [active]);
  let text;
  if (active) text = html`<span>自动重试 · 第 ${c.retry} 次 · ${secs}s 后</span>`;
  else if (c.retryState === "started") text = html`<span>重试中 · 第 ${c.retry} 次</span>`;
  else if (c.retryState === "cancelled") text = html`<span>自动重试 · 已取消</span>`;
  else text = html`<span>自动重试 · 第 ${c.retry} 次 <b>完成</b></span>`;
  const tip = c.failure && c.failure.message ? "延迟 " + Math.round(c.delayMs || 0) + "ms · " + c.failure.message : "";
  return html`<div className="row-retry" title=${tip}>${Ic("retry")}${text}</div>`;
}

function AuTurnError(props) {
  const d = (props.node && props.node.data) || {};
  const msg = (d.message || "") + (d.code !== undefined ? " (" + d.code + ")" : "");
  return html`<div className="row-err" role="status">
    ${Ic("error")}
    <span>${msg}</span>
    <span className="pill err">失败</span>
  </div>`;
}

function AuTurnMaxTokens() {
  return html`<div className="row-err" role="status">
    ${Ic("error")}
    <span>输出已达 token 上限 · 本回合在上限处截断</span>
    <span className="pill warn">上限</span>
  </div>`;
}

/* ═══ P10 · AuTodoBar(原型 §6 .dock .todo-bar 恒等映射)═══
   遮蔽官方 TodoDock(conversation.input.dock, id=todo):官方仅文本进度
   「n 完成 · n 进行」+折叠列表;原型是「清单 n/m + goal-track 金→玫进度条 +
   todo-items 胶囊(done 删除线 / now 金 tint 脉冲点)」。数据同源 useProjection
   ("todos");空清单渲染 null(与官方一致)。data-testid 沿用官方 todo-panel,
   保下游测试语义。 */
function AuTodoBar(props) {
  const useProjection = props.useProjection;
  const todos = (useProjection ? useProjection("todos") : null) || [];
  if (todos.length === 0) return null;
  var done = 0;
  for (var i = 0; i < todos.length; i++) if (todos[i].status === "completed") done++;
  var pct = Math.round((done / todos.length) * 100);
  return html`<div className="todo-bar" data-testid="todo-panel">
    <span className="todo-label">清单</span>
    <span className="todo-label">${done} / ${todos.length}</span>
    <div className="goal-track"><div className="goal-fill" style=${{ width: pct + "%" }}></div></div>
    <div className="todo-items">
      ${todos.map(function (it, i) {
        var cls = "todo-it" + (it.status === "completed" ? " done" : it.status === "in_progress" ? " now" : "");
        return html`<span key=${i} className=${cls}><span className="td"></span>${it.content}</span>`;
      })}
    </div>
  </div>`;
}

return {
  inject: ["theme", "slots", "sessions", "workspaces"],
  apply: function (ctx) {
    const theme = ctx.theme;
    const slots = ctx.slots;

    const disposeDark = theme.register(AURUM_DARK);
    const disposeLight = theme.register(AURUM_LIGHT);
    let disposeCss = null;
    if (typeof document !== "undefined") {
      const tagId = "dsh-theme-aurum/aurum.css";
      let tag = document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]");
      if (tag === null) {
        tag = document.createElement("style");
        tag.dataset.plugin = "dsh-theme-aurum";
        tag.dataset.pluginCss = tagId;
        tag.textContent = CSS;
        document.head.appendChild(tag);
      }
      const tagRef = tag;
      disposeCss = function () { if (tagRef && tagRef.parentNode) tagRef.parentNode.removeChild(tagRef); };
    }

    const listeners = new Set();
    let activeId = "", mode = "dark";
    function readSnapshot() {
      const snap = theme.getTheme();
      activeId = String(snap.active.id);
      mode = snap.active.colorScheme === "light" ? "light" : "dark";
    }
    readSnapshot();
    const stopListen = ctx.on("theme/change", function (snapshot) {
      const nextId = String(snapshot.active.id);
      const nextMode = snapshot.active.colorScheme === "light" ? "light" : "dark";
      if (nextId !== activeId || nextMode !== mode) {
        activeId = nextId; mode = nextMode;
        for (const fn of listeners) fn();
      }
    });

    const api = {
      snapshot: function () { return { id: activeId, mode: mode }; },
      subscribe: function (fn) { listeners.add(fn); return function () { listeners.delete(fn); }; },
      select: function (id) { try { theme.setTheme(id); } catch (err) { console.error("aurum: setTheme failed", id, err); } },
      toggle: function () {
        const isAurum = activeId === "aurum-dark" || activeId === "aurum-light";
        if (isAurum) api.select(mode === "dark" ? "aurum-light" : "aurum-dark");
        else api.select(mode === "dark" ? "aurum-dark" : "aurum-light");
      }
    };

    if (activeId !== "aurum-dark" && activeId !== "aurum-light") {
      /* 实测:apply 期 setTheme 会被启动后期的主题初始化盖回官方 —— 0ms/1.2s 两次
         延迟重断言(一次性;用户此后手动切官方不再争夺) */
      const assertAurum = function () {
        try {
          const cur = theme.getTheme();
          const cid = String(cur.active.id);
          if (cid !== "aurum-dark" && cid !== "aurum-light") theme.setTheme(cur.active.colorScheme === "light" ? "aurum-light" : "aurum-dark");
        } catch (err) { console.error("aurum: activate failed", err); }
      };
      assertAurum();
      setTimeout(assertAurum, 0);
      setTimeout(assertAurum, 1200);
    }

    slots.inject("sidebar.footer.action", function () {
      return slots.register({ name: "sidebar.footer.action", id: "theme-aurum", order: 40, label: "鎏金主题" }, function () { return h(AurumFootToggle, { api: api }); });
    });
    slots.inject("settings.general.item", function () {
      return slots.register({ name: "settings.general.item", id: "theme-aurum", order: 15, label: "主题风格 · 鎏金" }, function () { return h(AurumSettingsRow, { api: api }); });
    });

    const sessionsSvc = ctx.sessions;
    const workspacesSvc = ctx.workspaces;
    const auActions = {
      open: function (sessionId) { try { sessionsSvc.open(sessionId); } catch (e) { console.error("aurum: open failed", e); } },
      startSession: function (workspaceId) { try { workspacesSvc.startSession(workspaceId); } catch (e) { console.error("aurum: startSession failed", e); } },
      renameSession: function (sessionId, title) {
        try {
          const b = sessionsSvc.binding(sessionId);
          if (b && b.session && typeof b.session.rename === "function") {
            Promise.resolve(b.session.rename(title)).then(function (r) { if (r && r.ok === false) console.error("aurum: rename rejected"); }).catch(function (e) { console.error("aurum: rename failed", e); });
          }
        } catch (e) { console.error("aurum: renameSession failed", e); }
      },
      fork: function (sessionId) {
        try {
          sessionsSvc.fork({ sessionId: sessionId, increaseTitle: true }).then(function (childId) { sessionsSvc.open(childId); }).catch(function (e) { console.error("aurum: fork failed", e); });
        } catch (e) { console.error("aurum: fork failed", e); }
      },
      archive: function (sessionId) { Promise.resolve(workspacesSvc.archiveSession(sessionId)).catch(function (e) { console.error("aurum: archive failed", e); }); },
      moveSession: function (workspaceId, sessionId, beforeSessionId) {
        Promise.resolve(workspacesSvc.insertSessionBefore(workspaceId, sessionId, beforeSessionId)).catch(function (e) { console.error("aurum: moveSession failed", e); });
      },
      createWorkspace: function (path) { return workspacesSvc.create({ path: path }); },
      renameWorkspace: function (workspaceId, title) { return workspacesSvc.rename(workspaceId, title); },
      deleteWorkspace: function (workspaceId) { return workspacesSvc.delete(workspaceId); }
    };

    slots.inject("sidebar.workspaces", function () {
      return slots.register({ name: "sidebar.workspaces", priority: -1, registrant: "aurum" }, function (props) {
        const p = Object.assign({}, props);
        p.au = auActions;
        return h(AuBrowser, p);
      });
    });

    slots.inject("conversation.chat.node", function () {
      const disps = [];
      const reg = function (key, comp) {
        disps.push(slots.register({ name: "conversation.chat.node", key: key, priority: -1, registrant: "aurum" }, function (props) { return h(comp, props); }));
      };
      reg("user", AuUserBubble);
      reg("steering", AuUserBubble);
      reg("context", AuContext);
      reg("compaction", AuCompress);
      reg("model-retry", AuRetry);
      reg("turn-error", AuTurnError);
      reg("turn-max-tokens", AuTurnMaxTokens);
      /* P11:遮蔽整棵工具树 —— 未知工具兜底卡 + tool-kids 子调用;
         官方 tool-call 注册保留(priority:-1 遮蔽,停插件即还原) */
      reg("tool-call", AuToolCallTree);
      /* turn-tail 永远普通注册:children 槽位声明存在加载顺序竞态 —— 若本插件先注册,
         官方 conversation 包的同名声明会 throw 并炸掉官方 turn-tail(及后续 unknown)注册
         (2026-08-24 实测复现)。官方声明保留权威;本组件按 props 有无防御性调用 chain/actions */
      reg("turn-tail", AuTurnTail);
      return function () { for (let i = 0; i < disps.length; i++) disps[i](); };
    });

    const TOOL_KEYS = ["grep", "read", "edit", "write", "todo_write", "web_search", "web_fetch", "pwsh", "bash"];
    slots.inject("tool.call.toolview", function () {
      const disps = TOOL_KEYS.map(function (key) {
        return slots.register({ name: "tool.call.toolview", key: key, priority: -1, registrant: "aurum" }, function (props) { return h(AuToolCard, props); });
      });
      return function () { for (let i = 0; i < disps.length; i++) disps[i](); };
    });

    /* P10:遮蔽官方 TodoDock(id=todo)—— 同 id 注册替换,order 0 保位
       (input.dock 在输入卡上方,goal/queue 条之前);inject 等 children 声明就绪 */
    slots.inject("conversation.input.dock", function () {
      return slots.register({ name: "conversation.input.dock", id: "todo", order: 0, priority: -1, registrant: "aurum" }, function (props) { return h(AuTodoBar, props); });
    });

    ctx.effect(function () {
      return function () {
        try { if (typeof stopListen === "function") stopListen(); } catch (e) {}
        try { if (typeof disposeCss === "function") disposeCss(); } catch (e) {}
        try { if (typeof disposeDark === "function") disposeDark(); } catch (e) {}
        try { if (typeof disposeLight === "function") disposeLight(); } catch (e) {}
      };
    }, "aurum disposers");
  }
};
	}
});