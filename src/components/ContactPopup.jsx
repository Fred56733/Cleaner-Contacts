import React, { useState } from "react";
import "./ContactPopup.css";  

const ContactPopup = ({ contact, onClose, onSave, onFlag, isFlagged }) => {
  if (!contact) return null;

  const [editableContact, setEditableContact] = useState(() => ({
    ...contact,
   }));

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e, key) => {
    setEditableContact({ ...editableContact, [key]: e.target.value });
  };

  const toggleEditing = () => setIsEditing(!isEditing);

  const handleSave = () => {
    onSave(editableContact);
    setIsEditing(false);
  };

  const handleFlag = () => {
    onFlag(contact, !isFlagged(contact));
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
            {Object.keys(editableContact).map((key) => (
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

      <button className="close-button" onClick={onClose}>✖</button>

      {isEditing ? (
        <button className="save-button" onClick={handleSave}>Save Changes</button>
      ) : (
        <>
          <button className="edit-button" onClick={toggleEditing}>Edit Contact</button>
          <button className="flag-button" onClick={handleFlag}>
            {isFlagged(contact) ? "Unflag" : "Flag"}
          </button>
        </>
      )}
    </div>
  );
};

export default ContactPopup;
