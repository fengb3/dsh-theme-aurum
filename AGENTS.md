# AGENTS.md — dsh-theme-aurum 协作约定

任何 agent(或人)在本仓库动土前必须读完本文件。与 ROADMAP.md 的分工:
**本文件 = 怎么干活(流程/铁律/环境);ROADMAP.md = 干什么(阶段/差异/验收)**。冲突时以本文件为准。

## 1 · 项目是什么

DSH(DeepSeek Harness)Web 的**鎏金主题插件**:由静态原型 `dsh-agent-workspace.html`
(金粉奢华 · oklch)逐节移植。零构建、纯 loader 格式、单插件包。当前进度与剩余差异见
ROADMAP.md 阶段表(P1–P8b ✅,P9 ◐,P8c/P10–P15 ⬜)。

## 2 · 关键路径与环境

| 什么 | 在哪 |
|---|---|
| 仓库(工作目录) | 本仓库根 = agent 启动时的工作目录(不写死机器绝对路径) |
| 原型(唯一视觉基准) | 仓库内 `prototype\dsh-agent-workspace.html`(源自 Downloads,以仓库副本为准) |
| 部署副本 | `~\.dsh\profiles\web\node_modules\dsh-theme-aurum\client.js`(`dsh plugin --profile web add <仓库路径>` 安装生成) |
| 验证页面 | `http://127.0.0.1:3080`(现有 `dsh web`,**禁止另起服务器**) |
| 官方内部快照(逆向参考) | `runtime-snapshot.js` / `ui-conversation.js` / `bundle-snapshot.js` |
| 浏览器验证 | playwright-cli;eval 脚本即仓库内 `verify/verify-*.js`(runner 为根目录 `verify-run.mjs`) |

部署副本两种形态:**link: 安装**(`dsh plugin --profile web add <仓库路径>`)时副本是
仓库的符号链接 —— 编辑即生效,`sync-deploy.ps1` 检测同文件直接报 LINKED,**绝不可**
Copy-Item 自拷贝(会截断文件);**拷贝安装**(旧机器形态)时编辑会断链,必须跑
`sync-deploy.ps1` 同步。另外:新装/卸载插件改变组合(package.json bundles)必须重启
`dsh web` —— hot-reload 只能换已加载插件的版本,捡不起全新插件。

## 3 · 硬性工作流(每次改 client.js 的循环)

```
编辑 client.js → ./sync-deploy.ps1 → 浏览器 reload 3080 → verify 门禁 → 更新记录
```

1. **改完必同步**:`sync-deploy.ps1`(MD5 校验,输出 IN-SYNC 才算数)。不同步就 reload
   看到的是旧文件,会误判自己的改动"没生效"。
2. **reload 后必验证**:不跑门禁的样式改动视为未完成。
3. **门禁三态**:展开 / 折叠 / 拖拽调宽,三态都要过(拖拽目前手动补测)。
4. **每阶段收尾**:client.js 头注释追加 `── Pn · ……`(改动+实测数据),并把 ROADMAP.md
   阶段表状态翻绿、要点节补充实测记录。
5. 改 `package.json`/`cordis.patch.yml`/`index.js` 后需要 `dsh plugin` 侧重装或重启
   `dsh web` 才生效;日常只改 client.js + CSS 数组时不涉及。

## 4 · 架构铁律(违反 = 返工)

1. **遮蔽注册,不删官方**:官方组件一律 `slots.register({priority:-1})` 遮蔽。插件停止
   即还原官方,这是回退路径,不许破坏。槽位 `sidebar.settings` /
   `sidebar.footer.action` / `settings.general.item` 保持注入兼容,给其他插件留活口。
2. **不直接操纵官方 DOM**:自建 UI 走 React 组件(`htm` 模板,P9 起)进槽位;官方 DOM
   只允许 CSS 瞄准(混淆类 `hHd-Xa_*`)。禁止 querySelector 改官方渲染产物 —— React
   重渲染会抹掉,MutationObserver 补丁是死路。
3. **卡片即容器**:圆角/阴影浮卡的样式必须落在承载内容的元素上,带 `overflow:hidden`。
   禁止 `::before` 画卡再让内容铺到卡外(P8 之前的教训:内容溢出圆角 12px)。
4. **不与内联样式拔河**:官方宽度/状态是 React 内联样式。要覆盖用
   `width:auto!important` 让内容填充而非写死像素,拖拽调宽自动跟随。
5. **无描边原则**:原型 `--border/--border-soft` 全透明,一切分隔靠面色 tint/阴影/透明度。
   官方默认主题在 body 层定义 `--dsw-alias-border-*`(解析为 rgba(255,255,255,.12)),
   主题 token 压不过 → 必须**直写元素级 transparent**(侧栏/详情栏/输入卡子树已有
   `border-color:transparent!important` 一揽子扫除;au-* 类逐个字面量 transparent)。
6. **子串选择器必须标签限定**:如 `button[class*=newSession]`。裸 `[class*=newSession]`
   会同时命中 `hHd-Xa_newSessionLabel` 官方子类,产生双伪元素等诡异缺陷(P8b 实录)。
7. **React 无 JSX**:client.js 是 loader 格式零构建。P9 起用 `vendor/htm.js`(官方 mini
   UMD,内联进文件头)的 tagged template 写 HTML 同构语法,`htm.bind(React.createElement)`
   绑定后产物是真实 React element。**不是** innerHTML,不许引入真实 DOM 操作。
8. **主题双色都要过**:aurum-dark / aurum-light 是一对,任何新样式两色都要目检+门禁。
   浅色注意:玫辉 sheen 关、border 换墨色点阵等原型 §1 light 覆盖。

## 5 · 恒等映射流水(P9 起,详见 ROADMAP 总原则第 7 条)

消灭「原型→实现」双重翻译的既定方针:

- **结构**:原型 HTML 片段贴进 htm 模板,静态文本换 `${}` 绑定、补 `onClick`;
- **类名与变量**:自建组件**沿用原型类名与 CSS 变量**(`.turn-tail`/`--gold`…),不自造
  `au-*` 新名。CSS 从原型**整段拷贝**,只做两个固定机械替换:
  `:root` → `body[data-ds-dark-theme]`;`html[data-theme="light"]` → `body:not([data-ds-dark-theme])`;
- **验证**:`verify-proto-diff.js` 同 selector 双页 rect/字号 diff,±1.5px 自动断言;
- **边界**:
  - 存量 au-*(P6–P8 侧栏)**不迁移** —— 翻新已过门禁的代码才是返工;
  - 官方 DOM 的 CSS 瞄准(hHd-Xa_*)继续放 CSS1 数组,与原型拷贝 CSS 两轨隔离,不混流;
  - 原型类名落地前查与官方全局类冲突(官方为 hHd-Xa_ 前缀,预期无冲突;真撞了套
    `.au-root` 容器作用域);
  - 数据驱动的列表逻辑(会话行、工具卡展开态)照写组件,htm 只消灭结构翻译。
- **原型侧前置契约**:新主题原型(任意风格)按 `PROTOTYPE-SPEC.md` 产出 ——
  锚点写法/双主题/状态钩子/selector 稳定/PORT-NOTE 等约束在那边集中维护。

## 6 · 验证体系(playwright-cli eval,`async page => {}` 格式)

| 脚本 | 门槛 |
|---|---|
| `verify-gate.js` | 卡片 rect 对原型 ±1px;递归子树零溢出(±0.6);`scrollWidth==clientWidth`;展开+折叠两态 |
| `verify-p8b.js` | 无描边审计:伪元素加号唯一、子树可见边框数 0 |
| `verify-proto-diff.js` | 双页恒等 diff:w/h/字号 ±1.5px 自动断言;颜色并排人工复核;x/y 只输出不断言 |

新阶段把该阶段 selector 填进 `verify-proto-diff.js` 的 SELECTORS 再跑。截图
(`screenshots/`)是过程产物,已 git-ignore,重拍即弃,不算验收凭据。

**运行方式(本机无 playwright-cli,用 Node runner)**:
```
node verify-run.mjs verify/verify-gate.js verify/verify-p8b.js verify/verify-proto-diff.js
```
runner(`verify-run.mjs`)用仓库 devDependency `playwright-core` + 本机 Chrome(headless),
打开 3080、注入 `window.__AU_PROTO_URL__`(原型的 file:// URL)后执行同款
`async page => {}` 脚本 —— verify-*.js 保持浏览器 eval 格式不变。装依赖:`npm install`。

## 7 · 文件地图

```
client.js          浏览器半:全部能力(主题注册+CSS 数组+组件+槽位)。日常只改它
index.js           宿主半:no-op(仅为组合行加载存在)
package.json       dsh.bundle.patch + dsh.client.inject 声明(platform: web)
cordis.patch.yml   bundle 层声明
vendor/htm.js      htm@3.1.1 mini UMD 源(P9 起内联进 client.js 头部)
verify/             verify-*.js 门禁脚本集中目录(见 §6)
verify-run.mjs     门禁 Node runner(playwright-core + 本机 Chrome,见 §6)
sync-deploy.ps1    部署副本同步(MD5 校验)
ROADMAP.md         阶段路线 + 原型逐节差异盘点 + 各阶段验收标准
README.md          面向使用者的说明(安装/功能/结构)
PROTOTYPE-SPEC.md  原型侧设计契约(设计师交付版,产出 prototype/*.html 前必读)
*-snapshot.js      官方运行时/UI 内部快照,逆向 props 契约用 —— 只读参考,不部署
screenshots/       验证截图(过程产物,已 ignore;verify 脚本新拍也落此目录)
.playwright-cli/   playwright-cli 会话残留,可忽略
```

## 8 · 文档与记录约定

- **语言**:全仓中文注释与文档,半角标点为主,与现有文件风格一致;
- **编码**:UTF-8,LF/CRLF 跟随现有文件,不主动改行尾;
- **ROADMAP.md 是进度的唯一事实源**:完成阶段翻状态;发现新差异补进「逐节差异盘点」;
  决策项(如详情栏去留)在要点节里显式标注,不悄悄定;
- **client.js 头注释是改动日志**:每个 Pn 一段,含实测数据(几何数值/门禁结果);
- **README.md 只写使用者视角**:安装、功能、结构;施工细节进 ROADMAP,不进 README;
- 官方内部快照过时了(runtime-snapshot 等)允许重新抓取覆盖,它们是参考不是契约;
  props 契约以最新快照为准,升级 DSH 后先重抓快照再施工。

## 9 · 禁止事项清单(一页速查)

- ✗ 编辑 client.js 后不同步就 reload(断链陷阱)
- ✗ querySelector 直接改官方 DOM / innerHTML 注入
- ✗ 删除或顶替官方槽位注册(只能 priority:-1 遮蔽)
- ✗ 自建新组件起 au-* 类名、人工翻译原型 CSS(P9 起)
- ✗ `::before` 画卡、内容铺卡外
- ✗ 写死像素宽度去压 React 内联样式
- ✗ 裸 `[class*=…]` 子串选择器
- ✗ 只测深色不测浅色、只测展开不测折叠
- ✗ 另起 web 服务器 / 替换 3080 的现有实例
- ✗ 跳过门禁宣布阶段完成
