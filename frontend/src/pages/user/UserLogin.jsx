import React, { useState } from "react";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import leftLogin from "../../assets/login/leftlogin.webp";
import { postService } from "../../service/axios";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            if (!credentialResponse?.credential) {
                toast.error("Invalid Google response");
                return;
            }

            const token = credentialResponse.credential; // ✅ ID TOKEN

            const apiResponse = await postService(
                "/customer/auth/google",
                { token }
            );

            if (!apiResponse.ok) {
                toast.error(apiResponse.message || "Google Login Failed");
                return;
            }

            toast.success("Login Successful");

            setTimeout(() => {
                navigate("/");
            }, 1500);

        } catch (error) {
            console.error("Google Login Error:", error);
            toast.error("Google Login Failed");
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!form.email || !form.password) {
            toast.error("Please fill all fields");
            return;
        }

        if (!validateEmail(form.email)) {
            toast.error("Enter valid email");
            return;
        }

        setLoading(true);

        const apiResponse = await postService(
            "/customer/auth/login",
            {
                email: form.email,
                password: form.password
            }
        )

        if (!apiResponse.ok && !apiResponse.fetchMessage) {
            toast.error("Login Failed");
            console.log(apiResponse.message)
            setLoading(false);
            return
        }

        if (!apiResponse.ok && apiResponse.fetchMessage) {
            toast.error(apiResponse.message || "Login Failed");
            setLoading(false);
            return
        }

        toast.success("Login Successful");
        localStorage.setItem("access", "Successful");
        setLoading(false);
        setTimeout(() => (navigate("/")), 1000)
        return

        //     setTimeout(() => {
        //         toast.success("Login Successful 🎉");
        //         setLoading(false);

        //         // After login redirect (optional)
        //         // navigate("/dashboard");

        //     }, 1500);
    };

    return (
        <div className="min-h-screen flex bg-[#f4f2ee]">
            <Toaster />

            {/* LEFT SIDE IMAGE */}
            <div className="hidden lg:flex w-1/2 relative">
                <img
                    src={leftLogin}
                    alt="Login Visual"
                    className="w-full h-screen object-cover"
                />

                {/*  Dark Overlay  */}
                <div className="absolute inset-0 bg-black/40"></div>

                {/*  Text Over Image */}
                <div className="absolute inset-0 flex items-center p-12">
                    <div className="text-white max-w-sm">
                        <h1 className="text-4xl font-bold mb-4 leading-tight">
                            Welcome Back.
                        </h1>
                        <p className="text-gray-200 text-sm">
                            Continue your premium import-export journey with us.
                        </p>
                    </div>
                </div>
            </div>
            {/* RIGHT SIDE */}
            <div className="flex w-full lg:w-1/2 items-center justify-center p-4">
                <form
                    onSubmit={handleLogin}
                    className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-lg"
                >
                    <h2 className="text-2xl font-semibold text-indigo-900 mb-1">
                        Sign In
                    </h2>
                    <p className="text-gray-500 text-sm mb-4">
                        Access your account.
                    </p>

                    {/* Email */}
                    <div className="relative mb-3">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
                        />
                        {form.email &&
                            (validateEmail(form.email) ? (
                                <CheckCircle
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                                    size={16}
                                />
                            ) : (
                                <XCircle
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"
                                    size={16}
                                />
                            ))}
                    </div>

                    {/* Password */}
                    <div className="relative mb-2">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none pr-10"
                        />
                        <span
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </span>
                    </div>

                    {/* Forgot Password */}
                    <div className="text-right mb-4">
                        <span
                            onClick={() => navigate("/forgot-pass")}
                            className="text-xs text-indigo-900 cursor-pointer hover:underline"
                        >
                            Forgot Password?
                        </span>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 text-sm rounded-lg bg-indigo-900 text-white font-medium hover:bg-indigo-800 transition"
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center my-4">
                        <div className="flex-1 border-t"></div>
                        <span className="px-2 text-xs text-gray-400">OR</span>
                        <div className="flex-1 border-t"></div>
                    </div>

                    {/* Social Login */}
                    <div className="flex gap-2">


                        {/* Google Login  */}
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => toast.error("Google Login Failed")}
                        />

                    </div>

                    <p className="text-center text-xs text-gray-500 mt-4">
                        Don’t have an account?{" "}
                        <span
                            onClick={() => navigate("/signup")}
                            className="text-indigo-900 font-medium cursor-pointer"
                        >
                            Create Account
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
}