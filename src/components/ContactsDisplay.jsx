// ContactsDisplay.jsx
import React, { useEffect, useState, useCallback, memo } from "react";
import "./ContactsDisplay.css"; // optional styling

const ContactsDisplay = memo(function ContactsDisplay({ contacts, onSelectContact, forceUpdate, isFlagged = () => false }) {
  const [sortedContacts, setSortedContacts] = useState(contacts);

  // Track sorting states
  const [isAscendingFirst, setIsAscendingFirst] = useState(true);
  const [isAscendingLast, setIsAscendingLast] = useState(true);
  const [isAscendingEmail, setIsAscendingEmail] = useState(true);
  const [isAscendingPhone, setIsAscendingPhone] = useState(true);

  // Reset sorting states except the one being sorted
  const resetSortStates = (col) => {
    if (col !== "first") setIsAscendingFirst(true);
    if (col !== "last") setIsAscendingLast(true);
    if (col !== "email") setIsAscendingEmail(true);
    if (col !== "phone") setIsAscendingPhone(true);
  };

  // Update contacts when props change
  useEffect(() => {
    setSortedContacts(contacts);
  }, [contacts, forceUpdate]);

  const sortFirstNames = useCallback(() => {
    resetSortStates("first");
    const sorted = [...sortedContacts].sort((a, b) => {
      const nameA = (a["First Name"] || a.firstName || "").toLowerCase();
      const nameB = (b["First Name"] || b.firstName || "").toLowerCase();
      return isAscendingFirst ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
    setSortedContacts(sorted);
    setIsAscendingFirst(!isAscendingFirst);
  }, [sortedContacts, isAscendingFirst]);

  const sortLastNames = useCallback(() => {
    resetSortStates("last");
    const sorted = [...sortedContacts].sort((a, b) => {
      const nameA = (a["Last Name"] || a.lastName || "").toLowerCase();
      const nameB = (b["Last Name"] || b.lastName || "").toLowerCase();
      return isAscendingLast ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
    setSortedContacts(sorted);
    setIsAscendingLast(!isAscendingLast);
  }, [sortedContacts, isAscendingLast]);

  const sortEmails = useCallback(() => {
    resetSortStates("email");
    const sorted = [...sortedContacts].sort((a, b) => {
      const emailA = (a["E-mail Address"] || a.email || "").toLowerCase();
      const emailB = (b["E-mail Address"] || b.email || "").toLowerCase();
      return isAscendingEmail ? emailA.localeCompare(emailB) : emailB.localeCompare(emailA);
    });
    setSortedContacts(sorted);
    setIsAscendingEmail(!isAscendingEmail);
  }, [sortedContacts, isAscendingEmail]);

  const extractAreaCode = (phone) => {
    const match = phone.match(/\d{3}/);
    return match ? parseInt(match[0]) : 0;
  };

  const sortPhones = useCallback(() => {
    resetSortStates("phone");
    const sorted = [...sortedContacts].sort((a, b) => {
      const phoneA = a["Mobile Phone"] || a.phone || "";
      const phoneB = b["Mobile Phone"] || b.phone || "";
      const areaA = extractAreaCode(phoneA);
      const areaB = extractAreaCode(phoneB);
      return isAscendingPhone ? areaA - areaB : areaB - areaA;
    });
    setSortedContacts(sorted);
    setIsAscendingPhone(!isAscendingPhone);
  }, [sortedContacts, isAscendingPhone]);

  // Displays all phone numbers in contacts-tabe
  const getAllPhoneNumbers = (contact) => {
    // Check for the new combined Phone field first
    if (contact.Phone) {
      return contact.Phone;
    }
  
    // Fall back to the original phone fields
    const phoneFields = [
      "Business Phone",
      "Business Phone 2",
      "Car Phone",
      "Company Main Phone",
      "Home Phone",
      "Home Phone 2",
      "Mobile Phone",
      "Work Phone",
      "Primary Phone",
      "Other Phone",
    ];
    return phoneFields
      .map((field) => contact[field] || contact[field.toLowerCase().replace(" ", "")])
      .filter(Boolean)
      .join(", ");
  };

  // Displays all email addresses in contacts-table
  const getAllEmails = (contact) => {
    const emailFields = ["Email", "E-mail Address", "E-mail 2 Address", "E-mail 3 Address"];
    return emailFields
      .map((field) => contact[field] || contact[field.toLowerCase().replace(" ", "")])
      .filter(Boolean)
      .join(", ");
  }

  return (
    <table className="contacts-table">
      <thead>
        <tr>
          <th onClick={sortFirstNames} style={{ cursor: "pointer" }}>
            First Name {isAscendingFirst ? "▼" : "▲"}
          </th>
          <th onClick={sortLastNames} style={{ cursor: "pointer" }}>
            Last Name {isAscendingLast ? "▼" : "▲"}
          </th>
          <th onClick={sortEmails} style={{ cursor: "pointer" }}>
            Email {isAscendingEmail ? "▼" : "▲"}
          </th>
          <th onClick={sortPhones} style={{ cursor: "pointer" }}>
            Phone {isAscendingPhone ? "▼" : "▲"}
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedContacts.map((contact, index) => (
          <tr
            key={index}
            className={isFlagged(contact) ? "flagged" : ""}
            style={{ cursor: onSelectContact ? "pointer" : "auto" }}
            onClick={() => onSelectContact && onSelectContact(contact)}
          >
            <td>{contact["First Name"] || contact.firstName || "N/A"}</td>
            <td>{contact["Last Name"] || contact.lastName || "N/A"}</td>
            <td>{getAllEmails(contact) || "N/A"}</td>
            <td>{getAllPhoneNumbers(contact) || "N/A"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});

export default ContactsDisplay;
