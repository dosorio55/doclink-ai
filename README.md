# DocLink AI - PDF to Markdown Converter

A modern web application that converts PDF files to AI-readable markdown format using Docling. Built with React frontend and Python Flask backend.

## Features

- Upload PDF files through a modern drag-and-drop interface
- Convert PDFs to markdown using Docling library
- Download converted markdown files
- Responsive design with dark mode support
- Cross-platform support (Windows and Linux)

## Setup Instructions

### Backend Setup (Python)

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the Flask server:
```bash
python app.py
```

The backend will be available at `http://localhost:5000`

### Frontend Setup (React)

1. Install dependencies:
```bash
npm install
# or
pnpm install
```

2. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

The frontend will be available at `http://localhost:1420`

## Usage

1. Start both the backend and frontend servers
2. Open the application in your browser
3. Click "Choose PDF file" to select a PDF
4. Click "Convert to Markdown" to process the file
5. Download the converted markdown file

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tauri
- **Backend**: Python, Flask, Docling
- **Styling**: Modern CSS with dark mode support

## Building the Application

### Prerequisites

- **For Linux Development**:
  - Rust (install via `rustup`)
  - Node.js and pnpm
  - Python 3.8+ with venv

- **For Windows Development**:
  - Install Rust with MSVC toolchain
  - Install Visual Studio Build Tools with C++ workload
  - Install WebView2 (https://developer.microsoft.com/en-us/microsoft-edge/webview2/)
  - Node.js and pnpm
  - Python 3.8+ with venv

### Building for Linux

1. Install dependencies:
   ```bash
   # Install system dependencies
   sudo apt update
   sudo apt install -y build-essential libwebkit2gtk-4.0-dev libssl-dev libgtk-3-dev libayatana-appindicator3-dev
   ```

2. Build the application:
   ```bash
   # Install Node.js dependencies
   pnpm install
   
   # Build the application
   pnpm run build:full
   ```

3. The built application will be available in `src-tauri/target/release/`

### Building for Windows from Linux (Cross-Compilation)

1. Install cross-compilation tools:
   ```bash
   # Add Windows target
   rustup target add x86_64-pc-windows-gnu
   
   # Install MinGW cross-compiler
   sudo apt install -y mingw-w64 nsis
   ```

2. Build the Windows version:
   ```bash
   # This will create a Windows installer
   pnpm run build:win
   ```

3. The Windows installer will be available in:
   `src-tauri/target/x86_64-pc-windows-gnu/release/bundle/nsis/`

### Building the Python Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Set up the virtual environment:
   ```bash
   # On Linux/macOS
   python -m venv venv
   source venv/bin/activate
   
   # On Windows
   python -m venv venv
   .\venv\Scripts\activate
   ```

3. Install dependencies and build the executable:
   ```bash
   pip install -r requirements.txt
   python build_executable.py
   ```

### Distribution Notes

- **Windows**:
  - The installer will create a proper Start Menu entry
  - The application will be installed in Program Files
  - Python backend needs to be distributed separately

- **Linux**:
  - The AppImage is portable and doesn't require installation
  - The .deb package will install system-wide

- **Backend**:
  - The Python backend is not automatically bundled with the Tauri app
  - Users need to run it separately or you'll need to create a custom installer
  - The backend executable will be in `backend/dist/doclink_converter/`

## Development

### Running in Development Mode

1. Start the Python backend:
   ```bash
   cd backend
   source venv/bin/activate  # or .\venv\Scripts\activate on Windows
   python app.py
   ```

2. In a separate terminal, start the Tauri dev server:
   ```bash
   pnpm tauri dev
   ```

### Building for Production

To create a production build with both frontend and backend:

```bash
# Build the frontend
pnpm run build

# Build the Python backend executable
cd backend
python build_executable.py

# Build the Tauri application
cd ..
pnpm run tauri build
```

## Troubleshooting

### Windows Build Issues

- If you get linker errors, ensure you have the MSVC toolchain installed:
  ```
  rustup default stable-msvc
  ```

- If WebView2 is not found, install it from:
  https://developer.microsoft.com/en-us/microsoft-edge/webview2/

### Cross-Compilation Issues

- Ensure all required MinGW tools are installed
- Check that the `.cargo/config.toml` file has the correct linker settings
- If you get SSL errors, you might need to set up OpenSSL for cross-compilation
