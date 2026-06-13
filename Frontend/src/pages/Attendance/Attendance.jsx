import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import API, { ATTENDANCE_PATHS } from "../../services/Attendance/api";
import { MdSearch } from "react-icons/md";
import { PageLayout, SectionContainer, PremiumCard, PremiumButton } from "../../components/dashboard/shared/Primitives";

function Attendance() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchStudents();
    fetchSubjects();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get("/students/read");
      setStudents(res.data);
    } catch {
      setStudents([]);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await API.get("/subjects/subjects");
      setSubjects(res.data);
    } catch {
      setSubjects([]);
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
      await API.post(ATTENDANCE_PATHS.root, { subject, date, attendanceData: attendanceArray });
      toast.success("Attendance submitted successfully!");
      setAttendanceData({});
    } catch (error) {
      toast.error("Failed to submit attendance. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = students?.filter((s) =>
    s.Name.toLowerCase().includes(search.toLowerCase())
  );

  const markedCount = Object.keys(attendanceData).length;

  return (
    <PageLayout className="attendance-module">
      <div className="page-header">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">Mark Attendance</h1>
        <p className="text-sm text-muted-foreground mt-1">Select a subject, date, then mark each student present or absent</p>
      </div>

      {/* Filters */}
      <SectionContainer>
        <PremiumCard hoverEffect={false}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div>
              <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Subject</label>
              <select
                className="form-select"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="">Select Subject</option>
                {subjects?.map((sub) => (
                  <option key={sub._id} value={sub.subjectName}>{sub.subjectName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Date</label>
              <input
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
        </PremiumCard>
      </SectionContainer>

      {/* Student List */}
      <SectionContainer>
        <PremiumCard hoverEffect={false}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              Students ({filtered.length})
              {markedCount > 0 && (
                <span className="badge badge-success">{markedCount} marked</span>
              )}
            </h3>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg" />
            <input
              type="text"
              className="form-input pl-10"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No students found</p>
            </div>
          ) : (
            <div className="table-responsive">
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
                  {filtered?.map((student, i) => (
                    <tr key={student._id}>
                      <td>{i + 1}</td>
                      <td className="font-semibold text-foreground">{student.Name}</td>
                      <td>{student.Register_number}</td>
                      <td>{student.Branch_of_studying || "—"}</td>
                      <td>
                        <div className="att-toggle">
                          <button
                            type="button"
                            className={`att-btn present ${attendanceData[student._id] === "present" ? "active" : ""}`}
                            onClick={() => handleAttendance(student._id, "present")}
                          >
                            Present
                          </button>
                          <button
                            type="button"
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

          <div className="mt-6 flex justify-end">
            <PremiumButton
              variant="primary"
              onClick={submitAttendance}
              isLoading={loading}
              className="min-w-[180px]"
            >
              Submit Attendance
            </PremiumButton>
          </div>
        </PremiumCard>
      </SectionContainer>
    </PageLayout>
  );
}

export default Attendance;
