import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/Attendance/AuthContext";

function Navbar() {
  const { user, logout, isTeacher, isStudent } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <h2>Attendance Manager</h2>

      <div className="nav-links">
        {isTeacher && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/attendance">Attendance</Link>
            <Link to="/add-student">Add Student</Link>
            <Link to="/remove-student">Remove Student</Link>
            <Link to="/reports">Reports</Link>
            <Link to="/add-subject">Add Subject</Link>
          </>
        )}
        {isStudent && (
          <>
            <Link to="/student-dashboard">My Dashboard</Link>
            <Link to="/profile">Profile</Link>
          </>
        )}
        <button onClick={handleLogout} className="btn btn-outline-danger ms-3">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;