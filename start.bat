@echo off
echo Starting JAGRUK Application...
echo.

echo Starting Backend Server (Port 5000)...
start "JAGRUK Backend" cmd /k "cd /d %~dp0server && npm start"

timeout /t 3 /nobreak >nul

echo Starting Frontend Client (Port 3000)...
start "JAGRUK Frontend" cmd /k "cd /d %~dp0client && npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause
