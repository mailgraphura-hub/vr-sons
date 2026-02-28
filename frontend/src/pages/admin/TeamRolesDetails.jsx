import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import {
  FileText,
  Save,
  RotateCcw,
  Edit,
  Calendar,
  Info,
  ArrowLeft,
} from "lucide-react";

export default function TermsConditions() {

  const navigate = useNavigate();

  const defaultTerms = `
TERMS AND CONDITIONS

Welcome to VR & Sons Import Export Admin Panel.

1. Introduction
These Terms and Conditions govern the use of the Import-Export Product Inquiry Website Admin System.

2. Admin Responsibilities
Admins are responsible for managing categories, sub-categories, products, and product inquiries. Unauthorized or improper use is strictly prohibited.

3. Product Management
Admins must ensure that all product data, specifications, and WEBP images uploaded are accurate and compliant with international trade standards.

4. Inquiry Management
All customer inquiries must be handled professionally and confidentially.

5. Data Security
Admins must protect login credentials and ensure secure access to the admin panel.

6. Compliance
All export operations must comply with international trade laws and regulations.

7. Modification Rights
VR & Sons Import Export reserves the right to modify these terms at any time.

Last updated: July 2025
`;

  const [terms, setTerms] = useState(defaultTerms);
  const [editing, setEditing] = useState(false);
  const [savedDate, setSavedDate] = useState("July 2025");

  const handleSave = () => {
    setEditing(false);
    setSavedDate(new Date().toLocaleDateString());
    alert("Terms & Conditions saved successfully");
  };

  const handleReset = () => {
    if (!window.confirm("Reset changes?")) return;
    setTerms(defaultTerms);
  };

  return (
    <AdminLayout>

      <div className="max-w-5xl mx-auto space-y-6">

        {/* HEADER */}

        <div className="flex justify-between items-center">

          <div>

            <h1 className="text-2xl font-bold flex items-center gap-2">

              <FileText className="text-blue-600" />

              Terms & Conditions

            </h1>

            <p className="text-gray-500">

              Manage legal terms and conditions for admin system

            </p>

          </div>

          <div className="flex gap-3">
            {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200"
        >
          <ArrowLeft size={18} />
          Back
        </button>

            {!editing && (

              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
              >

                <Edit size={18} />

                Edit

              </button>

            )}

            {editing && (

              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
                >

                  <Save size={18} />

                  Save

                </button>

                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded-lg"
                >

                  <RotateCcw size={18} />

                  Reset

                </button>

              </>

            )}

          </div>

        </div>

        {/* INFO CARD */}

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex gap-3">

          <Info className="text-blue-600 mt-1" />

          <div>

            <p className="font-semibold">

              Legal Notice

            </p>

            <p className="text-sm text-gray-600">

              These terms apply to all admin users managing the Import Export system.

            </p>

          </div>

        </div>

        {/* TERMS CARD */}

        <div className="bg-white border rounded-xl shadow-sm">

          {/* CARD HEADER */}

          <div className="flex justify-between items-center border-b p-4 bg-gray-50 rounded-t-xl">

            <span className="font-semibold">

              Document Content

            </span>

            <span className="flex items-center gap-2 text-sm text-gray-500">

              <Calendar size={16} />

              Last updated: {savedDate}

            </span>

          </div>

          {/* CONTENT */}

          <div className="p-6">

            {editing ? (

              <textarea
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                className="w-full h-96 border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            ) : (

              <div className="whitespace-pre-line text-gray-700 leading-relaxed">

                {terms}

              </div>

            )}

          </div>

        </div>

        {/* FOOTER */}

        <div className="text-sm text-gray-500 text-center">

          VR & Sons Import Export Admin Panel © 2026

        </div>

      </div>

    </AdminLayout>
  );

}