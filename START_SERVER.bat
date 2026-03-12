@echo off
title AgriSahayak - Smart Agriculture Platform
color 0A

echo.
echo  ======================================================
echo     AgriSahayak - AI-Powered Smart Agriculture
echo  ======================================================
echo.

cd /d "%~dp0"

REM Check if virtual environment exists
if exist ".venv\Scripts\python.exe" (
    echo Using virtual environment...
    .venv\Scripts\python.exe start.py
) else (
    echo Using system Python...
    python start.py
)

pause
