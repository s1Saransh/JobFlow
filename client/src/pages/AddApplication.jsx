import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddApplication() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    location: "",
    status: "applied",
    appliedDate: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save application");
      }

      // Success — go to dashboard to see it
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container page-narrow">
      <div className="page-header">
        <div>
          <h1>Add Application</h1>
          <p className="page-subtitle">Log a new job application.</p>
        </div>
      </div>

      {error && (
        <div style={{ color: "var(--accent-red)", marginBottom: "1rem", padding: "0.75rem", backgroundColor: "rgba(255,0,0,0.1)", borderRadius: "8px" }}>
          {error}
        </div>
      )}

      <form className="card form-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="company">Company</label>
          <input
            id="company"
            type="text"
            className="input"
            placeholder="e.g. Google"
            required
            value={formData.company}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Position / Role</label>
          <input
            id="role"
            type="text"
            className="input"
            placeholder="e.g. Frontend Engineer"
            required
            value={formData.role}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            className="input"
            placeholder="e.g. Remote, Berlin, New York"
            required
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" className="input select" value={formData.status} onChange={handleChange}>
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="appliedDate">Date Applied</label>
            <input id="appliedDate" type="date" className="input" value={formData.appliedDate} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            className="input textarea"
            rows="4"
            placeholder="Any notes about this application…"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save Application"}
          </button>
        </div>
      </form>
    </div>
  );
}
