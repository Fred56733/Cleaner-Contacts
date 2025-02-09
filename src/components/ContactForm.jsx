import React, { useState, useEffect } from "react";

const ContactForm = ({ contact = {}, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    "First Name": "",
    "Last Name": "",
    "E-mail Address": "",
    "Mobile Phone": "",
    ...contact, 
  });

  useEffect(() => {
    if (contact) {
      setFormData(contact);
    }
  }, [contact]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Save the contact (either add or update)
    setFormData({
      "First Name": "",
      "Last Name": "",
      "E-mail Address": "",
      "Mobile Phone": "",
    }); // Reset form after saving
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginBottom: "20px",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h3>{contact ? "Edit Contact" : "Add Contact"}</h3>
      <div style={{ marginBottom: "10px" }}>
        <label>First Name:</label>
        <input
          type="text"
          name="First Name"
          value={formData["First Name"]}
          onChange={handleChange}
          style={{ marginLeft: "10px", padding: "5px", width: "80%" }}
          required
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>Last Name:</label>
        <input
          type="text"
          name="Last Name"
          value={formData["Last Name"]}
          onChange={handleChange}
          style={{ marginLeft: "10px", padding: "5px", width: "80%" }}
          required
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>Email:</label>
        <input
          type="email"
          name="E-mail Address"
          value={formData["E-mail Address"]}
          onChange={handleChange}
          style={{ marginLeft: "10px", padding: "5px", width: "80%" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label>Phone:</label>
        <input
          type="text"
          name="Mobile Phone"
          value={formData["Mobile Phone"]}
          onChange={handleChange}
          style={{ marginLeft: "10px", padding: "5px", width: "80%" }}
        />
      </div>
      <div>
        <button type="submit" style={{ padding: "5px 10px", marginRight: "10px" }}>
          Save
        </button>
        <button type="button" onClick={onCancel} style={{ padding: "5px 10px" }}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
