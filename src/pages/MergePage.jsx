import React, { useState } from "react";
import Papa from "papaparse";
import ContactsNewDisplay from "../components/ContactNewDisplay.jsx"; // Import ContactsDisplay

const MergePage = () => {
  const [csvDataFirst, setCsvDataFirst] = useState([]); // First upload data
  const [csvDataSecond, setCsvDataSecond] = useState([]); // Second upload data
  const [mergedCsv, setMergedCsv] = useState(""); // Merged CSV data
  const [mergedContacts, setMergedContacts] = useState([]); // Merged contacts for ContactsDisplay

  const [filesProcessed, setFilesProcessed] = useState({ first: false, second: false }); // Track if both files are processed

  // Handle file input for the first upload
  const handleFileChangeFirst = (event) => {
    const files = event.target.files;
    let mergedDataFirst = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e) => {
        Papa.parse(e.target.result, {
          header: true,  
          skipEmptyLines: true, 
          complete: (result) => {
            console.log("Parsed Data from First CSV", result.data); 
            mergedDataFirst = mergedDataFirst.concat(result.data);
            if (i === files.length - 1) {
              setCsvDataFirst(mergedDataFirst);
              setFilesProcessed((prev) => ({ ...prev, first: true }));
            }
          },
        });
      };

      reader.readAsText(file);
    }
  };

  const handleFileChangeSecond = (event) => {
    const files = event.target.files;
    let mergedDataSecond = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e) => {
        // Parse the CSV file
        Papa.parse(e.target.result, {
          header: true,  // Use header row for key-value mapping
          skipEmptyLines: true,  // Skip empty lines
          complete: (result) => {
            console.log("Parsed Data from Second CSV", result.data); // Log the parsed data to debug
            mergedDataSecond = mergedDataSecond.concat(result.data);
            if (i === files.length - 1) {
              setCsvDataSecond(mergedDataSecond);
              setFilesProcessed((prev) => ({ ...prev, second: true }));
            }
          },
        });
      };

      reader.readAsText(file);
    }
  };

  // Combine and map data to the expected structure for contacts
  const combineData = () => {
    if (!filesProcessed.first || !filesProcessed.second) {
      return; // Don't merge until both files have been processed
    }

    const combinedData = [...csvDataFirst, ...csvDataSecond];
    console.log("Combined Data:", combinedData); // Log the combined data to debug

    // Map to the contact format
    const formattedContacts = combinedData.map((contact) => ({
      fn: contact["First Name"] || "N/A",
      ln: contact["Last Name"] || "N/A",
      email: [
        contact["E-mail Address"],
        contact["E-mail 2 Address"],
        contact["E-mail 3 Address"],
      ]
        .filter(Boolean)
        .join(", ") || "N/A",
      phone: [
        contact["Business Phone"],
        contact["Business Phone 2"],
        contact["Car Phone"],
        contact["Company Main Phone"],
        contact["Home Phone"],
        contact["Home Phone 2"],
        contact["Mobile Phone"],
        contact["Primary Phone"],
        contact["Other Phone"],
      ]
        .filter(Boolean)
        .join(", ") || "N/A",
    }));

    setMergedCsv(Papa.unparse(combinedData)); // Convert merged data to CSV format
    setMergedContacts(formattedContacts); // Set formatted contacts for display
  };

  // Handle file download for the merged CSV
  const handleDownload = () => {
    const blob = new Blob([mergedCsv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "merged.csv"; // One merged file download
    link.click();
  };

  // Trigger combineData when both files are processed
  React.useEffect(() => {
    if (filesProcessed.first && filesProcessed.second) {
      combineData();
    }
  }, [filesProcessed]);

  return (
    <div>
      <h2>CSV File Merger</h2>

      {/* First Upload Button */}
      <h3>Upload First CSV Files</h3>
      <input type="file" accept=".csv" multiple onChange={handleFileChangeFirst} />
      <br />

      {/* Second Upload Button */}
      <h3>Upload Second CSV Files</h3>
      <input type="file" accept=".csv" multiple onChange={handleFileChangeSecond} />
      <br />

      {/* Download Button for Merged CSV */}
      <button onClick={handleDownload} disabled={!mergedCsv}>
        Download Merged CSV
      </button>

      <div>
        <h4>View Merged Contacts</h4>

        {/* Pass the merged contacts to ContactsDisplay */}
        <ContactsNewDisplay contacts={mergedContacts} />
      </div>
    </div>
  );
};

export default MergePage;