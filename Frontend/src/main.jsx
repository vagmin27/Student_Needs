import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

// ======================================================
//                    PROVIDERS
// ======================================================

// Attendance Auth
import { AuthProvider } from "./contexts/Attendance/AuthContext";

// Tutorials Theme
import { ThemeProvider } from "./utils/ThemeContext";

// ======================================================
//                    COMPONENTS
// ======================================================

import ErrorBoundary from "./components/ErrorBoundary";

// ======================================================
//                    GLOBAL STYLES
// ======================================================

// Tutorials Styles
import "./assets/styles/LoginRegister.css";
import "./assets/styles/Login.css";

// Attendance Styles
import "./styles/Attendance/main.css";

// Global Styles
import "./index.css";

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