import { useState, useRef, useEffect } from "react";
import "./App.css";

// Determine if we're running in development or production mode
const isDev = import.meta.env.DEV;
const API_BASE_URL = isDev ? "http://localhost:5000" : "http://localhost:5000";

interface ProcessedFile {
  processed_file_id: string;
  original_filename: string;
  processed_filename: string;
}

interface AvailableFile {
  id: string;
  filename: string;
  original_name: string;
}

type TabType = "upload" | "download";

function App() {
  const [activeTab, setActiveTab] = useState<TabType>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [processedFile, setProcessedFile] = useState<ProcessedFile | null>(
    null
  );
  const [availableFiles, setAvailableFiles] = useState<AvailableFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
      const response = await fetch(`${API_BASE_URL}/upload`, {
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

  const fetchAvailableFiles = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/files`);
      const data = await response.json();

      if (response.ok) {
        setAvailableFiles(data.files);
      } else {
        setError(data.error || "Failed to fetch available files");
      }
    } catch (err) {
      setError("Connection error. Make sure the backend server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "download") {
      fetchAvailableFiles();
    }
  }, [activeTab]);

  const handleDownload = async (fileId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/download/${fileId}`);

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const fileName =
          availableFiles.find((file) => file.id === fileId)?.filename ||
          "document.md";
        a.download = fileName;
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

  const handleDownloadProcessed = async () => {
    if (!processedFile) return;
    await handleDownload(processedFile.processed_file_id);
  };

  return (
    <main className="container">
      <h1>DocLink AI - PDF to Markdown Converter</h1>
      <p>
        Upload a PDF file and convert it to AI-readable markdown format using
        Docling
      </p>

      <div className="tabs">
        <button
          className={`tab ${activeTab === "upload" ? "active" : ""}`}
          onClick={() => setActiveTab("upload")}
        >
          Upload New File
        </button>
        <button
          className={`tab ${activeTab === "download" ? "active" : ""}`}
          onClick={() => setActiveTab("download")}
        >
          Download Converted Files
        </button>
      </div>

      {activeTab === "upload" && (
        <div className="tab-content">
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
                ✅ Successfully converted "{processedFile.original_filename}" to
                markdown!
              </div>
              <button
                onClick={handleDownloadProcessed}
                className="download-btn"
              >
                Download {processedFile.processed_filename}
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "download" && (
        <div className="tab-content">
          {isLoading ? (
            <div className="loading">Loading available files...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : availableFiles.length === 0 ? (
            <div className="no-files">
              No converted files available. Upload a PDF first.
            </div>
          ) : (
            <div className="files-list">
              <h3>Available Files</h3>
              <ul>
                {availableFiles.map((file) => (
                  <li key={file.id} className="file-item">
                    <span className="file-name">{file.original_name}</span>
                    <button
                      onClick={() => handleDownload(file.id)}
                      className="download-btn small"
                    >
                      Download
                    </button>
                  </li>
                ))}
              </ul>
              <button onClick={fetchAvailableFiles} className="refresh-btn">
                Refresh List
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default App;
