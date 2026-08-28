/**
 * dsh-theme-aurum — 鎏金主题 browser half (loader-format bundle, zero build)。
 * 由 dsh-agent-workspace.html 原型移植:oklch 金粉配色 + 点阵画布 + 浮动卡片侧栏 +
 * 左侧历史会话栏整体重写(目录头/分组折叠/会话状态槽/行内操作/搜索/平铺) +
 * 用户气泡/上下文节点/9 类工具卡片接管。主题经 theme.overrideTokens 常驻层接入
 * (P23 起与官方「设置·外观」preference 通道兼容;此前为注册 aurum-dark/light 双主题)。
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
		/* ── P15 前修订 VI:图标一律 DSH 官方原版 ──
		   官方插件同款通道 require("@deepseek-ai/dsh-client-ui-primitives") 直接拿
		   React 图标组件(与官方 ToolRow VARIANT_ICONS 同表);失败(模块不可用)回退
		   自绘保底。映射(figma 官方):read=Browse、write/edit=Edit、search=Search、
		   bash=Api、todo=Checklist、web=Globe、others 兜底=Sparkle(官方兜底即
		   四角星,与用户指定形态一致)、folder=FolderClose/Open、ask=Question */
		let AU_PI = null;
		try { AU_PI = require("@deepseek-ai/dsh-client-ui-primitives"); } catch (e) { AU_PI = null; }
		const AU_ICON_OFFICIAL = {
			folder: "IconFolderClose16", folderopen: "IconFolderOpen16",
			search: "IconSearchOutline16", read: "IconBrowseOutline16", edit: "IconEditOutline16",
			todo: "IconChecklistOutline14", globe: "IconGlobeOutline14", terminal: "IconApiOutline14",
			stars: "IconSparkle16",
			chevdown: "IconChevronDownOutline14", plus: "IconPlusOutline16", think: "IconThinkOutline14", compact: "IconApiOutline14"
		};
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
    todo-it 10.5px。360-1920 全档零横向滚动(输入卡/清单条零溢出)。

    ── P15 前修订 · 品牌字标 + header tabs(2026-08-24,用户报两处)─────
    1. 字标 squish/错位(取证:brandName 计算出 flex:1 1 0%、h38、内容 +10px 偏移,
       官方样式表并无这些)—— 根因是 P6 老规则用裸 [class*=brand] 子串,同时命中
       brandIdentity/brandMark/brandName 三个官方子 span:flex:1 使鲸鱼格与字标格
       平分生长(鲸鱼后拖空隙、字标被推到按钮右缘)、padding 0 10px 平添偏移、
       height 38 覆写官方 24。铁律 6(标签限定)第二次翻车实录。
       修正:收紧到 button[class*=brand];字标 svg 按原型 .sb-brand 锚点
       flex:none 定内在尺寸 156×24 永不收缩,窄卡由按钮 overflow:hidden 裁尾,
       <236px 卡宽容器查询整体隐藏只留鲸鱼。中途试过槽位遮蔽渲染文字字标
       (用户否决:clip 出「DeepSeek 1」半字母)与 flex:1 弹性链(不生效),已撤。
       实测:鲸鱼距按钮左 10(pad)、间隔 8、字标 0 偏移满尺寸 156×24、
       name 高回 24、中档(260 列)裁尾、窄档(240 列)隐藏。
    2. tabs 与右上槽位左右排布:header 改两列 grid + titleRow display:contents
       —— 行1=crumbs+headerActions,行2=[tabs …… utilities] 同行
       (实测 sameRow、tabs 在左、gap 34)。此前 tabs 行与 utilities 上下堆叠。
    回归:gate 三态零溢出(此前展开态 4 个 SVG 溢出清零)/p8b/p8c/proto-diff 全绿。

    ── P15 前修订 II · 设置面板(2026-08-24,用户报两处)──────────
    1. 「主题风格 · 鎏金」段整体删除(用户决策,不需要在设置里切主题):
       settings.general.item 注册、AurumSettingsRow/SEGMENT 组件、aurum-row/
       aurum-seg/aurum-segBtn/aurum-hint CSS 全撤;主题切换保留侧栏底部
       aurum-footRow 单一入口。
    2. 关闭叉 28×28 归位:根因 = 铁律 6 第三次翻车 —— 旧规则
       [data-slot=sidebar] [class*=settingsArea] button 泛匹配;设置弹窗 DOM
       渲染在 sidebar.settings 槽内(所以 body 层扫描找不到它),settingsArea
       是其祖先 → 弹窗内所有 button(close/navCell/actions)全被拉成
       width:100%×height:38(叉官方 28×28 → 实测 498×38,横贯顶部)。
       收紧到 button.VOzbGW_trigger(真正的目标:侧栏设置触发行)。
       实测:close 28×28 距右 15/顶 21、navCell 171×38、动作钮 94×28、
       aurumRow=false;回归 p13/gate/p8b/p8c/proto-diff 全绿。

    ── P15 前修订 III · 侧栏阴影渐变(2026-08-24,用户报「假半透明底板」)──
    用户看到的「对话界面左侧半透明底板」实为:侧栏卡阴影被官方
    .pI_x6G_sidebarCol{overflow:hidden} 裁切 —— 卡右缘 276 → 列界 280,
    44px 柔影只剩 4px 可见窗口,硬切出一条竖线。主区 DOM 链逐层取证全透明,
    并无遮挡层;唯一裁切源就是列容器。修:sidebarCol overflow:visible
    (卡片自身 overflow:hidden 管内容,列级放开无溢出源)+ 阴影调长调柔
    (深 16/48/.55 → 18/56/.45,浅 16/44/.18 → 18/52/.16)。
    实测(shadowscan.mjs 像素扫描 y=420):列界跳变 278→282 仅 2(light)/
    1(dark)/255,渐变形态 = 卡面色 → 阴影谷 → 缓升回画布;残留粗粞点全部
    落在 24px 等距位 = 点阵圆点,非阴影缺陷;vision 复核无分割线、点阵连续;
    回归 gate(三态零溢出)/p8b/p8c/proto-diff 全绿。

    ── P15 前修订 IV · 目录分组交互动画(2026-08-24,用户报三处)────────
    1. 图标重叠根因:交叉淡切规则(au-chev2/au-fld)从未生效 —— Ic() 不挂类,
       两个 svg 同时常显叠在同一 13×13 格。修:Ic(kind, cls) 支持类名。
    2. 交互形态(用户指定):非悬浮=文件夹(closed folder/open folderopen),
       悬浮=折叠三角(closed 指右 -90°/open 指下);opacity+scale 双轴交叉淡切
       (.18s/.26s back-out)。
    3. 收合非线性动画:.au-slist 改 grid-template-rows 0fr⇄1fr 插值
       (.42s cubic-bezier(.22,.9,.26,1)),内容层 .au-slist-in 渐隐渐显 +
       visibility 延迟摘除可达;children 不再随 closed 卸载(保挂载供过渡)。
    4. 行级 stagger:.au-srow animation-name 随 .au-closed 切换(closed=none →
       展开=au-row-in),纯 CSS 实现每次展开逐行重播(30ms 级递增 delay,
       前 6 行 20ms 步进、n+7 封顶 200ms),fade+左移入场。
    实测(verify-group.js):idle fld=1/chev=0、hover fld=0(.72 缩)+chev=1 交叉;
    收合插值中 12.5px → 终态 0px+渐隐+visibility hidden;重展开行
    animName=au-row-in delay=.02s 重播、终态 180px;行点击可用;
    回归 gate/p8b/p8c/proto-diff 全绿。

    ── P15 前修订 V · 主区 header 重造 + 主题文案(2026-08-24,用户报五处)──
    0. 主题切换按钮文案去「鎏金」(用户指定):显示「深色主题/浅色主题」,
       title「切换到浅色主题/切换到深色主题」。
    1-3. header 按原型 .sh-head 方案重造(取代此前两列 grid 布局):
       absolute 浮头(z30,高 70,不占文档流)—— 消息从纱下滚过渐隐,
       不再被文档流实底块硬截断;渐变纱 = 底色 92% → 透明 52%(原型形态);
       scroll 区 padding-top 86 让位;单行 flex:标题/tabs/actions 同一水平线。
       同轴实测:字标中心 47 ≡ 标题中心 47(delta 0,padding-top 24 校准)。
    4. tab 选中横杠移除:官方 :after 2px 底线 display:none,选中仅以
       胶囊金底呈现(放大截图复核无独立线条)。
    回归:gate(三态)/p8b/p8c/proto-diff/p10 全绿。

    ── P15 前修订 VI · 图标全量官方化(2026-08-24,用户指定)──────────
    通道:factory 内 require("@deepseek-ai/dsh-client-ui-primitives")(官方插件
    同款),Ic(kind) 优先渲染官方 React 图标组件,模块不可用才回退自绘。
    映射 = 官方 ToolRow VARIANT_ICONS 同表:read=Browse16、write/edit=Edit16、
    search/grep=Search16、bash·pwsh=Api14、todo=Checklist14、web=Globe14、
    兜底=Sparkle16(官方兜底即四角星,与用户此前指定形态一致,自绘 stars 淘汰)、
    folder=FolderClose16/FolderOpen16(分组头)、ask=Question14;连带 plus/chevdown
    也换官方。渲染尺寸仍由既有 CSS 控制(css 覆盖 size 属性,viewBox 不失真),
    交叉淡切类挂外包 span、stroke=currentColor 沿色链。
    实测(verify-icons.js viewBox 普查):分组头 fld=16/chev2=14;工具卡
    read16/grep16/pwsh14/edit16/write16/glob=Sparkle16/mcp=Sparkle16 全官方;
    残留自绘仅 au-ws-ibtn 的 view/folderplus(自建功能钮,官方无对应原语,保留)。
    回归 gate/p8c/proto-diff 全绿。

    ── P15 前修订 VII · header 渐变纱 → mask 渐隐(2026-08-24,用户指定)──────
    目的:header 背景全透明(字面 background:none)。渐隐职责转移:
    滚动区加 mask-image(180deg,transparent 0 → #000 70px),内容滚入顶部
    70px 真透明,透出 body 点阵画布 —— 视觉与原渐变纱同效,但遮罩挂在内容侧
    而非 header 侧;窄屏两行头档(≤820px)mask 延至 100px(padding-top:130)。
    连带考古:官方 DOM 已升级,滚动区 Md3f7G_scroll → wSkVaW_scrollBody
    (root 直接子级,y=0 全高),旧让位链 wSkVaW_viewArea padding-top +
    Md3f7G_root 负 margin(主档 86/窄屏 130)选择器全空挂,本次一并改靶/删除。
    纯 CSS,双主题自动兼容(透出各自画布)。
    修订 VIII(2026-08-26,用户指定):底部同款渐隐且更宽 —— 顶 70 / 底 120
    (窄屏 100/150),双 mask linear-gradient + mask-composite:intersect。
    修订 VIIIb(同日,用户报「输入坞底部小字看不清」):双向 mask 弃 —— 会话态
    composerSeat 为 sticky 贴视口底(y≈593,h≈127),底部 mask 连座位小字一并
    渐隐且 mask 无法子级豁免。改由座位 ::before 渐变纱(transparent→底色,
    座位顶上方 120px/窄屏 150px,z-index:-1 在内容背后)承担底部渐隐:消息
    穿行被纱吞、座位小字全清晰;仅 [data-phase=active] 启用(空态 hero 不染),
    scrollBody mask 回归仅顶部。
    修订 IX(同日,用户报「底部渐影与侧栏卡阴影打架」):frame 绘制序 sidebarCol
    在 centerCol 之前,渐影纱把侧栏卡 44px 阴影右尾盖掉。sidebarCol 提
    z-index:15(position:relative)—— 卡与阴影压到渐影纱之上;官方
    overlayLayer(z20)弹层仍在更上层,resize 手柄(z2)在卡外不被遮。
    修订 X(同日,用户报「渐隐带盖掉背景点阵」+「再窄一点」):纱宽 120→80
    (窄屏 150→100);纱涂底色连 body 点阵一起盖没 → composerSeat::after 在纱上
    重铺同款点阵(radial 1px/24px,background-attachment:fixed 对齐视口坐标,
    与 body 画布逐点重合),视觉=点阵穿透渐隐带、只有消息流被渐隐。
    修订 XI(2026-08-27,用户指定):浅色主题背景明度下调 2% —— bg 家族整体
    平移(bg 96.5→94.5 / bg-deep 94.5→92.5 / rail-1 94.5→92.5 / rail-2
    96.5→94.5 / surface 98.5→96.5),保持卡片(略深于画布)与浮面(高于画布)
    的相对阶梯不变;底部渐隐纱色随 var(--bg) 自动跟随。
    修订 XII(2026-08-27 同日续,用户指定):底部渐隐纱再矮一档 —— 纱高
    80→56(窄屏 100→70),座位 ::before 渐变纱与 ::after 点阵补层同步改高;
    顶纱 70/100 不动。纯数值调整,双主题纱色随 var(--bg) 自动跟随。
    修订 XIII(2026-08-27 同日续,用户指定):底部渐隐收口下沉到整页最底边 ——
    纱不再外凸到座位顶上方(原 +56/+70px 独立空档撤除),高度收敛为座位自身
    100%,渐变 transparent→底色铺满整座、恰在视口底边(= 输入坞底)完全收口;
    座位上方不再有可见渐隐带,消息保持可见直到滑入半透明输入坞之下;::after
    点阵补层同步收敛;窄屏不再单独覆写(height:100% 随座位高度自适应,原窄屏两条冗余覆写删除)。
    修订 XIV(2026-08-27 同日续,用户指定):渐隐带再升高 —— 纱顶从座位顶再上探
    50% 座位高(height:100% → calc(100% + 50%),::before/::after 同步),渐变仍
    transparent→底色 0→100% 拉满、恰在视口底边收口;视觉 = 座位上方半座高开始
    渐隐 + 整个输入坞内继续,到底边完全隐没。窄屏随座位高度自适应无需覆写。
     修订 XV(2026-08-28,用户指定):顶部渐隐带加倍 —— scrollBody mask
     transparent 0 → #000 70px 改 140px(窄屏 100→200),让位 padding-top
     86→156 / 130→230(渐隐区 + 原留白 16/30),消息初始态仍在纱下完整可见;
     浮头高 70 不变,渐隐带下探超出浮头 70px。实测(verify-topfade.js 四象限):
     wide 140/156/顶滚首内容 y172、narrow 200/230/y294,双主题一致;三门禁
     gate/p8b/proto-diff 复跑全绿(gate 折叠态 regionArea/rail 溢出为过渡
     时序噪声,改动前基线同样存在,与本改无关)。
     修订 XVI(2026-08-28 续,用户指定):顶部渐隐带回调一档 —— 110/160
     (窄屏),让位 126/190;较翻倍档收窄,仍比原始 70/100 高约六成,顶部
     完全透明区变矮。实测:wide 110/126/首内容 y171、narrow 160/190/y283,
     双主题一致;topfade 四象限 + 三门禁复跑全绿。

    ═══ P15 · 验收发版 v1.1.0(2026-08-24)═══
    全量门禁(11 脚本)终跑全绿;双主题视觉验收(浅/深整页 vision 复核)通过;
    turn-tail tx 行高 1.34 校准(对齐原型 14px 行高,proto-diff failures 归零);
    package.json inject 补 primitives(图标官方依赖显式化)、version 1.1.0、
    README 重写。历次用户修订全景见各「P15 前修订」段。

    ── P15 微调(发版后追补,2026-08-24)─────────────────────
    1. 工具卡展开/收合曲线改「两头慢中间快」(用户指定):两向统一
       cubic-bezier(.45,0,.55,1)(ease-in-out);废弃收合快出曲线与展开
       1.18 过冲回弹,内容层同步去回弹。实测两向 timing-function 一致。
    2. Markdown 表格分隔线修复(用户报网格消失):根因 = 无描边原则把
       --dsw-alias-border-* 全设 transparent,官方 md 表格 td/th 分隔线正消费
       这些 token。scoped 到 assistant-step 逐元素直写恢复:fg 12% tint 分隔线
       + 表头 surface-2 70% 底 + 1.5px 下边线。实测 tdBorder=1px 可见、
       表头底色落地、5 行表格网格完整。
    回归 gate/p11 全绿;proto-diff md li 行为内容噪声(样本行数不同,
       宽度/字号/padding 全一致),非缺陷。

    ── P15 追补 III · 三处形态统一(2026-08-24,用户报)──────────
    1. ◈ 上下文注入 = au-tool 同款卡壳(替换追补 II 悬停方案,用户嫌丑):每个
       注入节点一张紧凑卡 —— header(官方 Sparkle + 「上下文注入」+ 首行摘要 +
       chevron)点击 grid 展开/收合全文,面色/hover/chevron/曲线与工具卡全同。
    2. reasoning 折叠态 = 同款卡壳(QWLzlG_* 换皮升级):r14 + 面色同 au-tool +
       row 10 13 可点 hover + chevron 旋转;separator 隐藏;thinkBody 保持 serif
       italic;运行扫光金保留。
    3. 运行态「Deep diving」滚字 → 原型三点跳动(用户指定):turnStatus 元素 =
       点1,::before/::after = 点2/3(5px 金点,bob 1.2s,delay 0/.15/.3,原型
       .t-dots 逐字参数);shimmer 文字/渐变底清零,时钟隐藏。
    实测(verify-cards3.js,真实触发运行回合):ctx 卡×3 r14 收合 0→展开 294、
    chevron 90°;reasoning r14 pad 10 13 pointer、sep none、chevron 旋转;
    dots 5×5 au-bob 1.2s delay .15/.3 金色。md li 因去头像比原型宽 42(原型 md
    内缩于头像列)→ proto-diff 该行改 INFO_ONLY。回归 gate/p11/proto-diff 绿。

    ── P15 追补 IV · 消息流滚动缓动(2026-08-24,用户报新节点出现时跳一下)──
    取证:滚动容器 = wSkVaW_scrollBody,scroll-behavior:auto;官方每逢新消息/
    工具调用以 scrollTop 直赋瞬跳到底;叠加入场 rise 含 translateY(12px),刚到
    底的视口再被顶起一下。两层修:
    1. scroll-behavior:smooth 覆盖 —— JS 直赋也被 CSS 平滑接管(规格行为);
    2. rise 改纯淡入(去 translateY,原地展开),时长 0.6→0.42;reduced-motion
       下 smooth 回退 auto。
    实测:程序直赋 scrollTop 采样 22 帧渐进到达(加速-减速 ease,瞬跳消除);
    CSS 断言 smooth 落地、rise 仅 opacity。回归 gate/p11/proto-diff 全绿。

    ── P15 追补 V · 移动端顶栏 + 抽屉(2026-08-24,用户报手机屏侧栏占宽)──
    官方 ≤900 自动折叠为 68px 竖轨,窄屏仍占一条。改造(≤820):
    1. 布局:root grid 改两行 —— 侧栏列 = 48px 顶栏(满宽),聊天区独占全宽;
    2. 顶栏:rail 横排(鲸鱼=抽屉开关/新建/搜索)+ 右侧主题/设置(row 化,
       VOzbGW_trigger 收为内容宽胶囊);
    3. 抽屉:AuIsNarrow(matchMedia 响应)分支 AuBrowserMobile —— rail-logo 点按
       开左侧 fixed 抽屉(320px/min 86vw,r20 卡面+柔影+滑入),内嵌 AuBrowserWide
       完整浏览器(分组/拖拽/菜单全功能);搜索钮复用 __auFocusSearch 握手;
       Esc/遮罩/选中会话三种关闭;桌面(>820)行为不变。
    4. CSS 落位注记:mobile 块必须放 CSS3 末(CSS1/CSS2 里的基础 .au-ws-rail
       规则会以后到者覆盖 media 内的同特异性规则 —— 实测踩坑)。
    实测(verify-mobile.js,390×844):顶栏 390×48@0,0、rail 同行、抽屉 320×824
    63 行/7 组、closeOnSelect/Esc/Scrim 全 true、无横滚、桌面还原正常;
    vision 复核关闭态无竖侧栏/聊天满宽。回归 gate/p8c/p14 全绿。

    ── P15 追补 VII · 上下文注入卡展开无内容(2026-08-24,用户报)─────────
    根因:通用 .au-in 规则带 opacity:0 + translateY(-6px)(工具卡"展开淡入"
    设计),恢复规则只写了 .au-tool.au-open .au-in —— 追补 III 的 ◈ 上下文卡
    壳类名是 .au-ctx-card,专属规则只覆盖了 padding,漏配淡入恢复 → 展开后
    grid 高度正常撑开(实测 294px)、5979 字符全文都在 DOM,但内容永远透明。
    修复:补 .au-ctx-card.au-open .au-in{opacity:1;transform:none},淡入曲线
    与工具卡完全一致(opacity .4s .06s + transform .5s .04s ease-in-out)。
    实测:展开后 computed opacity 0→1、transform matrix(…,-6)→none,深色
    vision 复核卡内 <system-reminder> 全文清晰可见;浅色分支(移除
    data-ds-dark-theme 近似)opacity 同为 1、内容高 278px、文字对比正常 ——
    纯状态恢复规则,与主题 token 无关。回归 gate/p8b/proto-diff 全绿。
    (编号注记:VI 为窄屏 header 两行修复,见 CSS 段注释,未单列头注释段。)

    ── P15 追补 VIII · md 表格可读性重制(2026-08-25,用户报分割线看不到)──
    取证(tmp-table-debug.js 无头实测 3080):P15 微调 v1 规则全部正常命中
    (祖先链 data-chat-flow-kind=assistant-step ✓,computed border 1px solid
    oklab(fg/0.12) ✓)—— 问题纯在对比度:fg 12% tint 在深底仅提亮约 9 个
    百分点(L0.21→0.30),1px 线肉眼不可见。另测出两处次生问题:① v1 的
    tr:first-child td 误伤普通表格首行数据(首行数据格吃到表头 surface-2 底);
    ② v1 table 级 font-size:13px 恒输 —— 官方 --dsw-font-markdown-table
    (14.5px/25px serif)以 font shorthand 直落单元格,shorthand 胜继承,
    实测 td 14.5px。修复:横线 fg 22% / 竖线 fg 16% 分档,表头底线鎏金
    gold 45% 1.5px,偶数行 surface-2 45% 斑马,误伤选择器收窄为
    table>tbody:first-child>tr:first-child(仅无 thead 表首行按表头处理),
    撤无效 13px 字号。实测:td 横线 alpha 0.22 / 竖线 0.16,表头底线
    oklch 金 0.45,首行数据格无表头底色,td 字号 14.5px(token 驱动)。 */

/* ── P15 追补 IX · TODO 面板拉满整行(2026-08-25,用户报"应与输入框等宽")──
   根因:追补 VI 在 CSS3 插入 "@media (max-width:820px){"(窄屏 header 两行)
   后漏了配对 "}" —— 块一路吞到追补 V 抽屉媒体自己的 "}"(只闭合内层),外层
   被 EOF 静默闭合。被吞规则:@media 640/480 降档(嵌套语义等价,幸免)、
   P11 .kid/.tool-kids 全家、P10 .todo-bar 宽度适配、全局 reduced-motion ——
   后三者只在 ≤820 生效,桌面端全灭。表象:.todo-bar 回落原型拷贝的 flex:1,
   在 wSkVaW_composerStack(行向 flex)里拉满整行(实测 1150px vs 输入卡
   780px,左右各溢 185px),即用户报"横向占据整个容器"。
   修复:VI 的 8 条 header 规则后补 "}" 闭合(CSS 数组字符串拼接无语法检查,
   漏括号完全无声 —— 新增 verify-css-nesting.js 门禁断言 todo/kid/reduced-motion
   规则不再嵌在宽度媒体块下,防复发)。
   实测:todo-bar computed flex 1 1 0%→0 0 auto、width 1122px→748px、
   max-width none→748px、margin 0 auto;对输入卡左右各让 16px(官方 TodoDock
   lXshSW/_7yHdaG 同款面板几何,居中同族)。verify-css-nesting(断言 0 吞)、
   p10(748×185 零溢出)/p11/p14/mheader/mobile/p8b/proto-diff 回归全绿;
   gate 单跑绿;另发现并加固 gate 跑序依赖(p14 还原视口后首拍立即测量读到
   过渡中间帧 52px/r0 假阳性 → gate 起手加 800ms settle,顺序跑亦绿)。

   ── P16 · think 卡接管:运行态单行错峰入场 + 结束自动收拢(2026-08-25,用户指定)──
   需求:think 卡思考中保持折叠;内容改「每行文字错峰入场」;思考完自动收拢。
   官方 ReasoningRow 的摘要/正文都是单文本节点,纯 CSS 无法拆行做逐行入场 ——
   与 P11 工具树同法,遮蔽 conversation.chat.node key=assistant-step(priority:-1,
   官方注册保留,停插件即还原;注册补 locale:"conversation" 复用官方词条注入):
   1. AuAssistantStep/AuAssistantMarkdown 复刻官方 AssistantNodeView 逻辑:
      text 块直调官方 MarkdownText(primitives 通道)、image 块走既有 AuImg、
      unknown 走 JsonBlock(AU_PI 缺席时 pre 兜底)、tool-call 跳过(独立节点)、
      interrupted 徽章保留;根/正文容器沿用官方 Sxvs8a_*(全局样式在册,几何一致)。
   2. AuThinkCard(原型 .reasoning/.reasoning-head/.reasoning-body 类名;几何沿用
      P15 追补 III 用户指定形态 r14/pad 10 13/hover 面,偏离原型 r12/pad 8 13 属
      既定决策;margin 2px 0 沿用 P11 间距制):
      - 运行态:折叠壳内单行实时流 = latestLine,行号作 key —— 同行流式追加不重播,
        换行才 remount 重播入场(au-think-in:不透明→透明+上浮 7px+blur 2.5→0,
        .76s cubic-bezier(.22,.75,.3,1),both 填充播完保持透明 —— 行如思绪闪现
        后消散);图标金色呼吸(au-think-pulse 1.6s);官方横滚 ticker+金扫光退役;
        不随单行文本量横向滚动(长行原地裁切,起点恒左对齐);
      - 结束:running true→false 时 setOpen(false) 自动收拢(点开的也收);
        摘要 = firstLine(.r-sum ellipsis);aria-expanded/au-sr 运行中字幕;
      - reduced-motion:入场/呼吸动画全关;md 装饰/表格规则 scoped 到
        assistant-step 不受影响(md 装饰瞄的是 flowItem 祖先,遮蔽不改外层)。
   3. Ic 补 think 映射(官方 IconThinkOutline14,兜底思绪灯泡自绘);
      旧 QWLzlG_* 换皮规则原样保留(遮蔽期成死代码,零成本防御)。
   修订(2026-08-25,用户三处):① 不随单行文本量横向滚动 —— follow-end
   scrollLeft 撤除,长行原地裁切,入场动画固定同一可视位置完整可赏;
   ② 入场透明度 = 全透明→不透明(叠加已有模糊消散 blur 2.5→0;初版方向
   系口误,当日纠正);③ 时长 .38s→.76s(慢一倍)。
   修订 II(同日,用户两处):① 透明度方向纠正回全透明→不透明(上一轮说反);
   ② 思考中卡壳补「执行中」背景辉光 = 工具卡 au-tool 同款 105° 金 15% 光带 +
   au-sweep 1.9s 横扫。坑:辉光规则必须带 body:not(#aurum-boost) 前缀 ——
   [data-state=running]::after 一揽子 90° 通用覆盖含 ID 特异性,裸类规则会被
   盖成宽光带(探针实测 parity=false 后修正,与工具卡规则同款防御)。
   修订 III(同日,用户报未对齐):运行态头部行 icon/Think 与右侧实时行稳态
   错位 3.59px(r-live-wrap display:block 继承 16/28 strut,inline-block 基线
   挂 28px 行框半行距不对称)→ wrap 改 flex + align-items:center;修后五元素
   中心全等 delta 0,verify-think.js 固化 headAlign 断言。
   实测(verify-think.js,新会话真实触发思考回合):runningSeen/bodyHidden ✓、
   animName=au-think-in 0.76s(duration 760ms)✓、keyframes opacity 0→1 ✓、
   sweep=105deg + au-sweep ✓、sweepParityWithTool=true(页内离屏探针,
   think 卡 ::after 与工具卡 .au-main::after computed 逐字一致)✓、
   iconAnim=au-think-pulse ✓、lineReplay=true
   (换行后动画 currentTime 回落=key remount 重播实测)✓、maxScrollLeft=0
   (全程零横向滚动)✓、运行中可展开 ✓、
   done 后 autoCollapsed=true + .r-sum=firstLine + .r-live 移除 ✓、
   Sxvs8a 正文块在册 ✓、QWLzlG_root 全程 0(接管彻底)✓;
   回归 gate(三态零溢出)/p8b(无描边)/cards3(r14 pad10 13 button 头/双主题
   面色 light .55)/darkskin(light bg oklab .985/.55 + JetBrains Mono)/
    proto-diff(failures=0)全绿。
    ── P16 修订 VIII–IX · 结算零重播 + 流卡片统一入场与紧凑化(2026-08-25)──
    修订 VIII(用户报"输出完成后又从头重播一遍"):回合结算 streaming 翻 false,
    官方 MarkdownText 流式⇄成稿切换整树重挂载 → 级联动画整段重播。根治:级联
    规则限定 .Sxvs8a_root[data-streaming](我们渲染的根,仅流式期在册)——
    动画只属于正在生成的内容;结算/历史挂载一律静态。verify-think 门禁同步
    重构:④a 思考结束后采流式级联(think ok ≠ 正文完)、④½ 等整节点结算、
    ⑤ markdown 根带重试(换树一瞬查空,稳态必在 —— tmp-settled-dump 实测)。
    实测:streamingCascade(au-think-in/delays 单调)✓、settledStatic 8 块
    animAllNone=true + anyStreamingAttr=false(结算零重播实锤)✓。
    修订 IX(用户指定两条):① 聊天流所有卡片统一「模糊透明入场」= aurum-rise
    升级为 au-think-in 同款签名(全透明→不透明 + blur 2.5→0 消散,1.2s 同曲线),
    挂官方 flowItem 行全覆盖(用户气泡/上下文卡/工具卡/think 卡/正文/尾部);
    不带 translateY(P15 追补 IV 教训:位移顶起刚滚到底的视口);fill backwards
    —— 动画结束 filter 不残留(含 filter 元素是 fixed 后代的 containing block)。
    ② 流内间距紧凑化:flowItem margin-bottom 12→4 + 列 Md3f7G_column gap 8→4
    + .reasoning/.au-user-row 自身 margin 2→1 → 相邻卡实际缝 20→8px
    (verify-cards3 flowTight:minItemSeamPx=8)。
    事故记档(同日):一次 pwsh -replace 运算符优先级笔误把仓库 client.js 写成
    0 字节 —— 从部署副本(最后 IN-SYNC 态,实体拷贝非链接)完整恢复后重做本轮
    四处改动;教训:脚本化写盘前必须先断言替换结果非空。
    实测:flowTight(entranceAnim=aurum-rise 1.2s backwards/colGap 4/marginBottom 4/
    minSeam 8)✓;回归 gate/p8b/cards3/proto-diff/darkskin 全绿。 */
    /* ── P17 · 三卡图标瓦片对齐 + 压缩卡接管(2026-08-25,用户两报)──
       ① think 图标并入工具卡家族:.r-ico 裸图标(x=13)与 .au-ico 27x27 金瓦片
          视觉错位 —— think 头改挂 au-ico+r-ico 双类(几何/金 tint 由 .au-ico 统一
          承担,.r-ico 仅留运行态钩子);呼吸动画移到 svg(瓦片底色不闪);chev
          11→13px 对齐 au-chev;浅色补 reasoning 底色 80% 分层(深浅同构 au-tool)。
       ② 压缩卡双键接管:compaction(P9 旧 .compress 平推行退役)+ manual-compaction
          (官方此前裸奔)统一 au-tool 卡壳 —— auCompactCard 内核(瓦片/au-name/
          au-sum/胶囊/expandable 时 AuBody grid 收合 + 官方 MarkdownText 正文);
          AuCompress 摘要复刻官方 CompactionItem 口径;AuCompactCmd 复刻官方
          CompactionCommandCard 三分支(标记落地/仅 outcome/运行态辉光);双键
          locale:"conversation" 注入官方词条,auT 扩插值参数对齐 t(key,params);
          au-noexp 不可展开态去手型;Ic 补 compact 映射(官方 IconApiOutline14,
          兜底层叠菱形);旧 .compress CSS 留作死代码防御,proto-diff 撤该行。
       实测(verify-compact.js):离屏三卡 padL=13/瓦片 27x27/标题列 x=51 全等
          (allEqual);真实 /compact 本环境插件不可用→error 分支落地(err 胶囊+
          outcome 文本,语义正确),官方 gdEzaW_/_Xvjua_ 全程 0;机构探针:运行
          辉光与工具卡逐字 parity、展开 grid 1fr+opacity 恢复+chev 90°、noexp
          手型 default。回归 think/gate/p8b/cards3/proto-diff/darkskin 全绿
          (darkskin 顺带修盲切测错主题旧 bug:按起始模式定向切换,dark 55%/
          light 80% 两组实测值,量毕还原)。 */
    /* ── P18 · think 展开并入工具卡非线性收合(2026-08-25,用户问)──
       现状确认:think 卡确为独立实现(遮蔽 assistant-step,原型 .reasoning
       类名体系,不在 .au-tool 家族);其展开原为 display:none⇄block 瞬切。
       本阶段归一机构(壳仍独立):
       - .reasoning-body 改 grid 0fr⇄1fr 壳,transition 与 .au-x 逐字同参
         (展开 .5s/收合 .34s cubic-bezier(.45,0,.55,1));内包 .r-bclip
         (overflow hidden 裁切)+ .r-bin(承接原 body 全部正文样式:serif
         italic/1.9 行距/虚线顶边/pre-wrap,加 opacity+translateY 淡入,曲线
         同 .au-in:收合 .18s/.24s 快隐,展开 .4s .06s/.5s .04s);
       - reduced-motion:容器与内容层 transition none(au-tool 同款豁免);
       - P16 修订 VII 决策不变:所撤为行级文字级联(au-think-in),容器高度
         过渡与家族同款内容整体淡入不在其列。
       实测(verify-think.js):expParity=true(transition 三元组与离屏 .au-x
       逐字相等);插值中采样 h=88.5px/rows=12.19px(0fr→1fr 进行时),终态
       rows 解算 765.6px + binOpacity 1;结算收拢归 0px、autoCollapsed=true;
       Chrome 将 0fr/1fr 解算为 0px/Npx,断言按 parseFloat 口径(首跑两断言
       误按字符串 0fr 比对已修)。回归 cards3(bodyRows 0px/flowTight 8px 缝)
       /gate/p8b/proto-diff(0)/darkskin(深 55%/浅 80%)全绿。 */


     /* ── 评审扫尾 · Minor 卫生清扫(2026-08-25,双评审收口)──
        1. 铁律 6 第四次同源收尾:settingsArea 后代规则(hover/svg/折叠态
           button/span)全部收紧到 button.VOzbGW_trigger。探针实测闭合态
           settingsArea 仅含 trigger + 1 svg + 1 span(无 [role=button]),
           P15 前修订 II 只收紧了几何行,这三行泛匹配一直泄漏进设置弹窗
           (弹窗内 svg 曾被压 15px、折叠态 span 会被误隐藏);
        2. Ic() 死分支清除:target/stop/list/image/spark/question 六个兜底
           图标分支 + AU_ICON_OFFICIAL.question 映射(grep 全文件零调用点);
        3. CSS1 冗余:scrollBody scroll-behavior:smooth 连写两遍,去一;
        4. 主题激活重断言 timers 随 dispose 清理(aurumTimers 数组,停插件
           后不再于 1.2s 内 setTheme 争夺);
        5. renderFmenu 定位魔数(14+n*37 / 186 / 194)补 .mi/.menu 耦合注释。
        实测:node --check 语法过;门禁 gate(展开 264×876 / 折叠 56×876 三态
        零溢出、回展无损)/p8b(加号唯一 + 零可见边框)/css-nesting(0 吞)/
        icons(官方图标全在册,残留仅 au-ws-ibtn 两处已知自绘)/p13(设置弹窗
        802 r18、close 28×28 无损)/proto-diff(failures=0)全绿;探针复核
        收紧前后触发行逐项一致(248×38 / svg 15px tertiary / 13px/20 / r10)。 */
     /* ── P19 · 添加工作区改走系统目录选择框(2026-08-25,用户指定)──
        「添加工作区」按钮(au-ws-ibtn folderplus)不再展开手动输入行,直接调
        workspacesSvc.pickDirectory(host 原生文件夹选择框,本机 127.0.0.1+Windows
        即在用户眼前弹出)—— 选中即以绝对路径 create(选完即开),取消(null)
        静默无操作;picker 不可用(SSH/远程场景 capability 退 browse 报
        directory-picker-unavailable)或服务缺失时回退展开原有手动输入行
        (↵ 添加 / Esc 取消输入流原样保留)。
        决策注:浏览器自带 picker(showDirectoryPicker/webkitdirectory)经评估
        不可行 —— 浏览器安全沙箱不暴露所选目录的绝对路径(仅目录名),而 host
        create 需 realpath 可解析的真实绝对路径(fs.realpath 校验,相对路径按
        host 进程 cwd 解析必错位);用户确认采用系统原生选择框。 */
    /* ── P20 · 分组会话列表截断:默认前 5 + 显示全部(2026-08-25,用户报面板过长)──
       AuBrowserWide 分组视图每组默认只显前 5 行(取当前排序序 —— manual 序即
       手动置顶优先),尾部追加 .au-s-more「显示全部 N 条」钮(mono 11px
       tertiary,hover 金,focus 金环,无描边);点击展开全量、按钮转「收起」
       可切回,aria-expanded 同步;more 状态为内存态不持久化(刷新复位)。
       搜索/平铺视图走 results/flatAll 分支,天然不受截断影响。
       实测(verify-sbmore.js):dsh-theme-aurum 组 53 条 → 默认 5 行,点开
       53 行 + 按钮转「收起」,收起复位 5 行;平铺 88 行全量、0 截断钮;
       verify-gate 三态 264×876 / 56×876 零溢出无回归;深浅双色目检过
       (verify-sbmore-light.js,token 双色自适应,浅色 4.5:1 可读)。 */
     /* ── P21 · todo 清单条可折叠(2026-08-25,用户指定:聊天栏上部 TODO 清单)──
        AuTodoBar 重构:头部行(清单 n/m + goal-track 进度条 + .todo-fold 折叠
        钮)常显;todo-items 胶囊区移入 .todo-foldwrap>.todo-foldin,grid-rows
        0fr⇄1fr + 淡隐收合(与侧栏 .au-slist 同机构)。默认折叠(用户拍板),
        内存态不持久化;chevdown 收起转 -90° 指右(与分组头 chev2 同语言);
        aria-expanded 同步。空行陷阱:.todo-bar row-gap 归零 + 展开间距走
        .todo-foldwrap margin-top 过渡 —— 折叠后的空行不再吃 11px 行距
        (实测 49px→38px 精确命中 min-height)。reduced-motion 档补丁同步。
        实测(verify-todofold.js):6 项 todo 折叠 38px/胶囊区 0px/aria false,
        展开 133px/胶囊区 84px/aria true,收起复位;gate/p10/sbmore 回归
        全绿;深浅双色目检过(verify-todofold-light.js)。 */
      /* ── P22 · 非 chat view 让位浮头(2026-08-26,用户报:切 tab 后内容顶屏幕顶)──
         现象:header 已改 absolute 浮头(70px 渐变纱),但让位只做在 chat 的
         Md3f7G_scroll(padding-top:86)—— 轨迹(qBU-ya_*)/数据库(dbb-*)等
         conversation.view 注册者 y=0 直接顶屏幕顶,首行被纱遮住。
         方案:viewArea 自身 padding-top:86 统一让位(未来插件新 view 自动覆盖,
         不逐类名点名);chat 例外 —— Md3f7G_root margin-top:-86 拉回,
         [data-conversation-scroll] 模式下滚动容器是外层 wSkVaW_scrollBody,
         viewArea 在滚动流内,padding 与负 margin 净效果为零,穿纱渐隐语义
         原样保留。曾试 viewArea>:not(.Md3f7G_root) 打在 view 根 —— 中间隔着
         官方 display:contents 的 provider wrapper(无类名),padding 穿不透,废案。
         移动端(≤820)同步 130px(header 两行)。
         实测(verify-viewyield.js):轨迹/数据库首元素 y 0→86(>纱底 70),chat
         顶滚后首内容 y=86 不变,margin/pad 三值断言过;深浅双色全绿;
         gate/p8b/proto-diff 回归无回归。 */
      /* ── P23 · 主题接入改 overrideTokens:修复「设置·外观」切换丢细节(2026-08-28)──
         现象:设置→外观行点浅色/深色/跟随系统后,主题细节丢失(半鎏金半官方)。
         根因(官方 dsh-client-ui-theme 源码):外观行三个 cube 的语义是
         preference=内置主题 id(light/dark/system),onClick=setTheme(官方 id)
         且持久化;ThemePresenter.apply 先摘 body 全部内联 token 再写 active.
         tokens,官方内置主题 tokens 为空对象 → 旧方案 aurum 的 120 个 token
         一键清零,而注入 CSS/遮蔽组件仍在 → alias 色全回官方的混搭态。
         左下角按钮旧走 setTheme("aurum-dark"/"aurum-light"),非 preference
         不持久化 → 刷新被官方 adopt() 盖回,才需要 0ms/1.2s 重断言 timers。
         方案:删双主题注册与重断言 hack,改 theme.overrideTokens(
         "dsh-theme-aurum",{token:{light,dark}}) 常驻层(token 级遮蔽,与槽位
         遮蔽同哲学)——按 active.colorScheme 逐 token 取 aurum 对应色,官方
         light/dark/system 任何 preference 下双色都正确;左下角按钮改切官方
         preference(同通道、持久化、「跟随系统」免费获得);停插件 dispose 层
         即还原官方,回退路径不变。
         实测(verify-p23-compat.js):基线 120 内联 token aurum 值;设置点
         Light 后 120 保持、--dsw-alias-bg-base 仍 oklch(94.5% 0.012 82)
         (修复前同位 #fff、bubble #edf3fe 官方色);左下角切深色 darkAttr 挂上、
         全组翻 aurum dark(bg-base oklch(16% 0.014 330)、--aurum-gold
         83%.115 88);gate/p8b/proto-diff(0)/darkskin 深 55%/浅 80% 全绿。 */
      /* ── P24 · 三卡壳去 1px transparent border:工具卡 hover「细边框」消除
         (2026-08-28,用户报 + 用户定位:「卡片背景和 hover 变色的部分大小不一致」)──
         机制:.au-tool/.au-ctx-card/.reasoning 三壳带 border:1px solid
         transparent,头行 hover 背景(.au-main/.reasoning-head)从 border 内缘
         起画 → hover 色块比卡小一圈,四边露出 1px 卡面色(55% mix)环,与
         hover 色(layer-2 50%)一亮一暗 → hover 时显形为细边框(深色下顶部
         1px 亮线,浅色下亮环)。像素实录(浅色 read 卡 hover):修复前卡内首行
         [250,247,241]=卡面色、次行过渡、y2 起 [243,238,229]=hover 色;去
         border 后卡内首行即 hover 色,y1==y2(深 [32,25,31]/浅 [243,238,229])
         逐字相等,仅剩圆角抗锯齿。回归:gate/p8b/proto-diff(0)/darkskin/
         p23-compat/cards3/think/compact/ctx-repro/ctx-light 全绿(卡几何
         -2px,各专项断言无超差)。 */
      /* ── P25 · 图标瓦片 svg display:block:Mac 图标向下偏移修复(2026-08-28,
         用户报+定位:「图片没有在圆角矩形的中心,而是向下偏移了;Windows 没有,
         换 Mac 出现」)──
         机制:Ic() 官方图标组件包在无类 <span> 里,svg 保持 display:inline,
         行盒 strut(line-height normal 由字体度量决定)参与布局 —— svg 按基线
         (=替换元素底边)对齐,顶部被 strut 推空 → 图标在 27px 瓦片内向下偏。
         Mac(-apple-system/Noto Sans SC 度量)与 Windows(Segoe UI)行高不同
         → 平台差异;headless 复现需手动 line-height:2.4 模拟(webfont 未加载
         时 strut 恰好不撑开)。实测复现:lh2.4 下 svgTop 6.5→12、底隙 6.5→1
         (向下偏 5.5px);+display:block 后 6.5/6.5 复居。
         修复:au-ico/au-chev/reasoning-head .chev(+ctx 卡冗余两条)五条 svg
         规则补 display:block —— 容器均 grid/flex,block 化安全;row-retry 等
         行内混排场景不动(避免 inline 包 block 拆盒)。
         验证(verify-p25-iconcenter.js):normal 与 strut 恶化(lh2.4)两环境
         ico 6.5/6.5、chev 0/0 全居中;全量门禁 p23/p24/gate/p8b/proto-diff/
         darkskin/cards3/think/compact/ctx-repro/ctx-light 全绿。 */
      /* ── P26 · workspace 组头菜单按钮回归 + 按钮图标 strut 偏移全家族修复
         (2026-08-28,用户报:「workspace 里没有可点击的菜单,右侧 '+' 图标
         也有向下偏移」)──
         菜单根因:AuGroup 组件里 menuSlot 取的是 g.menuSlot —— g 是分组
         数据对象(key/label/sessions/ws),menuSlot 传在 props 上 → undefined,
         「目录操作」dots 按钮自 P8 起从未渲染过。修:props.menuSlot。
         '+' 偏移根因:P25 同款 strut(Ic() span 内 svg display:inline 被
         行盒基线下推,实测 '+' 顶隙 3.5/底隙 5.5 偏 2px);P25 只修了卡壳
         三条,按钮家族没跟上。修:aurum 自建按钮 svg 规则 13 条补
         display:block(footRow/ws-sbtn/ws-ibtn/ws-addrow/wsg-act/s-menu/
         ws-railbtn/row-err/row-retry/ibtn/a-actions ibtn/rail-btn/todo-fold),
         容器均 flex/grid,block 化安全;修后 dots/'+' 顶隙==底隙 4.5/4.5。
         附带:verify-p24-hover/todofold 会话扫描加固(点击后 recent 实时
         重排,固定下标会重复点已试行 → 按文本指纹去重 + 展开全部分组,
         todofold 60 轮)。
         实测(verify-p26-wsmenu.js):dots 在册、点击弹「重命名目录/删除
         工作区」菜单、Esc 关闭;'+' 与 dots svg display:block、4.5/4.5
         居中;全套 17 脚本(p23~p26/gate/p8b/proto-diff/darkskin/cards3/
         think/compact/ctx×2/sbmore/todofold×2)NODE-EXIT=0 全绿。 */
      /* ── P27 · 承接官方 sidebar.workspaces.row-menu 扩展点(2026-08-28,
         用户报:装 dsh-open-in-vscode@0.1.6 后工作区 … 菜单里「在 VSCode
         中打开」条目不出现)──
         根因(两层):① aurum priority:-1 遮蔽官方 WorkspaceBrowser 后,
         自绘工作区菜单从未渲染该扩展点;② 现役官方运行时(0.1.1)自己也
         没声明这个子槽 —— 插件经 slots.inject 挂起的注册回调一直没人触发,
         其 DOM 兜底(spec 缺席时安装)又只认官方菜单 DOM,两头落空。
         修(两侧):
         1. 声明侧:注册 sidebar.workspaces 时,spec('sidebar.workspaces.
            row-menu') 缺席才由 aurum 补声明 children(kind=single —— 现役
            插件 register 不带 id/key,kind=list/keyed 的注册校验会直接拒;
            官方运行时将来自带声明则让位,规避 turn-tail 式同 key 二次声明
            throw 炸注册)。声明提交即触发插件挂起的 inject 回调(注册行),
            同时其 DOM 兜底随 spec 转 defined 自动拆除,无双行风险;
         2. 渲染侧:kit.renderSlot 面(随 children 声明而来)线程传
            AuBrowser→AuBrowserWide(含 Mobile 抽屉),工作区 … 菜单尾接
            renderSlot('sidebar.workspaces.row-menu',{cwd,label,onClose})
            (owner share 按官方契约);分隔线+条目块以 entriesOfSlot>0 且
            ws.path 双门控(防悬空分隔线);容器 .au-menu-x 仅
            display:contents 不引布局。停 aurum → 声明随注册级联卸载 →
            插件回退 DOM 兜底对官方菜单生效,回退路径完整;
          3. 风格归流(用户二审:插件行与菜单其他项风格不同):插件行自带
             官方单元格规格(14px/22 行高/min-h40/16px 图标/label-primary
             近黑/官方中性 hover),outlet 级通用规则把任意 role=menuitem
             注入行统一 .mi 几何(12.5px/行高 1.4/高 33.5/padding 8 11/
             13px 图标/muted 色/金 tint hover/focus 环 aurum-focus;选择器
             0,3,1 压过插件自带 0,1,0)。注:井号即官方 IconCodeOutline16
             图标本体(实心 fill 造型,较 edit/error 描边系重),非乱码;
          4. 终审微调(用户决策):工作区菜单自有两项(重命名目录/删除工作区)
             之间不再加分隔线,紧凑排列 —— 分隔线仅用于隔开尾接的扩展注入行。
          实测(verify-p27-rowmenu.js):outlet[data-slot] 在菜单内(display:
          contents)、插件行 186×33.5(==.mi 同高)12.5px/17.5 字号一致、图标
          13px 同尺寸、文字色同源、分隔线在前、点击关菜单(onClose 通,宿主
          remote 端到端)、深浅双色均过、悬停金 tint oklch(0.79 .13 84/.1)
          与 .mi:hover 逐字节一致(「圆角矩形包裹」即此 hover 态,截图时鼠标
          悬停所致)、零 console 错误;sidebar 域(sbmore/todofold×2)+ p26 +
          core 三门禁(gate/p8b/proto-diff)NODE-EXIT=0。 */
       /* ── P27b · menu-extra:多插件共存 list 槽(2026-08-28,用户测试动态插件
          时报:注入行把 dsh-open-in-vscode 行顶掉)──
          根因(前端 bundle SlotCore 实证):single 槽决胜 = priority 升序排
          序后取首个 live 注册("lowest renders" 官方原话),同 priority 第二个
          注册直接 throw —— single 槽不存在"不顶掉"的注册方式;而 row-menu
          改声明 list 会拒掉 vscode 等旧式无 id 注册(register 校验 throw)。
          修:aurum 作为菜单 owner 增设自有子槽 aurum.workspaces.menu-extra
          (kind=list,scope=root,带 id 注册每插件一行互不遮蔽),菜单扩展区
          并列渲染 row-menu + menu-extra 两个 outlet,owner share 同契约
          {cwd,label,onClose};分隔线/条目块门控改两槽任一在册
          (rowMenuCount || extraMenuCount);CSS 归流规则同款复制到
          [data-slot=aurum.workspaces.menu-extra],两 outlet 视觉无差别。
          旧文档勘误:"先注册者胜"表述有误 —— 注册 append 后立即按 priority
          重排,注册顺序不参与决胜;真实规则 = lowest priority renders,同
          priority 后注册者 throw(官方 shadow 机制)。
          P27b 二审(用户报:裸 button 注入行被「圆角矩形包裹」且图标文字
          挤在一起):归流规则原假设「注入行自带官方单元格规格」—— vscode
          行自带 display:flex/border:none/background:transparent 全套 reset,
          裸 button 无自带样式,UA 默认按钮皮(灰底+边框+非 flex)露出。
          修:reset(display/align/width/text-align/background/border/cursor/
          transition)并入两槽归流基础规则 —— vscode 行自带同值零变化,
          任意裸注入行被彻底归一。门禁 verify-p27-rowmenu 补裸 button 探针
          (menu-extra outlet 内临时节点断言 bg 透明/flex/无边框/撑满宽),
          实测探针 rgba(0,0,0,0)/flex/0px/186px,vscode 行 186×33.5 零变化,
          sidebar 域五脚本全绿。 */
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
  "--dsw-alias-bg-base": "oklch(94.5% 0.012 82)",
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

/* P23:主题接入改为 overrideTokens 常驻层(不再注册 aurum-dark/aurum-light 主题)。
   旧方案与官方「设置·外观」行互斥:官方行三个 cube 的语义是 preference=内置主题
   id(light/dark/system),点击即把 active 换成官方内置主题;官方 presenter 先摘掉
   body 上全部内联 token 再写入 active.tokens,而内置主题 tokens 为空 → aurum 的
   120 个 token 一键清零,注入 CSS 还在 → 「半鎏金半官方」丢细节(实测 120→0)。
   overrideTokens 是 theme 服务的 token 级遮蔽(与槽位遮蔽同哲学):按 active.
   colorScheme 逐 token 取 {light,dark},无论 active 是官方 light/dark 还是 system
   解析结果,aurum 双色都正确跟随;官方 preference 持久化、「跟随系统」media 监听
   天然生效;停插件 dispose 即还原官方 —— 回退路径不变。 */
const AURUM_OVERRIDE = (function () {
  const out = {};
  for (const k of Object.keys(DARK_TOKENS)) out[k] = { light: LIGHT_TOKENS[k], dark: DARK_TOKENS[k] };
  for (const k of Object.keys(FONT_TOKENS)) out[k] = { light: FONT_TOKENS[k], dark: FONT_TOKENS[k] };
  return out;
})();

const CSS1 = [
  "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Noto+Serif+SC:wght@400;500;600&family=Noto+Sans+SC:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');",
  "body[data-ds-dark-theme]{--aurum-gold:oklch(83% .115 88);--aurum-gold-strong:oklch(79% .13 84);--aurum-gold-dim:oklch(70% .10 85);--aurum-dot:oklch(83% .115 88 / .08);--aurum-sheen-top:oklch(83% .115 88 / .07);--aurum-sheen-rose:oklch(77% .095 350 / .05);--aurum-rail-1:oklch(19% .015 329);--aurum-rail-2:oklch(21.5% .016 329);--aurum-rail-shadow:0 18px 56px oklch(8% .02 330 / .45);--aurum-ring:oklch(79% .13 84 / .22);--aurum-ring-glow:oklch(79% .13 84 / .12);--aurum-focus:oklch(83% .115 88 / .55);--aurum-selection:oklch(79% .13 84 / .35);--aurum-sweep:oklch(83% .115 88 / .18)}",
  "body:not([data-ds-dark-theme]){--aurum-gold:oklch(55% .115 80);--aurum-gold-strong:oklch(50% .12 78);--aurum-gold-dim:oklch(66% .11 82);--aurum-dot:oklch(28% .05 330 / .13);--aurum-sheen-top:oklch(60% .11 80 / .06);--aurum-sheen-rose:transparent;--aurum-rail-1:oklch(92.5% .014 82);--aurum-rail-2:oklch(94.5% .012 82);--aurum-rail-shadow:0 18px 52px oklch(30% .05 330 / .16);--aurum-ring:oklch(55% .115 80 / .2);--aurum-ring-glow:oklch(55% .115 80 / .1);--aurum-focus:oklch(55% .115 80 / .6);--aurum-selection:oklch(55% .115 80 / .3);--aurum-sweep:oklch(55% .115 80 / .2)}",
  /* 背景画布(2026-08-24 用户决策:去晕染):只留底色 + 点阵,不再叠金辉/玫粉 radial ——
     此前两片晕染横向压在主区(50%/-12% 与 88%/112%),侧栏区没有,造成左右分界、主区浑浊 */
  "body{background-color:var(--dsw-alias-bg-base);background-image:radial-gradient(circle,var(--aurum-dot) 1px,transparent 1.35px);background-size:24px 24px}",
  "body #root,body [data-slot=root]>div,body [data-slot=conversation]>div{background-color:transparent}",
  /* 栏几何: 内容根即卡片本体(原型 .sidebar), 列只负责四向留白 — 左12/右4 使卡片恰为 264px;
     卡片自带 overflow:hidden, 内部行/hover 永不溢出圆角边界 */
  /* P15 前修订 III:官方 .pI_x6G_sidebarCol 自带 overflow:hidden —— 卡片阴影在
     列内被硬切(卡右缘 276 → 列界 280,44px 柔影只剩 4px 窗口),视觉 = 一道
     分割线/半透明底板。放开列裁切让阴影完整铺过主区(主区链已验证全透明);
     卡片自身 overflow:hidden 管住内容,列级放开无溢出源 */
  "body [data-slot=root]>div>div:first-child{background:transparent;border-right:none;padding:12px 4px 12px 12px;box-sizing:border-box;overflow:visible}",
  /* 修订 IX(用户报「底部渐影与侧栏卡阴影打架」):frame 绘制序 sidebarCol →
     centerCol(含 composerSeat 渐影纱),纱在后把卡阴影右尾盖掉。提列 z=15:
     高于 centerCol(auto),低于官方 overlayLayer(z20,弹层/吐司仍在上);
     列背景透明,resize 手柄(z2,x276-284)在卡外不受遮 */
  "body .pI_x6G_sidebarCol{position:relative;z-index:15}",
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
  /* P6 规则修正(P15 前取证):裸 [class*=brand] 同时命中 brandIdentity/brandMark/
     brandName 三个官方子 span —— flex:1 使 mark 与 name 平分生长(鲸鱼后拖出空隙、
     字标被推到按钮右缘),padding 0 10px 平添 10px 内容偏移,height 38 覆写官方 24。
     铁律 6(标签限定)再次翻车实录。收紧到 button;svg 全量高度覆写撤销(鲸鱼回 24) */
  "body [data-slot=sidebar] [class*=logoRow] button[class*=brand]{flex:1;min-width:0;height:38px;border-radius:11px;padding:0 10px;transition:background .18s,color .18s,transform .1s}",
  "body [data-slot=sidebar] [class*=logoRow] button[class*=brand]:hover{background:var(--dsw-alias-interactive-bg-hover-solid)}",
  "body [data-slot=sidebar] [class*=logoRow] button[class*=brand]:active{transform:scale(.985)}",
  /* P15 前修订(原型 .sb-brand 锚点原则):字标 svg 内在尺寸(156×24)恒定、
     flex:none 不参与弹性收缩;窄卡由按钮 overflow:hidden 自然裁尾,
     更窄(<236px 卡宽)容器查询整体隐藏只留鲸鱼。槽位匿名 wrapper 自带
     inline display:contents,svg 直达 brandName,无需也无法样式化 wrapper */
  "body .hHd-Xa_brand .hHd-Xa_brandName svg{flex:none}",
  "body [data-slot=sidebar]>div:first-child{container-type:inline-size}",
  "@container (max-width:236px){body .hHd-Xa_brand .hHd-Xa_brandName{display:none!important}}",
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
  /* 铁律 6 第三次翻车实录:旧规则 [class*=settingsArea] button 泛匹配 —— 设置
     弹窗 DOM 渲染在 sidebar.settings 槽内,settingsArea 是其祖先,弹窗内所有
     button(close/navCell/actions)全被拉成 100%×38(叉 28×28 → 498×38)。
     收紧到真正的目标:侧栏设置触发钮 */
  "body [data-slot=sidebar] button.VOzbGW_trigger{display:flex;align-items:center;gap:10px;width:100%;height:38px;margin:0;padding:0 10px;border:none;border-radius:10px;background:transparent;color:var(--dsw-alias-label-secondary);font:400 13px/20px var(--dsw-font-family);cursor:pointer;transition:background .18s,color .18s;text-align:left}",
  /* 评审扫尾(2026-08-25):hover/svg/折叠态三行同步收紧 —— 探针实测闭合态
      settingsArea 仅含 button.VOzbGW_trigger + 1 svg + 1 span(无 [role=button]),
      泛匹配后代规则会泄漏进设置弹窗(svg 曾被压 15px) */
  "body [data-slot=sidebar] button.VOzbGW_trigger:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}",
  "body [data-slot=sidebar] button.VOzbGW_trigger svg{width:15px;height:15px;flex:none;color:var(--dsw-alias-label-tertiary);transition:color .18s}",
  "body [data-slot=sidebar] button.VOzbGW_trigger:hover svg{color:var(--aurum-gold)}",
  /* P8c 折叠细条:顶部 logo/新建/搜索由 AuBrowserRail 自建(原型 .sb-rail),
     由 AuBrowserRail 自建(原型 .sb-rail),官方 logoRow/newSession 隐藏;底部设置/主题钮保留 */
  "body [data-slot=sidebar] [class*=collapsed] [class*=logoRow]{display:none}",
  "body [data-slot=sidebar] [class*=collapsed] button[class*=newSession]{display:none}",
  "body [data-slot=sidebar] [class*=collapsed] [class*=footArea]{border-top:none;padding:6px 0}",
  "body [data-slot=sidebar] [class*=collapsed] .aurum-footRow{width:40px;height:40px;justify-content:center;padding:0;border-radius:12px;gap:0}",
  "body [data-slot=sidebar] [class*=collapsed] .aurum-footRow span{display:none}",
  "body [data-slot=sidebar] [class*=collapsed] [class*=footerActions],body [data-slot=sidebar] [class*=collapsed] [class*=settingsArea]{align-items:center}",
  "body [data-slot=sidebar] [class*=collapsed] button.VOzbGW_trigger{width:40px;height:40px;justify-content:center;padding:0;border-radius:12px;gap:0}",
  "body [data-slot=sidebar] [class*=collapsed] button.VOzbGW_trigger span{display:none}",
  /* P9:逐节点入场(原型 .node rise)——挂在官方 flowItem 行上;列 gap16+行距12=原型 .node 28px 节奏 */
  /* P15 追补 IV:消息流滚动缓动(用户报新节点出现时"跳一下")—— 官方滚动容器
     wSkVaW_scrollBody 为 scroll-behavior:auto,每条新消息/工具调用出现时以
     scrollTop 直赋瞬跳到底。smooth 覆盖后 JS 直赋也被 CSS 平滑接管(规格行为)。 */
  "body .wSkVaW_scrollBody{scroll-behavior:smooth}",
  /* P16 修订 IX(用户指定):聊天流所有卡片统一「模糊透明入场」= au-think-in 同款
     签名(全透明→不透明 + blur 2.5→0 消散,1.2s 同曲线)—— 挂官方 flowItem 行,
     用户气泡/上下文卡/工具卡/think 卡/正文/尾部节点全覆盖;不带 translateY
     (P15 追补 IV 教训:位移会顶起刚滚到底的视口,保持原地入场);fill backwards
     —— 动画结束后 filter 不残留(含 filter 元素是 fixed 后代的 containing
     block,常驻有险)。margin-bottom 12→4 + 列 gap 8→4 = 流内间距 20→8px。 */
  "body [data-chat-anchor-key]{margin-bottom:4px;animation:aurum-rise 1.2s cubic-bezier(.22,.75,.3,1) backwards}",
  "@keyframes aurum-rise{from{opacity:0;filter:blur(2.5px)}to{opacity:1;filter:blur(0)}}",
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
  /* P15 前修订 V(原型 .sh-head 同轴浮头方案,取代此前两列 grid 布局):
     header = absolute 浮头(不占文档流,消息从纱下滚过渐隐,不再硬截断);
     高度 70 = 12 缩进 + 58 栏头,padding-top 12 + 内容行 58 居中 →
     标题中心线 41 ≡ 侧栏字标中心线(卡 pad 12 + logoRow 58/2);
     渐变纱 = 底色 92% → 透明(原型形态,消息透出 8%);单行 flex:
     [crumb …… tabs …… actions/utilities] 同一水平线 */
  "body .wSkVaW_root{position:relative}",
  "body .wSkVaW_header{position:absolute;top:0;left:0;right:0;z-index:30;display:flex;align-items:center;gap:14px;height:70px;box-sizing:border-box;padding:24px 22px 0 20px;background:none}",
  "body .wSkVaW_titleRow{display:contents}",
  "body .wSkVaW_titleCluster{flex:1;min-width:0;min-height:0}",
  "body .wSkVaW_headerActions{order:3;margin-left:0}",
  "body .wSkVaW_headerUtilities{order:2}",
  "body .wSkVaW_tabs{order:1;display:flex;gap:2px;margin:0;border:1px solid transparent;border-radius:999px;padding:3px;background:color-mix(in oklab,var(--bg-deep) 84%,transparent)}",
  /* 滚动区顶部让位浮头(110 纱高 + 16 原留白),消息初始态在纱下方完整可见 */
  /* P15 前修订 VI:渐隐由 mask 承担 —— 滚动视口顶部 70px 内容真透明(透出画布),
     header 自身 background:none。mask 打在滚动视口上,随视口坐标系固定不随内容滚动;
     浅色主题透出浅色画布,自动兼容;70 = 浮头高,86 = 70 渐隐区 + 16 原留白。
     追补:官方 DOM 升级后滚动区 Md3f7G_scroll → wSkVaW_scrollBody(root 直接
     子级,y=0 全高),旧让位链(viewArea/Md3f7G_root)整体失效,一并改靶。
     修订 VIII(用户指定):底部同款渐隐,且更宽(120px > 顶 70)。
     修订 VIIIb(用户报「输入坞底部小字看不清」):mask 罩 scrollBody 会连 sticky
     composerSeat(会话态贴视口底,座位顶≈y593)一起渐隐 —— mask 无法子级豁免。
     改由 composerSeat::before 承担底部渐隐:纱 = transparent → 底色,铺
     [座位顶上方 120px → 视口底],z-index:-1 在座位内容背后(座位 sticky 自成
     层叠上下文,纱压住穿行的消息、不碰小字);仅 [data-phase=active] 会话态
     启用,空态 hero 不受纱染;scrollBody mask 回归仅顶部 */
  "body .wSkVaW_scrollBody{padding-top:126px;mask-image:linear-gradient(180deg,transparent 0px,#000 110px);-webkit-mask-image:linear-gradient(180deg,transparent 0px,#000 110px)}",
   /* 修订 XV(2026-08-28,用户指定):顶部渐隐带加倍 —— mask 70→140(窄屏 100→200),
      让位 padding-top 86→156 / 130→230(渐隐区 + 原留白 16/30),消息初始态仍在
      纱下完整可见;浮头高 70 不变,渐隐带下探超出浮头 70px。
      修订 XVI(2026-08-28 续,用户指定):渐隐带回调一档 —— 140→110(窄屏
      200→160),让位 126/190;仍比原始 70/100 高约六成,顶部完全透明区收窄。 */
  /* 底部渐隐纱(修订 VIIIb):挂 composerSeat 而非 scrollBody mask —— 座位
     sticky 贴底,mask 会连座位小字一起渐隐且无法子级豁免;纱在座位内容
     背后(z-index:-1,sticky 自成层叠上下文),只吞穿行消息。
      修订 XIII(用户指定):纱不再外凸到座位顶上方 —— 高度收敛为座位自身 100%,
      渐变 transparent→底色铺满整座、恰在视口底边(= 输入坞底)收口;座位上方
      不再有独立渐隐空档,消息保持可见直到滑进半透明输入坞之下。
      修订 XIV(用户指定):渐隐带再升高 —— 纱顶从座位顶再上探 50% 座位高
      (height:calc(100% + 50%)),渐变仍 0→100% 拉满、恰在视口底边收口;
      视觉 = 座位上方半座高开始渐隐 + 整个输入坞内继续,到底边完全隐没。 */
  "body .wSkVaW_root[data-phase=active] .wSkVaW_composerSeat::before{content:\"\";position:absolute;left:0;right:0;bottom:0;height:calc(100% + 50%);z-index:-1;pointer-events:none;background:linear-gradient(180deg,transparent 0px,var(--bg) 100%)}",
  /* 修订 X(用户报「点阵被纱盖掉」):纱涂底色会把背景点阵一并盖没 —— ::after
     在纱上重铺同款点阵,background-attachment:fixed 对齐视口坐标,与 body
     画布点阵逐点重合(同 --aurum-dot/24px),视觉=点阵穿透渐隐带;只作用于
     中间消息流(纱在座位内容背后),侧栏卡 z15 仍在纱上 */
  "body .wSkVaW_root[data-phase=active] .wSkVaW_composerSeat::after{content:\"\";position:absolute;left:0;right:0;bottom:0;height:calc(100% + 50%);z-index:-1;pointer-events:none;background-image:radial-gradient(circle,var(--aurum-dot) 1px,transparent 1.35px);background-size:24px 24px;background-attachment:fixed}",
   /* 非 chat view(轨迹/数据库/未来插件 view)让位浮头(用户报:切 tab 后内容顶屏幕顶,
      被渐变纱遮挡)。viewArea 与各 view 根之间隔着官方 display:contents 的 provider
      wrapper(无类名,padding 无法穿透),故让位做在 viewArea 自身(真实 flex 盒);
      chat 在 Md3f7G_root 负 margin 拉回 y=0 + Md3f7G_scroll 的 padding-top:86 让位
      (消息从纱下穿行渐隐,设计意图不变);flex:auto 下负 margin 参与 flex 分配,
      chat 总高恰填满 viewArea 内容盒再上探 padding 区,底部不溢出 */
   /* 旧让位链(viewArea padding-top + Md3f7G_root 负 margin)随官方 DOM 升级失效,
      已删;现结构 scrollBody 即唯一主视图滚动区,让位+渐隐都由其 padding/mask 承担 */
  /* tab 选中态去横杠(官方 :after 2px 底线),选中仅以胶囊金底呈现(原型 .tab.on) */
  "body .wSkVaW_tab:after{display:none}",
  "body .wSkVaW_tab{padding:5px 15px;border-radius:999px;font-size:12.5px;color:var(--muted);transition:.18s;white-space:nowrap}",
  "body .wSkVaW_tab:hover{color:var(--fg)}",
  "body .wSkVaW_tabActive,body .wSkVaW_tab.wSkVaW_tabActive{background:oklch(79% 0.13 84 / .16);color:var(--gold-strong)}",
  "body:not([data-ds-dark-theme]) .wSkVaW_tabActive{background:oklch(55% 0.115 80 / .13)}",
  /* ── P15 追补 III · reasoning 折叠态 = au-tool 同款卡壳(用户指定)──
     官方 DisclosureRow(icon+title+summary+chevron,行点击展开)套 au-tool 面色/
     圆角14/hover/chevron 旋转;展开体保持 serif italic 思路;运行扫光换金 */
  "body [data-chat-flow-kind=assistant-step] .QWLzlG_root{background:color-mix(in oklab,var(--dsw-alias-bg-layer-1) 55%,transparent);border-radius:14px;margin:2px 0;overflow:hidden}",
  "body .QWLzlG_row{padding:10px 13px;display:flex;align-items:center;gap:11px;cursor:pointer;user-select:none;transition:background .15s}",
  "body .QWLzlG_row:hover{background:color-mix(in oklab,var(--dsw-alias-bg-layer-2) 50%,transparent)}",
  "body .QWLzlG_leading{color:var(--dsw-alias-label-tertiary);display:inline-flex}",
  "body .QWLzlG_title{font-family:var(--font-mono);font-weight:400;font-size:12.5px;color:var(--dsw-alias-label-primary);letter-spacing:.04em}",
  "body .QWLzlG_separator{display:none}",
  "body .QWLzlG_summary{font-family:var(--ds-font-family-code);font-size:12px;color:var(--dsw-alias-label-secondary);line-height:1.6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
  "body .QWLzlG_chevron{color:var(--dsw-alias-label-tertiary);display:inline-flex;transition:transform .34s cubic-bezier(.3,1.35,.45,1)}",
  "body .QWLzlG_root .QWLzlG_chevron{transform:rotate(90deg)}",
  "body .QWLzlG_thinkBody{font-family:var(--font-serif);font-style:italic;font-size:13px;line-height:1.9;color:var(--muted);padding:11px 15px 13px;margin:0 13px;border-top:1px dashed color-mix(in oklab,var(--muted) 25%,transparent)}",
  "body .QWLzlG_root[data-state=running] .QWLzlG_row:after{background:linear-gradient(90deg,transparent 0%,color-mix(in oklab,var(--gold) 16%,transparent) 55%,transparent 100%)}",
  /* ── P16 · think 卡接管(遮蔽 assistant-step;AuThinkCard 原型 .reasoning 类名)──
     完成态几何沿用 P15 追补 III 用户指定形态(r14 卡壳/pad 10 13/hover 面/chevron 旋转,
     偏离原型 r12/pad 8 13 属既定用户决策);运行态 = 单行实时流:行号 key 变化驱动
     remount,每换一行重播入场;官方横滚 ticker + 金扫光退役;图标金色呼吸;
     思考结束自动收拢(组件 effect);正文 serif italic 与原 thinkBody 一致;
     margin 2px 0 沿用 P11 修订间距制(原型 mb14 已被间距制取代)。
     P16 修订(2026-08-25,用户三处):① 不随单行文本量横向滚动 —— follow-end
     scrollLeft 撤除,长行原地裁切(r-live-wrap overflow hidden,起点恒左对齐),
     入场动画固定在同一可视位置完整可赏;② 入场透明度 = 全透明→不透明
     (叠加已有模糊消散 blur 2.5→0;初版方向系口误,当日纠正);
     ③ 时长 .38s→.76s(慢一倍)。
     P16 修订 II(同日,用户两处):① 透明度方向纠正回全透明→不透明(上一轮
     说反);② 思考中卡壳补「执行中」背景辉光 = 工具卡 au-tool 同款光带
     (105° 金 15%)+ au-sweep 1.9s 横扫,扫过整张卡(reduced-motion 关)。
     P16 修订 III(同日,用户报未对齐):运行态头部行稳态错位 —— .r-live-wrap
     原为 display:block,继承头部行 16/28 strut,12/19.2 的 inline-block 文本
     按基线挂上 28px 行框,半行距不对称压低文本 3.59px;修:wrap 改
     display:flex + align-items:center(strut 消失,文本中心=wrap 中心)。
     探针实测:修前 live 中心 +3.59,修后 icon/Think/wrap/live/chev 五元素
     中心全等(delta 0);verify-think.js 固化 headAlign 断言(≤1.2px)。
     P16 修订 IV(同日,用户指定):正文 = 运行态同款透明模糊错峰级联 —— 按 \n
     拆行(.r-line,key=行号),展开时整段重播,流式新行单独入场,空行 nbsp
     保行高;断言口径同步(sumIsFirstLine 改在展开后由行重构全文比对)。
     修订 V/VI(同日,用户两报):V = 初版 min(i,8)*50 封顶致 9+ 行同时入场
     成块 → 递减步长;VI = 行时长 .76→1.2s、步长 70/30ms(相位差放大肉眼
     可辨,运行态单行保持 .76s);公式 min(i,12)*70+(i-12)*30,每行独立
     delay,strictlyDistinct/flatRuns 断言在册。
     修订 VII(同日,用户澄清):「正文」= 模型输出的 markdown,非 thinking
     展开体 —— .r-line 行级级联全撤(thinking 展开还原普通文本,无动画);
     错峰级联移到 assistant 正文:官方 MarkdownText 根 div[class*=_markdown_]
     的块级子元素(p/ul/pre/table…)统一 au-think-in 1.2s,delay 阶梯
     nth-child 1-12 ×70ms(AU_MD_STAGGER 生成)、12+ 恒 .77s;历史挂载整段
     波纹,流式新段落单独入场(React 按位 reconcile 老段落不重播);标签限定
     div[class*=_markdown_] 不误伤 think 卡(铁律 6)。实测:3 块 firstDelays
     [0,.07,.14]s 单调、animAllSame、thinkBodyAnim=none、.r-line=0;回归
     gate/p8b/cards3/proto-diff 全绿。 */
  "body [data-chat-flow-kind=assistant-step] .reasoning{background:color-mix(in oklab,var(--dsw-alias-bg-layer-1) 55%,transparent);border-radius:14px;margin:1px 0;overflow:hidden}",
   /* P17:浅色下 reasoning 底色对齐 au-tool 家族(80% 不透明度,深浅同构) */
   "body:not([data-ds-dark-theme]) [data-chat-flow-kind=assistant-step] .reasoning{background:color-mix(in oklab,var(--dsw-alias-bg-layer-1) 80%,transparent)}",
  /* P16 修订 II:思考中卡壳同款「执行中」辉光 —— 与 au-tool .au-main::after 同构:
     105° 金 15% 光带 + au-sweep 1.9s 横扫,扫过整张卡;规则必须带
     body:not(#aurum-boost) 前缀(ID 特异性压过 [data-state=running]::after 一揽子
     90° 通用覆盖,与工具卡规则同款防御 —— 探针实测不带前缀会被盖成 90° 宽光带);
     verify-think.js 页内探针断言 computed parity;reduced-motion 与工具卡同
     display:none */
  "body [data-chat-flow-kind=assistant-step] .reasoning[data-state=running]{position:relative}",
  "body:not(#aurum-boost) [data-chat-flow-kind=assistant-step] .reasoning[data-state=running]::after{content:\"\";position:absolute;inset:0;pointer-events:none;background:linear-gradient(105deg,transparent 42%,color-mix(in oklab,var(--aurum-gold-strong) 15%,transparent) 50%,transparent 58%);animation:au-sweep 1.9s linear infinite}",
  "body [data-chat-flow-kind=assistant-step] .reasoning-head{display:flex;align-items:center;gap:11px;width:100%;padding:10px 13px;border:none;background:transparent;cursor:pointer;user-select:none;text-align:left;font:inherit;transition:background .15s}",
  "body [data-chat-flow-kind=assistant-step] .reasoning-head:hover{background:color-mix(in oklab,var(--dsw-alias-bg-layer-2) 50%,transparent)}",
   /* P17:think 图标并入 .au-ico 27x27 金瓦片家族(与工具卡/上下文卡水平对齐:
      瓦片 x=13 / glyph x=19.5 / 标题列 x=51 三卡全等;几何与配色由 .au-ico 承担,
      .r-ico 仅留作运行态钩子 —— 呼吸动画移到 svg,瓦片底色不闪烁) */
  "body [data-chat-flow-kind=assistant-step] .reasoning[data-state=running] .r-ico svg{animation:au-think-pulse 1.6s ease-in-out infinite}",
  "body [data-chat-flow-kind=assistant-step] .r-title{flex:none;font-family:var(--font-mono);font-weight:400;font-size:12.5px;letter-spacing:.04em;color:var(--dsw-alias-label-primary)}",
  "body [data-chat-flow-kind=assistant-step] .r-live-wrap{flex:1;min-width:0;display:flex;align-items:center;overflow:hidden;white-space:nowrap}",
  "body [data-chat-flow-kind=assistant-step] .r-sum{display:block;overflow:hidden;text-overflow:ellipsis;font-family:var(--ds-font-family-code);font-size:12px;line-height:1.6;color:var(--dsw-alias-label-secondary)}",
  "body [data-chat-flow-kind=assistant-step] .r-live{display:inline-block;font-family:var(--ds-font-family-code);font-size:12px;line-height:1.6;color:var(--dsw-alias-label-secondary);animation:au-think-in .76s cubic-bezier(.22,.75,.3,1) both}",
  "body [data-chat-flow-kind=assistant-step] .reasoning-head .chev{display:inline-flex;flex:none;width:13px;height:13px;color:var(--dsw-alias-label-tertiary);transition:transform .25s}",
  "body [data-chat-flow-kind=assistant-step] .reasoning-head .chev svg{width:13px;height:13px;display:block}",
  "body [data-chat-flow-kind=assistant-step] .reasoning.open .chev{transform:rotate(90deg)}",
   "body [data-chat-flow-kind=assistant-step] .reasoning-body{display:grid;grid-template-rows:0fr;margin:0 13px;transition:grid-template-rows .34s cubic-bezier(.45,0,.55,1)}",
   "body [data-chat-flow-kind=assistant-step] .reasoning.open .reasoning-body{grid-template-rows:1fr;transition:grid-template-rows .5s cubic-bezier(.45,0,.55,1)}",
    /* P18:think 展开并入 au-tool 非线性收合 —— .reasoning-body 变 grid 0fr⇄1fr 壳
       (同 .au-x 曲线:展开 .5s/收合 .34s cubic-bezier(.45,0,.55,1));.r-bclip 裁切;
       .r-bin 承载正文样式 + opacity/translateY 淡入(同 .au-in 逐字曲线)。 */
   "body [data-chat-flow-kind=assistant-step] .r-bclip{overflow:hidden;min-height:0}",
   "body [data-chat-flow-kind=assistant-step] .r-bin{padding:11px 15px 13px;border-top:1px dashed color-mix(in oklab,var(--muted) 25%,transparent);font-family:var(--font-serif);font-size:13px;line-height:1.9;color:var(--muted);font-style:italic;white-space:pre-wrap;word-break:break-word;opacity:0;transform:translateY(-6px);transition:opacity .18s ease,transform .24s cubic-bezier(.45,0,.55,1)}",
   "body [data-chat-flow-kind=assistant-step] .reasoning.open .r-bin{opacity:1;transform:none;transition:opacity .4s .06s ease,transform .5s .04s cubic-bezier(.45,0,.55,1)}",
  /* P16 修订 VII/VIII(用户澄清:「正文」= 模型输出的 markdown,非 thinking 展开):
     thinking 展开体撤动画(还原普通 pre-wrap 文本);错峰级联移到 assistant 正文
     —— 官方 MarkdownText 根(div[class*=_markdown_])的块级子元素
     (p/ul/pre/table…)同款 au-think-in(透明→不透明+模糊消散 1.2s)。
     修订 VIII(用户报"输出完成后又从头重播一遍"):根因 = 回合结算 streaming 翻
     false,官方 MarkdownText 流式⇄成稿切换整树重挂载,全部块都是新 DOM,CSS
     无法区分初次挂载与结算重挂载 → 动画整段重播。根治:规则限定
     .Sxvs8a_root[data-streaming](我们渲染的根,仅流式期在册)—— 动画只属于
     正在生成的内容:流式块照常错峰;结算瞬间属性摘除,重挂载块直接静态呈现;
     历史会话挂载亦静态(不重播)。delay 阶梯 nth-child 1-12 ×70ms
     (AU_MD_STAGGER 生成),12+ 恒 770ms;标签限定不误伤 think 卡(铁律 6) */
  "body [data-chat-flow-kind=assistant-step] .Sxvs8a_root[data-streaming] div[class*=_markdown_]>*{animation:au-think-in 1.2s cubic-bezier(.22,.75,.3,1) both;animation-delay:.77s}",
  "body [data-chat-flow-kind=assistant-step] .au-imgs{display:flex;flex-wrap:wrap;gap:10px;margin:2px 0}",
  "body [data-chat-flow-kind=assistant-step] .au-md-fallback{white-space:pre-wrap;font-size:16px;line-height:28px;color:var(--dsw-alias-label-primary)}",
  "body [data-chat-flow-kind=assistant-step] .au-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}",
  "@keyframes au-think-in{from{opacity:0;transform:translateY(7px);filter:blur(2.5px)}to{opacity:1;transform:translateY(0);filter:blur(0)}}",
  "@keyframes au-think-pulse{50%{opacity:.45}}",
  "@media (prefers-reduced-motion:reduce){body [data-chat-flow-kind=assistant-step] .r-live,body [data-chat-flow-kind=assistant-step] .Sxvs8a_root[data-streaming] div[class*=_markdown_]>*{animation:none}body [data-chat-flow-kind=assistant-step] .reasoning[data-state=running] .r-ico svg{animation:none}body [data-chat-flow-kind=assistant-step] .reasoning[data-state=running]::after{display:none}body [data-chat-flow-kind=assistant-step] .reasoning-body,body [data-chat-flow-kind=assistant-step] .r-bin{transition:none!important}}",
  /* ── P15 追补 III · 运行态状态行 = 原型三点跳动(用户指定,替换 Deep diving 滚字)──
     官方 Md3f7G_turnStatus(shimmer 文字+时钟)整体改造:元素=点1,::before/::after=
     点2/3(5px 金点,bob 1.2s,delay 0/.15/.3 —— 原型 .t-dots 逐字参数);文字/
     渐变底/shimmer 动画全清零,时钟隐藏(原型无时钟) */
  "body .Md3f7G_turnStatus{background-image:none!important;-webkit-background-clip:initial!important;background-clip:initial!important;-webkit-text-fill-color:initial!important;font-size:0;width:5px;height:5px;border-radius:50%;background-color:var(--gold-dim)!important;position:relative;overflow:visible;display:inline-block;align-self:flex-start;margin:10px 0 4px;animation:au-bob 1.2s infinite!important}",
  "body .Md3f7G_turnStatus::before,body .Md3f7G_turnStatus::after{content:\"\";position:absolute;top:0;width:5px;height:5px;border-radius:50%;background:var(--gold-dim)}",
  "body .Md3f7G_turnStatus::before{left:10px;animation:au-bob 1.2s infinite .15s}",
  "body .Md3f7G_turnStatus::after{left:20px;animation:au-bob 1.2s infinite .3s}",
  "body .Md3f7G_turnStatusClock{display:none}",
  "@keyframes au-bob{30%{transform:translateY(-4px);opacity:.5}}",
  "@media (prefers-reduced-motion:reduce){body .Md3f7G_turnStatus,body .Md3f7G_turnStatus::before,body .Md3f7G_turnStatus::after{animation:none!important}}",
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
  ".aurum-footRow svg{display:block;width:15px;height:15px;flex:none;color:var(--dsw-alias-label-tertiary);transition:color .18s}",
  ".aurum-footRow:hover svg{color:var(--aurum-gold)}",
  "@media (prefers-reduced-motion:reduce){body [data-chat-anchor-key]{animation:none}body [data-composer-card]{transition:none}body [data-slot=root]>div>div:first-child::before{transition:none}body .wSkVaW_scrollBody{scroll-behavior:auto}}",
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
  ".au-user-row{display:flex;justify-content:flex-end;margin:1px 0}",
  ".au-bubble{max-width:min(525px,82%);border-radius:22px;padding:13px 19px;background:linear-gradient(135deg,color-mix(in oklab,var(--aurum-gold-strong) 16%,transparent),color-mix(in oklab,var(--aurum-gold-strong) 7%,transparent));font-family:var(--dsw-font-markdown-base-font-family);font-size:15px;line-height:1.85;color:var(--dsw-alias-label-primary);white-space:pre-wrap;word-break:break-word}",
  ".au-img{max-width:100%;border-radius:14px;display:block;margin-top:8px}",
  /* P15 追补 III:◈ 上下文注入 = au-tool 同款卡壳(用户指定,替换追补 II 悬停方案)——
     每个注入节点一张紧凑卡:header(官方 Sparkle + mono 名 + 首行摘要 + chevron),
     点击 grid 展开/收合全文;面色/hover/chevron/曲线与工具卡完全一致 */
  ".au-ctx-card{border-radius:14px;overflow:hidden;position:relative;background:color-mix(in oklab,var(--dsw-alias-bg-layer-1) 55%,transparent);margin:1px 0}",
  ".au-ctx-card .au-main{display:flex;align-items:center;gap:11px;padding:10px 13px;cursor:pointer;user-select:none;transition:background .15s}",
  ".au-ctx-card .au-main:hover{background:color-mix(in oklab,var(--dsw-alias-bg-layer-2) 50%,transparent)}",
  ".au-ctx-card .au-ico{width:27px;height:27px;border-radius:8px;flex:none;display:grid;place-items:center;background:color-mix(in oklab,var(--aurum-gold-strong) 13%,transparent);color:var(--aurum-gold-strong)}",
  ".au-ctx-card .au-ico svg{width:14px;height:14px;display:block}",
  ".au-ctx-card .au-txt{flex:1;min-width:0;text-align:left}",
  ".au-ctx-card .au-name{font-family:var(--ds-font-family-code);font-size:12.5px;color:var(--dsw-alias-label-primary);display:flex;gap:8px;align-items:baseline}",
  ".au-ctx-card .au-name em{font-style:normal;color:var(--dsw-alias-label-tertiary);font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:340px}",
  ".au-ctx-card .au-chev{width:13px;height:13px;color:var(--dsw-alias-label-tertiary);flex:none;display:inline-flex;transition:transform .34s cubic-bezier(.3,1.35,.45,1)}",
  ".au-ctx-card .au-chev svg{width:13px;height:13px;display:block}",
  ".au-ctx-card.au-open .au-chev{transform:rotate(90deg)}",
  ".au-ctx-card .au-x{display:grid;grid-template-rows:0fr;transition:grid-template-rows .34s cubic-bezier(.45,0,.55,1)}",
  ".au-ctx-card.au-open .au-x{grid-template-rows:1fr;transition:grid-template-rows .5s cubic-bezier(.45,0,.55,1)}",
  ".au-ctx-card .au-clip{overflow:hidden;min-height:0}",
  ".au-ctx-card .au-in{padding:2px 15px 13px 51px}",
  /* P15 追补 VII:通用 .au-in 带 opacity:0 淡入,恢复规则只写了 .au-tool.au-open,
     ctx 卡漏配 → 展开后高度撑开但内容永远透明(用户报"展开无内容")。补齐同曲线恢复 */
  ".au-ctx-card.au-open .au-in{opacity:1;transform:none;transition:opacity .4s .06s ease,transform .5s .04s cubic-bezier(.45,0,.55,1)}",
  ".au-ctx-full{font-family:var(--ds-font-family-code);font-size:11px;line-height:1.8;color:var(--dsw-alias-label-secondary);white-space:pre-wrap;word-break:break-all;max-height:260px;overflow:auto;background:color-mix(in oklab,var(--dsw-alias-bg-layer-2) 40%,transparent);border-radius:8px;padding:9px 12px}",
  "@media (prefers-reduced-motion:reduce){.au-ctx-card .au-x,.au-ctx-card .au-chev{transition:none!important}}",
  ".au-callrow{margin:0}",
  ".au-fstat{font-family:var(--ds-font-family-code);font-size:10.5px;color:var(--dsw-alias-label-tertiary);letter-spacing:.04em;margin-right:auto}",
  ".au-tool{border-radius:14px;overflow:hidden;position:relative;background:color-mix(in oklab,var(--dsw-alias-bg-layer-1) 55%,transparent);margin:1px 0}",
  "body:not([data-ds-dark-theme]) .au-tool{background:color-mix(in oklab,var(--dsw-alias-bg-layer-1) 80%,transparent)}",
   /* P17:压缩卡(au-comp)复用 au-tool 卡壳 —— 不可展开态(noexp)去手型与悬停底色 */
   ".au-tool.au-noexp .au-main{cursor:default}",
   ".au-tool.au-noexp .au-main:hover{background:transparent}",
  ".au-main{display:flex;align-items:center;gap:11px;padding:10px 13px;cursor:pointer;user-select:none}",
  ".au-main:hover{background:color-mix(in oklab,var(--dsw-alias-bg-layer-2) 50%,transparent)}",
  ".au-ico{width:27px;height:27px;border-radius:8px;flex:none;display:grid;place-items:center;background:color-mix(in oklab,var(--aurum-gold-strong) 13%,transparent);color:var(--aurum-gold-strong)}",
  ".au-ico svg{width:14px;height:14px;display:block}",
  ".au-txt{flex:1;min-width:0;text-align:left}",
  ".au-name{font-family:var(--ds-font-family-code);font-size:12.5px;color:var(--dsw-alias-label-primary);display:flex;gap:8px;align-items:baseline}",
  ".au-name em{font-style:normal;color:var(--dsw-alias-label-tertiary);font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:340px}",
  ".au-sum{display:block;font-size:12px;color:var(--dsw-alias-label-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}",
  ".au-chev{width:13px;height:13px;color:var(--dsw-alias-label-tertiary);flex:none;transition:transform .34s cubic-bezier(.3,1.35,.45,1)}",
  ".au-chev svg{width:13px;height:13px;display:block}",
  ".au-tool.au-open .au-chev{transform:rotate(90deg)}",
  ".au-pill{font-family:var(--ds-font-family-code);font-size:10.5px;padding:2.5px 9px;border-radius:999px;border:1px solid transparent;color:var(--dsw-alias-label-secondary);white-space:nowrap;flex:none}",
  ".au-pill.au-ok{color:var(--dsw-alias-state-success-primary);background:color-mix(in oklab,var(--dsw-alias-state-success-primary) 13%,transparent)}",
  ".au-pill.au-run{color:var(--aurum-gold-strong);background:color-mix(in oklab,var(--aurum-gold-strong) 13%,transparent);display:flex;align-items:center;gap:6px}",
  ".au-pill.au-run::before{content:\"\";width:5px;height:5px;border-radius:50%;background:var(--aurum-gold-strong);animation:au-pulse 1.2s ease-in-out infinite}",
  ".au-pill.au-err{color:var(--dsw-alias-state-error-primary);background:color-mix(in oklab,var(--dsw-alias-state-error-primary) 12%,transparent)}",
  "@keyframes au-pulse{50%{opacity:.25}}",
  /* P15 微调:展开/收合曲线改「两头慢中间快」(ease-in-out,用户指定)——
     原收合 .62,.04,.82,.28(快出慢收)与展开 .3,1.18(过冲回弹)统一为
     cubic-bezier(.45,0,.55,1);内容层同步(去回弹,保留延迟渐显) */
  ".au-x{display:grid;grid-template-rows:0fr;background:color-mix(in oklab,var(--dsw-alias-bg-base) 45%,transparent);transition:grid-template-rows .34s cubic-bezier(.45,0,.55,1)}",
  ".au-tool.au-open .au-x{grid-template-rows:1fr;transition:grid-template-rows .5s cubic-bezier(.45,0,.55,1)}",
  ".au-clip{overflow:hidden;min-height:0}",
  ".au-in{padding:11px 15px;border-top:1px dashed transparent;opacity:0;transform:translateY(-6px);transition:opacity .18s ease,transform .24s cubic-bezier(.45,0,.55,1)}",
  ".au-tool.au-open .au-in{opacity:1;transform:none;transition:opacity .4s .06s ease,transform .5s .04s cubic-bezier(.45,0,.55,1)}",
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
  ".au-ws-sbtn svg{width:13.5px;height:13.5px;display:block}",
  ".au-ws-input{width:0;opacity:0;min-width:0;height:100%;border:none;background:none;outline:none;font-size:12px;color:var(--dsw-alias-label-primary);padding:0;transition:width .32s cubic-bezier(.22,.8,.26,1),opacity .2s}",
  ".au-ws-search.au-open .au-ws-input{width:100%;opacity:1;padding:0 2px}",
  ".au-ws-input::placeholder{color:var(--dsw-alias-label-tertiary)}",
  ".au-ws-acts{display:flex;gap:1px;flex:none}",
  ".au-ws-ibtn{width:27px;height:27px;border:none;border-radius:8px;display:grid;place-items:center;color:var(--dsw-alias-label-tertiary);background:transparent;cursor:pointer;transition:.15s;padding:0}",
  ".au-ws-ibtn:hover{color:var(--aurum-gold);background:var(--dsw-alias-interactive-bg-hover-solid)}",
  ".au-ws-ibtn.au-on{color:var(--aurum-gold-strong)}",
  ".au-ws-ibtn svg{width:15px;height:15px;display:block}",
  ".au-ws-addrow{display:flex;align-items:center;gap:8px;margin:3px 12px 8px 16px;height:30px;flex:none;border-radius:9px;background:color-mix(in oklab,var(--aurum-gold) 8%,var(--dsw-alias-bg-layer-1));padding:0 10px;animation:au-pop .18s cubic-bezier(.22,.8,.26,1) both}",
  "@keyframes au-pop{from{opacity:0;transform:translateY(-4px)}}",
  ".au-ws-addrow svg{width:13px;height:13px;color:var(--aurum-gold-dim);flex:none;display:block}",
  ".au-ws-addrow input{flex:1;min-width:0;background:none;border:none;outline:none;font-family:var(--ds-font-family-code);font-size:11.5px;color:var(--dsw-alias-label-primary);padding:0}",
  ".au-ws-addrow input::placeholder{color:var(--dsw-alias-label-tertiary)}",
  ".au-ws-addhint{font-family:var(--ds-font-family-code);font-size:9.5px;color:var(--dsw-alias-label-tertiary);white-space:nowrap;flex:none}",
  ".au-ws-body{flex:1;overflow-y:auto;overflow-x:hidden;padding-bottom:8px;min-height:0}",
  ".au-wsg{margin-bottom:2px;position:relative}",
  ".au-wsg-head{display:flex;align-items:center;gap:7px;padding:9px 15px 5px;cursor:pointer;user-select:none;font-size:12px;color:var(--dsw-alias-label-tertiary);border:none;background:transparent;width:100%;text-align:left;border-radius:8px;position:relative}",
  ".au-wsg-head:hover{color:var(--dsw-alias-label-secondary)}",
  /* P15 前修订 IV:目录头图标 = 文件夹 ⇄ 折叠三角 交叉淡切。此前规则从未生效
     (Ic() 不挂类,两图标常显重叠)。非悬浮=文件夹;悬浮=三角(closed 指右 /
     open 指下);opacity+scale 双轴过渡 */
  ".au-ws-ic{position:relative;width:13px;height:13px;flex:none}",
  ".au-ws-ic svg{position:absolute;inset:0;margin:auto;width:13px;height:13px;transition:opacity .18s ease,transform .26s cubic-bezier(.22,.8,.26,1)}",
  ".au-ws-ic .au-fld{color:var(--aurum-gold-dim);opacity:1;transform:none}",
  ".au-ws-ic .au-chev2{color:var(--dsw-alias-label-tertiary);opacity:0;transform:scale(.55)}",
  ".au-wsg-head:hover .au-fld{opacity:0;transform:scale(.72)}",
  ".au-wsg-head:hover .au-chev2{opacity:1;transform:scale(1)}",
  ".au-wsg.au-closed .au-wsg-head:hover .au-chev2{opacity:1;transform:scale(1) rotate(-90deg)}",
  ".au-wsg-head b{font-weight:500;font-size:12.5px;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:var(--ds-font-family-code);color:inherit}",
  ".au-wsg-acts{display:flex;gap:1px;flex:none;opacity:0;transition:opacity .16s}",
  ".au-wsg:hover .au-wsg-acts,.au-wsg-acts:focus-within{opacity:1}",
  ".au-wsg-act{width:22px;height:22px;border:none;border-radius:7px;display:grid;place-items:center;color:var(--dsw-alias-label-tertiary);background:transparent;cursor:pointer;transition:.15s;padding:0}",
  ".au-wsg-act:hover{color:var(--aurum-gold-strong);background:var(--dsw-alias-interactive-bg-hover-solid)}",
  ".au-wsg-act svg{width:13px;height:13px;display:block}",
  ".au-wsg-rename{flex:1;min-width:0;font-family:var(--ds-font-family-code);font-size:11px;color:var(--dsw-alias-label-primary);background:color-mix(in oklab,var(--aurum-gold) 14%,var(--dsw-alias-bg-layer-1));border:1px solid transparent;border-radius:6px;padding:2px 6px;outline:none}",
  ".au-wsg.au-curgroup .au-wsg-head b{color:var(--dsw-alias-label-secondary)}",
  /* P15 前修订 IV:分组收合非线性动画 —— grid-rows 0fr⇄1fr 插值(容器),
     内容层渐隐;行级 stagger:animation-name 随 .au-closed 切换(closed 时
     none → 展开时 au-row-in),每次展开都逐行重播(纯 CSS 无需 JS 重挂载) */
  ".au-slist{display:grid;grid-template-rows:1fr;transition:grid-template-rows .42s cubic-bezier(.22,.9,.26,1)}",
  ".au-wsg.au-closed .au-slist{grid-template-rows:0fr}",
  ".au-slist-in{min-height:0;overflow:hidden;display:flex;flex-direction:column;padding:0 6px;opacity:1;visibility:visible;transition:opacity .26s ease .04s,visibility 0s .44s}",
  ".au-wsg.au-closed .au-slist-in{opacity:0;visibility:hidden;transition:opacity .18s ease,visibility 0s .18s}",
  ".au-wsg.au-closed .au-slist-in .au-srow{animation-name:none}",
  ".au-wsg:not(.au-closed) .au-slist-in .au-srow{animation:au-row-in .3s cubic-bezier(.22,.9,.3,1) both}",
  "@keyframes au-row-in{from{opacity:0;transform:translateX(-6px)}}",
  ".au-wsg:not(.au-closed) .au-slist-in .au-srow:nth-child(1){animation-delay:.02s}",
  ".au-wsg:not(.au-closed) .au-slist-in .au-srow:nth-child(2){animation-delay:.05s}",
  ".au-wsg:not(.au-closed) .au-slist-in .au-srow:nth-child(3){animation-delay:.08s}",
  ".au-wsg:not(.au-closed) .au-slist-in .au-srow:nth-child(4){animation-delay:.11s}",
  ".au-wsg:not(.au-closed) .au-slist-in .au-srow:nth-child(5){animation-delay:.14s}",
  ".au-wsg:not(.au-closed) .au-slist-in .au-srow:nth-child(6){animation-delay:.17s}",
  ".au-wsg:not(.au-closed) .au-slist-in .au-srow:nth-child(n+7){animation-delay:.2s}",
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
  ".au-s-menu svg{width:14px;height:14px;display:block}",
  ".au-s-actions{display:grid;grid-template-rows:0fr;transition:grid-template-rows .25s cubic-bezier(.62,.04,.82,.28)}",
  ".au-s-actions.au-open2{grid-template-rows:1fr}",
  ".au-s-clip{overflow:hidden;min-height:0}",
  ".au-s-actrow{display:flex;gap:4px;padding:2px 8px 8px 29px;flex-wrap:wrap}",
  ".au-s-abtn{height:26px;padding:0 10px;border:none;border-radius:8px;background:color-mix(in oklab,var(--dsw-alias-bg-layer-2) 60%,transparent);color:var(--dsw-alias-label-secondary);font:400 11.5px/1 var(--dsw-font-family);cursor:pointer;display:inline-flex;align-items:center;gap:5px;transition:color .15s,background .15s}",
  ".au-s-abtn:hover{color:var(--aurum-gold-strong);background:color-mix(in oklab,var(--aurum-gold) 12%,transparent)}",
  ".au-s-abtn.au-danger:hover{color:var(--dsw-alias-state-error-primary);background:var(--dsw-alias-interactive-bg-hover-danger)}",
  /* 分组截断「显示全部/收起」钮:mono 小字 tertiary,hover 金(无描边,随主题 token 双色自适应) */
  ".au-s-more{display:flex;align-items:center;justify-content:center;height:24px;margin:2px 0 3px;padding:0 8px;border:none;border-radius:8px;background:transparent;color:var(--dsw-alias-label-tertiary);font:400 11px/1 var(--ds-font-family-code);letter-spacing:.03em;cursor:pointer;transition:color .15s,background .15s}",
  ".au-s-more:hover{color:var(--aurum-gold-strong);background:var(--dsw-alias-interactive-bg-hover-solid)}",
  ".au-s-more:focus-visible{outline:none;box-shadow:0 0 0 2.5px color-mix(in oklab,var(--aurum-gold) 28%,transparent)}",
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
  ".au-ws-railbtn svg{width:17px;height:17px;display:block}",
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
  "body:not([data-ds-dark-theme]){--bg:oklch(94.5% .012 82);--bg-deep:oklch(92.5% .014 82);--surface:oklch(96.5% .008 82);--surface-2:oklch(92% .016 84);--rail-1:oklch(92.5% .014 82);--rail-2:oklch(94.5% .012 82);--rail-raised:oklch(98.5% .008 82);--fg:oklch(28% .05 330);--muted:oklch(46% .035 330);--faint:oklch(62% .03 330);--border:transparent;--border-soft:transparent;--gold:oklch(55% .115 80);--gold-strong:oklch(50% .12 78);--gold-dim:oklch(66% .11 82);--gold-ink:oklch(99% .005 85);--rose:oklch(58% .14 350);--rose-strong:oklch(53% .15 350);--success:oklch(52% .11 155);--danger:oklch(52% .16 18);--font-display:" + DISPLAY + ";--font-serif:" + SERIF + ";--font-ui:" + UI + ";--font-mono:" + MONO + "}",
  /* ── §5 尾部节点(整段拷贝)── */
  ".compress-head{display:flex;align-items:center;gap:8px;width:100%;padding:8px 4px;font-family:var(--font-mono);font-size:11.5px;color:var(--faint);letter-spacing:.04em;text-align:left;background:none;border:none;cursor:pointer}",
  ".compress-head:hover{color:var(--muted)}",
  ".compress-head .chev{width:12px;height:12px;transition:transform .25s;flex:none}",
  ".compress.open .compress-head .chev{transform:rotate(90deg)}",
  ".compress-head .in-tok{color:var(--faint)}",
  ".compress-body{display:none;margin-top:6px;padding:12px 16px;border-radius:12px;border:1px dashed var(--border-soft);background:var(--surface);font-family:var(--font-serif);font-size:13.5px;line-height:1.9;color:var(--muted);white-space:pre-wrap}",
  ".compress.open .compress-body{display:block}",
  ".row-err{display:flex;align-items:center;gap:10px;font-size:12.5px;color:var(--danger);border:1px solid transparent;background:oklch(69% .15 15 / .12);border-radius:11px;padding:9px 13px;font-family:var(--font-mono)}",
  ".row-err svg{width:14px;height:14px;flex:none;display:block}",
  ".row-err .pill{margin-left:auto}",
  ".row-retry{display:flex;align-items:center;gap:10px;font-size:12.5px;color:var(--muted);padding:2px 4px;font-family:var(--font-mono)}",
  ".row-retry svg{width:13px;height:13px;color:var(--gold-dim);flex:none;display:block}",
  ".row-retry b{color:var(--success);font-weight:500}",
  ".turn-tail{display:flex;align-items:center;gap:14px;margin:20px 0 6px;font-family:var(--font-ui);font-size:14px;line-height:1}",
  ".turn-tail .ln{flex:1;height:1px;background:color-mix(in oklab, var(--fg) 9%, transparent)}",
  ".turn-tail .tx{font-family:var(--font-mono);font-size:10.5px;line-height:1.34;color:var(--faint);letter-spacing:.06em;white-space:nowrap}",
  ".pill{font-family:var(--font-mono);font-size:10.5px;padding:2.5px 9px;border-radius:999px;border:1px solid var(--border);color:var(--muted);white-space:nowrap;flex:none}",
  ".pill.err{color:var(--danger);background:oklch(69% .15 15 / .12)}",
  ".pill.warn{color:var(--gold-strong);background:oklch(79% .13 84 / .13)}",
  ".ibtn{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;flex:none;color:var(--faint);background:none;border:none;cursor:pointer;padding:0;transition:.18s}",
  ".ibtn:hover{background:var(--surface-2);color:var(--gold)}",
  ".ibtn svg{width:15px;height:15px;display:block}",
  ".ibtn:disabled{opacity:.35;cursor:default}",
  ".a-actions{display:flex;gap:2px;margin-top:12px;opacity:0;transition:.2s}",
  ".a-actions .ibtn{width:27px;height:27px}",
  ".a-actions .ibtn svg{width:13px;height:13px;display:block}",
  "[data-chat-anchor-key]:hover .a-actions{opacity:1}",
  /* ── P11 修订:卡片间距收窄(用户要求)── 官方会话流列 gap16 是大头,
     叠加各卡自身 margin 后相邻工具卡实际隔 ~24px;gap 降 8 + 卡 margin 收拢
     → 相邻卡 ~10px。列 gap 同时管用户气泡/正文/尾节间距,整体一并收紧 */
  "body .Md3f7G_column{gap:4px}",
  /* ── md 装饰(scoped 到 assistant-step 节点,不伤工具卡/上下文行)── */
  /* 列宽对齐原型 .flow 内容宽 712:官方在 viewArea→root→scroll 多层重定义 token,
     就近继承压不过 —— 挂 [data-conversation-scroll] 结构锚并对全部后代逐元素定义
     (自有定义恒胜继承,且不耦合混淆类名) */
  "body [data-conversation-scroll],body [data-conversation-scroll] *{--dsh-chat-content-width:712px}",
  /* P15 追补 II:assistant 节鲸鱼头像移除(用户指定,原型无此物)—— 金圈/鲸鱼 mask/42px 缩进全撤 */
  "[data-chat-flow-kind=assistant-step]{position:relative}",
  "[data-chat-flow-kind=assistant-step] :is(ul,ol){margin:2px 0 12px 4px;list-style:none;padding:0}",
  "[data-chat-flow-kind=assistant-step] li{position:relative;padding-left:18px;margin-bottom:7px;color:var(--muted);list-style:none;font:400 15px/1.95 var(--font-serif)}",
  "[data-chat-flow-kind=assistant-step] li::before{content:\"◆\";position:absolute;left:0;top:0;font-size:8px;color:var(--gold-dim);line-height:2.6}",
  "[data-chat-flow-kind=assistant-step] li b{color:var(--fg);font-weight:500}",
  "body [data-chat-flow-kind=assistant-step] :not(pre)>code{font-family:var(--font-mono);font-size:12.5px!important;line-height:1.36;color:var(--gold);background:var(--surface-2);border-radius:6px;padding:1px 6px}",
  /* P15 追补 VIII:表格可读性重制(2026-08-25,用户报分割线看不到)──
     P15 微调 v1 根因判断无误(--dsw-alias-border-* 被无描边原则置空,官方 md
     表格 td/th 消费之),但 fg 12% tint 在深底(L0.21)仅提亮约 9 个百分点,
     1px 线肉眼不可见。本次:横线 fg 22% / 竖线 fg 16% 分档(border-color 双值),
     表头底线鎏金化(gold 45% 1.5px),偶数行 surface-2 45% 斑马 tint;
     修 v1 选择器误伤 —— tr:first-child td 同时命中普通表格首行数据
     (实测首行数据格吃到表头底色),收窄为 table>tbody:first-child>tr:first-child
     (仅无 thead 的表把首行按表头处理);撤 table 级 13px 字号 —— 官方
     --dsw-font-markdown-table(14.5px/25px serif)以 font shorthand 直落
     单元格,恒胜继承,实测 td 14.5px,留着误导 */
  "body [data-chat-flow-kind=assistant-step] table{border-collapse:collapse;margin:8px 0 14px}",
  "body [data-chat-flow-kind=assistant-step] th,body [data-chat-flow-kind=assistant-step] td{padding:6px 12px;text-align:left;border-style:solid;border-width:1px;border-color:color-mix(in oklab, var(--fg) 22%, transparent) color-mix(in oklab, var(--fg) 16%, transparent)}",
  "body [data-chat-flow-kind=assistant-step] thead th{background:color-mix(in oklab, var(--surface-2) 70%, transparent);color:var(--fg);font-weight:500;border-bottom:1.5px solid color-mix(in oklab, var(--gold) 45%, transparent)}",
  "body [data-chat-flow-kind=assistant-step] table>tbody:first-child>tr:first-child td{background:color-mix(in oklab, var(--surface-2) 70%, transparent);color:var(--fg);font-weight:500;border-bottom:1.5px solid color-mix(in oklab, var(--gold) 45%, transparent)}",
  "body [data-chat-flow-kind=assistant-step] tbody tr:nth-child(even) td{background:color-mix(in oklab, var(--surface-2) 45%, transparent)}",
  /* ── 滚动条几何(原型 §2)── */
  "body ::-webkit-scrollbar{width:10px;height:10px}",
  "body ::-webkit-scrollbar-thumb{background:color-mix(in oklab, var(--muted) 26%, transparent);border-radius:8px;border:3px solid transparent;background-clip:content-box}",
  "body ::-webkit-scrollbar-thumb:hover{background:var(--gold-dim);border:3px solid transparent;background-clip:content-box}",
  "body ::-webkit-scrollbar-track{background:transparent}",
  /* ── P8c · §4 折叠细条(原型 .sb-rail 子钮,整段拷贝;容器=存量 .au-ws-rail)── */
  ".rail-btn{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;flex:none;color:var(--muted);transition:.18s;background:none;border:none;cursor:pointer;padding:0}",
  ".rail-btn:hover{background:var(--surface-2);color:var(--fg)}",
  ".rail-btn:active{transform:scale(.96)}",
  ".rail-btn svg{width:17px;height:17px;display:block}",
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
  /* P27:row-menu 扩展条目容器 —— 纯 key 锚/display:contents,插件行自带样式 */
  ".au-menu-x{display:contents}",
  /* P27 补 · 注入行归流 .mi 视觉(用户报:插件行与菜单其他项风格不同)——
     插件行自带官方单元格规格(14px 字/22px 行高/min-h40/16px 图标/
     label-primary 近黑色/官方中性 hover),混进 .mi 菜单显大显黑显高;
     outlet 级通用归流:任意注册进 row-menu 的 role=menuitem 按钮统一
     aurum 菜单项几何与金 hover(选择器 0,3,1 压过插件自带 0,1,0/0,2,0;
     dsh-open-in-vscode 的 16px 图标 span 同步收 13 对齐图标列);
     注:官方 code 图标本体即井号造型(IconCodeOutline16),非乱码 */
  /* P27b 补 · 归流规则并入 button reset(display/background/border/width/
      cursor/text-align/transition)—— 原假设「注入行自带官方单元格规格」被裸
      button 注册打破(UA 默认灰底+边框+非 flex 露出,用户报「圆角矩形包裹」);
      vscode 行自带同值零变化,裸行被彻底归一为 .mi 同款 */
  ".menu [data-slot=\"sidebar.workspaces.row-menu\"] button[role=\"menuitem\"]{display:flex;align-items:center;width:100%;text-align:left;background:none;border:none;cursor:pointer;transition:background .15s,color .15s;font-family:var(--font-ui);font-size:12.5px;line-height:1.4;min-height:0;padding:8px 11px;gap:9px;border-radius:8px;color:var(--muted)}",
  ".menu [data-slot=\"sidebar.workspaces.row-menu\"] button[role=\"menuitem\"]:hover{background:oklch(79% 0.13 84 / .1);color:var(--fg)}",
  ".menu [data-slot=\"sidebar.workspaces.row-menu\"] button[role=\"menuitem\"] svg{width:13px;height:13px;color:var(--faint);flex:none}",
  ".menu [data-slot=\"sidebar.workspaces.row-menu\"] button[role=\"menuitem\"]:hover svg{color:var(--gold-strong)}",
  ".menu [data-slot=\"sidebar.workspaces.row-menu\"] button[role=\"menuitem\"]:focus-visible{outline-color:var(--aurum-focus)}",
  ".menu [data-slot=\"sidebar.workspaces.row-menu\"] .dsh-open-in-vscode-icon{width:13px;height:13px}",
  /* P27b · aurum.workspaces.menu-extra(list 槽)注入行归流 —— 与 row-menu 同款
     .mi 几何/金 hover,两 outlet 同处 .au-menu-x 扩展区视觉无差别 */
  ".menu [data-slot=\"aurum.workspaces.menu-extra\"] button[role=\"menuitem\"]{display:flex;align-items:center;width:100%;text-align:left;background:none;border:none;cursor:pointer;transition:background .15s,color .15s;font-family:var(--font-ui);font-size:12.5px;line-height:1.4;min-height:0;padding:8px 11px;gap:9px;border-radius:8px;color:var(--muted)}",
  ".menu [data-slot=\"aurum.workspaces.menu-extra\"] button[role=\"menuitem\"]:hover{background:oklch(79% 0.13 84 / .1);color:var(--fg)}",
  ".menu [data-slot=\"aurum.workspaces.menu-extra\"] button[role=\"menuitem\"] svg{width:13px;height:13px;color:var(--faint);flex:none}",
  ".menu [data-slot=\"aurum.workspaces.menu-extra\"] button[role=\"menuitem\"]:hover svg{color:var(--gold-strong)}",
  ".menu [data-slot=\"aurum.workspaces.menu-extra\"] button[role=\"menuitem\"]:focus-visible{outline-color:var(--aurum-focus)}",
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
  /* ── P21 · todo-bar 折叠(用户指定):头部行常显(清单 n/m + 进度条 + 折叠钮),
     胶囊区收进 .todo-foldwrap grid 0fr⇄1fr(与侧栏 .au-slist 同机构);折叠钮
     chevdown 收起转 -90° 指右(与分组头 chev2 同语言);flex-basis:100% 独占
     换行,折叠后高度 0(min-height:38 头部行兜底)── */
  ".todo-fold{margin-left:auto;flex:none;width:22px;height:22px;border:none;border-radius:7px;display:grid;place-items:center;background:transparent;color:var(--muted);cursor:pointer;transition:color .15s,background .15s;padding:0}",
  ".todo-fold:hover{color:var(--gold-strong);background:color-mix(in oklab, var(--gold) 13%, var(--surface-2))}",
  ".todo-fold:focus-visible{outline:none;box-shadow:0 0 0 2.5px color-mix(in oklab, var(--gold) 28%, transparent)}",
  ".todo-fold svg{width:13px;height:13px;display:block;transition:transform .26s cubic-bezier(.22,.8,.26,1)}",
  ".todo-bar.au-tdclosed .todo-fold svg{transform:rotate(-90deg)}",
  ".todo-bar{row-gap:0}",
  ".todo-foldwrap{flex-basis:100%;min-width:0;display:grid;grid-template-rows:1fr;margin-top:11px;transition:grid-template-rows .32s cubic-bezier(.22,.8,.26,1),margin-top .32s cubic-bezier(.22,.8,.26,1)}",
  ".todo-bar.au-tdclosed .todo-foldwrap{grid-template-rows:0fr;margin-top:0}",
  ".todo-foldin{min-height:0;overflow:hidden;opacity:1;transition:opacity .2s ease .05s}",
  ".todo-bar.au-tdclosed .todo-foldin{opacity:0;transition:opacity .14s ease}",
  /* ── P14 · 响应式降档(原型 §10;抽屉不适用:官方 ≤900 自动 68px 折叠轨,
     无抽屉 DOM —— 跟随官方折叠行为,只做逐档降密度)── */,
  /* P15 追补 VI:窄屏 header 上下两行 —— 上行标题,下行 tabs+按钮(修标题被挤) */
  "@media (max-width:820px){",
  "body .wSkVaW_header{flex-direction:column;align-items:stretch;gap:2px;height:auto;min-height:70px;padding:10px 14px 8px}",
  "body .wSkVaW_titleRow{display:flex!important;flex-direction:row;align-items:center}",
  "body .wSkVaW_titleCluster{flex:1;min-height:24px}",
  "body .wSkVaW_tabs{order:1;margin-right:10px}",
  "body .wSkVaW_headerUtilities{order:2}",
  "body .wSkVaW_headerActions{order:2}",
  "body .wSkVaW_tabs,body .wSkVaW_headerUtilities,body .wSkVaW_headerActions{align-self:center}",
  "body .wSkVaW_scrollBody{padding-top:190px;mask-image:linear-gradient(180deg,transparent 0px,#000 160px);-webkit-mask-image:linear-gradient(180deg,transparent 0px,#000 160px)}",
  /* 底部渐隐纱窄屏覆写已删(修订 XIII 起):主档 height:100% + 0→100% 渐变
     本就随座位高度自适应,窄屏无需再覆写,避免日后主档调参窄屏悄悄分叉 */
  /* 窄屏档:旧 viewArea/Md3f7G_root 让位已随官方 DOM 升级删除(同主档追补) */
  /* P15 追补 IX:追补 VI 的 @media(max-width:820px) 在此闭合 —— 原先漏了配对 "}",
     一路吞到追补 V 抽屉块自己的 "}"(只闭了内层),外层被 EOF 静默闭合;导致
     P11 .kid 子调用样式、P10 todo-bar 宽度适配、全局 reduced-motion 全部只对
     ≤820 生效,桌面端失效 —— todo 面板 flex:1 在 composerStack 行向 flex 里
     拉满整行(实测 1150px vs 输入卡 780px),即用户报"横向占据整个容器" */
  "}",
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
  "@media (prefers-reduced-motion:reduce){[data-chat-anchor-key]{animation:none}.compress-head .chev{transition:none}.a-actions{transition:none}.au-ws-rail,.au-ws.au-ws-wide,.menu.open{animation:none!important}.goal-fill{transition:none}.au-slist,.au-slist-in,.au-ws-ic svg{transition:none!important}.todo-foldwrap,.todo-foldin,.todo-fold svg{transition:none!important}.au-wsg:not(.au-closed) .au-slist-in .au-srow{animation:none!important}}",
  /* ── P15 追补 V · 移动端(≤820)顶栏 + 抽屉(用户指定):官方 ≤900 自动折叠
     68px 竖轨占屏;窄屏改为 grid 两行 —— 侧栏列 = 48px 顶栏(rail 横排钮组,
     rail-logo 即抽屉开关),完整浏览器自左侧抽屉滑入(遮罩/Esc/选中关闭)── */
  "@media (max-width:820px){",
  "body [data-slot=root]>div,body [data-slot=root]>div[data-sidebar-collapsed]{grid-template-columns:1fr!important;grid-template-rows:48px minmax(0px,1fr)!important}",
  "body [data-slot=root]>div>div:first-child{grid-row:1;padding:0!important;overflow:visible}",
  "body [data-slot=root]>div>div:nth-child(2){grid-row:2;min-height:0}",
  "body [data-slot=root]>div>div:nth-child(3){display:none!important}",
  "body [data-slot=sidebar]>div:first-child{border-radius:0;box-shadow:none;width:auto!important;height:48px}",
  "body [data-slot=sidebar]>div:first-child[class*=collapsed]{width:auto!important;margin:0;border-radius:0}",
  "body [data-slot=sidebar] .hHd-Xa_root{flex-direction:row;align-items:center;gap:6px;height:48px;padding:0 8px 0 10px}",
  "body [data-slot=sidebar] [class*=regionArea]{flex:0 0 auto;padding:0;overflow:visible}",
  "body [data-slot=sidebar] [class*=footArea]{margin-left:auto;border-top:none;padding:0;flex-direction:row;gap:4px}",
  "body [data-slot=sidebar] [class*=footerActions],body [data-slot=sidebar] [class*=settingsArea]{flex-direction:row}",
  "body [data-slot=sidebar] button.VOzbGW_trigger{width:auto!important;height:38px;padding:0 10px}",
  ".au-ws-rail{flex-direction:row;gap:4px;padding:0;animation:none}",
  ".rail-flex{display:none}",
  ".rail-btn,.rail-logo{width:36px;height:36px}",
  ".aurum-footRow.au-rail{width:36px;height:36px}",
  "}",
  ".au-drawer-scrim{position:fixed;inset:0;z-index:70;background:oklch(8% .02 330 / .5);animation:au-scrim-in .24s ease both}",
  ".au-drawer{position:fixed;left:10px;top:10px;bottom:10px;z-index:80;width:min(320px,86vw);display:flex;flex-direction:column;border-radius:20px;overflow:hidden;background:linear-gradient(180deg,var(--aurum-rail-1),var(--aurum-rail-2) 36%);box-shadow:var(--aurum-rail-shadow);animation:au-drawer-in .32s cubic-bezier(.22,.8,.26,1) both}",
  ".au-drawer .au-ws.au-ws-wide{animation:none}",
  "@keyframes au-drawer-in{from{transform:translateX(-26px);opacity:0}}",
  "@keyframes au-scrim-in{from{opacity:0}}",
  "@media (prefers-reduced-motion:reduce){.au-drawer,.au-drawer-scrim{animation:none}}",

];

/* P16 修订 VII/VIII:assistant 正文错峰阶梯 —— MarkdownText 块级子元素
   nth-child 1-12 ×70ms(12+ 由基规则恒 .77s);限定 [data-streaming](流式期,
   结算/历史挂载不重播);生成后随 CSS 数组拼接,避免手写 12 条 */
const AU_MD_STAGGER = [];
for (let i = 1; i <= 12; i++) {
  AU_MD_STAGGER.push("body [data-chat-flow-kind=assistant-step] .Sxvs8a_root[data-streaming] div[class*=_markdown_]>*:nth-child(" + i + "){animation-delay:" + ((i - 1) * 70) + "ms}");
}

const CSS = CSS1.concat(CSS2, CSS3, AU_MD_STAGGER).join("\n");

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
  const dark = snap.mode === "dark";
  const wide = props.wide !== false;
  /* P15 前修订 V:文案去「鎏金」(用户指定)—— 显示态就叫深色/浅色主题;
     P23:override 层随插件常驻,不存在「非 aurum 态」,启用文案分支删除 */
  const label = dark ? "深色主题" : "浅色主题";
  const title = dark ? "切换到浅色主题" : "切换到深色主题";
  return h("button", { type: "button", className: "aurum-footRow" + (wide ? "" : " au-rail"), title: title, "aria-label": title, onClick: function () { props.api.toggle(); } }, dark ? h(MoonIcon) : h(SunIcon), wide ? h("span", null, label) : null);
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
function Ic(kind, cls) {
  /* P15 前修订 VI:官方组件优先 —— 外层 span 承接交叉淡切类(au-fld/au-chev2),
     svg 的 stroke=currentColor 沿色链继承;渲染尺寸由既有 CSS 控制
     (css 覆盖 svg 的 size 属性,viewBox 不失真) */
  const C = AU_PI && AU_PI[AU_ICON_OFFICIAL[kind]];
  if (C) return h("span", cls ? { className: cls } : null, h(C, { size: 16 }));
  const a = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" };
  if (cls) a.className = cls;
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
  /* P11 修订:兜底工具图标 = 双四角星(用户指定)—— 大星左下 + 小星右上 */
  if (kind === "stars") return h("svg", Object.assign({}, a, { fill: "currentColor", stroke: "none" }),
    h("path", { d: "M10 5C10.9 10.3 13.7 13.1 19 13 13.7 13.9 10.9 16.7 10 22 9.1 16.7 6.3 13.9 2 13 6.3 13.1 9.1 10.3 10 5Z" }),
    h("path", { d: "M19 2C19.4 4.5 20 5.1 22.5 5.5 20 5.9 19.4 6.5 19 9 18.6 6.5 18 5.9 15.5 5.5 18 5.1 18.6 4.5 19 2Z" }));
  /* P16:think 卡兜底图标(官方 IconThinkOutline14 缺席时)—— 思绪灯泡 */
  if (kind === "think") return h("svg", a, h("path", { d: "M9.5 18h5M10.5 21h3M12 3a6 6 0 0 1 3.9 10.6c-.6.5-.9 1.4-.9 2.4h-6c0-1-.3-1.9-.9-2.4A6 6 0 0 1 12 3Z" }));
  /* P17:压缩卡图标(官方 IconApiOutline14 缺席时兜底)—— 层叠菱形(上下文归档语义) */
  if (kind === "compact") return h("svg", a, h("path", { d: "M12 3 3 7.5l9 4.5 9-4.5L12 3Z" }), h("path", { d: "m3 12 9 4.5L21 12" }), h("path", { d: "m3 16.5 9 4.5 9-4.5" }));
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
      h("span", { className: "au-ws-ic" }, Ic("chevdown", "au-chev2"), Ic(closed ? "folder" : "folderopen", "au-fld")),
      renaming
        ? h("input", { className: "au-wsg-rename", value: rv, autoFocus: true, spellCheck: false, onChange: function (e) { props.onRenameValue(e.target.value); }, onClick: function (e) { e.stopPropagation(); }, onKeyDown: function (e) { if (e.key === "Enter") { e.preventDefault(); props.onRenameCommit(); } if (e.key === "Escape") { e.preventDefault(); props.onRenameCancel(); } }, onBlur: function () { props.onRenameCommit(); } })
        : h("b", null, g.label),
      renaming ? null : h("span", { className: "au-wsg-acts" },
        props.menuSlot,
        g.ws ? h("button", { type: "button", className: "au-wsg-act", title: "在此目录新建会话", "aria-label": "在此目录新建会话", onClick: function (e) { e.stopPropagation(); au.startSession(g.ws.workspaceId); } }, Ic("plus")) : null)),
    /* P15 前修订 IV:children 保留挂载(不随 closed 卸载),收合交给
       .au-slist grid-rows 插值 + .au-slist-in 渐隐;行级 stagger 见 CSS
       (animation-name 随 .au-closed 切换,每次展开重播) */
    h("div", { className: "au-slist" }, h("div", { className: "au-slist-in" }, props.children)));
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
  /* 分组会话截断:默认每组只显前 5 行;more[key] 记录已展开全部的分组(不持久化) */
  const moreSt = React.useState({});
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
  const more = moreSt[0], setMore = moreSt[1];

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

  /* P19 · 添加工作区一键目录选择:优先 host pickDirectory(系统原生文件夹选择框,
     本机 127.0.0.1+Windows 即用户眼前弹出),选中即以绝对路径 create(选完即开);
     取消(null)静默无操作;picker 不可用或服务缺失时回退展开手动输入行 */
  const addViaPicker = function () {
    if (typeof au.pickWorkspaceDirectory !== "function") { setAddOpen(!addOpen); return; }
    Promise.resolve(au.pickWorkspaceDirectory()).then(function (p) {
      if (p === null || p === undefined || p === "") return;
      Promise.resolve(au.createWorkspace(p)).catch(function (e) { console.error("aurum: createWorkspace failed", e); });
    }).catch(function (e) {
      console.error("aurum: pickDirectory failed", e);
      setAddOpen(true);
    });
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
    /* 定位经验式,与 .mi/.menu CSS 几何隐式耦合:37 ≈ 单菜单项高(padding 8×2 +
       行高 + 呼吸),186 = .menu min-width,194 = 186 + 右侧 8px 余量 ——
       改 .mi/.menu 几何时需同步此两式(评审扫尾补注) */
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
      /* P27 终审(用户决策):自有两项(重命名/删除)之间不加分隔线,紧凑排列;
         分隔线只用于隔开尾接的扩展注入行 */
      out.push(auMi("del", del === g.key ? "确认删除工作区?" : "删除工作区", { icon: Ic("error"), danger: true, onClick: function () { if (del === g.key) { au.deleteWorkspace(g.ws.workspaceId); closeMenu(); } else setDel(g.key); } }));
      /* P27 · 官方 row-menu 扩展点承接:插件注入行尾接在 aurum 自有菜单项之后。
         门控:在册条目 >0 且工作区有目录(插件行 cwd 缺失时自渲染 null,提前
         拦下免得分隔线悬空);owner share 按官方契约 = cwd(绝对路径)/label
         (显示名)/onClose(点击后关菜单)。renderSlot 面来自 children 声明
         (见 apply 侧 P27),官方运行时将来自己声明该子槽时 aurum 让位、面缺席
         则静默跳过。容器 .au-menu-x 仅 display:contents,不引额外布局。 */
      if (g.ws.path && typeof props.renderSlot === "function" && (au.rowMenuCount() > 0 || au.extraMenuCount() > 0)) {
        out.push(auSep("wx"));
        out.push(h("div", { key: "wx-rows", className: "au-menu-x" },
          props.renderSlot("sidebar.workspaces.row-menu", { cwd: g.ws.path, label: g.label, onClose: closeMenu }),
          props.renderSlot("aurum.workspaces.menu-extra", { cwd: g.ws.path, label: g.label, onClose: closeMenu })));
      }
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
        /* 分组截断(用户需求):默认每组只显前 5 行,尾部「显示全部 N 条」/
           「收起」按钮切换;搜索/平铺视图不截断(分支隔离);不持久化 */
        const gAll = more[g.key] === true;
        const shown = gAll ? g.sessions : g.sessions.slice(0, 5);
        const rows = shown.map(function (s) { return renderRow({ s: s, wsLabel: null }, g, true); });
        if (g.sessions.length > 5) rows.push(h("button", { key: "__more__", type: "button", className: "au-s-more", "aria-expanded": gAll ? "true" : "false", onClick: function () { setMore(function (m) { const n = Object.assign({}, m); if (n[g.key]) delete n[g.key]; else n[g.key] = true; return n; }); } }, gAll ? "收起" : "显示全部 " + g.sessions.length + " 条"));
        return h(AuGroup, {
          key: g.key, g: g, au: au, closed: closed[g.key] === true, containsCurrent: g.containsCurrent,
          menuSlot: h("button", { type: "button", className: "au-wsg-act", title: "目录操作", "aria-label": "目录操作", onClick: function (e) { e.stopPropagation(); const r = e.currentTarget.getBoundingClientRect(); setMenu({ kind: "ws", id: g.key, x: r.right, y: r.bottom + 4, anchorBottom: r.top }); } }, Ic("dots")),
          onToggle: function () { setClosed(function (c) { const n = Object.assign({}, c); if (n[g.key]) delete n[g.key]; else n[g.key] = true; return n; }); },
          renaming: ren !== null && ren.kind === "ws" && ren.id === g.key, renameValue: renVal,
          onRenameStart: function () { startRename("ws", g.key, g.label); },
          onRenameValue: setRenVal, onRenameCommit: commitRename, onRenameCancel: function () { setRen(null); }
        }, rows);
      }));

  return h("div", { className: "au-ws au-ws-wide" },
    h("div", { className: "au-ws-head" + (searchOpen ? " au-searching" : "") },
      h("span", { className: "au-ws-label" }, "工作区"),
      h("div", { className: "au-ws-search" + (searchOpen ? " au-open" : "") + (q !== "" ? " au-hasq" : "") },
        h("button", { type: "button", className: "au-ws-sbtn", title: "搜索会话", "aria-label": "搜索会话", onClick: function () { if (searchOpen && q === "") setSearchOpen(false); else setSearchOpen(true); } }, Ic("search")),
        h("input", { ref: inputRef, className: "au-ws-input", value: query, placeholder: "搜索会话…", type: "text", autoComplete: "off", onChange: function (e) { setQuery(e.target.value); }, onKeyDown: function (e) { if (e.key === "Escape") { setQuery(""); setSearchOpen(false); } if (e.key === "Enter" && results !== null && results.length > 0) au.open(results[0].s.id); } })),
      h("div", { className: "au-ws-acts" },
        h("button", { type: "button", className: "au-ws-ibtn" + (flat ? " au-on" : ""), title: "视图选项", "aria-label": "视图选项", onClick: function (e) { const r = e.currentTarget.getBoundingClientRect(); setHeadMenu({ x: r.right, y: r.bottom + 4, anchorBottom: r.top }); } }, Ic("view")),
        h("button", { type: "button", className: "au-ws-ibtn", title: "添加工作区", "aria-label": "添加工作区", onClick: addViaPicker }, Ic("folderplus")))),
    addOpen ? h("div", { className: "au-ws-addrow" }, Ic("folder"),
      h("input", { value: addPath, placeholder: "输入路径，如 ~/repos/项目名", type: "text", spellCheck: false, autoComplete: "off", autoFocus: true, onChange: function (e) { setAddPath(e.target.value); }, onKeyDown: function (e) { if (e.key === "Enter") { e.preventDefault(); commitAdd(); } if (e.key === "Escape") { setAddOpen(false); setAddPath(""); } } }),
      h("span", { className: "au-ws-addhint" }, "↵ 添加 · Esc 取消")) : null,
    h("div", { className: "au-ws-body" }, body),
    menu !== null ? renderFmenu(menu, menuItemsFor(menu)) : null,
    headMenu !== null ? renderFmenu(headMenu, viewMenuItems()) : null);
}

/* ═══ P15 追补 V · 移动端(≤820):侧栏列 → 顶栏(rail 横排),rail-logo 点按开
   左侧抽屉(内嵌 AuBrowserWide 完整浏览器);搜索钮复用 __auFocusSearch 握手
   (抽屉挂载后 300ms 聚焦);Esc/遮罩/选中会话后自动关闭 ═══ */
function AuIsNarrow() {
  const st = React.useState(function () { return window.matchMedia("(max-width:820px)").matches; });
  React.useEffect(function () {
    const mq = window.matchMedia("(max-width:820px)");
    const fn = function (e) { st[1](e.matches); };
    if (mq.addEventListener) mq.addEventListener("change", fn); else mq.addListener(fn);
    return function () { if (mq.removeEventListener) mq.removeEventListener("change", fn); else mq.removeListener(fn); };
  }, []);
  return st[0];
}
function AuBrowserMobile(props) {
  const st = React.useState(false);
  const open = st[0];
  React.useEffect(function () {
    if (!open) return;
    const onKey = function (e) { if (e.key === "Escape") st[1](false); };
    document.addEventListener("keydown", onKey);
    return function () { document.removeEventListener("keydown", onKey); };
  }, [open]);
  const toggle = function () { st[1](!open); };
  const railProps = Object.assign({}, props, { expandSidebar: toggle, _mobileBar: true });
  return h(React.Fragment, null,
    h(AuBrowserRail, railProps),
    open ? h("div", { className: "au-drawer-scrim", onClick: function () { st[1](false); } }) : null,
    open ? h("div", { className: "au-drawer", onClick: function (e) {
      if (e.target && e.target.closest && e.target.closest(".au-srow")) setTimeout(function () { st[1](false); }, 160);
    } }, h(AuBrowserWide, { useSessions: props.useSessions, useWorkspaces: props.useWorkspaces, au: props.au, renderSlot: props.renderSlot })) : null);
}
function AuBrowser(props) {
  const wide = props.wide !== false;
  const au = props.au;
  if (!wide) {
    if (typeof window !== "undefined" && window.matchMedia && AuIsNarrow()) return h(AuBrowserMobile, props);
    return h(AuBrowserRail, props);
  }
  if (typeof props.useSessions !== "function" || typeof props.useWorkspaces !== "function") {
    return h("div", { className: "au-ws-empty" }, "…");
  }
  /* P27:renderSlot 面(kit 由 children 声明带来)线程传给 wide 浏览器,
     工作区 … 菜单用它渲染 sidebar.workspaces.row-menu 注入行 */
  return h(AuBrowserWide, { useSessions: props.useSessions, useWorkspaces: props.useWorkspaces, au: au, renderSlot: props.renderSlot });
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
    h("button", { type: "button", className: "rail-logo", title: props._mobileBar ? "打开历史会话" : "展开侧栏", "aria-label": props._mobileBar ? "打开历史会话" : "展开侧栏", onClick: function () { expand(); } },
      h("svg", { className: "rl-whale", viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true" }, h("path", { d: AU_WHALE_PATH })),
      h("svg", { className: "rl-panel", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" },
        h("rect", { x: 3, y: 4, width: 18, height: 16, rx: 3 }), h("path", { d: "M9.5 4v16" }), h("path", { d: "M13 12h4.5" }), h("path", { d: "m15.5 9.5 2.5 2.5-2.5 2.5" }))),
    h("button", { type: "button", className: "rail-btn rail-new", title: "新建会话", "aria-label": "新建会话", onClick: function () { au.startSession(curWsId); } },
      h("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", "aria-hidden": "true" }, h("path", { d: "M12 5v14M5 12h14" }))),
    h("button", { type: "button", className: "rail-btn", title: "搜索会话", "aria-label": "搜索会话", onClick: function () { window.__auFocusSearch = true; expand(); } }, Ic("search")),
    h("div", { className: "rail-flex" }));
}

/* ═══ P15 前修订 · 品牌字标布局锚点(原型 .sb-brand 原则)═══
   官方 sidebar.brand.name 槽位的匿名 wrapper(无类名 div)+ BrandWordmark svg
   会随卡宽被 flex 压缩(meet 缩字)。原型方案 = svg 定宽 + flex:none 永不收缩,
   窄卡由卡片 overflow:hidden 自然裁尾。锚点 CSS 见 CSS1 P15 前修订段。 */

function AuImg(props) {
  const att = props.attachment;  const load = props.loadImage;
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
/* P15 追补 III:上下文注入卡 = au-tool 同款卡壳(替换 ◈ 平步行)——
   header(官方 Sparkle + 「上下文注入」+ 首行摘要 + chevron)点击展开全文,
   grid 收合曲线与工具卡一致(ease-in-out) */
function AuContext(props) {
  const node = props.node || {};
  const data = node.data || node;
  const txt = auText(data.content);
  if (!txt) return null;
  const st = React.useState(false);
  const open = st[0];
  const fl = auFirstLine(txt);
  const em = fl.length > 56 ? fl.slice(0, 53) + "…" : fl;
  return h("div", { className: "au-ctx-card" + (open ? " au-open" : "") },
    h("div", { className: "au-main", onClick: function () { st[1](!open); } },
      h("span", { className: "au-ico" }, Ic("stars")),
      h("span", { className: "au-txt" }, h("span", { className: "au-name" }, "上下文注入", h("em", null, em))),
      h("span", { className: "au-chev" }, Ic("chevron"))),
    h("div", { className: "au-x" }, h("div", { className: "au-clip" }, h("div", { className: "au-in" }, h("div", { className: "au-ctx-full" }, txt)))));
}

/* ═══ P16 · think 卡接管(遮蔽 assistant-step;AuThinkCard 原型 .reasoning 类名)═══
   数据契约(逆向自官方 AssistantNodeView/AssistantMarkdown/ReasoningRow 快照):
   - assistant-step: node.data = { blocks:[{kind:"text"|"reasoning"|"image"|"tool-call",…}],
                     status:"running"|"interrupted"|…, finalNode? };node.location.turn
   - reasoning 块:   text = 完整/流式推理文本;running = streaming 且为最后一个块
   行为(用户指定 2026-08-25 修订):
   - 运行态:卡片保持折叠壳;单行实时流 = latestLine,行号作 key —— 每换一行 remount
     重播入场动画(不透明→透明 叠加模糊消散)=「每行文字错峰入场」;图标金色呼吸;
     不随单行文本量横向滚动(长行原地裁切,起点恒左对齐);
   - 思考结束:自动收拢(点开的展开态也收起),摘要 = firstLine;
   - 正文(P16 修订 VII 定案):thinking 展开体 = 普通 pre-wrap 文本,无动画
     (修订 IV/V/VI 的 .r-line 行级级联全撤 —— 用户澄清「正文」指模型输出
     的 markdown,非 thinking 内容;错峰级联移至 AuAssistantMarkdown 渲染的
     MarkdownText 块级子元素,CSS 阶梯见 CSS1 P16 修订 VII 段);
   - text 块委托官方 MarkdownText(primitives 通道)、image 块走 AuImg,视觉不变 */
/* P17:auT 增补可选插值参数(对齐官方 t(key, params) 调用,如 compaction.completed) */
function auT(t, key, zh, params) {
  try { const v = typeof t === "function" ? t(key, params || undefined) : undefined; return typeof v === "string" && v ? v : zh; } catch (e) { return zh; }
}
function AuThinkCard(props) {
  const text = typeof props.text === "string" ? props.text : "";
  const running = props.running === true;
  const st = React.useState(false);
  const open = st[0], setOpen = st[1];
  const prevRun = React.useRef(running);
  React.useEffect(function () {
    if (prevRun.current && !running) setOpen(false); /* P16:思考结束自动收拢 */
    prevRun.current = running;
  }, [running]);
  const visible = text.trimEnd();
  const nl = visible.lastIndexOf("\n");
  const summary = running ? (nl === -1 ? visible : visible.slice(nl + 1)) : auFirstLine(text);
  const lineIdx = visible.split("\n").length; /* 行号 key:同行流式追加不重播,换行才 remount */
  return html`<div className=${"reasoning" + (open ? " open" : "")} data-state=${running ? "running" : "ok"}>
    <button type="button" className="reasoning-head" aria-expanded=${open ? "true" : "false"} onClick=${function () { setOpen(!open); }}>
      <span className="au-ico r-ico">${Ic("think")}</span>
      <span className="r-title">Think</span>
      ${running ? html`<span className="au-sr">${auT(props.t, "row.running", "运行中")}</span>` : null}
      <span className="r-live-wrap">${running
        ? html`<span className="r-live" key=${"L" + lineIdx}>${summary}</span>`
        : html`<span className="r-sum">${summary}</span>`}</span>
      <span className="chev">${Ic("chevron")}</span>
    </button>
    <div className="reasoning-body"><div className="r-bclip"><div className="r-bin">${text}</div></div></div>
  </div>`;
}
function AuAssistantMarkdown(props) {
  const blocks = Array.isArray(props.blocks) ? props.blocks : [];
  const streaming = props.streaming === true;
  if (!(streaming || props.interrupted === true || blocks.some(function (b) { return !!b && b.kind !== "tool-call"; }))) return null;
  const t = props.t;
  const MT = AU_PI && AU_PI.MarkdownText;
  const JB = AU_PI && AU_PI.JsonBlock;
  const codeLabels = { copyLabel: auT(t, "copy", "复制"), copiedLabel: auT(t, "copied", "已复制") };
  const last = blocks.length - 1;
  const rendered = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (!b) continue;
    if (b.kind === "text") {
      rendered.push(MT
        ? h(MT, { key: i, text: b.text, streaming: streaming, codeLabels: codeLabels, fileMentions: props.mentions })
        : h("div", { key: i, className: "au-md-fallback" }, b.text));
    } else if (b.kind === "reasoning") {
      rendered.push(h(AuThinkCard, { key: i, text: b.text, running: streaming && i === last, t: t }));
    } else if (b.kind === "image") {
      const start = i;
      const group = [b];
      while (i + 1 < blocks.length) {
        const nx = blocks[i + 1];
        if (!nx || nx.kind !== "image") break;
        group.push(nx);
        i += 1;
      }
      rendered.push(h("div", { key: start, className: "au-imgs" }, group.map(function (g, j) { return h(AuImg, { key: j, attachment: g.attachment || g, loadImage: props.loadImage }); })));
    } else if (b.kind === "tool-call") {
      continue; /* 工具调用是独立 chat 节点(tool-call),官方同款跳过 */
    } else {
      rendered.push(JB
        ? h(JB, { key: i, label: auT(t, "message.unknownBlock", "未知内容块"), payload: b.block, truncatedLabel: function (n) { return auT(t, "json.truncated", "已截断") + " " + n; } })
        : h("pre", { key: i, className: "au-md-fallback" }, JSON.stringify(b.block, null, 2)));
    }
  }
  /* 根/正文容器沿用官方 Sxvs8a_*(全局样式表在册,几何/中断徽章与官方一致) */
  return h("div", { className: "Sxvs8a_root", "data-streaming": streaming || undefined },
    h("div", { className: "Sxvs8a_body" }, rendered, props.interrupted === true
      ? h("span", { className: "Sxvs8a_stopped" }, auT(t, "message.stopped", "已停止")) : null));
}
function AuAssistantStep(props) {
  const node = props.node || {};
  const data = node.data || {};
  const turn = node.location && (node.location.kind === "turn" || node.location.kind === "step") ? node.location.turn : undefined;
  const tail = typeof props.useTurnData === "function" ? props.useTurnData("turn-tail") : undefined;
  const finalNode = data.finalNode;
  const owner = React.useMemo(function () {
    if (turn === undefined || turn === null || turn.status !== "closed" || finalNode === undefined) return undefined;
    if (!tail || !tail.closing || !tail.closing.finalNode || tail.closing.finalNode.seq !== finalNode.seq) return undefined;
    return { turn: turn, seq: finalNode.seq, openFile: props.openFile };
  }, [finalNode, props.openFile, tail, turn]);
  const mentions = React.useMemo(function () {
    if (owner === undefined || typeof props.fileMentions !== "function") return undefined;
    try { return props.fileMentions(owner); } catch (e) { return undefined; }
  }, [props.fileMentions, owner]);
  return h(AuAssistantMarkdown, { blocks: data.blocks, streaming: data.status === "running", interrupted: data.status === "interrupted", loadImage: props.loadImage, mentions: mentions, t: props.t });
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

/* ═══ P17 · 压缩卡接管(compaction / manual-compaction 双键遮蔽,au-tool 同款卡壳)═══
   官方契约(逆向 CompactionItem / CompactionCommandCard / GenericCommandCard):
   - compaction:        node.data = { summary:string|null, shadowedItemCount, shadowedTokenCount }
   - manual-compaction: node.data = { command:{name,outcome:null|{kind,text}}, compaction:null|同上 }
   行为:完成态 = 卡壳 + au-ico 瓦片 + 标题/摘要(官方文案,locale 注入 t 插值);
   手动运行态(compaction 未落地)= data-state=running 金辉光扫 + au-run 胶囊;
   outcome.error = err 胶囊;可展开时 chevron + AuBody grid 收合,正文走官方 MarkdownText。
   P9 旧 .compress 原型平推行退役,CSS 留作死代码防御(同 QWLzlG 惯例) */
function auCompactCard(o) {
  const st = React.useState(false);
  const open = st[0], setOpen = st[1];
  const expandable = o.expandable === true;
  const MT = AU_PI && AU_PI.MarkdownText;
  const pill = o.running === true
    ? h(AuPill, { state: "run", text: auT(o.t, "row.running", "运行中") })
    : o.err === true ? h(AuPill, { state: "err", text: auT(o.t, "command.failed", "失败") }) : null;
  return h("div", { className: "au-tool au-comp" + (open ? " au-open" : "") + (expandable ? "" : " au-noexp"), "data-state": o.running === true ? "running" : o.err === true ? "error" : "ok", "data-compaction": "1" },
    h("div", { className: "au-main", onClick: expandable ? function () { setOpen(!open); } : undefined, "aria-expanded": expandable ? String(open) : undefined },
      h("span", { className: "au-ico" }, Ic("compact")),
      h("span", { className: "au-txt" },
        h("span", { className: "au-name" }, o.title),
        o.summary ? h("span", { className: "au-sum" }, o.summary) : null),
      pill,
      expandable ? h("span", { className: "au-chev" }, Ic("chevron")) : null),
    expandable ? h(AuBody, { open: open }, MT
      ? h(MT, { text: o.bodyText, streaming: false, codeLabels: { copyLabel: auT(o.t, "copy", "复制"), copiedLabel: auT(o.t, "copied", "已复制") } })
      : h("pre", { className: "au-term" }, o.bodyText)) : null);
}
function AuCompress(props) {
  const node = (props.node && props.node.data) || {};
  const t = props.t;
  const n = node.shadowedItemCount;
  const tk = node.shadowedTokenCount;
  const expandable = typeof node.summary === "string" && node.summary !== "";
  const summary = n != null && tk != null
    ? auT(t, "message.compaction.completed", "已压缩 " + n + " 条历史记录（约 " + tk + " tokens）", { items: n, tokens: tk })
    : expandable ? auT(t, "message.compaction.expand", "点击查看压缩摘要") : auT(t, "message.compaction.unavailable", "压缩摘要不可用");
  return auCompactCard({ title: auT(t, "message.compaction", "上下文已压缩"), summary: summary, expandable: expandable, bodyText: expandable ? node.summary : "", running: false, err: false, t: t });
}
function AuCompactCmd(props) {
  const data = (props.node && props.node.data) || {};
  const cmd = data.command || {};
  const t = props.t;
  const outcome = cmd.outcome === undefined || cmd.outcome === null ? null : cmd.outcome;
  const title = cmd.name || "compact";
  const comp = data.compaction || null;
  if (comp) {
    /* 官方同款:压缩标记落地后只渲染标记卡(fallbackSummary = outcome 文本) */
    const n = comp.shadowedItemCount;
    const tk = comp.shadowedTokenCount;
    const expandable = typeof comp.summary === "string" && comp.summary !== "";
    let summary;
    if (n != null && tk != null) summary = auT(t, "message.compaction.completed", "已压缩 " + n + " 条历史记录（约 " + tk + " tokens）", { items: n, tokens: tk });
    else {
      const ot = outcome && typeof outcome.text === "string" && outcome.text !== "" ? outcome.text : null;
      summary = ot !== null ? ot : expandable ? auT(t, "message.compaction.expand", "点击查看压缩摘要") : auT(t, "message.compaction.unavailable", "压缩摘要不可用");
    }
    return auCompactCard({ title: title, summary: summary, expandable: expandable, bodyText: expandable ? comp.summary : "", running: false, err: false, t: t });
  }
  if (outcome !== null) {
    /* 无压缩标记的成稿命令(GenericCommandCard 语义) */
    const err = outcome.kind === "error";
    const summary = typeof outcome.text === "string" && outcome.text !== "" ? outcome.text : err ? auT(t, "command.failed", "失败") : auT(t, "command.done", "完成");
    return auCompactCard({ title: title, summary: summary, expandable: false, bodyText: "", running: false, err: err, t: t });
  }
  /* 运行中:金辉光 + 运行中胶囊,摘要行 = 正在压缩… */
  return auCompactCard({ title: title, summary: auT(t, "message.compaction.running", "正在压缩…"), expandable: false, bodyText: "", running: true, err: false, t: t });
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
   保下游测试语义。
   P21(2026-08-25 用户指定):清单条可折叠 —— 头部行(清单 n/m + 进度条 +
   折叠钮)常显,todo-items 收进 .todo-foldwrap(grid 0fr⇄1fr,与侧栏 .au-slist
   同机构);默认折叠,内存态不持久化;hook 须在空清单早退之前(hooks 铁律)。 */
function AuTodoBar(props) {
  const useProjection = props.useProjection;
  const openSt = React.useState(false);
  const open = openSt[0], setOpen = openSt[1];
  const todos = (useProjection ? useProjection("todos") : null) || [];
  if (todos.length === 0) return null;
  var done = 0;
  for (var i = 0; i < todos.length; i++) if (todos[i].status === "completed") done++;
  var pct = Math.round((done / todos.length) * 100);
  return html`<div className=${"todo-bar" + (open ? "" : " au-tdclosed")} data-testid="todo-panel">
    <span className="todo-label">清单</span>
    <span className="todo-label">${done} / ${todos.length}</span>
    <div className="goal-track"><div className="goal-fill" style=${{ width: pct + "%" }}></div></div>
    <button type="button" className="todo-fold" title=${open ? "收起清单" : "展开清单"} aria-label=${open ? "收起清单" : "展开清单"} aria-expanded=${open ? "true" : "false"} onClick=${function () { setOpen(!open); }}>${Ic("chevdown")}</button>
    <div className="todo-foldwrap"><div className="todo-foldin">
      <div className="todo-items">
        ${todos.map(function (it, i) {
          var cls = "todo-it" + (it.status === "completed" ? " done" : it.status === "in_progress" ? " now" : "");
          return html`<span key=${i} className=${cls}><span className="td"></span>${it.content}</span>`;
        })}
      </div>
    </div></div>
  </div>`;
}

return {
  inject: ["theme", "slots", "sessions", "workspaces"],
  apply: function (ctx) {
    const theme = ctx.theme;
    const slots = ctx.slots;

    const disposeOverride = theme.overrideTokens("dsh-theme-aurum", AURUM_OVERRIDE);
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
        /* P23:切官方 preference(light/dark)而非 aurum 主题 id —— 官方 setTheme
           对内置 preference 会持久化写入设置文档,与「设置·外观」行完全同一条通道;
           aurum 色由 override 层按 colorScheme 自动跟随 */
        api.select(mode === "dark" ? "light" : "dark");
      }
    };

    slots.inject("sidebar.footer.action", function () {
      return slots.register({ name: "sidebar.footer.action", id: "theme-aurum", order: 40, label: "鎏金主题" }, function () { return h(AurumFootToggle, { api: api }); });
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
      /* P19 · host 原生目录选择(官方 native capability):Promise<path|null>,
         null = 用户取消;capability 非 native(SSH/远程)时 reject
         directory-picker-unavailable —— 由调用方回退手动输入行 */
      pickWorkspaceDirectory: function () { return workspacesSvc.pickDirectory(); },
      renameWorkspace: function (workspaceId, title) { return workspacesSvc.rename(workspaceId, title); },
      deleteWorkspace: function (workspaceId) { return workspacesSvc.delete(workspaceId); },
      /* P27 · row-menu 扩展点在册条目数:菜单渲染期快照(注册表读,非响应式),
         仅作分隔线/条目块的门控 —— 菜单是瞬时浮层,插件装卸间隙足够新;
         SlotOutlet 自身订阅 slot 版本,菜单开着时插件装卸会实时增删行。 */
      rowMenuCount: function () {
        try { return slots.entriesOfSlot("sidebar.workspaces.row-menu").length; } catch (e) { return 0; }
      },
      /* P27b · menu-extra(list)在册行数:与 rowMenuCount 同为分隔线/条目块门控
         (list 每带 id 注册一行,多插件互不遮蔽) */
      extraMenuCount: function () {
        try { return slots.entriesOfSlot("aurum.workspaces.menu-extra").length; } catch (e) { return 0; }
      }
    };

    slots.inject("sidebar.workspaces", function () {
      /* P27 · 承接官方 sidebar.workspaces.row-menu 扩展点:aurum 遮蔽官方浏览器后,
         该子槽必须有人声明 + 渲染,插件(dsh-open-in-vscode 等)经 slots.inject 挂起
         的注册回调才有落点(声明提交即触发,DOM 兜底适配器也随之让位拆除)。
         声明守则(turn-tail 教训:同一 child key 第二个声明者 throw,会炸掉后来者的
         整个 register):仅当运行时无人声明该子槽时由 aurum 声明;官方包将来自己
         声明时(官方 apply 先于本插件加载,children 与父槽同一 register 事务提交,
         本回调运行时 spec 已在册)自动让位。kind=single:现役插件 register 不带
         id/key,kind=list/keyed 的注册校验会直接拒之门外。 */
      const reg = { name: "sidebar.workspaces", priority: -1, registrant: "aurum" };
      /* P27b · 声明集:官方契约槽 row-menu(single,现役 vscode 插件注册不带
         id,list/keyed 校验会拒,lowest-render 遮蔽链是其唯一多注册形态)+
         aurum 自有 menu-extra(list,带 id 注册每插件一行,互不遮蔽 —— 多插件
         共存的正道)。两槽同守"无人声明才声明"守则(同 key 二次声明 throw)。 */
      const kids = {};
      if (slots.spec("sidebar.workspaces.row-menu") === undefined) {
        kids["sidebar.workspaces.row-menu"] = { kind: "single", scope: "root" };
      }
      if (slots.spec("aurum.workspaces.menu-extra") === undefined) {
        kids["aurum.workspaces.menu-extra"] = { kind: "list", scope: "root" };
      }
      if (Object.keys(kids).length > 0) reg.children = kids;
      return slots.register(reg, function (props) {
        const p = Object.assign({}, props);
        p.au = auActions;
        return h(AuBrowser, p);
      });
    });

    slots.inject("conversation.chat.node", function () {
      const disps = [];
      const reg = function (key, comp, extra) {
        disps.push(slots.register(Object.assign({ name: "conversation.chat.node", key: key, priority: -1, registrant: "aurum" }, extra || {}), function (props) { return h(comp, props); }));
      };
      reg("user", AuUserBubble);
      reg("steering", AuUserBubble);
      reg("context", AuContext);
      /* P17:压缩卡接管(双键遮蔽,locale 注入官方文案 t);官方注册保留(priority:-1) */
      reg("compaction", AuCompress, { locale: "conversation" });
      reg("manual-compaction", AuCompactCmd, { locale: "conversation" });
      reg("model-retry", AuRetry);
      reg("turn-error", AuTurnError);
      reg("turn-max-tokens", AuTurnMaxTokens);
      /* P16:遮蔽 assistant-step —— think 卡接管(AuThinkCard 运行态单行重播入场 +
         结束自动收拢);text 块委托官方 MarkdownText,视觉不变;locale 复用官方
         conversation 命名空间(t 注入);官方注册保留(priority:-1,停插件即还原) */
      reg("assistant-step", AuAssistantStep, { locale: "conversation" });
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

    /* P15 前修订:遮蔽官方 TodoDock(id=todo)—— 同 id 注册替换,order 0 保位
       (input.dock 在输入卡上方,goal/queue 条之前);inject 等 children 声明就绪 */
    slots.inject("conversation.input.dock", function () {
      return slots.register({ name: "conversation.input.dock", id: "todo", order: 0, priority: -1, registrant: "aurum" }, function (props) { return h(AuTodoBar, props); });
    });

    ctx.effect(function () {
      return function () {
        try { if (typeof stopListen === "function") stopListen(); } catch (e) {}
        try { if (typeof disposeCss === "function") disposeCss(); } catch (e) {}
        try { if (typeof disposeOverride === "function") disposeOverride(); } catch (e) {}
      };
    }, "aurum disposers");
  }
};
	}
});
