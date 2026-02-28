import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { postService } from "../../service/axios.js";
import { Timer, ArrowLeft, Loader2, ShieldCheck, RefreshCw } from "lucide-react";
import logo from "../../assets/logo/TextLogo.png";

const bgImage = "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070&auto=format&fit=crop";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [otpVerified, setOtpVerified] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      navigate("/admin/forgot-password");
    }
  }, [location, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
    setOtp(value);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    setIsLoading(true);
    try {
      const response = await postService("/admin/auth/verifyOtp", { email: email.trim(), otp });
      if (response.ok) {
        toast.success("OTP verified successfully!");
        setOtpVerified(true);
        setTimeout(() => {
          navigate("/admin/reset-password-otp", { state: { email } });
        }, 1500);
      } else {
        toast.error(response.fetchMessage || "Invalid OTP. Please try again.");
        setOtp("");
      }
    } catch (error) {
      toast.error("Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const response = await postService("/admin/auth/forgetpasswordOtp", { email: email.trim() });
      if (response.ok) {
        toast.success("New OTP sent to your email!");
        setTimeLeft(600);
        setOtp("");
      } else {
        toast.error("Failed to resend OTP.");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Success screen ── */
  if (otpVerified) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          .vr-success-root {
            min-height: 100vh; width: 100%;
            font-family: 'Inter', sans-serif;
            position: relative;
            display: flex; align-items: center; justify-content: center;
            overflow: hidden;
          }
          .vr-success-bg {
            position: absolute; inset: 0;
            background-image: url('${bgImage}');
            background-size: cover; background-position: center;
          }
          .vr-success-wash {
            position: absolute; inset: 0;
            background: linear-gradient(180deg, rgba(200,230,255,0.55) 0%, rgba(180,215,245,0.30) 45%, rgba(220,235,250,0.50) 100%);
          }
          .vr-success-card {
            position: relative; z-index: 10;
            width: 100%; max-width: 410px; margin: 1.5rem;
            background: rgba(245,250,255,0.72);
            border: 1px solid rgba(255,255,255,0.88);
            border-radius: 28px; padding: 2.8rem 2.2rem;
            backdrop-filter: blur(28px) saturate(1.5);
            -webkit-backdrop-filter: blur(28px) saturate(1.5);
            box-shadow: 0 4px 6px rgba(0,0,0,0.04), 0 20px 60px rgba(80,140,200,0.13);
            text-align: center;
          }
          .vr-success-icon {
            width: 72px; height: 72px;
            background: rgba(220,252,231,0.85);
            border: 1px solid rgba(134,239,172,0.5);
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 1.5rem;
            animation: bounceIn 0.6s cubic-bezier(0.22,1,0.36,1);
          }
          @keyframes bounceIn {
            0%  { transform: scale(0.5); opacity: 0; }
            70% { transform: scale(1.1); }
            100%{ transform: scale(1);   opacity: 1; }
          }
          .vr-success-title { font-size: 1.5rem; font-weight: 700; color: #1A202C; margin-bottom: 0.5rem; }
          .vr-success-sub   { font-size: 0.86rem; color: #718096; margin-bottom: 1.75rem; line-height: 1.55; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
        <div className="vr-success-root">
          <div className="vr-success-bg" />
          <div className="vr-success-wash" />
          <div className="vr-success-card">
            <div className="vr-success-icon">
              <ShieldCheck size={34} color="#16A34A" />
            </div>
            <h2 className="vr-success-title">Access Granted</h2>
            <p className="vr-success-sub">Identity verified. Redirecting to reset portal...</p>
            <Loader2 size={28} color="#3B82F6" style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          </div>
        </div>
      </>
    );
  }

  /* ── Main screen ── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .vr-root {
          min-height: 100vh; width: 100%;
          font-family: 'Inter', sans-serif;
          position: relative;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
        }

        /* Background */
        .vr-bg {
          position: absolute; inset: 0;
          background-image: url('${bgImage}');
          background-size: cover; background-position: center;
          animation: kbZoom 40s ease-in-out infinite alternate;
        }
        @keyframes kbZoom {
          from { transform: scale(1);    filter: brightness(1.05); }
          to   { transform: scale(1.07); filter: brightness(1.1); }
        }
        .vr-bg-wash {
          position: absolute; inset: 0;
          background: linear-gradient(180deg,
            rgba(200,230,255,0.55) 0%,
            rgba(180,215,245,0.30) 45%,
            rgba(220,235,250,0.50) 100%
          );
        }

        /* Rings */
        .vr-ring {
          position: absolute; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.35);
          left: 50%; top: 50%; pointer-events: none;
        }
        .vr-ring-1 { width: 580px; height: 580px; transform: translate(-50%, -50%); }
        .vr-ring-2 { width: 420px; height: 420px; transform: translate(-50%, -50%); border-color: rgba(255,255,255,0.22); }

        /* Card */
        .vr-card {
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
        .vr-logo-wrap {
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.95);
          border: 1px solid rgba(200,215,232,0.7);
          border-radius: 14px; padding: 0.7rem 1.4rem;
          margin: 0 auto 1.4rem; width: fit-content;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
        }
        .vr-logo { display: block; height: 38px; object-fit: contain; }

        /* Headings */
        .vr-title {
          font-size: 1.32rem; font-weight: 700;
          color: #1A202C; text-align: center;
          letter-spacing: -0.015em; margin-bottom: 0.4rem;
        }
        .vr-subtitle {
          font-size: 0.84rem; color: #718096;
          text-align: center; line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        .vr-subtitle strong { color: #2D3748; font-weight: 600; }

        /* Timer pill */
        .vr-timer {
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          margin: 0 auto 1.5rem; width: fit-content;
          padding: 0.45rem 1.1rem; border-radius: 100px;
          font-size: 0.82rem; font-weight: 700; letter-spacing: 0.08em;
          transition: all 0.3s;
        }
        .vr-timer.normal { background: rgba(235,245,255,0.8); color: #3B82F6; border: 1px solid rgba(147,197,253,0.4); }
        .vr-timer.urgent { background: rgba(255,235,235,0.8); color: #DC2626; border: 1px solid rgba(252,165,165,0.4); animation: timerPulse 1s ease-in-out infinite; }
        @keyframes timerPulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
        .vr-timer-dot {
          width: 6px; height: 6px; border-radius: 50%;
          position: relative;
        }
        .vr-timer-dot::after {
          content: ''; position: absolute; inset: 0; border-radius: 50%;
          animation: ping 1.2s ease-in-out infinite;
        }
        .normal .vr-timer-dot { background: #3B82F6; }
        .normal .vr-timer-dot::after { background: rgba(59,130,246,0.4); }
        .urgent .vr-timer-dot { background: #DC2626; }
        .urgent .vr-timer-dot::after { background: rgba(220,38,38,0.4); }
        @keyframes ping {
          0%   { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }

        /* OTP input */
        .vr-label {
          display: block;
          font-size: 0.68rem; font-weight: 600;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: #A0AEC0; margin-bottom: 0.5rem; margin-left: 0.1rem;
        }
        .vr-otp-input {
          width: 100%;
          background: rgba(255,255,255,0.72);
          border: 1px solid rgba(200,215,232,0.8);
          border-radius: 12px;
          padding: 1rem 1rem;
          font-size: 2rem; font-weight: 800;
          font-family: 'Inter', sans-serif;
          color: #1A202C; text-align: center;
          letter-spacing: 0.5em;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          -webkit-appearance: none;
          margin-bottom: 1.25rem;
        }
        .vr-otp-input::placeholder { color: #D1D5DB; letter-spacing: 0.4em; font-size: 1.8rem; }
        .vr-otp-input:focus {
          background: rgba(255,255,255,0.94);
          border-color: rgba(99,160,230,0.65);
          box-shadow: 0 0 0 3px rgba(99,160,230,0.12);
        }
        .vr-otp-input:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Submit */
        .vr-btn {
          width: 100%; background: #1A202C;
          border: none; border-radius: 12px; padding: 0.88rem 1rem;
          font-family: 'Inter', sans-serif; font-size: 0.92rem; font-weight: 600;
          color: #fff; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(26,32,44,0.24);
          margin-bottom: 1.4rem;
        }
        .vr-btn:hover { background: #2D3748; box-shadow: 0 6px 20px rgba(26,32,44,0.3); }
        .vr-btn:active { transform: scale(0.985); }
        .vr-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        /* Footer */
        .vr-footer {
          padding-top: 1.2rem;
          border-top: 1px solid rgba(200,215,232,0.5);
          text-align: center;
        }
        .vr-resend-hint {
          font-size: 0.8rem; color: #A0AEC0; margin-bottom: 0.75rem;
        }
        .vr-resend-btn {
          background: none; border: none; cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 0.82rem; font-weight: 600; color: #4A90D9;
          display: inline-flex; align-items: center; gap: 0.4rem;
          transition: color 0.2s; padding: 0; margin-bottom: 1rem;
        }
        .vr-resend-btn:hover { color: #2B6CB0; }
        .vr-resend-btn:hover .vr-refresh { transform: rotate(180deg); }
        .vr-refresh { transition: transform 0.5s; }
        .vr-resend-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .vr-back {
          background: none; border: none; cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem; font-weight: 600; color: #A0AEC0;
          display: inline-flex; align-items: center; gap: 0.4rem;
          transition: color 0.2s; padding: 0;
        }
        .vr-back:hover { color: #2D3748; }
        .vr-back-arrow { transition: transform 0.2s; }
        .vr-back:hover .vr-back-arrow { transform: translateX(-3px); }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="vr-root">
        <div className="vr-bg" />
        <div className="vr-bg-wash" />
        <div className="vr-ring vr-ring-1" />
        <div className="vr-ring vr-ring-2" />

        <div className="vr-card">

          {/* Logo */}
          <div className="vr-logo-wrap">
            <img src={logo} alt="VR & Sons Import Export" className="vr-logo" />
          </div>

          <h1 className="vr-title">Two-Step Verification</h1>
          <p className="vr-subtitle">
            We've sent a 6-digit code to<br />
            <strong>{email}</strong>
          </p>

          {/* Timer */}
          <div className={`vr-timer ${timeLeft <= 60 ? "urgent" : "normal"}`}>
            <span className="vr-timer-dot" />
            {formatTime(timeLeft)}
          </div>

          {/* Form */}
          <form onSubmit={handleVerifyOTP}>
            <label className="vr-label">Authentication Code</label>
            <input
              type="text"
              className="vr-otp-input"
              value={otp}
              onChange={handleOtpChange}
              placeholder="000000"
              maxLength="6"
              disabled={isLoading}
              autoFocus
            />

            <button type="submit" className="vr-btn" disabled={isLoading || otp.length !== 6}>
              {isLoading
                ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                : "Verify Identity"
              }
            </button>
          </form>

          {/* Footer */}
          <div className="vr-footer">
            <p className="vr-resend-hint">Didn't receive the code?</p>
            <div>
              <button
                className="vr-resend-btn"
                onClick={handleResendOTP}
                disabled={isLoading}
              >
                <RefreshCw size={14} className="vr-refresh" />
                Request New OTP
              </button>
            </div>
            <button className="vr-back" onClick={() => navigate("/admin/forgot-password")}>
              <ArrowLeft size={14} className="vr-back-arrow" />
              Back to email
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default VerifyOTP;