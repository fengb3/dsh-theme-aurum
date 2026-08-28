/* P23 门禁:官方「设置·外观」切换与 aurum override 层兼容性。
   背景:官方外观行 cube = preference 切内置主题(light/dark/system);aurum 视觉
   经 theme.overrideTokens 常驻层按 active.colorScheme 跟随,不应被官方切换摘除。
   断言:① 基线 body 内联 token ≥120 且为 aurum 值;② 设置点 Light 后 token 数
   与关键 aurum 色值保持(修复前:120→0、bg-base 回 #fff);③ 左下角按钮切换后
   深浅属性与 aurum 对色都正确翻转。 */
async page => {
  const read = () => page.evaluate(() => {
    const body = document.body;
    const cs = getComputedStyle(body);
    return {
      n: body.style.length,
      dark: body.hasAttribute("data-ds-dark-theme"),
      bgBase: cs.getPropertyValue("--dsw-alias-bg-base").trim(),
      bubble: cs.getPropertyValue("--dsw-specific-bubble").trim(),
      sidebar: cs.getPropertyValue("--dsw-specific-sidebar-fill").trim(),
      gold: cs.getPropertyValue("--aurum-gold").trim(),
      aurumCss: !!document.querySelector('style[data-plugin-css*="aurum"]')
    };
  });
  const failures = [];
  const st = [];

  st.push({ step: "baseline", s: await read() });
  if (st[0].s.n < 120) failures.push("baseline inline tokens " + st[0].s.n + " < 120");
  if (!st[0].s.aurumCss) failures.push("aurum css tag missing");

  /* 打开设置 → 点「浅色」cube */
  await page.evaluate(() => {
    const cands = Array.from(document.querySelectorAll('button,[role="button"],a')).filter(el => {
      const t = (el.getAttribute("title") || "") + " " + (el.getAttribute("aria-label") || "") + " " + (el.textContent || "");
      return /设置|settings|Setting/i.test(t) && el.offsetParent !== null;
    });
    if (cands.length) cands[cands.length - 1].click();
  });
  await page.waitForTimeout(700);
  const picked = await page.evaluate(() => {
    const cands = Array.from(document.querySelectorAll('button,[role="button"]')).filter(el => {
      const t = (el.textContent || "") + " " + (el.getAttribute("aria-label") || "");
      return el.offsetParent !== null && (/浅色|light/i.test(t) && !/深色|dark/i.test(t));
    });
    if (!cands.length) return false;
    cands[cands.length - 1].click();
    return true;
  });
  await page.waitForTimeout(900);
  st.push({ step: "settings-light", s: await read() });
  const after = st[1].s;
  if (!picked) failures.push("appearance light cube not found");
  if (after.n < 120) failures.push("after settings-light tokens " + after.n + " < 120 (override layer dropped)");
  if (after.dark) failures.push("dark attribute should be off in light");
  if (after.bgBase.indexOf("oklch(94.5% 0.012 82)") === -1) failures.push("bgBase not aurum light: " + after.bgBase);
  if (after.bubble.indexOf("oklch(93% 0.035 83)") === -1) failures.push("bubble not aurum light: " + after.bubble);

  /* 左下角按钮切深色 */
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("button")).find(el => /切换到深色主题/.test((el.getAttribute("title") || "") + (el.getAttribute("aria-label") || "")));
    if (btn) btn.click();
  });
  await page.waitForTimeout(900);
  st.push({ step: "foot-toggle-dark", s: await read() });
  const dark = st[2].s;
  if (!dark.dark) failures.push("dark attribute missing after foot toggle");
  if (dark.bgBase.indexOf("oklch(16% 0.014 330)") === -1) failures.push("bgBase not aurum dark: " + dark.bgBase);
  if (dark.gold.indexOf("oklch(83% .115 88)") === -1) failures.push("aurum gold not dark variant: " + dark.gold);

  /* 还原浅色(不留深色态给后续脚本)并关掉设置弹窗(不挡同页后续脚本的点击) */
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("button")).find(el => /切换到浅色主题/.test((el.getAttribute("title") || "") + (el.getAttribute("aria-label") || "")));
    if (btn) btn.click();
  });
  await page.waitForTimeout(600);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);

  return { failures: failures.length, details: failures, steps: st };
}
