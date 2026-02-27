import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { Lock, Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import logo from "../../assets/logo/TextLogo.png";

const bgImage = "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=2070&auto=format&fit=crop";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail]       = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError]       = useState("");
    const [loading, setLoading]   = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const result = await login(email, password);
            if (result === "SUCCESS") navigate("/admin/dashboard");
            else setError(result);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                .lr-root {
                    min-height: 100vh;
                    width: 100%;
                    font-family: 'Inter', sans-serif;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }

                .lr-bg {
                    position: absolute;
                    inset: 0;
                    background-image: url('${bgImage}');
                    background-size: cover;
                    background-position: center;
                    animation: kbZoom 40s ease-in-out infinite alternate;
                }
                @keyframes kbZoom {
                    from { transform: scale(1);    filter: brightness(1.05); }
                    to   { transform: scale(1.07); filter: brightness(1.1);  }
                }

                .lr-bg-wash {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        180deg,
                        rgba(200,230,255,0.55) 0%,
                        rgba(180,215,245,0.30) 45%,
                        rgba(220,235,250,0.50) 100%
                    );
                }

                .lr-ring {
                    position: absolute;
                    border-radius: 50%;
                    border: 1px solid rgba(255,255,255,0.35);
                    left: 50%; top: 50%;
                    pointer-events: none;
                }
                .lr-ring-1 { width: 580px; height: 580px; transform: translate(-50%, -50%); }
                .lr-ring-2 { width: 420px; height: 420px; transform: translate(-50%, -50%); border-color: rgba(255,255,255,0.22); }

                .lr-card {
                    position: relative;
                    z-index: 10;
                    width: 100%;
                    max-width: 410px;
                    margin: 1.5rem;
                    background: rgba(245,250,255,0.72);
                    border: 1px solid rgba(255,255,255,0.88);
                    border-radius: 28px;
                    padding: 2.4rem 2.2rem 2rem;
                    backdrop-filter: blur(28px) saturate(1.5);
                    -webkit-backdrop-filter: blur(28px) saturate(1.5);
                    box-shadow:
                        0 4px 6px rgba(0,0,0,0.04),
                        0 20px 60px rgba(80,140,200,0.13),
                        0 1px 0px rgba(255,255,255,0.8) inset;
                    animation: cardIn 0.55s cubic-bezier(0.22,1,0.36,1) both;
                }
                @keyframes cardIn {
                    from { opacity:0; transform:translateY(22px) scale(0.97); }
                    to   { opacity:1; transform:translateY(0)     scale(1);    }
                }

                .lr-logo-wrap {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255,255,255,0.95);
                    border: 1px solid rgba(200,215,232,0.7);
                    border-radius: 14px;
                    padding: 0.7rem 1.4rem;
                    margin: 0 auto 1.75rem;
                    width: fit-content;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.06);
                }
                .lr-logo {
                    display: block;
                    height: 38px;
                    object-fit: contain;
                }

                .lr-title {
                    font-size: 1.32rem;
                    font-weight: 700;
                    color: #1A202C;
                    text-align: center;
                    letter-spacing: -0.015em;
                    margin-bottom: 0.4rem;
                }
                .lr-subtitle {
                    font-size: 0.84rem;
                    color: #718096;
                    text-align: center;
                    line-height: 1.55;
                    margin-bottom: 1.7rem;
                }

                .lr-error {
                    background: rgba(254,215,215,0.7);
                    border: 1px solid rgba(252,129,129,0.4);
                    border-radius: 10px;
                    padding: 0.72rem 1rem;
                    margin-bottom: 1.1rem;
                    font-size: 0.8rem;
                    color: #C53030;
                    text-align: center;
                }

                .lr-field { margin-bottom: 0.8rem; }
                .lr-wrap { position: relative; display: flex; align-items: center; }
                .lr-icon {
                    position: absolute; left: 0.9rem;
                    color: #A0AEC0; display: flex; align-items: center;
                    pointer-events: none; transition: color 0.2s;
                }
                .lr-input {
                    width: 100%;
                    background: rgba(255,255,255,0.72);
                    border: 1px solid rgba(200,215,232,0.8);
                    border-radius: 12px;
                    padding: 0.82rem 1rem 0.82rem 2.6rem;
                    font-size: 0.9rem;
                    font-family: 'Inter', sans-serif;
                    color: #2D3748;
                    outline: none;
                    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
                    -webkit-appearance: none;
                }
                .lr-input::placeholder { color: #A0AEC0; }
                .lr-input:focus {
                    background: rgba(255,255,255,0.94);
                    border-color: rgba(99,160,230,0.65);
                    box-shadow: 0 0 0 3px rgba(99,160,230,0.12);
                }
                .lr-wrap:focus-within .lr-icon { color: #63A0E6; }

                .lr-eye {
                    position: absolute; right: 0.85rem;
                    background: none; border: none; cursor: pointer;
                    color: #A0AEC0; display: flex; align-items: center;
                    padding: 0; transition: color 0.2s;
                }
                .lr-eye:hover { color: #4A5568; }

                .lr-forgot-row {
                    display: flex; justify-content: flex-end;
                    margin: -0.25rem 0 1.35rem;
                }
                .lr-forgot {
                    background: none; border: none; cursor: pointer;
                    font-family: 'Inter', sans-serif;
                    font-size: 0.8rem; font-weight: 500;
                    color: #4A90D9; padding: 0;
                    transition: color 0.2s;
                }
                .lr-forgot:hover { color: #2B6CB0; }

                .lr-btn {
                    width: 100%;
                    background: #1A202C;
                    border: none; border-radius: 12px;
                    padding: 0.88rem 1rem;
                    font-family: 'Inter', sans-serif;
                    font-size: 0.92rem; font-weight: 600;
                    color: #fff; cursor: pointer;
                    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
                    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
                    box-shadow: 0 4px 14px rgba(26,32,44,0.24);
                    letter-spacing: 0.01em;
                    margin-bottom: 1.4rem;
                }
                .lr-btn:hover { background: #2D3748; box-shadow: 0 6px 20px rgba(26,32,44,0.3); }
                .lr-btn:active { transform: scale(0.985); }
                .lr-btn:disabled { opacity: 0.5; cursor: not-allowed; }
                .lr-arrow { transition: transform 0.2s; }
                .lr-btn:hover .lr-arrow { transform: translateX(3px); }

                /* Footer */
                .lr-footer {
                    display: flex; align-items: center; justify-content: center;
                    padding-top: 1.2rem;
                    border-top: 1px solid rgba(200,215,232,0.5);
                    font-size: 0.82rem; color: #A0AEC0;
                    gap: 0.35rem;
                }
                .lr-footer a {
                    color: #4A90D9; font-weight: 600;
                    text-decoration: none;
                    transition: color 0.2s;
                }
                .lr-footer a:hover { color: #2B6CB0; }

                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>

            <div className="lr-root">
                <div className="lr-bg" />
                <div className="lr-bg-wash" />
                <div className="lr-ring lr-ring-1" />
                <div className="lr-ring lr-ring-2" />

                <div className="lr-card">

                    {/* Logo */}
                    <div className="lr-logo-wrap">
                        <img src={logo} alt="VR & Sons" className="lr-logo" />
                    </div>

                    <h1 className="lr-title">Sign in with email</h1>
                    <p className="lr-subtitle">
                        Access the VR &amp; Sons Import Export<br />
                        Admin Dashboard to manage inquiries.
                    </p>

                    {error && <div className="lr-error">{error}</div>}

                    <form onSubmit={handleLogin}>

                        {/* Email */}
                        <div className="lr-field">
                            <div className="lr-wrap">
                                <span className="lr-icon"><Mail size={16} /></span>
                                <input
                                    type="email"
                                    className="lr-input"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="lr-field">
                            <div className="lr-wrap">
                                <span className="lr-icon"><Lock size={16} /></span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="lr-input"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button type="button" className="lr-eye" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot */}
                        <div className="lr-forgot-row">
                            <button type="button" className="lr-forgot" onClick={() => navigate("/admin/forgot-password")}>
                                Forgot password?
                            </button>
                        </div>

                        {/* Submit */}
                        <button type="submit" className="lr-btn" disabled={loading}>
                            {loading
                                ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                                : <><span>Get Started</span><ArrowRight size={16} className="lr-arrow" /></>
                            }
                        </button>

                    </form>

                    {/* Footer — create account link */}
                    <div className="lr-footer">
                        Don't have an account?
                        <Link to="/admin/SignUp">Create Account</Link>
                    </div>

                </div>
            </div>
        </>
    );
}

function ArrowRight(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
        </svg>
    );
}
