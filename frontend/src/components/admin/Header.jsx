import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom"; 
import { Bell, UserCircle, ChevronRight } from "lucide-react"; 
import { getService } from "../../service/axios";

export default function Header() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const renderBreadcrumbs = () => {
    const path = location.pathname;
    if (path.includes("dashboard")) return "Dashboard";

    // Path segments nikalna
    const segments = path.split("/").filter((p) => p !== "" && p !== "admin");
    
    // Mapping for clean display names
    const nameMap = {
      "categories": "Categories",
      "sub-categories": "Categories", // Main heading for sub-cats
      "products": "Products",
      "promotion": "Promotion",
      "settings": "Settings",
      "managPromotion": "Promotion Manager",
      "blogs": "Blogs",
      "profile": "Profile"
    };

    const breadcrumbs = [];

    // Logic: Agar sub-category ya specific page hai, toh parent bhi add karo
    if (path.includes("sub-categories")) {
      breadcrumbs.push("Categories", "Sub Categories");
    } else if (path.includes("categories")) {
      breadcrumbs.push("Categories", "All Categories");
    } else if (path.includes("products")) {
      breadcrumbs.push("Products", "Management");
    } else if (path.includes("promotion/blogs")) {
      breadcrumbs.push("Promotion", "Blogs");
    } else if (path.includes("promotion/managPromotion")) {
      breadcrumbs.push("Promotion", "Manager");
    } else if (path.includes("settings/profile")) {
      breadcrumbs.push("Settings", "Profile");
    } else {
      // Fallback for single levels like /admin/inquiries
      segments.forEach(s => breadcrumbs.push(nameMap[s] || s.charAt(0).toUpperCase() + s.slice(1)));
    }

    return (
      <div className="flex items-center gap-2">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <div key={index} className="flex items-center gap-2">
              <span className={`${isLast ? "text-gray-800 font-bold" : "text-gray-400 font-medium"}`}>
                {crumb}
              </span>
              {!isLast && <ChevronRight size={14} className="text-gray-300" />}
            </div>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getService("/admin/auth/myprofile");
        if (response?.data?.data) {
          setAdmin(response.data.data);
        }
      } catch (error) {
        console.error("Profile Fetch Error:", error);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      <div className="flex items-center">
        <h2 className="text-xl tracking-tight">
          {renderBreadcrumbs()}
        </h2>
      </div>

      <div className="flex items-center gap-5">
        {/* <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
        </button> */}

        <div className="h-8 w-[1px] bg-gray-200"></div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right hidden sm:flex">
            {loading ? (
              <div className="h-4 w-20 bg-gray-100 animate-pulse rounded"></div>
            ) : (
              <>
                <span className="text-sm font-bold text-gray-800 capitalize leading-none">
                  {admin?.name || "Guest Admin"}
                </span>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-1">
                  {admin ? "Administrator" : "Not Logged In"}
                </span>
              </>
            )}
          </div>

          <Link to="/admin/settings/profile" className="h-10 w-10 rounded-full overflow-hidden bg-gray-50 border border-gray-200 shadow-sm flex items-center justify-center hover:ring-2 hover:ring-gray-100 transition-all">
            {loading ? (
              <div className="w-full h-full animate-pulse bg-gray-200" />
            ) : admin?.profileImage ? (
              <img src={admin.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <UserCircle size={28} className="text-gray-400" />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}