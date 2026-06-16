import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { getBookings } from "@/services/api/tutorialsApi.js";

function MyBookings() {
const [bookings, setBookings] = useState([]);
const navigate = useNavigate();

// ✅ FETCH BOOKINGS
const fetchedRef = useRef(false);

useEffect(() => {
  if (fetchedRef.current) return;
  fetchedRef.current = true;

  const fetchBookings = async () => {
    try {
      setBookings(await getBookings());
    } catch {
      setBookings([]);
    }
  };

  fetchBookings();
}, []);

// ✅ DELETE BOOKING
const handleDelete = async (id) => {
try {
await API.delete(`/booking/deleteClass/${id}`);

  // remove from UI instantly
  setBookings((prev) => prev?.filter((b) => b.id !== id));
} catch (err) {
  console.error("❌ Error deleting booking:", err);
}


};

return (
<div className="p-8">
  <h1 className="text-2xl font-bold mb-4">📚 My Bookings</h1>

  {bookings.length === 0 ? (
    <p className="text-muted-foreground">No bookings found</p>
  ) : (
    <div className="space-y-4">
      {bookings?.map((b) => (
        <div key={b.id} className="card p-4">
          <h3 className="font-semibold text-lg text-foreground">{b.tutorName || "Tutor"}</h3>
          <p className="text-sm"><strong className="text-foreground">Subject:</strong> {b.subject}</p>
          <p className="text-sm"><strong className="text-foreground">Date:</strong> {b.date}</p>
          <p className="text-sm"><strong className="text-foreground">Time:</strong> {b.time}</p>

          <button
            onClick={() => handleDelete(b.id)}
            className="btn btn-danger mt-2.5"
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
    className="btn btn-ghost mt-5"
  >
    ← Go Back
  </button>
</div>

);
}

export default MyBookings;
