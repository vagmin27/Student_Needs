import React, { useContext, useEffect, useRef, useState } from "react";
import API, { getBookings } from "@/services/api/tutorialsApi.js";
import "../../styles/Tutorials/ManageBook.css";
import Navbar from "../../components/Tutorials/Navbar";
import { LayoutContext } from "@/components/layouts/DashboardLayout";
import BackToStudentDashboard from "@/components/dashboard/BackToStudentDashboard";

function ManageBookingPage() {
  const isUnifiedLayout = useContext(LayoutContext);
  const [bookings, setBookings] = useState([]);

  // ✅ FETCH BOOKINGS
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchBookings = async () => {
      try {
        const list = await getBookings();
        const sorted = [...list].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setBookings(sorted);
      } catch {
        setBookings([]);
      }
    };

    fetchBookings();
  }, []);

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      await API.patch(`/booking/${id}/cancel`);

      setBookings((prev) =>
        prev?.map((b) => (b._id === id ? { ...b, status: "Cancelled" } : b)),
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
      {!isUnifiedLayout && <Navbar />}
      {isUnifiedLayout && <BackToStudentDashboard />}

      <div
        className="mainDivBook h-[calc(100vh-100px)] md:h-screen overflow-y-auto"
        style={{}}
        data-lenis-prevent="true"
      >
        <div className="innerDivBook">
          <h1 className="titleBook">📚 My Bookings</h1>

          {bookings.length === 0 ? (
            <div className="emptyState">
              <h3>No bookings yet 😔</h3>

              <p>Go ahead and book your first class!</p>
            </div>
          ) : (
            bookings?.map((b) => (
              <div className="line1" key={b._id}>
                <div
                  className={`scheduleDivBook ${
                    isUpcoming(b.date) ? "upcoming" : ""
                  }`}
                >
                  {/* LEFT INFO */}
                  <div>
                    <p className="tutorp">👨‍🏫 {b.tutorName}</p>

                    <p className="subjectp">📖 {b.subject}</p>

                    <p className="datep">📅 {b.date}</p>

                    <p className="timep">⏰ {b.time}</p>

                    {/* STATUS */}
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
                        onClick={() => cancelBooking(b._id)}
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
