// Initial entry point (e.g., main.jsx or index.jsx)
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import Modal from "react-modal";

Modal.setAppElement("#root");

const root = document.getElementById("root");
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
