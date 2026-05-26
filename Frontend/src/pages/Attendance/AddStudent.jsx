import StudentForm from "../../components/Attendance/StudentForm";

function AddStudent() {
  return (
    <div className="attendance-module">
      <div className="page-header">
        <h1>Add Student</h1>
        <p>Register a new student into the attendance system</p>
      </div>
      <div className="card" style={{ maxWidth: 720 }}>
        <StudentForm />
      </div>
    </div>
  );
}

export default AddStudent;