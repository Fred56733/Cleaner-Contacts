import React from "react";

const ContactsNewDisplay = ({ contacts }) => {
  return (
    <div style={{ overflowX: "auto", marginTop: "20px" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2", fontWeight: "bold" }}>
            <th style={{ padding: "8px", border: "1px solid #ddd" }}>First Name</th>
            <th style={{ padding: "8px", border: "1px solid #ddd" }}>Last Name</th>
            <th style={{ padding: "8px", border: "1px solid #ddd" }}>Email</th>
            <th style={{ padding: "8px", border: "1px solid #ddd" }}>Phone</th>
          </tr>
        </thead>
        <tbody>
          {contacts.length > 0 ? (
            contacts.map((contact, index) => (
              <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff" }}>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {contact.fn || "N/A"}
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {contact.ln || "N/A"}
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {contact.email || "N/A"}
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {contact.phone || "N/A"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ padding: "8px", textAlign: "center", border: "1px solid #ddd" }}>
                No contacts to display.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ContactsNewDisplay;