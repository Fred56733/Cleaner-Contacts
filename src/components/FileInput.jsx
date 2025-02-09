// Used to upload a CSV file and parse it using PapaParse
import React from "react";
import Papa from "papaparse";

const FileInput = ({ onFileParsed }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContent = e.target.result;
      const fileExtension = file.name.split(".").pop().toLowerCase();

      if (fileExtension === "csv") {
        Papa.parse(fileContent, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            onFileParsed(results.data); // Pass parsed data to parent
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

  return (
    <input type="file" accept=".csv" onChange={handleFileChange} />
  );
};

export default FileInput;