import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const getToken = () => localStorage.getItem("token");

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [draft, setDraft] = useState({
    name: "", phone: "", linkedin: "", bio: "", avatar: "",
  });

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
          name: data.name || "",
          phone: data.phone || "",
          linkedin: data.linkedin || "",
          bio: data.bio || "",
          avatar: data.avatar || "",
        });
      })
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be smaller than 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setDraft((d) => ({ ...d, avatar: reader.result }));
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => setDraft((d) => ({ ...d, avatar: "" }));

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Save failed."); return; }
      setProfile(data);
      localStorage.setItem("user", JSON.stringify({ name: data.name, email: data.email }));
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
      name: profile?.name || "",
      phone: profile?.phone || "",
      linkedin: profile?.linkedin || "",
      bio: profile?.bio || "",
      avatar: profile?.avatar || "",
    });
    setError(null);
    setEditing(false);
  };

  const displayAvatar = editing ? draft.avatar : profile?.avatar;
  const initials = (profile?.name || "?").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

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
          <Link to="/" className="flex items-center gap-sm py-sm px-md text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-primary-fixed font-label-md text-label-md hover:bg-surface-container-highest dark:hover:bg-surface-variant transition-all duration-200 rounded-r-full">
            <span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
            Dashboard
          </Link>
          <Link to="/applications" className="flex items-center gap-sm py-sm px-md text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-primary-fixed font-label-md text-label-md hover:bg-surface-container-highest dark:hover:bg-surface-variant transition-all duration-200 rounded-r-full">
            <span className="material-symbols-outlined" data-icon="description">description</span>
            Applications
          </Link>
          <Link to="/add" className="flex items-center gap-sm py-sm px-md text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-primary-fixed font-label-md text-label-md hover:bg-surface-container-highest dark:hover:bg-surface-variant transition-all duration-200 rounded-r-full">
            <span className="material-symbols-outlined" data-icon="add_circle">add_circle</span>
            Add New
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* TopAppBar Component */}
        <header className="bg-surface dark:bg-on-background shadow-sm docked full-width top-0 z-40 flex justify-between items-center w-full px-md h-xl max-w-full">
          <div className="flex items-center gap-md">
            <h1 className="font-h3 text-h3 font-semibold text-primary dark:text-primary-fixed md:hidden">JobFlow</h1>
            <h2 className="text-h3 font-h3 text-on-surface hidden md:block">My Profile</h2>
          </div>
          <div className="flex items-center gap-md">
            <Link to="/add" className="hidden lg:flex items-center gap-xs bg-primary text-on-primary py-xs px-md rounded-full font-label-md transition-all hover:opacity-90">
                New Application
            </Link>
            <div className="flex items-center gap-sm border-l border-outline-variant pl-md ml-xs">
              <Link to="/profile" title="View your profile" className="flex items-center gap-2 py-1.5 px-3 rounded-full border border-primary hover:bg-surface-container-high transition-all group bg-primary/5">
                <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                  {initials}
                </div>
                <span className="text-sm text-primary font-medium hidden sm:inline">
                  {profile.name}
                </span>
              </Link>
            </div>
          </div>
        </header>

        {/* Content Canvas */}
        <main className="p-md md:p-lg lg:p-xl max-w-[800px] mx-auto w-full space-y-xl overflow-y-auto">
          {success && (
            <div className="p-sm bg-tertiary-fixed/40 text-tertiary rounded-lg font-label-md flex items-center gap-xs border border-tertiary-fixed">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              Profile updated successfully!
            </div>
          )}
          {error && (
            <div className="p-sm bg-error-container text-error rounded-lg font-label-md border border-error-container/50">
              {error}
            </div>
          )}

          <div className="bg-white p-lg md:p-xl rounded-xl shadow-resting border border-outline-variant/30 flex flex-col gap-lg">
            
            {/* Header / Avatar area */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-lg pb-lg border-b border-outline-variant/30">
              <div className="relative group">
                {displayAvatar ? (
                  <img src={displayAvatar} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-surface-container-highest shadow-sm" />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-primary-container/20 border-4 border-surface-container-highest shadow-sm flex items-center justify-center text-primary text-4xl font-bold">
                    {initials}
                  </div>
                )}

                {editing && (
                  <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-xs">
                    <button onClick={() => fileInputRef.current?.click()} className="p-xs bg-white text-on-surface rounded-full shadow hover:bg-surface-container-high" title="Upload new photo">
                      <span className="material-symbols-outlined text-[18px]">upload</span>
                    </button>
                    {displayAvatar && (
                      <button onClick={removeAvatar} className="p-xs bg-error-container text-error rounded-full shadow hover:bg-error-container/80" title="Remove photo">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    )}
                  </div>
                )}
                <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleAvatarChange} />
              </div>

              <div className="flex-1 text-center md:text-left space-y-xs">
                {editing ? (
                  <>
                    <label className="font-label-sm text-outline block mb-xs">Full Name</label>
                    <input type="text" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="w-full px-sm py-xs bg-surface-bright border border-outline-variant rounded focus:ring-1 focus:ring-primary outline-none font-h2 text-h2" />
                  </>
                ) : (
                  <>
                    <h2 className="font-h1 text-h1 text-on-surface">{profile.name}</h2>
                    <p className="font-body-lg text-outline">{profile.email}</p>
                    {profile.linkedin && (
                      <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-xs mt-sm text-secondary hover:underline font-label-md">
                        <span className="material-symbols-outlined text-[16px]">link</span> LinkedIn Profile
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Details area */}
            <div className="space-y-md">
              <div className="flex items-center justify-between">
                <h3 className="font-h3 text-h3 text-on-surface">Personal Information</h3>
                {!editing && (
                  <button onClick={() => setEditing(true)} className="px-md py-sm rounded-full font-label-md text-primary border border-outline-variant hover:bg-surface-container-high transition-colors flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[18px]">edit</span> Edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div className="space-y-xs">
                  <label className="font-label-sm text-outline">Phone Number</label>
                  {editing ? (
                    <input type="tel" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} className="w-full px-sm py-xs bg-surface-bright border border-outline-variant rounded focus:ring-1 focus:ring-primary outline-none font-body-sm" placeholder="+1 (555) 000-0000" />
                  ) : (
                    <p className="font-body-lg text-on-surface">{profile.phone || "—"}</p>
                  )}
                </div>
                <div className="space-y-xs">
                  <label className="font-label-sm text-outline">LinkedIn URL</label>
                  {editing ? (
                    <input type="url" value={draft.linkedin} onChange={(e) => setDraft({ ...draft, linkedin: e.target.value })} className="w-full px-sm py-xs bg-surface-bright border border-outline-variant rounded focus:ring-1 focus:ring-primary outline-none font-body-sm" placeholder="https://linkedin.com/in/..." />
                  ) : (
                    <p className="font-body-lg text-on-surface truncate">{profile.linkedin || "—"}</p>
                  )}
                </div>
              </div>

              <div className="space-y-xs pt-sm">
                <label className="font-label-sm text-outline">Bio / Summary</label>
                {editing ? (
                  <textarea value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} rows={4} className="w-full px-sm py-xs bg-surface-bright border border-outline-variant rounded focus:ring-1 focus:ring-primary outline-none font-body-sm" placeholder="A brief professional summary..." />
                ) : (
                  <p className="font-body-sm text-on-surface-variant whitespace-pre-wrap">{profile.bio || "No bio added yet."}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            {editing && (
              <div className="flex justify-end gap-sm pt-lg border-t border-outline-variant/30">
                <button onClick={cancelEdit} disabled={saving} className="px-lg py-sm rounded-full font-label-md text-primary border border-outline-variant hover:bg-surface-container-high transition-colors">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving} className="px-lg py-sm rounded-full font-label-md bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container shadow-sm hover:shadow-hover transition-all disabled:opacity-50 flex items-center gap-xs">
                  {saving ? "Saving..." : <><span className="material-symbols-outlined text-[18px]">save</span> Save Profile</>}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
