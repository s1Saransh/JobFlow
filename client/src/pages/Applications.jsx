import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const statusStyle = (s) => {
  if (s === "interview") return "bg-[#e2dfff] text-[#3525cd]";
  if (s === "offer") return "bg-[#dcfce7] text-[#166534]";
  if (s === "rejected") return "bg-[#ffdad6] text-[#ba1a1a]";
  return "bg-[#e2dfff] text-[#3525cd]";
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
    <div className="flex min-h-screen items-center justify-center bg-[#fcf8ff]">
      <p className="text-[#464555] text-sm">Loading...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#fcf8ff] text-[#1b1b24]">
      {/* Sidebar */}
      <aside className="bg-[#f5f2ff] w-64 hidden md:flex flex-col py-6 px-3 border-r border-[#c7c4d8]/30 sticky top-0 h-screen">
        <div className="px-4 mb-8">
          <span className="font-bold text-2xl text-[#3525cd]">JobFlow</span>
          <p className="text-xs text-[#464555]/70 mt-1">Application Tracker</p>
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          <Link to="/" className="flex items-center gap-3 py-3 px-4 text-[#464555] hover:text-[#3525cd] hover:bg-[#e4e1ee] transition-all text-sm rounded-r-full">
            <span className="material-symbols-outlined">dashboard</span>Dashboard
          </Link>
          <Link to="/applications" className="flex items-center gap-3 py-3 px-4 text-[#3525cd] bg-[#b6b4ff]/20 border-r-4 border-[#3525cd] rounded-r-full font-semibold text-sm">
            <span className="material-symbols-outlined">description</span>Applications
          </Link>
          <Link to="/add" className="flex items-center gap-3 py-3 px-4 text-[#464555] hover:text-[#3525cd] hover:bg-[#e4e1ee] transition-all text-sm rounded-r-full">
            <span className="material-symbols-outlined">add_circle</span>Add New
          </Link>
        </nav>
        <div className="px-3 pb-4 mt-auto">
          <button onClick={() => { localStorage.clear(); navigate("/login"); }}
            className="w-full bg-[#4f46e5] text-white py-3 px-4 rounded-full text-sm font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">add</span>New Application
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-[#fcf8ff] shadow-sm flex justify-between items-center w-full px-6 h-16 sticky top-0 z-40">
          <div className="relative w-full max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#777587]">search</span>
            <input className="w-full pl-10 pr-4 py-2 bg-[#f5f2ff] border border-[#c7c4d8] rounded-lg focus:ring-2 focus:ring-[#3525cd] focus:border-[#3525cd] transition-all outline-none text-sm" placeholder="Search applications..." />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full text-[#464555] hover:bg-[#eae6f4] transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 px-6 md:px-10 py-10 space-y-10 max-w-[1440px] mx-auto w-full">
          {/* Header & Filters */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl font-bold text-[#1b1b24]">Applications</h2>
              <p className="text-[#464555] text-base mt-1">Manage and track your active job search journey.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "All Applications" },
                { key: "progress", label: "In Progress" },
                { key: "offer", label: "Offer" },
                { key: "rejected", label: "Rejected" },
              ].map(f => (
                <button key={f.key} onClick={() => setFilter(f.key)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${filter === f.key ? "bg-[#4f46e5] text-white" : "border border-[#c7c4d8] text-[#464555] hover:bg-[#eae6f4]"}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.1)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#c7c4d8] bg-[#f5f2ff]/50">
                    <th className="px-6 py-4 text-xs font-semibold text-[#464555] uppercase tracking-wider">Company</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#464555] uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#464555] uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#464555] uppercase tracking-wider">Date Applied</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#464555] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#464555] uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c7c4d8]/30">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-16 text-[#464555]">
                        <span className="material-symbols-outlined text-[48px] text-[#c7c4d8] block mx-auto">inbox</span>
                        <p className="mt-3">No applications found.</p>
                        <Link to="/add" className="text-[#3525cd] font-semibold text-sm mt-2 inline-block hover:underline">Add your first one →</Link>
                      </td>
                    </tr>
                  ) : filtered.map(app => (
                    <tr key={app._id} className="hover:bg-[#f5f2ff] transition-colors group cursor-pointer">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-[#e4e1ee] rounded-lg flex items-center justify-center text-[#3525cd]">
                            <span className="material-symbols-outlined">corporate_fare</span>
                          </div>
                          <span className="font-semibold text-[#1b1b24]">{app.company}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-[#464555]">{app.role}</td>
                      <td className="px-6 py-5 text-[#464555]">{app.location}</td>
                      <td className="px-6 py-5 text-[#464555]">{app.appliedDate ? new Date(app.appliedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(app.status)}`}>
                          {statusLabel(app.status)}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <Link to={`/applications/${app._id}`}
                          className="p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-[#e4e1ee] transition-all inline-flex">
                          <span className="material-symbols-outlined">open_in_new</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#f5f2ff]/30">
              <span className="text-sm text-[#464555]">Showing {filtered.length} of {apps.length} applications</span>
            </div>
          </div>

          {/* Summary Bento Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2 p-10 bg-[#4f46e5] text-white rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.1)] flex flex-col justify-between overflow-hidden relative">
              <div className="z-10">
                <h4 className="text-xs font-semibold text-white/80 uppercase tracking-wider">Overview</h4>
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-center bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <span>Applied</span>
                    <span className="font-semibold">{apps.filter(a => a.status === "applied").length}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <span>Interview</span>
                    <span className="font-semibold">{apps.filter(a => a.status === "interview").length}</span>
                  </div>
                </div>
              </div>
              <div className="absolute -right-16 -bottom-16 text-white/5 pointer-events-none">
                <span className="material-symbols-outlined text-[160px]">event_upcoming</span>
              </div>
            </div>
            <div className="p-10 bg-[#e4e1ee] rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.1)] flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-bold text-[#3525cd]">
                {apps.length > 0 ? `${Math.round((apps.filter(a => a.status !== "rejected").length / apps.length) * 100)}%` : "—"}
              </span>
              <p className="text-sm font-semibold text-[#464555] mt-2">Response Rate</p>
            </div>
            <div className="p-10 bg-white rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.1)] flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-bold text-[#58579b]">{apps.filter(a => a.status === "applied" || a.status === "interview").length}</span>
              <p className="text-sm font-semibold text-[#464555] mt-2">Active Apps</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
