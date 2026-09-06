# VernacLearn Background Host Starter
$projectRoot = "c:\Users\tecso\OneDrive\Documents\hostel\The Prototype"
$port = 8000
$cfExe = Join-Path $projectRoot "cloudflared.exe"
$tunnelLog = Join-Path $projectRoot "tunnel.log"
$hostLinkFile = Join-Path $projectRoot "HOST_LINK.txt"
$hostJsonFile = Join-Path $projectRoot "host_status.json"

# 1. Terminate old cloudflared processes
Get-Process | Where-Object { $_.ProcessName -like "*cloudflared*" } | Stop-Process -Force -ErrorAction SilentlyContinue

# Clean old log
if (Test-Path $tunnelLog) {
    Remove-Item $tunnelLog -Force -ErrorAction SilentlyContinue
}

# 2. Check/Start Backend
$backendActive = $false
try {
    $res = Invoke-RestMethod -Uri "http://127.0.0.1:$port/health" -TimeoutSec 1 -ErrorAction SilentlyContinue
    if ($res.status -eq "healthy") {
        $backendActive = $true
    }
} catch {}

if (-not $backendActive) {
    $env:PYTHONPATH = $projectRoot
    $pyProc = Start-Process -FilePath "python" -ArgumentList "-m uvicorn backend.main:app --host 0.0.0.0 --port $port" -WorkingDirectory $projectRoot -WindowStyle Hidden -PassThru
    Write-Host "Started Backend PID: $($pyProc.Id)"
    Start-Sleep -Seconds 3
}

# Verify backend health
try {
    $health = Invoke-RestMethod -Uri "http://127.0.0.1:$port/health" -TimeoutSec 2
    Write-Host "Backend Health: $($health.status)"
} catch {
    Write-Host "Backend health check warning: $($_.Exception.Message)"
}

# 3. Start cloudflared in background
$cfProc = Start-Process -FilePath $cfExe -ArgumentList "tunnel --url http://127.0.0.1:$port --logfile `"$tunnelLog`"" -WorkingDirectory $projectRoot -WindowStyle Hidden -PassThru
Write-Host "Started Cloudflared PID: $($cfProc.Id)"

# 4. Wait for tunnel URL
$tunnelUrl = $null
for ($i = 0; $i -lt 30; $i++) {
    Start-Sleep -Milliseconds 800
    if (Test-Path $tunnelLog) {
        $content = Get-Content $tunnelLog -Raw -ErrorAction SilentlyContinue
        if ($content -match "https://[a-zA-Z0-9-]+\.trycloudflare\.com") {
            $tunnelUrl = $matches[0]
            break
        }
    }
}

if ($tunnelUrl) {
    Set-Content -Path $hostLinkFile -Value $tunnelUrl -Encoding UTF8 -Force
    @{
        url = $tunnelUrl
        status = "active"
        protocol = "HTTPS (TLS 1.3)"
        created_at = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssK")
        microphone_ready = $true
    } | ConvertTo-Json | Set-Content -Path $hostJsonFile -Encoding UTF8 -Force

    Write-Host "NEW_HOST_URL=$tunnelUrl"
} else {
    Write-Host "ERROR: Tunnel URL not found"
}
