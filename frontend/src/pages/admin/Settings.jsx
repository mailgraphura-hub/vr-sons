import React, { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import {
  Lock,
  ShieldCheck,
  Smartphone,
  Monitor,
  Laptop,
  Globe,
  Trash2,
  Search,
  Bell,
} from "lucide-react";

export default function SettingsSecurity() {
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });


  const [sessions, setSessions] = useState([
    {
      id: 1,
      device: "MacBook Pro 16\"",
      browser: "Chrome • macOS Ventura",
      location: "San Francisco, CA",
      ip: "192.168.1.1",
      status: "current",
      icon: Laptop,
    },
    {
      id: 2,
      device: "iPhone 14 Pro",
      browser: "Safari • iOS 16.5",
      location: "New York, NY",
      ip: "72.14.213.44",
      status: "2 hours ago",
      icon: Smartphone,
    },
    {
      id: 3,
      device: "Windows PC",
      browser: "Firefox • Windows 11",
      location: "London, UK",
      ip: "81.102.15.11",
      status: "Oct 12, 2023",
      icon: Monitor,
    },
  ]);

  const revokeSession = (id) => {
    setSessions(sessions.filter((s) => s.id !== id));
  };

  const revokeAll = () => {
    setSessions(sessions.filter((s) => s.status === "current"));
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">

        {/* HEADER */}

        <div className="bg-white border-b px-8 py-4 flex justify-between items-center">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Security & Privacy
            </h1>
            <p className="text-gray-500 text-sm">
              Manage account security and sessions
            </p>
          </div>

          <div className="flex gap-4 items-center">

            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                className="pl-10 pr-4 py-2 border rounded-lg w-64"
                placeholder="Search settings..."
              />
            </div>

            <Bell className="text-gray-500" />

          </div>

        </div>

        {/* CONTENT */}

        <div className="max-w-5xl mx-auto p-8 space-y-8">

          {/* PASSWORD */}

          <div className="bg-white rounded-xl border">

            <div className="flex justify-between items-center p-6 border-b">

              <div className="flex gap-3 items-center">
                <Lock className="text-blue-600" />
                <h2 className="font-bold text-lg">
                  Password Management
                </h2>
              </div>

              <span className="text-green-600 text-sm font-semibold bg-green-100 px-3 py-1 rounded-full">
                Secure
              </span>

            </div>

            <div className="p-6 grid md:grid-cols-2 gap-8">

              <div className="space-y-4">

                <input
                  type="password"
                  placeholder="Current password"
                  className="w-full border rounded-lg px-4 py-2"
                  value={password.current}
                  onChange={(e) =>
                    setPassword({ ...password, current: e.target.value })
                  }
                />

                <input
                  type="password"
                  placeholder="New password"
                  className="w-full border rounded-lg px-4 py-2"
                  value={password.new}
                  onChange={(e) =>
                    setPassword({ ...password, new: e.target.value })
                  }
                />

                <input
                  type="password"
                  placeholder="Confirm password"
                  className="w-full border rounded-lg px-4 py-2"
                  value={password.confirm}
                  onChange={(e) =>
                    setPassword({ ...password, confirm: e.target.value })
                  }
                />

                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">
                  Update Password
                </button>

              </div>

              <div className="bg-gray-50 border rounded-lg p-4">

                <h4 className="font-semibold mb-2">
                  Password Requirements
                </h4>

                <ul className="text-sm text-gray-600 space-y-1">

                  <li>• Minimum 12 characters</li>
                  <li>• One uppercase letter</li>
                  <li>• One number or symbol</li>
                  <li>• Not previously used</li>

                </ul>

              </div>

            </div>

          </div>

          
          {/* ACTIVE SESSIONS */}

          <div className="bg-white rounded-xl border">

            <div className="flex justify-between items-center p-6 border-b">

              <div className="flex gap-3 items-center">

                <Globe className="text-blue-600" />

                <h2 className="font-bold text-lg">
                  Active Sessions
                </h2>

              </div>

              <button
                onClick={revokeAll}
                className="text-red-500 font-semibold"
              >
                Revoke All Others
              </button>

            </div>

            <table className="w-full">

              <thead className="bg-gray-50 text-left text-sm text-gray-500">

                <tr>

                  <th className="px-6 py-3">Device</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">IP</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>

                </tr>

              </thead>

              <tbody>

                {sessions.map((session) => {

                  const Icon = session.icon;

                  return (

                    <tr key={session.id} className="border-t">

                      <td className="px-6 py-4 flex gap-3 items-center">

                        <Icon size={18} />

                        <div>

                          <div className="font-medium">
                            {session.device}
                          </div>

                          <div className="text-sm text-gray-500">
                            {session.browser}
                          </div>

                        </div>

                      </td>

                      <td className="px-6 py-4">
                        {session.location}
                      </td>

                      <td className="px-6 py-4 font-mono">
                        {session.ip}
                      </td>

                      <td className="px-6 py-4">

                        {session.status === "current" ? (

                          <span className="text-blue-600 font-semibold">
                            Current
                          </span>

                        ) : (
                          session.status
                        )}

                      </td>

                      <td className="px-6 py-4 text-right">

                        {session.status !== "current" && (

                          <button
                            onClick={() => revokeSession(session.id)}
                            className="text-red-500"
                          >
                            <Trash2 size={18} />
                          </button>

                        )}

                      </td>

                    </tr>

                  );
                })}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </AdminLayout>
  );
}