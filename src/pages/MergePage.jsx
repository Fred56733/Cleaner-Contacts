import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import ContactsDisplay from "../components/ContactsDisplay.jsx";
import FileInput from "../components/FileInput.jsx"; 
import "./MergePage.css"; 

const MergePage = () => {
  const [csvDataFirst, setCsvDataFirst] = useState([]); // State for the first file
  const [csvDataSecond, setCsvDataSecond] = useState([]); // State for the second file
  const [mergedCsv, setMergedCsv] = useState("");
  const [mergedContacts, setMergedContacts] = useState([]);
  const [filesProcessed, setFilesProcessed] = useState({ first: false, second: false });
  const [searchQuery, setSearchQuery] = useState("");

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
    console.log("First CSV Data:", data); // Debugging log
    setCsvDataFirst(data); // Update state for the first file
    setFilesProcessed((prev) => ({ ...prev, first: true }));
  };

  const handleFileParsedSecond = (data) => {
    console.log("Second CSV Data:", data); // Debugging log
    setCsvDataSecond(data); // Update state for the second file
    setFilesProcessed((prev) => ({ ...prev, second: true }));
  };

  const combineData = () => {
    if (!filesProcessed.first || !filesProcessed.second) {
      return;
    }

    const combinedData = [...csvDataFirst, ...csvDataSecond];
    console.log("Combined Data Before Formatting:", combinedData); // Debugging log

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

    console.log("Formatted Contacts:", formattedContacts); // Debugging log

    const uniqueContacts = removeDuplicates(formattedContacts, "E-mail Address");
    console.log("Unique Contacts:", uniqueContacts); // Debugging log

    setMergedContacts(uniqueContacts);
    console.log("Updated Merged Contacts:", uniqueContacts); // Debugging log
    setMergedCsv(Papa.unparse(uniqueContacts));
  };

  const handleDownload = () => {
    const blob = new Blob([mergedCsv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "merged.csv";
    link.click();
  };

  const getFilteredContacts = () => {
    if (!searchQuery.trim()) {
      console.log("Filtered Contacts (No Search):", mergedContacts); // Debugging log
      return mergedContacts;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    const filteredContacts = mergedContacts.filter((contact) => {
      return (
        (contact["First Name"] && contact["First Name"].toLowerCase().includes(lowerCaseQuery)) ||
        (contact["Last Name"] && contact["Last Name"].toLowerCase().includes(lowerCaseQuery)) ||
        (contact["E-mail Address"] && contact["E-mail Address"].toLowerCase().includes(lowerCaseQuery)) ||
        (contact["Mobile Phone"] && contact["Mobile Phone"].toLowerCase().includes(lowerCaseQuery))
      );
    });

    console.log("Filtered Contacts (With Search):", filteredContacts); // Debugging log
    return filteredContacts;
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
      <h3>Upload First CSV File</h3>
      <FileInput onFileParsed={handleFileParsedFirst} uniqueId="fileInputFirst" />

      {/* Second File Input */}
      <h3>Upload Second CSV File</h3>
      <FileInput onFileParsed={handleFileParsedSecond} uniqueId="fileInputSecond" />
      
      {/* Download Button */}
      <button onClick={handleDownload} disabled={!mergedCsv}>
        Download Merged CSV
      </button>

      {/* Search Bar */}
      <div>
        <input
          type="text"
          className="contact-search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search contacts..."
        />
      </div>

      <div>
        <h3>Merged Contacts</h3>
        <ContactsDisplay
          contacts={getFilteredContacts()}
          onSelectContact={(contact) => console.log("Selected Contact:", contact)}
        />
      </div>
    </div>
  );
};

export default MergePage;