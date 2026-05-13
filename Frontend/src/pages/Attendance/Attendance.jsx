import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../../services/Attendance/api";
import { MdSearch } from "react-icons/md";

function Attendance() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchSubjects();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get("/read");
      setStudents(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await API.get("/subjects");
      setSubjects(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAttendance = (id, status) => {
    setAttendanceData((prev) => ({ ...prev, [id]: status }));
  };

  const submitAttendance = async () => {
    if (!subject) { toast.error("Please select a subject"); return; }
    if (Object.keys(attendanceData).length === 0) { toast.error("Please mark attendance for at least one student"); return; }

    setLoading(true);
    try {
      const attendanceArray = Object.entries(attendanceData).map(([studentId, attendance]) => ({ studentId, attendance }));
      await API.post("/attendance", { subject, date, attendanceData: attendanceArray });
      toast.success("Attendance submitted successfully!");
      setAttendanceData({});
    } catch (error) {
      toast.error("Failed to submit attendance. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = students.filter((s) =>
    s.Name.toLowerCase().includes(search.toLowerCase())
  );

  const markedCount = Object.keys(attendanceData).length;

  return (
    <div>
      <div className="page-header">
        <h1>Mark Attendance</h1>
        <p>Select a subject, date, then mark each student present or absent</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="filter-row">
          <div style={{ flex: 1, minWidth: 180 }}>
            <label className="form-label">Subject</label>
            <select
              className="form-select"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="">Select Subject</option>
              {subjects.map((sub) => (
                <option key={sub._id} value={sub.subjectName}>{sub.subjectName}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div className="card-title" style={{ marginBottom: 0 }}>
            Students ({filtered.length})
            {markedCount > 0 && (
              <span className="badge badge-indigo" style={{ marginLeft: 8 }}>{markedCount} marked</span>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="search-wrap">
          <MdSearch />
          <input
            type="text"
            className="search-input"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state"><p>No students found</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Register No.</th>
                  <th>Branch</th>
                  <th>Attendance</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student, i) => (
                  <tr key={student._id}>
                    <td>{i + 1}</td>
                    <td>{student.Name}</td>
                    <td>{student.Register_number}</td>
                    <td>{student.Branch_of_studying || "—"}</td>
                    <td>
                      <div className="att-toggle">
                        <button
                          className={`att-btn present ${attendanceData[student._id] === "present" ? "active" : ""}`}
                          onClick={() => handleAttendance(student._id, "present")}
                        >
                          Present
                        </button>
                        <button
                          className={`att-btn absent ${attendanceData[student._id] === "absent" ? "active" : ""}`}
                          onClick={() => handleAttendance(student._id, "absent")}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
          <button
            className="btn btn-primary"
            onClick={submitAttendance}
            disabled={loading}
            style={{ minWidth: 180 }}
          >
            {loading ? <><span className="spinner" /> Submitting...</> : "Submit Attendance"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Attendance;