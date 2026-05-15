import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/Tutorials/api";

function MyBookings() {
const [bookings, setBookings] = useState([]);
const navigate = useNavigate();

// ✅ FETCH BOOKINGS
useEffect(() => {
const fetchBookings = async () => {
try {
const res = await API.get("/booking");
    setBookings(res.data);
  } catch (err) {
    console.error("❌ Error fetching bookings:", err);
  }
};

fetchBookings();

}, []);

// ✅ DELETE BOOKING
const handleDelete = async (id) => {
try {
await API.delete(`/booking/deleteClass/${id}`);

  // remove from UI instantly
  setBookings((prev) => prev.filter((b) => b.id !== id));
} catch (err) {
  console.error("❌ Error deleting booking:", err);
}


};

return (
<div style={{ padding: "2rem" }}> <h1>📚 My Bookings</h1>

  {bookings.length === 0 ? (
    <p>No bookings found</p>
  ) : (
    <div style={{ marginTop: "1rem" }}>
      {bookings.map((b) => (
        <div
          key={b.id}
          style={{
            border: "1px solid #ddd",
            padding: "1rem",
            borderRadius: "10px",
            marginBottom: "1rem",
          }}
        >
          <h3>{b.tutorName || "Tutor"}</h3>
          <p><strong>Subject:</strong> {b.subject}</p>
          <p><strong>Date:</strong> {b.date}</p>
          <p><strong>Time:</strong> {b.time}</p>

          <button
            onClick={() => handleDelete(b.id)}
            style={{
              marginTop: "10px",
              background: "red",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Cancel Booking
          </button>
        </div>
      ))}
    </div>
  )}

  {/* 🔙 Back Button */}
  <button
    onClick={() => navigate(-1)}
    style={{
      marginTop: "20px",
      padding: "10px 15px",
      borderRadius: "8px",
      cursor: "pointer",
    }}
  >
    ← Go Back
  </button>
</div>

);
}

export default MyBookings;
