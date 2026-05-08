import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const statusStyle = (s) => {
  if (s === "interview") return "bg-[#b6b4ff]/20 text-[#58579b]";
  if (s === "offer") return "bg-[#dcfce7] text-[#166534]";
  if (s === "rejected") return "bg-[#ffdad6] text-[#ba1a1a]";
  return "bg-[#b6b4ff]/20 text-[#58579b]";
};

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  
  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    fetch(`/api/applications`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        const found = Array.isArray(data) ? data.find(a => a._id === id) : null;
        if (!found) { setError("Application not found"); } else { 
          setApp(found); 
          setNewStatus(found.status);
          setEditData({
            company: found.company,
            role: found.role,
            location: found.location,
            notes: found.notes || "",
            jobUrl: found.jobUrl || ""
          });
        }
      })
      .catch(() => setError("Failed to load application"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === app.status) return;
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      const updated = await res.json();
      setApp(updated);
    } catch { setError("Failed to update status"); }
    finally { setUpdating(false); }
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async () => {
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(editData),
      });
      const updated = await res.json();
      setApp(updated);
      setIsEditing(false);
    } catch { setError("Failed to update application"); }
    finally { setUpdating(false); }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this application?")) return;
    const token = localStorage.getItem("token");
    await fetch(`/api/applications/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    navigate("/applications");
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-[#fcf8ff]">
      <p className="text-[#464555] text-sm">Loading...</p>
    </div>
  );
  if (error || !app) return (
    <div className="flex min-h-screen items-center justify-center bg-[#fcf8ff] flex-col gap-4">
      <p className="text-[#ba1a1a]">{error || "Application not found"}</p>
      <Link to="/applications" className="text-[#3525cd] font-semibold hover:underline">← Back to Applications</Link>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#fcf8ff] text-[#1b1b24] overflow-hidden">
      {/* Sidebar */}
      <aside className="bg-[#f5f2ff] w-64 hidden md:flex flex-col py-6 px-3 border-r border-[#c7c4d8]/30 h-full">
        <div className="px-4 py-2 mb-4">
          <span className="font-bold text-2xl text-[#3525cd]">JobFlow</span>
          <p className="text-xs text-[#464555] mt-1">Application Tracker</p>
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          <Link to="/" className="flex items-center gap-3 py-3 px-4 text-[#464555] hover:text-[#3525cd] hover:bg-[#e4e1ee] transition-all text-sm rounded-r-full">
            <span className="material-symbols-outlined">dashboard</span>Dashboard
          </Link>
          <Link to="/applications" className="flex items-center gap-3 py-3 px-4 text-[#3525cd] bg-[#b6b4ff]/20 border-r-4 border-[#3525cd] rounded-r-full font-semibold text-sm">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>Applications
          </Link>
          <Link to="/add" className="flex items-center gap-3 py-3 px-4 text-[#464555] hover:text-[#3525cd] hover:bg-[#e4e1ee] transition-all text-sm rounded-r-full">
            <span className="material-symbols-outlined">add_circle</span>Add New
          </Link>
        </nav>
        <div className="px-4 py-4 border-t border-[#c7c4d8]/20 mt-auto">
          <button onClick={() => { localStorage.clear(); navigate("/login"); }}
            className="w-full border border-[#c7c4d8] text-[#464555] py-2 px-4 rounded-full text-sm font-semibold hover:bg-[#eae6f4] transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">logout</span>Sign Out
          </button>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#fcf8ff] overflow-hidden">
        {/* Top Bar */}
        <header className="bg-[#fcf8ff] shadow-sm flex justify-between items-center w-full px-6 h-16 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <Link to="/applications" className="p-2 rounded-full hover:bg-[#eae6f4] transition-colors">
              <span className="material-symbols-outlined text-[#3525cd]">arrow_back</span>
            </Link>
            <span className="text-xl font-semibold text-[#3525cd]">Application Details</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-[#eae6f4] transition-colors">
              <span className="material-symbols-outlined text-[#464555]">notifications</span>
            </button>
            <Link to="/add" className="bg-[#3525cd] text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1 hover:shadow-lg transition-all">
              <span className="material-symbols-outlined text-[18px]">add</span>New Application
            </Link>
            <Link
              to="/profile"
              id="topbar-profile-link-detail"
              title="View your profile"
              className="flex items-center gap-2 py-1.5 px-3 rounded-full border border-[#c7c4d8]/60 hover:bg-[#eae6f4] hover:border-[#3525cd]/40 transition-all group ml-1"
            >
              <div className="w-7 h-7 rounded-full bg-[#3525cd]/15 flex items-center justify-center text-[#3525cd] text-xs font-bold flex-shrink-0 group-hover:bg-[#3525cd]/25 transition-colors">
                {(() => { const u = JSON.parse(localStorage.getItem("user") || "{}"); return (u.name || "U").charAt(0).toUpperCase(); })()}
              </div>
              <span className="text-sm text-[#464555] font-medium group-hover:text-[#3525cd] transition-colors hidden sm:inline">
                {JSON.parse(localStorage.getItem("user") || "{}").name || "User"}
              </span>
            </Link>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10">
          <div className="max-w-[1024px] mx-auto space-y-10">
            {/* Job Identity */}
            <section className="flex flex-col md:flex-row md:items-start justify-between gap-6 bg-white p-6 rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.1)]">
              <div className="flex items-start gap-6 flex-1 w-full">
                <div className="w-16 h-16 rounded-lg bg-[#e4e1ee] flex items-center justify-center text-[#3525cd] flex-shrink-0">
                  <span className="material-symbols-outlined text-[32px]">corporate_fare</span>
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-[#464555] font-semibold">Role / Title</label>
                        <input name="role" value={editData.role} onChange={handleEditChange} className="w-full px-3 py-1 bg-[#fcf8ff] border border-[#c7c4d8] rounded focus:ring-1 focus:ring-[#3525cd] outline-none text-xl font-bold" />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="text-xs text-[#464555] font-semibold">Company</label>
                          <input name="company" value={editData.company} onChange={handleEditChange} className="w-full px-3 py-1 bg-[#fcf8ff] border border-[#c7c4d8] rounded focus:ring-1 focus:ring-[#3525cd] outline-none text-base" />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs text-[#464555] font-semibold">Location</label>
                          <input name="location" value={editData.location} onChange={handleEditChange} className="w-full px-3 py-1 bg-[#fcf8ff] border border-[#c7c4d8] rounded focus:ring-1 focus:ring-[#3525cd] outline-none text-base" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-[#464555] font-semibold">Job URL</label>
                        <input name="jobUrl" value={editData.jobUrl} onChange={handleEditChange} placeholder="https://..." className="w-full px-3 py-1 bg-[#fcf8ff] border border-[#c7c4d8] rounded focus:ring-1 focus:ring-[#3525cd] outline-none text-sm" />
                      </div>
                      <div>
                        <label className="text-xs text-[#464555] font-semibold">Notes</label>
                        <textarea name="notes" value={editData.notes} onChange={handleEditChange} rows="3" className="w-full px-3 py-2 bg-[#fcf8ff] border border-[#c7c4d8] rounded focus:ring-1 focus:ring-[#3525cd] outline-none text-sm" />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-4xl font-bold text-[#1b1b24]">{app.role}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xl font-semibold text-[#58579b]">{app.company}</span>
                        <span className="w-1 h-1 rounded-full bg-[#c7c4d8]"></span>
                        <span className="text-base text-[#777587]">{app.location}</span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <span className={`px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${statusStyle(app.status)}`}>
                          <span className="w-2 h-2 rounded-full bg-current"></span>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                        {app.appliedDate && (
                          <span className="bg-[#f0ecf9] text-[#464555] px-4 py-1 rounded-full text-sm font-semibold">
                            Applied {new Date(app.appliedDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0 flex-shrink-0">
                {isEditing ? (
                  <>
                    <button onClick={handleSaveEdit} disabled={updating}
                      className="bg-[#3525cd] text-white px-6 py-2 rounded-full text-sm font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-2">
                      {updating ? "Saving..." : <><span className="material-symbols-outlined text-[18px]">check</span>Save</>}
                    </button>
                    <button onClick={() => setIsEditing(false)}
                      className="border border-[#c7c4d8] text-[#464555] px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#eae6f4] transition-all flex items-center justify-center gap-2">
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setIsEditing(true)}
                      className="border border-[#c7c4d8] text-[#3525cd] px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#eae6f4] transition-all flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">edit</span>Edit Details
                    </button>
                    <button onClick={handleDelete}
                      className="border border-[#ffdad6] text-[#ba1a1a] px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#ffdad6]/20 transition-all flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">delete</span>Delete
                    </button>
                  </>
                )}
              </div>
            </section>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Left: Timeline + Notes */}
              <div className="lg:col-span-2 space-y-10">
                {/* Update Status */}
                <div className="bg-white p-6 md:p-10 rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.1)]">
                  <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#3525cd]">update</span>Update Status
                  </h3>
                  <div className="flex gap-3 flex-wrap">
                    {["applied", "interview", "offer", "rejected"].map(s => (
                      <button key={s} onClick={() => setNewStatus(s)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${newStatus === s ? "bg-[#3525cd] text-white" : "border border-[#c7c4d8] text-[#464555] hover:bg-[#eae6f4]"}`}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                  <button onClick={handleStatusUpdate} disabled={updating || newStatus === app.status}
                    className="mt-6 bg-[#3525cd] text-white px-6 py-3 rounded-full text-sm font-semibold hover:brightness-110 transition-all disabled:opacity-50 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    {updating ? "Saving..." : "Save Status"}
                  </button>
                </div>

                {/* Timeline */}
                <div className="bg-white p-6 md:p-10 rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.1)]">
                  <h3 className="text-2xl font-semibold mb-10 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#3525cd]">route</span>Application Progress
                  </h3>
                  <div className="relative space-y-10">
                    <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-[#c7c4d8]/30"></div>
                    {[
                      { label: "Applied", done: true, desc: app.appliedDate ? `Submitted on ${new Date(app.appliedDate).toLocaleDateString()}` : "Application submitted" },
                      { label: "Interview", done: app.status === "interview" || app.status === "offer", active: app.status === "interview", desc: app.status === "interview" ? "Currently in interview phase" : "Pending" },
                      { label: "Offer", done: app.status === "offer", active: app.status === "offer", desc: app.status === "offer" ? "🎉 Offer received!" : "Pending offer" },
                    ].map(step => (
                      <div key={step.label} className="relative pl-10">
                        <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ring-4 translate-y-1 ${step.done ? "bg-[#3525cd] ring-[#e2dfff]" : "bg-[#c7c4d8] ring-[#f0ecf9]"} ${step.active ? "animate-pulse" : ""}`}>
                          {step.done && <span className="material-symbols-outlined text-white text-[14px]">check</span>}
                        </div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className={`text-sm font-semibold ${step.active ? "text-[#3525cd]" : step.done ? "text-[#1b1b24]" : "text-[#777587]"}`}>{step.label}</h4>
                            <p className="text-sm text-[#777587] mt-1">{step.desc}</p>
                          </div>
                          <span className={`px-3 py-1 rounded text-xs font-semibold ${step.active ? "bg-[#4f46e5] text-white" : step.done ? "bg-[#b6b4ff]/10 text-[#58579b]" : "bg-[#f0ecf9] text-[#777587]"}`}>
                            {step.active ? "Active" : step.done ? "Done" : "Pending"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {app.notes && !isEditing && (
                  <div className="bg-white p-6 md:p-10 rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.1)]">
                    <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#3525cd]">sticky_note_2</span>Notes
                    </h3>
                    <div className="border-l-4 border-[#c3c0ff] pl-4 py-2">
                      <p className="text-sm text-[#464555] whitespace-pre-wrap">{app.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Info */}
              <div className="space-y-6">
                {/* Quick Links */}
                {app.jobUrl && !isEditing && (
                  <div className="bg-white p-6 rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.1)]">
                    <h3 className="text-xs font-semibold text-[#777587] uppercase tracking-wider mb-4">Quick Links</h3>
                    <a href={app.jobUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 border border-[#c7c4d8] rounded-lg hover:bg-[#f0ecf9] transition-all group">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#464555]">description</span>
                        <span className="text-sm font-medium">Original Job Post</span>
                      </div>
                      <span className="material-symbols-outlined text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
                    </a>
                  </div>
                )}

                {/* Tip */}
                <div className="bg-[#ffdbcc]/10 p-6 rounded-xl border border-[#ffb695]/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[#7e3000]">lightbulb</span>
                    <span className="text-sm font-semibold text-[#7e3000]">Quick Tip</span>
                  </div>
                  <p className="text-sm text-[#7b2f00]">
                    Research {app.company}'s culture and values before your interview. Tailor your answers to align with their mission.
                  </p>
                </div>

                {/* App Info */}
                <div className="bg-white p-6 rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.1)]">
                  <h3 className="text-xs font-semibold text-[#777587] uppercase tracking-wider mb-4">Application Info</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Company", value: app.company },
                      { label: "Role", value: app.role },
                      { label: "Location", value: app.location },
                      { label: "Status", value: app.status },
                    ].map(item => (
                      <div key={item.label} className="flex justify-between items-center text-sm">
                        <span className="text-[#464555]">{item.label}</span>
                        <span className="font-semibold text-[#1b1b24] capitalize">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-[#fcf8ff] shadow-[0_-1px_3px_rgba(0,0,0,0.1)] flex justify-around py-2 px-4 z-50">
        <Link to="/" className="flex flex-col items-center gap-1 text-[#464555]">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-xs">Home</span>
        </Link>
        <Link to="/applications" className="flex flex-col items-center gap-1 text-[#3525cd]">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
          <span className="text-xs">Apps</span>
        </Link>
        <Link to="/add" className="flex flex-col items-center gap-1 text-[#464555]">
          <span className="material-symbols-outlined">add_circle</span>
          <span className="text-xs">Add</span>
        </Link>
      </nav>
    </div>
  );
}
