import React, { useEffect, useState } from "react";
import API from "@/services/api/tutorialsApi.js";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
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
        prev?.map((b) =>
          b._id === id ? { ...b, status } : b
        )
      );
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  if (loading) {
    return (
      <DashboardLayout pageTitle="Manage Requests" role="tutor">
        <div className="space-y-4 pb-8">
          Loading...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Manage Requests" role="tutor">
      <div className="space-y-4 pb-8">
        <h1 style={{ marginBottom: "30px" }}>
          📥 Student Booking Requests
        </h1>

        {bookings.length === 0 ? (
          <p>No pending requests at the moment.</p>
        ) : (
          bookings?.map((b) => (
            <div
              key={b._id}
              className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-2"
            >
              <p><strong>📖 Subject:</strong> {b.subject}</p>
              <p><strong>📅 Date:</strong> {b.date}</p>
              <p><strong>⏰ Time:</strong> {b.time}</p>
              <p><strong>👤 Student ID:</strong> {b.userId}</p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    b.status === "Booked" || b.status === "pending"
                      ? "text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : b.status === "upcoming" || b.status === "accepted"
                        ? "text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : b.status === "in_progress"
                          ? "text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : b.status === "Completed" || b.status === "completed"
                            ? "text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }
                >
                  {b.status}
                </span>
              </p>

              {(b.status === "Booked" || b.status === "pending") && (
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginTop: "12px",
                  }}
                >
                  <Button size="sm" onClick={() => updateStatus(b._id, "upcoming")}>✅ Accept</Button>
                  <Button size="sm" variant="destructive" onClick={() => updateStatus(b._id, "declined")}>❌ Reject</Button>
                </div>
              )}
            </div>
          ))
        )}

        <Button variant="outline" onClick={() => navigate("/tutorials/tutor/dashboard")}>← Back to Dashboard</Button>
      </div>
    </DashboardLayout>
  );
}

export default TutorAcceptPage;
