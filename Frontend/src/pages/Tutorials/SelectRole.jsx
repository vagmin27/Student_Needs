import React from "react";
import { useNavigate } from "react-router-dom";

function SelectRole() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1>Choose Login Type</h1>

      <div style={styles.cardContainer}>
        
        <div
          style={styles.card}
          onClick={() => navigate("/tutorials/login/student")}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          🎓
          <h2>Student</h2>
          <p>Book tutors & learn</p>
        </div>

        <div
          style={styles.card}
          onClick={() => navigate("/tutorials/login/tutor")}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          👨‍🏫
          <h2>Tutor</h2>
          <p>Teach & manage classes</p>
        </div>

      </div>
    </div>
  );
}

export default SelectRole;

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial",
    background: "#f5f6f8",
  },

  cardContainer: {
    display: "flex",
    gap: "40px",
    marginTop: "30px",
  },

  card: {
    width: "220px",
    height: "160px",
    background: "#fff",
    borderRadius: "15px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "0.3s",
  },
};
