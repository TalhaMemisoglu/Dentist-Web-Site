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
