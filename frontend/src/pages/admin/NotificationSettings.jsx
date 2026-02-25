import React, { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { Bell } from "lucide-react";

export default function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });

  return (
    <AdminLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Notification Settings</h1>

        <div className="bg-white rounded-xl border p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Bell className="text-blue-600" />
            <h2 className="font-semibold text-lg">Notification Preferences</h2>
          </div>

          {Object.keys(notifications).map((key) => (
            <div
              key={key}
              className="flex justify-between items-center border-b pb-3"
            >
              <span className="capitalize">{key} Notifications</span>
              <input
                type="checkbox"
                checked={notifications[key]}
                onChange={() =>
                  setNotifications({
                    ...notifications,
                    [key]: !notifications[key],
                  })
                }
                className="w-5 h-5"
              />
            </div>
          ))}

          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">
            Save Preferences
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}