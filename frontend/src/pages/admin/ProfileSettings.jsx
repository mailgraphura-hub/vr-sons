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
































// import React, { useState, useEffect } from "react";
// import AdminLayout from "../../layout/AdminLayout";
// import { User, Loader2 } from "lucide-react";
// import { getService, putService } from "../../service/axios"; // putService update ke liye
// import { toast, Toaster } from "react-hot-toast";

// export default function ProfileSettings() {
//   const [profile, setProfile] = useState({
//     name: "",
//     email: "",
//     role: "",
//   });
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState(false);

//   // 1. API se data fetch karna (Get Profile)
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await getService("/admin/auth/myprofile");
//         if (response.ok) {
//           // Aapki requirement ke hisaab se data set kar rahe hain
//           const userData = response.data.data;
//           setProfile({
//             name: userData.name || "",
//             email: userData.email || "",
//             role: userData.role || "Administrator",
//           });
//         }
//       } catch (error) {
//         console.error("Profile Fetch Error:", error);
//         toast.error("Failed to load profile");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   // 2. Data update karne ka function (Handle Submit)
//   const handleUpdate = async () => {
//     setUpdating(true);
//     try {
//       // Sirf name aur email bhej rahe hain
//       const response = await putService("/admin/auth/updateProfile", {
//         name: profile.name,
//         email: profile.email,
//       });

//       if (response.ok) {
//         toast.success("Profile Updated Successfully!");
//       } else {
//         toast.error(response.message || "Update failed");
//       }
//     } catch (error) {
//       console.error("Update Error:", error);
//       toast.error("Something went wrong");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <AdminLayout>
//         <div className="flex h-screen items-center justify-center">
//           <Loader2 className="animate-spin text-blue-600" size={40} />
//         </div>
//       </AdminLayout>
//     );
//   }

//   return (
//     <AdminLayout>
//       <Toaster />
//       <div className="p-8 bg-gray-50 min-h-screen">
//         <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

//         <div className="bg-white rounded-xl border p-6 space-y-6 max-w-2xl">
//           <div className="flex items-center gap-3 border-b pb-4">
//             <User className="text-blue-600" />
//             <h2 className="font-semibold text-lg">Personal Information</h2>
//           </div>

//           {/* Full Name Input */}
//           <div>
//             <label className="text-sm font-medium text-gray-700">Full Name</label>
//             <input
//               type="text"
//               value={profile.name}
//               onChange={(e) => setProfile({ ...profile, name: e.target.value })}
//               placeholder="Enter your name"
//               className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
//             />
//           </div>

//           {/* Email Input */}
//           <div>
//             <label className="text-sm font-medium text-gray-700">Email Address</label>
//             <input
//               type="email"
//               value={profile.email}
//               onChange={(e) => setProfile({ ...profile, email: e.target.value })}
//               placeholder="Enter your email"
//               className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
//             />
//           </div>

//           {/* Role (Read Only) */}
//           {/* <div>
//             <label className="text-sm font-medium text-gray-500">Role (Cannot be changed)</label>
//             <input
//               type="text"
//               value={profile.role}
//               disabled
//               className="w-full border rounded-lg px-4 py-2 mt-1 bg-gray-100 text-gray-500 cursor-not-allowed"
//             />
//           </div> */}

//           {/* Update Button */}
//           <button
//             onClick={handleUpdate}
//             disabled={updating}
//             className={`w-full md:w-auto bg-blue-600 text-white px-8 py-2.5 rounded-lg font-medium transition-all
//               ${updating ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"}`}
//           >
//             {updating ? "Updating..." : "Update Profile"}
//           </button>
//         </div>
//       </div>
//     </AdminLayout>
//   );
// }





















// import React, { useState, useEffect, useRef } from "react";
// import AdminLayout from "../../layout/AdminLayout";
// import { 
//   User, Loader2, Mail, Camera, ShieldCheck, 
//   Phone, Globe, MapPin, Calendar, ChevronDown 
// } from "lucide-react";
// import { getService, putService } from "../../service/axios"; 
// import { toast, Toaster } from "react-hot-toast";

// export default function ProfileSettings() {
//   const fileInputRef = useRef(null);
//   const [profile, setProfile] = useState({
//     name: "",
//     email: "",
//     contact: "",
//     gender: "",
//     dob: "",
//     country: "",
//     state: "",
//     profileImage: "",
//     role: "Administrator"
//   });

//   const [selectedFile, setSelectedFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState(false);

//   // 1. Fetch Profile on Mount
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await getService("/admin/auth/myprofile");
//         if (response?.data?.data) {
//           const userData = response.data.data;
//           setProfile(userData);
//           setPreviewUrl(userData.profileImage || "");
//         }
//       } catch (error) {
//         toast.error("Failed to load profile");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfile();
//   }, []);

//   // 2. Handle Image Selection
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 2 * 1024 * 1024) { // 2MB Limit
//         return toast.error("File size should be less than 2MB");
//       }
//       setSelectedFile(file);
//       setPreviewUrl(URL.createObjectURL(file));
//     }
//   };

//   // 3. Update Profile (FormData Integration)
//   const handleUpdate = async () => {
//     setUpdating(true);
//     try {
//       const formData = new FormData();
//       formData.append("name", profile.name);
//       formData.append("email", profile.email);
//       formData.append("contact", profile.contact || "");
//       formData.append("gender", profile.gender || "");
//       formData.append("dob", profile.dob || "");
//       formData.append("country", profile.country || "");
//       formData.append("state", profile.state || "");
      
//       if (selectedFile) {
//         formData.append("profileImage", selectedFile);
//       }

//       const response = await putService("/admin/auth/updateProfile", formData);

//       if (response.ok) {
//         toast.success("Profile Updated Successfully!");
//         setSelectedFile(null);
//       } else {
//         toast.error(response.message || "Update failed");
//       }
//     } catch (error) {
//       toast.error("Something went wrong");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   if (loading) return (
//     <AdminLayout>
//       <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
//         <Loader2 className="animate-spin text-blue-600" size={40} />
//         <p className="text-gray-500 animate-pulse">Fetching Admin Details...</p>
//       </div>
//     </AdminLayout>
//   );

//   return (
//     <AdminLayout>
//       <Toaster position="top-right" />
//       <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen">
        
//         <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
//           {/* LEFT: Profile Card */}
//           <div className="lg:col-span-4 space-y-6">
//             <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm text-center relative overflow-hidden">
//               <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-10"></div>
              
//               <div className="relative z-10">
//                 <div className="relative inline-block group">
//                   <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl ring-1 ring-gray-100">
//                     {previewUrl ? (
//                       <img src={previewUrl} alt="Profile" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-500 font-bold text-3xl">
//                         {profile.name?.charAt(0)}
//                       </div>
//                     )}
//                   </div>
//                   <button 
//                     onClick={() => fileInputRef.current.click()}
//                     className="absolute bottom-1 right-1 p-2.5 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all border-2 border-white scale-90 hover:scale-100"
//                   >
//                     <Camera size={18} />
//                   </button>
//                   <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
//                 </div>
                
//                 <div className="mt-4">
//                   <h3 className="font-bold text-xl text-gray-800">{profile.name}</h3>
//                   <div className="flex items-center justify-center gap-1.5 mt-2">
//                     <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase rounded-full tracking-wider border border-green-100">
//                       {profile.role || "Administrator"}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT: Detailed Form */}
//           <div className="lg:col-span-8">
//             <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
//               <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
//                 <h2 className="font-bold text-gray-800 text-lg">Personal Details</h2>
//                 <ShieldCheck className="text-blue-500" size={20} />
//               </div>
              
//               <div className="p-8">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
//                   {/* Name */}
//                   <div className="space-y-1">
//                     <label className="text-xs font-bold text-gray-500 uppercase ml-1">Full Name</label>
//                     <div className="relative group">
//                       <User className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
//                       <input 
//                         type="text" 
//                         value={profile.name} 
//                         onChange={(e) => setProfile({...profile, name: e.target.value})}
//                         className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
//                       />
//                     </div>
//                   </div>

//                   {/* Email */}
//                   <div className="space-y-1">
//                     <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email Address</label>
//                     <div className="relative group">
//                       <Mail className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
//                       <input 
//                         type="email" 
//                         value={profile.email} 
//                         onChange={(e) => setProfile({...profile, email: e.target.value})}
//                         className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
//                       />
//                     </div>
//                   </div>

//                   {/* Contact */}
//                   <div className="space-y-1">
//                     <label className="text-xs font-bold text-gray-500 uppercase ml-1">Phone Number</label>
//                     <div className="relative group">
//                       <Phone className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
//                       <input 
//                         type="number" 
//                         value={profile.contact} 
//                         onChange={(e) => setProfile({...profile, contact: e.target.value})}
//                         className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
//                       />
//                     </div>
//                   </div>

//                   {/* Gender */}
//                   <div className="space-y-1">
//                     <label className="text-xs font-bold text-gray-500 uppercase ml-1">Gender</label>
//                     <div className="relative group">
//                       <select 
//                         value={profile.gender}
//                         onChange={(e) => setProfile({...profile, gender: e.target.value})}
//                         className="w-full border border-gray-200 rounded-xl px-4 py-3 appearance-none focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
//                       >
//                         <option value="">Select Gender</option>
//                         <option value="Male">Male</option>
//                         <option value="Female">Female</option>
//                         <option value="Other">Other</option>
//                       </select>
//                       <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={16} />
//                     </div>
//                   </div>

//                   {/* DOB */}
//                   <div className="space-y-1">
//                     <label className="text-xs font-bold text-gray-500 uppercase ml-1">Date of Birth</label>
//                     <div className="relative group">
//                       <Calendar className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
//                       <input 
//                         type="date" 
//                         value={profile.dob} 
//                         onChange={(e) => setProfile({...profile, dob: e.target.value})}
//                         className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
//                       />
//                     </div>
//                   </div>

//                   {/* Country */}
//                   <div className="space-y-1">
//                     <label className="text-xs font-bold text-gray-500 uppercase ml-1">Country</label>
//                     <div className="relative group">
//                       <Globe className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
//                       <input 
//                         type="text" 
//                         value={profile.country} 
//                         onChange={(e) => setProfile({...profile, country: e.target.value})}
//                         className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
//                         placeholder="e.g. India"
//                       />
//                     </div>
//                   </div>

//                 </div>

//                 <div className="mt-10 flex items-center justify-between border-t pt-8">
//                   <p className="text-xs text-gray-400 italic">Last updated: {new Date(profile.updatedAt).toLocaleDateString()}</p>
//                   <button
//                     onClick={handleUpdate}
//                     disabled={updating}
//                     className="flex items-center gap-2 bg-blue-600 text-white px-10 py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
//                   >
//                     {updating ? <Loader2 className="animate-spin" size={20} /> : "Save Changes"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </AdminLayout>
//   );
// }






















import React, { useState, useEffect, useRef } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { User, Loader2, Mail, Camera, ShieldCheck } from "lucide-react";
import { getService, putService } from "../../service/axios"; 
import { toast, Toaster } from "react-hot-toast";

export default function ProfileSettings() {
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profileImage: "",
    role: "Administrator"
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // 1. Fetch Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getService("/admin/auth/myprofile");
        if (response?.data?.data) {
          const userData = response.data.data;
          setProfile(userData);
          setPreviewUrl(userData.profileImage || "");
        }
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // 2. Image Selection logic
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return toast.error("File size > 2MB");
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // 3. Update Function
  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("email", profile.email);
      
      if (selectedFile) {
        formData.append("profileImage", selectedFile);
      }

      const response = await putService("/admin/auth/updateProfile", formData);

      if (response.ok) {
        toast.success("Profile Updated Successfully!");
        setSelectedFile(null);
      } else {
        toast.error(response.message || "Update failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <AdminLayout>
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <Toaster position="top-right" />
      <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen">
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Profile Settings</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Photo Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm flex flex-col items-center h-fit">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg ring-1 ring-gray-100">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-500 font-bold text-3xl">
                      {profile.name?.charAt(0)}
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-1 right-1 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all border-2 border-white"
                >
                  <Camera size={16} />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              </div>
              <p className="mt-4 font-bold text-gray-800">{profile.name}</p>
              <span className="text-xs font-bold text-blue-600 uppercase mt-1 tracking-wider">{profile.role}</span>
            </div>

            {/* Right: Info Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <h2 className="font-bold text-gray-800">Personal Information</h2>
                <ShieldCheck className="text-blue-500" size={18} />
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
                  <div className="relative mt-1.5 group">
                    <User className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                      type="text" 
                      value={profile.name} 
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                  <div className="relative mt-1.5 group">
                    <Mail className="absolute left-3 top-3 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                      type="email" 
                      value={profile.email} 
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleUpdate}
                    disabled={updating}
                    className="flex items-center justify-center gap-2 w-full md:w-auto bg-blue-600 text-white px-10 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-50"
                  >
                    {updating ? <Loader2 className="animate-spin" size={18} /> : "Update Profile"}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </AdminLayout>
  );
}