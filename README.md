# DocLink AI - PDF to Markdown Converter

A modern web application that converts PDF files to AI-readable markdown format using Docling. Built with React frontend and Python Flask backend.

## Features

- Upload PDF files through a modern drag-and-drop interface
- Convert PDFs to markdown using Docling library
- Download converted markdown files
- Responsive design with dark mode support

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

## Building Executable

To build a standalone executable of the backend:

1. Install PyInstaller:
```bash
cd backend
source venv/bin/activate
pip install pyinstaller
```

2. Run the build script:
```bash
python build_executable.py
```

3. The executable will be created in the `dist/doclink_converter` directory

### Notes on Executable Distribution

- The executable will handle paths correctly regardless of where it's run
- Models will be cached in a `docling_cache` folder next to the executable
- First run on a new machine may still download some models if they weren't cached during build
- Distribute the entire `doclink_converter` directory, not just the executable file
