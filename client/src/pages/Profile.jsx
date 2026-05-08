import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";

/* ─── helpers ──────────────────────────────────────────── */
const getToken = () => localStorage.getItem("token");

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  /* ── state ─────────────────────────────────────────────── */
  const [profile, setProfile]   = useState(null);
  const [editing, setEditing]   = useState(false);
  const [saving,  setSaving]    = useState(false);
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState(null);
  const [success, setSuccess]   = useState(false);

  /* draft fields shown while editing */
  const [draft, setDraft] = useState({
    name: "", phone: "", linkedin: "", bio: "", avatar: "",
  });

  /* ── fetch profile on mount ─────────────────────────────── */
  useEffect(() => {
    const token = getToken();
    if (!token) { navigate("/login"); return; }

    fetch("/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 401) { navigate("/login"); return null; }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        setProfile(data);
        setDraft({
          name:     data.name     || "",
          phone:    data.phone    || "",
          linkedin: data.linkedin || "",
          bio:      data.bio      || "",
          avatar:   data.avatar   || "",
        });
      })
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, [navigate]);

  /* ── avatar upload ──────────────────────────────────────── */
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // limit to ~2 MB
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be smaller than 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setDraft((d) => ({ ...d, avatar: reader.result }));
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => setDraft((d) => ({ ...d, avatar: "" }));

  /* ── save ───────────────────────────────────────────────── */
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type":  "application/json",
          Authorization:   `Bearer ${getToken()}`,
        },
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Save failed."); return; }
      setProfile(data);
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setDraft({
      name:     profile?.name     || "",
      phone:    profile?.phone    || "",
      linkedin: profile?.linkedin || "",
      bio:      profile?.bio      || "",
      avatar:   profile?.avatar   || "",
    });
    setError(null);
    setEditing(false);
  };

  /* ── derived ────────────────────────────────────────────── */
  const displayAvatar = editing ? draft.avatar : profile?.avatar;
  const initials = (profile?.name || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  /* ── render ─────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="app-layout">
        <ProfileSidebar profile={profile} />
        <main className="main-content">
          <div className="profile-loading">
            <div className="profile-spinner" />
            <p>Loading profile…</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <ProfileSidebar profile={profile} />

      <main className="main-content">
        <div className="page-container">

          {/* ── Page header ─────────────────────────────────── */}
          <div className="page-header">
            <div>
              <h1>My Profile</h1>
              <p className="page-subtitle">Manage your personal information</p>
            </div>

            {/* LinkedIn quick-link — top-right */}
            {profile?.linkedin && !editing && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-linkedin"
                id="linkedin-link"
              >
                <svg className="btn-li-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            )}
          </div>

          {/* ── Success / Error banners ──────────────────────── */}
          {success && (
            <div className="profile-banner profile-banner--success">
              ✅ Profile updated successfully!
            </div>
          )}
          {error && (
            <div className="profile-banner profile-banner--error">
              ⚠️ {error}
            </div>
          )}

          {/* ── Avatar card ─────────────────────────────────── */}
          <div className="card profile-avatar-card">
            <div className="profile-avatar-area">
              {/* Avatar image or initials */}
              <div className="profile-avatar-wrap">
                {displayAvatar ? (
                  <img
                    src={displayAvatar}
                    alt="Profile"
                    className="profile-avatar-img"
                    id="profile-avatar-img"
                  />
                ) : (
                  <div className="profile-avatar-placeholder" id="profile-avatar-placeholder">
                    {initials}
                  </div>
                )}

                {/* Edit-mode overlay */}
                {editing && (
                  <button
                    className="profile-avatar-overlay"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload photo"
                    id="upload-avatar-btn"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                    <span>Change photo</span>
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="avatar-file-input"
                onChange={handleAvatarChange}
              />

              {/* Avatar action buttons */}
              <div className="profile-avatar-actions">
                <div className="profile-name-display">
                  <h2>{profile?.name}</h2>
                  <p className="page-subtitle">{profile?.email}</p>
                </div>
                {editing && (
                  <div className="profile-avatar-btns">
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => fileInputRef.current?.click()}
                      id="change-photo-btn"
                    >
                      📷 Upload Photo
                    </button>
                    {draft.avatar && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={removeAvatar}
                        id="remove-photo-btn"
                      >
                        🗑 Remove
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Edit / Save buttons */}
              <div className="profile-header-actions">
                {!editing ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => setEditing(true)}
                    id="edit-profile-btn"
                  >
                    ✏️ Edit Profile
                  </button>
                ) : (
                  <div className="form-actions">
                    <button className="btn btn-ghost" onClick={cancelEdit} id="cancel-edit-btn">
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handleSave}
                      disabled={saving}
                      id="save-profile-btn"
                    >
                      {saving ? "Saving…" : "💾 Save Changes"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Details card ─────────────────────────────────── */}
          <div className="card profile-details-card">
            <h3 className="profile-section-title">Personal Information</h3>

            <div className="profile-fields">
              {/* Full Name */}
              <div className="profile-field">
                <label className="profile-field-label">
                  <span className="profile-field-icon">👤</span> Full Name
                </label>
                {editing ? (
                  <input
                    id="field-name"
                    className="input"
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    placeholder="Your full name"
                  />
                ) : (
                  <p className="profile-field-value">{profile?.name || "—"}</p>
                )}
              </div>

              {/* Email (read-only) */}
              <div className="profile-field">
                <label className="profile-field-label">
                  <span className="profile-field-icon">✉️</span> Email Address
                </label>
                <p className="profile-field-value profile-field-value--muted">
                  {profile?.email}
                  <span className="profile-badge">read-only</span>
                </p>
              </div>

              {/* Phone */}
              <div className="profile-field">
                <label className="profile-field-label">
                  <span className="profile-field-icon">📞</span> Phone Number
                </label>
                {editing ? (
                  <input
                    id="field-phone"
                    className="input"
                    type="tel"
                    value={draft.phone}
                    onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                  />
                ) : (
                  <p className="profile-field-value">
                    {profile?.phone || <span className="profile-empty">Not added yet</span>}
                  </p>
                )}
              </div>

              {/* LinkedIn */}
              <div className="profile-field">
                <label className="profile-field-label">
                  <span className="profile-field-icon">
                    <svg style={{width:14,height:14,verticalAlign:"middle"}} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </span>{" "}
                  LinkedIn Profile URL
                </label>
                {editing ? (
                  <input
                    id="field-linkedin"
                    className="input"
                    type="url"
                    value={draft.linkedin}
                    onChange={(e) => setDraft({ ...draft, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/yourname"
                  />
                ) : (
                  <p className="profile-field-value">
                    {profile?.linkedin ? (
                      <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="profile-link"
                      >
                        {profile.linkedin}
                      </a>
                    ) : (
                      <span className="profile-empty">Not added yet</span>
                    )}
                  </p>
                )}
              </div>

              {/* Bio */}
              <div className="profile-field profile-field--full">
                <label className="profile-field-label">
                  <span className="profile-field-icon">📝</span> About / Bio
                </label>
                {editing ? (
                  <textarea
                    id="field-bio"
                    className="input textarea"
                    value={draft.bio}
                    onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                    placeholder="Tell us a little about yourself…"
                    rows={4}
                  />
                ) : (
                  <p className="profile-field-value profile-field-value--bio">
                    {profile?.bio || <span className="profile-empty">No bio added yet</span>}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Member since ─────────────────────────────────── */}
          <p className="profile-member-since">
            Member since{" "}
            {profile?.createdAt
              ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                  month: "long", day: "numeric", year: "numeric",
                })
              : "—"}
          </p>

        </div>
      </main>
    </div>
  );
}

/* ── Sidebar extracted so Profile page owns its own layout ── */
function ProfileSidebar({ profile }) {
  const navigate = useNavigate();

  const navItems = [
    { to: "/",            label: "Dashboard",    icon: "📊" },
    { to: "/applications",label: "Applications", icon: "📋" },
    { to: "/add",         label: "Add New",      icon: "➕" },
    { to: "/profile",     label: "Profile",      icon: "👤" },
  ];

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const initials = (profile?.name || "?")
    .split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
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
        {/* Mini profile chip */}
        <NavLink to="/profile" className="sidebar-profile-chip">
          {profile?.avatar ? (
            <img src={profile.avatar} alt="" className="sidebar-chip-avatar" />
          ) : (
            <div className="sidebar-chip-initials">{initials}</div>
          )}
          <div className="sidebar-chip-info">
            <span className="sidebar-chip-name">{profile?.name || "User"}</span>
            <span className="sidebar-chip-email">{profile?.email || ""}</span>
          </div>
        </NavLink>

        <button
          onClick={handleSignOut}
          className="btn btn-ghost btn-full"
          id="sign-out-btn"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
