# ==============================================================================
# VernacLearn AI Full-Stack Platform Launcher (PowerShell)
# Serves the complete web application and AI REST APIs on http://localhost:8000
# ==============================================================================

$Host.UI.RawUI.WindowTitle = "VernacLearn Full-Stack AI Platform"
Clear-Host

Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "  🇮🇳 VernacLearn — Full-Stack Vernacular AI Education Platform" -ForegroundColor Yellow
Write-Host "  'Learn in the Language You Think In'" -ForegroundColor White
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Locate Python 3 runtime
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
    } catch {
        # Continue searching
    }
}

if (-not $pythonExe) {
    Write-Host "[ERROR] Python 3.10+ was not found on your system." -ForegroundColor Red
    Write-Host "Please install Python 3 or ensure it is in your PATH." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

$pyVersion = (& $pythonExe --version 2>&1)
Write-Host "[✓] Python Runtime Detected: $pyVersion ($pythonExe)" -ForegroundColor Green

# 2. Set PYTHONPATH to project root
$projectRoot = $PSScriptRoot
$env:PYTHONPATH = $projectRoot
Set-Location -Path $projectRoot

# 3. Check and install dependencies if needed
Write-Host "[*] Checking platform dependencies..." -ForegroundColor Gray
& $pythonExe -c "import fastapi, uvicorn, pydantic" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "[*] Installing required packages from requirements.txt..." -ForegroundColor Yellow
    & $pythonExe -m pip install -r "$projectRoot\requirements.txt" --quiet
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[!] Warning: Some dependencies could not be verified automatically." -ForegroundColor Yellow
    }
}
Write-Host "[✓] All backend dependencies verified." -ForegroundColor Green

Write-Host ""
Write-Host "-------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "  🌐 Full-Stack Web App:        http://localhost:8000/" -ForegroundColor Green
Write-Host "  📖 Interactive API Docs (UI): http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "  ❤️ System Health Check:       http://localhost:8000/health" -ForegroundColor Magenta
Write-Host "-------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Starting server... (Press Ctrl+C to stop)" -ForegroundColor White
Write-Host ""

# 4. Open default browser after a short delay
Start-Job -ScriptBlock {
    Start-Sleep -Seconds 2
    Start-Process "http://localhost:8000"
} | Out-Null

# 5. Launch FastAPI via Uvicorn
& $pythonExe -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
