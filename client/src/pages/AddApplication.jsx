import { useNavigate } from "react-router-dom";

export default function AddApplication() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: send data to backend
    navigate("/applications");
  };

  return (
    <div className="page-container page-narrow">
      <div className="page-header">
        <div>
          <h1>Add Application</h1>
          <p className="page-subtitle">Log a new job application.</p>
        </div>
      </div>

      <form className="card form-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="company">Company</label>
          <input
            id="company"
            type="text"
            className="input"
            placeholder="e.g. Google"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="position">Position</label>
          <input
            id="position"
            type="text"
            className="input"
            placeholder="e.g. Frontend Engineer"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" className="input select">
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">Date Applied</label>
            <input id="date" type="date" className="input" />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            className="input textarea"
            rows="4"
            placeholder="Any notes about this application…"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save Application
          </button>
        </div>
      </form>
    </div>
  );
}
