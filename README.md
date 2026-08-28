# dsh-theme-aurum

[DSH(DeepSeek Harness)](https://github.com/deepseek-ai/deepseek-harness) 的**鎏金主题**插件:由 `dsh-agent-workspace.html` 原型(金粉奢华)移植,零构建、纯 loader 格式。**v1.1.0** —— 全界面接管完成。

**DSH Web 兼容范围:`>=0.1.0-rc.6`**(在 `0.1.0-rc.6` 官方 client API 线上开发,`0.1.1-rc.2` 实机全量门禁通过)。

![浅色 · 整页外观](screenshots/aurum-think-done-open.png)

![深色 · 设置弹窗与全局金色化](screenshots/diag-appearance-after.png)

> 更多界面细节见 [`screenshots/`](./screenshots/) 目录。

## 功能总览(P1–P15 全量)

- **主题**:oklch 金粉双色层(`theme.overrideTokens` 常驻 {light,dark} 双色,24px 点阵画布、香槟金、衬线正文),侧栏底部「深色/浅色主题」一键切换官方 preference(持久化、可跟随系统)。
- **浮动卡片布局**:侧栏圆角渐变卡 + 柔影渐变(阴影完整铺过主区,无分割线);折叠态 56px 细条(鲸鱼 logo 悬停淡切展开)。
- **左侧会话栏**(遮蔽 `sidebar.workspaces`):
  - 目录头:「工作区」标签 + 展开式搜索(金圈聚焦)+ 视图菜单(最近活动/名称/手动序排序 + 平铺)+ 添加工作区;
  - 分组折叠:官方文件夹图标 ⇄ 折叠三角交叉淡切,收合 grid-rows 非线性动画,行级 stagger 入场;
  - 会话行:状态槽(运行中/等待交互/已完成)、当前金 tint、悬停浮动菜单(重命名 F2/分支/归档)、拖拽排序(金线落点)、相对时间;
  - 品牌行:官方鲸鱼 + 字标(定宽不缩,窄卡自动只留鲸鱼)。
- **会话流**:右对齐金渐变用户气泡、◈ 上下文行、衬线正文(◆ 金点列表、金 pill code)、鲸鱼头像、reasoning 折叠段(serif italic)、turn-tail/compress/retry/err 尾部节点、逐节点阶梯入场。
- **工具卡全量接管**(遮蔽 `conversation.chat.node` key=tool-call):9 类特判 + 未知工具兜底(官方 Sparkle 四角星 + 参数摘要推导);药丸状态、grid 展开、运行中金扫光、t-foot 统计尾注;tool-kids 子调用缩进;详情栏已并入卡片。
- **输入坞**:todo 清单条(金→玫渐变进度 + 胶囊待办)、实色输入卡(金圈聚焦)、发送金渐变方钮、模式/模型菜单 mono 换皮、ctx 圆环 + 构成面板、c-stats 统计行。
- **主区 header**:原型 sh-head 浮头方案 —— 绝对定位渐变纱(消息从纱下渐隐滚过)、标题与侧栏字标同轴(delta=0)、tabs 胶囊同行。
- **全局浮层**:hero 新会话居中态(衬线大字 + 径向金辉)、命令/工作区菜单金色化、设置弹窗(居中双栏 + 左导航 tint)。
- **响应式**:≤820/≤640/≤480 三档降密度,360–1920 全档零横向滚动(≤900 官方自动收 68px 细条)。
- **图标**:一律 DSH 官方原版(`@deepseek-ai/dsh-client-ui-primitives` 直取,与官方 ToolRow 同表),零自绘(唯视图/添加工作区两枚自建功能钮除外)。
- **槽位兼容**:官方注册全部保留(`priority:-1` 遮蔽),插件停止即完整还原官方 UI。

## 安装

```sh
# GitHub 安装(推荐;固定到发布 commit,如 v1.1.0)
dsh plugin --profile web add github:fengb3/dsh-theme-aurum#<commit-sha>

# 本地开发(link 安装,编辑即生效)
dsh plugin --profile web add <本仓库路径>
```

重启 `dsh web` 生效(所有页面自动加载,无需手动激活)。

## 兼容性

- **DSH Web:`>=0.1.0-rc.6`** —— 基于 `0.1.0-rc.6` 官方 client API(`theme.overrideTokens` / `slots.register`)开发,`0.1.1-rc.2` 实机全量门禁通过
- **平台**:web(能力全部在浏览器半,零构建、无宿主进程开销)

## 卸载

```sh
dsh plugin --profile web remove dsh-theme-aurum
```

## 结构

```
client.js          浏览器半:主题注册 + 样式 + 全部组件(loader 格式,零构建)
index.js           宿主半:no-op(全部能力在浏览器半)
cordis.patch.yml   bundle 声明
package.json       dsh.bundle.patch + dsh.client.inject 声明(含 primitives 依赖)
vendor/htm.js      htm@3.1.1 官方 mini UMD(内联进 client.js,HTML 同构写 React 组件)
verify-*.js        playwright 门禁(gate 几何/p8b 无描边/p8c 功能/proto-diff 原型 diff/
                   p10 输入坞/p11 工具卡/p13 浮层/p14 响应式/icons 官方图标/group 动画/header 同轴)
verify-run.mjs     门禁 Node runner(playwright-core + 本机 Chrome headless)
shadowscan.mjs     侧栏阴影渐变像素门禁;bgscan.mjs 背景均匀度像素门禁
sync-deploy.ps1    部署副本同步(MD5 校验,符号链接安装时报 LINKED)
ROADMAP.md         逐步构建路线图(阶段表 + 原型逐节差异盘点 + 验收记录)
```

> 开发注意:`dsh plugin add` 以 **link: 安装**时部署副本是仓库的符号链接 —— 编辑即生效,
> `sync-deploy.ps1` 会报 LINKED(绝不可 Copy-Item 自拷贝);拷贝安装形态则每次编辑后必须
> 跑 `sync-deploy.ps1` 同步。改 `package.json` / `cordis.patch.yml` / `index.js` 后需
> 重装插件或重启 `dsh web`(hot-reload 只能升级已加载插件的版本)。

## 验证

```sh
npm install                # 首次:playwright-core + pngjs
node verify-run.mjs verify/verify-gate.js verify/verify-p8b.js verify/verify-p8c.js verify/verify-proto-diff.js
```

## License

[MIT](./LICENSE) © fengb3
