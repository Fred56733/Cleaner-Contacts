import React, { useState } from "react";
import Modal from "react-modal";
import "./CleaningModal.css";

Modal.setAppElement("#root");

const CleaningModal = ({ isOpen, onRequestClose, summary }) => {
    const [isMinimized, setIsMinimized] = useState(false);
    const { duplicates = [], flaggedContacts = { invalid: [], similar: [] } } = summary || {};

    return (
        <>
            {!isMinimized ? (
                <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Cleaning Modal">
                    <button onClick={() => setIsMinimized(true)} style={{ position: "absolute", top: 10, right: 10 }}>
                        Minimize
                    </button>
                    <h2>Cleaning Summary</h2>
                    <p>Your contacts have been cleaned successfully!</p>
                    <div>
                        <h3>Duplicate Contacts</h3>
                        <p>{duplicates.length}</p>
                        <h3>Invalid Contacts</h3>
                        <p>{flaggedContacts.invalid.length}</p>
                        <h3>Similar Contacts</h3>
                        <p>{flaggedContacts.similar.length}</p>
                    </div>
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
                        color: "#333", // Darker text for visibility
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
