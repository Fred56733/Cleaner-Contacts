//Used to display cleaned contacts data
import React from "react";

const ContactsDisplay = ({ contacts }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Phone</th>
        </tr>
      </thead>
      <tbody>
        {contacts.map((contact, index) => (
          <tr key={index}>
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