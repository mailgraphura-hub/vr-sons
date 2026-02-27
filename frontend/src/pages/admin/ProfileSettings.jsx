import React, { useState, useEffect, useRef } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { User, Loader2, Mail, Camera, ShieldCheck } from "lucide-react";
import { getService, putService } from "../../service/axios";
import { toast, Toaster } from "react-hot-toast";

/* ── Brand tokens — same as Inquiries page ──────────────────────────────── */
const T = {
  primary:     "#c36a4d",
  primaryHov:  "#ad5d42",
  primaryDark: "#8f4c35",
  tint10:      "#fdf3f0",
  tint20:      "#fae4dc",
  tint40:      "#f0bfb0",
  border:      "#f2e0da",
  muted:       "#a17060",
  mutedLight:  "#b09080",
};

export default function ProfileSettings() {
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    name: "", email: "", profileImage: "", role: "Administrator",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl]     = useState("");
  const [loading, setLoading]           = useState(true);
  const [updating, setUpdating]         = useState(false);

  /* ── API — completely untouched ─────────────────────────────────────── */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getService("/admin/auth/myprofile");
        if (response?.data?.data) {
          const userData = response.data.data;
          setProfile(userData);
          setPreviewUrl(userData.profileImage || "");
        }
      } catch { toast.error("Failed to load profile"); }
      finally { setLoading(false); }
    };
    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return toast.error("File size > 2MB");
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append("name",  profile.name);
      formData.append("email", profile.email);
      if (selectedFile) formData.append("profileImage", selectedFile);
      const response = await putService("/admin/auth/updateProfile", formData);
      if (response.ok) { toast.success("Profile Updated Successfully!"); setSelectedFile(null); }
      else toast.error(response.message || "Update failed");
    } catch { toast.error("Something went wrong"); }
    finally { setUpdating(false); }
  };
  /* ─────────────────────────────────────────────────────────────────── */

  if (loading) return (
    <AdminLayout>
      <div className="h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin" size={26} style={{ color: T.primary }} />
        <p className="text-[13px] font-medium" style={{ color: T.mutedLight }}>Loading profile...</p>
      </div>
    </AdminLayout>
  );

  const initials = profile.name?.charAt(0)?.toUpperCase() || "A";

  return (
    <AdminLayout>
      <Toaster position="top-right" />

      <div className="max-w-[860px] mx-auto space-y-5">

        {/* ── Heading ──────────────────────────────────────────────────── */}
        <div>
          <h1 className="text-[22px] font-bold tracking-tight" style={{ color: "#1a1a1a" }}>
            Profile Settings
          </h1>
          <p className="text-[13px] mt-0.5" style={{ color: T.mutedLight }}>
            Manage your account information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── Left: Avatar card ──────────────────────────────────────── */}
          <div
            className="rounded-2xl flex flex-col items-center gap-5 p-7 h-fit transition-shadow duration-200"
            style={{
              background: "white",
              border: `1px solid ${T.border}`,
              boxShadow: "0 1px 4px rgba(195,106,77,0.07)",
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 6px 24px rgba(195,106,77,0.13)`}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 1px 4px rgba(195,106,77,0.07)"}
          >
            {/* Avatar */}
            <div className="relative group">
              <div
                className="w-28 h-28 rounded-full overflow-hidden"
                style={{
                  border: `3px solid ${T.tint40}`,
                  boxShadow: `0 0 0 4px white, 0 0 0 6px ${T.border}`,
                }}
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-[32px] font-bold"
                    style={{ background: T.tint20, color: T.primary }}
                  >
                    {initials}
                  </div>
                )}
              </div>

              {/* Camera button */}
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0.5 right-0.5 h-8 w-8 rounded-full flex items-center justify-center
                           transition-all duration-150"
                style={{
                  background: T.primary,
                  border: "2.5px solid white",
                  boxShadow: `0 2px 8px rgba(195,106,77,0.35)`,
                  color: "white",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background   = T.primaryHov;
                  e.currentTarget.style.transform    = "scale(1.12)";
                  e.currentTarget.style.boxShadow    = `0 4px 14px rgba(195,106,77,0.5)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background  = T.primary;
                  e.currentTarget.style.transform   = "scale(1)";
                  e.currentTarget.style.boxShadow   = `0 2px 8px rgba(195,106,77,0.35)`;
                }}
              >
                <Camera size={14} />
              </button>

              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>

            {/* Name + role badge */}
            <div className="text-center">
              <p className="text-[15px] font-bold text-gray-900 capitalize leading-tight">
                {profile.name || "Admin"}
              </p>
              <span
                className="inline-block mt-1.5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-lg"
                style={{ background: T.tint20, color: T.primaryDark, border: `1px solid ${T.border}` }}
              >
                {profile.role || "Administrator"}
              </span>
            </div>

            {/* Divider */}
            <div className="w-full h-px" style={{ background: T.border }} />

            {/* Meta rows */}
            <div className="w-full space-y-2.5">
              <MetaRow icon={<Mail size={12} />} text={profile.email || "—"} accent={T.primary} bg={T.tint20} border={T.border} />
              <MetaRow icon={<ShieldCheck size={12} />} text="Verified Account" accent="#059669" bg="#ecfdf5" border="#a7f3d0" />
            </div>

            {/* Selected file hint */}
            {selectedFile && (
              <div
                className="w-full px-3 py-2 rounded-xl text-[12px] font-medium text-center truncate"
                style={{ background: T.tint10, border: `1px solid ${T.border}`, color: T.primaryDark }}
              >
                📎 {selectedFile.name}
              </div>
            )}
          </div>

          {/* ── Right: Form card ───────────────────────────────────────── */}
          <div
            className="lg:col-span-2 rounded-2xl overflow-hidden transition-shadow duration-200"
            style={{
              background: "white",
              border: `1px solid ${T.border}`,
              boxShadow: "0 1px 4px rgba(195,106,77,0.07)",
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 6px 24px rgba(195,106,77,0.13)`}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 1px 4px rgba(195,106,77,0.07)"}
          >
            {/* Card header */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ background: T.tint10, borderBottom: `1px solid ${T.border}` }}
            >
              <div>
                <h2 className="text-[14px] font-bold" style={{ color: T.primaryDark }}>Personal Information</h2>
                <p className="text-[12px] mt-0.5" style={{ color: T.mutedLight }}>Update your name and email address</p>
              </div>
              <div
                className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: T.tint20, border: `1px solid ${T.border}`, color: T.primary }}
              >
                <ShieldCheck size={15} />
              </div>
            </div>

            {/* Fields */}
            <div className="px-6 py-6 space-y-5">

              {/* Full name */}
              <FormField
                label="Full Name"
                icon={<User size={14} />}
                value={profile.name}
                onChange={(v) => setProfile({ ...profile, name: v })}
                placeholder="Your full name"
                type="text"
              />

              {/* Email */}
              <FormField
                label="Email Address"
                icon={<Mail size={14} />}
                value={profile.email}
                onChange={(v) => setProfile({ ...profile, email: v })}
                placeholder="your@email.com"
                type="email"
              />

              {/* Role — read only */}
              <div>
                <label
                  className="block text-[11px] font-bold uppercase tracking-widest mb-1.5"
                  style={{ color: T.muted }}
                >
                  Role
                </label>
                <div
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
                  style={{ background: T.tint10, border: `1px solid ${T.border}` }}
                >
                  <ShieldCheck size={14} style={{ color: T.primary }} className="shrink-0" />
                  <span className="text-[13.5px] font-semibold" style={{ color: T.primaryDark }}>
                    {profile.role || "Administrator"}
                  </span>
                  <span
                    className="ml-auto text-[10.5px] font-semibold px-2 py-0.5 rounded-md"
                    style={{ background: T.tint40, color: T.primaryDark }}
                  >
                    Read-only
                  </span>
                </div>
              </div>

            </div>

            {/* Card footer */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderTop: `1px solid ${T.border}`, background: T.tint10 }}
            >
              <p className="text-[12px]" style={{ color: T.mutedLight }}>
                Changes reflect immediately after saving
              </p>

              <SaveButton updating={updating} onClick={handleUpdate} />
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}

/* ── Meta row ──────────────────────────────────────────────────────────── */
function MetaRow({ icon, text, accent, bg, border }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: bg, border: `1px solid ${border}`, color: accent }}
      >
        {icon}
      </div>
      <span className="text-[12.5px] text-gray-500 truncate">{text}</span>
    </div>
  );
}

/* ── Form field with icon ──────────────────────────────────────────────── */
function FormField({ label, icon, value, onChange, placeholder, type }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        className="block text-[11px] font-bold uppercase tracking-widest mb-1.5"
        style={{ color: T.muted }}
      >
        {label}
      </label>
      <div className="relative">
        <div
          className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-150"
          style={{ color: focused ? T.primary : "#9ca3af" }}
        >
          {icon}
        </div>
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-[13.5px] text-gray-900 bg-white rounded-xl
                     placeholder-gray-400 outline-none transition-all duration-150"
          style={{
            border: focused ? `1.5px solid ${T.primary}` : "1.5px solid #e5e7eb",
            boxShadow: focused ? `0 0 0 3px ${T.tint20}` : "none",
          }}
        />
      </div>
    </div>
  );
}

/* ── Save button ───────────────────────────────────────────────────────── */
function SaveButton({ updating, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={updating}
      className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold text-white
                 rounded-xl transition-all duration-150 disabled:opacity-60"
      style={{
        background: updating ? T.tint40 : hov ? T.primaryHov : T.primary,
        boxShadow: hov && !updating ? `0 4px 14px rgba(195,106,77,0.38)` : `0 1px 4px rgba(195,106,77,0.18)`,
        color: updating ? T.primaryDark : "white",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {updating
        ? <><Loader2 size={14} className="animate-spin" /> Updating...</>
        : "Save Changes"
      }
    </button>
  );
}