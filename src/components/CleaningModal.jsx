import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./CleaningModal.css";

Modal.setAppElement("#root");

const CleaningModal = ({
  isOpen,
  isMinimized,
  setIsModalMinimized,
  onRequestClose,
  summary,
  flaggedContacts,
  setFlaggedContacts,
  deletedContacts,
  setDeletedContacts,
  setSummary,
  deletedContact,
  onRestoreContact,
  onMergeSimilar,
  setSelectedContact,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [categoryData, setCategoryData] = useState({});

  const { duplicates = [], invalid = [], similar = [], incomplete = [] } = summary || {};

  const getCategoryData = () => ({
    "Duplicate Contacts": duplicates,
    "Invalid Contacts": invalid,
    "Similar Contacts": similar,
    "Incomplete Contacts": incomplete,
    "User Flagged": flaggedContacts,
    "Recently Deleted": deletedContacts,
  });

  useEffect(() => {
    // Refresh category data whenever the modal is reopened or summary changes
    setCategoryData(getCategoryData());
  }, [summary, flaggedContacts, deletedContacts]);

  const categoryColors = {
    "Duplicate Contacts": "#fef6f6",
    "Invalid Contacts": "#fff3cd",
    "Similar Contacts": "#e3fcef",
    "Incomplete Contacts": "#f0f4f8",
    "User Flagged": "#d0ebff",
    "Recently Deleted": "#f8f9fa",
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentIndex(0);
  };

  const handleNext = () => {
    if (currentIndex < categoryData[selectedCategory]?.length - 1) {
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
      duplicates: [...duplicates.filter((c) => c !== contactToDelete)],
      invalid: [...invalid.filter((c) => c !== contactToDelete)],
      similar: [...similar.filter((c) => c !== contactToDelete)],
      incomplete: [...incomplete.filter((c) => c !== contactToDelete)],
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
    if (onRestoreContact) onRestoreContact(contactToRestore);
    const newIndex = Math.max(0, updatedDeletedContacts.length - 1);
    setCurrentIndex(newIndex);
  };

  const handleResolved = () => {
    const contactToResolve = categoryData[selectedCategory][currentIndex];

    // Remove the contact from the selected category view
    const updatedCategory = categoryData[selectedCategory].filter((c) => c !== contactToResolve);

    // Update the summary fields
    const updatedSummary = {
      duplicates: [...duplicates.filter((c) => c !== contactToResolve)],
      invalid: [...invalid.filter((c) => c !== contactToResolve)],
      similar: [...similar.filter((c) => c !== contactToResolve)],
      incomplete: [...incomplete.filter((c) => c !== contactToResolve)],
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
      const updatedFlaggedContacts = flaggedContacts.filter((c) => c !== contactToResolve);
      setFlaggedContacts(updatedFlaggedContacts);
    }

    setSummary(updatedSummary);

    const newIndex = Math.max(0, updatedCategory.length - 1);
    setCurrentIndex(newIndex);
  };

  const mergeContacts = (contactsToMerge) => {
    if (!contactsToMerge || contactsToMerge.length === 0) return null;

    const merged = { ...contactsToMerge[0] };

    contactsToMerge.slice(1).forEach((contact) => {
      Object.keys(contact).forEach((key) => {
        if ((!merged[key] || merged[key] === "N/A") && contact[key] && contact[key] !== "N/A") {
          merged[key] = contact[key];
        } else if (
          (key.toLowerCase().includes("phone") || key.toLowerCase().includes("email")) &&
          contact[key] &&
          contact[key] !== "N/A"
        ) {
          if (merged[key] && !merged[key].includes(contact[key])) {
            merged[key] = merged[key] + ", " + contact[key];
          }
        }
      });
    });

    return merged;
  };

  const normalizeName = (contact) => {
    const first = (contact["First Name"] || contact.firstName || "").trim().toLowerCase();
    const last = (contact["Last Name"] || contact.lastName || "").trim().toLowerCase();
    return `${first}-${last}`;
  };

  const handleMergeSimilar = () => {
    const currentContact = categoryData[selectedCategory][currentIndex];
    const currentKey = normalizeName(currentContact);

    const similarGroup = categoryData[selectedCategory].filter((contact) => {
      return normalizeName(contact) === currentKey;
    });

    if (similarGroup.length < 2) {
      alert("Not enough similar contacts to merge.");
      return;
    }

    const mergedContact = mergeContacts(similarGroup);

    if (onMergeSimilar) {
      onMergeSimilar(mergedContact, similarGroup);
    }

    const updatedCategory = categoryData[selectedCategory].filter(
      (contact) => !similarGroup.includes(contact)
    );

    const updatedSummary = {
      ...summary,
      similar: updatedCategory,
    };

    setSummary(updatedSummary);
    setSelectedCategory(null);
  };

  return (
    <>
      {!isMinimized ? (
        <Modal
          isOpen={isOpen}
          onRequestClose={onRequestClose}
          contentLabel="Cleaning Summary"
          shouldCloseOnOverlayClick={false}
          shouldCloseOnEsc={false}
          ariaHideApp={false}
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
            onClick={() => setIsModalMinimized(true)}
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
                <p>{categoryData[category]?.length || 0}</p>
              </div>
            ))}
          </div>

          {selectedCategory && categoryData[selectedCategory]?.length > 0 && (
            <div>
              <h4>{selectedCategory}</h4>
              <p>
                Contact {currentIndex + 1} of {categoryData[selectedCategory]?.length}
              </p>

              {/* Navigation Buttons */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <button onClick={handlePrevious} disabled={currentIndex === 0}>
                  ⬅️ Previous
                </button>
                <button
                  onClick={() => {
                    const contactToEdit = categoryData[selectedCategory][currentIndex];
                    setIsModalMinimized(true);
                    setSelectedContact(contactToEdit);
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentIndex === categoryData[selectedCategory]?.length - 1}
                >
                  Next ➡️
                </button>
              </div>

              {/* Card Display */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  padding: "15px",
                  backgroundColor: categoryColors[selectedCategory] || "#f9f9f9",
                  color: "#2c3e50",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  width: "100%",
                  marginBottom: "15px",
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                  overflowWrap: "anywhere",
                }}
              >
                {Object.entries(categoryData[selectedCategory][currentIndex] || {}).map(
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

              {/* Delete / Restore / Resolved Buttons */}
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
                  <>
                    <button
                      onClick={handleResolved}
                      style={{
                        background: "green",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "10px 20px",
                        cursor: "pointer",
                        marginRight: "10px",
                      }}
                    >
                      ✅ Resolved
                    </button>
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
                  </>
                )}
              </div>

              {/* Merge For Similar Button */}
              {selectedCategory === "Similar Contacts" && categoryData[selectedCategory]?.length > 1 && (
                <button
                  onClick={handleMergeSimilar}
                  style={{
                    background: "blue",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "5px 10px",
                    cursor: "pointer",
                    marginTop: "10px",
                  }}
                >
                  🔗 Merge
                </button>
              )}
            </div>
          )}

          {selectedCategory && categoryData[selectedCategory]?.length === 0 && (
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
          onClick={() => setIsModalMinimized(false)}
        >
          🔍 Cleaning Summary (Click to Expand)
        </div>
      )}
    </>
  );
};

export default CleaningModal;
