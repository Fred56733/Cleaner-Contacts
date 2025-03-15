import React, { useState } from "react";
import Modal from "react-modal";
import "./CleaningModal.css";

Modal.setAppElement("#root");

const CleaningModal = ({ isOpen, onRequestClose, summary }) => {
    const [isMinimized, setIsMinimized] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [deletedContacts, setDeletedContacts] = useState([]); // NEW: Track deleted contacts

    const { duplicates = [], flaggedContacts = { invalid: [], similar: [], incomplete: [] } } = summary || {};

    const categoryData = {
        "Duplicate Contacts": duplicates,
        "Invalid Contacts": flaggedContacts.invalid,
        "Similar Contacts": flaggedContacts.similar,
        "Incomplete Contacts": flaggedContacts.incomplete,
        "Recently Deleted": deletedContacts, // NEW: Display deleted contacts
    };

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
        const updatedContacts = [...categoryData[selectedCategory]];
        const deletedContact = updatedContacts.splice(currentIndex, 1)[0]; // Remove and save deleted contact

        setDeletedContacts((prevDeleted) => [...prevDeleted, deletedContact]); // Add to deleted category

        // Update the relevant category
        if (selectedCategory === "Duplicate Contacts") {
            summary.duplicates = updatedContacts;
        } else {
            summary.flaggedContacts[selectedCategory.toLowerCase().replace(" ", "")] = updatedContacts;
        }

        // Adjust index if last contact was deleted
        if (currentIndex >= updatedContacts.length) {
            setCurrentIndex(Math.max(0, updatedContacts.length - 1));
        }
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

                    {/* Category Selection */}
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

                    {/* Contact Viewer */}
                    {selectedCategory && categoryData[selectedCategory].length > 0 && (
                        <div>
                            <h4>{selectedCategory}</h4>
                            <p>
                                Contact {currentIndex + 1} of {categoryData[selectedCategory].length}
                            </p>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                }}
                            >
                                <p>
                                    {JSON.stringify(categoryData[selectedCategory][currentIndex], null, 2)}
                                </p>
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
                            </div>

                            {/* Navigation Buttons */}
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
