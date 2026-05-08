import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const statusStyle = (s) => {
  if (s === "interview") return "bg-primary-fixed text-primary font-label-sm";
  if (s === "offer") return "bg-[#dcfce7] text-[#166534] font-label-sm";
  if (s === "rejected") return "bg-error-container text-error font-label-sm";
  return "bg-primary-fixed text-primary font-label-sm";
};

const statusLabel = (s) => {
  if (s === "interview") return "In Progress";
  if (s === "offer") return "Offer";
  if (s === "rejected") return "Rejected";
  return "Applied";
};

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    fetch("/api/applications", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { if (r.status === 401) { localStorage.clear(); navigate("/login"); } return r.json(); })
      .then(setApps).catch(console.error).finally(() => setLoading(false));
  }, [navigate]);

  const filtered = filter === "all" ? apps
    : filter === "progress" ? apps.filter(a => a.status === "applied" || a.status === "interview")
    : apps.filter(a => a.status === filter);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-on-surface-variant text-body-sm">Loading...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background text-on-surface font-body-lg">
      {/* SideNavBar */}
      <aside className="bg-surface-container-low dark:bg-on-background shadow-sm docked left-0 h-full w-64 hidden md:flex flex-col gap-base py-md px-sm border-r border-outline-variant/30 dark:border-outline/20">
        <div className="px-md mb-lg">
          <h1 className="font-h2 text-h2 font-bold text-primary dark:text-primary-fixed">JobFlow</h1>
          <p className="text-on-surface-variant font-label-sm mt-xs">Application Tracker</p>
        </div>
        <nav className="flex-1 space-y-base">
          <Link to="/" className="flex items-center gap-sm px-md py-sm text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-primary-fixed hover:bg-surface-container-highest dark:hover:bg-surface-variant transition-all duration-200 rounded-r-full">
            <span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
            <span className="font-label-md text-label-md">Dashboard</span>
          </Link>
          <Link to="/applications" className="flex items-center gap-sm px-md py-sm text-primary dark:text-primary-fixed bg-secondary-container/20 dark:bg-secondary-container/10 border-r-4 border-primary rounded-r-full transition-transform">
            <span className="material-symbols-outlined" data-icon="description" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
            <span className="font-label-md text-label-md">Applications</span>
          </Link>
          <Link to="/add" className="flex items-center gap-sm px-md py-sm text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-primary-fixed hover:bg-surface-container-highest dark:hover:bg-surface-variant transition-all duration-200 rounded-r-full">
            <span className="material-symbols-outlined" data-icon="add_circle">add_circle</span>
            <span className="font-label-md text-label-md">Add New</span>
          </Link>
        </nav>
        <div className="mt-auto px-md py-md">
          <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="w-full border border-outline-variant text-on-surface-variant py-sm px-md rounded-full font-label-md flex items-center justify-center gap-base hover:bg-surface-container-high transition-all">
            <span className="material-symbols-outlined">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* TopAppBar */}
        <header className="bg-surface dark:bg-on-background shadow-sm docked full-width top-0 z-40 flex justify-between items-center w-full px-md h-xl max-w-full">
          <div className="flex items-center gap-md flex-1">
            <div className="relative w-full max-w-md">
              <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline" data-icon="search">search</span>
              <input className="w-full pl-[44px] pr-md py-base bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-body-sm" placeholder="Search applications..." type="text"/>
            </div>
          </div>
          <div className="flex items-center gap-md">
            <button className="p-base rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
            </button>
            <div className="flex items-center gap-base pl-md border-l border-outline-variant">
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

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto px-lg py-lg space-y-lg max-w-[1440px] mx-auto w-full">
          
          {/* Header & Filters Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
            <div className="space-y-xs">
              <h2 className="font-h1 text-h1 text-on-surface">Applications</h2>
              <p className="text-on-surface-variant text-body-lg">Manage and track your active job search journey.</p>
            </div>
            {/* Filter Chips */}
            <div className="flex flex-wrap gap-base">
              {[
                { key: "all", label: "All Applications" },
                { key: "progress", label: "In Progress" },
                { key: "offer", label: "Offer" },
                { key: "rejected", label: "Rejected" },
              ].map(f => (
                <button key={f.key} onClick={() => setFilter(f.key)}
                  className={`px-md py-base rounded-full font-label-md flex items-center gap-xs transition-colors ${filter === f.key ? "bg-primary-container text-on-primary-container" : "border border-outline-variant text-on-surface-variant hover:bg-surface-container-high"}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Applications List Table View */}
          <div className="bg-surface-container-lowest rounded-xl shadow-resting overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container-low/50">
                    <th className="px-md py-md font-label-md text-on-surface-variant uppercase tracking-wider">Company</th>
                    <th className="px-md py-md font-label-md text-on-surface-variant uppercase tracking-wider">Role</th>
                    <th className="px-md py-md font-label-md text-on-surface-variant uppercase tracking-wider">Location</th>
                    <th className="px-md py-md font-label-md text-on-surface-variant uppercase tracking-wider">Date Applied</th>
                    <th className="px-md py-md font-label-md text-on-surface-variant uppercase tracking-wider">Status</th>
                    <th className="px-md py-md font-label-md text-on-surface-variant uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-16 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[48px] text-outline-variant block mx-auto">inbox</span>
                        <p className="mt-3">No applications found.</p>
                        <Link to="/add" className="text-primary font-semibold text-sm mt-2 inline-block hover:underline">Add your first one →</Link>
                      </td>
                    </tr>
                  ) : filtered.map(app => (
                    <tr key={app._id} onClick={() => navigate(`/applications/${app._id}`)} className="hover:bg-surface-container-low transition-colors group cursor-pointer">
                      <td className="px-md py-lg">
                        <div className="flex items-center gap-md">
                          <div className="w-xl h-xl bg-surface-container-highest rounded-lg flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined" data-icon="corporate_fare">corporate_fare</span>
                          </div>
                          <span className="font-h3 text-h3 text-on-surface">{app.company}</span>
                        </div>
                      </td>
                      <td className="px-md py-lg text-body-lg text-on-surface-variant">{app.role}</td>
                      <td className="px-md py-lg text-body-lg text-on-surface-variant">{app.location}</td>
                      <td className="px-md py-lg text-body-lg text-on-surface-variant">{app.appliedDate ? new Date(app.appliedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</td>
                      <td className="px-md py-lg">
                        <span className={`px-md py-xs rounded-full ${statusStyle(app.status)}`}>
                          {statusLabel(app.status)}
                        </span>
                      </td>
                      <td className="px-md py-lg text-right">
                        <button className="p-base rounded-full opacity-0 group-hover:opacity-100 hover:bg-surface-container-highest transition-all" onClick={(e) => { e.stopPropagation(); navigate(`/applications/${app._id}`); }}>
                          <span className="material-symbols-outlined" data-icon="open_in_new">open_in_new</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination / Footer */}
            <div className="flex items-center justify-between px-md py-md bg-surface-container-low/30">
              <span className="text-body-sm text-on-surface-variant">Showing {filtered.length} of {apps.length} applications</span>
            </div>
          </div>

          {/* Summary Cards (Asymmetric Bento Style) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
            <div className="md:col-span-2 p-lg bg-primary-container text-on-primary-container rounded-xl shadow-resting flex flex-col justify-between overflow-hidden relative">
              <div className="z-10">
                <h4 className="font-label-md text-on-primary-container/80 uppercase">Overview</h4>
                <div className="mt-md space-y-md">
                  <div className="flex justify-between items-center bg-white/10 p-md rounded-lg backdrop-blur-sm">
                    <span>Applied</span>
                    <span className="font-label-md">{apps.filter(a => a.status === "applied").length}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/10 p-md rounded-lg backdrop-blur-sm">
                    <span>Interview</span>
                    <span className="font-label-md">{apps.filter(a => a.status === "interview").length}</span>
                  </div>
                </div>
              </div>
              <div className="absolute -right-xl -bottom-xl text-white/5 pointer-events-none">
                <span className="material-symbols-outlined text-[160px]" data-icon="event_upcoming">event_upcoming</span>
              </div>
            </div>
            <div className="p-lg bg-surface-container-highest rounded-xl shadow-resting flex flex-col items-center justify-center text-center">
              <span className="text-h1 font-h1 text-primary">
                {apps.length > 0 ? `${Math.round((apps.filter(a => a.status !== "rejected").length / apps.length) * 100)}%` : "—"}
              </span>
              <p className="font-label-md text-on-surface-variant mt-base">Response Rate</p>
            </div>
            <div className="p-lg bg-white rounded-xl shadow-resting flex flex-col items-center justify-center text-center">
              <span className="text-h1 font-h1 text-secondary">{apps.filter(a => a.status === "applied" || a.status === "interview").length}</span>
              <p className="font-label-md text-on-surface-variant mt-base">Active Apps</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
