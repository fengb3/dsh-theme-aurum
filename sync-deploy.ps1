# 编辑后同步部署副本(硬链接会因编辑器重写而断裂)
# 用法: ./sync-deploy.ps1   —— 同步后 reload http://127.0.0.1:3080 验证
$ErrorActionPreference = "Stop"
$src = Join-Path $PSScriptRoot "client.js"
$dst = "C:\Users\fengb\.dsh\profiles\web\node_modules\dsh-theme-aurum\client.js"
if (-not (Test-Path $dst)) { Write-Error "deploy target missing: $dst (plugin not installed?)" }
Copy-Item $src $dst -Force
$h1 = (Get-FileHash $src -Algorithm MD5).Hash
$h2 = (Get-FileHash $dst -Algorithm MD5).Hash
if ($h1 -eq $h2) { Write-Host "IN-SYNC ($h1)" } else { Write-Error "OUT-OF-SYNC" }
