@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 20 or later is required. Install Node.js LTS and retry.
  pause
  exit /b 1
)
set PORT=3061
node scripts\dev-server.mjs
pause
