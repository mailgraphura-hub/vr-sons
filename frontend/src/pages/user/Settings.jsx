import { useState, useRef, useEffect } from "react";
import Sidebar from "../../components/user/sidebar";
import Header from "../../components/user/Header";
import { putService } from "../../service/axios";
import { userProfile } from "../../context/profileContext";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";


export default function Profile() {
  const fileInputRef = useRef(null);

    const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  const { user, setUser } = userProfile();

  useEffect(() => {
      const access = localStorage.getItem("access")
      if (!access) {
        navigate("/login");
      }
    }, [navigate]);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedFile(file);
      const imageURL = URL.createObjectURL(file);

      setUser({
        ...user,
        profileImage: imageURL,
      });
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("contact", user.contact || "");
      formData.append("gender", user.gender || "");
      formData.append("dob", user.dob || "");
      formData.append("country", user.country || "");
      formData.append("state", user.state || "");

      if (selectedFile) {
        formData.append("profileImage", selectedFile);
      }

      const apiResponse = await putService(
        "/customer/auth/updateProfile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!apiResponse.ok && !apiResponse.fetchMessage) {
        console.log(apiResponse?.message);
        toast.error("Update Profile Failed")
        setLoading(false);
        return;
      }

      if (!apiResponse.ok && apiResponse.fetchMessage) {
        console.log(apiResponse?.message);
        toast.error(apiResponse?.message)
        setLoading(false);
        return;
      }

      toast.success("Update Profile Successful");
      setUser(apiResponse.data.data);
      setIsEditing(false);
      setLoading(false);

      console.log("Profile Updated Successfully");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Format createdAt nicely
  const formattedCreatedAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

      if (!user) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="flex bg-gray-50">
        <Toaster />
      <Sidebar />

      <div className="flex-1 md:ml-64 pt-24 px-4 md:px-8 min-h-screen pb-16">
        <Header />

        <div className="space-y-8">

          {/* Profile Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">

              {/* Profile Image */}
              <div className="relative">
                <img
                  src={user?.profileImage}
                  alt="Profile"
                  className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border"
                />

                {isEditing && (
                  <>
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="absolute bottom-0 right-0 bg-black text-white text-xs px-3 py-1 rounded-full"
                    >
                      Change
                    </button>

                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={user?.name || ""}
                    onChange={handleChange}
                    className="text-xl md:text-2xl font-semibold border-b w-full outline-none"
                  />
                ) : (
                  <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                    {user?.name}
                  </h2>
                )}

                <p className="text-gray-500 text-sm mt-1">
                  {user?.email}
                </p>

                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-4 px-4 py-2 bg-black text-white rounded-lg text-sm"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="mt-4 flex gap-3 justify-center md:justify-start">
                    <button
                      onClick={updateProfile}
                      disabled={loading}
                      className="px-4 py-2 bg-black text-white rounded-lg text-sm"
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border rounded-lg text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Editable Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 text-sm">

              {/* Contact */}
              <div>
                <label className="text-gray-500 text-xs">Mobile Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="contact"
                    value={user?.contact || ""}
                    maxLength={10}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                ) : (
                  <p className="font-medium text-gray-800 mt-1">
                    +91 {user?.contact || ""}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="text-gray-500 text-xs">Gender</label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={user?.gender || ""}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="font-medium text-gray-800 mt-1">
                    {user?.gender || ""}
                  </p>
                )}
              </div>

              {/* DOB */}
              <div>
                <label className="text-gray-500 text-xs">Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dob"
                    value={user?.dob || ""}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                ) : (
                  <p className="font-medium text-gray-800 mt-1">
                    {user?.dob || ""}
                  </p>
                )}
              </div>

              {/* State */}
              <div>
                <label className="text-gray-500 text-xs">State</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="state"
                    value={user?.state || ""}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                ) : (
                  <p className="font-medium text-gray-800 mt-1">
                    {user?.state || ""}
                  </p>
                )}
              </div>

              {/* Country */}
              <div>
                <label className="text-gray-500 text-xs">Country</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="country"
                    value={user?.country || ""}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1"
                  />
                ) : (
                  <p className="font-medium text-gray-800 mt-1">
                    {user?.country || ""}
                  </p>
                )}
              </div>

              {/* Created At (Non Editable) */}
              <div>
                <label className="text-gray-500 text-xs">Account Created</label>
                <p className="font-medium text-gray-800 mt-1">
                  {formattedCreatedAt}
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}