# 编辑后同步部署副本(硬链接会因编辑器重写而断裂)
# 用法: ./sync-deploy.ps1   —— 同步后 reload http://127.0.0.1:3080 验证
#
# 两种部署形态:
#  1. link: 安装(dsh plugin add <仓库路径>,node_modules 里是仓库的符号链接):
#     src 与 dst 是同一文件 —— 直接报 LINKED,不做拷贝(自拷贝会截断文件!)。
#  2. 传统拷贝安装:Copy-Item + MD5 校验,输出 IN-SYNC 才算数。
$ErrorActionPreference = "Stop"
$src = Join-Path $PSScriptRoot "client.js"
$dst = Join-Path $env:USERPROFILE ".dsh\profiles\web\node_modules\dsh-theme-aurum\client.js"
if (-not (Test-Path $dst)) { Write-Error "deploy target missing: $dst (plugin not installed?)" }

# 同文件检测:GetFullPath 不解析符号链接,直接靠 Copy-Item 的「自身拒写」错误
# (pwsh 在写盘前就拒绝,不会截断源文件)。
try {
  Copy-Item $src $dst -Force -ErrorAction Stop
} catch {
  if ($_.Exception.Message -like '*with itself*') {
    Write-Host "LINKED (symlink install, same file: $dst)"
    exit 0
  }
  throw
}
$h1 = (Get-FileHash $src -Algorithm MD5).Hash
$h2 = (Get-FileHash $dst -Algorithm MD5).Hash
if ($h1 -eq $h2) { Write-Host "IN-SYNC ($h1)" } else { Write-Error "OUT-OF-SYNC" }
