import React, { useState } from "react";
import "./ContactCleaner.css"; 

const ContactCleaner = ({ rawContacts, onCleaned }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCleaned, setIsCleaned] = useState(false); // Tracks if data has been cleaned

  // Format phone numbers
  const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, ""); // Remove non-digits
    return cleaned.length === 10
      ? `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
      : phone;
  };

  // Handle the cleaning process
  const cleanContacts = () => {
    setIsProcessing(true);

    const seenContacts = new Set();
    const cleaned = rawContacts.map((contact) => {
      const formattedContact = { ...contact }; // Keep all fields intact

      // Format all phone fields
      Object.keys(formattedContact).forEach((key) => {
        if (key.toLowerCase().includes("phone")) {
          formattedContact[key] = formattedContact[key]
            ? formatPhoneNumber(formattedContact[key])
            : ""; // Format phone numbers
        }
      });

      const uniqueKey = JSON.stringify(formattedContact); // Unique identifier for duplicates

      if (!seenContacts.has(uniqueKey)) {
        seenContacts.add(uniqueKey);
        return formattedContact; // Keep the full contact
      }
      return null; // Skip duplicates
    });

    const filteredCleaned = cleaned.filter(Boolean); // Remove null duplicates
    setIsProcessing(false);
    setIsCleaned(true); // Mark as cleaned

    // Pass cleaned contacts to parent
    onCleaned(filteredCleaned);
  };

  return (
    <div>
      <button
        className="clean-button"
        onClick={cleanContacts}
        disabled={isProcessing || isCleaned} // Disable button if processing or already cleaned
      >
        {isProcessing ? "Cleaning..." : isCleaned ? "Data Cleaned" : "Clean Contacts"}
      </button>
    </div>
  );
};

export default ContactCleaner;
