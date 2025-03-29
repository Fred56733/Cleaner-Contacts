// ContactManagerPage.jsx
import React, { useState, useMemo } from "react";
import Papa from "papaparse";
import FileInput from "../components/FileInput.jsx";
import ContactsDisplay from "../components/ContactsDisplay.jsx";
import ContactCleaner from "../components/ContactCleaner.jsx";
import CleaningModal from "../components/CleaningModal.jsx";
import ContactPopup from "../components/ContactPopup.jsx";

const ContactManagerPage = () => {
  const [contacts, setContacts] = useState([]);
  const [rawContacts, setRawContacts] = useState([]); // Store raw contacts
  const [cleanedContacts, setCleanedContacts] = useState([]); // Store cleaned contacts
  const [deletedContacts, setDeletedContacts] = useState([]); // Store deleted contacts
  const [flaggedContacts, setFlaggedContacts] = useState([]); // Store flagged contacts
  const [summary, setSummary] = useState({
    duplicates: [],
    invalid: [],
    similar: [],
    incomplete: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalMinimized, setIsModalMinimized] = useState(false);
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
    setSearchQuery(""); // Clear search query
  };

  // Handle cleaning summary
  const handleSummary = (summaryData, shouldOpenModal = true) => {
    setSummary(summaryData);
    if (shouldOpenModal) {
      setIsModalOpen(true);
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSummary({
      duplicates: [],
      invalid: [],
      similar: [],
      incomplete: [],
    });
  };

  // Update contact from popup
  const updateContact = (updatedContact) => {
    const isSameContact = (a, b) => {
      return (
        (a.firstName || a["First Name"]) === (b.firstName || b["First Name"]) &&
        (a.lastName || a["Last Name"]) === (b.lastName || b["Last Name"]) &&
        (a.email || a["E-mail Address"]) === (b.email || b["E-mail Address"]) &&
        (a.phone || a["Mobile Phone"]) === (b.phone || b["Mobile Phone"])
      );
    };
  
    // Update rawContacts
    setRawContacts((prevRawContacts) =>
      prevRawContacts.map((c) =>
        isSameContact(c, selectedContact) ? { ...c, ...updatedContact } : c
      )
    );
  
    // Update contacts
    setContacts((prevContacts) =>
      prevContacts.map((c) =>
        isSameContact(c, selectedContact) ? { ...c, ...updatedContact } : c
      )
    );
  
    // Update cleanedContacts
    setCleanedContacts((prevCleanedContacts) =>
      prevCleanedContacts.map((c) =>
        isSameContact(c, selectedContact) ? { ...c, ...updatedContact } : c
      )
    );
  
    // Clear the selected contact
    setSelectedContact(null);
  };
  // Flag or unflag a contact
  const flagContact = (contactToFlag, isFlagged) => {
    const isSameContact = (a, b) => {
      return (
        (a.firstName || a["First Name"]) === (b.firstName || b["First Name"]) &&
        (a.lastName || a["Last Name"]) === (b.lastName || b["Last Name"]) &&
        (a.email || a["E-mail Address"]) === (b.email || b["E-mail Address"]) &&
        (a.phone || a["Mobile Phone"]) === (b.phone || b["Mobile Phone"])
      );
    };

    // Update flagged contacts
    setFlaggedContacts((prevFlagged) => {
      const updatedFlagged = isFlagged
        ? [...prevFlagged, { ...contactToFlag, isUserFlagged: true }]
        : prevFlagged.filter((c) => !isSameContact(c, contactToFlag));
      return updatedFlagged;
    });

    //Update main contacts list
    setContacts((prev) =>
      prev.map((c) =>
        isSameContact(c, contactToFlag)
          ? { ...c, isFlagged, isUserFlagged: isFlagged } : c
      )
    );

    // Update cleaned contacts list
    setCleanedContacts((prev) =>
      prev.map((c) =>
        isSameContact(c, contactToFlag)
          ? { ...c, isFlagged, isUserFlagged: isFlagged } : c
      )
    );

    // Ensure the popup re-renders by updating the selected contact
    setSelectedContact((prevSelected) =>
      isSameContact(prevSelected, contactToFlag)
        ? { ...prevSelected, isFlagged, isUserFlagged: isFlagged } : prevSelected
    );

    // Update the summary when unflagging
    if (!isFlagged) {
      setSummary((prevSummary) => {
        const filterCategory = (list) =>
          list.filter((c) => !isSameContact(c, contactToFlag));

        return {
          duplicates: filterCategory(prevSummary.duplicates),
          invalid: filterCategory(prevSummary.invalid),
          similar: filterCategory(prevSummary.similar),
          incomplete: filterCategory(prevSummary.incomplete),
        };
      });

      // Minimize the cleaningModal
      setIsModalMinimized(true);
    } else {
      // Open the modal only if the contact is flagged
      setIsModalOpen(true);
    }
  };

  // Check if a contact is flagged
  const isFlagged = (contact) => {
    const isInSummary = (list) =>
      list.some(
        (c) =>
          (c.firstName || c["First Name"]) === (contact.firstName || contact["First Name"]) &&
          (c.lastName || c["Last Name"]) === (contact.lastName || contact["Last Name"]) &&
          (c.email || c["E-mail Address"]) === (contact.email || contact["E-mail Address"]) &&
          (c.phone || c["Mobile Phone"]) === (contact.phone || contact["Mobile Phone"])
      );

    return (
      contact.isFlagged ||
      isInSummary(summary.duplicates) ||
      isInSummary(summary.invalid) ||
      isInSummary(summary.similar) ||
      isInSummary(summary.incomplete)
    );
  };

  // Delete a contact
  const deletedContact = (contactToDelete) => {
    const isSameContact = (a, b) => {
      return (
        (a.firstName || a["First Name"]) === (b.firstName || b["First Name"]) &&
        (a.lastName || a["Last Name"]) === (b.lastName || b["Last Name"]) &&
        (a.email || a["E-mail Address"]) === (b.email || b["E-mail Address"]) &&
        (a.phone || a["Mobile Phone"]) === (b.phone || b["Mobile Phone"])
      );
    };

    setDeletedContacts((prevDeleted) => {
      if (!prevDeleted.some((c) => isSameContact(c, contactToDelete))) {
        return [...prevDeleted, contactToDelete];
      }
      return prevDeleted;
    });

    setContacts((prev) =>
      prev.filter((c) => !isSameContact(c, contactToDelete))
    );

    setCleanedContacts((prev) =>
      prev.filter((c) => !isSameContact(c, contactToDelete))
    );

    setSummary((prevSummary) => {
      const filterCategory = (list) =>
        list.filter((c) => !isSameContact(c, contactToDelete));

      return {
        duplicates: filterCategory(prevSummary.duplicates),
        invalid: filterCategory(prevSummary.invalid),
        similar: filterCategory(prevSummary.similar),
        incomplete: filterCategory(prevSummary.incomplete),
      };
    });
  };

  // Restore a deleted contact
  const restoreContact = (contactToRestore) => {
    setContacts((prevContacts) => [...prevContacts, contactToRestore]);
    setCleanedContacts((prevCleaned) => [...prevCleaned, contactToRestore]);
    setDeletedContacts((prevDeleted) =>
      prevDeleted.filter((c) => c !== contactToRestore)
    );
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
    const dataToDownload = cleanedContacts.length > 0 ? cleanedContacts : contacts;
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
          <ContactCleaner rawContacts={rawContacts} onCleaned={handleCleanedContacts} onSummary={(summaryData) => handleSummary(summaryData, true)} />
        )}
      </div>

      <div>
        <input
          className="contact-search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search contacts..."
        />
      </div>

      <ContactsDisplay
        contacts={getFilteredContacts()}
        onSelectContact={setSelectedContact}
        filter={filter}
        searchQuery={searchQuery}
        isFlagged={isFlagged}
      />

      {selectedContact && (
        <ContactPopup
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onSave={updateContact}
          onFlag={flagContact}
          isFlagged={isFlagged}
        />
      )}

      <CleaningModal
        key={JSON.stringify(summary)}
        isOpen={isModalOpen}
        isMinimized={isModalMinimized}
        setIsModalMinimized={setIsModalMinimized}
        onRequestClose={handleCloseModal}
        summary={summary}
        flaggedContacts={flaggedContacts}
        setFlaggedContacts={setFlaggedContacts}
        deletedContacts={deletedContacts}
        setDeletedContacts={setDeletedContacts}
        setSummary={setSummary}
        deletedContact={deletedContact}
        onRestoreContact={restoreContact}
        ariaHideApp={false}
      />
    </div>
  );
};

export default ContactManagerPage;
