// src/pages/AnalyticsPage.jsx
import React from "react";

const AnalyticsPage = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Contact Analytics</h2>
      <img
        src="http://127.0.0.1:5000/summary-chart"
        alt="Summary Chart"
        style={{ width: "100%", maxWidth: "800px", border: "1px solid #ccc" }}
      />
    </div>
  );
};

export default AnalyticsPage;
