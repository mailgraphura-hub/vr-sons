import SibApiV3Sdk from "sib-api-v3-sdk";

/**
 * Generate a random 6-digit OTP
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Calculate OTP expiry time (10 minutes from now)
 */
export const getOTPExpiry = () => {
  return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
};

/**
 * Send OTP email using Brevo
 */
export const sendOTPEmail = async (recipientEmail, otp, recipientName = "User") => {
  try {
    console.log(`📧 Preparing to send OTP to: ${recipientEmail}`);
    
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      throw new Error("BREVO_API_KEY not configured");
    }

    const client = SibApiV3Sdk.ApiClient.instance;
    client.authentications["api-key"].apiKey = apiKey;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const email = {
      to: [{ email: recipientEmail, name: recipientName }],
      sender: { email: process.env.BREVO_SENDER_EMAIL || "noreply@importexport.com", name: "Import Export" },
      subject: "Your OTP for Password Reset",
      htmlContent: `
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
            <div style="max-width: 600px; background-color: white; margin: 0 auto; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #333; margin: 0 0 10px 0;">Password Reset</h1>
                <p style="color: #666; margin: 0;">Use this OTP to reset your password</p>
              </div>

              <div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
                <h2 style="color: #2c3e50; font-size: 36px; letter-spacing: 5px; margin: 0; font-family: 'Courier New', monospace; font-weight: bold;">${otp}</h2>
                <p style="color: #999; margin: 10px 0 0 0; font-size: 14px;">Valid for 10 minutes</p>
              </div>

              <div style="background-color: #e8f4f8; padding: 15px; border-left: 4px solid #2196F3; margin-bottom: 20px;">
                <p style="color: #1565c0; margin: 0; font-weight: bold;">⚠️ Security Notice</p>
                <p style="color: #555; margin: 5px 0 0 0; font-size: 14px;">
                  Never share this OTP with anyone. Our team will never ask for it.
                </p>
              </div>

              <p style="color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
                Didn't request this? It's possible that someone else is trying to access your account. 
                You can safely ignore this message if this wasn't you.
              </p>

              <div style="border-top: 1px solid #e0e0e0; padding-top: 20px;">
                <p style="color: #999; font-size: 12px; margin: 0; text-align: center;">
                  © 2026 Import Export. All rights reserved. | 
                  <a href="http://localhost:3000" style="color: #2196F3; text-decoration: none;">Visit our website</a>
                </p>
              </div>

            </div>
          </body>
        </html>
      `,
      replyTo: { email: process.env.BREVO_REPLY_EMAIL || "support@importexport.com" },
      tags: ["otp", "password-reset"]
    };

    await apiInstance.sendTransacEmail(email);
    console.log(`✅ OTP email sent successfully to ${recipientEmail}`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending OTP email:`, error.message);
    throw error;
  }
};

/**
 * Verify if OTP is valid and not expired
 */
export const verifyOTPValidity = (storedOTP, providedOTP, otpExpiry) => {
  // Check if OTP matches
  if (storedOTP !== providedOTP) {
    return { valid: false, message: "Invalid OTP" };
  }

  // Check if OTP has expired
  if (new Date() > new Date(otpExpiry)) {
    return { valid: false, message: "OTP has expired. Please request a new one." };
  }

  return { valid: true, message: "OTP verified successfully" };
};
