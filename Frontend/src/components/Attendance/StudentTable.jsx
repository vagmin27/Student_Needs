function StudentTable({ students, attendanceData, handleAttendance }) {
  if (!students || students.length === 0) {
    return (
      <div className="empty-state">
        <p>No students found</p>
      </div>
    );
  }

  return (
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
          {students?.map((student, i) => (
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
  );
}

export default StudentTable;