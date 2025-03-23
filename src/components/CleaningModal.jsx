import React, { useState } from "react";
import Modal from "react-modal";
import "./CleaningModal.css";

Modal.setAppElement("#root");

const CleaningModal = ({ isOpen, onRequestClose, summary }) => {
    const [isMinimized, setIsMinimized] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const { duplicates = [], flaggedContacts = { invalid: [], similar: [], incomplete: [] } } = summary || {};

    const categoryData = {
        "Duplicate Contacts": duplicates,
        "Invalid Contacts": flaggedContacts.invalid,
        "Similar Contacts": flaggedContacts.similar,
        "Incomplete Contacts": flaggedContacts.incomplete,
    };

    const handleCategoryClick = (category) => setSelectedCategory(category);

    return (
        <>
            {!isMinimized ? (
                <Modal
                    isOpen={isOpen}
                    onRequestClose={onRequestClose}
                    contentLabel="Cleaning Summary"
                    style={{
                        content: {
                            width: "800px",
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
                                <button
                                    onClick={() => handleCategoryClick(category)}
                                    style={{
                                        background: "#007bff",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px",
                                        padding: "5px 10px",
                                        cursor: "pointer",
                                    }}
                                >
                                    {category} ({categoryData[category].length})
                                </button>
                            </div>
                        ))}
                    </div>

                    {selectedCategory && categoryData[selectedCategory].length > 0 && (
                        <div style={{ maxHeight: "400px", overflowY: "auto", marginTop: "10px" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr>
                                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Contact</th>
                                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categoryData[selectedCategory].map((contact, index) => (
                                        <tr key={index}>
                                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                {JSON.stringify(contact, null, 2)}
                                            </td>
                                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                <button
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
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
