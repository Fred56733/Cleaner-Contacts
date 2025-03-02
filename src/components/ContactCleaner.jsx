// ContactCleaner.jsx
import React, { useState } from "react";

const ContactCleaner = ({ rawContacts, onCleaned, onSummary, isModalOpen }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCleaned, setIsCleaned] = useState(false);

  const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.length === 10
      ? `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
      : phone;
  };

  const formatEmail = (email) => {
    if (email.toUpperCase() === "N/A") return email;
    return email.toLowerCase().trim();
  };

  const formatName = (name) => {
    if (name.toUpperCase() === "N/A") return name;
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const cleanContacts = () => {
    setIsProcessing(true);

    const seenContacts = new Map();
    const similarMap = new Map();
    const duplicates = [];
    const flaggedContacts = {
      incomplete: [],
      invalid: [],
      similar: [],
    };

    const cleaned = rawContacts.map((contact) => {
      const firstName = formatName(contact["First Name"] || contact.fn || "N/A");
      const lastName = formatName(contact["Last Name"] || contact.ln || "N/A");
      const originalEmail = contact["E-mail Address"] || contact.email || "N/A";
      const email = formatEmail(originalEmail);
      const phone = formatPhoneNumber(contact["Mobile Phone"] || contact.phone || "N/A");

      if (email.toUpperCase() !== "N/A" && !email.includes("@")) {
        flaggedContacts.invalid.push(contact);
      }

      if (firstName === "N/A" || lastName === "N/A") {
        flaggedContacts.incomplete.push(contact);
        return null;
      }

      const key = `${firstName}-${lastName}-${email}-${phone}`;
      if (!seenContacts.has(key)) {
        seenContacts.set(key, { firstName, lastName, email, phone });
        
        const nameKey = `${firstName}-${lastName}`;
        if (similarMap.has(nameKey)) {
          const prevContact = similarMap.get(nameKey);
          let similarityReason = "";
          if (prevContact.phone !== phone && prevContact.email !== email) {
            similarityReason = "Different phone and email";
          } else if (prevContact.phone !== phone) {
            similarityReason = "Different phone";
          } else if (prevContact.email !== email) {
            similarityReason = "Different email";
          }
          if (similarityReason) {
            flaggedContacts.similar.push({ ...contact, similarityReason });
          }
        } else {
          similarMap.set(nameKey, { firstName, lastName, email, phone });
        }
        
        return { firstName, lastName, email, phone };
      } else {
        duplicates.push({ firstName, lastName, email, phone });
        return null;
      }
    });

    const filteredCleaned = cleaned.filter(Boolean);
    setIsProcessing(false);
    setIsCleaned(true);
    onCleaned(filteredCleaned);
    onSummary({ duplicates, flaggedContacts });
  };

  return (
    <div>
      <button
        onClick={cleanContacts}
        disabled={isProcessing || isCleaned || isModalOpen}
      >
        {isProcessing ? "Cleaning..." : isCleaned ? "Data Cleaned" : "Clean Contacts"}
      </button>
    </div>
  );
};

export default ContactCleaner;
