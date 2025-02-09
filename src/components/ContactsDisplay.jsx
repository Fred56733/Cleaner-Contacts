import React from "react";
import "./ContactsDisplay.css"; 

const ContactsDisplay = ({ contacts, onSelectContact }) => {
  return (
    <div className="contacts-container">
      <h2>Contacts</h2>
      {contacts.length === 0 ? (
        <p>No contacts available</p>
      ) : (
        <ul className="contacts-list">
          {contacts.map((contact, index) => (
            <li
              key={index}
              className="contact-item"
              onClick={() => onSelectContact(contact)} 
            >
              {contact["First Name"] || "Unknown"} {contact["Last Name"] || ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ContactsDisplay;
