import { Link } from "react-router-dom";

export default function Dashboard() {
  const stats = [
    { label: "Total Applications", value: 0, color: "var(--accent-blue)" },
    { label: "Interviews", value: 0, color: "var(--accent-green)" },
    { label: "Offers", value: 0, color: "var(--accent-purple)" },
    { label: "Rejected", value: 0, color: "var(--accent-red)" },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">Welcome back — here's your overview.</p>
        </div>
        <Link to="/add" className="btn btn-primary">
          <span className="btn-icon">＋</span> New Application
        </Link>
      </div>

      <div className="stats-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <span className="stat-value" style={{ color: s.color }}>
              {s.value}
            </span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <section className="card recent-section">
        <h2>Recent Applications</h2>
        <p className="empty-state">
          No applications yet.{" "}
          <Link to="/add" className="link">
            Add your first one →
          </Link>
        </p>
      </section>
    </div>
  );
}
