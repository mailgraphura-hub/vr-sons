import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import leftLogin from "../../assets/login/leftlogin.webp";
import { patchService, postService } from "../../service/axios";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [sendOtp, setSendOtp] = useState()

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // STEP 1 → Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email) return toast.error("Please enter email");
    if (!validateEmail(email)) return toast.error("Enter valid email");

    const apiResponse = await postService("/customer/auth/forgetpasswordOtp", { email });

    if (!apiResponse.ok && !apiResponse.fetchMessage) {
      toast.error("OTP Sent Failed");
      console.log(apiResponse.message);
      return
    }

    if (!apiResponse.ok && apiResponse.fetchMessage) {
      toast.error(apiResponse.message || "OTP Sent Failed");
      return
    }

    toast.success("OTP Sent Successfully");
    setSendOtp(apiResponse.data.data)
    setTimeout(() => {
      setSendOtp(null)
    }, 5 * 60 * 1000)
    setStep(2);
  };

  // STEP 2 → Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();

    if (otp !== sendOtp) {
      return toast.error("Invalid OTP");
    }

    toast.success("OTP Verified ✅");
    setStep(3);
  };

  // STEP 3 → Reset Password
  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6)
      return toast.error("Password must be at least 6 characters");

    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");

    const apiResponse = await patchService("/customer/auth/forgetpassword", { email: email, password: newPassword });

    if (!apiResponse.ok && !apiResponse.fetchMessage) {
      toast.error("Password Reset Failed");
      console.log(apiResponse.message);
      return
    }

    if (!apiResponse.ok && apiResponse.fetchMessage) {
      toast.error(apiResponse.message || "Password Reset Failed");
      return
    }

    toast.success("Password Reset Successful");

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-[#f4f2ee]">
      <Toaster />

      {/* LEFT IMAGE */}
      <div className="hidden lg:flex w-1/2 relative">
        <img
          src={leftLogin}
          alt="Forgot Password"
          className="w-full h-screen object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-4">
        <form
          onSubmit={
            step === 1
              ? handleSendOtp
              : step === 2
                ? handleVerifyOtp
                : handleReset
          }
          className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-lg"
        >
          <h2 className="text-2xl font-semibold text-indigo-900 mb-4">
            {step === 1
              ? "Forgot Password"
              : step === 2
                ? "Verify OTP"
                : "Reset Password"}
          </h2>

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 mb-4 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
              />

              <button className="w-full py-2.5 text-sm rounded-lg bg-indigo-900 text-white font-medium hover:bg-indigo-800 transition">
                Send OTP
              </button>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              {/* Email visible with edit option */}
              <div className="mb-3">
                <label className="text-xs text-gray-500">
                  Email Address
                </label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-indigo-600"
                  >
                    Edit
                  </button>
                </div>
              </div>

              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-2.5 mb-4 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
              />

              <button className="w-full py-2.5 text-sm rounded-lg bg-indigo-900 text-white font-medium hover:bg-indigo-800 transition">
                Verify OTP
              </button>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2.5 mb-4 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
              />

              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2.5 mb-4 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
              />

              <button className="w-full py-2.5 text-sm rounded-lg bg-indigo-900 text-white font-medium hover:bg-indigo-800 transition">
                Confirm & Login
              </button>
            </>
          )}

          {/* Back to login */}
          <p className="text-center text-xs text-gray-500 mt-4">
            Remember password?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-indigo-900 font-medium cursor-pointer"
            >
              Sign In
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}