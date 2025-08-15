import React, { useState, useRef } from "react";
import Papa from "papaparse";

const FileInput = ({ onFileParsed }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState(""); // State to store the uploaded file name
  const fileInputRef = useRef(null); // Ref for the file input element

  const handleFile = (file) => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    setFileName(file.name); // Update the file name state

    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContent = e.target.result;
      const fileExtension = file.name.split(".").pop().toLowerCase();

      if (fileExtension === "csv") {
        Papa.parse(fileContent, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            onFileParsed(results.data);
          },
          error: (err) => {
            console.error("Error parsing CSV:", err);
            alert("Error parsing the CSV file.");
          },
        });
      } else {
        alert("Unsupported file type. Please upload a CSV file.");
      }
    };
    reader.readAsText(file);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    handleFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    handleFile(file);
  };

  return (
    <div
      className={`drop-area ${isDragging ? "dragging" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current.click()} // Use ref to trigger the correct input
      style={{
        border: "2px dashed #ccc",
        padding: "20px",
        textAlign: "center",
        cursor: "pointer",
      }}
    >
      <p>
        {fileName
          ? `Uploaded File: ${fileName}` // Display the uploaded file name
          : "Drag & Drop your CSV file here or "}
        {!fileName && (
          <span style={{ color: "blue", textDecoration: "underline" }}>
            click to browse
          </span>
        )}
      </p>
      <input
        ref={fileInputRef} // Attach the ref to the input element
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        hidden
      />
    </div>
  );
};

export default FileInput;
