import { useState, useRef } from "react";
import "./App.css";

interface ProcessedFile {
  processed_file_id: string;
  original_filename: string;
  processed_filename: string;
}

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [processedFile, setProcessedFile] = useState<ProcessedFile | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        setSelectedFile(file);
        setError("");
        setProcessedFile(null);
      } else {
        setError("Please select a PDF file only");
        setSelectedFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setProcessedFile(result);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setError(result.error || "Upload failed");
      }
    } catch (err) {
      setError("Connection error. Make sure the backend server is running.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async () => {
    if (!processedFile) return;

    try {
      const response = await fetch(
        `http://localhost:5000/download/${processedFile.processed_file_id}`
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = processedFile.processed_filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setError("Download failed");
      }
    } catch (err) {
      setError("Download error occurred");
    }
  };

  return (
    <main className="container">
      <h1>DocLink AI - PDF to Markdown Converter</h1>
      <p>Upload a PDF file and convert it to AI-readable markdown format using Docling</p>

      <div className="upload-section">
        <div className="file-input-container">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="file-input"
            id="pdf-upload"
          />
          <label htmlFor="pdf-upload" className="file-input-label">
            {selectedFile ? selectedFile.name : "Choose PDF file"}
          </label>
        </div>

        {selectedFile && (
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="upload-btn"
          >
            {isUploading ? "Processing..." : "Convert to Markdown"}
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {processedFile && (
        <div className="success-section">
          <div className="success-message">
            ✅ Successfully converted "{processedFile.original_filename}" to markdown!
          </div>
          <button onClick={handleDownload} className="download-btn">
            Download {processedFile.processed_filename}
          </button>
        </div>
      )}
    </main>
  );
}

export default App;
