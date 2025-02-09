import React, { useState } from "react";
import Papa from "papaparse";
import FileInput from "../components/FileInput.jsx";
import ContactsDisplay from "../components/ContactsDisplay.jsx";
import ContactCleaner from "../components/ContactCleaner.jsx";
import ContactPopup from "../components/ContactPopup.jsx";

const ContactManagerPage = () => {
  const [contacts, setContacts] = useState([]); // Store contacts
  const [cleanedContacts, setCleanedContacts] = useState([]); // Store cleaned contacts
  const [selectedContact, setSelectedContact] = useState(null); // Store selected contact for popup
  const [searchQuery, setSearchQuery] = useState(""); // Search input value
  const [filter, setFilter] = useState("all"); // Filter type

  // Function to parse uploaded file
  const handleFileParsed = (parsedData) => {
    console.log("Parsed Data Sample:", parsedData[0]); // Debug log
    setContacts(parsedData); // Store full contact data
    setCleanedContacts([]); // Reset cleaned contacts when new file is uploaded
  };

  // Function to handle cleaned contacts from ContactCleaner
  const handleCleanedContacts = (cleanedData) => {
    setCleanedContacts(cleanedData);
  };

  // Function to update an existing contact
  const updateContact = (updatedContact) => {
    setContacts(
      contacts.map((contact) =>
        contact === selectedContact ? updatedContact : contact
      )
    );
    setSelectedContact(null); // Close popup after editing
  };

  // Function to filter contacts
  const getFilteredContacts = () => {
    let filtered = cleanedContacts.length > 0 ? cleanedContacts : contacts;

    if (filter === "phone") {
      filtered = filtered.filter((contact) =>
        Object.keys(contact).some((key) =>
          key.toLowerCase().includes("phone") && contact[key]?.trim()
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
        const searchValue = searchQuery.toLowerCase();
        return (
          (contact["First Name"] && contact["First Name"].toLowerCase().includes(searchValue)) ||
          (contact["Last Name"] && contact["Last Name"].toLowerCase().includes(searchValue)) ||
          (contact["Mobile Phone"] && contact["Mobile Phone"].toLowerCase().includes(searchValue))
        );
      });
    }

    return filtered;
  };

  return (
    <div>
      <FileInput onFileParsed={handleFileParsed} />

      {/* Clean Contacts Button */}
      {contacts.length > 0 && (
        <div style={{ margin: "10px 0" }}>
          <ContactCleaner rawContacts={contacts} onCleaned={handleCleanedContacts} />
        </div>
      )}

      {/* Search Bar */}
      <div style={{ margin: "10px 0" }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search contacts..."
          style={{ padding: "5px", width: "100%", marginBottom: "10px" }}
        />
      </div>

      {/* Filter Controls */}
      <div style={{ margin: "10px 0" }}>
        <label style={{ marginRight: "10px" }}>Filter Contacts:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: "5px" }}>
          <option value="all">Show All</option>
          <option value="phone">Has Phone Numbers</option>
          <option value="alphabetical">Alphabetical by Initials</option>
        </select>
      </div>

      {/* Display Filtered Contacts */}
      <ContactsDisplay contacts={getFilteredContacts()} onSelectContact={setSelectedContact} />

      {selectedContact && (
        <ContactPopup
          contact={selectedContact}
          onClose={() => setSelectedContact(null)} // Close the popup
          onSave={updateContact} // Handle editing
        />
      )}
    </div>
  );
};

export default ContactManagerPage;
