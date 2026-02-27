import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  MessageSquare,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import logo from "../../assets/logo/TextLogo.png";
import { postService } from "../../service/axios";
import { Toaster, toast } from "react-hot-toast";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const signout = async () => {
    const apiResponse = await postService("/signout");
    if (!apiResponse.ok) {
      console.log(apiResponse.message);
      toast.error("Signout Failed");
      return;
    }
    toast.success("Signout");
    localStorage.clear();
    setTimeout(() => navigate("/"), 1000);
  };

  const navItem =
    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200";

  const activeStyle = "text-white shadow-sm";
  const normalStyle = "text-stone-500 hover:bg-orange-50 hover:text-stone-700";

  const links = [
    { to: "/user/dashboard",   icon: <LayoutDashboard size={18} />, label: "Dashboard"    },
    { to: "/user/myinquiries", icon: <MessageSquare size={18} />,   label: "My Inquiries" },
    { to: "/user/profile",     icon: <User size={18} />,            label: "Profile"      },
  ];

  return (
    <>
      <Toaster />

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-xl shadow-sm"
        style={{ backgroundColor: "#fff", border: "1px solid #e7e5e4" }}
        aria-label="Open menu"
      >
        <Menu size={20} color="#c97b5a" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/25 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 z-50 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
        style={{ backgroundColor: "#fffaf6", borderRight: "1px solid #ede0d4" }}
      >
        {/* Logo */}
        <div
          className="h-16 px-5 flex items-center justify-between flex-shrink-0"
          style={{ borderBottom: "1px solid #ede0d4" }}
        >
          <img src={logo} alt="Logo" className="h-8 max-w-[140px] object-contain" />
          <button
            onClick={() => setOpen(false)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-600 hover:bg-orange-50 transition"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Section Label */}
        <div className="px-5 pt-5 pb-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
            Main Menu
          </p>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-1">
          {links.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `${navItem} ${isActive ? activeStyle : normalStyle}`}
              style={({ isActive }) => isActive ? { backgroundColor: "#c97b5a" } : {}}
            >
              {icon}
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div
          className="px-3 py-4 flex-shrink-0"
          style={{ borderTop: "1px solid #ede0d4" }}
        >
          <button
            onClick={signout}
            className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium rounded-xl transition hover:bg-red-50 active:scale-95"
            style={{ color: "#c0392b" }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}