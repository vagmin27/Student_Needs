import React, { useEffect, useState } from "react";
import API from "@/services/api/tutorialsApi.js";
import "../../styles/Tutorials/ManageBook.css";
import Navbar from "../../components/Tutorials/Navbar";

function ManageBookingPage() {
  const [bookings, setBookings] = useState([]);

  // ✅ FETCH BOOKINGS
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get("/booking");

        const sorted = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setBookings(sorted);
      } catch (err) {
        console.error("❌ Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, []);

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      await API.patch(`/booking/${id}/cancel`);

      setBookings((prev) =>
        prev?.map((b) =>
          b._id === id
            ? { ...b, status: "Cancelled" }
            : b
        )
      );

      alert("Booking cancelled ✅");
    } catch (err) {
      console.error(err);
      alert("Error cancelling booking ❌");
    }
  };

  // ✅ CHECK UPCOMING
  const isUpcoming = (date) => {
    return new Date(date) >= new Date();
  };

  return (
    <>
      <Navbar />

      <div
        className="mainDivBook"
        style={{
          paddingTop: "120px",
          minHeight: "100vh",
        }}
      >
        <div className="innerDivBook">
          <h1 className="titleBook">
            📚 My Bookings
          </h1>

          {bookings.length === 0 ? (
            <div className="emptyState">
              <h3>No bookings yet 😔</h3>

              <p>
                Go ahead and book your first class!
              </p>
            </div>
          ) : (
            bookings?.map((b) => (
              <div className="line1" key={b._id}>
                <div
                  className={`scheduleDivBook ${
                    isUpcoming(b.date)
                      ? "upcoming"
                      : ""
                  }`}
                >
                  {/* LEFT INFO */}
                  <div>
                    <p className="tutorp">
                      👨‍🏫 {b.tutorName}
                    </p>

                    <p className="subjectp">
                      📖 {b.subject}
                    </p>

                    <p className="datep">
                      📅 {b.date}
                    </p>

                    <p className="timep">
                      ⏰ {b.time}
                    </p>

                    {/* STATUS */}
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        style={{
                          color:
                            b.status === "Booked"
                              ? "orange"
                              : b.status ===
                                  "Completed"
                                ? "green"
                                : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {b.status || "Booked"}
                      </span>
                    </p>

                    {/* UPCOMING */}
                    {isUpcoming(b.date) && (
                      <span
                        style={{
                          marginLeft: "8px",
                        }}
                      >
                        🟢 Upcoming
                      </span>
                    )}
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="actionButtons">
                    {b.status === "Booked" && (
                      <button
                        onClick={() =>
                          cancelBooking(b._id)
                        }
                        style={{
                          marginTop: "10px",
                          background: "#dc3545",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          padding: "8px 18px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        ❌ Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default ManageBookingPage;
