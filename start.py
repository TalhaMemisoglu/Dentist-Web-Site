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
'''
import subprocess
import os
import sys
import time

def check_npm_installation():
    try:
        result = subprocess.run(['npm', '--version'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True) # shell=True for Windows
        if result.returncode == 0:
            return True
    except FileNotFoundError:
        print("Error: npm is not installed or not in PATH")
        return False

def check_frontend_setup(frontend_dir):
    if not os.path.exists(os.path.join(frontend_dir, 'package.json')):
        print("Error: package.json not found in frontend directory")
        print("Please run 'npm install' in the frontend directory first")
        return False
    return True

def start_backend():
    backend_dir = os.path.join(os.getcwd(), 'backend')
    if not os.path.exists(backend_dir):
        print("Error: Backend directory not found")
        sys.exit(1)
    
    venv_python = os.path.join('venv', 'Scripts', 'python.exe')
    python_cmd = venv_python if os.path.exists(venv_python) else 'python'
       
    print(f"Starting backend server in: {backend_dir}")
    try:
        backend_process = subprocess.Popen(
            [python_cmd, 'manage.py', 'runserver'],
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

    # Check npm and frontend setup
    if not check_npm_installation():
        sys.exit(1)
    if not check_frontend_setup(frontend_dir):
        sys.exit(1)

    # Install dependencies if node_modules doesn't exist
    if not os.path.exists(os.path.join(frontend_dir, 'node_modules')):
        print("Installing frontend dependencies...")
        try:
            subprocess.run(['npm', 'install'], cwd=frontend_dir, check=True)
        except subprocess.CalledProcessError as e:
            print(f"Error installing dependencies: {str(e)}")
            sys.exit(1)

    print(f"Starting frontend server in: {frontend_dir}")
    try:
        npm_cmd = globals().get('NPM_PATH', 'npm')
        frontend_process = subprocess.Popen(
            [npm_cmd, 'run', 'dev'],
            cwd=frontend_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            universal_newlines=True,
            shell=True,  # shell=True for Windows
            encoding='utf-8',
            errors='replace',
            env={
                **os.environ,  # Include current environment
                'PATH': os.environ['PATH'] + os.pathsep + os.path.dirname(npm_cmd)
                if npm_cmd != 'npm' else os.environ['PATH']
            }
        )
        return frontend_process
    except Exception as e:
        print(f"Error starting frontend: {str(e)}")
        sys.exit(1)

def monitor_output(process, prefix):
    """Monitor and print output from a process with a prefix"""
    process.stdout.reconfigure(encoding='utf-8', errors='replace')
    process.stderr.reconfigure(encoding='utf-8', errors='replace')

    try:
        while True:
            line = process.stdout.readline()
            if not line and process.poll() is not None:
                break
            if line:
                print(f"[{prefix}] {line.strip()}")
        
        while True:
            line = process.stderr.readline()
            if not line and process.poll() is not None:
                break
            if line:
                print(f"[{prefix} ERROR] {line.strip()}")
    except Exception as e:
        print(f"Error monitoring {prefix} output: {str(e)}")

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

        while True:
            if backend_process.poll() is not None:
                print("Backend server stopped unexpectedly!")
                break
            if frontend_process.poll() is not None:
                print("Frontend server stopped unexpectedly!")
                break
            time.sleep(1)

    except KeyboardInterrupt:
        print("\nShutting down servers...")
        try:
            backend_process.terminate()
            frontend_process.terminate()
            # Give processes time to terminate gracefully
            time.sleep(2)
            # Force kill if still running
            if backend_process.poll() is None:
                backend_process.kill()
            if frontend_process.poll() is None:
                frontend_process.kill()
        except:
            pass
        print("Servers stopped.")
        sys.exit(0)

if __name__ == "__main__":
    main()



