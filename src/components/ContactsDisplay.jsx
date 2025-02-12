//Used to display cleaned contacts data
import React, { useEffect, useState } from "react";

const ContactsDisplay = ({ contacts }) => {
  const [sortedContacts, setSortedContacts] = useState(contacts);
  
  useEffect (( ) => {
    setSortedContacts(contacts);
  }, [contacts]);

  const [isAscendingFirst, setIsAscendingFirst] = useState(true);
  const [isAscendingLast, setIsAscendingLast] = useState(true);
  const [isAscendingEmail, setIsAscendingEmail] = useState(true);
  const [isAscendingPhone, setIsAscendingPhone] = useState(true);

  const resetAscending=()=>{
    setIsAscendingFirst(true)
    setIsAscendingLast(true)
    setIsAscendingEmail(true)
  }

  const sortFirstNames=()=>{
    resetAscending()

    const sorted = [...sortedContacts].sort((a,b)=>{
      const nameA=(a.firstName || a.fn || "").toLowerCase();
      const nameB=(b.firstName || b.fn || "").toLowerCase();   
      return isAscendingFirst ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

    setSortedContacts(sorted);
    setIsAscendingFirst(!isAscendingFirst);
  };

  const sortLastNames=()=>{
    resetAscending()

    const sorted = [...sortedContacts].sort((a,b)=>{
      const nameA=(a.lastName || a.ln || "").toLowerCase();
      const nameB=(b.lastName || b.ln || "").toLowerCase();   
      return isAscendingLast ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
    
    setSortedContacts(sorted);
    setIsAscendingLast(!isAscendingLast);
  };

  const sortEmailAddresses=()=>{
    resetAscending()

    const sorted = [...sortedContacts].sort((a,b)=>{
      const nameA=(a.email || "").toLowerCase();
      const nameB=(b.email || "").toLowerCase();   
      return isAscendingEmail ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
    
    setSortedContacts(sorted);
    setIsAscendingEmail(!isAscendingEmail);
  };

  const extractAreaCode=(phone)=>{
    const match = phone.match(/\d{3}/);
    return match ? parseInt(match[0]) : 0;
  };

  const sortPhoneNumbers=()=>{
    const sorted = [...sortedContacts].sort((a,b)=>{
      const areaCodeA = extractAreaCode(a.phone || "");
      const areaCodeB = extractAreaCode(b.phone || "");
      return isAscendingPhone ? areaCodeA - areaCodeB : areaCodeB - areaCodeA;
    });

    setSortedContacts(sorted);
    setIsAscendingPhone(!isAscendingPhone);
  }

  return (
    <table>
      <thead>
        <tr>
          <th onClick={sortFirstNames} style={{cursor: "pointer"}}>First Name {isAscendingFirst ? "▼" : "▲"}</th>
          <th onClick={sortLastNames} style={{cursor: "pointer"}}>Last Name {isAscendingLast ? "▼" : "▲"}</th>
          <th onClick={sortEmailAddresses} style={{cursor: "pointer"}}>Email {isAscendingEmail ? "▼" : "▲"}</th>
          <th onClick={sortPhoneNumbers} style={{cursor: "pointer"}}>Phone {isAscendingPhone ? "▼" : "▲"}</th>
        </tr>
      </thead>
      <tbody>
        {sortedContacts.map((contact, index) => (
          <tr key={`${contact.email}-${contact.phone}-${index}`}>
            <td>{contact.firstName || contact.fn || "N/A"}</td>
            <td>{contact.lastName || contact.ln || "N/A"}</td>
            <td>{contact.email || "N/A"}</td>
            <td>{contact.phone || "N/A"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ContactsDisplay;