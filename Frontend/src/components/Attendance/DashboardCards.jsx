// DashboardCards is now handled directly via stat-card classes in Dashboard.jsx
// This component is kept for backward compatibility but is no longer rendered directly.
const DashboardCards = ({ total, present, absent }) => {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-info">
          <div className="stat-label">Total Students</div>
          <div className="stat-value">{total}</div>
        </div>
        <div className="stat-icon indigo">👥</div>
      </div>
      <div className="stat-card">
        <div className="stat-info">
          <div className="stat-label">Present</div>
          <div className="stat-value" style={{ color: "var(--success)" }}>{present}</div>
        </div>
        <div className="stat-icon green">✅</div>
      </div>
      <div className="stat-card">
        <div className="stat-info">
          <div className="stat-label">Absent</div>
          <div className="stat-value" style={{ color: "var(--danger)" }}>{absent}</div>
        </div>
        <div className="stat-icon red">❌</div>
      </div>
    </div>
  );
};

export default DashboardCards;