@echo off
echo ======================================================================
echo           Starting RetinaAI Diabetic Retinopathy Diagnostic Suite
echo ======================================================================
echo.

:: Start FastAPI Backend
echo [1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "RetinaAI Backend (FastAPI)" cmd /k ".\venv\Scripts\uvicorn.exe app:app --host 127.0.0.1 --port 8000 --reload"

:: Wait 3 seconds for backend initialization
timeout /t 3 /nobreak >nul

:: Start React Frontend
echo [2/2] Starting React Frontend on http://localhost:5173 ...
start "RetinaAI Frontend (Vite)" cmd /k "cd frontend && npm run dev"

:: Open Web Browser
timeout /t 2 /nobreak >nul
start http://localhost:5173

echo.
echo ======================================================================
echo System successfully launched!
echo - Frontend UI:  http://localhost:5173
echo - Backend API:  http://127.0.0.1:8000
echo - Swagger Docs: http://127.0.0.1:8000/docs
echo ======================================================================
pause
