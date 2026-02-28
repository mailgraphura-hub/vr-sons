import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { patchService, postService } from "../../service/axios";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import logo from "../../assets/logo/TextLogo.png";

const bgImage = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep]                   = useState(1);
  const [email, setEmail]                 = useState("");
  const [otp, setOtp]                     = useState("");
  const [newPassword, setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sendOtp, setSendOtp]             = useState();
  const [showPass, setShowPass]           = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [loading, setLoading]             = useState(false);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // STEP 1 → Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter email");
    if (!validateEmail(email)) return toast.error("Enter valid email");
    setLoading(true);
    const apiResponse = await postService("/customer/auth/forgetpasswordOtp", { email });
    setLoading(false);
    if (!apiResponse.ok && !apiResponse.fetchMessage) {
      toast.error("OTP Sent Failed");
      console.log(apiResponse.message);
      return;
    }
    if (!apiResponse.ok && apiResponse.fetchMessage) {
      toast.error(apiResponse.message || "OTP Sent Failed");
      return;
    }
    toast.success("OTP Sent Successfully");
    setSendOtp(apiResponse.data.data);
    setTimeout(() => setSendOtp(null), 5 * 60 * 1000);
    setStep(2);
  };

  // STEP 2 → Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp !== sendOtp) return toast.error("Invalid OTP");
    toast.success("OTP Verified ✅");
    setStep(3);
  };

  // STEP 3 → Reset Password
  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
    setLoading(true);
    const apiResponse = await patchService("/customer/auth/forgetpassword", { email, password: newPassword });
    setLoading(false);
    if (!apiResponse.ok && !apiResponse.fetchMessage) {
      toast.error("Password Reset Failed");
      console.log(apiResponse.message);
      return;
    }
    if (!apiResponse.ok && apiResponse.fetchMessage) {
      toast.error(apiResponse.message || "Password Reset Failed");
      return;
    }
    toast.success("Password Reset Successful");
    setTimeout(() => {
      localStorage.setItem("access", "Successful");
      navigate("/login");
    }, 1500);
  };

  const stepTitles    = ["Forgot Password", "Verify OTP", "Reset Password"];
  const stepSubtitles = [
    "Enter your email to receive a verification code.",
    `We sent a 6-digit code to ${email}`,
    "Choose a strong new password."
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .cfp-root {
          min-height: 100vh; width: 100%;
          font-family: 'Inter', sans-serif;
          position: relative;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
        }

        /* Background */
        .cfp-bg {
          position: absolute; inset: 0;
          background-image: url('${bgImage}');
          background-size: cover; background-position: center;
          animation: kbZoom 40s ease-in-out infinite alternate;
        }
        @keyframes kbZoom {
          from { transform: scale(1);    filter: brightness(1.05); }
          to   { transform: scale(1.07); filter: brightness(1.1); }
        }
        .cfp-bg-wash {
          position: absolute; inset: 0;
          background: linear-gradient(180deg,
            rgba(200,230,255,0.55) 0%,
            rgba(180,215,245,0.30) 45%,
            rgba(220,235,250,0.50) 100%
          );
        }

        /* Rings */
        .cfp-ring {
          position: absolute; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.35);
          left: 50%; top: 50%; pointer-events: none;
        }
        .cfp-ring-1 { width: 580px; height: 580px; transform: translate(-50%, -50%); }
        .cfp-ring-2 { width: 420px; height: 420px; transform: translate(-50%, -50%); border-color: rgba(255,255,255,0.22); }

        /* Card */
        .cfp-card {
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
          to   { opacity:1; transform:translateY(0) scale(1); }
        }

        /* Logo */
        .cfp-logo-wrap {
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.95);
          border: 1px solid rgba(200,215,232,0.7);
          border-radius: 14px; padding: 0.7rem 1.4rem;
          margin: 0 auto 1.4rem; width: fit-content;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
        }
        .cfp-logo { display: block; height: 38px; object-fit: contain; }

        /* Step indicator */
        .cfp-steps {
          display: flex; align-items: center; justify-content: center;
          gap: 0.4rem; margin-bottom: 1.5rem;
        }
        .cfp-step-dot {
          width: 28px; height: 4px; border-radius: 2px;
          background: rgba(200,215,232,0.6);
          transition: background 0.3s;
        }
        .cfp-step-dot.active { background: #3B82F6; }
        .cfp-step-dot.done   { background: #48BB78; }

        /* Headings */
        .cfp-title {
          font-size: 1.32rem; font-weight: 700; color: #1A202C;
          text-align: center; letter-spacing: -0.015em; margin-bottom: 0.4rem;
        }
        .cfp-subtitle {
          font-size: 0.84rem; color: #718096;
          text-align: center; line-height: 1.6; margin-bottom: 1.7rem;
        }
        .cfp-subtitle strong { color: #2D3748; font-weight: 600; }

        /* Fields */
        .cfp-field { margin-bottom: 0.85rem; }
        .cfp-label {
          display: block; font-size: 0.68rem; font-weight: 600;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: #A0AEC0; margin-bottom: 0.45rem; margin-left: 0.1rem;
        }
        .cfp-wrap { position: relative; display: flex; align-items: center; }
        .cfp-icon {
          position: absolute; left: 0.9rem; color: #A0AEC0;
          display: flex; align-items: center;
          pointer-events: none; transition: color 0.2s;
        }
        .cfp-input {
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
        .cfp-input.no-left-pad { padding-left: 1rem; }
        .cfp-input::placeholder { color: #A0AEC0; }
        .cfp-input:focus {
          background: rgba(255,255,255,0.94);
          border-color: rgba(99,160,230,0.65);
          box-shadow: 0 0 0 3px rgba(99,160,230,0.12);
        }
        .cfp-wrap:focus-within .cfp-icon { color: #63A0E6; }
        .cfp-eye {
          position: absolute; right: 0.85rem;
          background: none; border: none; cursor: pointer;
          color: #A0AEC0; display: flex; align-items: center;
          padding: 0; transition: color 0.2s;
        }
        .cfp-eye:hover { color: #4A5568; }

        /* OTP big input */
        .cfp-otp-input {
          width: 100%;
          background: rgba(255,255,255,0.72);
          border: 1px solid rgba(200,215,232,0.8);
          border-radius: 12px;
          padding: 1rem 1rem;
          font-size: 2rem; font-weight: 800;
          font-family: 'Inter', sans-serif;
          color: #1A202C; text-align: center;
          letter-spacing: 0.5em; outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          -webkit-appearance: none;
          margin-bottom: 1.25rem;
        }
        .cfp-otp-input::placeholder { color: #D1D5DB; font-size: 1.8rem; }
        .cfp-otp-input:focus {
          background: rgba(255,255,255,0.94);
          border-color: rgba(99,160,230,0.65);
          box-shadow: 0 0 0 3px rgba(99,160,230,0.12);
        }

        /* Edit email row */
        .cfp-email-row {
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(255,255,255,0.6);
          border: 1px solid rgba(200,215,232,0.7);
          border-radius: 10px; padding: 0.65rem 0.9rem;
          margin-bottom: 1rem;
        }
        .cfp-email-val { font-size: 0.85rem; color: #2D3748; font-weight: 500; }
        .cfp-edit-btn {
          background: none; border: none; cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem; font-weight: 600; color: #4A90D9;
          padding: 0; transition: color 0.2s;
        }
        .cfp-edit-btn:hover { color: #2B6CB0; }

        /* Submit */
        .cfp-btn {
          width: 100%; background: #1A202C;
          border: none; border-radius: 12px; padding: 0.88rem 1rem;
          font-family: 'Inter', sans-serif; font-size: 0.92rem; font-weight: 600;
          color: #fff; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(26,32,44,0.24);
          margin-top: 0.5rem; margin-bottom: 1.4rem;
        }
        .cfp-btn:hover { background: #2D3748; box-shadow: 0 6px 20px rgba(26,32,44,0.3); }
        .cfp-btn:active { transform: scale(0.985); }
        .cfp-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Footer */
        .cfp-footer {
          display: flex; align-items: center; justify-content: center;
          padding-top: 1.1rem;
          border-top: 1px solid rgba(200,215,232,0.5);
          font-size: 0.82rem; color: #A0AEC0; gap: 0.35rem;
        }
        .cfp-footer-link {
          background: none; border: none; cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 0.82rem; font-weight: 600; color: #4A90D9;
          padding: 0; transition: color 0.2s;
        }
        .cfp-footer-link:hover { color: #2B6CB0; }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <Toaster />

      <div className="cfp-root">
        <div className="cfp-bg" />
        <div className="cfp-bg-wash" />
        <div className="cfp-ring cfp-ring-1" />
        <div className="cfp-ring cfp-ring-2" />

        <div className="cfp-card">

          {/* Logo */}
          <div className="cfp-logo-wrap">
            <img src={logo} alt="VR & Sons Import Export" className="cfp-logo" />
          </div>

          {/* Step indicator */}
          <div className="cfp-steps">
            {[1,2,3].map((s) => (
              <div
                key={s}
                className={`cfp-step-dot ${step === s ? "active" : step > s ? "done" : ""}`}
              />
            ))}
          </div>

          <h1 className="cfp-title">{stepTitles[step - 1]}</h1>
          <p className="cfp-subtitle">
            {step === 2
              ? <>We sent a code to <strong>{email}</strong></>
              : stepSubtitles[step - 1]
            }
          </p>

          <form onSubmit={step === 1 ? handleSendOtp : step === 2 ? handleVerifyOtp : handleReset}>

            {/* ── STEP 1: Email ── */}
            {step === 1 && (
              <div className="cfp-field">
                <label className="cfp-label">Email Address</label>
                <div className="cfp-wrap">
                  <span className="cfp-icon"><Mail size={16} /></span>
                  <input
                    type="email"
                    className="cfp-input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* ── STEP 2: OTP ── */}
            {step === 2 && (
              <>
                <div className="cfp-email-row">
                  <span className="cfp-email-val">{email}</span>
                  <button type="button" className="cfp-edit-btn" onClick={() => setStep(1)}>Edit</button>
                </div>
                <label className="cfp-label">Authentication Code</label>
                <input
                  type="text"
                  className="cfp-otp-input"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                  autoFocus
                />
              </>
            )}

            {/* ── STEP 3: New Password ── */}
            {step === 3 && (
              <>
                <div className="cfp-field">
                  <label className="cfp-label">New Password</label>
                  <div className="cfp-wrap">
                    <span className="cfp-icon"><Lock size={16} /></span>
                    <input
                      type={showPass ? "text" : "password"}
                      className="cfp-input"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button type="button" className="cfp-eye" onClick={() => setShowPass(!showPass)}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="cfp-field">
                  <label className="cfp-label">Confirm Password</label>
                  <div className="cfp-wrap">
                    <span className="cfp-icon"><Lock size={16} /></span>
                    <input
                      type={showConfirm ? "text" : "password"}
                      className="cfp-input"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button type="button" className="cfp-eye" onClick={() => setShowConfirm(!showConfirm)}>
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </>
            )}

            <button type="submit" className="cfp-btn" disabled={loading}>
              {loading
                ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                : step === 1 ? "Send OTP"
                : step === 2 ? "Verify OTP"
                : "Confirm & Login"
              }
            </button>

          </form>

          <div className="cfp-footer">
            Remember password?
            <button className="cfp-footer-link" onClick={() => navigate("/login")}>Sign In</button>
          </div>

        </div>
      </div>
    </>
  );
}