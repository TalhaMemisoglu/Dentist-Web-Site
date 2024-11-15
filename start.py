import os
import subprocess

# Get the absolute paths of the directories
backend_dir = os.path.abspath("backend")
frontend_dir = os.path.abspath("frontend")

print(f"Backend directory: {backend_dir}")
print(f"Frontend directory: {frontend_dir}")


try:
    # Start the backend
    backend = subprocess.Popen(["python", "manage.py", "runserver"], cwd=backend_dir)

    # Start the frontend
    frontend = subprocess.Popen(["npm", "run", "dev"], cwd=frontend_dir)

    # Wait for the processes to finish
    backend.wait()
    frontend.wait()
except FileNotFoundError as e:
    print(f"Error: {e}")
except KeyboardInterrupt:
    print("Shutting down...")
    backend.terminate()
    frontend.terminate()
