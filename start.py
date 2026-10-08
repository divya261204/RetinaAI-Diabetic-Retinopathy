import os
import sys
import subprocess
import time
import webbrowser

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
VENV_PYTHON = os.path.join(PROJECT_ROOT, "venv", "Scripts", "python.exe")
VENV_UVICORN = os.path.join(PROJECT_ROOT, "venv", "Scripts", "uvicorn.exe")
FRONTEND_DIR = os.path.join(PROJECT_ROOT, "frontend")

def main():
    print("=" * 65)
    print("      Starting RetinaAI Diabetic Retinopathy Diagnostic Suite")
    print("=" * 65)
    
    # 1. Start FastAPI Backend
    print("\n[1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...")
    backend_cmd = [VENV_UVICORN, "app:app", "--host", "127.0.0.1", "--port", "8000", "--reload"]
    backend_proc = subprocess.Popen(backend_cmd, cwd=PROJECT_ROOT)
    
    time.sleep(3)
    
    # 2. Start React Frontend
    print("[2/2] Starting React Frontend on http://localhost:5173 ...")
    frontend_cmd = "npm run dev"
    frontend_proc = subprocess.Popen(frontend_cmd, cwd=FRONTEND_DIR, shell=True)
    
    time.sleep(2)
    webbrowser.open("http://localhost:5173")
    
    print("\n" + "=" * 65)
    print("System active! Press Ctrl+C in this terminal to stop both servers.")
    print("- Frontend UI:  http://localhost:5173")
    print("- Backend API:  http://127.0.0.1:8000")
    print("=" * 65)
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down servers...")
        backend_proc.terminate()
        frontend_proc.terminate()
        print("Done.")

if __name__ == "__main__":
    main()
