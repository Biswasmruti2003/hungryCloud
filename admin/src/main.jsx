import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // Tailwind or global CSS
import { Toaster } from "react-hot-toast";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found. Please ensure <div id='root'></div> exists in index.html.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
    <Toaster position="top-center" reverseOrder={false} />
  </React.StrictMode>
);
