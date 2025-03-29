import React, { useState } from "react";
import Modal from "react-modal";
import "./CleaningModal.css";

Modal.setAppElement("#root");

const CleaningModal = ({
  isOpen,
  onRequestClose,
  summary,
  flaggedContacts,
  setFlaggedContacts,
  deletedContacts,
  setDeletedContacts,
  setSummary,
  deletedContact,
  onRestoreContact,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { duplicates = [], invalid = [], similar = [], incomplete = [] } = summary || {};

  const getCategoryData = () => ({
    "Duplicate Contacts": summary.duplicates,
    "Invalid Contacts": summary.invalid,
    "Similar Contacts": summary.similar,
    "Incomplete Contacts": summary.incomplete,
    "User Flagged": flaggedContacts,
    "Recently Deleted": deletedContacts,
  });

  const categoryData = getCategoryData();

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentIndex(0);
  };

  const handleNext = () => {
    if (currentIndex < categoryData[selectedCategory].length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleDeleteContact = () => {
    const contactToDelete = categoryData[selectedCategory][currentIndex];

    const updatedCategory = categoryData[selectedCategory].filter((c) => c !== contactToDelete);

    const updatedSummary = {
      duplicates: [...summary.duplicates.filter((c) => c !== contactToDelete)],
      invalid: [...summary.invalid.filter((c) => c !== contactToDelete)],
      similar: [...summary.similar.filter((c) => c !== contactToDelete)],
      incomplete: [...summary.incomplete.filter((c) => c !== contactToDelete)],
    };

    const summaryKeyMap = {
      "Duplicate Contacts": "duplicates",
      "Invalid Contacts": "invalid",
      "Similar Contacts": "similar",
      "Incomplete Contacts": "incomplete",
    };

    if (summaryKeyMap[selectedCategory]) {
      updatedSummary[summaryKeyMap[selectedCategory]] = [...updatedCategory];
    }

    if (selectedCategory === "User Flagged") {
      const updatedFlaggedContacts = flaggedContacts.filter((c) => c !== contactToDelete);
      setFlaggedContacts(updatedFlaggedContacts);
    }

    setSummary(updatedSummary);

    setDeletedContacts((prev) => {
      if (!prev.some((c) => c === contactToDelete)) {
        return [...prev, contactToDelete];
      }
      return prev;
    });

    deletedContact(contactToDelete);

    const newIndex = Math.max(0, updatedCategory.length - 1);
    setCurrentIndex(newIndex);
  };

  const handleRestoreContact = () => {
    const contactToRestore = categoryData[selectedCategory][currentIndex];
    const updatedDeletedContacts = deletedContacts.filter((c) => c !== contactToRestore);
    setDeletedContacts(updatedDeletedContacts);

    if (onRestoreContact) {
      onRestoreContact(contactToRestore);
    }

    const newIndex = Math.max(0, updatedDeletedContacts.length - 1);
    setCurrentIndex(newIndex);
  };

  return (
    <>
      {!isMinimized ? (
        <Modal
          isOpen={isOpen}
          onRequestClose={onRequestClose}
          contentLabel="Cleaning Summary"
          style={{
            content: {
              width: "600px",
              margin: "auto",
              padding: "20px",
              borderRadius: "8px",
              background: "#fff",
            },
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            },
          }}
        >
          <button
            onClick={() => setIsMinimized(true)}
            style={{ position: "absolute", top: 10, right: 10 }}
          >
            Minimize
          </button>
          <h2>Cleaning Summary</h2>
          <p>Your contacts have been cleaned successfully!</p>

          <div>
            {Object.keys(categoryData).map((category) => (
              <div key={category} style={{ marginBottom: "10px" }}>
                <h3
                  onClick={() => handleCategoryClick(category)}
                  style={{
                    cursor: "pointer",
                    color: "blue",
                    textDecoration: "underline",
                  }}
                >
                  {category}
                </h3>
                <p>{categoryData[category].length}</p>
              </div>
            ))}
          </div>

          {selectedCategory && categoryData[selectedCategory].length > 0 && (
            <div>
              <h4>{selectedCategory}</h4>
              <p>
                Contact {currentIndex + 1} of {categoryData[selectedCategory].length}
              </p>

              {(() => {
  const categoryColors = {
    "Duplicate Contacts": "#fef6f6",
    "Invalid Contacts": "#fff3cd",
    "Similar Contacts": "#e3fcef",
    "Incomplete Contacts": "#f0f4f8",
    "User Flagged": "#fdf0ff",
    "Recently Deleted": "#f8f9fa",
  };

  const bgColor = categoryColors[selectedCategory] || "#f9f9f9";

  return (
    <>
      {/* Contact Card */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "15px",
          backgroundColor: bgColor,
          color: "#2c3e50",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          width: "100%",
          marginBottom: "15px",
        }}
      >
        {Object.entries(categoryData[selectedCategory][currentIndex]).map(
          ([key, value]) => (
            <div key={key}>
              <strong
                style={{ display: "block", color: "#34495e", fontSize: "14px" }}
              >
                {key}:
              </strong>
              <span>{value || <em style={{ color: "#7f8c8d" }}>N/A</em>}</span>
            </div>
          )
        )}
      </div>

      {/* Delete / Restore Button */}
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        {selectedCategory === "Recently Deleted" ? (
          <button
            onClick={handleRestoreContact}
            style={{
              background: "green",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            ♻️ Restore
          </button>
        ) : (
          <button
            onClick={handleDeleteContact}
            style={{
              background: "red",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            🗑️ Delete
          </button>
        )}
      </div>
    </>
  );
})()}


              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                <button onClick={handlePrevious} disabled={currentIndex === 0}>
                  ⬅️ Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentIndex === categoryData[selectedCategory].length - 1}
                >
                  Next ➡️
                </button>
              </div>
            </div>
          )}

          {selectedCategory && categoryData[selectedCategory].length === 0 && (
            <p>No contacts found in this category.</p>
          )}
        </Modal>
      ) : (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            background: "#f8f9fa",
            padding: "10px 20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            color: "#333",
          }}
          onClick={() => setIsMinimized(false)}
        >
          🔍 Cleaning Summary (Click to Expand)
        </div>
      )}
    </>
  );
};

export default CleaningModal;
