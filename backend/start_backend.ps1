# VernacLearn Backend Startup Script (PowerShell)
param([int]$Port = 8000)

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "   Starting VernacLearn AI Backend Server       " -ForegroundColor Yellow
Write-Host "=================================================" -ForegroundColor Cyan

# Locate Python 3.12
$pythonPath = "C:\Users\tecso\AppData\Local\Programs\Python\Python312\python.exe"
if (!(Test-Path $pythonPath)) {
    $pythonCmd = Get-Command python -ErrorAction SilentlyContinue
    if ($pythonCmd) { $pythonPath = $pythonCmd.Source }
}

if (!(Test-Path $pythonPath)) {
    Write-Error "Python executable not found at $pythonPath"
    exit 1
}

$backendDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$rootDir = Split-Path -Parent $backendDir

Write-Host "Backend Directory: $backendDir" -ForegroundColor Gray
Write-Host "Using Python: $pythonPath" -ForegroundColor Green
Write-Host "Interactive API Docs: http://localhost:$Port/docs" -ForegroundColor Yellow
Write-Host "Web Application: http://localhost:$Port/" -ForegroundColor Green

# Launch Uvicorn with auto-reload
Set-Location $rootDir
& $pythonPath -m uvicorn backend.main:app --host 0.0.0.0 --port $Port --reload
