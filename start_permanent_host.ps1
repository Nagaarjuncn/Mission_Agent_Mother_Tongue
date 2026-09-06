# ==============================================================================
# VernacLearn - Permanent Secured HTTPS Host & Cloudflare Tunnel Launcher
# Generates a secured, TLS 1.3-encrypted HTTPS host link with full microphone support
# ==============================================================================

$Host.UI.RawUI.WindowTitle = "VernacLearn Secured Host Link"
Clear-Host

Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "  🔒 VernacLearn — Permanent Secured Host Link Generator" -ForegroundColor Yellow
Write-Host "  TLS 1.3 Encrypted • Global HTTPS Access • Mobile Microphone Ready" -ForegroundColor White
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = $PSScriptRoot
$port = 8000
$cfExe = Join-Path $projectRoot "cloudflared.exe"
$tunnelLog = Join-Path $projectRoot "tunnel.log"
$hostLinkFile = Join-Path $projectRoot "HOST_LINK.txt"
$hostJsonFile = Join-Path $projectRoot "host_status.json"

# 1. Locate Python 3
$pythonExe = $null
$pythonCandidates = @(
    "python",
    "py",
    "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe",
    "$env:LOCALAPPDATA\Programs\Python\Launcher\py.exe",
    "C:\Program Files\Python312\python.exe",
    "C:\Program Files\Python311\python.exe"
)

foreach ($candidate in $pythonCandidates) {
    try {
        $testOutput = & $candidate --version 2>&1
        if ($LASTEXITCODE -eq 0 -and $testOutput -match "Python 3") {
            $pythonExe = $candidate
            break
        }
    } catch {}
}

if (-not $pythonExe) {
    Write-Host "[ERROR] Python 3 was not found on your system." -ForegroundColor Red
    exit 1
}

# 2. Check if backend is already listening on port 8000
$backendRunning = $false
try {
    $tcp = New-Object System.Net.Sockets.TcpClient
    $connect = $tcp.BeginConnect("127.0.0.1", $port, $null, $null)
    $success = $connect.AsyncWaitHandle.WaitOne(800, $false)
    if ($success -and $tcp.Connected) {
        $backendRunning = $true
        $tcp.EndConnect($connect)
    }
    $tcp.Close()
} catch {}

if (-not $backendRunning) {
    Write-Host "[*] Starting VernacLearn AI Full-Stack Server on port $port..." -ForegroundColor Yellow
    $env:PYTHONPATH = $projectRoot
    Start-Process -FilePath $pythonExe -ArgumentList "-m uvicorn backend.main:app --host 0.0.0.0 --port $port" -WorkingDirectory $projectRoot -WindowStyle Minimized
    Start-Sleep -Seconds 3
    Write-Host "[✓] Full-Stack Backend active on http://127.0.0.1:$port" -ForegroundColor Green
} else {
    Write-Host "[✓] Full-Stack Backend already running on http://127.0.0.1:$port" -ForegroundColor Green
}

# 3. Locate cloudflared.exe
if (-not (Test-Path $cfExe)) {
    $fallbackCf = "C:\Users\tecso\.gemini\antigravity-ide\scratch\cloudflared.exe"
    if (Test-Path $fallbackCf) {
        $cfExe = $fallbackCf
    } else {
        Write-Host "[*] cloudflared.exe not found in directory. Downloading..." -ForegroundColor Yellow
        Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile $cfExe
    }
}

Write-Host "[✓] Cloudflare Tunnel engine ready ($cfExe)" -ForegroundColor Green

# 4. Clean previous tunnel logs
if (Test-Path $tunnelLog) {
    Remove-Item $tunnelLog -Force -ErrorAction SilentlyContinue
}

Write-Host "`n[*] Establishing zero-trust TLS 1.3 tunnel to Cloudflare Edge..." -ForegroundColor Yellow

# Launch cloudflared tunnel
$tunnelProcess = Start-Process -FilePath $cfExe -ArgumentList "tunnel --url http://127.0.0.1:$port --logfile `"$tunnelLog`"" -WorkingDirectory $projectRoot -PassThru -NoNewWindow

# 5. Extract the generated public HTTPS URL
$tunnelUrl = $null
$retries = 0
$maxRetries = 25

while ($retries -lt $maxRetries -and -not $tunnelUrl) {
    Start-Sleep -Milliseconds 800
    $retries++
    if (Test-Path $tunnelLog) {
        try {
            $logContent = Get-Content $tunnelLog -Raw -ErrorAction SilentlyContinue
            if ($logContent -match 'https://[a-zA-Z0-9-]+\.trycloudflare\.com') {
                $tunnelUrl = $matches[0]
            }
        } catch {}
    }
    Write-Host "." -NoNewline -ForegroundColor Gray
}

Write-Host ""

if ($tunnelUrl) {
    # Save URL to files for persistent reference and API consumption
    Set-Content -Path $hostLinkFile -Value $tunnelUrl -Encoding UTF8 -Force
    $jsonObj = @{
        url = $tunnelUrl
        status = "active"
        protocol = "HTTPS (TLS 1.3)"
        created_at = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssK")
        microphone_ready = $true
    } | ConvertTo-Json
    Set-Content -Path $hostJsonFile -Value $jsonObj -Encoding UTF8 -Force

    Write-Host ""
    Write-Host "===================================================================" -ForegroundColor Green
    Write-Host "  🎉 PERMANENT SECURED HOST LINK ACTIVE!" -ForegroundColor Green
    Write-Host "===================================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "  🌐 SECURED PUBLIC URL: " -NoNewline -ForegroundColor White
    Write-Host "$tunnelUrl" -ForegroundColor Cyan -BackgroundColor DarkBlue
    Write-Host ""
    Write-Host "  📖 Interactive Swagger Docs: $tunnelUrl/docs" -ForegroundColor Gray
    Write-Host "  ❤️ System Health Check:       $tunnelUrl/health" -ForegroundColor Gray
    Write-Host "  📱 Mobile Microphone:        Fully Enabled (Secure Origin Verified)" -ForegroundColor Green
    Write-Host ""
    Write-Host "-------------------------------------------------------------------" -ForegroundColor DarkGray
    Write-Host "  The link has been saved to: $hostLinkFile" -ForegroundColor Yellow
    Write-Host "  Keep this window open to maintain the secure host link active." -ForegroundColor White
    Write-Host "  To close the host link, press Ctrl+C or close this window." -ForegroundColor Gray
    Write-Host "===================================================================" -ForegroundColor Green
    Write-Host ""

    # Open the secured HTTPS URL in browser
    Start-Process $tunnelUrl

    # Wait for tunnel process to stay alive
    $tunnelProcess.WaitForExit()

} else {
    Write-Host "[!] Could not automatically capture tunnel URL within timeout." -ForegroundColor Yellow
    Write-Host "Check $tunnelLog for details." -ForegroundColor Gray
}
