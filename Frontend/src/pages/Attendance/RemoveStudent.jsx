import { useState } from "react";
import toast from "react-hot-toast";
import API, { ATTENDANCE_PATHS } from "../../services/Attendance/api";
import { MdDeleteForever, MdWarning } from "react-icons/md";

function RemoveStudent() {
  const [register, setRegister] = useState("");
  const [loading, setLoading] = useState(false);

  const removeStudent = async (e) => {
    e.preventDefault();
    if (!register.trim()) { toast.error("Please enter a register number"); return; }
    setLoading(true);
    try {
      await API.delete(ATTENDANCE_PATHS.studentByRegister(register));
      await API.delete(`/students/remove/delete/${register}`);
      toast.success("Student removed successfully");
      setRegister("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="attendance-module">
      <div className="page-header">
        <h1>Remove Student</h1>
        <p>Permanently delete a student and their attendance records</p>
      </div>

      <div className="card" style={{ maxWidth: 500 }}>
        <div
          style={{
            background: "var(--danger-light)",
            border: "1px solid var(--danger)",
            borderRadius: "var(--radius-md)",
            padding: "14px 18px",
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            marginBottom: 24,
          }}
        >
          <MdWarning size={20} color="var(--danger)" style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 13, color: "var(--danger)" }}>
            <strong>Warning:</strong> This action is irreversible. The student's record and all
            their attendance data will be permanently deleted.
          </div>
        </div>

        <form onSubmit={removeStudent}>
          <div className="form-group">
            <label className="form-label">Register Number</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter student register number"
              value={register}
              onChange={(e) => setRegister(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="submit"
              className="btn btn-danger"
              disabled={loading}
              style={{ minWidth: 160 }}
            >
              {loading ? (
                <><span className="spinner" /> Removing...</>
              ) : (
                <><MdDeleteForever size={18} /> Remove Student</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RemoveStudent;
