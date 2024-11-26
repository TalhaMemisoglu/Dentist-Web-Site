''' #comment section
import subprocess
import os
import sys

def start_backend():
    backend_dir = os.path.join(os.getcwd(), 'backend')
    print(f"Starting backend in directory: {backend_dir}")
    subprocess.Popen(['python', 'manage.py', 'runserver'], cwd=backend_dir)

def start_frontend():
    frontend_dir = os.path.join(os.getcwd(), 'frontend')
    print(f"Starting frontend in directory: {frontend_dir}")
    subprocess.Popen(['npm', 'run', 'dev'], cwd=frontend_dir, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

if __name__ == "__main__":
    start_backend()
    start_frontend() #|
'''


'''
start_script_attempt_2_not_tested
Dentist-Web-Site/
├── start.py
├── backend/
│   └── manage.py
└── frontend/
    └── package.json

import subprocess
import os
import sys
import time

def start_backend():
    backend_dir = os.path.join(os.getcwd(), 'backend')
    if not os.path.exists(backend_dir):
        print("Error: Backend directory not found")
        sys.exit(1)
        
    print(f"Starting backend server in: {backend_dir}")
    try:
        backend_process = subprocess.Popen(
            ['python', 'manage.py', 'runserver'],
            cwd=backend_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            universal_newlines=True
        )
        return backend_process
    except Exception as e:
        print(f"Error starting backend: {str(e)}")
        sys.exit(1)

def start_frontend():
    frontend_dir = os.path.join(os.getcwd(), 'frontend')
    if not os.path.exists(frontend_dir):
        print("Error: Frontend directory not found")
        sys.exit(1)

    print(f"Starting frontend server in: {frontend_dir}")
    try:
        frontend_process = subprocess.Popen(
            ['npm', 'run', 'dev'],
            cwd=frontend_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            universal_newlines=True
        )
        return frontend_process
    except Exception as e:
        print(f"Error starting frontend: {str(e)}")
        sys.exit(1)

def monitor_output(process, prefix):
    """Monitor and print output from a process with a prefix"""
    for line in process.stdout:
        print(f"[{prefix}] {line.strip()}")
    for line in process.stderr:
        print(f"[{prefix} ERROR] {line.strip()}")

def main():
    try:
        # Start backend
        backend_process = start_backend()
        print("Backend server starting...")
        time.sleep(2)  # Give backend time to start

        # Start frontend
        frontend_process = start_frontend()
        print("Frontend server starting...")

        # Monitor processes
        print("\nServers are running. Press Ctrl+C to stop.\n")
        

        # Debugging and improvments may be usefull
        import threading 
        backend_thread = threading.Thread(
            target=monitor_output,
            args=(backend_process, 'Backend'),
            daemon=True
        )
        frontend_thread = threading.Thread(
            target=monitor_output,
            args=(frontend_process, 'Frontend'),
            daemon=True
        )

        backend_thread.start()
        frontend_thread.start()

        # Keep the script running
        while True:
            if backend_process.poll() is not None:
                print("Backend server stopped unexpectedly!")
                break
            if frontend_process.poll() is not None:
                print("Frontend server stopped unexpectedly!")
                break
            time.sleep(1)
# Bit a cheesy approach
    except KeyboardInterrupt:
        print("\nShutting down servers...")
        try:
            backend_process.terminate()
            frontend_process.terminate()
        except:
            pass
        print("Servers stopped.")
        sys.exit(0)

if __name__ == "__main__":
    main()


'''
