// ContactCleaner.jsx
import React, { useEffect, useState } from "react";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const ContactCleaner = ({ rawContacts, onCleaned, onSummary, isModalOpen }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCleaned, setIsCleaned] = useState(false);

  useEffect(() => {
    setIsProcessing(false);
    setIsCleaned(false);
  }, [rawContacts]);

  const formatPhoneNumber = (phone) => {
    if (!phone) return phone;
  
    const extPattern = /(ext\.?|x|#)\s?(\d{1,6})/i;
    const match = phone.match(extPattern);
  
    // Capture extension (e.g., "ext 1234", "x456", "#789")
    const extension = match ? match[2] : null;
  
    // Remove extension part before parsing
    const cleanedPhone = phone.replace(extPattern, "").replace(/[\s()-]/g, "").trim();
  
    let parsed = parsePhoneNumberFromString(cleanedPhone) || parsePhoneNumberFromString(cleanedPhone, 'US');
  
    if (parsed && parsed.isValid()) {
      let formatted = "";
  
      if (parsed.country === "US" || parsed.country === "CA") {
        const national = parsed.nationalNumber;
        formatted = `+1 (${national.slice(0, 3)}) ${national.slice(3, 6)}-${national.slice(6)}`;
      } else {
        formatted = parsed.formatInternational(); 
      }
  
      // Re-append the extension
      if (extension) {
        formatted += ` ext. ${extension}`;
      }
  
      return formatted;
    }
  
    console.warn(`Invalid phone number: "${phone}"`);
    return phone;
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
      firstName = company;
    }
    if (company && (lastName === "N/A" || !lastName)) {
      lastName = company;
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

    const phoneFields = [
      "Mobile Phone",
      "Home Phone",
      "Home Phone 2",
      "Business Phone",
      "Business Phone 2",
      "Company Main Phone",
      "Car Phone",
      "Other Phone",
      "Callback",
      "Primary Phone",
      "Radio Phone",
    ];

    const cleaned = rawContacts.map((contact) => {
      const imputedContact = imputeContactDetails(contact);

      const firstName = formatName(imputedContact["First Name"] || "N/A");
      const lastName = formatName(imputedContact["Last Name"] || "N/A");
      const email = formatEmail(imputedContact["E-mail Address"] || "N/A");

      // Normalize all phone fields
      const normalizedPhones = {};
      phoneFields.forEach((field) => {
        if (imputedContact[field]) {
          normalizedPhones[field] = formatPhoneNumber(imputedContact[field]);
        }
      });

      const cleanedContact = {
        ...imputedContact,
        "First Name": firstName,
        "Last Name": lastName,
        "E-mail Address": email,
        ...normalizedPhones,
      };

      const reasons = [];

      if (
        cleanedContact["E-mail Address"].toUpperCase() !== "N/A" &&
        !cleanedContact["E-mail Address"].includes("@")
      ) {
        reasons.push("Invalid email format");
        invalid.push({ ...cleanedContact, reasons });
      }

      if (
        cleanedContact["First Name"] === "N/A" ||
        cleanedContact["Last Name"] === "N/A"
      ) {
        reasons.push("Missing first or last name");
        incomplete.push({ ...cleanedContact, reasons });
        return { ...cleanedContact, reasons };
      }

      const key = `${cleanedContact["First Name"]}-${cleanedContact["Last Name"]}-${cleanedContact["E-mail Address"]}-${cleanedContact["Mobile Phone"] || ""}`;
      if (!seenContacts.has(key)) {
        seenContacts.set(key, cleanedContact);

        const nameKey = `${cleanedContact["First Name"]}-${cleanedContact["Last Name"]}`;
        if (similarMap.has(nameKey)) {
          const prevContact = similarMap.get(nameKey);
          let reason = "";

          if (
            prevContact["Mobile Phone"] !== cleanedContact["Mobile Phone"] &&
            prevContact["E-mail Address"] !== cleanedContact["E-mail Address"]
          ) {
            reason = "Different phone and email";
          } else if (
            prevContact["Mobile Phone"] !== cleanedContact["Mobile Phone"]
          ) {
            reason = "Different phone";
          } else if (
            prevContact["E-mail Address"] !== cleanedContact["E-mail Address"]
          ) {
            reason = "Different email";
          }

          if (reason) {
            if (!prevContact.isSimilar) {
              prevContact.similarityReason = reason;
              similar.push(prevContact);
            }
            cleanedContact.similarityReason = reason;
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
        return null;
      }
    });

    const filteredCleaned = cleaned.filter(Boolean);

    setIsProcessing(false);
    setIsCleaned(true);

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
