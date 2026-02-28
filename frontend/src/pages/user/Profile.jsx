// import { useState, useEffect } from "react";
// import Sidebar from "../../components/user/sidebar";
// import Header from "../../components/user/Header";
// import { useNavigate } from "react-router-dom";
// import { getService } from "../../service/axios";
// import { userProfile } from "../../context/profileContext";

// export default function Profile() {
//   const [twoFactor, setTwoFactor] = useState(true);
//   const navigate = useNavigate();

//   const { user } = userProfile();

//   useEffect(() => {
//       const access = localStorage.getItem("access")
//       if (!access) {
//         navigate("/login");
//       }
//     }, [navigate]);

//   // if (!user) {
//   //   return <div className="p-10">Loading...</div>;
//   // }

//   return (
//     <div className="flex bg-gray-50">
//       <Sidebar />

//       <div className="flex-1 md:ml-64 pt-24 px-4 md:px-8 min-h-screen pb-16">
//         <Header />

//         <div className="space-y-8">

//           {/* Profile Card */}
//           <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
//             <img
//               src={user.profileImage}
//               alt="Profile"
//               className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover"
//             />

//             <div className="text-center md:text-left">
//               <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
//                 {user.name}
//               </h2>

//               <p className="text-gray-500 text-sm mt-1">
//                 {user.email}
//                 {user.verified && (
//                   <span className="ml-2 text-green-600 font-medium text-sm">
//                     ✔ Verified
//                   </span>
//                 )}
//               </p>

//               <p className="text-sm text-gray-500 mt-2">
//                 {user.state}, {user.country}
//               </p>
//             </div>
//           </div>

//           {/* Personal Information */}
//           <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
//             <h3 className="text-lg font-semibold text-gray-800 mb-6">
//               Personal Information
//             </h3>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">

//               <div>
//                 <p className="text-gray-500">Phone</p>
//                 <p className="font-medium text-gray-800">{user.contact}</p>
//               </div>

//               <div>
//                 <p className="text-gray-500">Gender</p>
//                 <p className="font-medium text-gray-800">{user.gender}</p>
//               </div>

//               <div>
//                 <p className="text-gray-500">Date of Birth</p>
//                 <p className="font-medium text-gray-800">{user?.dob || ""}</p>
//               </div>

//               <div>
//                 <p className="text-gray-500">Account Type</p>
//                 <p className="font-medium text-gray-800">{user?.accountType || ""}</p>
//               </div>

//             </div>
//           </div>

//           {/* Activity Overview */}
//           <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
//             <h3 className="text-lg font-semibold text-gray-800 mb-6">
//               Activity Overview
//             </h3>

//             <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">

//               <div className="bg-gray-50 rounded-xl p-4">
//                 <p className="text-2xl font-semibold text-gray-800">
//                   {user?.orders || ""}
//                 </p>
//                 <p className="text-sm text-gray-500">Total Orders</p>
//               </div>

//               <div className="bg-gray-50 rounded-xl p-4">
//                 <p className="text-2xl font-semibold text-gray-800">
//                   {user?.wishlist || ""}
//                 </p>
//                 <p className="text-sm text-gray-500">Wishlist Items</p>
//               </div>

//               <div className="bg-gray-50 rounded-xl p-4">
//                 <p className="text-2xl font-semibold text-gray-800">
//                   {user?.savedAddresses || ""}
//                 </p>
//                 <p className="text-sm text-gray-500">Saved Addresses</p>
//               </div>

//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }








import { useState, useEffect } from "react";
import Sidebar from "../../components/user/sidebar";
import Header from "../../components/user/Header";
import { useNavigate } from "react-router-dom";
import { getService } from "../../service/axios";
import { userProfile } from "../../context/profileContext";

export default function Profile() {
  const [twoFactor, setTwoFactor] = useState(true);
  const navigate = useNavigate();

  const { user } = userProfile();

  useEffect(() => {
    const access = localStorage.getItem("access");
    if (!access) {
      navigate("/login");
    }
  }, [navigate]);

  // if (!user) {
  //   return <div className="p-10">Loading...</div>;
  // }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 md:ml-64 pt-16 sm:pt-20 px-3 sm:px-5 md:px-8 pb-24 md:pb-16">
        <Header />

        <div className="space-y-4 sm:space-y-6 md:space-y-8 mt-3 sm:mt-4 max-w-3xl mx-auto md:max-w-none">

          {/* Profile Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 md:p-8">
            <div className="flex flex-col xs:flex-row items-center xs:items-start sm:items-center gap-4 sm:gap-6">
              <img
                src={user.profileImage}
                alt="Profile"
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full object-cover flex-shrink-0 ring-4 ring-gray-100"
              />

              <div className="text-center xs:text-left sm:text-left w-full min-w-0">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 leading-snug truncate">
                  {user.name}
                </h2>

                <div className="flex flex-col xs:flex-row xs:flex-wrap items-center xs:items-start gap-1 xs:gap-2 mt-1 justify-center xs:justify-start">
                  <p className="text-gray-500 text-xs sm:text-sm break-all">
                    {user.email}
                  </p>
                  {user.verified && (
                    <span className="text-green-600 font-medium text-xs sm:text-sm whitespace-nowrap">
                      ✔ Verified
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                  {user.state}, {user.country}
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 md:p-8">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">
              Personal Information
            </h3>

            <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:gap-6">

              <div className="col-span-1 min-w-0">
                <p className="text-gray-400 text-xs mb-0.5">Phone</p>
                <p className="font-medium text-gray-800 text-sm sm:text-base truncate">{user.contact}</p>
              </div>

              <div className="col-span-1 min-w-0">
                <p className="text-gray-400 text-xs mb-0.5">Gender</p>
                <p className="font-medium text-gray-800 text-sm sm:text-base">{user.gender}</p>
              </div>

              <div className="col-span-1 min-w-0">
                <p className="text-gray-400 text-xs mb-0.5">Date of Birth</p>
                <p className="font-medium text-gray-800 text-sm sm:text-base">{user?.dob || "—"}</p>
              </div>

              <div className="col-span-1 min-w-0">
                <p className="text-gray-400 text-xs mb-0.5">Account Type</p>
                <p className="font-medium text-gray-800 text-sm sm:text-base">{user?.accountType || "—"}</p>
              </div>

            </div>
          </div>

          {/* Activity Overview */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 md:p-8">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">
              Activity Overview
            </h3>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 text-center">

              <div className="bg-gray-50 rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center">
                <p className="text-lg sm:text-2xl font-semibold text-gray-800 leading-none">
                  {user?.orders || "0"}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-tight">Total Orders</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center">
                <p className="text-lg sm:text-2xl font-semibold text-gray-800 leading-none">
                  {user?.wishlist || "0"}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-tight">Wishlist Items</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center">
                <p className="text-lg sm:text-2xl font-semibold text-gray-800 leading-none">
                  {user?.savedAddresses || "0"}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-tight">Saved Addresses</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

















