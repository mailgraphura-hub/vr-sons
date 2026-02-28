import React, { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { Settings, Globe, Clock } from "lucide-react";

export default function GeneralSettings() {
  const [settings, setSettings] = useState({
    siteName: "Import Export Admin",
    timezone: "Asia/Kolkata",
    language: "English",
  });

  return (
    <AdminLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">General Settings</h1>
          <p className="text-gray-500 text-sm">
            Manage system preferences and configurations
          </p>
        </div>

        <div className="bg-white rounded-xl border p-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="text-blue-600" />
            <h2 className="font-semibold text-lg">System Preferences</h2>
          </div>

          <div>
            <label className="text-sm font-medium">Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) =>
                setSettings({ ...settings, siteName: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Timezone</label>
            <select
              className="w-full border rounded-lg px-4 py-2 mt-1"
              value={settings.timezone}
              onChange={(e) =>
                setSettings({ ...settings, timezone: e.target.value })
              }
            >
              <option>Asia/Kolkata</option>
              <option>UTC</option>
              <option>Europe/London</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Default Language</label>
            <select
              className="w-full border rounded-lg px-4 py-2 mt-1"
              value={settings.language}
              onChange={(e) =>
                setSettings({ ...settings, language: e.target.value })
              }
            >
              <option>English</option>
              <option>Hindi</option>
              <option>French</option>
            </select>
          </div>

          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">
            Save Changes
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}