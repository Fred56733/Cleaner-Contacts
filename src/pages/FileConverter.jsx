import React, { useState, useRef } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { parse as parseVCard } from "vcard-parser"; // Import vcard-parser
import "./FileConverter.css";

function FileConverter() {
  const [jsonData, setJsonData] = useState(null);
  const [fileNameBase, setFileNameBase] = useState("converted_contacts");
  const dropRef = useRef(null);

  const parseCustomVCard = (vcardData) => {
    const contacts = [];
    const vcardEntries = vcardData.split(/END:VCARD/i); // Split by "END:VCARD" (case-insensitive)

    vcardEntries.forEach((entry) => {
      if (entry.trim()) {
        const contact = {};
        const lines = entry.split(/\r?\n/); // Split by newlines

        lines.forEach((line) => {
          if (line.startsWith("FN:")) {
            contact["First Name"] = line.replace("FN:", "").trim(); // Map to "First Name"
          } else if (line.startsWith("N:")) {
            const nameParts = line.replace("N:", "").split(";");
            contact["Last Name"] = nameParts[0] || "";
            contact["First Name"] = nameParts[1] || "";
            contact["Middle Name"] = nameParts[2] || "";
            contact["Title"] = nameParts[3] || ""; // Prefix
            contact["Suffix"] = nameParts[4] || "";
          } else if (line.startsWith("TEL")) {
            const phoneMatch = line.match(/TEL.*:(.*)/);
            if (phoneMatch) {
              if (!contact["Mobile Phone"]) {
                contact["Mobile Phone"] = phoneMatch[1].trim(); // Assign to "Mobile Phone"
              } else if (!contact["Home Phone"]) {
                contact["Home Phone"] = phoneMatch[1].trim(); // Assign to "Home Phone"
              } else {
                contact["Other Phone"] = phoneMatch[1].trim(); // Assign to "Other Phone"
              }
            }
          } else if (line.startsWith("EMAIL")) {
            const emailMatch = line.match(/EMAIL.*:(.*)/);
            if (emailMatch) {
              if (!contact["E-mail Address"]) {
                contact["E-mail Address"] = emailMatch[1].trim(); // Assign to "E-mail Address"
              } else if (!contact["E-mail 2 Address"]) {
                contact["E-mail 2 Address"] = emailMatch[1].trim(); // Assign to "E-mail 2 Address"
              } else {
                contact["E-mail 3 Address"] = emailMatch[1].trim(); // Assign to "E-mail 3 Address"
              }
            }
          }
        });

        if (Object.keys(contact).length > 0) {
          contacts.push(contact);
        }
      }
    });

    return contacts;
  };

  const handleFile = (file) => {
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (fileExtension === "csv") {
      // Parse CSV file
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          setJsonData(results.data);
          const name = file.name.replace(/\.[^/.]+$/, "");
          setFileNameBase(`converted_${name}`);
        },
        error: function (error) {
          alert("Failed to parse CSV file. Please ensure the file is valid.");
          console.error("CSV Parsing Error:", error);
        },
      });
    } else if (fileExtension === "vcf") {
      // Parse vCard file
      const reader = new FileReader();
      reader.onload = (e) => {
        const vcardData = e.target.result;
        try {
          const parsedContacts = parseCustomVCard(vcardData);
          setJsonData(parsedContacts);
          const name = file.name.replace(/\.[^/.]+$/, "");
          setFileNameBase(`converted_${name}`);
        } catch (error) {
          alert("Failed to parse vCard file. Please ensure the file is valid.");
          console.error("vCard Parsing Error:", error);
        }
      };
      reader.readAsText(file);
    } else {
      alert("Unsupported file format. Please upload a CSV or vCard file.");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropRef.current.classList.remove("drag-over");

    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropRef.current.classList.add("drag-over");
  };

  const handleDragLeave = () => {
    dropRef.current.classList.remove("drag-over");
  };

  const triggerFileInput = () => {
    document.getElementById("hidden-file-input").click();
  };

  const downloadJSON = () => {
    if (!jsonData) return;
    const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });
    saveAs(jsonBlob, `${fileNameBase}.json`);
  };

  const downloadExcel = () => {
    if (!jsonData) return;
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const excelBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(excelBlob, `${fileNameBase}.xlsx`);
  };

  const downloadCSV = () => {
    if (!jsonData) return;

    // Define the headers for the CSV file
    const headers = [
      "Title",
      "First Name",
      "Middle Name",
      "Last Name",
      "Suffix",
      "Company",
      "Department",
      "Job Title",
      "Business Street",
      "Business Street 2",
      "Business Street 3",
      "Business City",
      "Business State",
      "Business Postal Code",
      "Business Country/Region",
      "Home Street",
      "Home Street 2",
      "Home Street 3",
      "Home City",
      "Home State",
      "Home Postal Code",
      "Home Country/Region",
      "Other Street",
      "Other Street 2",
      "Other Street 3",
      "Other City",
      "Other State",
      "Other Postal Code",
      "Other Country/Region",
      "Assistant's Phone",
      "Business Fax",
      "Business Phone",
      "Business Phone 2",
      "Callback",
      "Car Phone",
      "Company Main Phone",
      "Home Fax",
      "Home Phone",
      "Home Phone 2",
      "ISDN",
      "Mobile Phone",
      "Other Fax",
      "Other Phone",
      "Pager",
      "Primary Phone",
      "Radio Phone",
      "TTY/TDD Phone",
      "Telex",
      "Account",
      "Anniversary",
      "Assistant's Name",
      "Billing Information",
      "Birthday",
      "Business Address PO Box",
      "Categories",
      "Children",
      "Directory Server",
      "E-mail Address",
      "E-mail Type",
      "E-mail Display Name",
      "E-mail 2 Address",
      "E-mail 2 Type",
      "E-mail 2 Display Name",
      "E-mail 3 Address",
      "E-mail 3 Type",
      "E-mail 3 Display Name",
      "Gender",
      "Government ID Number",
      "Hobby",
      "Home Address PO Box",
      "Initials",
      "Internet Free Busy",
      "Keywords",
      "Language",
      "Location",
      "Manager's Name",
      "Mileage",
      "Notes",
      "Office Location",
      "Organizational ID Number",
      "Other Address PO Box",
      "Priority",
      "Private",
      "Profession",
      "Referred By",
      "Sensitivity",
      "Spouse",
      "User 1",
      "User 2",
      "User 3",
      "User 4",
      "Web Page",
    ];

    // Ensure all contacts have the same structure
    const formattedData = jsonData.map((contact) => {
      const formattedContact = {};
      headers.forEach((header) => {
        formattedContact[header] = contact[header] || ""; // Fill missing fields with empty strings
      });
      return formattedContact;
    });

    // Convert to CSV
    const csv = Papa.unparse(formattedData, { header: true });
    const csvBlob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(csvBlob, `${fileNameBase}.csv`);
  };

  const downloadVCard = () => {
    if (!jsonData) return;

    const vcards = jsonData.map((contact) => {
      const name = `${contact["First Name"] || ""} ${contact["Middle Name"] || ""} ${contact["Last Name"] || ""}`.trim();
      const phones = [
        contact["Mobile Phone"],
        contact["Home Phone"],
        contact["Business Phone"],
        contact["Other Phone"],
      ].filter(Boolean); // Filter out empty phone numbers
      const emails = [
        contact["E-mail Address"],
        contact["E-mail 2 Address"],
        contact["E-mail 3 Address"],
      ].filter(Boolean); // Filter out empty email addresses

      const phoneLines = phones.map((phone) => `TEL;TYPE=CELL:${phone}`).join("\n");
      const emailLines = emails.map((email) => `EMAIL:${email}`).join("\n");

      return `BEGIN:VCARD
VERSION:3.0
FN:${name}
N:${contact["Last Name"] || ""};${contact["First Name"] || ""};${contact["Middle Name"] || ""};${contact["Title"] || ""};${contact["Suffix"] || ""}
${phoneLines}
${emailLines}
END:VCARD`;
    });

    const blob = new Blob([vcards.join("\n")], { type: "text/vcard;charset=utf-8" });
    saveAs(blob, `${fileNameBase}.vcf`);
  };

  return (
    <div className="file-converter-page">
      <h2>CSV File Converter</h2>

      <div
        className="drop-zone"
        ref={dropRef}
        onClick={triggerFileInput}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <p>
          Drag & Drop your CSV or vCard file here or{" "}
          <span className="click-text">click to browse</span>
        </p>
        <input
          type="file"
          accept=".csv,.vcf"
          id="hidden-file-input"
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />
      </div>

      {jsonData && (
        <>
          <div className="format-options">
            <button onClick={downloadCSV}>Download as CSV</button>
            <button onClick={downloadJSON}>Download as JSON</button>
            <button onClick={downloadExcel}>Download as Excel</button>
            <button onClick={downloadVCard} style={{ backgroundColor: "#6f42c1" }}>
              Download as vCard (.vcf)
            </button>
          </div>

          <pre>{JSON.stringify(jsonData.slice(0, 5), null, 2)}</pre>
        </>
      )}
    </div>
  );
}

export default FileConverter;
