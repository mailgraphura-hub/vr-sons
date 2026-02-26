// import { useNavigate } from "react-router-dom";
// import { postService } from "../../service/axios";
// import { Toaster, toast } from "react-hot-toast";

// export default function Header() {

//   const navigate = useNavigate();
//   const signout = async () => {
//     const apiResponse = await postService("/signout");

//     if (!apiResponse.ok) {
//       console.log(apiResponse.message)
//       toast.error("Signout Failed");
//       return
//     }

//     toast.success("Signout");
//     localStorage.clear();

//     setTimeout(() => {
//       navigate("/")
//     }, 1000)
//   }

//   return (
//     <header className="bg-white shadow px-6 py-4 flex justify-between">
//       <Toaster />
//       <h2 className="font-semibold text-gray-700">
//         Import Export Admin
//       </h2>

//       <button
//         onClick={signout}
//         className="text-red-600 font-medium"
//       >
//         Logout
//       </button>
//     </header>
//   );
// }







// import { useNavigate } from "react-router-dom";
// import { postService } from "../../service/axios";
// import { Toaster, toast } from "react-hot-toast";

// export default function Header() {

//   const navigate = useNavigate();
//   const signout = async () => {
//     const apiResponse = await postService("/signout");

//     if (!apiResponse.ok) {
//       console.log(apiResponse.message)
//       toast.error("Signout Failed");
//       return
//     }

//     toast.success("Signout");
//     localStorage.clear();

//     setTimeout(() => {
//       navigate("/")
//     }, 1000)
//   }

//   return (
//     <header className="bg-white shadow px-6 py-4 flex justify-between">
//       <Toaster />
//       <h2 className="font-semibold text-gray-700">
//         Import Export Admin
//       </h2>

//       <button
//         onClick={signout}
//         className="text-red-600 font-medium"
//       >
//         Logout
//       </button>
//     </header>
//   );
// }






















// import { useState, useEffect } from "react";
// import { getService } from "../../service/axios";
// import { User, ChevronDown } from "lucide-react";

// export default function Header() {
//   const [admin, setAdmin] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await getService("/myprofile");
//         // Backend handle: new ApiResponse(200, userDetail, "Successful")
//         if (response.status === 200) {
//           setAdmin(response.data);
//         }
//       } catch (error) {
//         console.error("Profile Fetch Error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   return (
//     <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
      
//       {/* Left: Branding */}
//       <div className="flex flex-col">
//         <h2 className="text-xl font-extrabold text-gray-800 tracking-tight leading-none">
//           IMPORT<span className="text-blue-600 font-medium tracking-normal ml-1 text-lg">EXPORT</span>
//         </h2>
//         <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
//           Management Console
//         </span>
//       </div>

//       {/* Right: User Profile Only */}
//       <div className="flex items-center gap-4 group cursor-pointer hover:bg-gray-50 p-1 pr-3 rounded-full transition-all duration-200 border border-transparent hover:border-gray-100">
        
//         <div className="relative">
//           {/* Profile Image Logic */}
//           <div className="h-11 w-11 rounded-full border-2 border-white ring-2 ring-blue-50 overflow-hidden bg-blue-50 flex items-center justify-center shadow-sm">
//             {admin?.profileImage ? (
//               <img 
//                 src={admin.profileImage} 
//                 alt={admin?.name} 
//                 className="h-full w-full object-cover"
//               />
//             ) : (
//               <User size={22} className="text-blue-400" />
//             )}
//           </div>
          
//           {/* Green Status Indicator */}
//           <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
//         </div>

//         <div className="flex flex-col text-left">
//           <span className="text-sm font-bold text-gray-800 leading-none">
//             {loading ? "Fetching..." : admin?.name}
//           </span>
//           <span className="text-[11px] text-gray-400 font-semibold mt-0.5">
//             Admin Account
//           </span>
//         </div>

//         <ChevronDown size={16} className="text-gray-300 group-hover:text-blue-500 transition-colors ml-1" />
//       </div>
//     </header>
//   );
// }





































import { useState, useEffect } from "react";
import { getService } from "../../service/axios";
import { User } from "lucide-react";

export default function Header() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getService("/admin/auth/myprofile");
        
        if (response.ok) {
          // Backend data access: response.data (Axios) -> data (ApiResponse)
          setAdmin(response.data.data);
        }
      } catch (error) {
        console.error("Profile Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
      
      {/* Left Side: Branding */}
      <div className="flex flex-col">
        <h2 className="text-xl font-extrabold text-gray-800 tracking-tight leading-none">
          IMPORT<span className="text-blue-600 font-medium tracking-normal ml-1 text-lg">EXPORT</span>
        </h2>
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
          Management Console
        </span>
      </div>

      {/* Right Side: Profile Info (Non-clickable style) */}
      <div className="flex items-center gap-4 p-1 pr-4 rounded-full border border-gray-50 bg-gray-50/50">
        
        <div className="relative">
          {/* Avatar Logic */}
          <div className="h-11 w-11 rounded-full border-2 border-white ring-2 ring-blue-50 overflow-hidden bg-white flex items-center justify-center shadow-sm">
            {admin?.profileImage ? (
              <img 
                src={admin.profileImage} 
                alt={admin?.name} 
                className="h-full w-full object-cover"
              />
            ) : (
              <User size={22} className="text-blue-400" />
            )}
          </div>
          
          {/* Status Dot */}
          <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
        </div>

        {/* User Info */}
        <div className="flex flex-col text-left">
          <span className="text-sm font-bold text-gray-800 leading-none">
            {loading ? "Fetching..." : (admin?.name || "Admin")}
          </span>
          <span className="text-[11px] text-gray-400 font-semibold mt-1 uppercase tracking-wider">
            Super Admin
          </span>
        </div>
      </div>
    </header>
  );
}