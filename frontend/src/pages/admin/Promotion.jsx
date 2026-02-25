import { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import {
  Send,
  Users,
  CheckCircle,
  Loader2,
  Megaphone,
  Eye,
  X,
} from "lucide-react";
import { postService } from "../../service/axios";

const emptyForm = {
  subject: "",
  offerTitle: "",
  offerDescription: "",
};

export default function Promotion() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [preview, setPreview] = useState(false);

  const validate = () => {
    const err = {};
    if (!form.subject.trim()) err.subject = "Subject is required";
    if (!form.offerTitle.trim()) err.offerTitle = "Offer title is required";
    if (!form.offerDescription.trim())
      err.offerDescription = "Offer description is required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSend = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      setApiError(null);

      const response = await postService("/admin/promotion", {
        subject: form.subject,
        offerTitle: form.offerTitle,
        offerDescription: form.offerDescription,
      });

      if (!response?.data) {
        throw new Error("Failed to send promotion");
      }

      setSuccess(true);
      setForm(emptyForm);
      setTimeout(() => setSuccess(false), 4000);

    } catch (err) {
      setApiError(
        err?.response?.data?.message || "Failed to send promotion"
      );
    } finally {
      setLoading(false);
    }
  };

  const field = (key) => ({
    value: form[key],
    onChange: (e) => {
      setForm({ ...form, [key]: e.target.value });
      if (errors[key]) setErrors({ ...errors, [key]: null });
    },
  });

  return (
    <AdminLayout>

      {/* HEADER */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Megaphone size={24} className="text-blue-600" />
          <h1 className="text-3xl font-bold">Send Promotion</h1>
        </div>
        <p className="text-gray-500 ml-9">
          Send promotional email to all subscribers.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">

        {/* Success */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3 flex items-center gap-3 text-green-700">
            <CheckCircle size={18} />
            <p className="text-sm font-medium">
              Promotion sent successfully!
            </p>
          </div>
        )}

        {/* Error */}
        {apiError && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3 flex justify-between items-center text-red-600">
            <p className="text-sm">{apiError}</p>
            <button onClick={() => setApiError(null)}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* FORM */}
        <div className="bg-white border rounded-2xl shadow-sm p-7 space-y-6">

          {/* Subject */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Email Subject *
            </label>
            <input
              type="text"
              placeholder="Enter subject"
              {...field("subject")}
              className="w-full border rounded-xl px-4 py-2"
            />
            {errors.subject && (
              <p className="text-red-500 text-xs mt-1">
                {errors.subject}
              </p>
            )}
          </div>

          {/* Offer Title */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Offer Title *
            </label>
            <input
              type="text"
              placeholder="Enter offer title"
              {...field("offerTitle")}
              className="w-full border rounded-xl px-4 py-2"
            />
            {errors.offerTitle && (
              <p className="text-red-500 text-xs mt-1">
                {errors.offerTitle}
              </p>
            )}
          </div>

          {/* Offer Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Offer Description *
            </label>
            <textarea
              rows={6}
              placeholder="Write offer description..."
              {...field("offerDescription")}
              className="w-full border rounded-xl px-4 py-2 resize-none"
            />
            {errors.offerDescription && (
              <p className="text-red-500 text-xs mt-1">
                {errors.offerDescription}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center">

            <button
              onClick={() => setPreview(true)}
              className="flex items-center gap-2 px-4 py-2 border rounded-xl text-sm"
            >
              <Eye size={16} /> Preview
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setForm(emptyForm);
                  setErrors({});
                  setApiError(null);
                }}
                className="px-4 py-2 border rounded-xl"
              >
                Clear
              </button>

              <button
                onClick={handleSend}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PREVIEW MODAL */}
      {preview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl p-6">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">Email Preview</h3>
              <button onClick={() => setPreview(false)}>
                <X />
              </button>
            </div>

            <h2 className="font-bold text-lg mb-2">
              {form.offerTitle}
            </h2>
            <p className="text-sm text-gray-600">
              {form.offerDescription}
            </p>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setPreview(false);
                  handleSend();
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
              >
                <Send size={14} /> Send Now
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}