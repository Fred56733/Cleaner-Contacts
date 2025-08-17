import React from "react";
import "./HomePage.css";
import logo from "../assets/contactcleanerbkg.png";

function HomePage() {
  return (
    <div className="homepage-container">
      {/* Logo Section */}
      <div className="logo-section">
        <img src={logo} alt="Cleaner Contact Logo" className="logo-icon" />
      </div>

      {/* Content Section */}
      <div className="content-section">
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Revamp Your Contact List</h3>
            <p>
              Does your contact list need a makeover? We provide top-notch cleaning
              services for your contacts, ensuring accuracy and completeness. Let us
              help you enhance your contact database and keep it in the best shape.
            </p>
          </div>

          <div className="feature-card">
            <h3>Optimize Your Contacts</h3>
            <p>
              With our advanced tools, you can optimize your contacts to avoid
              duplicates and missing details. Our platform offers seamless editing
              features to keep your contact list organized and efficient.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;