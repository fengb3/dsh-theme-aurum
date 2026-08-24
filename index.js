/**
 * dsh-theme-aurum — host half: no-op.
 *
 * 本插件全部能力在浏览器半(client.js):theme 服务注册 aurum-dark/aurum-light、
 * slots 接管(sidebar.workspaces 遮蔽注册 / conversation.chat.node /
 * tool.call.toolview / sidebar.footer.action / settings.general.item)、样式注入。
 * 宿主半仅为满足组合行的加载而存在。
 */
export const inject = [];
export async function apply() {}
