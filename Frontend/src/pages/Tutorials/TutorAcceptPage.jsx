import React, { useEffect, useState } from "react";
import API from "../../utils/Tutorials/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Tutorials/Navbar";

function TutorAcceptPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get("/booking/for-tutor");
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/booking/${id}/status`, { status });

      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status } : b
        )
      );
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "120px 40px" }}>
          Loading...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div
        style={{
          padding: "120px 40px",
          maxWidth: "900px",
          margin: "0 auto",
          color: "#fff",
        }}
      >
        <h1 style={{ marginBottom: "30px" }}>
          📥 Student Booking Requests
        </h1>

        {bookings.length === 0 ? (
          <p>No pending requests at the moment.</p>
        ) : (
          bookings.map((b) => (
            <div
              key={b._id}
              style={{
                border: "1px solid #333",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "20px",
                background: "#111",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              <p><strong>📖 Subject:</strong> {b.subject}</p>
              <p><strong>📅 Date:</strong> {b.date}</p>
              <p><strong>⏰ Time:</strong> {b.time}</p>
              <p><strong>👤 Student ID:</strong> {b.userId}</p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color:
                      b.status === "Booked"
                        ? "orange"
                        : b.status === "Completed"
                          ? "green"
                          : "red",
                    fontWeight: "bold",
                  }}
                >
                  {b.status}
                </span>
              </p>

              {b.status === "Booked" && (
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginTop: "12px",
                  }}
                >
                  <button
                    onClick={() =>
                      updateStatus(b._id, "Completed")
                    }
                    style={{
                      background: "#28a745",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 20px",
                      cursor: "pointer",
                    }}
                  >
                    ✅ Accept
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(b._id, "Cancelled")
                    }
                    style={{
                      background: "#dc3545",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 20px",
                      cursor: "pointer",
                    }}
                  >
                    ❌ Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}

        <button
          onClick={() => navigate("/tutor/dashboard")}
          style={{
            marginTop: "20px",
            cursor: "pointer",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            background: "#ff7a2f",
            color: "#fff",
          }}
        >
          ← Back to Dashboard
        </button>
      </div>
    </>
  );
}

export default TutorAcceptPage;
