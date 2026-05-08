import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const statusStyle = (s) => {
  if (s === "interview") return "bg-primary-fixed text-primary";
  if (s === "offer") return "bg-[#dcfce7] text-[#166534]";
  if (s === "rejected") return "bg-error-container text-error";
  return "bg-secondary-container/20 text-secondary";
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
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-on-surface-variant text-body-sm">Loading...</p>
    </div>
  );
  if (error || !app) return (
    <div className="flex min-h-screen items-center justify-center bg-background flex-col gap-base">
      <p className="text-error font-body-lg">{error || "Application not found"}</p>
      <Link to="/applications" className="text-primary font-semibold hover:underline">← Back to Applications</Link>
    </div>
  );

  return (
    <div className="flex h-screen bg-background text-on-surface font-body-lg overflow-hidden">
      {/* SideNavBar Component */}
      <aside className="bg-surface-container-low dark:bg-on-background shadow-sm docked left-0 h-full w-64 hidden md:flex flex-col gap-base py-md px-sm border-r border-outline-variant/30 dark:border-outline/20">
        <div className="px-md py-base mb-lg">
          <span className="font-h2 text-h2 font-bold text-primary dark:text-primary-fixed">JobFlow</span>
          <p className="font-label-sm text-on-surface-variant/70 mt-xs">Application Tracker</p>
        </div>
        <nav className="flex flex-col gap-xs flex-grow">
          <Link to="/" className="flex items-center gap-sm py-sm px-md text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-primary-fixed font-label-md text-label-md hover:bg-surface-container-highest dark:hover:bg-surface-variant transition-all duration-200 rounded-r-full">
            <span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
            Dashboard
          </Link>
          <Link to="/applications" className="flex items-center gap-sm py-sm px-md text-primary dark:text-primary-fixed bg-secondary-container/20 dark:bg-secondary-container/10 border-r-4 border-primary rounded-r-full font-label-md text-label-md transition-transform">
            <span className="material-symbols-outlined" data-icon="description" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
            Applications
          </Link>
          <Link to="/add" className="flex items-center gap-sm py-sm px-md text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-primary-fixed font-label-md text-label-md hover:bg-surface-container-highest dark:hover:bg-surface-variant transition-all duration-200 rounded-r-full">
            <span className="material-symbols-outlined" data-icon="add_circle">add_circle</span>
            Add New
          </Link>
        </nav>
        <div className="mt-auto px-sm pb-md">
          <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="w-full border border-outline-variant text-on-surface-variant py-sm px-md rounded-full font-label-md flex items-center justify-center gap-base hover:bg-surface-container-high transition-all">
            <span className="material-symbols-outlined">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden">
        {/* TopAppBar Component */}
        <header className="bg-surface dark:bg-on-background shadow-sm docked full-width top-0 z-40 flex justify-between items-center w-full px-md h-xl max-w-full">
          <div className="flex items-center gap-base">
            <Link to="/applications" className="p-xs rounded-full hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-primary">arrow_back</span>
            </Link>
            <span className="font-h3 text-h3 font-semibold text-primary">Application Details</span>
          </div>
          <div className="flex items-center gap-md">
            <Link to="/add" className="hidden lg:flex items-center gap-xs bg-primary text-on-primary py-xs px-md rounded-full font-label-md transition-all hover:opacity-90">
                New Application
            </Link>
            <div className="flex items-center gap-sm border-l border-outline-variant pl-md ml-xs">
              <Link to="/profile" title="View your profile" className="flex items-center gap-2 py-1.5 px-3 rounded-full border border-outline-variant/60 hover:bg-surface-container-high hover:border-primary/40 transition-all group">
                <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0 group-hover:bg-primary/25 transition-colors">
                  {(() => { const u = JSON.parse(localStorage.getItem("user") || "{}"); return (u.name || "U").charAt(0).toUpperCase(); })()}
                </div>
                <span className="text-sm text-on-surface-variant font-medium group-hover:text-primary transition-colors hidden sm:inline">
                  {JSON.parse(localStorage.getItem("user") || "{}").name || "User"}
                </span>
              </Link>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-lg md:p-xl space-y-xl">
          <div className="max-w-[1024px] mx-auto space-y-xl">
            {/* Job Identity */}
            <section className="flex flex-col md:flex-row md:items-start justify-between gap-md bg-white p-lg rounded-xl shadow-resting">
              <div className="flex items-start gap-md flex-1 w-full">
                <div className="w-16 h-16 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-[32px]">corporate_fare</span>
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-sm">
                      <div>
                        <label className="font-label-sm text-on-surface-variant block mb-xs">Role / Title</label>
                        <input name="role" value={editData.role} onChange={handleEditChange} className="w-full px-sm py-xs bg-surface-bright border border-outline-variant rounded focus:ring-1 focus:ring-primary outline-none font-h3 text-h3" />
                      </div>
                      <div className="flex gap-md">
                        <div className="flex-1">
                          <label className="font-label-sm text-on-surface-variant block mb-xs">Company</label>
                          <input name="company" value={editData.company} onChange={handleEditChange} className="w-full px-sm py-xs bg-surface-bright border border-outline-variant rounded focus:ring-1 focus:ring-primary outline-none font-body-lg" />
                        </div>
                        <div className="flex-1">
                          <label className="font-label-sm text-on-surface-variant block mb-xs">Location</label>
                          <input name="location" value={editData.location} onChange={handleEditChange} className="w-full px-sm py-xs bg-surface-bright border border-outline-variant rounded focus:ring-1 focus:ring-primary outline-none font-body-lg" />
                        </div>
                      </div>
                      <div>
                        <label className="font-label-sm text-on-surface-variant block mb-xs">Job URL</label>
                        <input name="jobUrl" value={editData.jobUrl} onChange={handleEditChange} placeholder="https://..." className="w-full px-sm py-xs bg-surface-bright border border-outline-variant rounded focus:ring-1 focus:ring-primary outline-none font-body-sm" />
                      </div>
                      <div>
                        <label className="font-label-sm text-on-surface-variant block mb-xs">Notes</label>
                        <textarea name="notes" value={editData.notes} onChange={handleEditChange} rows="3" className="w-full px-sm py-xs bg-surface-bright border border-outline-variant rounded focus:ring-1 focus:ring-primary outline-none font-body-sm" />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h2 className="font-h1 text-h1 text-on-surface">{app.role}</h2>
                      <div className="flex items-center gap-xs mt-1">
                        <span className="font-h3 text-h3 text-secondary">{app.company}</span>
                        <span className="w-1 h-1 rounded-full bg-outline-variant mx-xs"></span>
                        <span className="font-body-lg text-outline">{app.location}</span>
                      </div>
                      <div className="flex gap-sm mt-sm">
                        <span className={`px-sm py-xs rounded-full font-label-md flex items-center gap-xs ${statusStyle(app.status)}`}>
                          <span className="w-2 h-2 rounded-full bg-current"></span>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                        {app.appliedDate && (
                          <span className="bg-surface-container text-on-surface-variant px-sm py-xs rounded-full font-label-md">
                            Applied {new Date(app.appliedDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-row md:flex-col gap-xs mt-md md:mt-0 flex-shrink-0">
                {isEditing ? (
                  <>
                    <button onClick={handleSaveEdit} disabled={updating}
                      className="bg-primary text-on-primary px-md py-sm rounded-full font-label-md hover:brightness-110 transition-all flex items-center justify-center gap-xs">
                      {updating ? "Saving..." : <><span className="material-symbols-outlined text-[18px]">check</span>Save</>}
                    </button>
                    <button onClick={() => setIsEditing(false)}
                      className="border border-outline-variant text-on-surface-variant px-md py-sm rounded-full font-label-md hover:bg-surface-container-high transition-all flex items-center justify-center gap-xs">
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setIsEditing(true)}
                      className="border border-outline-variant text-primary px-md py-sm rounded-full font-label-md hover:bg-surface-container-high transition-all flex items-center justify-center gap-xs">
                      <span className="material-symbols-outlined text-[18px]">edit</span>Edit Details
                    </button>
                    <button onClick={handleDelete}
                      className="border border-error-container text-error px-md py-sm rounded-full font-label-md hover:bg-error-container/20 transition-all flex items-center justify-center gap-xs">
                      <span className="material-symbols-outlined text-[18px]">delete</span>Delete
                    </button>
                  </>
                )}
              </div>
            </section>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
              {/* Left: Timeline + Notes */}
              <div className="lg:col-span-2 space-y-lg">
                {/* Update Status */}
                <div className="bg-white p-lg rounded-xl shadow-resting">
                  <h3 className="font-h3 text-h3 mb-md flex items-center gap-xs">
                    <span className="material-symbols-outlined text-primary">update</span>Update Status
                  </h3>
                  <div className="flex gap-sm flex-wrap">
                    {["applied", "interview", "offer", "rejected"].map(s => (
                      <button key={s} onClick={() => setNewStatus(s)}
                        className={`px-md py-sm rounded-full font-label-md transition-all ${newStatus === s ? "bg-primary text-on-primary" : "border border-outline-variant text-on-surface-variant hover:bg-surface-container-high"}`}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                  <button onClick={handleStatusUpdate} disabled={updating || newStatus === app.status}
                    className="mt-md bg-primary text-on-primary px-md py-sm rounded-full font-label-md hover:brightness-110 transition-all disabled:opacity-50 flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    {updating ? "Saving..." : "Save Status"}
                  </button>
                </div>

                {/* Timeline */}
                <div className="bg-white p-lg rounded-xl shadow-resting">
                  <h3 className="font-h3 text-h3 mb-lg flex items-center gap-xs">
                    <span className="material-symbols-outlined text-primary">route</span>Application Progress
                  </h3>
                  <div className="relative space-y-lg">
                    <div className="absolute left-4 top-2 bottom-2 w-[2px] bg-outline-variant/30"></div>
                    {[
                      { label: "Applied", done: true, desc: app.appliedDate ? `Submitted on ${new Date(app.appliedDate).toLocaleDateString()}` : "Application submitted" },
                      { label: "Interview", done: app.status === "interview" || app.status === "offer", active: app.status === "interview", desc: app.status === "interview" ? "Currently in interview phase" : "Pending" },
                      { label: "Offer", done: app.status === "offer", active: app.status === "offer", desc: app.status === "offer" ? "🎉 Offer received!" : "Pending offer" },
                    ].map(step => (
                      <div key={step.label} className="relative pl-xl">
                        <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ring-4 translate-y-1 ${step.done ? "bg-primary ring-primary-fixed" : "bg-outline-variant ring-surface-container"} ${step.active ? "animate-pulse" : ""}`}>
                          {step.done && <span className="material-symbols-outlined text-on-primary text-[14px]">check</span>}
                        </div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className={`font-label-md text-label-md ${step.active ? "text-primary" : step.done ? "text-on-surface" : "text-outline"}`}>{step.label}</h4>
                            <p className="font-body-sm text-body-sm text-outline mt-xs">{step.desc}</p>
                          </div>
                          <span className={`px-sm py-xs rounded font-label-sm text-label-sm ${step.active ? "bg-primary text-on-primary" : step.done ? "bg-secondary-container/10 text-secondary" : "bg-surface-container text-outline"}`}>
                            {step.active ? "Active" : step.done ? "Done" : "Pending"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {app.notes && !isEditing && (
                  <div className="bg-white p-lg rounded-xl shadow-resting">
                    <h3 className="font-h3 text-h3 mb-md flex items-center gap-xs">
                      <span className="material-symbols-outlined text-primary">sticky_note_2</span>Notes
                    </h3>
                    <div className="border-l-4 border-primary-fixed-dim pl-sm py-xs">
                      <p className="font-body-sm text-body-sm text-on-surface-variant whitespace-pre-wrap">{app.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Info */}
              <div className="space-y-md">
                {/* Quick Links */}
                {app.jobUrl && !isEditing && (
                  <div className="bg-white p-md rounded-xl shadow-resting">
                    <h3 className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-sm">Quick Links</h3>
                    <a href={app.jobUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-between p-sm border border-outline-variant rounded-lg hover:bg-surface-container transition-all group">
                      <div className="flex items-center gap-sm">
                        <span className="material-symbols-outlined text-on-surface-variant">description</span>
                        <span className="font-label-md text-on-surface">Original Job Post</span>
                      </div>
                      <span className="material-symbols-outlined text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
                    </a>
                  </div>
                )}

                {/* Tip */}
                <div className="bg-tertiary-fixed/30 p-md rounded-xl border border-tertiary-fixed-dim/30">
                  <div className="flex items-center gap-xs mb-xs">
                    <span className="material-symbols-outlined text-tertiary">lightbulb</span>
                    <span className="font-label-md text-label-md text-tertiary">Quick Tip</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-tertiary-fixed-variant">
                    Research {app.company}'s culture and values before your interview. Tailor your answers to align with their mission.
                  </p>
                </div>

                {/* App Info */}
                <div className="bg-white p-md rounded-xl shadow-resting">
                  <h3 className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-sm">Application Info</h3>
                  <div className="space-y-sm">
                    {[
                      { label: "Company", value: app.company },
                      { label: "Role", value: app.role },
                      { label: "Location", value: app.location },
                      { label: "Status", value: app.status },
                    ].map(item => (
                      <div key={item.label} className="flex justify-between items-center font-body-sm text-body-sm">
                        <span className="text-on-surface-variant">{item.label}</span>
                        <span className="font-semibold text-on-surface capitalize">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
