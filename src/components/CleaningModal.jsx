import React from "react";
import Modal from "react-modal";


const CleaningModal = ({ isOpen, onRequestClose, summary }) => {
  if (!summary) return null; // If no summary, no data to show

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Cleaning Summary"
      style={{
        content: {
          width: "400px",
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
      <h2>Cleaning Summary</h2>
      <p>Your contacts have been cleaned successfully!</p>

      <h3>Duplicate Contacts</h3>
      <p>{summary.duplicates.length}</p>

      <h3>Invalid Emails Cleaned</h3>
      <p>{summary.invalidEmails.length}</p>

      <button onClick={onRequestClose} style={{ marginTop: "10px" }}>
        Close
      </button>
    </Modal>
  );
};

export default CleaningModal;
