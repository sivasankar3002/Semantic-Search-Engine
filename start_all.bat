@echo off
echo ============================================
echo   Semantic Search Engine - Startup Script
echo   Architecture: React + Express + Python NLP
echo ============================================
echo.
echo Starting 3 services...
echo.

REM Terminal 1: Python NLP Microservice (port 5001)
echo [1/3] Starting Python NLP Service on port 5001...
start "NLP Service" cmd /c "cd /d %~dp0 && set PYTHONIOENCODING=utf-8 && python nlp_service.py"

echo Waiting for NLP service to load model...
timeout /t 10 /nobreak >nul

REM Terminal 2: Express.js Backend (port 5000)
echo [2/3] Starting Express.js API on port 5000...
start "Express API" cmd /c "cd /d %~dp0\backend && node server.js"

timeout /t 3 /nobreak >nul

REM Terminal 3: React Frontend (port 3000)
echo [3/3] Starting React Dev Server on port 3000...
start "React Frontend" cmd /c "cd /d %~dp0\frontend && npx vite --port 3000"

echo.
echo ============================================
echo   All services starting!
echo.
echo   React Frontend:  http://localhost:3000
echo   Express API:     http://localhost:5000
echo   Python NLP:      http://localhost:5001
echo ============================================
echo.
echo Press any key to exit this window...
pause >nul
