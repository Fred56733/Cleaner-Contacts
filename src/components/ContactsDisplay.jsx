// ContactsDisplay.jsx
import React, { useEffect, useState } from "react";
import "./ContactsDisplay.css"; // optional styling

function ContactsDisplay({ contacts, onSelectContact }) {
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
  }, [contacts]);

  const sortFirstNames = () => {
    resetSortStates("first");
    const sorted = [...sortedContacts].sort((a, b) => {
      const nameA = (a["First Name"] || a.firstName || "").toLowerCase();
      const nameB = (b["First Name"] || b.firstName || "").toLowerCase();
      return isAscendingFirst ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
    setSortedContacts(sorted);
    setIsAscendingFirst(!isAscendingFirst);
  };

  const sortLastNames = () => {
    resetSortStates("last");
    const sorted = [...sortedContacts].sort((a, b) => {
      const nameA = (a["Last Name"] || a.lastName || "").toLowerCase();
      const nameB = (b["Last Name"] || b.lastName || "").toLowerCase();
      return isAscendingLast ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
    setSortedContacts(sorted);
    setIsAscendingLast(!isAscendingLast);
  };

  const sortEmails = () => {
    resetSortStates("email");
    const sorted = [...sortedContacts].sort((a, b) => {
      const emailA = (a["E-mail Address"] || a.email || "").toLowerCase();
      const emailB = (b["E-mail Address"] || b.email || "").toLowerCase();
      return isAscendingEmail ? emailA.localeCompare(emailB) : emailB.localeCompare(emailA);
    });
    setSortedContacts(sorted);
    setIsAscendingEmail(!isAscendingEmail);
  };

  const extractAreaCode = (phone) => {
    const match = phone.match(/\d{3}/);
    return match ? parseInt(match[0]) : 0;
  };

  const sortPhones = () => {
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
  };

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
            style={{ cursor: onSelectContact ? "pointer" : "auto" }}
            onClick={() => onSelectContact && onSelectContact(contact)}
          >
            <td>{contact["First Name"] || contact.firstName || "N/A"}</td>
            <td>{contact["Last Name"] || contact.lastName || "N/A"}</td>
            <td>{contact["E-mail Address"] || contact.email || "N/A"}</td>
            <td>{contact["Mobile Phone"] || contact.phone || "N/A"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ContactsDisplay;
