import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const statusStyle = (s) => {
  if (s === "interview") return "bg-[#e2dfff] text-[#3525cd]";
  if (s === "offer") return "bg-[#dcfce7] text-[#166534]";
  if (s === "rejected") return "bg-[#ffdad6] text-[#ba1a1a]";
  return "bg-[#e2dfff] text-[#3525cd]";
};

export default function Dashboard() {
  const [apps, setApps] = useState([]);
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

  const total = apps.length;
  const interviews = apps.filter(a => a.status === "interview").length;
  const offers = apps.filter(a => a.status === "offer").length;
  const recent = apps.slice(0, 3);

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
        <nav className="flex flex-col gap-1 flex-grow">
          <Link to="/" className="flex items-center gap-3 py-3 px-4 text-[#3525cd] bg-[#b6b4ff]/20 border-r-4 border-[#3525cd] rounded-r-full font-semibold text-sm">
            <span className="material-symbols-outlined">dashboard</span>Dashboard
          </Link>
          <Link to="/applications" className="flex items-center gap-3 py-3 px-4 text-[#464555] hover:text-[#3525cd] hover:bg-[#e4e1ee] transition-all text-sm rounded-r-full">
            <span className="material-symbols-outlined">description</span>Applications
          </Link>
          <Link to="/add" className="flex items-center gap-3 py-3 px-4 text-[#464555] hover:text-[#3525cd] hover:bg-[#e4e1ee] transition-all text-sm rounded-r-full">
            <span className="material-symbols-outlined">add_circle</span>Add New
          </Link>
        </nav>
        <div className="px-3 pb-4">
          <button onClick={() => { localStorage.clear(); navigate("/login"); }}
            className="w-full border border-[#c7c4d8] text-[#464555] py-3 px-4 rounded-full text-sm font-semibold hover:bg-[#eae6f4] transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">logout</span>Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-grow flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-[#fcf8ff] shadow-sm flex justify-between items-center w-full px-6 h-16 sticky top-0 z-40">
          <div className="hidden md:flex bg-[#eae6f4] rounded-full px-4 py-2 items-center gap-3 w-96">
            <span className="material-symbols-outlined text-[#777587]">search</span>
            <input className="bg-transparent border-none focus:ring-0 w-full text-sm placeholder:text-[#777587] outline-none" placeholder="Search applications..." />
          </div>
          <div className="flex items-center gap-4">
            <Link to="/add" className="hidden lg:flex items-center gap-1 bg-[#3525cd] text-white py-2 px-4 rounded-full text-sm font-semibold hover:brightness-110 transition-all">
              <span className="material-symbols-outlined text-[18px]">add</span>New Application
            </Link>
            <span className="text-sm text-[#464555] font-medium">{user.name || "User"}</span>
          </div>
        </header>

        <main className="p-6 md:p-10 max-w-[1440px] mx-auto w-full space-y-10">
          {/* Page Header */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl font-bold text-[#1b1b24]">Overview Dashboard</h2>
              <p className="text-base text-[#464555] mt-1">Track your career progress and upcoming milestones.</p>
            </div>
            <Link to="/add" className="bg-[#3525cd] text-white px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2 shadow-md hover:brightness-110 transition-all self-start">
              <span className="material-symbols-outlined text-[18px]">bolt</span>Quick Add
            </Link>
          </section>

          {/* Stat Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Total Applications", value: total, icon: "assignment", badge: "All time", badgeClass: "bg-[#b6b4ff]/20 text-[#58579b]", iconBg: "bg-[#4f46e5]/10 text-[#3525cd]" },
              { label: "Active Interviews", value: interviews, icon: "groups", badge: `${interviews} active`, badgeClass: "bg-[#ffdbcc]/40 text-[#7e3000]", iconBg: "bg-[#ffdbcc]/30 text-[#7e3000]" },
              { label: "Offers Received", value: offers, icon: "celebration", badge: offers > 0 ? "🎉 New!" : "Keep going", badgeClass: "bg-[#e2dfff]/40 text-[#3525cd]", iconBg: "bg-[#b6b4ff]/20 text-[#58579b]" },
            ].map(s => (
              <div key={s.label} className="bg-white p-6 rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.1)] hover:shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition-all flex flex-col gap-3 border border-transparent hover:border-[#c7c4d8]/30">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${s.iconBg}`}>
                    <span className="material-symbols-outlined">{s.icon}</span>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${s.badgeClass}`}>{s.badge}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#464555]">{s.label}</p>
                  <h3 className="text-4xl font-bold text-[#1b1b24]">{s.value}</h3>
                </div>
              </div>
            ))}
          </section>

          {/* Main Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Recent Activity */}
            <div className="lg:col-span-8 bg-white p-6 lg:p-10 rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.1)] space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-semibold text-[#1b1b24]">Recent Activity</h4>
                <Link to="/applications" className="text-[#3525cd] text-sm font-semibold hover:underline">View All</Link>
              </div>
              <div className="space-y-6">
                {recent.length === 0 ? (
                  <div className="text-center py-16">
                    <span className="material-symbols-outlined text-[48px] text-[#c7c4d8]">inbox</span>
                    <p className="text-[#464555] mt-3">No applications yet.</p>
                    <Link to="/add" className="text-[#3525cd] font-semibold text-sm mt-2 inline-block hover:underline">Add your first one →</Link>
                  </div>
                ) : recent.map((app, i) => (
                  <div key={app._id} className="flex gap-6 group">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-[#eae6f4] flex items-center justify-center z-10">
                        <span className="material-symbols-outlined text-[#3525cd] text-[20px]">work</span>
                      </div>
                      {i < recent.length - 1 && <div className="w-[2px] flex-grow bg-[#c7c4d8]/30 mt-1"></div>}
                    </div>
                    <div className="flex-grow pb-6 border-b border-[#c7c4d8]/30 last:border-none">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-semibold text-[#1b1b24]">Applied to <span className="font-bold text-[#3525cd]">{app.company}</span></p>
                          <p className="text-sm text-[#464555] mt-1">{app.role} • {app.location}</p>
                        </div>
                        <span className="text-xs text-[#777587]">{app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : "Recent"}</span>
                      </div>
                      <div className="mt-3">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-semibold ${statusStyle(app.status)}`}>
                          {app.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 space-y-6">
              <div className="relative overflow-hidden rounded-xl bg-[#3525cd] text-white p-10 shadow-xl">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
                <div className="relative z-10 space-y-6">
                  <h5 className="text-xl font-semibold">Your Progress</h5>
                  <div className="flex items-end gap-2">
                    <span className="text-[40px] font-bold leading-none">{total}</span>
                    <span className="text-sm text-white/70 mb-1">apps tracked</span>
                  </div>
                  <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                    <div className="bg-white h-full rounded-full" style={{ width: `${Math.min(total * 5, 100)}%` }}></div>
                  </div>
                  <p className="text-sm text-white/80">{total === 0 ? "Start by adding your first application!" : `Tracking ${total} application${total !== 1 ? "s" : ""}. Keep it up!`}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-[#c7c4d8]/30">
                <h4 className="text-sm font-semibold text-[#1b1b24] mb-4">Status Breakdown</h4>
                <div className="space-y-3">
                  {[
                    { label: "Applied", count: apps.filter(a => a.status === "applied").length, cls: "bg-[#e2dfff] text-[#3525cd]" },
                    { label: "Interview", count: interviews, cls: "bg-[#e2dfff] text-[#3525cd]" },
                    { label: "Offer", count: offers, cls: "bg-[#dcfce7] text-[#166534]" },
                    { label: "Rejected", count: apps.filter(a => a.status === "rejected").length, cls: "bg-[#ffdad6] text-[#ba1a1a]" },
                  ].map(s => (
                    <div key={s.label} className="flex items-center justify-between p-3 hover:bg-[#f5f2ff] rounded-lg transition-colors">
                      <span className="text-sm text-[#464555]">{s.label}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${s.cls}`}>{s.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <Link to="/add" className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-[#3525cd] text-white rounded-full shadow-lg flex items-center justify-center z-50">
        <span className="material-symbols-outlined text-[32px]">add</span>
      </Link>
    </div>
  );
}
