// ContactManagerPage.jsx
import React, { useState } from "react";
import Papa from "papaparse";
import FileInput from "../components/FileInput.jsx";
import ContactsDisplay from "../components/ContactsDisplay.jsx";
import ContactCleaner from "../components/ContactCleaner.jsx";
import ContactPopup from "../components/ContactPopup.jsx";
import CleaningModal from "../components/CleaningModal.jsx";

function ContactManagerPage() {
  const [contacts, setContacts] = useState([]);
  const [cleanedContacts, setCleanedContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  // For cleaning summary
  const [summary, setSummary] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // parse CSV
  const handleFileParsed = (parsedData) => {
    setContacts(parsedData);
    setCleanedContacts([]);
  };

  // cleaning results
  const handleCleanedContacts = (cleanedData) => {
    setCleanedContacts(cleanedData);
  };

  // summary (duplicates, invalid emails)
  const handleCleaningSummary = (data) => {
    setSummary(data);
    setIsModalOpen(true);
  };

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

  // filter logic
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

  return (
    <div>
      <FileInput onFileParsed={handleFileParsed} />

      {/* Clean contacts button if we have any */}
      {contacts.length > 0 && (
        <ContactCleaner
          rawContacts={contacts}
          onCleaned={handleCleanedContacts}
          onSummary={handleCleaningSummary}
          isModalOpen={isModalOpen} // to disable button while summary is open
        />
      )}

      {/* search input */}
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search contacts..."
        />
      </div>

      {/* Pass the filtered array to ContactsDisplay for sorting */}
      <ContactsDisplay
        contacts={getFilteredContacts()}
        onSelectContact={setSelectedContact}
      />

      {/* If a contact is selected, show the popup for editing */}
      {selectedContact && (
        <ContactPopup
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onSave={updateContact}
        />
      )}

      {/* Show the cleaning summary popup if isModalOpen */}
      <CleaningModal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        summary={summary}
      />
    </div>
  );
}

export default ContactManagerPage;
