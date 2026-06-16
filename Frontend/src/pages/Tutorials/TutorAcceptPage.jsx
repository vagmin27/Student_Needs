import React, { useEffect, useState } from "react";
import API from "@/services/api/tutorialsApi.js";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
function TutorAcceptPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [linkInputs, setLinkInputs] = useState({});
  const [editingLink, setEditingLink] = useState({});

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

  const publishMeetingLink = async (id, link) => {
    if (!link || !link.trim().startsWith("http")) {
      alert("Please enter a valid HTTP/HTTPS URL");
      return;
    }
    try {
      const res = await API.patch(`/booking/${id}/meeting-link`, { meetingLink: link });
      setBookings((prev) =>
        prev?.map((b) => (b._id === id ? { ...b, ...res.data.booking } : b))
      );
      setEditingLink((prev) => ({ ...prev, [id]: false }));
    } catch (err) {
      console.error("Publish link failed:", err);
      alert(err.response?.data?.msg || "Failed to publish link");
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
              className="rounded-[var(--radius-md)] border border-border bg-card p-5 shadow-[var(--shadow-sm)] space-y-2"
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
                        ? "text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--primary)]/10 text-blue-700 dark:bg-blue-900/30 dark:text-[var(--primary)]"
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

              {(b.status === "upcoming" || b.status === "accepted") && (
                <div className="mt-4 p-4 border rounded bg-muted/30 space-y-2">
                  <p className="font-semibold text-sm">Meeting Link:</p>
                  
                  {b.meetingLinkPublished && !editingLink[b._id] ? (
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                        ✅ Meeting link published
                      </span>
                      <a href={b.meetingLink} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline truncate max-w-[200px] block">
                        {b.meetingLink}
                      </a>
                      <Button size="sm" variant="outline" onClick={() => {
                        setLinkInputs(prev => ({ ...prev, [b._id]: b.meetingLink }));
                        setEditingLink(prev => ({ ...prev, [b._id]: true }));
                      }}>
                        Edit Link
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="url"
                        placeholder="https://meet.google.com/..."
                        className="flex-1 rounded-[var(--radius-sm)] border border-input bg-background px-3 py-2 text-sm"
                        value={linkInputs[b._id] !== undefined ? linkInputs[b._id] : (b.meetingLink || "")}
                        onChange={(e) => setLinkInputs(prev => ({ ...prev, [b._id]: e.target.value }))}
                      />
                      <Button size="sm" onClick={() => publishMeetingLink(b._id, linkInputs[b._id] !== undefined ? linkInputs[b._id] : b.meetingLink)}>
                        {b.meetingLinkPublished ? "Update Link" : "Publish Link"}
                      </Button>
                      {b.meetingLinkPublished && (
                        <Button size="sm" variant="ghost" onClick={() => setEditingLink(prev => ({ ...prev, [b._id]: false }))}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  )}
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
