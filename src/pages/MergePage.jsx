// ContactManagerPage.jsx
import React, { useState } from "react";
import Papa from "papaparse";
import FileInput from "../components/FileInput.jsx";
import ContactsDisplay from "../components/ContactsDisplay.jsx";
import ContactCleaner from "../components/ContactCleaner.jsx";
import CleaningModal from "../components/CleaningModal.jsx";
import ContactPopup from "../components/ContactPopup.jsx";

const ContactManagerPage = () => {
  const [rawContacts, setRawContacts] = useState([]); // Store raw contacts
  const [contacts, setContacts] = useState([]);
  const [cleanedContacts, setCleanedContacts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  // Parse CSV
  const handleFileParsed = (parsedData) => {
    setRawContacts(parsedData);
    setContacts(parsedData);
    setCleanedContacts([]);
  };

  // Cleaning results
  const handleCleanedContacts = (cleanedData) => {
    setCleanedContacts(cleanedData);
  };

  // Handle cleaning summary
  const handleSummary = (summaryData) => {
    setSummary(summaryData);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSummary(null);
  };

  // Update contact from popup
  const updateContact = (updatedContact) => {
    setContacts(
      contacts.map((c) => (c === selectedContact ? updatedContact : c))
    );
    setSelectedContact(null);
  };

  // Filter logic
  const getFilteredContacts = () => {
    let filtered = cleanedContacts.length > 0 ? cleanedContacts : contacts;

    if (filter === "phone") {
      filtered = filtered.filter((contact) =>
        Object.keys(contact).some(
          (key) => key.toLowerCase().includes("phone") && contact[key]?.trim()
        )
      );
    }

    if (filter === "alphabetical") {
      filtered.sort((a, b) => {
        const aName = `${a["First Name"]?.[0] || ""}${a["Last Name"]?.[0] || ""}`.toUpperCase();
        const bName = `${b["First Name"]?.[0] || ""}${b["Last Name"]?.[0] || ""}`.toUpperCase();
        return aName.localeCompare(bName);
      });
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter((contact) => {
        const s = searchQuery.toLowerCase();
        return (
          (contact["First Name"] &&
            contact["First Name"].toLowerCase().includes(s)) ||
          (contact["Last Name"] &&
            contact["Last Name"].toLowerCase().includes(s)) ||
          (contact["Mobile Phone"] &&
            contact["Mobile Phone"].toLowerCase().includes(s))
        );
      });
    }
    return filtered;
  };

  // Download contacts as CSV
  const downloadCSV = () => {
    const dataToDownload = cleanedContacts.length > 0 ? cleanedContacts : rawContacts;
    const csvData = Papa.unparse(dataToDownload);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "contacts.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <FileInput onFileParsed={handleFileParsed} />

      <div className="action-buttons">
        <button onClick={downloadCSV} disabled={!rawContacts.length}>Download CSV</button>
        {rawContacts.length > 0 && (
          <ContactCleaner rawContacts={rawContacts} onCleaned={handleCleanedContacts} onSummary={handleSummary} />
        )}
      </div>

      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search contacts..."
        />
      </div>

      <ContactsDisplay contacts={getFilteredContacts()} onSelectContact={setSelectedContact} />

      {selectedContact && (
        <ContactPopup
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onSave={updateContact}
        />
      )}

      <CleaningModal isOpen={isModalOpen} onRequestClose={handleCloseModal} summary={summary} />
    </div>
  );
};

export default ContactManagerPage;