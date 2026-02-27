import React, { useState } from "react";
import { Eye, EyeOff, CheckCircle, XCircle, Mail, Lock, Loader2 } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { postService } from "../../service/axios";
import { GoogleLogin } from "@react-oauth/google";
import logo from "../../assets/logo/TextLogo.png";

const bgImage = "./src/assets/Image-Groundnut.webp";

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            if (!credentialResponse?.credential) {
                toast.error("Invalid Google response");
                return;
            }
            const token = credentialResponse.credential;
            const apiResponse = await postService("/customer/auth/google", { token });
            if (!apiResponse.ok) {
                toast.error(apiResponse.message || "Google Login Failed");
                return;
            }
            toast.success("Login Successful");
            localStorage.setItem("access", "grant");
            setTimeout(() => navigate("/user/dashboard"), 1500);
        } catch (error) {
            console.error("Google Login Error:", error);
            toast.error("Google Login Failed");
        }
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) { toast.error("Please fill all fields"); return; }
        if (!validateEmail(form.email)) { toast.error("Enter valid email"); return; }
        setLoading(true);
        const apiResponse = await postService("/customer/auth/login", { email: form.email, password: form.password });
        if (!apiResponse.ok && !apiResponse.fetchMessage) {
            toast.error("Login Failed");
            console.log(apiResponse.message);
            setLoading(false); return;
        }
        if (!apiResponse.ok && apiResponse.fetchMessage) {
            toast.error(apiResponse.message || "Login Failed");
            setLoading(false); return;
        }
        toast.success("Login Successful");
        localStorage.setItem("access", "Successful");
        setLoading(false);
        setTimeout(() => navigate("/user/dashboard"), 1000);
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                .cl-root {
                    min-height: 100vh; width: 100%;
                    font-family: 'Inter', sans-serif;
                    position: relative;
                    display: flex; align-items: center; justify-content: center;
                    overflow: hidden;
                }

                /* Background */
                .cl-bg {
                    position: absolute; inset: 0;
                    background-image: url('${bgImage}');
                    background-size: cover; background-position: center;
                    animation: kbZoom 40s ease-in-out infinite alternate;
                }
                @keyframes kbZoom {
                    from { transform: scale(1);    filter: brightness(1.05); }
                    to   { transform: scale(1.07); filter: brightness(1.1); }
                }
                .cl-bg-wash {
                    position: absolute; inset: 0;
                    background: linear-gradient(180deg,
                    rgba(200,230,255,0.25) 0%,
                    rgba(180,215,245,0.10) 45%,
                    rgba(220,235,250,0.20) 100%
                    );
                }

                /* Rings */
                .cl-ring {
                    position: absolute; border-radius: 50%;
                    border: 1px solid rgba(255,255,255,0.35);
                    left: 50%; top: 50%; pointer-events: none;
                }
                .cl-ring-1 { width: 580px; height: 580px; transform: translate(-50%, -50%); }
                .cl-ring-2 { width: 420px; height: 420px; transform: translate(-50%, -50%); border-color: rgba(255,255,255,0.22); }

                /* Card */
                .cl-card {
                    position: relative; z-index: 10;
                    width: 100%; max-width: 410px; margin: 1.5rem;
                    background: rgba(245,250,255, 0.01);
                    border: 1px solid rgba(255,255,255,0.88);
                    border-radius: 28px; padding: 2.4rem 2.2rem 2rem;
                    backdrop-filter: blur(2px) saturate(1.3);
                    -webkit-backdrop-filter: blur(10px) saturate(1.3);
                    box-shadow: 0 4px 6px rgba(0,0,0,0.04), 0 20px 60px rgba(80,140,200,0.13), 0 1px 0px rgba(255,255,255,0.8) inset;
                    animation: cardIn 0.55s cubic-bezier(0.22,1,0.36,1) both;
                }
                @keyframes cardIn {
                    from { opacity:0; transform:translateY(22px) scale(0.97); }
                    to   { opacity:1; transform:translateY(0) scale(1); }
                }

                /* Logo */
                .cl-logo-wrap {
                    display: flex; align-items: center; justify-content: center;
                    background: rgba(255,255,255,0.95);
                    border: 1px solid rgba(200,215,232,0.7);
                    border-radius: 14px; padding: 0.7rem 1.4rem;
                    margin: 0 auto 1.4rem; width: fit-content;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.06);
                }
                .cl-logo { display: block; height: 38px; object-fit: contain; }

                /* Headings */
                .cl-title {
                    font-size: 1.32rem; font-weight: 700; color: #1A202C;
                    text-align: center; letter-spacing: -0.015em; margin-bottom: 0.4rem;
                }
                .cl-subtitle {
                    font-size: 0.84rem; color: white;
                    text-align: center; line-height: 1.55; margin-bottom: 1.7rem;
                }

                /* Fields */
                .cl-field { margin-bottom: 0.8rem; }
                .cl-label {
                    display: block; font-size: 0.68rem; font-weight: 600;
                    letter-spacing: 0.18em; text-transform: uppercase;
                    color: #A0AEC0; margin-bottom: 0.45rem; margin-left: 0.1rem;
                }
                .cl-wrap { position: relative; display: flex; align-items: center; }
                .cl-icon {
                    position: absolute; left: 0.9rem; color: #A0AEC0;
                    display: flex; align-items: center;
                    pointer-events: none; transition: color 0.2s;
                }
                .cl-input {
                    width: 100%;
                    background: rgba(255,255,255,0.72);
                    border: 1px solid rgba(200,215,232,0.8);
                    border-radius: 12px;
                    padding: 0.82rem 2.6rem 0.82rem 2.6rem;
                    font-size: 0.9rem; font-family: 'Inter', sans-serif;
                    color: #2D3748; outline: none;
                    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
                    -webkit-appearance: none;
                }
                .cl-input::placeholder { color: #A0AEC0; }
                .cl-input:focus {
                    background: rgba(255,255,255,0.94);
                    border-color: rgba(99,160,230,0.65);
                    box-shadow: 0 0 0 3px rgba(99,160,230,0.12);
                }
                .cl-wrap:focus-within .cl-icon { color: #63A0E6; }
                .cl-right-icon {
                    position: absolute; right: 0.85rem;
                    display: flex; align-items: center;
                    pointer-events: none;
                }
                .cl-eye {
                    position: absolute; right: 0.85rem;
                    background: none; border: none; cursor: pointer;
                    color: #A0AEC0; display: flex; align-items: center;
                    padding: 0; transition: color 0.2s;
                }
                .cl-eye:hover { color: #4A5568; }

                /* Forgot */
                .cl-forgot-row {
                    display: flex; justify-content: flex-end;
                    margin: -0.2rem 0 1.2rem;
                }
                .cl-forgot {
                    background: none; border: none; cursor: pointer;
                    font-family: 'Inter', sans-serif;
                    font-size: 0.8rem; font-weight: 500; color: #4A90D9;
                    padding: 0; transition: color 0.2s;
                }
                .cl-forgot:hover { color: #2B6CB0; }

                /* Submit */
                .cl-btn {
                    width: 100%; background: #1A202C;
                    border: none; border-radius: 12px; padding: 0.88rem 1rem;
                    font-family: 'Inter', sans-serif; font-size: 0.92rem; font-weight: 600;
                    color: #fff; cursor: pointer;
                    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
                    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
                    box-shadow: 0 4px 14px rgba(26,32,44,0.24);
                    margin-bottom: 1.25rem;
                }
                .cl-btn:hover { background: #2D3748; box-shadow: 0 6px 20px rgba(26,32,44,0.3); }
                .cl-btn:active { transform: scale(0.985); }
                .cl-btn:disabled { opacity: 0.5; cursor: not-allowed; }

                /* Divider */
                .cl-divider {
                    display: flex; align-items: center; gap: 0.75rem;
                    margin-bottom: 1.1rem;
                }
                .cl-divider-line {
                    flex: 1; height: 1px; background: rgba(200,215,232,0.6);
                }
                .cl-divider-text {
                    font-size: 0.72rem; font-weight: 500; color: #A0AEC0;
                    letter-spacing: 0.08em; text-transform: uppercase;
                }

                /* Google button wrapper */
                .cl-google-wrap {
                    display: flex; justify-content: center;
                    margin-bottom: 1.25rem;
                }

                /* Footer */
                .cl-footer {
                    display: flex; align-items: center; justify-content: center;
                    padding-top: 1.1rem;
                    border-top: 1px solid rgba(200,215,232,0.5);
                    font-size: 0.82rem; color: #A0AEC0; gap: 0.35rem;
                }
                .cl-footer-link {
                    background: none; border: none; cursor: pointer;
                    font-family: 'Inter', sans-serif;
                    font-size: 0.82rem; font-weight: 600; color: #4A90D9;
                    padding: 0; transition: color 0.2s;
                }
                .cl-footer-link:hover { color: #2B6CB0; }

                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>

            <Toaster />

            <div className="cl-root">
                <div className="cl-bg" />
                <div className="cl-bg-wash" />
                <div className="cl-ring cl-ring-1" />
                <div className="cl-ring cl-ring-2" />

                <div className="cl-card">

                    {/* Logo */}
                    <div className="cl-logo-wrap">
                        <img src={logo} alt="VR & Sons Import Export" className="cl-logo" />
                    </div>

                    <h1 className="cl-title">Sign in with email</h1>
                    <p className="cl-subtitle">Access your VR &amp; Sons Import Export account.</p>

                    <form onSubmit={handleLogin}>

                        {/* Email */}
                        <div className="cl-field">
                            <label className="cl-label">Email</label>
                            <div className="cl-wrap">
                                <span className="cl-icon"><Mail size={16} /></span>
                                <input
                                    type="email"
                                    name="email"
                                    className="cl-input"
                                    placeholder="Email address"
                                    value={form.email}
                                    onChange={handleChange}
                                />
                                {form.email && (
                                    <span className="cl-right-icon">
                                        {validateEmail(form.email)
                                            ? <CheckCircle size={16} color="#48BB78" />
                                            : <XCircle size={16} color="#FC8181" />
                                        }
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Password */}
                        <div className="cl-field">
                            <label className="cl-label">Password</label>
                            <div className="cl-wrap">
                                <span className="cl-icon"><Lock size={16} /></span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className="cl-input"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                />
                                <button type="button" className="cl-eye" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot */}
                        <div className="cl-forgot-row">
                            <button type="button" className="cl-forgot" onClick={() => navigate("/forgot-pass")}>
                                Forgot Password?
                            </button>
                        </div>

                        {/* Submit */}
                        <button type="submit" className="cl-btn" disabled={loading}>
                            {loading
                                ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                                : "Sign In"
                            }
                        </button>

                    </form>

                    {/* Divider */}
                    <div className="cl-divider">
                        <div className="cl-divider-line" />
                        <span className="cl-divider-text">or</span>
                        <div className="cl-divider-line" />
                    </div>

                    {/* Google Login */}
                    <div className="cl-google-wrap">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => toast.error("Google Login Failed")}
                        />
                    </div>

                    {/* Footer */}
                    <div className="cl-footer">
                        Don't have an account?
                        <button className="cl-footer-link" onClick={() => navigate("/signup")}>
                            Create Account
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
}
