import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", icon: "📊" },
  { to: "/applications", label: "Applications", icon: "📋" },
  { to: "/add", label: "Add New", icon: "➕" },
];

export default function AppLayout() {
  return (
    <div className="app-layout">
      {/* ── Sidebar ──────────────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">JobFlow</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `nav-link ${isActive ? "nav-link--active" : ""}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <NavLink to="/login" className="btn btn-ghost btn-full">
            Sign Out
          </NavLink>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────── */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
