import React, { useState } from "react";
import Modal from "react-modal";
import "./CleaningModal.css";

Modal.setAppElement("#root");

<<<<<<< HEAD
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
=======
const CleaningModal = ({ isOpen, isMinimized, setIsModalMinimized, onRequestClose, summary, flaggedContacts, setFlaggedContacts, deletedContacts, setDeletedContacts, setSummary, deletedContact, onRestoreContact, onMergeSimilar, setSelectedContact, }) => {
>>>>>>> origin/Fred-7.0
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
<<<<<<< HEAD

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

=======

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
    console.log("Deleting contact from:", selectedCategory);
    console.log("Contact to delete:", contactToDelete);
  
    // Remove the contact from the selected category view
    const updatedCategory = categoryData[selectedCategory].filter(
      (c) => c !== contactToDelete
    );
  
    // Make sure we create NEW arrays for all summary fields (forces React to notice changes)
    const updatedSummary = {
      duplicates: [...summary.duplicates.filter((c) => c !== contactToDelete)],
      invalid: [...summary.invalid.filter((c) => c !== contactToDelete)],
      similar: [...summary.similar.filter((c) => c !== contactToDelete)],
      incomplete: [...summary.incomplete.filter((c) => c !== contactToDelete)],
    };
  
    // Correct key mapping from UI labels to summary object keys
    const summaryKeyMap = {
      "Duplicate Contacts": "duplicates",
      "Invalid Contacts": "invalid",
      "Similar Contacts": "similar",
      "Incomplete Contacts": "incomplete",
    };
  
    // Update the selected category’s array directly as well
    if (summaryKeyMap[selectedCategory]) {
      updatedSummary[summaryKeyMap[selectedCategory]] = [...updatedCategory];
    }
  
    // Handle "User Flagged" category
    if (selectedCategory === "User Flagged") {
      const updatedFlaggedContacts = flaggedContacts.filter(
        (c) => c !== contactToDelete
      );
      setFlaggedContacts(updatedFlaggedContacts);
    }
  
    // Final log to verify everything changed
    console.log("Updated summary after deletion:", updatedSummary);
  
    // Update state
    setSummary(updatedSummary);
  
    // Check if the contact is already in the recently deleted list
>>>>>>> origin/Fred-7.0
    setDeletedContacts((prev) => {
      if (!prev.some((c) => c === contactToDelete)) {
        return [...prev, contactToDelete];
      }
      return prev;
    });
<<<<<<< HEAD

    deletedContact(contactToDelete);

=======
  
    deletedContact(contactToDelete);
  
    // Move to next available contact or back if at end
>>>>>>> origin/Fred-7.0
    const newIndex = Math.max(0, updatedCategory.length - 1);
    setCurrentIndex(newIndex);
  };

  const handleRestoreContact = () => {
    const contactToRestore = categoryData[selectedCategory][currentIndex];
<<<<<<< HEAD
    const updatedDeletedContacts = deletedContacts.filter((c) => c !== contactToRestore);
    setDeletedContacts(updatedDeletedContacts);

=======
    console.log("Restoring contact:", contactToRestore);

    // Remove the contact from the "Recently Deleted" category
    const updatedDeletedContacts = deletedContacts.filter(
      (c) => c !== contactToRestore
    );

    // Update the deletedContacts state
    setDeletedContacts(updatedDeletedContacts);

    // Notify the parent component to add the contact back to the main table
>>>>>>> origin/Fred-7.0
    if (onRestoreContact) {
      onRestoreContact(contactToRestore);
    }

<<<<<<< HEAD
=======
    // Move to the next available contact or back if at the end
>>>>>>> origin/Fred-7.0
    const newIndex = Math.max(0, updatedDeletedContacts.length - 1);
    setCurrentIndex(newIndex);
  };

<<<<<<< HEAD
=======
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

  const normalizeName = (contact) =>{
    const first = (contact["First Name"] || contact.firstName || "").trim().toLowerCase();
    const last = (contact["Last Name"] || contact.lastName || "").trim().toLowerCase();
    return `${first}-${last}`;
  }

  const handleMergeSimilar = () => {
    const currentContact = categoryData[selectedCategory][currentIndex];
    const currentKey = normalizeName(currentContact);
    const nameKey = `${currentContact["First Name"] || currentContact.firstName}=${currentContact["Last Name"] || currentContact.lastName}`;
    const similarGroup = categoryData[selectedCategory].filter((contact)=>{
      return normalizeName(contact) === currentKey;
    });
    if(similarGroup.length < 2){
      alert("Not enough similar contacts to merge.");
      return;
    }
    const mergedContact = mergeContacts(similarGroup);
    if(onMergeSimilar){
      onMergeSimilar(mergedContact, similarGroup);
    }
    setSelectedCategory(null);
  };

  const similarGroupForComparison = 
    selectedCategory === "Similar Contacts" ? categoryData[selectedCategory].filter((contact)=>{
      return normalizeName(contact) === normalizeName(categoryData[selectedCategory][currentIndex]);
    }) : [];

    const handleResolved = () => {
    const contactToResolve = categoryData[selectedCategory][currentIndex];
    console.log("Marking contact as resolved:", contactToResolve);
  
    // Remove the contact from the selected category view
    const updatedCategory = categoryData[selectedCategory].filter(
      (c) => c !== contactToResolve
    );
  
    // Update the summary fields
    const updatedSummary = {
      duplicates: [...summary.duplicates.filter((c) => c !== contactToResolve)],
      invalid: [...summary.invalid.filter((c) => c !== contactToResolve)],
      similar: [...summary.similar.filter((c) => c !== contactToResolve)],
      incomplete: [...summary.incomplete.filter((c) => c !== contactToResolve)],
    };
  
    // Correct key mapping from UI labels to summary object keys
    const summaryKeyMap = {
      "Duplicate Contacts": "duplicates",
      "Invalid Contacts": "invalid",
      "Similar Contacts": "similar",
      "Incomplete Contacts": "incomplete",
    };
  
    // Update the selected category’s array directly as well
    if (summaryKeyMap[selectedCategory]) {
      updatedSummary[summaryKeyMap[selectedCategory]] = [...updatedCategory];
    }
  
    // Handle "User Flagged" category
    if (selectedCategory === "User Flagged") {
      const updatedFlaggedContacts = flaggedContacts.filter(
        (c) => c !== contactToResolve
      );
      setFlaggedContacts(updatedFlaggedContacts);
    }
  
    // Update the summary state
    setSummary(updatedSummary);
  
    // Move to the next available contact or back if at the end
    const newIndex = Math.max(0, updatedCategory.length - 1);
    setCurrentIndex(newIndex);
  };

>>>>>>> origin/Fred-7.0
  return (
    <>
      {!isMinimized ? (
        <Modal
          isOpen={isOpen}
          onRequestClose={onRequestClose}
          contentLabel="Cleaning Summary"
<<<<<<< HEAD
=======
          shouldCloseOnOverlayClick={false}
          shouldCloseOnEsc={false}
          ariaHideApp={false}
>>>>>>> origin/Fred-7.0
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
<<<<<<< HEAD
            onClick={() => setIsMinimized(true)}
=======
            onClick={() => setIsModalMinimized(true)}
>>>>>>> origin/Fred-7.0
            style={{ position: "absolute", top: 10, right: 10 }}
          >
            Minimize
          </button>
          <h2>Cleaning Summary</h2>
          <p>Your contacts have been cleaned successfully!</p>

<<<<<<< HEAD
=======
          {/* Category Selection */}
>>>>>>> origin/Fred-7.0
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

<<<<<<< HEAD
=======
          {/* Contact Viewer */}
>>>>>>> origin/Fred-7.0
          {selectedCategory && categoryData[selectedCategory].length > 0 && (
            <div>
              <h4>{selectedCategory}</h4>
              <p>
<<<<<<< HEAD
                Contact {currentIndex + 1} of {categoryData[selectedCategory].length}
              </p>

              {(() => {
  const categoryColors = {
    "Duplicate Contacts": "#cce5ff",
    "Invalid Contacts": "#cce5ff",
    "Similar Contacts": "#cce5ff",
    "Incomplete Contacts": "#cce5ff",
    "User Flagged": "#cce5ff",
    "Recently Deleted": "#cce5ff",
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
    wordBreak: "break-word",      // ✅ handle long words
    whiteSpace: "pre-wrap",       // ✅ preserve formatting + wrap text
    overflowWrap: "anywhere",     // ✅ force breaks on long chunks
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


=======
                Contact {currentIndex + 1} of {categoryData[selectedCategory].length || 0}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <p>
                  {JSON.stringify(categoryData[selectedCategory]?.[currentIndex] || {}, null, 2)}
                </p>
                
                {categoryData[selectedCategory]?.[currentIndex]?.reason?.length > 0 && (
                  <ul>
                    {categoryData[selectedCategory][currentIndex].reason.map(
                      (reason, index) => (
                        <li key={index}>{reason}</li>
                      )
                    )}
                  </ul>
                )}

                {selectedCategory === "Recently Deleted" ? (
                  <button
                    onClick={handleRestoreContact}
                    style={{
                      background: "green",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "5px 10px",
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
                      borderRadius: "4px",
                      padding: "5px 10px",
                      cursor: "pointer",
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
                      borderRadius: "4px",
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}
                  >
                    🗑️ Delete
                  </button>
                </>
                )}
              </div>

              {/* Merge For Similar Button*/}
              {selectedCategory === "Similar Contacts" && categoryData[selectedCategory].length > 1 && (
                <button
                  onClick={handleMergeSimilar}
                  style={{background: "blue",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "5px 10px",
                    cursor: "pointer",
                    marginTop: "10px",
                  }}
                >🔗 Merge</button>)}

              {/* Navigation Buttons */}
>>>>>>> origin/Fred-7.0
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                <button onClick={handlePrevious} disabled={currentIndex === 0}>
                  ⬅️ Previous
                </button>
<<<<<<< HEAD
=======
                <button onClick={() => {
                  const contactToEdit = categoryData[selectedCategory][currentIndex];
                  console.log("Editing contact:", contactToEdit);
                  setIsModalMinimized(true); // Minimize the modal to allow editing
                  setSelectedContact(contactToEdit); // 
                }}>
                  ✏️ Edit
                </button>
>>>>>>> origin/Fred-7.0
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
<<<<<<< HEAD
          onClick={() => setIsMinimized(false)}
=======
          onClick={() => setIsModalMinimized(false)}
>>>>>>> origin/Fred-7.0
        >
          🔍 Cleaning Summary (Click to Expand)
        </div>
      )}
    </>
  );
};

export default CleaningModal;
