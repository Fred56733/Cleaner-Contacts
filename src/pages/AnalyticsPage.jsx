import React, { useEffect, useState } from "react";
import "../components/ContactsDisplay.css"; // or use AnalyticsPage.css if you split styles

const AnalyticsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/full-stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load stats");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="analytics-container">Loading analytics...</div>;
  if (error) return <div className="analytics-container">{error}</div>;

  return (
    <div className="analytics-container">
      <h2>Contact Analytics Summary</h2>

      <div className="analytics-section">
        <strong>Total Contacts:</strong>
        <p>{stats.total_contacts}</p>
      </div>

      <div className="analytics-section">
        <strong>Missing Names:</strong>
        <p>{stats.missing_names}</p>
      </div>

      <div className="analytics-section">
        <strong>Missing Emails:</strong>
        <p>{stats.missing_emails}</p>
      </div>

      <div className="analytics-section">
        <strong>Missing Phones:</strong>
        <p>{stats.missing_phones}</p>
      </div>

      <div className="analytics-section">
        <strong>Most Common Companies (Top 5):</strong>
        <ul>
          {stats.top_companies.map(([company, count], i) => (
            <li key={i}>{company || "(No Company)"}: {count} contacts</li>
          ))}
        </ul>
      </div>

      <div className="analytics-section">
        <strong>Severely Incomplete Contacts:</strong>
        <p>{stats.severely_incomplete_count} severely incomplete contacts</p>
      </div>

      <div className="analytics-section">
        <strong>Email Domain Category Breakdown:</strong>
        <ul>
          <li>Free Providers: {stats.email_category_breakdown.free} contacts</li>
          <li>Business Providers: {stats.email_category_breakdown.business} contacts</li>
          <li>Unknown: {stats.email_category_breakdown.unknown} contacts</li>
        </ul>
      </div>

      <div className="analytics-section">
        <strong>Average Number of Missing Fields Per Contact:</strong>
        <p>{stats.avg_missing_fields.toFixed(2)} fields missing per contact</p>
      </div>
    </div>
  );
};

export default AnalyticsPage;
