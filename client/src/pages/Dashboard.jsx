import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("/api/applications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }
          throw new Error("Failed to fetch applications");
        }

        const data = await response.json();
        setApplications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [navigate]);

  const stats = [
    { label: "Total Applications", value: applications.length, color: "var(--accent-blue)" },
    { label: "Interviews", value: applications.filter(app => app.status === 'interview').length, color: "var(--accent-green)" },
    { label: "Offers", value: applications.filter(app => app.status === 'offer').length, color: "var(--accent-purple)" },
    { label: "Rejected", value: applications.filter(app => app.status === 'rejected').length, color: "var(--accent-red)" },
  ];

  if (loading) return <div className="page-container"><p>Loading dashboard...</p></div>;

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

      {error && <p style={{ color: "var(--accent-red)" }}>Error: {error}</p>}

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
        {applications.length === 0 ? (
          <p className="empty-state">
            No applications yet.{" "}
            <Link to="/add" className="link">
              Add your first one →
            </Link>
          </p>
        ) : (
          <div className="applications-list" style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {applications.slice(0, 5).map(app => (
              <div key={app._id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>{app.role}</h3>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{app.company} • {app.location}</p>
                </div>
                <div style={{ textTransform: 'capitalize', fontWeight: 'bold', color: `var(--accent-${app.status === 'rejected' ? 'red' : app.status === 'offer' ? 'purple' : app.status === 'interview' ? 'green' : 'blue'})` }}>
                  {app.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
