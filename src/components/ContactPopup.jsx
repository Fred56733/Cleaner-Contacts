import React, { useState } from "react";
import "./ContactPopup.css";

const POSSIBLE_FIELDS = [
  "First Name", "Last Name", "Middle Name", "Suffix", "Company",
  "Job Title", "Business Phone", "Mobile Phone", "Home Phone",
  "Other Phone", "E-mail Address", "E-mail 2 Address", "E-mail 3 Address",
  "Home Street", "Home City", "Home State", "Home Postal Code",
  "Business Street", "Business City", "Business State", "Business Postal Code",
  "Notes"
];

const ContactPopup = ({ contact, onClose, onSave, onFlag, onDelete }) => {
  if (!contact) return null;

  const [editableContact, setEditableContact] = useState(() => {
    const filledContact = {};
    POSSIBLE_FIELDS.forEach((field) => {
      let value = contact[field];
      if (!value) {
        if (field === "First Name" && contact.firstName) value = contact.firstName;
        if (field === "Last Name" && contact.lastName) value = contact.lastName;
        if (field === "E-mail Address" && contact.email) value = contact.email;
        if (field === "Mobile Phone" && contact.phone) value = contact.phone;
      }
      filledContact[field] = value || "";
    });
    return filledContact;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isFlagged, setIsFlagged] = useState(contact.isFlagged || false);

  const handleChange = (e, key) => {
    setEditableContact({ ...editableContact, [key]: e.target.value });
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    onSave(editableContact);
    setIsEditing(false);
  };

  const handleFlag = () => {
    const newFlag = !isFlagged;
    setIsFlagged(newFlag);
    onFlag(contact, newFlag);
  };

  const handleDelete = () => {
    const confirmed = window.confirm("Are you sure you want to delete this contact?");
    if (confirmed) {
      onDelete(contact);
    }
  };

  const displayName =
    (editableContact["First Name"]?.trim() || editableContact["Last Name"]?.trim())
      ? `${editableContact["First Name"] || ""} ${editableContact["Last Name"] || ""}`.trim()
      : editableContact["Company"] || "Unknown";

  return (
    <div className="contact-popup">
      <h2>{displayName}</h2>

      <div className="contact-popup-table">
        <table>
          <tbody>
            {POSSIBLE_FIELDS.map((key) => (
              <tr key={key}>
                <td>{key}</td>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editableContact[key]}
                      onChange={(e) => handleChange(e, key)}
                    />
                  ) : (
                    <span onDoubleClick={toggleEditing}>
                      {editableContact[key] || "—"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="popup-buttons">
        <button className="close-button" onClick={onClose}>✖</button>

        {isEditing ? (
          <button className="save-button" onClick={handleSave}>Save Changes</button>
        ) : (
          <>
            <button className="edit-button" onClick={toggleEditing}>Edit Contact</button>
            <button className="flag-button" onClick={handleFlag}>
              {isFlagged ? "Unflag" : "Flag"}
            </button>
            <button className="delete-button" onClick={handleDelete}>
              🗑 Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactPopup;
