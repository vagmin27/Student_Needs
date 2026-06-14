import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// ======================================================
//                    PROVIDERS
// ======================================================

// Global Auth
import { AuthProvider } from "./contexts/GlobalAuthContext";

// Theme Provider
import { ThemeProvider } from "./context/ThemeContext";

// ======================================================
//                    COMPONENTS
// ======================================================

import ErrorBoundary from "./components/ErrorBoundary";

// ======================================================
//                    GLOBAL STYLES
// ======================================================

// Tutorials Styles
import "./styles/Tutorials/LoginRegister.css";
import "./styles/Tutorials/Login.css";

// Attendance Styles
import "./styles/Attendance/main.css";

// ======================================================
//                    ROOT
// ======================================================

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  <StrictMode>
    <ThemeProvider>
      <ErrorBoundary>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  </StrictMode>
);

// If you want to start measuring performance in your app,
// pass a function to log results
reportWebVitals();
