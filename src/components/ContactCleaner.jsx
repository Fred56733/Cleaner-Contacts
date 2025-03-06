// Used to clean and format raw contacts data
import React, { useState } from "react";

const ContactCleaner = ({ rawContacts, onCleaned, onSummary }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Format phone numbers
  const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, ""); // Remove non-digits
    // console.log("Format phone number:", phone, "=>", cleaned);
    return cleaned.length === 10
      ? `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
      : phone;
  };

  const formatEmail = (email) => {
    if (email.toUpperCase() === "N/A") return email;
    else return email.toLowerCase().trim();
  };

  const formatName = (name) => {
    if (name.toUpperCase() === "N/A") return name
    else return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }

  // Handle the cleaning process and removing duplicates
  const cleanContacts = () => {
    setIsProcessing(true);

    const seenContacts = new Map();
    const similarMap = new Map();
    // const invalidEmails = []; changed to flaggedContacts
    const duplicates = [];
    
    const flaggedContacts = {
      incomplete: [],
      invalid: [],
      similar: [],
    };
    
    const cleaned = rawContacts.map((contact) => {
      const firstName = formatName(contact.fn || "N/A");
      const lastName = formatName(contact.ln || "N/A");
      const originalEmail = (contact.email || "N/A");
      const email = formatEmail(originalEmail);
      const phone = formatPhoneNumber(contact.phone || "N/A");

      // Check for invalid email
      if (email.toUpperCase() !== "N/A" && !email.includes("@")) {
        flaggedContacts.invalid.push(contact);
        console.log("Invalid email found:", { firstName, lastName, email, phone });
      }

      // Check for incomplete contact
      if (firstName === "N/A" || lastName === "N/A") {
        flaggedContacts.incomplete.push(contact);
        console.log("Incomplete contact found:", { firstName, lastName, email, phone });
        return null; // Skip further processing for incomplete contacts
      }

      const key = `${firstName}-${lastName}-${email}-${phone}`; // Unique key for exact duplicates

      if (!seenContacts.has(key)) {
        seenContacts.set(key, { firstName, lastName, email, phone });
        
        // Check for similar contacts
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
            console.log("Similar contact found:", { firstName, lastName, email, phone }, "is similar to", prevContact, "Reason:", similarityReason);
          }
        } else {
          similarMap.set(nameKey, { firstName, lastName, email, phone });
        }
        
        return { firstName, lastName, email, phone };
      } else {
        // Duplicate handling
        const duplicateContact = seenContacts.get(key);
        console.log("Duplicate found:", { firstName, lastName, email, phone }, "is duplicate of", duplicateContact);
        duplicates.push({ firstName, lastName, email, phone });
        return null; // Skips duplicates
      }
    });

    const filteredCleaned = cleaned.filter(Boolean); // Remove null values
    setIsProcessing(false);

    // Pass cleaned contacts to the parent
    onCleaned(filteredCleaned);
    onSummary({duplicates, flaggedContacts});
  };

  // Reveils the button to clean contacts
  return (
    <div>
      <button onClick={cleanContacts} disabled={isProcessing}>
        {isProcessing ? "Cleaning..." : "Clean Contacts"}
      </button>
    </div>
  );
};

export default ContactCleaner;