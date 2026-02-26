import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { User, Mail, Lock, Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";
import logo from "../../assets/logo/TextLogo.png";

const bgImage = "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2070&auto=format&fit=crop";

export default function Signup() {
    const { signup } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirm: "",
        securityKey: "",
        agree: false,
    });

    const [showPass, setShowPass]       = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showKey, setShowKey]         = useState(false);
    const [errors, setErrors]           = useState({});
    const [loading, setLoading]         = useState(false);
    const [serverError, setServerError] = useState("");

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
        if (!form.securityKey.trim())
            err.securityKey = "Security key required";
        if (!form.agree)
            err.agree = "Accept terms to continue";
        setErrors(err);
        return Object.keys(err).length === 0;
    };

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
                navigate("/dashboard");
            } else {
                setServerError(result);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                .su-root {
                    min-height: 100vh; width: 100%;
                    font-family: 'Inter', sans-serif;
                    position: relative;
                    display: flex; align-items: center; justify-content: center;
                    overflow: hidden;
                }

                /* Background */
                .su-bg {
                    position: absolute; inset: 0;
                    background-image: url('${bgImage}');
                    background-size: cover; background-position: center;
                    animation: kbZoom 40s ease-in-out infinite alternate;
                }
                @keyframes kbZoom {
                    from { transform: scale(1);    filter: brightness(1.05); }
                    to   { transform: scale(1.07); filter: brightness(1.1); }
                }
                .su-bg-wash {
                    position: absolute; inset: 0;
                    background: linear-gradient(180deg,
                        rgba(200,230,255,0.55) 0%,
                        rgba(180,215,245,0.30) 45%,
                        rgba(220,235,250,0.50) 100%
                    );
                }

                /* Rings */
                .su-ring {
                    position: absolute; border-radius: 50%;
                    border: 1px solid rgba(255,255,255,0.35);
                    left: 50%; top: 50%; pointer-events: none;
                }
                .su-ring-1 { width: 700px; height: 700px; transform: translate(-50%, -50%); }
                .su-ring-2 { width: 520px; height: 520px; transform: translate(-50%, -50%); border-color: rgba(255,255,255,0.22); }

                /* Card */
                .su-card {
                    position: relative; z-index: 10;
                    width: 100%; max-width: 440px;
                    margin: 1.5rem;
                    background: rgba(245,250,255,0.72);
                    border: 1px solid rgba(255,255,255,0.88);
                    border-radius: 28px;
                    padding: 2.4rem 2.2rem 2rem;
                    backdrop-filter: blur(28px) saturate(1.5);
                    -webkit-backdrop-filter: blur(28px) saturate(1.5);
                    box-shadow: 0 4px 6px rgba(0,0,0,0.04), 0 20px 60px rgba(80,140,200,0.13), 0 1px 0px rgba(255,255,255,0.8) inset;
                    animation: cardIn 0.55s cubic-bezier(0.22,1,0.36,1) both;
                }
                @keyframes cardIn {
                    from { opacity:0; transform:translateY(22px) scale(0.97); }
                    to   { opacity:1; transform:translateY(0) scale(1); }
                }

                /* Logo */
                .su-logo-wrap {
                    display: flex; align-items: center; justify-content: center;
                    background: rgba(255,255,255,0.95);
                    border: 1px solid rgba(200,215,232,0.7);
                    border-radius: 14px; padding: 0.7rem 1.4rem;
                    margin: 0 auto 1.4rem; width: fit-content;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.06);
                }
                .su-logo { display: block; height: 38px; object-fit: contain; }

                /* Headings */
                .su-title {
                    font-size: 1.32rem; font-weight: 700;
                    color: #1A202C; text-align: center;
                    letter-spacing: -0.015em; margin-bottom: 0.4rem;
                }
                .su-subtitle {
                    font-size: 0.84rem; color: #718096;
                    text-align: center; line-height: 1.55;
                    margin-bottom: 1.6rem;
                }

                /* Server error */
                .su-server-error {
                    background: rgba(254,215,215,0.7);
                    border: 1px solid rgba(252,129,129,0.4);
                    border-radius: 10px; padding: 0.72rem 1rem;
                    margin-bottom: 1rem;
                    font-size: 0.8rem; color: #C53030; text-align: center;
                }

                /* Loading bar */
                .su-loading-bar {
                    width: 100%; height: 3px;
                    background: rgba(200,215,232,0.5);
                    border-radius: 2px; margin-bottom: 1rem; overflow: hidden;
                }
                .su-loading-fill {
                    height: 100%; width: 75%;
                    background: linear-gradient(90deg, #63A0E6, #93C5FD);
                    border-radius: 2px;
                    animation: loadPulse 1.2s ease-in-out infinite alternate;
                }
                @keyframes loadPulse { from { opacity:0.5; } to { opacity:1; } }

                /* Fields */
                .su-field { margin-bottom: 0.75rem; }
                .su-label {
                    display: block;
                    font-size: 0.68rem; font-weight: 600;
                    letter-spacing: 0.18em; text-transform: uppercase;
                    color: #A0AEC0; margin-bottom: 0.45rem; margin-left: 0.1rem;
                }
                .su-wrap { position: relative; display: flex; align-items: center; }
                .su-icon {
                    position: absolute; left: 0.9rem;
                    color: #A0AEC0; display: flex; align-items: center;
                    pointer-events: none; transition: color 0.2s;
                }
                .su-input {
                    width: 100%;
                    background: rgba(255,255,255,0.72);
                    border: 1px solid rgba(200,215,232,0.8);
                    border-radius: 12px;
                    padding: 0.78rem 2.6rem 0.78rem 2.6rem;
                    font-size: 0.88rem;
                    font-family: 'Inter', sans-serif;
                    color: #2D3748; outline: none;
                    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
                    -webkit-appearance: none;
                }
                .su-input::placeholder { color: #A0AEC0; }
                .su-input:focus {
                    background: rgba(255,255,255,0.94);
                    border-color: rgba(99,160,230,0.65);
                    box-shadow: 0 0 0 3px rgba(99,160,230,0.12);
                }
                .su-input.error {
                    border-color: rgba(229,62,62,0.5);
                    background: rgba(254,235,235,0.6);
                }
                .su-wrap:focus-within .su-icon { color: #63A0E6; }
                .su-eye {
                    position: absolute; right: 0.85rem;
                    background: none; border: none; cursor: pointer;
                    color: #A0AEC0; display: flex; align-items: center;
                    padding: 0; transition: color 0.2s;
                }
                .su-eye:hover { color: #4A5568; }
                .su-error-msg {
                    font-size: 0.7rem; font-weight: 600; color: #E53E3E;
                    letter-spacing: 0.04em; margin-top: 0.25rem; margin-left: 0.1rem;
                    animation: fadeIn 0.25s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity:0; transform:translateY(-4px); }
                    to   { opacity:1; transform:translateY(0); }
                }

                /* Checkbox */
                .su-checkbox-row {
                    display: flex; align-items: flex-start; gap: 0.6rem;
                    margin: 0.9rem 0 0.3rem;
                }
                .su-checkbox {
                    width: 16px; height: 16px; margin-top: 1px;
                    accent-color: #3B82F6; cursor: pointer; flex-shrink: 0;
                }
                .su-checkbox-label {
                    font-size: 0.8rem; color: #718096; line-height: 1.5; cursor: pointer;
                }
                .su-checkbox-label a { color: #4A90D9; font-weight: 600; text-decoration: none; }
                .su-checkbox-label a:hover { color: #2B6CB0; }

                /* Submit */
                .su-btn {
                    width: 100%; background: #1A202C;
                    border: none; border-radius: 12px; padding: 0.88rem 1rem;
                    font-family: 'Inter', sans-serif; font-size: 0.92rem; font-weight: 600;
                    color: #fff; cursor: pointer;
                    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
                    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
                    box-shadow: 0 4px 14px rgba(26,32,44,0.24);
                    margin-top: 1.25rem; margin-bottom: 1.25rem;
                }
                .su-btn:hover { background: #2D3748; box-shadow: 0 6px 20px rgba(26,32,44,0.3); }
                .su-btn:active { transform: scale(0.985); }
                .su-btn:disabled { opacity: 0.5; cursor: not-allowed; }

                /* Footer */
                .su-footer {
                    display: flex; align-items: center; justify-content: center;
                    padding-top: 1.1rem;
                    border-top: 1px solid rgba(200,215,232,0.5);
                    font-size: 0.82rem; color: #A0AEC0;
                    gap: 0.35rem;
                }
                .su-footer a { color: #4A90D9; font-weight: 600; text-decoration: none; }
                .su-footer a:hover { color: #2B6CB0; }

                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>

            <div className="su-root">
                <div className="su-bg" />
                <div className="su-bg-wash" />
                <div className="su-ring su-ring-1" />
                <div className="su-ring su-ring-2" />

                <div className="su-card">

                    {/* Logo */}
                    <div className="su-logo-wrap">
                        <img src={logo} alt="VR & Sons Import Export" className="su-logo" />
                    </div>

                    <h1 className="su-title">Create Admin Account</h1>
                    <p className="su-subtitle">Join the VR &amp; Sons Import Export management platform.</p>

                    {serverError && <div className="su-server-error">{serverError}</div>}
                    {loading && <div className="su-loading-bar"><div className="su-loading-fill" /></div>}

                    <form onSubmit={handleSubmit}>

                        {/* Full Name */}
                        <div className="su-field">
                            <label className="su-label">Full Name</label>
                            <div className="su-wrap">
                                <span className="su-icon"><User size={15} /></span>
                                <input
                                    type="text"
                                    className={`su-input${errors.name ? " error" : ""}`}
                                    placeholder="Your full name"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </div>
                            {errors.name && <p className="su-error-msg">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div className="su-field">
                            <label className="su-label">Work Email</label>
                            <div className="su-wrap">
                                <span className="su-icon"><Mail size={15} /></span>
                                <input
                                    type="email"
                                    className={`su-input${errors.email ? " error" : ""}`}
                                    placeholder="admin@vrandsons.com"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />
                            </div>
                            {errors.email && <p className="su-error-msg">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div className="su-field">
                            <label className="su-label">Password</label>
                            <div className="su-wrap">
                                <span className="su-icon"><Lock size={15} /></span>
                                <input
                                    type={showPass ? "text" : "password"}
                                    className={`su-input${errors.password ? " error" : ""}`}
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                />
                                <button type="button" className="su-eye" onClick={() => setShowPass(!showPass)}>
                                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                            {errors.password && <p className="su-error-msg">{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div className="su-field">
                            <label className="su-label">Confirm Password</label>
                            <div className="su-wrap">
                                <span className="su-icon"><Lock size={15} /></span>
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    className={`su-input${errors.confirm ? " error" : ""}`}
                                    placeholder="••••••••"
                                    value={form.confirm}
                                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                                />
                                <button type="button" className="su-eye" onClick={() => setShowConfirm(!showConfirm)}>
                                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                            {errors.confirm && <p className="su-error-msg">{errors.confirm}</p>}
                        </div>

                        {/* Security Key */}
                        <div className="su-field">
                            <label className="su-label">Security Key</label>
                            <div className="su-wrap">
                                <span className="su-icon"><ShieldCheck size={15} /></span>
                                <input
                                    type={showKey ? "text" : "password"}
                                    className={`su-input${errors.securityKey ? " error" : ""}`}
                                    placeholder="Enter security key"
                                    value={form.securityKey}
                                    onChange={(e) => setForm({ ...form, securityKey: e.target.value })}
                                />
                                <button type="button" className="su-eye" onClick={() => setShowKey(!showKey)}>
                                    {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                            {errors.securityKey && <p className="su-error-msg">{errors.securityKey}</p>}
                        </div>

                        {/* Terms */}
                        <div className="su-checkbox-row">
                            <input
                                type="checkbox"
                                className="su-checkbox"
                                id="agree"
                                checked={form.agree}
                                onChange={(e) => setForm({ ...form, agree: e.target.checked })}
                            />
                            <label htmlFor="agree" className="su-checkbox-label">
                                I agree to the <a href="#">Terms &amp; Privacy Policy</a>
                            </label>
                        </div>
                        {errors.agree && <p className="su-error-msg">{errors.agree}</p>}

                        {/* Submit */}
                        <button type="submit" className="su-btn" disabled={loading}>
                            {loading
                                ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                                : "Create Account"
                            }
                        </button>

                    </form>

                    <div className="su-footer">
                        Already have an account?
                        <Link to="/admin/login">Sign in</Link>
                    </div>

                </div>
            </div>
        </>
    );
}