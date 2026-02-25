import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";

import {
  Shield,
  LayoutDashboard,
  Package,
  MessageCircle,
  Users,
  Settings,
  UserPlus,
  Search,
  Info,
  ArrowRight,
  Pencil,
  Trash,
  Mail,
} from "lucide-react";

export default function TeamRoles() {
   const navigate = useNavigate();
  const [members, setMembers] = useState([
    {
      id: 1,
      name: "Alex Rivera",
      email: "alex.r@company.com",
      role: "Admin",
      lastActive: "2 hours ago",
      image:
        "https://i.pravatar.cc/100?img=1",
    },
    {
      id: 2,
      name: "Jordan Smith",
      email: "j.smith@company.com",
      role: "Editor",
      lastActive: "5 hours ago",
      image:
        "https://i.pravatar.cc/100?img=2",
    },
    {
      id: 3,
      name: "Taylor Wong",
      email: "t.wong@company.com",
      role: "Viewer",
      lastActive: "Yesterday",
      image:
        "https://i.pravatar.cc/100?img=3",
    },
    {
      id: 4,
      name: "Morgan Lee",
      email: "m.lee@company.com",
      role: "Editor",
      lastActive: "3 days ago",
      image:
        "https://i.pravatar.cc/100?img=4",
    },
  ]);

  const [search, setSearch] = useState("");

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase())
  );

  const deleteMember = (id) => {
    if (!window.confirm("Delete this member?")) return;
    setMembers(members.filter((m) => m.id !== id));
  };

  const roleColor = (role) => {

    if (role === "Admin")
      return "bg-blue-100 text-blue-600";

    if (role === "Editor")
      return "bg-green-100 text-green-600";

    return "bg-yellow-100 text-yellow-600";

  };

  return (

    <AdminLayout>



        <div className="max-w-6xl mx-auto space-y-6">

          {/* HEADER */}

          <div className="flex justify-between items-center">

            <div>

              <h2 className="text-2xl font-bold">
                Team & Roles
              </h2>

              <p className="text-gray-500">
                Manage administrative users and define access levels
              </p>

            </div>

            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold">

              <UserPlus size={18} />

              Invite Member

            </button>

          </div>

          {/* INFO BOX */}

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex justify-between">

            <div className="flex gap-3">

              <Info className="text-blue-600" />

              <div>

                <p className="font-semibold">
                  Role Permissions Guide
                </p>

                <p className="text-sm text-gray-600">

                  <b>Admins</b> full access,
                  <b className="ml-2">Editors</b> manage products & inquiries,
                  <b className="ml-2">Viewers</b> read only.

                </p>

              </div>

            </div>

            <button
            onClick={() => navigate("/admin/team-roles/details")}
            className="flex items-center gap-1 text-blue-600 font-semibold"
          >
            Detailed Permissions
            <ArrowRight size={16} />
          </button>

          </div>

          {/* TABLE CARD */}

          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">

            {/* SEARCH */}

            <div className="p-4 border-b bg-gray-50">

              <div className="relative max-w-sm">

                <Search className="absolute left-3 top-3 text-gray-400" size={18} />

                <input
                  type="text"
                  placeholder="Search team members..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-3 py-2 border rounded-lg w-full"
                />

              </div>

            </div>

            {/* TABLE */}

            <table className="w-full">

              <thead className="bg-gray-50 text-gray-500 text-sm">

                <tr>

                  <th className="px-6 py-3 text-left">Member</th>

                  <th className="px-6 py-3 text-left">Email</th>

                  <th className="px-6 py-3 text-left">Role</th>

                  <th className="px-6 py-3 text-left">Last Active</th>

                  <th className="px-6 py-3 text-right">Actions</th>

                </tr>

              </thead>

              <tbody>

                {filteredMembers.map((member) => (

                  <tr key={member.id} className="border-t hover:bg-gray-50">

                    <td className="px-6 py-4 flex items-center gap-3">

                      <img
                        src={member.image}
                        className="w-10 h-10 rounded-full"
                        alt=""
                      />

                      <span className="font-semibold">
                        {member.name}
                      </span>

                    </td>

                    <td className="px-6 py-4 text-gray-600">

                      {member.email}

                    </td>

                    <td className="px-6 py-4">

                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleColor(member.role)}`}>

                        {member.role}

                      </span>

                    </td>

                    <td className="px-6 py-4 text-gray-500">

                      {member.lastActive}

                    </td>

                    <td className="px-6 py-4 flex justify-end gap-2">

                      <button className="text-gray-400 hover:text-blue-600">

                        <Pencil size={18} />

                      </button>

                      <button
                        onClick={() => deleteMember(member.id)}
                        className="text-gray-400 hover:text-red-600"
                      >

                        <Trash size={18} />

                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

            {/* FOOTER */}

            <div className="p-4 border-t flex justify-between text-sm text-gray-500">

              <span>

                Showing {filteredMembers.length} results

              </span>

              <div className="flex gap-2">

                <button className="px-3 py-1 border rounded">

                  Previous

                </button>

                <button className="px-3 py-1 border rounded bg-blue-50 text-blue-600">

                  Next

                </button>

              </div>

            </div>

          </div>

          {/* PENDING INVITES */}

          <div className="bg-white border rounded-xl p-6">

            <div className="flex justify-between mb-4">

              <h3 className="font-bold">
                Pending Invitations
              </h3>

              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                2 Pending
              </span>

            </div>

            <Invite email="casey.v@example.com" role="Editor" />
            <Invite email="sam.dev@example.com" role="Viewer" />

          </div>

        </div>



    </AdminLayout>

  );

}


/* INVITE COMPONENT */

function Invite({ email, role }) {

  return (

    <div className="flex justify-between items-center border rounded-lg p-3 mb-2">

      <div className="flex items-center gap-3">

        <Mail className="text-gray-400" size={18} />

        <div>

          <p className="font-semibold text-sm">
            {email}
          </p>

          <p className="text-xs text-gray-500">
            Invited as {role}
          </p>

        </div>

      </div>

      <button className="text-xs text-gray-500 hover:text-gray-700">

        Resend

      </button>

    </div>

  );

}