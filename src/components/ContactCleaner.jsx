import React, { useEffect, useState } from "react";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const ContactCleaner = ({ rawContacts, onCleaned, onSummary, isModalOpen }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCleaned, setIsCleaned] = useState(false);
  const [backendSummary, setBackendSummary] = useState(null);

  useEffect(() => {
    setIsProcessing(false);
    setIsCleaned(false);
  }, [rawContacts]);

  const formatPhoneNumber = (phone) => {
    if (!phone) return phone;
    const extPattern = /(ext\.?|x|#)\s?(\d{1,6})/i;
    const match = phone.match(extPattern);
    const extension = match ? match[2] : null;

    const cleanedPhone = phone.replace(extPattern, "").replace(/[\s()-]/g, "").trim();
    const parsed = parsePhoneNumberFromString(cleanedPhone) || parsePhoneNumberFromString(cleanedPhone, "US");

    if (parsed && parsed.isValid()) {
      let formatted = "";
      if (parsed.country === "US" || parsed.country === "CA") {
        const national = parsed.nationalNumber;
        formatted = `+1 (${national.slice(0, 3)}) ${national.slice(3, 6)}-${national.slice(6)}`;
      } else {
        formatted = parsed.formatInternational();
      }
      return extension ? `${formatted} ext. ${extension}` : formatted;
    }
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
    if (company && (!firstName || firstName === "N/A")) firstName = company;
    if (company && (!lastName || lastName === "N/A")) lastName = company;
    return { ...contact, "First Name": firstName, "Last Name": lastName };
  };

  const cleanContacts = () => {
    setIsProcessing(true);

    const seenContacts = new Map();
    const similarMap = new Map();

    const duplicates = [], invalid = [], incomplete = [], similar = [];

    const phoneFields = [
      "Mobile Phone", "Home Phone", "Home Phone 2", "Business Phone",
      "Business Phone 2", "Company Main Phone", "Car Phone",
      "Other Phone", "Callback", "Primary Phone", "Radio Phone"
    ];

    const cleaned = rawContacts.map((contact) => {
      const imputedContact = imputeContactDetails(contact);
      const firstName = formatName(imputedContact["First Name"] || "N/A");
      const lastName = formatName(imputedContact["Last Name"] || "N/A");
      const email = formatEmail(imputedContact["E-mail Address"] || "N/A");

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

      if (email !== "N/A" && !email.includes("@")) {
        reasons.push("Invalid email format");
        invalid.push({ ...cleanedContact, reasons });
      }

      if (firstName === "N/A" || lastName === "N/A") {
        reasons.push("Missing first or last name");
        incomplete.push({ ...cleanedContact, reasons });
        return { ...cleanedContact, reasons };
      }

      const key = `${firstName}-${lastName}-${email}-${normalizedPhones["Mobile Phone"] || ""}`;
      if (!seenContacts.has(key)) {
        seenContacts.set(key, cleanedContact);

        const nameKey = `${firstName}-${lastName}`;
        if (similarMap.has(nameKey)) {
          const prev = similarMap.get(nameKey);
          let reason = "";

          if (prev["Mobile Phone"] !== normalizedPhones["Mobile Phone"] &&
              prev["E-mail Address"] !== email) {
            reason = "Different phone and email";
          } else if (prev["Mobile Phone"] !== normalizedPhones["Mobile Phone"]) {
            reason = "Different phone";
          } else if (prev["E-mail Address"] !== email) {
            reason = "Different email";
          }

          if (reason) {
            if (!prev.isSimilar) {
              prev.similarityReason = reason;
              similar.push(prev);
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

    // ✅ Send data to Flask backend
    fetch("http://127.0.0.1:5000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rawContacts),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setBackendSummary(data.summary);
        } else {
          console.error("Backend error:", data.message);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  };

  return (
    <div>
      <button
        onClick={cleanContacts}
        disabled={isProcessing || isCleaned || isModalOpen}
      >
        {isProcessing ? "Cleaning..." : isCleaned ? "Data Cleaned" : "Clean Contacts"}
      </button>

      {backendSummary && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc", borderRadius: "8px", background: "#eef9ff" }}>
          <h3>Backend Summary</h3>
          <p><strong>Total Contacts:</strong> {backendSummary.total_contacts}</p>
          <p><strong>Missing Names:</strong> {backendSummary.missing_names}</p>
          <p><strong>Missing Emails:</strong> {backendSummary.missing_emails}</p>
          <p><strong>Missing Phones:</strong> {backendSummary.missing_phones}</p>
          <p><strong>Duplicate Records:</strong> {backendSummary.duplicates}</p>
        </div>
      )}
    </div>
  );
};

export default ContactCleaner;
