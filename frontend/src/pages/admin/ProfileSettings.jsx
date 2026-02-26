// import React, { useState } from "react";
// import AdminLayout from "../../layout/AdminLayout";
// import { User } from "lucide-react";

// export default function ProfileSettings() {
//   const [profile, setProfile] = useState({
//     name: "Alex Rivera",
//     email: "alex@company.com",
//     role: "Administrator",
//   });

//   return (
//     <AdminLayout>
//       <div className="p-8 bg-gray-50 min-h-screen">
//         <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

//         <div className="bg-white rounded-xl border p-6 space-y-6">
//           <div className="flex items-center gap-3">
//             <User className="text-blue-600" />
//             <h2 className="font-semibold text-lg">Personal Information</h2>
//           </div>

//           <div>
//             <label className="text-sm font-medium">Full Name</label>
//             <input
//               type="text"
//               value={profile.name}
//               onChange={(e) =>
//                 setProfile({ ...profile, name: e.target.value })
//               }
//               className="w-full border rounded-lg px-4 py-2 mt-1"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium">Email</label>
//             <input
//               type="email"
//               value={profile.email}
//               onChange={(e) =>
//                 setProfile({ ...profile, email: e.target.value })
//               }
//               className="w-full border rounded-lg px-4 py-2 mt-1"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium">Role</label>
//             <input
//               type="text"
//               value={profile.role}
//               disabled
//               className="w-full border rounded-lg px-4 py-2 mt-1 bg-gray-100"
//             />
//           </div>

//           <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">
//             Update Profile
//           </button>
//         </div>
//       </div>
//     </AdminLayout>
//   );
// }
































import React, { useState, useEffect } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { User, Loader2 } from "lucide-react";
import { getService, putService } from "../../service/axios"; // putService update ke liye
import { toast, Toaster } from "react-hot-toast";

export default function ProfileSettings() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // 1. API se data fetch karna (Get Profile)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getService("/admin/auth/myprofile");
        if (response.ok) {
          // Aapki requirement ke hisaab se data set kar rahe hain
          const userData = response.data.data;
          setProfile({
            name: userData.name || "",
            email: userData.email || "",
            role: userData.role || "Administrator",
          });
        }
      } catch (error) {
        console.error("Profile Fetch Error:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 2. Data update karne ka function (Handle Submit)
  const handleUpdate = async () => {
    setUpdating(true);
    try {
      // Sirf name aur email bhej rahe hain
      const response = await putService("/admin/auth/updateProfile", {
        name: profile.name,
        email: profile.email,
      });

      if (response.ok) {
        toast.success("Profile Updated Successfully!");
      } else {
        toast.error(response.message || "Update failed");
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Something went wrong");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Toaster />
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

        <div className="bg-white rounded-xl border p-6 space-y-6 max-w-2xl">
          <div className="flex items-center gap-3 border-b pb-4">
            <User className="text-blue-600" />
            <h2 className="font-semibold text-lg">Personal Information</h2>
          </div>

          {/* Full Name Input */}
          <div>
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Enter your name"
              className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              placeholder="Enter your email"
              className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Role (Read Only) */}
          {/* <div>
            <label className="text-sm font-medium text-gray-500">Role (Cannot be changed)</label>
            <input
              type="text"
              value={profile.role}
              disabled
              className="w-full border rounded-lg px-4 py-2 mt-1 bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div> */}

          {/* Update Button */}
          <button
            onClick={handleUpdate}
            disabled={updating}
            className={`w-full md:w-auto bg-blue-600 text-white px-8 py-2.5 rounded-lg font-medium transition-all
              ${updating ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"}`}
          >
            {updating ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}