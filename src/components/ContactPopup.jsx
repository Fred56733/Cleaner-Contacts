import React, { useState } from "react";
import "./ContactPopup.css";  // ✅ Import from the same folder

const POSSIBLE_FIELDS = [
  "First Name", "Last Name", "Middle Name", "Suffix", "Company",
  "Job Title", "Business Phone", "Mobile Phone", "Home Phone",
  "Other Phone", "E-mail Address", "E-mail 2 Address", "E-mail 3 Address",
  "Home Street", "Home City", "Home State", "Home Postal Code",
  "Business Street", "Business City", "Business State", "Business Postal Code",
  "Notes"
];

const ContactPopup = ({ contact, onClose, onSave }) => {
  if (!contact) return null;

  const [editableContact, setEditableContact] = useState(() => {
    const filledContact = {};
    POSSIBLE_FIELDS.forEach((field) => {
      filledContact[field] = contact[field] || "";
    });
    return filledContact;
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e, key) => {
    setEditableContact({ ...editableContact, [key]: e.target.value });
  };

  const toggleEditing = () => setIsEditing(!isEditing);

  const handleSave = () => {
    onSave(editableContact);
    setIsEditing(false);
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
                    <span onDoubleClick={toggleEditing}>{editableContact[key] || "—"}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="close-button" onClick={onClose}>✖</button>

      {isEditing ? (
        <button className="save-button" onClick={handleSave}>Save Changes</button>
      ) : (
        <button className="edit-button" onClick={toggleEditing}>Edit Contact</button>
      )}
    </div>
  );
};

export default ContactPopup;
