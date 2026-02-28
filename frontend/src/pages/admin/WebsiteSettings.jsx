import React, { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { Globe } from "lucide-react";

export default function WebsiteSettings() {
  const [website, setWebsite] = useState({
    homepageTitle: "Welcome to Import Export",
    metaDescription: "Best import export management system.",
    maintenanceMode: false,
  });

  return (
    <AdminLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Website Settings</h1>

        <div className="bg-white rounded-xl border p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Globe className="text-blue-600" />
            <h2 className="font-semibold text-lg">Website Configuration</h2>
          </div>

          <div>
            <label className="text-sm font-medium">Homepage Title</label>
            <input
              type="text"
              value={website.homepageTitle}
              onChange={(e) =>
                setWebsite({ ...website, homepageTitle: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Meta Description</label>
            <textarea
              value={website.metaDescription}
              onChange={(e) =>
                setWebsite({ ...website, metaDescription: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2 mt-1"
            />
          </div>

          <div className="flex justify-between items-center">
            <span>Enable Maintenance Mode</span>
            <input
              type="checkbox"
              checked={website.maintenanceMode}
              onChange={() =>
                setWebsite({
                  ...website,
                  maintenanceMode: !website.maintenanceMode,
                })
              }
              className="w-5 h-5"
            />
          </div>

          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">
            Save Website Settings
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}