import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { postService } from "../../service/axios.js";
import { Lock, ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import logo from "../../assets/logo/TextLogo.png";

const bgImage = "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop";

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

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
            err.confirmPassword = "Confirm your password";
        else if (form.newPassword !== form.confirmPassword)
            err.confirmPassword = "Passwords do not match";
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
                { email, newPassword: form.newPassword, confirmPassword: form.confirmPassword }
            );
            if (response.ok) {
                toast.success("Password reset successfully!");
                setTimeout(() => navigate("/admin/login"), 1500);
            } else {
                toast.error(response.message || "Failed to reset password");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                .rp-root {
                    min-height: 100vh; width: 100%;
                    font-family: 'Inter', sans-serif;
                    position: relative;
                    display: flex; align-items: center; justify-content: center;
                    overflow: hidden;
                }

                /* Background */
                .rp-bg {
                    position: absolute; inset: 0;
                    background-image: url('${bgImage}');
                    background-size: cover; background-position: center;
                    animation: kbZoom 40s ease-in-out infinite alternate;
                }
                @keyframes kbZoom {
                    from { transform: scale(1);    filter: brightness(1.05); }
                    to   { transform: scale(1.07); filter: brightness(1.1); }
                }
                .rp-bg-wash {
                    position: absolute; inset: 0;
                    background: linear-gradient(180deg,
                        rgba(200,230,255,0.55) 0%,
                        rgba(180,215,245,0.30) 45%,
                        rgba(220,235,250,0.50) 100%
                    );
                }

                /* Rings */
                .rp-ring {
                    position: absolute; border-radius: 50%;
                    border: 1px solid rgba(255,255,255,0.35);
                    left: 50%; top: 50%; pointer-events: none;
                }
                .rp-ring-1 { width: 580px; height: 580px; transform: translate(-50%, -50%); }
                .rp-ring-2 { width: 420px; height: 420px; transform: translate(-50%, -50%); border-color: rgba(255,255,255,0.22); }

                /* Card */
                .rp-card {
                    position: relative; z-index: 10;
                    width: 100%; max-width: 410px; margin: 1.5rem;
                    background: rgba(245,250,255,0.72);
                    border: 1px solid rgba(255,255,255,0.88);
                    border-radius: 28px; padding: 2.4rem 2.2rem 2rem;
                    backdrop-filter: blur(28px) saturate(1.5);
                    -webkit-backdrop-filter: blur(28px) saturate(1.5);
                    box-shadow: 0 4px 6px rgba(0,0,0,0.04), 0 20px 60px rgba(80,140,200,0.13), 0 1px 0px rgba(255,255,255,0.8) inset;
                    animation: cardIn 0.55s cubic-bezier(0.22,1,0.36,1) both;
                }
                @keyframes cardIn {
                    from { opacity:0; transform:translateY(22px) scale(0.97); }
                    to   { opacity:1; transform:translateY(0)     scale(1); }
                }

                /* Logo */
                .rp-logo-wrap {
                    display: flex; align-items: center; justify-content: center;
                    background: rgba(255,255,255,0.95);
                    border: 1px solid rgba(200,215,232,0.7);
                    border-radius: 14px; padding: 0.7rem 1.4rem;
                    margin: 0 auto 1.4rem; width: fit-content;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.06);
                }
                .rp-logo { display: block; height: 38px; object-fit: contain; }

                /* Headings */
                .rp-title {
                    font-size: 1.32rem; font-weight: 700;
                    color: #1A202C; text-align: center;
                    letter-spacing: -0.015em; margin-bottom: 0.4rem;
                }
                .rp-subtitle {
                    font-size: 0.84rem; color: #718096;
                    text-align: center; line-height: 1.6;
                    margin-bottom: 1.75rem;
                }
                .rp-subtitle strong { color: #2D3748; font-weight: 600; }

                /* Fields */
                .rp-field { margin-bottom: 0.85rem; }
                .rp-label {
                    display: block;
                    font-size: 0.68rem; font-weight: 600;
                    letter-spacing: 0.18em; text-transform: uppercase;
                    color: #A0AEC0; margin-bottom: 0.5rem; margin-left: 0.1rem;
                }
                .rp-wrap { position: relative; display: flex; align-items: center; }
                .rp-icon {
                    position: absolute; left: 0.9rem;
                    color: #A0AEC0; display: flex; align-items: center;
                    pointer-events: none; transition: color 0.2s;
                }
                .rp-input {
                    width: 100%;
                    background: rgba(255,255,255,0.72);
                    border: 1px solid rgba(200,215,232,0.8);
                    border-radius: 12px;
                    padding: 0.82rem 2.8rem 0.82rem 2.6rem;
                    font-size: 0.9rem;
                    font-family: 'Inter', sans-serif;
                    color: #2D3748; outline: none;
                    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
                    -webkit-appearance: none;
                }
                .rp-input::placeholder { color: #A0AEC0; }
                .rp-input:focus {
                    background: rgba(255,255,255,0.94);
                    border-color: rgba(99,160,230,0.65);
                    box-shadow: 0 0 0 3px rgba(99,160,230,0.12);
                }
                .rp-input.error {
                    border-color: rgba(229,62,62,0.5);
                    background: rgba(254,235,235,0.6);
                }
                .rp-wrap:focus-within .rp-icon { color: #63A0E6; }
                .rp-eye {
                    position: absolute; right: 0.85rem;
                    background: none; border: none; cursor: pointer;
                    color: #A0AEC0; display: flex; align-items: center;
                    padding: 0; transition: color 0.2s;
                }
                .rp-eye:hover { color: #4A5568; }
                .rp-error-msg {
                    font-size: 0.72rem; font-weight: 600; color: #E53E3E;
                    letter-spacing: 0.05em; margin-top: 0.35rem; margin-left: 0.1rem;
                    animation: fadeIn 0.25s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity:0; transform:translateY(-4px); }
                    to   { opacity:1; transform:translateY(0); }
                }

                /* Submit */
                .rp-btn {
                    width: 100%; background: #1A202C;
                    border: none; border-radius: 12px; padding: 0.88rem 1rem;
                    font-family: 'Inter', sans-serif; font-size: 0.92rem; font-weight: 600;
                    color: #fff; cursor: pointer;
                    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
                    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
                    box-shadow: 0 4px 14px rgba(26,32,44,0.24);
                    margin-top: 1.5rem; margin-bottom: 1.4rem;
                }
                .rp-btn:hover { background: #2D3748; box-shadow: 0 6px 20px rgba(26,32,44,0.3); }
                .rp-btn:active { transform: scale(0.985); }
                .rp-btn:disabled { opacity: 0.5; cursor: not-allowed; }

                /* Footer */
                .rp-footer {
                    display: flex; align-items: center; justify-content: center;
                    padding-top: 1.2rem;
                    border-top: 1px solid rgba(200,215,232,0.5);
                }
                .rp-back {
                    background: none; border: none; cursor: pointer;
                    font-family: 'Inter', sans-serif;
                    font-size: 0.82rem; font-weight: 600; color: #A0AEC0;
                    display: inline-flex; align-items: center; gap: 0.4rem;
                    transition: color 0.2s; padding: 0;
                }
                .rp-back:hover { color: #2D3748; }
                .rp-back-arrow { transition: transform 0.2s; }
                .rp-back:hover .rp-back-arrow { transform: translateX(-3px); }

                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>

            <div className="rp-root">
                <div className="rp-bg" />
                <div className="rp-bg-wash" />
                <div className="rp-ring rp-ring-1" />
                <div className="rp-ring rp-ring-2" />

                <div className="rp-card">

                    {/* Logo */}
                    <div className="rp-logo-wrap">
                        <img src={logo} alt="VR & Sons Import Export" className="rp-logo" />
                    </div>

                    <h1 className="rp-title">Set New Password</h1>
                    <p className="rp-subtitle">
                        Choose a strong password for<br />
                        <strong>{email}</strong>
                    </p>

                    <form onSubmit={handleSubmit}>

                        {/* New Password */}
                        <div className="rp-field">
                            <label className="rp-label">New Password</label>
                            <div className="rp-wrap">
                                <span className="rp-icon"><Lock size={16} /></span>
                                <input
                                    type={showPass ? "text" : "password"}
                                    className={`rp-input${errors.newPassword ? " error" : ""}`}
                                    placeholder="••••••••"
                                    value={form.newPassword}
                                    onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                                />
                                <button type="button" className="rp-eye" onClick={() => setShowPass(!showPass)}>
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.newPassword && <p className="rp-error-msg">{errors.newPassword}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div className="rp-field">
                            <label className="rp-label">Confirm Password</label>
                            <div className="rp-wrap">
                                <span className="rp-icon"><Lock size={16} /></span>
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    className={`rp-input${errors.confirmPassword ? " error" : ""}`}
                                    placeholder="••••••••"
                                    value={form.confirmPassword}
                                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                />
                                <button type="button" className="rp-eye" onClick={() => setShowConfirm(!showConfirm)}>
                                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="rp-error-msg">{errors.confirmPassword}</p>}
                        </div>

                        <button type="submit" className="rp-btn" disabled={isLoading}>
                            {isLoading
                                ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                                : "Update Password"
                            }
                        </button>

                    </form>

                    <div className="rp-footer">
                        <button className="rp-back" onClick={() => navigate("/admin/login")}>
                            <ArrowLeft size={14} className="rp-back-arrow" />
                            Return to Login
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default ResetPassword;