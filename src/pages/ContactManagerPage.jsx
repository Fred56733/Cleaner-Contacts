// Code to manage the contact data (Viewing, Cleaning, and Downloading)
import React, { useState } from "react";
import Papa from "papaparse";
import FileInput from "../components/FileInput.jsx";
import ContactsDisplay from "../components/ContactsDisplay.jsx";
import ContactCleaner from "../components/ContactCleaner.jsx";

const ContactManagerPage = () => {
  const [rawContacts, setRawContacts] = useState([]); // Store raw contacts
  const [cleanedContacts, setCleanedContacts] = useState([]); // Store cleaned contacts

  // Function to parse uploaded file
  const handleFileParsed = (parsedData) => {
    const formattedData = parsedData.map(contact => ({
      fn: contact["First Name"] || "N/A",
      ln: contact["Last Name"] || "N/A",
      email: contact["E-mail Address"] || "N/A",
      phone: contact["Mobile Phone"] || "N/A"
    }));
    setRawContacts(formattedData);
    setCleanedContacts([]); // Reset cleaned contacts when new file is uploaded
  };

  // Function to handle cleaned contacts from ContactCleaner
  const handleCleanedContacts = (cleanedData) => {
    setCleanedContacts(cleanedData);
  };

  // Function to download contacts as a CSV
  const downloadCSV = () => {
    const dataToDownload = cleanedContacts.length > 0 ? cleanedContacts : rawContacts;
    const csvData = Papa.unparse(dataToDownload);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "contacts.csv";
    link.click();

    window.URL.revokeObjectURL(url); // Clean up the URL
  };

  return (
    <div>
      <FileInput onFileParsed={handleFileParsed} />
      <div style={{ margin: "10px 0" }}>
        <button onClick={downloadCSV} disabled={!rawContacts.length}>
          Download CSV
        </button>
        {rawContacts.length > 0 && (
          <ContactCleaner rawContacts={rawContacts} onCleaned={handleCleanedContacts} />
        )}
      </div>
      <ContactsDisplay contacts={cleanedContacts.length > 0 ? cleanedContacts : rawContacts} />
    </div>
  );
};

export default ContactManagerPage;