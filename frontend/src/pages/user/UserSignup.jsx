import { useState, useEffect } from "react";
import { Eye, EyeOff, CheckCircle, User, Mail, Phone, Lock, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { postService } from "../../service/axios";
import { GoogleLogin } from "@react-oauth/google";
import logo from "../../assets/logo/TextLogo.png";

const bgImage = "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?q=80&w=2070&auto=format&fit=crop";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "", email: "", mobile: "",
    password: "", confirmPassword: "", terms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  // OTP States
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {

      localStorage.clear();

      if (!credentialResponse?.credential) { toast.error("Invalid Google response"); return; }
      const token = credentialResponse.credential;
      const apiResponse = await postService("/customer/auth/google", { token });
      if (!apiResponse.ok) { toast.error(apiResponse.message || "Google Signup Failed"); return; }
      toast.success("Signup Successful");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      console.error("Google Signup Error:", error);
      toast.error("Google Signup Failed");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") setForm({ ...form, [name]: checked });
    else setForm({ ...form, [name]: value });
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);

  const handlePasswordStrength = (password) => {
    if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password)) setPasswordStrength("Strong");
    else if (password.length >= 8) setPasswordStrength("Medium");
    else setPasswordStrength("Weak");
  };

  useEffect(() => { handlePasswordStrength(form.password); }, [form.password]);

  const handleSendOtp = async () => {
    if (!validateEmail(form.email)) { toast.error("Enter valid email first"); return; }
    setOtpLoading(true);
    const apiResponse = await postService("/customer/auth/signupOtp", { name: form.fullName, email: form.email });
    setOtpLoading(false);
    if (!apiResponse.ok && !apiResponse.fetchMessage) { toast.error("OTP Sent Failed"); console.log(apiResponse.message); return; }
    if (!apiResponse.ok && apiResponse.fetchMessage) { toast.error(apiResponse.message || "OTP Sent Failed"); return; }
    setEmailOtp(apiResponse.data.data);
    setTimeout(() => setEmailOtp(null), 5 * 60 * 1000);
    setOtpSent(true);
    toast.success("OTP sent to email");
  };

  const handleVerifyOtp = () => {
    if (otpInput === emailOtp) { setEmailVerified(true); toast.success("Email verified successfully!"); }
    else toast.error("Invalid OTP");
  };

  const handleSubmit = async (e) => {
    localStorage.clear();
    e.preventDefault();
    setLoading(true);
    if (!emailVerified) { toast.error("Please verify email first"); setLoading(false); return; }
    if (!form.fullName || !form.email || !form.password || !form.confirmPassword) { toast.error("Please fill all required fields"); setLoading(false); return; }
    if (!validatePassword(form.password)) {
      toast.dismiss();

      toast.error(
        "Password must contain:\n• 1 Uppercase\n• 1 Lowercase\n• 1 Number\n• 1 Special Character\nExample: Abc@1234",
        { duration: 5000 }
      );

      setShowPassword(true);
      setLoading(false);
      return;
    }
    if (form.password !== form.confirmPassword) { toast.error("Passwords do not match"); setLoading(false); return; }
    if (!form.terms) { toast.error("Accept Terms & Conditions"); setLoading(false); return; }

    const apiResponse = await postService("/customer/auth/signup",
      { name: form.fullName, email: form.email, password: form.password }
    );
    if (!apiResponse.ok && !apiResponse.fetchMessage) { console.log(apiResponse.message); toast.error("Signup Failed!"); setLoading(false); return; }
    if (!apiResponse.ok && apiResponse.fetchMessage) { toast.error(apiResponse.message || "Signup Failed!"); setLoading(false); return; }

    setTimeout(() => {
      toast.success("Signup successful!");
      localStorage.setItem("access", "Successful");
      setLoading(false);
      navigate("/login");
    }, 1000);
  };

  const strengthColor = { Strong: "#48BB78", Medium: "#F6AD55", Weak: "#FC8181" };
  const strengthWidth = { Strong: "100%", Medium: "60%", Weak: "25%" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .cs-root {
          min-height: 100vh; width: 100%;
          font-family: 'Inter', sans-serif;
          position: relative;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; padding: 1.5rem 0;
        }

        .cs-bg {
          position: absolute; inset: 0;
          background-image: url('${bgImage}');
          background-size: cover; background-position: center;
          animation: kbZoom 40s ease-in-out infinite alternate;
        }
        @keyframes kbZoom {
          from { transform: scale(1);    filter: brightness(1.05); }
          to   { transform: scale(1.07); filter: brightness(1.1); }
        }
        .cs-bg-wash {
          position: absolute; inset: 0;
          background: linear-gradient(180deg,
            rgba(200,230,255,0.55) 0%, rgba(180,215,245,0.30) 45%, rgba(220,235,250,0.50) 100%
          );
        }
        .cs-ring {
          position: absolute; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.35);
          left: 50%; top: 50%; pointer-events: none;
        }
        .cs-ring-1 { width: 700px; height: 700px; transform: translate(-50%, -50%); }
        .cs-ring-2 { width: 520px; height: 520px; transform: translate(-50%, -50%); border-color: rgba(255,255,255,0.22); }

        /* Card */
        .cs-card {
          position: relative; z-index: 10;
          width: 100%; max-width: 440px; margin: 0 1.5rem;
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
        .cs-logo-wrap {
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.95);
          border: 1px solid rgba(200,215,232,0.7);
          border-radius: 14px; padding: 0.7rem 1.4rem;
          margin: 0 auto 1.4rem; width: fit-content;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
        }
        .cs-logo { display: block; height: 38px; object-fit: contain; }

        .cs-title {
          font-size: 1.32rem; font-weight: 700; color: #1A202C;
          text-align: center; letter-spacing: -0.015em; margin-bottom: 0.4rem;
        }
        .cs-subtitle {
          font-size: 0.84rem; color: #718096;
          text-align: center; line-height: 1.55; margin-bottom: 1.6rem;
        }

        /* Fields */
        .cs-field { margin-bottom: 0.75rem; }
        .cs-label {
          display: block; font-size: 0.68rem; font-weight: 600;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: #A0AEC0; margin-bottom: 0.45rem; margin-left: 0.1rem;
        }
        .cs-wrap { position: relative; display: flex; align-items: center; }
        .cs-icon {
          position: absolute; left: 0.9rem; color: #A0AEC0;
          display: flex; align-items: center;
          pointer-events: none; transition: color 0.2s;
        }
        .cs-input {
          width: 100%;
          background: rgba(255,255,255,0.72);
          border: 1px solid rgba(200,215,232,0.8);
          border-radius: 12px;
          padding: 0.78rem 2.6rem 0.78rem 2.6rem;
          font-size: 0.88rem; font-family: 'Inter', sans-serif;
          color: #2D3748; outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          -webkit-appearance: none;
        }
        .cs-input::placeholder { color: #A0AEC0; }
        .cs-input:focus {
          background: rgba(255,255,255,0.94);
          border-color: rgba(99,160,230,0.65);
          box-shadow: 0 0 0 3px rgba(99,160,230,0.12);
        }
        .cs-input:disabled { opacity: 0.6; cursor: not-allowed; }
        .cs-wrap:focus-within .cs-icon { color: #63A0E6; }

        .cs-eye {
          position: absolute; right: 0.85rem;
          background: none; border: none; cursor: pointer;
          color: #A0AEC0; display: flex; align-items: center;
          padding: 0; transition: color 0.2s;
        }
        .cs-eye:hover { color: #4A5568; }

        /* Email row with send OTP */
        .cs-email-action {
          position: absolute; right: 0.5rem;
          background: #3B82F6; border: none; border-radius: 8px;
          padding: 0.35rem 0.75rem;
          font-family: 'Inter', sans-serif; font-size: 0.72rem; font-weight: 600;
          color: #fff; cursor: pointer;
          transition: background 0.2s;
          display: flex; align-items: center; gap: 0.3rem;
        }
        .cs-email-action:hover { background: #2563EB; }
        .cs-email-action:disabled { opacity: 0.5; cursor: not-allowed; }
        .cs-verified-icon { position: absolute; right: 0.85rem; }

        /* OTP verify row */
        .cs-otp-row {
          display: flex; gap: 0.6rem; margin-bottom: 0.75rem;
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
        .cs-otp-input {
          flex: 1;
          background: rgba(255,255,255,0.72);
          border: 1px solid rgba(200,215,232,0.8);
          border-radius: 12px; padding: 0.78rem 1rem;
          font-size: 1rem; font-weight: 700; font-family: 'Inter', sans-serif;
          color: #1A202C; text-align: center; letter-spacing: 0.3em; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .cs-otp-input:focus {
          border-color: rgba(99,160,230,0.65);
          box-shadow: 0 0 0 3px rgba(99,160,230,0.12);
        }
        .cs-otp-verify {
          background: #48BB78; border: none; border-radius: 12px;
          padding: 0 1rem; font-family: 'Inter', sans-serif;
          font-size: 0.78rem; font-weight: 600; color: #fff; cursor: pointer;
          transition: background 0.2s; white-space: nowrap;
        }
        .cs-otp-verify:hover { background: #38A169; }

        /* Password strength */
        .cs-strength-bar {
          height: 3px; border-radius: 2px;
          background: rgba(200,215,232,0.5);
          margin-top: 0.4rem; overflow: hidden;
        }
        .cs-strength-fill {
          height: 100%; border-radius: 2px;
          transition: width 0.3s, background 0.3s;
        }
        .cs-strength-label {
          font-size: 0.68rem; font-weight: 600;
          margin-top: 0.25rem; margin-left: 0.1rem;
        }

        /* Checkbox */
        .cs-checkbox-row {
          display: flex; align-items: flex-start; gap: 0.6rem;
          margin: 0.85rem 0 0.3rem;
        }
        .cs-checkbox { width: 16px; height: 16px; margin-top: 1px; accent-color: #3B82F6; cursor: pointer; flex-shrink: 0; }
        .cs-checkbox-label { font-size: 0.8rem; color: #718096; line-height: 1.5; cursor: pointer; }
        .cs-checkbox-label a { color: #4A90D9; font-weight: 600; text-decoration: none; }

        /* Submit */
        .cs-btn {
          width: 100%; background: #1A202C;
          border: none; border-radius: 12px; padding: 0.88rem 1rem;
          font-family: 'Inter', sans-serif; font-size: 0.92rem; font-weight: 600;
          color: #fff; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(26,32,44,0.24);
          margin-top: 1.1rem; margin-bottom: 1.1rem;
        }
        .cs-btn:hover { background: #2D3748; box-shadow: 0 6px 20px rgba(26,32,44,0.3); }
        .cs-btn:active { transform: scale(0.985); }
        .cs-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Divider */
        .cs-divider {
          display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;
        }
        .cs-divider-line { flex: 1; height: 1px; background: rgba(200,215,232,0.6); }
        .cs-divider-text { font-size: 0.72rem; font-weight: 500; color: #A0AEC0; letter-spacing: 0.08em; text-transform: uppercase; }

        .cs-google-wrap { display: flex; justify-content: center; margin-bottom: 1.1rem; }

        /* Footer */
        .cs-footer {
          display: flex; align-items: center; justify-content: center;
          padding-top: 1.1rem;
          border-top: 1px solid rgba(200,215,232,0.5);
          font-size: 0.82rem; color: #A0AEC0; gap: 0.35rem;
        }
        .cs-footer-link {
          background: none; border: none; cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 0.82rem; font-weight: 600; color: #4A90D9; padding: 0;
          transition: color 0.2s;
        }
        .cs-footer-link:hover { color: #2B6CB0; }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <Toaster />

      <div className="cs-root">
        <div className="cs-bg" />
        <div className="cs-bg-wash" />
        <div className="cs-ring cs-ring-1" />
        <div className="cs-ring cs-ring-2" />

        <div className="cs-card">

          {/* Logo */}
          <div className="cs-logo-wrap">
            <img src={logo} alt="VR & Sons Import Export" className="cs-logo" />
          </div>

          <h1 className="cs-title">Create Account</h1>
          <p className="cs-subtitle">Join VR &amp; Sons Import Export platform.</p>

          <form onSubmit={handleSubmit}>

            {/* Full Name */}
            <div className="cs-field">
              <label className="cs-label">Full Name</label>
              <div className="cs-wrap">
                <span className="cs-icon"><User size={15} /></span>
                <input type="text" name="fullName" className="cs-input" placeholder="Your full name"
                  value={form.fullName} onChange={handleChange} />
              </div>
            </div>

            {/* Email + Send OTP */}
            <div className="cs-field">
              <label className="cs-label">Email Address</label>
              <div className="cs-wrap">
                <span className="cs-icon"><Mail size={15} /></span>
                <input type="email" name="email" className="cs-input" placeholder="Email address"
                  value={form.email} onChange={handleChange} disabled={emailVerified}
                  style={{ paddingRight: emailVerified ? "2.6rem" : "6.5rem" }}
                />
                {!emailVerified && (
                  <button type="button" className="cs-email-action" onClick={handleSendOtp} disabled={otpLoading}>
                    {otpLoading
                      ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />
                      : otpSent ? "Resend" : "Send OTP"
                    }
                  </button>
                )}
                {emailVerified && (
                  <span className="cs-verified-icon">
                    <CheckCircle size={16} color="#48BB78" />
                  </span>
                )}
              </div>
            </div>

            {/* OTP Verify */}
            {otpSent && !emailVerified && (
              <div className="cs-otp-row">
                <input type="text" className="cs-otp-input" placeholder="000000"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                />
                <button type="button" className="cs-otp-verify" onClick={handleVerifyOtp}>
                  Verify
                </button>
              </div>
            )}

            {/* Password */}
            <div className="cs-field">
              <label className="cs-label">Password</label>
              <div className="cs-wrap">
                <span className="cs-icon"><Lock size={15} /></span>
                <input type={showPassword ? "text" : "password"} name="password"
                  className="cs-input" placeholder="••••••••"
                  value={form.password} onChange={handleChange} disabled={!emailVerified} />
                <button type="button" className="cs-eye" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {form.password && (
                <>
                  <div className="cs-strength-bar">
                    <div className="cs-strength-fill" style={{
                      width: strengthWidth[passwordStrength] || "0%",
                      background: strengthColor[passwordStrength] || "#FC8181"
                    }} />
                  </div>
                  <p className="cs-strength-label" style={{ color: strengthColor[passwordStrength] }}>
                    {passwordStrength}
                  </p>
                </>
              )}
            </div>

            {/* Confirm Password */}
            <div className="cs-field">
              <label className="cs-label">Confirm Password</label>
              <div className="cs-wrap">
                <span className="cs-icon"><Lock size={15} /></span>
                <input type={showConfirm ? "text" : "password"} name="confirmPassword"
                  className="cs-input" placeholder="••••••••"
                  value={form.confirmPassword} onChange={handleChange} disabled={!emailVerified} />
                <button type="button" className="cs-eye" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="cs-checkbox-row">
              <input type="checkbox" className="cs-checkbox" id="terms"
                name="terms" checked={form.terms} onChange={handleChange} />
              <label htmlFor="terms" className="cs-checkbox-label">
                I agree to the <a href="/Term_Services" >Terms &amp; Conditions</a>
              </label>
            </div>

            {/* Submit */}
            <button type="submit" className="cs-btn" disabled={loading}>
              {loading
                ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                : "Create Account"
              }
            </button>

          </form>

          {/* Divider */}
          <div className="cs-divider">
            <div className="cs-divider-line" />
            <span className="cs-divider-text">or</span>
            <div className="cs-divider-line" />
          </div>

          {/* Google */}
          <div className="cs-google-wrap">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google Login Failed")}
            />
          </div>

          {/* Footer */}
          <div className="cs-footer">
            Already have an account?
            <button className="cs-footer-link" onClick={() => navigate("/login")}>Sign In</button>
          </div>

        </div>
      </div>
    </>
  );
}
