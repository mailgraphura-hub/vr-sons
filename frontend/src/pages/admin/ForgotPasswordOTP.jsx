import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { postService } from "../../service/axios.js";

const ForgotPasswordOTP = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let err = {};

        if (!email.trim()) err.email = "Email is required";
        else if (!validateEmail(email)) err.email = "Valid email daalo";

        setErrors(err);
        if (Object.keys(err).length > 0) return;

        setIsLoading(true);
        try {
            
            const response = await postService(
                "/admin/auth/forgetpasswordOtp",
                { email: email.trim() }
                
            );
            // console.log(response.success);

            if (response.ok) {
                toast.success("OTP sent to your email!");
                navigate("/admin/verify-otp", { state: { email: email.trim() } });
            } else {
                toast.error(response.message || "Failed to send OTP");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password?</h1>
                    <p className="text-gray-600 text-sm">
                        Enter You Email to get OTP.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (errors.email) setErrors({});
                            }}
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? "Sending OTP..." : "Send OTP"}
                    </button>
                </form>

                <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-3 text-gray-500 text-sm">or</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                </div>

                <button
                    onClick={() => navigate("/admin/login")}
                    className="w-full text-gray-600 py-2 px-4 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                    Back to Sign In
                </button>
            </div>
        </div>
    );
};

export default ForgotPasswordOTP;