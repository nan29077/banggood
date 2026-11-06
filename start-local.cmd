@echo off
setlocal
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start-preview.ps1" %*
if errorlevel 1 (
  echo.
  echo Preview could not start. See the message above.
  pause
  exit /b 1
)
exit /b 0
