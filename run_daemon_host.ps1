# VernacLearn Permanent Daemon Host Service
$projectRoot = $PSScriptRoot
$port = 8000
$cfExe = Join-Path $projectRoot "cloudflared.exe"
$tunnelLog = Join-Path $projectRoot "tunnel.log"
$hostLinkFile = Join-Path $projectRoot "HOST_LINK.txt"
$hostJsonFile = Join-Path $projectRoot "host_status.json"

Write-Output "[*] VernacLearn Persistent Host Service starting..."

# Stop any previous instances of cloudflared and uvicorn on port 8000
Get-Process | Where-Object { $_.ProcessName -like "*cloudflared*" } | Stop-Process -Force -ErrorAction SilentlyContinue

$p8000 = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($p8000) {
    Stop-Process -Id $p8000 -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}

if (Test-Path $tunnelLog) {
    Remove-Item $tunnelLog -Force -ErrorAction SilentlyContinue
}

$backendRunning = $false

if (-not $backendRunning) {
    Write-Output "[*] Starting FastAPI / Uvicorn server on port $port..."
    $env:PYTHONPATH = $projectRoot
    $pyProc = Start-Process -FilePath "python" -ArgumentList "-m uvicorn backend.main:app --host 0.0.0.0 --port $port" -WorkingDirectory $projectRoot -PassThru
    Write-Output "[+] Backend started with PID $($pyProc.Id)"
    Start-Sleep -Seconds 3
}

# Start Cloudflare tunnel process directly in this process tree
Write-Output "[*] Connecting Cloudflare Tunnel to 127.0.0.1:$port..."
$cfProc = Start-Process -FilePath $cfExe -ArgumentList "tunnel --url http://127.0.0.1:$port --logfile `"$tunnelLog`"" -WorkingDirectory $projectRoot -PassThru
Write-Output "[+] Cloudflared started with PID $($cfProc.Id)"

# Extract URL from log
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

    Write-Output "[SUCCESS] SECURED_HOST_LINK=$tunnelUrl"
} else {
    Write-Output "[ERROR] Failed to obtain tunnel URL from Cloudflare."
}

# Keep the daemon process alive by waiting on the cloudflared process
if ($cfProc) {
    $cfProc.WaitForExit()
}
