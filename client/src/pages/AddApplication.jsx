import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AddApplication() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    location: "",
    status: "applied",
    appliedDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); return; }
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

      navigate("/applications");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-on-surface font-body-lg">
      {/* SideNavBar Component */}
      <aside className="bg-surface-container-low dark:bg-on-background shadow-sm docked left-0 h-full w-64 hidden md:flex flex-col gap-base py-md px-sm border-r border-outline-variant/30 dark:border-outline/20 sticky top-0">
        <div className="px-md py-base mb-lg">
          <span className="font-h2 text-h2 font-bold text-primary dark:text-primary-fixed">JobFlow</span>
          <p className="font-label-sm text-on-surface-variant/70 mt-xs">Application Tracker</p>
        </div>
        <nav className="flex flex-col gap-xs flex-grow">
          <Link to="/" className="flex items-center gap-sm py-sm px-md text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-primary-fixed font-label-md text-label-md hover:bg-surface-container-highest dark:hover:bg-surface-variant transition-all duration-200 rounded-r-full">
            <span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
            Dashboard
          </Link>
          <Link to="/applications" className="flex items-center gap-sm py-sm px-md text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-primary-fixed font-label-md text-label-md hover:bg-surface-container-highest dark:hover:bg-surface-variant transition-all duration-200 rounded-r-full">
            <span className="material-symbols-outlined" data-icon="description">description</span>
            Applications
          </Link>
          <Link to="/add" className="flex items-center gap-sm py-sm px-md text-primary dark:text-primary-fixed bg-secondary-container/20 dark:bg-secondary-container/10 border-r-4 border-primary rounded-r-full font-label-md text-label-md transition-transform">
            <span className="material-symbols-outlined" data-icon="add_circle" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
            Add New
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* TopAppBar Component */}
        <header className="bg-surface dark:bg-on-background shadow-sm docked full-width top-0 z-40 flex justify-between items-center w-full px-md h-xl max-w-full">
          <div className="flex items-center gap-md">
            <h1 className="font-h3 text-h3 font-semibold text-primary dark:text-primary-fixed md:hidden">JobFlow</h1>
            <h2 className="text-h3 font-h3 text-on-surface hidden md:block">Add New Application</h2>
          </div>
          <div className="flex items-center gap-md">
            <div className="flex items-center gap-sm">
              <Link to="/profile" title="View your profile" className="flex items-center gap-2 py-1.5 px-3 rounded-full border border-outline-variant/60 hover:bg-surface-container-high hover:border-primary/40 transition-all group">
                <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0 group-hover:bg-primary/25 transition-colors">
                  {(user.name || "U").charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-on-surface-variant font-medium group-hover:text-primary transition-colors hidden sm:inline">
                  {user.name || "User"}
                </span>
              </Link>
            </div>
          </div>
        </header>

        {/* Content Canvas */}
        <main className="p-md md:p-lg lg:p-xl max-w-2xl mx-auto w-full space-y-xl overflow-y-auto">
          <div className="bg-white p-lg rounded-xl shadow-resting border border-outline-variant/30">
            <div className="flex items-center gap-sm mb-lg">
              <div className="w-12 h-12 bg-surface-container-highest rounded-lg flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[24px]">post_add</span>
              </div>
              <div>
                <h2 className="text-h2 font-h2 text-on-surface">New Application</h2>
                <p className="font-body-sm text-on-surface-variant mt-xs">Track your next career opportunity.</p>
              </div>
            </div>

            {error && (
              <div className="mb-md p-md bg-error-container text-on-error-container rounded-lg font-label-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="space-y-xs">
                  <label htmlFor="company" className="font-label-md text-on-surface">Company *</label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    required
                    placeholder="e.g. Google"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-md py-sm bg-surface-bright border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-sm text-on-surface"
                  />
                </div>
                <div className="space-y-xs">
                  <label htmlFor="role" className="font-label-md text-on-surface">Role / Title *</label>
                  <input
                    id="role"
                    name="role"
                    type="text"
                    required
                    placeholder="e.g. Senior Designer"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-md py-sm bg-surface-bright border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-sm text-on-surface"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="space-y-xs">
                  <label htmlFor="location" className="font-label-md text-on-surface">Location *</label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    required
                    placeholder="e.g. Remote, NY"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-md py-sm bg-surface-bright border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-sm text-on-surface"
                  />
                </div>
                <div className="space-y-xs">
                  <label htmlFor="appliedDate" className="font-label-md text-on-surface">Applied Date</label>
                  <input
                    id="appliedDate"
                    name="appliedDate"
                    type="date"
                    required
                    value={formData.appliedDate}
                    onChange={handleChange}
                    className="w-full px-md py-sm bg-surface-bright border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-sm text-on-surface"
                  />
                </div>
              </div>

              <div className="space-y-xs">
                <label htmlFor="status" className="font-label-md text-on-surface">Initial Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-md py-sm bg-surface-bright border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-sm text-on-surface"
                >
                  <option value="applied">Applied</option>
                  <option value="interview">Interviewing</option>
                  <option value="offer">Offer Received</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="space-y-xs">
                <label htmlFor="notes" className="font-label-md text-on-surface">Notes / Description (Optional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="4"
                  placeholder="Link to job description, key requirements, etc."
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-md py-sm bg-surface-bright border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-sm text-on-surface resize-y"
                ></textarea>
              </div>

              <div className="flex justify-end gap-sm pt-sm">
                <button type="button" onClick={() => navigate(-1)} className="px-lg py-sm rounded-full font-label-md text-primary border border-outline-variant hover:bg-surface-container-high transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-lg py-sm rounded-full font-label-md bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container shadow-sm hover:shadow-hover transition-all disabled:opacity-50 flex items-center gap-xs">
                  {loading ? "Saving..." : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">save</span>
                      Save Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
