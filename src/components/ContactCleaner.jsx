// ContactCleaner.jsx
import React, { useState } from "react";

const ContactCleaner = ({
  rawContacts,
  onCleaned,
  onSummary,
  isModalOpen 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCleaned, setIsCleaned] = useState(false);

  const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.length === 10
      ? `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
      : phone;
  };

  const formatEmail = (email) => {
    if (email !== "N/A" && !email.includes("@")) {
      console.log("Invalid email format:", email);
      return "N/A";
    }
    return email;
  };

  const cleanContacts = () => {
    setIsProcessing(true);

    const seenContacts = new Map();
    const invalidEmails = [];
    const duplicates = [];

    const cleaned = rawContacts.map((contact) => {
      const firstName = contact["First Name"] || "N/A";
      const lastName = contact["Last Name"] || "N/A";
      const originalEmail = contact["E-mail Address"] || "N/A";
      const rawPhone = contact["Mobile Phone"] || "N/A";

      const email = formatEmail(originalEmail.trim().toLowerCase());
      const phone = formatPhoneNumber(rawPhone);

      if (email === "N/A" && originalEmail !== "N/A") {
        invalidEmails.push(originalEmail);
      }

      const key = `${firstName}-${lastName}-${email}-${phone}`;
      if (!seenContacts.has(key)) {
        seenContacts.set(key, true);
        return {
          ...contact,
          firstName,
          lastName,
          email,
          phone,
        };
      } else {
        console.log("Duplicate found:", { firstName, lastName, email, phone });
        duplicates.push({ firstName, lastName, email, phone });
        return null;
      }
    });

    const filteredCleaned = cleaned.filter(Boolean);

    setIsProcessing(false);
    setIsCleaned(true);

    onCleaned(filteredCleaned);
    onSummary({ invalidEmails, duplicates });
  };

  return (
    <div>
      <button
        onClick={cleanContacts}
        // disable if cleaning is in progress, data is already cleaned, or the summary modal is open
        disabled={isProcessing || isCleaned || isModalOpen}
      >
        {isProcessing
          ? "Cleaning..."
          : isCleaned
          ? "Data Cleaned"
          : "Clean Contacts"}
      </button>
    </div>
  );
};

export default ContactCleaner;
