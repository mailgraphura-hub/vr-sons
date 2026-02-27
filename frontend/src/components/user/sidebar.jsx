import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Settings,
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

    if(!apiResponse.ok){
      console.log(apiResponse.message)
      toast.error("Signout Failed");
      return
    }

    toast.success("Signout");
    localStorage.clear();

    setTimeout(() => {
      navigate("/")
    }, 1000)
  }

  const navItem =
    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200";

  const activeStyle = "bg-gray-100 text-black border-l-4 border-black";

  const normalStyle = "text-gray-600 hover:bg-gray-50";

  return (
    <>

    <Toaster/>
      {/* Mobile Toggle */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 bg-white p-2 rounded-lg shadow"
      >
        <Menu size={22} />
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-50
        flex flex-col
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        {/* Logo Section */}
        <div className="h-16 pl-20 px-6 flex items-center justify-between border-b border-gray-200">
          <img src={logo} alt="Logo" className="h-8" />
          <button onClick={() => setOpen(false)} className="md:hidden">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex flex-col justify-between flex-1 p-4">
          {/* Top Menu */}
          <div className="flex flex-col gap-1">
            <NavLink
              to="/user/dashboard"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `${navItem} ${isActive ? activeStyle : normalStyle}`
              }
            >
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>

            <NavLink
              to="/user/myinquiries"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `${navItem} ${isActive ? activeStyle : normalStyle}`
              }
            >
              <MessageSquare size={18} />
              My Inquiries
            </NavLink>

            {/* <NavLink
              to="/user/profile"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `${navItem} ${isActive ? activeStyle : normalStyle}`
              }
            >
              <User size={18} />
              Profile
            </NavLink> */}

            {/* Settings moved UP */}
            <NavLink
              to="/user/settings"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `${navItem} ${isActive ? activeStyle : normalStyle}`
              }
            >
              <User size={18} />
              Profile
            </NavLink>
          </div>

          {/* Bottom Section */}
          <div className="pt-4 border-t border-gray-200" onClick={signout}>
            <button  className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-red-600 hover:bg-gray-50 rounded-lg transition">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
