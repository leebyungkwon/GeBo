@echo off
setlocal

set ROOT=c:\Users\Administrator\.gemini\workspace\Bo

echo Killing existing Frontend process on port 3002...
powershell -Command "$pids = Get-NetTCPConnection -LocalPort 3002 -ErrorAction SilentlyContinue | Where-Object { $_.OwningProcess -gt 0 } | Select-Object -ExpandProperty OwningProcess | Get-Unique; if ($pids) { foreach ($p in $pids) { Write-Host \"Killing process $p...\"; Stop-Process -Id $p -Force -ErrorAction SilentlyContinue } }"

echo Starting Frontend (3002) in a new window...
cd /d %ROOT%\bo
start "BO-Frontend" cmd /c "npm run dev"

echo.
echo ==========================================
echo 프론트엔드 재기동 명령을 보냈습니다.
echo ==========================================
timeout /t 3
