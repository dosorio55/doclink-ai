#!/bin/bash

# Exit on error
set -e

echo "===== Building DocLink AI Application ====="

# Step 1: Build Python backend
echo "Step 1: Building Python backend..."
cd backend

# Check if venv directory exists in backend folder
if [ -d "venv" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
else
    echo "Virtual environment not found in backend folder."
    echo "Please create a virtual environment with: python3 -m venv venv"
    echo "Then install requirements with: pip install -r requirements.txt"
    echo "And install PyInstaller with: pip install pyinstaller"
    exit 1
fi

# Install PyInstaller if not already installed
pip install pyinstaller

# Run the build script
python3 build_executable.py

# Deactivate virtual environment
deactivate

cd ..

# Step 2: Build Tauri application
echo "Step 2: Building Tauri application..."
pnpm run tauri build

echo "===== Build Complete ====="
echo "The application has been built successfully!"
echo "You can find the packaged application in src-tauri/target/release/bundle/"
