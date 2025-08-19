import React, { useState, useEffect, useMemo } from "react";
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

  const { duplicates = [], invalid = [], similar = [], incomplete = [] } = summary || {};

  const getCategoryData = () => ({
    "Duplicate Contacts": duplicates,
    "Invalid Contacts": invalid,
    "Similar Contacts": similar,
    "Incomplete Contacts": incomplete,
    "User Flagged": flaggedContacts,
    "Recently Deleted": deletedContacts,
  });

  const categoryData = useMemo(() => getCategoryData(), [summary, flaggedContacts, deletedContacts]);

  const getCategoryClass = (category) => {
    const classMap = {
      "Duplicate Contacts": "duplicate",
      "Invalid Contacts": "invalid",
      "Similar Contacts": "similar",
      "Incomplete Contacts": "incomplete",
      "User Flagged": "user-flagged",
      "Recently Deleted": "recently-deleted",
    };
    return classMap[category] || "";
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

    const updatedCategory = categoryData[selectedCategory].filter((c) => c !== contactToResolve);

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
        >
          <button className="minimize-button" onClick={() => setIsModalMinimized(true)}>
            Minimize
          </button>

          <h2>Cleaning Summary</h2>
          <p>Your contacts have been cleaned successfully!</p>

          <div>
            {Object.keys(categoryData).map((category) => {
              const count = categoryData[category]?.length || 0;
              return (
                <button
                  key={category}
                  className="category-button"
                  onClick={() => handleCategoryClick(category)}
                  aria-label={`${category}: ${count} contacts`}
                >
                  <h3 className="category-title">
                    {category}: {count}
                  </h3>
                </button>
              );
            })}
          </div>

          {selectedCategory && categoryData[selectedCategory]?.length > 0 && (
            <div>
              <h4>{selectedCategory}</h4>
              <p className="contact-counter">
                Contact {currentIndex + 1} of {categoryData[selectedCategory]?.length}
              </p>

              <div className="navigation-buttons">
                <button
                  className="nav-button"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                >
                  ⬅️ Previous
                </button>
                <button
                  className="edit-button"
                  onClick={() => {
                    const contactToEdit = categoryData[selectedCategory][currentIndex];
                    setIsModalMinimized(true);
                    setSelectedContact(contactToEdit);
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  className="nav-button"
                  onClick={handleNext}
                  disabled={currentIndex === categoryData[selectedCategory]?.length - 1}
                >
                  Next ➡️
                </button>
              </div>

              <div className={`contact-card ${getCategoryClass(selectedCategory)}`}>
                {Object.entries(categoryData[selectedCategory][currentIndex] || {})
                  .filter(([key, value]) => value && value !== "N/A")
                  .map(([key, value]) => (
                    <div key={key}>
                      <span className="contact-field-label">{key}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
              </div>

              <div className="action-buttons">
                {selectedCategory === "Recently Deleted" ? (
                  <button className="restore-button" onClick={handleRestoreContact}>
                    ♻️ Restore
                  </button>
                ) : (
                  <>
                    <button className="resolved-button" onClick={handleResolved}>
                      ✅ Resolved
                    </button>
                    <button className="delete-button" onClick={handleDeleteContact}>
                      🗑️ Delete
                    </button>
                  </>
                )}
              </div>

              {selectedCategory === "Similar Contacts" && categoryData[selectedCategory]?.length > 1 && (
                <button className="merge-button" onClick={handleMergeSimilar}>
                  🔗 Merge
                </button>
              )}
            </div>
          )}

          {selectedCategory && categoryData[selectedCategory]?.length === 0 && (
            <p className="no-contacts-message">No contacts found in this category.</p>
          )}
        </Modal>
      ) : (
        <div className="minimized-modal" onClick={() => setIsModalMinimized(false)}>
          🔍 Cleaning Summary (Click to Expand)
        </div>
      )}
    </>
  );
};

export default CleaningModal;
