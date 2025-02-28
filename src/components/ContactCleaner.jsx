// Used to clean and format raw contacts data
import React, { useState } from "react";

const ContactCleaner = ({ rawContacts, onCleaned, onSummary }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Format phone numbers
  const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, ""); // Remove non-digits
    console.log("Format phone number:", phone, "=>", cleaned);
    return cleaned.length === 10
      ? `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
      : phone;
  };

  const formatEmail = (email) => {
    if (email !== "N/A" && !email.includes("@")) {
      console.log("Invalid email format:", email);
      return "N/A";
    }

    // Add functions here

    return email;
  };

  // Handle the cleaning process and removing duplicates
  const cleanContacts = () => {
    setIsProcessing(true);

    const seenContacts = new Map();
    const invalidEmails = [];
    const duplicates = [];
    const cleaned = rawContacts.map((contact) => {
      const firstName = contact.fn || "N/A";
      const lastName = contact.ln || "N/A";
      const originalEmail = contact.email || "N/A";
      const email = formatEmail(originalEmail.toLowerCase().trim());
      const phone = formatPhoneNumber(contact.phone || "N/A");

      // Check for invalid email
      if (email === "N/A" && originalEmail !== "N/A") {
        invalidEmails.push(originalEmail);
      }

      const key = firstName + lastName + email + phone; // Unique key for deduplication

      if (!seenContacts.has(key)) {
        seenContacts.set(key, { firstName, lastName, email, phone });
        return { firstName, lastName, email, phone };
      } else {
        // Duplicate handling
        console.log("Duplicate found:", { firstName, lastName, email, phone });
        duplicates.push({ firstName, lastName, email, phone });
        return null; // Skips duplicates
      }
    });

    const filteredCleaned = cleaned.filter(Boolean); // Remove null values
    setIsProcessing(false);

    // Pass cleaned contacts to the parent
    onCleaned(filteredCleaned);
    onSummary({invalidEmails, duplicates});
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