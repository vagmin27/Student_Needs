import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { getSchedule } from "@/services/api/tutorialsApi.js";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

function TutorSchedulePage() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await getSchedule();
        setSchedule(res.data.data?.schedule || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const deleteSlot = async (slotId) => {
    // The backend now determines if a slot can be safely deleted based on the active booking status.
    // We defer the validation to the API endpoint to ensure up-to-date business logic.

    if (!window.confirm("Delete this slot? This cannot be undone.")) return;

    try {
      await API.delete(`/tutor/schedule/${slotId}`);

      setSchedule((prev) =>
        prev?.filter((s) => s._id !== slotId)
      );

      toast.success("Slot deleted ✅");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || err.response?.data?.message || "Error deleting slot ❌");
    }
  };

  return (
    <DashboardLayout pageTitle="My Schedule" role="tutor">
      <div className="space-y-4 pb-8">
        <h1 className="text-2xl font-bold tracking-tight">📅 My Schedule</h1>

        {loading ? (
          <p>Loading schedule... ⏳</p>
        ) : schedule.length === 0 ? (
          <p>No schedule found ❌</p>
        ) : (
          schedule?.map((item, index) => (
            <div key={item._id || index} className="rounded-[var(--radius-md)] border border-border bg-card p-5 shadow-[var(--shadow-sm)] space-y-3">
              
              <p className="text-sm text-muted-foreground">
                <strong>📅 Date:</strong> {item.date}
              </p>
              
              <p className="text-sm text-muted-foreground">
                <strong>⏰ Time:</strong> {item.time}
              </p>
              
              <p className="text-sm text-muted-foreground">
                <strong>📖 Subject:</strong>{" "}
                {item.subject || item.subjects?.[0] || "N/A"}
              </p>
              
              {item.tutor && (
                <p className="text-sm text-muted-foreground">
                  <strong>👨‍🏫 Tutor:</strong> {item.tutor}
                </p>
              )}
              
              <p className="text-sm text-muted-foreground">
                <strong>Status:</strong>{" "}
                {item.bookingCount > 0 ? `👥 ${item.bookingCount} enrolled` : "⏳ Available"}
              </p>

              {[
                "Booked",
                "pending",
                "accepted",
                "upcoming",
                "in_progress",
              ].includes(item.bookingStatus) ? (
                <>
                  <div className="mt-4 flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Paste Zoom / Google Meet link"
                      value={item.meetingLink || ""}
                      onChange={(e) => {
                        const updated = [...schedule];
                        updated[index].meetingLink = e.target.value;
                        setSchedule(updated);
                      }}
                      className="w-full rounded-[var(--radius-sm)] border border-input bg-background px-3 py-2 text-sm"
                    />

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          await API.post("/tutor/save-link", {
                            slotId: item._id,
                            link: item.meetingLink,
                          });

                          toast.success("Link saved ✅");
                        } catch (err) {
                          console.error(err);
                          toast.error("Error ❌");
                        }
                      }}
                    >
                      Save Link
                    </Button>
                  </div>

                  {item.meetingLink && (
                    <div className="text-sm mt-2 flex gap-3">
                      <a
                        href={item.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline font-bold"
                      >
                        🚀 Join Class (Open)
                      </a>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(item.meetingLink);
                          toast.success("Link copied!");
                        }}
                        className="text-primary hover:underline"
                      >
                        📋 Copy Link
                      </button>
                    </div>
                  )}
                </>
              ) : null}

              <div className="pt-2 flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteSlot(item._id)}
                >
                  🗑️ Delete Slot
                </Button>
                
                {item.studentId && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-500/10 text-green-600 hover:bg-green-500/20 hover:text-green-700 border-green-500/30 dark:bg-green-500/20 dark:text-green-400 dark:hover:text-green-300"
                    onClick={() => navigate(`/tutorials/chat?studentId=${item.studentId}`)}
                  >
                    💬 Message Student
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}

export default TutorSchedulePage;
