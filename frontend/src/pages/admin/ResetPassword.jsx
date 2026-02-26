import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { postService } from "../../service/axios.js";

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const [form, setForm] = useState({
        newPassword: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Email nahi hai to forgot password pe bhejo
    if (!email) {
        navigate("/admin/forgot-password");
        return null;
    }

    const validate = () => {
        let err = {};

        if (!form.newPassword) 
            err.newPassword = "Password is required";
        else if (form.newPassword.length < 6) 
            err.newPassword = "Minimum 6 characters";

        if (!form.confirmPassword) 
            err.confirmPassword = "Confirm you password";
        else if (form.newPassword !== form.confirmPassword) 
            err.confirmPassword = "Passwords is not matching";

        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        try {
            const response = await postService(
                "/admin/auth/forgetpassword",
                {
                    email,
                    newPassword: form.newPassword,
                    confirmPassword: form.confirmPassword
                }
            );

            if (response.ok) {
                toast.success("Password reset successfully!");
                setTimeout(() => navigate("/admin/login"), 1500);
            } else {
                toast.error(response.message || "Failed to reset password");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h1>
                    <p className="text-gray-600 text-sm">
                        Enter You New Password
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your new Password"
                            value={form.newPassword}
                            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                        />
                        {errors.newPassword && (
                            <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            placeholder="Confirm your password"
                            value={form.confirmPassword}
                            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {isLoading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>

                <button
                    onClick={() => navigate("/admin/login")}
                    className="w-full mt-4 text-gray-600 py-2 px-4 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                    Back to Sign In
                </button>
            </div>
        </div>
    );
};

export default ResetPassword;