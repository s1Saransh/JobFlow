import { Link } from "react-router-dom";

export default function Applications() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Applications</h1>
          <p className="page-subtitle">Track every application in one place.</p>
        </div>
        <Link to="/add" className="btn btn-primary">
          <span className="btn-icon">＋</span> Add Application
        </Link>
      </div>

      <div className="filters-bar card">
        <input
          type="text"
          className="input"
          placeholder="Search by company or role…"
          disabled
        />
        <select className="input select" disabled>
          <option>All Statuses</option>
        </select>
      </div>

      <div className="card">
        <p className="empty-state">
          No applications found.{" "}
          <Link to="/add" className="link">
            Add one now →
          </Link>
        </p>
      </div>
    </div>
  );
}
