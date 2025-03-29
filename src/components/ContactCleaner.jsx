// ContactCleaner.jsx
import React, { useEffect, useState } from "react";

const ContactCleaner = ({ rawContacts, onCleaned, onSummary, isModalOpen }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCleaned, setIsCleaned] = useState(false);

  // Reset states when raw contacts change
  useEffect(() => {
    setIsProcessing(false);
    setIsCleaned(false);
  }, [rawContacts]);

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
    const invalid = [];
    const incomplete = [];
    const similar = [];

    const cleaned = rawContacts.map((contact) => {
      const firstName = formatName(contact["First Name"] || contact.fn || "N/A");
      const lastName = formatName(contact["Last Name"] || contact.ln || "N/A");
      const originalEmail = contact["E-mail Address"] || contact.email || "N/A";
      const email = formatEmail(originalEmail);
      const phone = formatPhoneNumber(contact["Mobile Phone"] || contact.phone || "N/A");

      const cleanedContact = {
        ...contact, // Preserve all original fields
      };

      // Flag as invalid if email is badly formatted
      if (email.toUpperCase() !== "N/A" && !email.includes("@")) {
        cleanedContact.isInvalid = true;
        invalid.push(cleanedContact);
      }

      // Flag as incomplete if first/last name missing
      if (firstName === "N/A" || lastName === "N/A") {
        cleanedContact.isIncomplete = true;
        incomplete.push(cleanedContact);
        return cleanedContact;
      }

      // Check for duplicate
      const key = `${firstName}-${lastName}-${email}-${phone}`;
      if (!seenContacts.has(key)) {
        seenContacts.set(key, cleanedContact);

        // Check for similarity
        const nameKey = `${firstName}-${lastName}`;
        if (similarMap.has(nameKey)) {
          const prevContact = similarMap.get(nameKey);
          let reason = "";

          if (prevContact.phone !== phone && prevContact.email !== email) {
            reason = "Different phone and email";
          } else if (prevContact.phone !== phone) {
            reason = "Different phone";
          } else if (prevContact.email !== email) {
            reason = "Different email";
          }

          if (reason) {
            cleanedContact.isSimilar = true;
            cleanedContact.similarityReason = reason;
            similar.push(cleanedContact);
          }
        } else {
          similarMap.set(nameKey, cleanedContact);
        }

        return cleanedContact;
      } else {
        cleanedContact.isDuplicate = true;
        duplicates.push(cleanedContact);
        return null; // Mark as null to filter out later
      }
    });

    const filteredCleaned = cleaned.filter(Boolean);

    setIsProcessing(false);
    setIsCleaned(true);

    // Send full contact objects in all categories
    onCleaned(filteredCleaned);
    onSummary({ duplicates, invalid, incomplete, similar });
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