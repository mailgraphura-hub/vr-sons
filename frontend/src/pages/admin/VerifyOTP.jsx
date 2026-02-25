import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { postService } from "../../service/axios.js";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
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
      console.log("🔐 Verifying OTP:", otp);
      const response = await postService(
        "/admin/auth/verifyOtp",
        { email: email.trim(), otp },
        "Verifying OTP..."
      );

      console.log("Response:", response);

      if (response.ok) {
        toast.success("✅ OTP verified successfully!");
        setOtpVerified(true);

        setTimeout(() => {
          navigate("/admin/reset-password-otp", { state: { email } });
        }, 1500);
      } else {
        toast.error(response.fetchMessage || "Invalid OTP. Please try again.");
        setOtp("");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      console.log("📧 Resending OTP to:", email);
      const response = await postService(
        "/admin/auth/forgetpasswordOtp",
        { email: email.trim() },
        "Sending new OTP..."
      );

      if (response.ok) {
        toast.success(" New OTP sent to your email!");
        setTimeLeft(600);
        setOtp("");
      } else {
        toast.error("Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (otpVerified) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-3">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">OTP Verified!</h2>
          <p className="text-gray-600 mb-6">Redirecting to password reset page...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Verify OTP</h1>
          <p className="text-gray-600">
            Enter the 6-digit OTP sent to <span className="font-semibold">{email}</span>
          </p>
        </div>

        {/* Timer */}
        <div className="flex justify-center mb-6">
          <div
            className={`text-lg font-bold ${
              timeLeft <= 60 ? "text-red-600" : "text-gray-700"
            }`}
          >
            ⏱️ Time left: {formatTime(timeLeft)}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          {/* OTP Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Enter OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={handleOtpChange}
              placeholder="000000"
              maxLength="6"
              className="w-full px-4 py-3 text-center text-3xl tracking-widest border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-bold"
              disabled={isLoading}
              autoFocus
            />
            <p className="text-xs text-gray-500 text-center mt-2">
              {otp.length}/6 digits entered
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-blue-700">
              <strong>ℹ️ Note:</strong> The OTP was sent to your email and will expire when the timer runs out.
            </p>
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Resend OTP */}
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-3">Didn't receive the OTP?</p>
          <button
            onClick={handleResendOTP}
            disabled={isLoading}
            className="text-indigo-600 font-semibold hover:underline disabled:opacity-50"
          >
            Resend OTP
          </button>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate("/admin/forgot-password")}
          className="w-full mt-4 text-gray-600 py-2 px-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Back to Email
        </button>
      </div>
    </div>
  );
};

export default VerifyOTP;
