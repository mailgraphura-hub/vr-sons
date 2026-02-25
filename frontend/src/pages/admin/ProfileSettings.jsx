import React, { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { User } from "lucide-react";

export default function ProfileSettings() {
  const [profile, setProfile] = useState({
    name: "Alex Rivera",
    email: "alex@company.com",
    role: "Administrator",
  });

  return (
    <AdminLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

        <div className="bg-white rounded-xl border p-6 space-y-6">
          <div className="flex items-center gap-3">
            <User className="text-blue-600" />
            <h2 className="font-semibold text-lg">Personal Information</h2>
          </div>

          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Role</label>
            <input
              type="text"
              value={profile.role}
              disabled
              className="w-full border rounded-lg px-4 py-2 mt-1 bg-gray-100"
            />
          </div>

          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">
            Update Profile
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}