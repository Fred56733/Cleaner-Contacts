// ContactManagerPage.jsx
import React, { useState, useMemo } from "react";
import Papa from "papaparse";
import FileInput from "../components/FileInput.jsx";
import ContactsDisplay from "../components/ContactsDisplay.jsx";
import ContactCleaner from "../components/ContactCleaner.jsx";
import CleaningModal from "../components/CleaningModal.jsx";
import ContactPopup from "../components/ContactPopup.jsx";
import { useNavigate } from "react-router-dom";

const ContactManagerPage = () => {
  const [contacts, setContacts] = useState([]);
  const [rawContacts, setRawContacts] = useState([]);
  const [cleanedContacts, setCleanedContacts] = useState([]);
  const [deletedContacts, setDeletedContacts] = useState([]);
  const [flaggedContacts, setFlaggedContacts] = useState([]);
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
  const navigate = useNavigate();

  const handleFileParsed = (parsedData) => {
    setRawContacts(parsedData);
    setContacts(parsedData);
    setCleanedContacts([]);
    setSummary({
      duplicates: [],
      invalid: [],
      similar: [],
      incomplete: [],
    });
  };

  const handleCleanedContacts = (cleanedData) => {
    setCleanedContacts(cleanedData);
    setSearchQuery("");
  };

  const handleSummary = (summaryData, shouldOpenModal = true) => {
    setSummary(summaryData);
    if (shouldOpenModal) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSummary({
      duplicates: [],
      invalid: [],
      similar: [],
      incomplete: [],
    });
  };

  return (
    <div>
      <FileInput onFileParsed={handleFileParsed} />

      <div className="action-buttons">
        <button
          onClick={() => {
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
          }}
          disabled={!rawContacts.length}
        >
          Download CSV
        </button>

        {rawContacts.length > 0 && (
          <>
            <ContactCleaner
              rawContacts={rawContacts}
              onCleaned={handleCleanedContacts}
              onSummary={(summaryData) => handleSummary(summaryData, true)}
            />
            <button style={{ marginLeft: "10px" }} onClick={() => navigate("/analytics")}>View Analytics 📈</button>
          </>
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
        contacts={cleanedContacts.length > 0 ? cleanedContacts : contacts}
        onSelectContact={setSelectedContact}
        filter={filter}
        searchQuery={searchQuery}
        isFlagged={() => false} // Dummy placeholder
      />

      {selectedContact && (
        <ContactPopup
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onSave={() => {}}
          onFlag={() => {}}
          isFlagged={() => false}
          isCleaned={cleanedContacts.length > 0}
          deletedContact={() => {}}
          setDeletedContacts={() => {}}
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
        deletedContact={() => {}}
        onRestoreContact={() => {}}
        onMergeSimilar={() => {}}
        setSelectedContact={setSelectedContact}
        ariaHideApp={false}
      />
    </div>
  );
};

export default ContactManagerPage;
