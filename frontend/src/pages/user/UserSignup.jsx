import { useState, useEffect } from "react";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import leftLogin from "../../assets/login/leftlogin.webp";
import { postService } from "../../service/axios";
import { GoogleLogin } from "@react-oauth/google";

// import { useState, useEffect } from "react";
// import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
// import toast, { Toaster } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import leftLogin from "../../assets/login/leftlogin.webp";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    terms: false,
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
        console.log(apiResponse.message)
        toast.error(apiResponse.message || "Google Signup Failed");
        return;
      }

      toast.success("Signup Successful");

      setTimeout(() => {
        navigate("/");
      }, 1500);

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

  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);

  const handlePasswordStrength = (password) => {
    if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      setPasswordStrength("Strong");
    } else if (password.length >= 8) {
      setPasswordStrength("Medium");
    } else {
      setPasswordStrength("Weak");
    }
  };

  useEffect(() => {
    handlePasswordStrength(form.password);
  }, [form.password]);

  // Send OTP
  const handleSendOtp = async () => {
    if (!validateEmail(form.email)) {
      toast.error("Enter valid email first");
      return;
    }

    const apiResponse = await postService("/customer/auth/signupOtp", { name: form.fullName, email: form.email });

    if (!apiResponse.ok && !apiResponse.fetchMessage) {
      toast.error("OTP Sent Failed");
      console.log(apiResponse.message);
      return
    }

    if (!apiResponse.ok && apiResponse.fetchMessage) {
      toast.error(apiResponse.message || "OTP Sent Failed");
      return
    }

    setEmailOtp(apiResponse.data.data)

    setOtpSent(true);
    toast.success(" OTP sent to email");
  };

  // Verify OTP
  const handleVerifyOtp = () => {
    if (otpInput === emailOtp) {
      setEmailVerified(true);
      toast.success("Email verified successfully!");
    } else {
      toast.error("Invalid OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!emailVerified) {
      toast.error("Please verify email first");
      setLoading(false);
      return;
    }

    if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
      toast.error("Please fill all required fields");
      setLoading(false);
      return;
    }

    if (!validatePassword(form.password)) {
      toast.error("Password must be strong");
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!form.terms) {
      toast.error("Accept Terms & Conditions");
      setLoading(false);
      return;
    }

    const apiResponse = await postService("/customer/auth/signup",
      { name: form.fullName, email: form.email, password: form.password }
    );

    if (!apiResponse.ok && !apiResponse.fetchMessage) {
      console.log(apiResponse.message);
      toast.error("Signup Failed!");
      setLoading(false);
      return
    }

    if (!apiResponse.ok && apiResponse.fetchMessage) {
      toast.error(apiResponse.message || "Signup Failed!");
      setLoading(false);
      return
    }

    setTimeout(() => {
      toast.success("Signup successful!");
      setLoading(false);
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-[#f4f2ee]">
      <Toaster />

      {/* LEFT IMAGE */}
      <div className="hidden lg:flex w-1/2 relative">
        <img
          src={leftLogin}
          alt="Login Visual"
          className="w-full h-screen object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-lg"
        >
          <h2 className="text-2xl font-semibold text-indigo-900 mb-4">
            Create Account
          </h2>

          {/* Full Name */}
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className="w-full mb-3 px-3 py-2.5 text-sm rounded-lg border border-gray-300"
          />

          {/* Email + Send OTP */}
          <div className="relative mb-3">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              disabled={emailVerified}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 pr-24"
            />
            {!emailVerified && (
              <button
                type="button"
                onClick={handleSendOtp}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs bg-indigo-600 text-white px-3 py-1 rounded"
              >
                Send OTP
              </button>
            )}
            {emailVerified && (
              <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={16} />
            )}
          </div>

          {/* OTP Field */}
          {otpSent && !emailVerified && (
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="text-xs bg-green-600 text-white px-3 rounded"
              >
                Verify
              </button>
            </div>
          )}

          {/* Password */}
          <div className="relative mb-3">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              disabled={!emailVerified}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 pr-10"
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </span>
          </div>

          {/* Confirm Password */}
          <input
            type={showConfirm ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            disabled={!emailVerified}
            className="w-full mb-4 px-3 py-2.5 text-sm rounded-lg border border-gray-300"
          />

          {/* Terms */}
          <label className="flex items-center mb-4 text-xs text-gray-600">
            <input
              type="checkbox"
              name="terms"
              checked={form.terms}
              onChange={handleChange}
              className="mr-2"
            />
            I agree to Terms & Conditions
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-sm rounded-lg bg-indigo-900 text-white"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          {/* Social Login */}
          <div className="flex gap-2">


            {/* Google Login  */}

            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google Login Failed")}
            />


          </div>

          <p className="text-center text-xs text-gray-500 mt-4">
            I have an account?{" "}
            <span
              onClick={() => navigate("/login")}
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