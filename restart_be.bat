@echo off
setlocal

set ROOT=c:\Users\Administrator\.gemini\workspace\Bo

echo Killing existing Backend process on port 8002...
powershell -Command "$pids = Get-NetTCPConnection -LocalPort 8002 -ErrorAction SilentlyContinue | Where-Object { $_.OwningProcess -gt 0 } | Select-Object -ExpandProperty OwningProcess | Get-Unique; if ($pids) { foreach ($p in $pids) { Write-Host \"Killing process $p...\"; Stop-Process -Id $p -Force -ErrorAction SilentlyContinue } }"

echo Starting Backend API (8002) in a new window...
cd /d %ROOT%\bo-api
start "BO-API Server" cmd /c ".\gradlew.bat bootRun --args='--spring.profiles.active=local'"

echo.
echo ==========================================
echo 백엔드 재기동 명령을 보냈습니다.
echo ==========================================
timeout /t 3
