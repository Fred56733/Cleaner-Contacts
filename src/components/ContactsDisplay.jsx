// ContactsDisplay.jsx
import React, { useEffect, useState } from "react";
import "./ContactsDisplay.css"; // optional styling

function ContactsDisplay({ contacts, onSelectContact }) {
  const [sortedContacts, setSortedContacts] = useState(contacts);

  // Track ascending/descending states
  const [isAscendingFirst, setIsAscendingFirst] = useState(true);
  const [isAscendingLast, setIsAscendingLast] = useState(true);
  const [isAscendingEmail, setIsAscendingEmail] = useState(true);
  const [isAscendingPhone, setIsAscendingPhone] = useState(true);

  // Whenever contacts prop changes, reset local sorting
  useEffect(() => {
    setSortedContacts(contacts);
  }, [contacts]);

  // Utility to reset all except the one you're clicking
  // const resetSortStates = (col) => {
  //   if (col !== "first") setIsAscendingFirst(true);
  //   if (col !== "last") setIsAscendingLast(true);
  //   if (col !== "email") setIsAscendingEmail(true);
  //   if (col !== "phone") setIsAscendingPhone(true);
  // };

  const sortFirstNames = () => {
    resetSortStates("first");
    const sorted = [...sortedContacts].sort((a, b) => {
      const nameA = (a["First Name"] || "").toLowerCase();
      const nameB = (b["First Name"] || "").toLowerCase();
      return isAscendingFirst
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
    setSortedContacts(sorted);
    setIsAscendingFirst(!isAscendingFirst);
  };

  const sortLastNames = () => {
    resetSortStates("last");
    const sorted = [...sortedContacts].sort((a, b) => {
      const nameA = (a["Last Name"] || "").toLowerCase();
      const nameB = (b["Last Name"] || "").toLowerCase();
      return isAscendingLast
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
    setSortedContacts(sorted);
    setIsAscendingLast(!isAscendingLast);
  };

  const sortEmails = () => {
    resetSortStates("email");
    const sorted = [...sortedContacts].sort((a, b) => {
      const emailA = (a["E-mail Address"] || "").toLowerCase();
      const emailB = (b["E-mail Address"] || "").toLowerCase();
      return isAscendingEmail
        ? emailA.localeCompare(emailB)
        : emailB.localeCompare(emailA);
    });
    setSortedContacts(sorted);
    setIsAscendingEmail(!isAscendingEmail);
  };

  const extractAreaCode = (phone) => {
    // If your phone is stored as (XXX) XXX-XXXX, you can adapt.
    // Here we just parse 3 digits for the area code:
    const match = phone.match(/\d{3}/);
    return match ? parseInt(match[0]) : 0;
  };

  const sortPhones = () => {
    resetSortStates("phone");
    const sorted = [...sortedContacts].sort((a, b) => {
      const phoneA = a["Mobile Phone"] || "";
      const phoneB = b["Mobile Phone"] || "";
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
        {sortedContacts.map((contact, index) => {
          const firstName = contact["First Name"] || "N/A";
          const lastName = contact["Last Name"] || "N/A";
          const email = contact["E-mail Address"] || "N/A";
          const phone = contact["Mobile Phone"] || "N/A";

          return (
            <tr
              key={index}
              style={{ cursor: onSelectContact ? "pointer" : "auto" }}
              onClick={() => onSelectContact && onSelectContact(contact)}
            >
              <td>{firstName}</td>
              <td>{lastName}</td>
              <td>{email}</td>
              <td>{phone}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default ContactsDisplay;
