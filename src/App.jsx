import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import ContactManagerPage from './pages/ContactManagerPage.jsx';
import NavBar from './components/NavBar.jsx';
import './App.css';

function App() {
  console.log("Rendering App");
  return (
    <Router>
      <div className="app-container">
        <header>
          <h1>Contact Manager</h1>
        </header>
        <NavBar />
        <main>
          <Routes>
            <Route path="/contact-manager" element={<ContactManagerPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<Navigate to="/" />} /> {/* Fallback to redirect to the home page if no other routes match */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;