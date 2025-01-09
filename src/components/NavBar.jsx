// Navigation bar
import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'; // Optional: Add CSS for styling the NavBar

function NavBar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/contact-manager">Contact Manager</Link>
        </li>
        <li>
          
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;