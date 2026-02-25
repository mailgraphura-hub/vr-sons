import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import bg from "../../assets/Login Background.webp";
import logo from "../../assets/logo/logo.webp";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        
        if (!email.trim()) {
            setError("Email required hai");
            return;
        }
        if (!password.trim()) {
            setError("Password required hai");
            return;
        }

        setLoading(true);

        try {
            const result = await login(email, password);

            if (result === "SUCCESS") {
                navigate("/admin/dashboard"); 
            } else {
                setError(result); 
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex relative">

            {/* LEFT LOGIN FORM */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-100 p-8">
                <form
                    onSubmit={handleLogin}
                    className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg"
                >
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-6">
                        <img src={logo} alt="logo" className="w-24 h-10" />
                    </div>

                    <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>

                    <p className="text-gray-500 mb-6 text-sm">
                        Enter your corporate credentials to access the global logistics dashboard.
                    </p>

                    {/* ✅ Error Message */}
                    {error && (
                        <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg">
                            {error}
                        </p>
                    )}

                    {/* ✅ Loading Bar */}
                    {loading && (
                        <div className="w-full bg-gray-200 rounded-full h-1 mb-4">
                            <div className="bg-blue-600 h-1 rounded-full animate-pulse w-3/4"></div>
                        </div>
                    )}

                    {/* Email */}
                    <label className="text-sm text-gray-600">Work Email</label>
                    <input
                        type="email"
                        placeholder="name@company.com"
                        className="w-full border p-3 rounded-lg mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {/* Password */}
                    <div className="flex justify-between text-sm text-gray-600">
                        <label>Password</label>
                        <button
                            type="button"
                            onClick={() => navigate("/admin/forgot-password")}
                            className="text-blue-600 cursor-pointer hover:text-blue-700 hover:underline transition"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full border p-3 rounded-lg mt-1 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-medium transition"
                    >
                        {loading ? "Signing In..." : "Sign In to Dashboard →"}
                    </button>

                    <p className="text-center text-xs text-gray-500 mt-6">
                        Enterprise Security Enabled
                    </p>
                </form>
            </div>

            {/* RIGHT HERO IMAGE */}
            <div
                className="hidden lg:flex w-1/2 relative text-white"
                style={{
                    backgroundImage: `url(${bg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-blue-900/80" />
                <div className="relative z-10 p-12 flex flex-col justify-between">
                    <div>
                        <span className="bg-green-500 text-xs px-3 py-1 rounded-full">
                            ● Network Status: Operational
                        </span>
                        <p className="mt-16 text-sm text-blue-200 tracking-widest">
                            GLOBAL SUPPLY CHAIN SOLUTIONS
                        </p>
                        <h2 className="text-5xl font-bold leading-tight mt-3">
                            Empowering International Trade Intelligence.
                        </h2>
                        <div className="flex gap-12 mt-10">
                            <div>
                                <h3 className="text-3xl font-bold">140+</h3>
                                <p className="text-blue-200">Global Trading Ports</p>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold">24/7</h3>
                                <p className="text-blue-200">Real-time Logistics Tracking</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-blue-200">
                        © 2026 GLOBEX Trade International. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}