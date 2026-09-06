@echo off
echo =================================================
echo    Starting VernacLearn AI Backend Server
echo =================================================
cd /d "%~dp0\.."
"C:\Users\tecso\AppData\Local\Programs\Python\Python312\python.exe" -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
pause
