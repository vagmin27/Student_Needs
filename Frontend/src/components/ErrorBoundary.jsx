import React from "react";
import { MdWarning } from "react-icons/md";
import { analytics } from "@/utils/analytics.js";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(err, info) {
    console.error("Global Error Caught by Boundary:", err, info?.componentStack);
    analytics.trackError(err, info);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <MdWarning size={48} color="#ef4444" />
            <h2 style={styles.title}>System Error Encountered</h2>
            <p style={styles.text}>The application encountered an unexpected error.</p>
            <div style={styles.errorBox}>
              <code>{this.state.error?.message || "Unknown error"}</code>
            </div>
            <button 
              onClick={() => window.location.reload()}
              style={styles.button}
            >
              Reboot System
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
    color: "#f8fafc",
    fontFamily: "Inter, sans-serif"
  },
  card: {
    backgroundColor: "#1e293b",
    padding: "2rem",
    borderRadius: "1rem",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    border: "1px solid #334155",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: "500px",
    width: "90%",
    textAlign: "center"
  },
  title: {
    margin: "1rem 0 0.5rem 0",
    fontSize: "1.5rem",
    fontWeight: "bold"
  },
  text: {
    color: "#94a3b8",
    marginBottom: "1.5rem"
  },
  errorBox: {
    backgroundColor: "#000000",
    padding: "1rem",
    borderRadius: "0.5rem",
    width: "100%",
    overflowX: "auto",
    textAlign: "left",
    color: "#ef4444",
    marginBottom: "1.5rem",
    border: "1px solid #7f1d1d"
  },
  button: {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "0.5rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.2s"
  }
};

export default ErrorBoundary;
