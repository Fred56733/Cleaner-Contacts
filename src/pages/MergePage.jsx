import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import ContactsDisplay from "../components/ContactsDisplay.jsx";
import FileInput from "../components/FileInput.jsx"; 
import "./MergePage.css"; 

const MergePage = () => {
  const [csvDataFirst, setCsvDataFirst] = useState([]);
  const [csvDataSecond, setCsvDataSecond] = useState([]);
  const [mergedCsv, setMergedCsv] = useState("");
  const [mergedContacts, setMergedContacts] = useState([]);
  const [filesProcessed, setFilesProcessed] = useState({ first: false, second: false });

  const removeDuplicates = (contacts, key) => {
    const uniqueContacts = [];
    const seenKeys = new Set();

    for (const contact of contacts) {
      const contactKey = contact[key];
      if (!seenKeys.has(contactKey) && contactKey !== "N/A") {
        seenKeys.add(contactKey);
        uniqueContacts.push(contact);
      }
    }

    return uniqueContacts;
  };

  const handleFileParsedFirst = (data) => {
    setCsvDataFirst(data);
    setFilesProcessed((prev) => ({ ...prev, first: true }));
  };

  const handleFileParsedSecond = (data) => {
    setCsvDataSecond(data);
    setFilesProcessed((prev) => ({ ...prev, second: true }));
  };

  const combineData = () => {
    if (!filesProcessed.first || !filesProcessed.second) {
      return;
    }

    const combinedData = [...csvDataFirst, ...csvDataSecond];

    const formattedContacts = combinedData.map((contact) => {
      const allPhones = [
        contact["Business Phone"],
        contact["Business Phone 2"],
        contact["Car Phone"],
        contact["Company Main Phone"],
        contact["Home Phone"],
        contact["Home Phone 2"],
        contact["Mobile Phone"],
        contact["Primary Phone"],
        contact["Other Phone"],
      ].filter(Boolean);

      const phoneFields = [
        "Business Phone",
        "Business Phone 2",
        "Car Phone",
        "Company Main Phone",
        "Home Phone",
        "Home Phone 2",
        "Mobile Phone",
        "Primary Phone",
        "Other Phone",
      ];

      phoneFields.forEach((field, index) => {
        contact[field] = allPhones[index] || "";
      });

      contact["E-mail Address"] = contact["E-mail Address"] || "";
      contact["E-mail 2 Address"] = contact["E-mail 2 Address"] || "";
      contact["E-mail 3 Address"] = contact["E-mail 3 Address"] || "";

      Object.keys(contact).forEach((key) => {
        if (!contact[key]) {
          contact[key] = "";
        }
      });

      return contact;
    });

    const uniqueContacts = removeDuplicates(formattedContacts, "E-mail Address");

    setMergedContacts(uniqueContacts);
    setMergedCsv(Papa.unparse(uniqueContacts));
  };

  const handleDownload = () => {
    const blob = new Blob([mergedCsv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "merged.csv";
    link.click();
  };

  useEffect(() => {
    if (filesProcessed.first && filesProcessed.second) {
      combineData();
    }
  }, [filesProcessed]);

  return (
    <div>
      <h2>CSV File Merger</h2>

      {/* First File Input */}
      <h3>Upload First CSV Files</h3>
      <FileInput onFileParsed={handleFileParsedFirst} />

      {/* Second File Input */}
      <h3>Upload Second CSV Files</h3>
      <FileInput onFileParsed={handleFileParsedSecond} />

      {/* Download Button */}
      <button onClick={handleDownload} disabled={!mergedCsv}>
        Download Merged CSV
      </button>

      <div>
        <h4>View Merged Contacts</h4>
        <ContactsDisplay
          contacts={mergedContacts}
          onSelectContact={(contact) => console.log("Selected Contact:", contact)}
        />
      </div>
    </div>
  );
};

export default MergePage;