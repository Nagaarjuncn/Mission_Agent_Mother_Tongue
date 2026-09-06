# VernacLearn - Secure HTTPS Tunnel Launcher (Cloudflare Tunnel)
# Creates an instant, encrypted HTTPS public URL for mobile and remote microphone testing

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  VernacLearn - Secure HTTPS Cloudflare Tunnel" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

$port = 8000
$cfPath = Join-Path $PSScriptRoot "cloudflared.exe"

if (-not (Test-Path $cfPath)) {
    $cfPath = "C:\Users\tecso\.gemini\antigravity-ide\scratch\cloudflared.exe"
}

if (-not (Test-Path $cfPath)) {
    Write-Host "cloudflared.exe not found in directory. Downloading..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile $cfPath
}

Write-Host "`nEstablishing secure TLS/HTTPS Cloudflare tunnel to localhost:$port..." -ForegroundColor Yellow
Write-Host "Keep this window open to maintain the secure link active.`n" -ForegroundColor Green

& $cfPath tunnel --url "http://127.0.0.1:$port"
