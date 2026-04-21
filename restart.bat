@echo off
setlocal

set ROOT=c:\Users\Administrator\.gemini\workspace\Bo

echo [1/3] Killing existing processes on ports 3002 and 8002...
powershell -Command "$pids = Get-NetTCPConnection -LocalPort 3002,8002 -ErrorAction SilentlyContinue | Where-Object { $_.OwningProcess -gt 0 } | Select-Object -ExpandProperty OwningProcess | Get-Unique; if ($pids) { foreach ($p in $pids) { Write-Host \"Killing process $p...\"; Stop-Process -Id $p -Force -ErrorAction SilentlyContinue } }"

echo [2/3] Starting Backend API (8002) in a new window...
cd /d %ROOT%\bo-api
start "BO-API Server" cmd /c ".\gradlew.bat bootRun --args='--spring.profiles.active=local'"

echo [3/3] Starting Frontend (3002) in a new window...
cd /d %ROOT%\bo
start "BO-Frontend" cmd /c "npm run dev"

echo.
echo ==========================================
echo 재기동 명령을 보냈습니다. 
echo 각각의 새 창에서 서버가 정상적으로 뜨는지 확인하세요.
echo ==========================================
timeout /t 5
