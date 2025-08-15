// Displays the home page
import React from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import ContactManagerPage from './pages/ContactManagerPage.jsx';
import FileConverter from './pages/FileConverter.jsx';
import MergePage from './pages/MergePage.jsx';
import NavBar from './components/NavBar.jsx';
import './App.css';

function App() {
  console.log("Rendering App");
  return (
    <Router>
      <div className="app-container">
        <header>
          <h1>Cleaner Contact</h1>
        </header>
        <NavBar />
        <main>
          <Routes>
            <Route path="/file-converter" element={<FileConverter />} />
            <Route path="/merge-page" element={<MergePage />} />
            <Route path="/contact-manager" element={<ContactManagerPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;