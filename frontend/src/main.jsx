import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Suppress React DevTools and React Router warnings
if (typeof window !== "undefined") {
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  
  console.error = (...args) => {
    const message = args[0];
    if (
      typeof message === "string" &&
      (message.includes("Download the React DevTools") ||
       message.includes("React DevTools") ||
       message.includes("react-refresh"))
    ) {
      return;
    }
    originalConsoleError.apply(console, args);
  };
  
  console.warn = (...args) => {
    const message = args[0];
    if (
      typeof message === "string" &&
      (message.includes("React DevTools") ||
       message.includes("Future Flag Warning") ||
       message.includes("react-refresh"))
    ) {
      return;
    }
    originalConsoleWarn.apply(console, args);
  };
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
