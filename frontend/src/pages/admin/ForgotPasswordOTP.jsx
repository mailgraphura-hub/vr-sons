import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { postService } from "../../service/axios.js";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import logo from "../../assets/logo/TextLogo.png";

const bgImage = "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=2070&auto=format&fit=crop";

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

            if (response.ok) {
                toast.success("OTP sent to your email!");
                navigate("/admin/verify-otp", { state: { email: email.trim() } });
            } else {
                toast.error(response.message || "Failed to send OTP");
            }
        } catch (error) {
            toast.error("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                .fp-root {
                    min-height: 100vh;
                    width: 100%;
                    font-family: 'Inter', sans-serif;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }

                /* Background */
                .fp-bg {
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
                .fp-bg-wash {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        180deg,
                        rgba(200,230,255,0.55) 0%,
                        rgba(180,215,245,0.30) 45%,
                        rgba(220,235,250,0.50) 100%
                    );
                }

                /* Decorative rings */
                .fp-ring {
                    position: absolute;
                    border-radius: 50%;
                    border: 1px solid rgba(255,255,255,0.35);
                    left: 50%; top: 50%;
                    pointer-events: none;
                }
                .fp-ring-1 { width: 580px; height: 580px; transform: translate(-50%, -50%); }
                .fp-ring-2 { width: 420px; height: 420px; transform: translate(-50%, -50%); border-color: rgba(255,255,255,0.22); }

                /* Card */
                .fp-card {
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

                /* Logo */
                .fp-logo-wrap {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255,255,255,0.95);
                    border: 1px solid rgba(200,215,232,0.7);
                    border-radius: 14px;
                    padding: 0.7rem 1.4rem;
                    margin: 0 auto 1.4rem;
                    width: fit-content;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.06);
                }
                .fp-logo {
                    display: block;
                    height: 38px;
                    object-fit: contain;
                }

                /* Headings */
                .fp-title {
                    font-size: 1.32rem;
                    font-weight: 700;
                    color: #1A202C;
                    text-align: center;
                    letter-spacing: -0.015em;
                    margin-bottom: 0.4rem;
                }
                .fp-subtitle {
                    font-size: 0.84rem;
                    color: #718096;
                    text-align: center;
                    line-height: 1.6;
                    margin-bottom: 1.75rem;
                    max-width: 290px;
                    margin-left: auto;
                    margin-right: auto;
                }

                /* Field */
                .fp-field { margin-bottom: 0.85rem; }
                .fp-label {
                    display: block;
                    font-size: 0.68rem;
                    font-weight: 600;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #A0AEC0;
                    margin-bottom: 0.5rem;
                    margin-left: 0.1rem;
                }
                .fp-wrap { position: relative; display: flex; align-items: center; }
                .fp-icon {
                    position: absolute; left: 0.9rem;
                    color: #A0AEC0; display: flex; align-items: center;
                    pointer-events: none; transition: color 0.2s;
                }
                .fp-input {
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
                .fp-input::placeholder { color: #A0AEC0; }
                .fp-input:focus {
                    background: rgba(255,255,255,0.94);
                    border-color: rgba(99,160,230,0.65);
                    box-shadow: 0 0 0 3px rgba(99,160,230,0.12);
                }
                .fp-input.error {
                    border-color: rgba(229,62,62,0.5);
                    background: rgba(254,235,235,0.6);
                }
                .fp-wrap:focus-within .fp-icon { color: #63A0E6; }
                .fp-error-msg {
                    font-size: 0.72rem; font-weight: 600;
                    color: #E53E3E;
                    letter-spacing: 0.05em;
                    margin-top: 0.35rem;
                    margin-left: 0.1rem;
                    animation: fadeIn 0.25s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity:0; transform:translateY(-4px); }
                    to   { opacity:1; transform:translateY(0); }
                }

                /* Submit */
                .fp-btn {
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
                    margin-top: 1.5rem;
                    margin-bottom: 1.4rem;
                }
                .fp-btn:hover { background: #2D3748; box-shadow: 0 6px 20px rgba(26,32,44,0.3); }
                .fp-btn:active { transform: scale(0.985); }
                .fp-btn:disabled { opacity: 0.5; cursor: not-allowed; }

                /* Footer / back */
                .fp-footer {
                    display: flex; align-items: center; justify-content: center;
                    padding-top: 1.2rem;
                    border-top: 1px solid rgba(200,215,232,0.5);
                }
                .fp-back {
                    background: none; border: none; cursor: pointer;
                    font-family: 'Inter', sans-serif;
                    font-size: 0.82rem; font-weight: 600;
                    color: #A0AEC0;
                    display: flex; align-items: center; gap: 0.4rem;
                    transition: color 0.2s;
                    padding: 0;
                }
                .fp-back:hover { color: #2D3748; }
                .fp-back-arrow { transition: transform 0.2s; }
                .fp-back:hover .fp-back-arrow { transform: translateX(-3px); }

                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>

            <div className="fp-root">
                <div className="fp-bg" />
                <div className="fp-bg-wash" />
                <div className="fp-ring fp-ring-1" />
                <div className="fp-ring fp-ring-2" />

                <div className="fp-card">

                    {/* Logo */}
                    <div className="fp-logo-wrap">
                        <img src={logo} alt="VR & Sons Import Export" className="fp-logo" />
                    </div>

                    <h1 className="fp-title">Recover Access</h1>
                    <p className="fp-subtitle">
                        Enter your verified work email to receive a secure authentication OTP.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="fp-field">
                            <label className="fp-label">Work Email</label>
                            <div className="fp-wrap">
                                <span className="fp-icon"><Mail size={16} /></span>
                                <input
                                    type="email"
                                    className={`fp-input${errors.email ? " error" : ""}`}
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (errors.email) setErrors({});
                                    }}
                                />
                            </div>
                            {errors.email && <p className="fp-error-msg">{errors.email}</p>}
                        </div>

                        <button type="submit" className="fp-btn" disabled={isLoading}>
                            {isLoading
                                ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                                : "Request OTP Code"
                            }
                        </button>
                    </form>

                    <div className="fp-footer">
                        <button className="fp-back" onClick={() => navigate("/admin/login")}>
                            <ArrowLeft size={15} className="fp-back-arrow" />
                            Back to Secure Login
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default ForgotPasswordOTP;