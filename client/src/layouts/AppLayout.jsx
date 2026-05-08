import { NavLink, Outlet, useNavigate } from "react-router-dom";

const navItems = [
  { to: "/",             label: "Dashboard",    icon: "📊" },
  { to: "/applications", label: "Applications", icon: "📋" },
  { to: "/add",          label: "Add New",      icon: "➕" },
  { to: "/profile",      label: "Profile",      icon: "👤" },
];

export default function AppLayout() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

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
          <NavLink to="/profile" className="sidebar-profile-chip">
            <div className="sidebar-chip-initials">?</div>
            <div className="sidebar-chip-info">
              <span className="sidebar-chip-name">My Profile</span>
              <span className="sidebar-chip-email">View &amp; edit</span>
            </div>
          </NavLink>
          <button onClick={handleSignOut} className="btn btn-ghost btn-full" id="sign-out-btn">
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────── */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
