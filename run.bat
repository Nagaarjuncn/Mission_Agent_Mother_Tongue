@echo off
TITLE VernacLearn Full-Stack Platform
cls
echo ===================================================================
echo   VernacLearn - Full-Stack Vernacular AI Education Platform
echo   "Learn in the Language You Think In"
echo ===================================================================
echo.

cd /d "%~dp0"
set PYTHONPATH=%~dp0

:: Check for Python in default user local app data or system path
set PYTHON_CMD=python
where python >nul 2>nul
if %errorlevel% neq 0 (
    if exist "%LOCALAPPDATA%\Programs\Python\Python312\python.exe" (
        set PYTHON_CMD="%LOCALAPPDATA%\Programs\Python\Python312\python.exe"
    ) else if exist "%LOCALAPPDATA%\Programs\Python\Launcher\py.exe" (
        set PYTHON_CMD="%LOCALAPPDATA%\Programs\Python\Launcher\py.exe"
    ) else (
        echo [ERROR] Python was not found on your system!
        echo Please ensure Python 3.10+ is installed.
        pause
        exit /b 1
    )
)

echo [OK] Using Python: %PYTHON_CMD%
echo.
echo Launching VernacLearn Full Stack on http://localhost:8000 ...
echo Interactive Swagger Docs at http://localhost:8000/docs
echo.

start "" "http://localhost:8000"
%PYTHON_CMD% -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
pause
