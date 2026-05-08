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
    <div className="flex min-h-screen bg-[#fcf8ff] text-[#1b1b24]">
      {/* Sidebar */}
      <aside className="bg-[#f5f2ff] w-64 hidden md:flex flex-col py-6 px-3 border-r border-[#c7c4d8]/30 sticky top-0 h-screen">
        <div className="px-4 mb-8">
          <span className="font-bold text-2xl text-[#3525cd]">JobFlow</span>
          <p className="text-xs text-[#464555]/70 mt-1">Application Tracker</p>
        </div>
        <nav className="flex flex-col gap-1 flex-grow">
          <Link to="/" className="flex items-center gap-3 py-3 px-4 text-[#464555] hover:text-[#3525cd] hover:bg-[#e4e1ee] transition-all text-sm rounded-r-full">
            <span className="material-symbols-outlined">dashboard</span>Dashboard
          </Link>
          <Link to="/applications" className="flex items-center gap-3 py-3 px-4 text-[#464555] hover:text-[#3525cd] hover:bg-[#e4e1ee] transition-all text-sm rounded-r-full">
            <span className="material-symbols-outlined">description</span>Applications
          </Link>
          <Link to="/add" className="flex items-center gap-3 py-3 px-4 text-[#3525cd] bg-[#b6b4ff]/20 border-r-4 border-[#3525cd] rounded-r-full font-semibold text-sm">
            <span className="material-symbols-outlined">add_circle</span>Add New
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col min-w-0">
        <header className="bg-[#fcf8ff] shadow-sm flex items-center justify-between w-full px-6 h-16 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-xl text-[#3525cd] md:hidden mr-4">JobFlow</h1>
            <h2 className="text-xl font-semibold text-[#1b1b24] hidden md:block">Add New Application</h2>
          </div>
          <Link
            to="/profile"
            id="topbar-profile-link-add"
            title="View your profile"
            className="flex items-center gap-2 py-1.5 px-3 rounded-full border border-[#c7c4d8]/60 hover:bg-[#eae6f4] hover:border-[#3525cd]/40 transition-all group"
          >
            <div className="w-7 h-7 rounded-full bg-[#3525cd]/15 flex items-center justify-center text-[#3525cd] text-xs font-bold flex-shrink-0 group-hover:bg-[#3525cd]/25 transition-colors">
              {(user.name || "U").charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-[#464555] font-medium group-hover:text-[#3525cd] transition-colors hidden sm:inline">
              {user.name || "User"}
            </span>
          </Link>
        </header>

        <main className="p-6 md:p-10 max-w-2xl mx-auto w-full">
          <div className="bg-white p-8 rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.1)] border border-[#c7c4d8]/30">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-[#e4e1ee] rounded-lg flex items-center justify-center text-[#3525cd]">
                <span className="material-symbols-outlined text-2xl">post_add</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#1b1b24]">New Application</h2>
                <p className="text-sm text-[#464555]">Track your next career opportunity.</p>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-[#ffdad6] text-[#ba1a1a] rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-semibold text-[#1b1b24]">Company *</label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    required
                    placeholder="e.g. Google"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-[#fcf8ff] border border-[#c7c4d8] rounded-lg focus:ring-2 focus:ring-[#3525cd] focus:border-[#3525cd] outline-none transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-semibold text-[#1b1b24]">Role / Title *</label>
                  <input
                    id="role"
                    name="role"
                    type="text"
                    required
                    placeholder="e.g. Senior Designer"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-[#fcf8ff] border border-[#c7c4d8] rounded-lg focus:ring-2 focus:ring-[#3525cd] focus:border-[#3525cd] outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-semibold text-[#1b1b24]">Location *</label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    required
                    placeholder="e.g. Remote, NY"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-[#fcf8ff] border border-[#c7c4d8] rounded-lg focus:ring-2 focus:ring-[#3525cd] focus:border-[#3525cd] outline-none transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="status" className="text-sm font-semibold text-[#1b1b24]">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-[#fcf8ff] border border-[#c7c4d8] rounded-lg focus:ring-2 focus:ring-[#3525cd] focus:border-[#3525cd] outline-none transition-all text-sm"
                  >
                    <option value="applied">Applied</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="appliedDate" className="text-sm font-semibold text-[#1b1b24]">Date Applied</label>
                <input
                  id="appliedDate"
                  name="appliedDate"
                  type="date"
                  value={formData.appliedDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-[#fcf8ff] border border-[#c7c4d8] rounded-lg focus:ring-2 focus:ring-[#3525cd] focus:border-[#3525cd] outline-none transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-semibold text-[#1b1b24]">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="4"
                  placeholder="Key details, recruiter info, etc..."
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-[#fcf8ff] border border-[#c7c4d8] rounded-lg focus:ring-2 focus:ring-[#3525cd] focus:border-[#3525cd] outline-none transition-all text-sm resize-y"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-[#c7c4d8]/30">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-2 rounded-full border border-[#c7c4d8] text-[#464555] font-semibold hover:bg-[#eae6f4] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 rounded-full bg-[#3525cd] text-white font-semibold hover:brightness-110 transition-all disabled:opacity-50 flex-grow text-center flex items-center justify-center gap-2"
                >
                  {loading ? "Saving..." : <><span className="material-symbols-outlined text-[18px]">save</span> Save Application</>}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-[#fcf8ff] shadow-[0_-1px_3px_rgba(0,0,0,0.1)] flex justify-around py-2 px-4 z-50">
        <Link to="/" className="flex flex-col items-center gap-1 text-[#464555]">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-xs">Home</span>
        </Link>
        <Link to="/applications" className="flex flex-col items-center gap-1 text-[#464555]">
          <span className="material-symbols-outlined">description</span>
          <span className="text-xs">Apps</span>
        </Link>
        <Link to="/add" className="flex flex-col items-center gap-1 text-[#3525cd]">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
          <span className="text-xs">Add</span>
        </Link>
      </nav>
    </div>
  );
}
