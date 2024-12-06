#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status messages
print_status() {
    echo -e "${YELLOW}>>> $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
    exit 1
}

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Please run this script from the project root directory"
fi

# Check for Python
print_status "Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    print_error "Python3 is not installed"
fi
print_success "Python3 is installed"

# Check for Node.js and npm
print_status "Checking Node.js and npm installation..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
fi
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
fi
print_success "Node.js and npm are installed"

# Setup virtual environment
print_status "Setting up Python virtual environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv || print_error "Failed to create virtual environment"
    print_success "Virtual environment created"
else
    print_success "Virtual environment already exists"
fi

# Activate virtual environment
print_status "Activating virtual environment..."
source venv/bin/activate || print_error "Failed to activate virtual environment"
print_success "Virtual environment activated"

# Install Python dependencies
print_status "Installing Python dependencies..."
cd backend || print_error "Failed to enter backend directory"
pip install -r requirements.txt || print_error "Failed to install Python dependencies"
print_success "Python dependencies installed"
cd ..

# Install npm dependencies
print_status "Installing npm dependencies..."
cd frontend || print_error "Failed to enter frontend directory"
npm install || print_error "Failed to install npm dependencies"
print_success "npm dependencies installed"
cd ..

# Start servers
print_status "Starting development servers..."

# Start frontend in background
cd frontend
print_status "Starting frontend server..."
npm run dev &
FRONTEND_PID=$!
cd ..

# Start backend
cd backend
print_status "Starting backend server..."
python manage.py runserver &
BACKEND_PID=$!
cd ..

# Setup trap to kill both servers on script exit
trap 'kill $FRONTEND_PID $BACKEND_PID' EXIT

print_success "Development servers started"
print_status "Frontend server running at http://localhost:5173"
print_status "Backend server running at http://localhost:8000"
print_status "Press Ctrl+C to stop both servers"

# Wait for either process to exit
wait $FRONTEND_PID $BACKEND_PID