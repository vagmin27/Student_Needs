import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

// ================= ATTENDANCE AUTH =================
import { AuthProvider } from "./contexts/Attendance/AuthContext";

// ================= GLOBAL STYLES =================
import "./styles/Attendance/main.css";
import "./index.css";

// ================= ROOT =================
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);