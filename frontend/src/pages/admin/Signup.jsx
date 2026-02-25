import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import bgImage from "../../assets/Signup Background.webp";
import logo from "../../assets/logo/logo.webp";

export default function Signup() {
    const { signup } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirm: "",
        securityKey: "",  // ✅ securityKey add kiya
        agree: false,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);      // ✅ loading add kiya
    const [serverError, setServerError] = useState(""); // ✅ server error add kiya

    const validate = () => {
        let err = {};

        if (!form.name.trim()) 
            err.name = "Name is required";

        if (!form.email) 
            err.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email))
            err.email = "Invalid email";

        if (!form.password)
            err.password = "Password required";
        else if (form.password.length < 6)
            err.password = "Minimum 6 characters";

        if (form.confirm !== form.password)
            err.confirm = "Passwords do not match";

        if (!form.securityKey.trim())   // ✅ securityKey validate
            err.securityKey = "Security key required";

        if (!form.agree)
            err.agree = "Accept terms to continue";

        setErrors(err);
        return Object.keys(err).length === 0;
    };

    // ✅ async kiya
    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");

        if (!validate()) return;

        setLoading(true);
        try {
            const result = await signup({
                name: form.name,
                email: form.email,
                password: form.password,
                securityKey: form.securityKey
            });

            if (result === "SUCCESS") {
                navigate("/dashboard"); // ✅ success pe dashboard
            } else {
                setServerError(result); // ✅ server error dikhao
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex relative">

            {/* LEFT HERO */}
            <div
                className="hidden lg:flex w-1/2 relative text-white"
                style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-blue-900/70" />
                <div className="relative z-10 p-12 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-12">
                            <img src={logo} alt="logo" className="w-50 h-15" />
                        </div>
                        <h2 className="text-4xl font-bold leading-tight">
                            Powering the future of <br />
                            international commerce.
                        </h2>
                        <p className="mt-4 text-blue-100 max-w-md">
                            Manage your entire supply chain, customs documentation,
                            and logistics partners in one unified SaaS dashboard.
                        </p>
                        <div className="flex gap-10 mt-10 text-blue-100">
                            <div>
                                <h3 className="text-2xl font-bold text-white">120+</h3>
                                <p>Countries Served</p>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">5,000+</h3>
                                <p>Active Enterprises</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-blue-200">
                        © 2026 GlobalTrade Logistics. All rights reserved.
                    </p>
                </div>
            </div>

            {/* RIGHT FORM */}
            <div className="flex-1 flex items-center justify-center bg-gray-100 p-6">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8"
                >
                    <h2 className="text-3xl font-bold mb-2">Create your Admin Account</h2>
                    <p className="text-gray-500 mb-6 text-sm">
                        Join 5,000+ global trade partners managing international commerce.
                    </p>

                    {/* ✅ Server Error */}
                    {serverError && (
                        <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg">
                            {serverError}
                        </p>
                    )}

                    {/* ✅ Loading Bar */}
                    {loading && (
                        <div className="w-full bg-gray-200 rounded-full h-1 mb-4">
                            <div className="bg-blue-600 h-1 rounded-full animate-pulse w-3/4"></div>
                        </div>
                    )}

                    {input("Full Name", form.name, v => setForm({ ...form, name: v }))}
                    {errors.name && error(errors.name)}

                    {input("Work Email", form.email, v => setForm({ ...form, email: v }), "email")}
                    {errors.email && error(errors.email)}

                    {input("Password", form.password, v => setForm({ ...form, password: v }), "password")}
                    {errors.password && error(errors.password)}

                    {input("Confirm Password", form.confirm, v => setForm({ ...form, confirm: v }), "password")}
                    {errors.confirm && error(errors.confirm)}

                    {/* ✅ Security Key field */}
                    {input("Security Key", form.securityKey, v => setForm({ ...form, securityKey: v }), "password")}
                    {errors.securityKey && error(errors.securityKey)}

                    {/* TERMS */}
                    <label className="flex items-center gap-2 text-sm mt-3">
                        <input
                            type="checkbox"
                            checked={form.agree}
                            onChange={(e) => setForm({ ...form, agree: e.target.checked })}
                        />
                        I agree to the Terms & Privacy Policy
                    </label>
                    {errors.agree && error(errors.agree)}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg mt-6 font-medium transition"
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>

                    <p className="text-center mt-6 text-sm">
                        Already have an account?{" "}
                        <Link to="/admin/login" className="text-blue-600 font-medium">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

function input(placeholder, value, set, type = "text") {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => set(e.target.value)}
            className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none p-3 rounded-lg mb-2 transition"
        />
    );
}

function error(msg) {
    return (
        <p className="text-red-500 text-xs mb-2 mt-1">{msg}</p>
    );
}