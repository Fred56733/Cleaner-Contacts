// Code to manage the contact data (Viewing, Cleaning, and Downloading)
import React, { useState } from "react";
import Papa from "papaparse";
import FileInput from "../components/FileInput.jsx";
import ContactsDisplay from "../components/ContactsDisplay.jsx";
import ContactCleaner from "../components/ContactCleaner.jsx";
import CleaningModal from "../components/CleaningModal.jsx";

const ContactManagerPage = () => {
  const [rawContacts, setRawContacts] = useState([]); // Store raw contacts
  const [cleanedContacts, setCleanedContacts] = useState([]); // Store cleaned contacts
  const [summary, setSummary] = useState({ duplicates: [], invalidEmails: []}); // Store summary of cleaning process
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  // Function to parse uploaded file
  const handleFileParsed = (parsedData) => {
    const formattedData = parsedData.map(contact => ({
      fn: contact["First Name"] || "N/A",
      ln: contact["Last Name"] || "N/A",
      email: [contact["E-mail Address"], contact["E-mail 2 Address"], contact["E-mail 3 Address"]].filter(Boolean).join(', ') || "N/A",
      phone: [contact["Business Phone"],contact["Business Phone 2"],contact["Car Phone"],contact["Company Main Phone"],contact["Home Phone"],contact["Home Phone 2"],contact["Mobile Phone"],contact["Primary Phone"],contact["Other Phone"]].filter(Boolean).join(', ') || "N/A"
    }));
    setRawContacts(formattedData);
    setCleanedContacts([]); // Reset cleaned contacts when new file is uploaded
  };

  // Function to handle cleaned contacts from ContactCleaner
  const handleCleanedContacts = (cleanedData) => {
    setCleanedContacts(cleanedData);
  };

  // Function to handle summary from ContactCleaner
  const handleSummary = (summaryData) => {
    setSummary(summaryData);
    setIsModalOpen(true); // Open modal to show summary
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
      <div className="action-buttons">
        <button onClick={downloadCSV} disabled={!rawContacts.length}>
          Download CSV
        </button>
        {rawContacts.length > 0 && (
          <ContactCleaner rawContacts={rawContacts} onCleaned={handleCleanedContacts} onSummary={handleSummary} />
        )}
      </div>
      <ContactsDisplay contacts={cleanedContacts.length > 0 ? cleanedContacts : rawContacts} />
      <CleaningModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} summary={summary} />
    </div>
  );
};

export default ContactManagerPage;