# dsh-theme-aurum

[DSH(DeepSeek Harness)](https://github.com/) 的**鎏金主题**插件:由 `dsh-agent-workspace.html` 原型(金粉奢华)移植,零构建、纯 loader 格式。

## 功能

- **主题**:`theme` 服务注册 `aurum-dark` / `aurum-light`(oklch 金粉配色 + 24px 点阵画布 + 金辉 sheen),侧栏底部与设置页提供切换;插件加载时若当前非鎏金主题自动切到 `aurum-dark`。
- **浮动卡片布局**:侧栏/详情栏以圆角渐变 + 阴影卡片悬浮于点阵画布之上(AppFrame 列透明化 + `::before` 内衬卡),折叠态 56px 细条几何。
- **左侧历史会话栏整体重写**(遮蔽注册 `sidebar.workspaces`,官方浏览器保留在册):
  - 目录头:「工作区」标签 + 展开式搜索(金圈聚焦)+ 视图切换(分组/平铺)+ 添加工作区(内联路径输入);
  - 分组折叠:chev ⇄ 文件夹图标交叉淡切,悬停显示目录操作(重命名/删除,二次确认)与「在此目录新建会话」;
  - 会话行:状态槽(运行中旋转金环/等待交互金点/已完成绿点)、当前项金色 tint、悬停 ··· 展开操作条(重命名(行内)/分支/归档)、相对时间;
  - 本地标题搜索 + 分组名匹配。
- **会话流接管**:右对齐金色渐变用户气泡(含图片)、`◈` 上下文节点、9 类高频工具卡片(grep/read/edit/write/todo_write/web_search/web_fetch/pwsh/bash,药丸状态 + 网格展开 + 运行中金色扫光)。
- **槽位兼容**:`sidebar.settings`、`sidebar.footer.action`、`settings.general.item` 等槽位原样保留,其他插件可继续注入。

## 安装

```sh
dsh plugin --profile web add file:C:/Users/fengb/dsh-themes/dsh-theme-aurum
```

重启 `dsh web` 生效(所有页面自动加载,无需手动激活)。

## 卸载

```sh
dsh plugin --profile web remove dsh-theme-aurum
```

## 结构

```
client.js          浏览器半:主题注册 + 样式 + 侧栏浏览器 + 会话流/工具卡片(loader 格式,零构建)
index.js           宿主半:no-op(全部能力在浏览器半)
cordis.patch.yml   bundle 声明
package.json       dsh.bundle.patch + dsh.client.inject 声明
ROADMAP.md         逐步构建路线图(原型章节 → 阶段对照 + 几何门禁 + 恒等映射流水)
verify-*.js        playwright 门禁脚本(verify-gate 几何 / verify-p8b 无描边 / verify-proto-diff 双页原型 diff)
vendor/htm.js      htm@3.1.1 官方 mini UMD(P9 起内联进 client.js,HTML 同构写 React 组件)
sync-deploy.ps1    编辑 client.js 后同步部署副本(硬链接会断,必须重拷)
```

> 开发注意:部署副本 `~/.dsh/profiles/web/node_modules/dsh-theme-aurum/client.js` 是安装时的硬链接,
> **每次编辑都会断链**。改完必须 `./sync-deploy.ps1` 再 reload 页面,否则看到的是旧样式。

源文件(开发用,含逐版演进):`../aurum-p6-client.js`(动态插件函数体格式)。

## License

MIT
