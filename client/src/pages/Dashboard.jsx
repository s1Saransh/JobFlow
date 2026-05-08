import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

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
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-on-surface-variant text-body-sm">Loading...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background text-on-surface font-body-lg">
      {/* SideNavBar Component */}
      <aside className="bg-surface-container-low dark:bg-on-background shadow-sm docked left-0 h-full w-64 hidden md:flex flex-col gap-base py-md px-sm border-r border-outline-variant/30 dark:border-outline/20 sticky top-0">
        <div className="px-md py-base mb-lg">
          <span className="font-h2 text-h2 font-bold text-primary dark:text-primary-fixed">JobFlow</span>
          <p className="font-label-sm text-on-surface-variant/70 mt-xs">Application Tracker</p>
        </div>
        <nav className="flex flex-col gap-xs flex-grow">
          {/* Dashboard (Active) */}
          <Link to="/" className="flex items-center gap-sm py-sm px-md text-primary dark:text-primary-fixed bg-secondary-container/20 dark:bg-secondary-container/10 border-r-4 border-primary rounded-r-full font-label-md text-label-md transition-transform">
            <span className="material-symbols-outlined" data-icon="dashboard" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
            Dashboard
          </Link>
          {/* Applications */}
          <Link to="/applications" className="flex items-center gap-sm py-sm px-md text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-primary-fixed font-label-md text-label-md hover:bg-surface-container-highest dark:hover:bg-surface-variant transition-all duration-200 rounded-r-full">
            <span className="material-symbols-outlined" data-icon="description">description</span>
            Applications
          </Link>
          {/* Add New */}
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

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* TopAppBar Component */}
        <header className="bg-surface dark:bg-on-background shadow-sm docked full-width top-0 z-40 flex justify-between items-center w-full px-md h-xl max-w-full">
          <div className="flex items-center gap-md">
            <h1 className="font-h3 text-h3 font-semibold text-primary dark:text-primary-fixed md:hidden">JobFlow</h1>
            <div className="hidden md:flex bg-surface-container-high rounded-full px-md py-xs items-center gap-sm w-96">
              <span className="material-symbols-outlined text-outline" data-icon="search">search</span>
              <input className="bg-transparent border-none focus:ring-0 w-full text-body-sm font-body-sm placeholder:text-outline outline-none" placeholder="Search applications..." type="text"/>
            </div>
          </div>
          <div className="flex items-center gap-md">
            <Link to="/add" className="hidden lg:flex items-center gap-xs bg-primary text-on-primary py-xs px-md rounded-full font-label-md transition-all hover:opacity-90">
                New Application
            </Link>
            <div className="flex items-center gap-sm border-l border-outline-variant pl-md ml-xs">
              <button className="p-xs rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant relative">
                <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
              </button>
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
        <main className="p-md md:p-lg lg:p-xl max-w-[1440px] mx-auto w-full space-y-xl overflow-y-auto">
          {/* Dashboard Header Section */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-md">
            <div>
              <h2 className="font-h1 text-h1 text-on-surface">Overview Dashboard</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-xs">Track your career progress and upcoming milestones.</p>
            </div>
            <div className="flex gap-sm">
              <button className="bg-white border border-outline-variant px-md py-sm rounded-full text-primary font-label-md flex items-center gap-xs hover:bg-surface-container-low transition-colors shadow-sm">
                <span className="material-symbols-outlined text-[18px]" data-icon="file_download">file_download</span>
                Export Data
              </button>
              <Link to="/add" className="bg-primary text-on-primary px-md py-sm rounded-full font-label-md flex items-center gap-xs shadow-md hover:brightness-110 transition-all">
                <span className="material-symbols-outlined text-[18px]" data-icon="bolt">bolt</span>
                Quick Add
              </Link>
            </div>
          </section>

          {/* Funnel Overview Metric Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Total Applications */}
            <div className="bg-white p-md rounded-xl shadow-resting hover:shadow-hover transition-all flex flex-col gap-sm border border-transparent hover:border-outline-variant/30">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined" data-icon="assignment">assignment</span>
                </div>
                <span className="text-label-sm font-label-sm text-secondary bg-secondary-container/20 px-sm py-xs rounded-full">All time</span>
              </div>
              <div>
                <p className="font-label-md text-label-md text-on-surface-variant">Total Applications</p>
                <h3 className="font-h1 text-h1 text-on-surface">{total}</h3>
              </div>
            </div>
            {/* Active Interviews */}
            <div className="bg-white p-md rounded-xl shadow-resting hover:shadow-hover transition-all flex flex-col gap-sm border border-transparent hover:border-outline-variant/30">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-tertiary-fixed/30 flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined" data-icon="groups">groups</span>
                </div>
                {interviews > 0 && <span className="text-label-sm font-label-sm text-tertiary bg-tertiary-fixed/40 px-sm py-xs rounded-full">{interviews} pending</span>}
              </div>
              <div>
                <p className="font-label-md text-label-md text-on-surface-variant">Active Interviews</p>
                <h3 className="font-h1 text-h1 text-on-surface">{interviews}</h3>
              </div>
            </div>
            {/* Offers Received */}
            <div className="bg-white p-md rounded-xl shadow-resting hover:shadow-hover transition-all flex flex-col gap-sm border border-transparent hover:border-outline-variant/30">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-secondary-container/20 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined" data-icon="celebration">celebration</span>
                </div>
                {offers > 0 && <span className="text-label-sm font-label-sm text-primary bg-primary-fixed/40 px-sm py-xs rounded-full">New milestone</span>}
              </div>
              <div>
                <p className="font-label-md text-label-md text-on-surface-variant">Offers Received</p>
                <h3 className="font-h1 text-h1 text-on-surface">{offers}</h3>
              </div>
            </div>
          </section>

          {/* Main Grid: Activity & Progress */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
            {/* Recent Activity Feed */}
            <div className="lg:col-span-8 bg-white p-md lg:p-lg rounded-xl shadow-resting space-y-lg">
              <div className="flex items-center justify-between">
                <h4 className="font-h3 text-h3 text-on-surface">Recent Activity</h4>
                <Link to="/applications" className="text-primary font-label-md hover:underline decoration-2 underline-offset-4">View All</Link>
              </div>
              <div className="space-y-md">
                {recent.length === 0 ? (
                  <p className="text-on-surface-variant text-center py-8">No recent activity found.</p>
                ) : recent.map((app, i) => (
                  <div key={app._id} className="flex gap-md group">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center z-10">
                        <span className="material-symbols-outlined text-primary text-[20px]" data-icon="corporate_fare">corporate_fare</span>
                      </div>
                      {i !== recent.length - 1 && <div className="w-[2px] h-full bg-outline-variant/30 mt-xs"></div>}
                    </div>
                    <div className="flex-grow pb-md border-b border-outline-variant/30 group-last:border-none">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-label-md text-label-md text-on-surface">Update for <span className="font-bold text-primary">{app.company}</span></p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{app.role} • {app.location}</p>
                        </div>
                        <span className="font-label-sm text-label-sm text-outline">{new Date(app.appliedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="mt-sm flex gap-xs">
                        <span className="px-sm py-xs bg-primary-fixed/20 text-on-primary-fixed-variant rounded-full text-[11px] font-semibold uppercase">{app.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Featured Insights */}
            <div className="lg:col-span-4 space-y-gutter">
              {/* Glassmorphism Stats Card */}
              <div className="relative overflow-hidden rounded-xl bg-primary text-on-primary p-lg shadow-xl">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-on-primary/10 rounded-full blur-2xl"></div>
                <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-on-primary/5 rounded-full blur-xl"></div>
                <div className="relative z-10 space-y-md">
                  <h5 className="font-h3 text-h3">Weekly Progress</h5>
                  <div className="flex items-end gap-base">
                    <span className="text-[40px] font-bold leading-none">{total > 0 ? Math.min(100, Math.round((recent.length / 5) * 100)) : 0}%</span>
                    <span className="font-label-md text-on-primary/70 mb-1">Activity Goal</span>
                  </div>
                  <div className="w-full bg-on-primary/20 h-2 rounded-full overflow-hidden">
                    <div className="bg-on-primary h-full rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all" style={{width: `${total > 0 ? Math.min(100, Math.round((recent.length / 5) * 100)) : 0}%`}}></div>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-primary/80">Stay active to increase your chances. Aim for 5 applications a week!</p>
                </div>
              </div>

              {/* Upcoming Deadlines (Static for now) */}
              <div className="bg-surface-container-lowest p-md rounded-xl shadow-sm border-2 border-dashed border-outline-variant/50">
                <div className="flex items-center gap-sm text-error mb-sm">
                  <span className="material-symbols-outlined" data-icon="priority_high">priority_high</span>
                  <h4 className="font-label-md text-label-md">Next Actions</h4>
                </div>
                {interviews > 0 ? (
                  <ul className="space-y-base">
                    {apps.filter(a => a.status === "interview").slice(0, 2).map(app => (
                      <li key={app._id} className="flex justify-between items-center text-body-sm font-body-sm text-on-surface">
                        <span>Interview Prep - {app.company}</span>
                        <span className="font-bold text-primary cursor-pointer hover:underline" onClick={() => navigate(`/applications/${app._id}`)}>View</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-body-sm text-on-surface-variant">No immediate actions required.</p>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Floating Action Button for Mobile */}
      <Link to="/add" className="md:hidden fixed bottom-md right-md w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center z-50 hover:scale-90 transition-transform">
        <span className="material-symbols-outlined text-[32px]" data-icon="add">add</span>
      </Link>
    </div>
  );
}
