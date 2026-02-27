import { useState, useRef, useEffect } from "react";
import Sidebar from "../../components/user/sidebar";
import Header from "../../components/user/Header";
import { putService } from "../../service/axios";
import { userProfile } from "../../context/profileContext";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ d, d2, className = "w-4 h-4 text-gray-400" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={d} />
    {d2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={d2} />}
  </svg>
);

const UserIcon = ({ className }) => <Icon className={className} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />;
const MailIcon = ({ className }) => <Icon className={className} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />;
const PhoneIcon = ({ className }) => <Icon className={className} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />;
const CalendarIcon = ({ className }) => <Icon className={className} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />;
const GlobeIcon = ({ className }) => <Icon className={className} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
const MapPinIcon = ({ className }) => <Icon className={className} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" d2="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />;
const ShieldIcon = ({ className = "w-4 h-4 text-gray-400" }) => <Icon className={className} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />;

const CameraIcon = () => (
  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// ─── Reusable Field ───────────────────────────────────────────────────────────
const Field = ({ icon, label, name, value, onChange, type = "text", placeholder, isEditing, readOnly, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">{label}</label>
    {isEditing && !readOnly ? (
      children ?? (
        <div className="flex items-center gap-2.5 bg-white border border-[#e0cdc4] rounded-xl px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-[#c97b5a]/40 focus-within:border-[#c97b5a] transition-all duration-200 shadow-sm">
          <span className="flex-shrink-0">{icon}</span>
          <input
            type={type} name={name} value={value || ""} onChange={onChange} placeholder={placeholder}
            className="flex-1 min-w-0 text-sm text-gray-800 bg-transparent outline-none placeholder-gray-300"
          />
        </div>
      )
    ) : (
      <div className="flex items-center gap-2.5 bg-white/80 border border-[#ede0d8] rounded-xl px-3.5 py-2.5 shadow-sm hover:border-[#d9c4b8] transition-colors duration-150">
        <span className="flex-shrink-0">{icon}</span>
        <span className="flex-1 min-w-0 text-sm font-medium text-gray-700 truncate">{value || "—"}</span>
        {readOnly && (
          <span className="flex-shrink-0 text-[9px] font-bold tracking-wide uppercase bg-[#fdf0ea] text-[#c97b5a] border border-[#f0d8cc] px-2 py-0.5 rounded-full">
            Read-only
          </span>
        )}
      </div>
    )}
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Profile() {
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = userProfile();

  useEffect(() => {
    if (!localStorage.getItem("access")) navigate("/login");
  }, [navigate]);

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setUser({ ...user, profileImage: URL.createObjectURL(file) });
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      const fd = new FormData();
      ["contact", "gender", "dob", "country", "state"].forEach(k => fd.append(k, user[k] || ""));
      if (selectedFile) fd.append("profileImage", selectedFile);

      const res = await putService("/customer/auth/updateProfile", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!res.ok) { toast.error(res?.message || "Update failed"); return; }
      toast.success("Profile updated successfully!");
      setUser(res.data.data);
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })
    : "—";

  if (!user) return (
    <div className="flex items-center justify-center min-h-screen bg-[#f2e9e2]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-[3px] border-[#c97b5a] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[#c97b5a] font-medium">Loading profile…</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#ede8e3]">
      <Toaster />
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 min-h-screen md:ml-5 overflow-hidden">
        <Header />

        <main className="flex flex-col flex-1 overflow-y-auto pt-16 w-full">
          <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

            {/* ── Page heading ── */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Profile Settings
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Manage your personal account information
              </p>
            </div>

            {/* ── Two-column grid — stacks on mobile ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5 sm:gap-6 items-start">

              {/* ══════════ LEFT: Identity Card ══════════ */}
              <div className="rounded-2xl sm:rounded-3xl border border-[#e2d5cc] shadow-md overflow-hidden"
                style={{ background: "linear-gradient(160deg, #fff8f5 0%, #fdf0ea 100%)" }}>

                {/* Gradient banner */}
                <div className="relative h-24 sm:h-28 overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #e8c5b0 0%, #d4916a 50%, #c97b5a 100%)" }}>
                  {/* Decorative circles */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20 bg-white" />
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full opacity-10 bg-white" />
                </div>

                <div className="px-6 sm:px-8 pb-8 sm:pb-10 -mt-12 sm:-mt-14 flex flex-col items-center text-center">
                  {/* Avatar */}
                  <div className="relative mb-4">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-[5px] border-white shadow-xl ring-4 ring-[#f3dfd4]">
                      {user?.profileImage ? (
                        <img src={user.profileImage} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold"
                          style={{ background: "linear-gradient(135deg, #c97b5a, #a85a3a)" }}>
                          {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="absolute bottom-1 right-1 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-lg transition-all duration-150 active:scale-95"
                      style={{ background: "linear-gradient(135deg, #d4895e, #c97b5a)" }}
                      title="Change photo"
                    >
                      <CameraIcon />
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </div>

                  {/* Name */}
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                    {user?.name}
                  </h2>

                  {/* Role badge */}
                  <span className="mt-2 inline-flex items-center text-[9px] sm:text-[10px] font-bold tracking-widest uppercase px-3 sm:px-4 py-1 rounded-full border"
                    style={{ background: "linear-gradient(135deg, #fdf0ea, #fae5d8)", color: "#b5613e", borderColor: "#f0c8b0" }}>
                    {user?.role || "Customer"}
                  </span>

                  {/* Divider */}
                  <div className="w-full mt-6 pt-5 border-t border-[#f0ddd5] space-y-3">
                    {[
                      { icon: <MailIcon className="w-3.5 h-3.5 text-[#c97b5a]" />, bg: "#fff4ef", text: user?.email },
                      { icon: <ShieldIcon className="w-3.5 h-3.5 text-emerald-500" />, bg: "#f0fdf4", text: "Verified Account" },
                      { icon: <CalendarIcon className="w-3.5 h-3.5 text-[#c97b5a]" />, bg: "#fff4ef", text: `Since ${formattedDate}` },
                    ].map(({ icon, bg, text }, i) => (
                      <div key={i} className="flex items-center gap-3 text-left">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-white/80"
                          style={{ background: bg }}>
                          {icon}
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500 truncate">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ══════════ RIGHT: Form Card ══════════ */}
              <div className="rounded-2xl sm:rounded-3xl border border-[#e2d5cc] shadow-md overflow-hidden bg-white">

                {/* Card header */}
                <div className="flex items-center justify-between px-5 sm:px-7 py-4 sm:py-5 border-b border-[#f0e5de]"
                  style={{ background: "linear-gradient(135deg, #fdf8f5 0%, #faf0eb 100%)" }}>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">Personal Information</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Update your name and personal details</p>
                  </div>
                  <div className="w-9 h-9 rounded-full border border-[#f0c8b0] flex items-center justify-center flex-shrink-0 shadow-sm"
                    style={{ background: "linear-gradient(135deg, #fdf0ea, #fae5d8)" }}>
                    <ShieldIcon className="w-4 h-4 text-[#c97b5a]" />
                  </div>
                </div>

                {/* Fields grid */}
                <div className="px-5 sm:px-7 py-5 sm:py-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">

                  <Field icon={<UserIcon className="w-4 h-4 text-gray-400" />}
                    label="Full Name" name="name" value={user?.name}
                    onChange={handleChange} isEditing={isEditing} placeholder="Full name" />

                  <Field icon={<MailIcon className="w-4 h-4 text-gray-400" />}
                    label="Email Address" value={user?.email}
                    isEditing={false} readOnly />

                  {/* Mobile — +91 prefix */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Mobile Number</label>
                    {isEditing ? (
                      <div className="flex items-center gap-2 bg-white border border-[#e0cdc4] rounded-xl px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-[#c97b5a]/40 focus-within:border-[#c97b5a] transition-all shadow-sm">
                        <PhoneIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm font-semibold text-gray-300 flex-shrink-0">+91</span>
                        <input type="tel" name="contact" value={user?.contact || ""} onChange={handleChange}
                          placeholder="10-digit number"
                          className="flex-1 min-w-0 text-sm text-gray-800 bg-transparent outline-none placeholder-gray-300" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5 bg-white/80 border border-[#ede0d8] rounded-xl px-3.5 py-2.5 shadow-sm hover:border-[#d9c4b8] transition-colors">
                        <PhoneIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-700">+91 {user?.contact || "—"}</span>
                      </div>
                    )}
                  </div>

                  {/* Gender — select */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Gender</label>
                    {isEditing ? (
                      <div className="flex items-center gap-2 bg-white border border-[#e0cdc4] rounded-xl px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-[#c97b5a]/40 focus-within:border-[#c97b5a] transition-all shadow-sm">
                        <UserIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <select name="gender" value={user?.gender || ""} onChange={handleChange}
                          className="flex-1 min-w-0 text-sm text-gray-800 bg-transparent outline-none appearance-none cursor-pointer">
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5 bg-white/80 border border-[#ede0d8] rounded-xl px-3.5 py-2.5 shadow-sm hover:border-[#d9c4b8] transition-colors">
                        <UserIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-700">{user?.gender || "—"}</span>
                      </div>
                    )}
                  </div>

                  <Field icon={<CalendarIcon className="w-4 h-4 text-gray-400" />}
                    label="Date of Birth" name="dob" type="date"
                    value={user?.dob} onChange={handleChange} isEditing={isEditing} />

                  <Field icon={<MapPinIcon className="w-4 h-4 text-gray-400" />}
                    label="State" name="state" value={user?.state}
                    onChange={handleChange} isEditing={isEditing} placeholder="State" />

                  <Field icon={<GlobeIcon className="w-4 h-4 text-gray-400" />}
                    label="Country" name="country" value={user?.country}
                    onChange={handleChange} isEditing={isEditing} placeholder="Country" />

                  <Field icon={<ShieldIcon className="w-4 h-4 text-gray-400" />}
                    label="Role" value={user?.role || "Customer"}
                    isEditing={false} readOnly />
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 sm:px-7 py-4 sm:py-5 border-t border-[#f0e5de]"
                  style={{ background: "linear-gradient(135deg, #fdf8f5 0%, #faf0eb 100%)" }}>
                  <p className="text-xs text-gray-400">
                    {isEditing ? "Changes reflect immediately after saving." : "Click Edit Profile to update your information."}
                  </p>

                  <div className="flex gap-2.5 w-full sm:w-auto">
                    {!isEditing ? (
                      <button onClick={() => setIsEditing(true)}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md active:scale-[.97] transition-all duration-150"
                        style={{ background: "linear-gradient(135deg, #d4895e, #c97b5a)" }}>
                        Edit Profile
                      </button>
                    ) : (
                      <>
                        <button onClick={() => setIsEditing(false)}
                          className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-[#e0cdc4] text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 active:scale-[.97] transition-all duration-150 shadow-sm">
                          Cancel
                        </button>
                        <button onClick={updateProfile} disabled={loading}
                          className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md active:scale-[.97] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ background: "linear-gradient(135deg, #d4895e, #c97b5a)" }}>
                          {loading ? (
                            <span className="flex items-center justify-center gap-2">
                              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Saving…
                            </span>
                          ) : "Save Changes"}
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}