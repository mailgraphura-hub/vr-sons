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
    const userName = localStorage.getItem("username")
    if (!userName) {
      navigate("/");
    }
  }, [navigate]);

  if (!user) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="flex bg-gray-50">
      <Sidebar />

      <div className="flex-1 md:ml-64 pt-24 px-4 md:px-8 min-h-screen pb-16">
        <Header />

        <div className="space-y-8">

          {/* Profile Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
            <img
              src={user.profileImage}
              alt="Profile"
              className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover"
            />

            <div className="text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                {user.name}
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                {user.email}
                {user.verified && (
                  <span className="ml-2 text-green-600 font-medium text-sm">
                    ✔ Verified
                  </span>
                )}
              </p>

              <p className="text-sm text-gray-500 mt-2">
                {user.state}, {user.country}
              </p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">

              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium text-gray-800">{user.contact}</p>
              </div>

              <div>
                <p className="text-gray-500">Gender</p>
                <p className="font-medium text-gray-800">{user.gender}</p>
              </div>

              <div>
                <p className="text-gray-500">Date of Birth</p>
                <p className="font-medium text-gray-800">{user?.dob || ""}</p>
              </div>

              <div>
                <p className="text-gray-500">Account Type</p>
                <p className="font-medium text-gray-800">{user?.accountType || ""}</p>
              </div>

            </div>
          </div>

          {/* Activity Overview */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Activity Overview
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-2xl font-semibold text-gray-800">
                  {user?.orders || ""}
                </p>
                <p className="text-sm text-gray-500">Total Orders</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-2xl font-semibold text-gray-800">
                  {user?.wishlist || ""}
                </p>
                <p className="text-sm text-gray-500">Wishlist Items</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-2xl font-semibold text-gray-800">
                  {user?.savedAddresses || ""}
                </p>
                <p className="text-sm text-gray-500">Saved Addresses</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}