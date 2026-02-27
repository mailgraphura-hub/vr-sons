import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/user/sidebar";
import Header from "../../components/user/Header";
import { putService } from "../../service/axios";
import { userProfile } from "../../context/profileContext";
import { Camera, Mail, ShieldCheck, User } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export default function ProfileSettings() {
  const navigate = useNavigate();
  const { user, setUser } = userProfile();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Check login
  useEffect(() => {
    const access = localStorage.getItem("access");
    if (!access) navigate("/login");
  }, [navigate]);

  // Set user data
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // Save profile
  const handleSave = async () => {
    try {
      setLoading(true);

      const response = await putService("/customer/profile/update", {
        name,
        email,
      });

      if (!response?.ok) {
        toast.error("Failed to update profile");
        setLoading(false);
        return;
      }

      toast.success("Profile updated successfully!");
      setUser({ ...user, name, email });
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  // Avatar initials
  const initials = (user?.name || "A")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex bg-[#f4ece6] min-h-screen">
      <Toaster />

      <Sidebar />

      <div className="flex-1 md:ml-64 pt-24 px-4 md:px-10 pb-16">
        <Header />

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-800">
            Profile Settings
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            Manage your account information
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT CARD */}
          <div className="bg-[#f8f1ea] rounded-3xl p-8 flex flex-col items-center text-center border border-[#eadfd6] w-full lg:w-[300px]">

            {/* Avatar */}
            <div className="relative mb-4">
              <div className="w-28 h-28 rounded-full overflow-hidden flex items-center justify-center bg-[#efd8cc] text-[#b86b4b] border-4 border-[#f6ebe4] text-3xl font-bold">

                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials
                )}

              </div>

              <button className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-[#c97b5a] flex items-center justify-center shadow-md hover:scale-105 transition">
                <Camera size={15} className="text-white" />
              </button>
            </div>

            {/* Name */}
            <h2 className="text-lg font-bold text-stone-800 mt-1">
              {user?.name || "—"}
            </h2>

            {/* Role Badge */}
            <span className="mt-2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#efd8cc] text-[#b86b4b]">
              {user?.role || "User"}
            </span>

            {/* Divider */}
            <div className="w-full my-5 border-t border-[#eadfd6]" />

            {/* Email Row */}
            <div className="flex items-center gap-3 w-full px-1 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#fde8df]">
                <Mail size={14} className="text-[#c97b5a]" />
              </div>
              <span className="text-stone-500 text-sm truncate">
                {user?.email || "—"}
              </span>
            </div>

            {/* Verified Row */}
            <div className="flex items-center gap-3 w-full px-1">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#d1fae5]">
                <ShieldCheck size={14} className="text-[#059669]" />
              </div>
              <span className="text-stone-500 text-sm">
                Verified Account
              </span>
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="flex-1 bg-[#f8f1ea] rounded-3xl border border-[#eadfd6] overflow-hidden">

            {/* Header */}
            <div className="px-8 py-6 flex items-center justify-between bg-[#f1dfd5] border-b border-[#eadfd6]">
              <div>
                <h3 className="text-base font-bold text-stone-800">
                  Personal Information
                </h3>
                <p className="text-stone-400 text-sm mt-1">
                  Update your name and email address
                </p>
              </div>

              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#efd8cc]">
                <ShieldCheck size={16} className="text-[#b86b4b]" />
              </div>
            </div>

            {/* Form Fields */}
            <div className="px-8 py-7 flex flex-col gap-6">

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
                  Full Name
                </label>

                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-[#e6d8cf] bg-[#fdf8f4]">
                  <User size={16} className="text-[#c97b5a]" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="flex-1 bg-transparent text-stone-700 text-sm outline-none placeholder-stone-300"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
                  Email Address
                </label>

                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-[#e6d8cf] bg-[#fdf8f4]">
                  <Mail size={16} className="text-[#c97b5a]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 bg-transparent text-stone-700 text-sm outline-none placeholder-stone-300"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
                  Role
                </label>

                <div className="flex items-center justify-between px-4 py-3 rounded-2xl border border-[#e6d8cf] bg-[#f1dfd5]">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={16} className="text-[#b86b4b]" />
                    <span className="text-stone-700 text-sm font-semibold">
                      {user?.role || "User"}
                    </span>
                  </div>

                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#e7c9bb] text-[#b86b4b]">
                    Read-only
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 flex items-center justify-between border-t border-[#eadfd6] bg-[#fdf8f4]">
              <p className="text-stone-400 text-sm">
                Changes reflect immediately after saving
              </p>

              <button
                onClick={handleSave}
                disabled={loading}
                className="px-8 py-3 rounded-2xl bg-[#c36d4e] text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}