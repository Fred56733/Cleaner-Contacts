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

  const imputeContactDetails = (contact) => {
    let { "First Name": firstName, "Last Name": lastName, Company: company } = contact;
  
    if (company && (firstName === "N/A" || !firstName)) {
      firstName = company; // Use company name if first name is missing
    }
    if (company && (lastName === "N/A" || !lastName)) {
      lastName = company; // Use company name if last name is missing
    }
  
    return { ...contact, "First Name": firstName, "Last Name": lastName };
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
      // Apply imputation logic to update First Name and Last Name
      const imputedContact = imputeContactDetails(contact);
  
      // Format and normalize fields
      const firstName = formatName(imputedContact["First Name"] || "N/A");
      const lastName = formatName(imputedContact["Last Name"] || "N/A");
      const email = formatEmail(imputedContact["E-mail Address"] || "N/A");
      const phone = imputedContact["Mobile Phone"]
        ? formatPhoneNumber(imputedContact["Mobile Phone"])
        : undefined;
  
      // Construct the cleaned contact by updating only the necessary fields
      const cleanedContact = {
        ...imputedContact, // Preserve all original fields
        "First Name": firstName,
        "Last Name": lastName,
        "E-mail Address": email,
        "Mobile Phone": phone,
      };
  
      // Add reasons for summary
      const reasons = [];
  
      // Flag as invalid if email is badly formatted
      if (cleanedContact["E-mail Address"].toUpperCase() !== "N/A" && !cleanedContact["E-mail Address"].includes("@")) {
        reasons.push("Invalid email format");
        invalid.push({ ...cleanedContact, reasons });
      }
  
      // Flag as incomplete if first/last name is missing
      if (cleanedContact["First Name"] === "N/A" || cleanedContact["Last Name"] === "N/A") {
        reasons.push("Missing first or last name");
        incomplete.push({ ...cleanedContact, reasons });
        return { ...cleanedContact, reasons };
      }
  
      // Check for duplicate
      const key = `${cleanedContact["First Name"]}-${cleanedContact["Last Name"]}-${cleanedContact["E-mail Address"]}-${cleanedContact["Mobile Phone"]}`;
      if (!seenContacts.has(key)) {
        seenContacts.set(key, cleanedContact);
  
        // Check for similarity
        const nameKey = `${cleanedContact["First Name"]}-${cleanedContact["Last Name"]}`;
        if (similarMap.has(nameKey)) {
          const prevContact = similarMap.get(nameKey);
          let reason = "";
  
          if (prevContact["Mobile Phone"] !== cleanedContact["Mobile Phone"] && prevContact["E-mail Address"] !== cleanedContact["E-mail Address"]) {
            reason = "Different phone and email";
          } else if (prevContact["Mobile Phone"] !== cleanedContact["Mobile Phone"]) {
            reason = "Different phone";
          } else if (prevContact["E-mail Address"] !== cleanedContact["E-mail Address"]) {
            reason = "Different email";
          }
  
          if (reason) {
            if (!prevContact.isSimilar) {
              similar.push(prevContact);
            }
            reasons.push(reason);
            similar.push({ ...cleanedContact, reasons });
          }
        } else {
          similarMap.set(nameKey, cleanedContact);
        }
  
        return { ...cleanedContact, reasons };
      } else {
        reasons.push("Duplicate contact");
        duplicates.push({ ...cleanedContact, reasons });
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