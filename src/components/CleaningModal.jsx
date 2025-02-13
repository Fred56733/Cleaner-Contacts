import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const CleaningModal = ({ isOpen, onRequestClose, summary }) => {
    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Cleaning Modal">
            <h2>Cleaning Summary</h2>
            <p>Your contacts have been cleaned successfully!</p>
            <div>
                <h3>Duplicate Contacts</h3>
                <p>{summary.duplicates.length}</p>
                <h3>Invalid Emails Cleaned</h3>
                <p>{summary.invalidEmails.length}</p>
            </div>
            <button onClick={onRequestClose}>Close</button>
        </Modal>
    );
};

export default CleaningModal;