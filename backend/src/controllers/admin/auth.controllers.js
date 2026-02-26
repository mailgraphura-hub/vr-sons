import adminAuth_Model from "../../models/admin/auth.model.js";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";
import { cookiesForUser } from "../../utils/cookiesForUser.js";
import { passwordDecrypt, passwordEncrypt } from "../../utils/bcryption.js";
import { cloudinary, deleteFromCloudinary } from "../../config/cloudinary.config.js";
import { brevo } from '../../config/brevo.config.js';

// Admin Signup
// export const adminSignup = async (req, res) => {
//     try {
//         console.log("🔧 Admin Signup API Hit");
//         console.log("Request body:", req.body);
//         const { name, email, password, company, contact, profileImage, Gender } = req.body;
        
//         // Validate required fields
//         if (!name || !email || !password || !company) {
//             return res.status(400).json(new ApiError(400, "Missing required fields: name, email, password, company"));
//         }

//         // Check if email already exists
//         const existingAdmin = await adminAuth_Model.findOne({ email });
//         if (existingAdmin) {
//             return res.status(409).json(new ApiError(409, "Email already registered"));
//         }

//         console.log("🔐 Encrypting password...");
//         const hashPassword = await passwordEncrypt(password);
//         console.log("✅ Password encrypted successfully");
        
//         const adminDetail = new adminAuth_Model({
//             name: name.trim(),
//             email,
//             password: hashPassword,
//             company,
//             contact,
//             profileImage,
//             Gender
//         });
        
//         console.log("💾 Saving admin to database...");
//         const clientDetail = await adminDetail.save();
//         console.log("✅ Admin saved to database:", clientDetail);
        
//         adminDetail.password = undefined;
//         await cookiesForUser(res, adminDetail);
//         return res.status(200).json(new ApiResponse(200, adminDetail, "Admin Signup Successfully."));
//     } catch (err) {
//         console.error("❌ Signup Error:", err);
//         console.error("Error Stack:", err.stack);
//         return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name, stack: err.stack }]));
//     }
// };

// // Admin Login
// export const adminLogin = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const adminDetail = await adminAuth_Model.findOne({ email });
//         if (!adminDetail) {
//             return res.status(404).json(new ApiError(404, "Admin not found"));
//         }
//         const isPasswordValid = await passwordDecrypt(password, adminDetail.password);
//         if (!isPasswordValid) {
//             return res.status(401).json(new ApiError(401, "Invalid credentials"));
//         }
//         adminDetail.password = undefined;
//         await cookiesForUser(res, adminDetail);
//         return res.status(200).json(new ApiResponse(200, adminDetail, "Admin Login Successfully."));
//     } catch (err) {
//         return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
//     }
// };

// // Admin Forgot Password - Send OTP
// export const adminForgotPassword = async (req, res) => {
//     try {
//         console.log("📧 Forgot Password API Hit");
//         const { email } = req.body;

//         if (!email || !email.trim()) {
//             return res.status(400).json(new ApiError(400, "Email is required"));
//         }

//         const adminDetail = await adminAuth_Model.findOne({ email: email.trim() });
//         if (!adminDetail) {
//             // Security: Don't reveal if email exists
//             console.log(`⚠️ Admin not found with email: ${email}`);
//             return res.status(404).json(new ApiError(404, "No account found with this email"));
//         }

//         // Generate OTP
//         const otp = generateOTP();
//         const otpExpiry = getOTPExpiry();

//         console.log(`🔐 Generated OTP: ${otp}, Expiry: ${otpExpiry}`);

//         // Send OTP email
//         try {
//             await sendOTPEmail(adminDetail.email, otp, adminDetail.name);
//         } catch (emailError) {
//             console.error("❌ Failed to send email:", emailError.message);
//             return res.status(500).json(new ApiError(500, "Failed to send OTP email. Please try again later."));
//         }

//         // Update admin with OTP (don't save password reset status yet)
//         adminDetail.otp = otp;
//         adminDetail.otpExpiry = otpExpiry;
//         adminDetail.isOtpVerified = false;
//         await adminDetail.save();

//         console.log("✅ OTP sent successfully");
//         return res.status(200).json(new ApiResponse(200, null, "OTP sent to your registered email"));
//     } catch (err) {
//         console.error("❌ Forgot Password Error:", err);
//         return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
//     }
// };

// // Verify OTP
// export const verifyOTP = async (req, res) => {
//     try {
//         console.log("🔍 Verify OTP API Hit");
//         const { email, otp } = req.body;

//         if (!email || !otp) {
//             return res.status(400).json(new ApiError(400, "Email and OTP are required"));
//         }

//         const adminDetail = await adminAuth_Model.findOne({ email: email.trim() });
//         if (!adminDetail) {
//             return res.status(404).json(new ApiError(404, "Admin not found"));
//         }

//         if (!adminDetail.otp) {
//             return res.status(400).json(new ApiError(400, "No OTP request found. Please request a new OTP."));
//         }

//         // Verify OTP validity
//         const otpVerification = verifyOTPValidity(adminDetail.otp, otp, adminDetail.otpExpiry);
//         if (!otpVerification.valid) {
//             console.log(`❌ OTP verification failed: ${otpVerification.message}`);
//             return res.status(400).json(new ApiError(400, otpVerification.message));
//         }

//         // Mark OTP as verified
//         adminDetail.isOtpVerified = true;
//         await adminDetail.save();

//         console.log("✅ OTP verified successfully");
//         return res.status(200).json(new ApiResponse(200, { email }, "OTP verified successfully"));
//     } catch (err) {
//         console.error("❌ OTP Verification Error:", err);
//         return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
//     }
// };

// // Reset Password
// export const resetPassword = async (req, res) => {
//     try {
//         console.log("🔐 Reset Password API Hit");
//         const { email, newPassword, confirmPassword } = req.body;

//         if (!email || !newPassword || !confirmPassword) {
//             return res.status(400).json(new ApiError(400, "Email and passwords are required"));
//         }

//         if (newPassword !== confirmPassword) {
//             return res.status(400).json(new ApiError(400, "Passwords do not match"));
//         }

//         if (newPassword.length < 6) {
//             return res.status(400).json(new ApiError(400, "Password must be at least 6 characters long"));
//         }

//         const adminDetail = await adminAuth_Model.findOne({ email: email.trim() });
//         if (!adminDetail) {
//             return res.status(404).json(new ApiError(404, "Admin not found"));
//         }

//         if (!adminDetail.isOtpVerified) {
//             return res.status(400).json(new ApiError(400, "OTP verification required before resetting password"));
//         }

//         // Encrypt new password
//         const hashPassword = await passwordEncrypt(newPassword);

//         // Update password and clear OTP
//         adminDetail.password = hashPassword;
//         adminDetail.otp = null;
//         adminDetail.otpExpiry = null;
//         adminDetail.isOtpVerified = false;
//         await adminDetail.save();

//         console.log("✅ Password reset successfully");
//         return res.status(200).json(new ApiResponse(200, null, "Password reset successfully"));
//     } catch (err) {
//         console.error("❌ Reset Password Error:", err);
//         return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
//     }
// };

// // Admin Profile
// export const adminProfile = async (req, res) => {
//     try {
//         // Assuming admin is authenticated and admin id is available in req.user.id
//         const adminId = req.user?.id;
//         if (!adminId) {
//             return res.status(401).json(new ApiError(401, "Unauthorized"));
//         }
//         const adminDetail = await adminAuth_Model.findById(adminId).select("-password");
//         if (!adminDetail) {
//             return res.status(404).json(new ApiError(404, "Admin not found"));
//         }
//         return res.status(200).json(new ApiResponse(200, adminDetail, "Admin Profile fetched successfully."));
//     } catch (err) {
//         return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
//     }
// };

// const Signup = async (req, res) => {
//   try {
//     const { name, email, password, securityKey } = req.body;

//     const hashPassword = await passwordEncrypt(password)

//     if(securityKey !== process.env.adminKey){
//         return res.status(401).json(new ApiError(401, "Wrong Security Key."))
//     }

//     const adminDetail = adminAuth_Model({
//       name,
//       email,
//       password: hashPassword
//     });

//     await adminDetail.save();

//     adminDetail.password = undefined;
//     adminDetail.email = undefined;

//     await cookiesForUser(res, adminDetail);

//     return res.status(200).json(new ApiResponse(200, null, "Customer Signup Successfully."));
//   }
//   catch (err) {
//     return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
//   }
// }




const Signup = async (req, res) => {
    try {
        const { name, email, password, securityKey } = req.body;

        
        if (!name || !email || !password || !securityKey) {
            return res.status(400).json(new ApiError(400, "Sab fields required hain"));
        }

        
        if (securityKey !== process.env.adminKey) {
            return res.status(401).json(new ApiError(401, "Wrong Security Key"));
        }

        
        const hashPassword = await passwordEncrypt(password);


        const adminDetail = new adminAuth_Model({
            name,
            email,
            password: hashPassword
        });

        await adminDetail.save();

        
        adminDetail.password = undefined;

        await cookiesForUser(res, adminDetail);

        return res.status(200).json(new ApiResponse(200, adminDetail, "Signup Successfully"));

    } catch (err) {
        return res.status(500).json(new ApiError(500, err.message));
    }
}




// const Login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const adminDetail = await adminAuth_Model.findOne({ email: email });

//     const decryptResult = await passwordDecrypt(password, adminDetail.password);

//     if (!decryptResult) {
//       return res.status(401).json(new ApiError(401, "Incorrect Password"));
//     }

//     adminDetail.password = undefined;
//     adminDetail.email = undefined;
//     adminDetail.contact = undefined;

//     await cookiesForUser(res, adminDetail);

//     return res.status(200).json(new ApiResponse(200, null, "Access Granted"));
//   }
//   catch (err) {
//     return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]))
//   }
// }


const Login = async (req, res) => {
    try {
        const { password } = req.body;

       
        const adminDetail = req.user;

        if (!password) {
            return res.status(400).json(new ApiError(400, "Password is required"));
        }

        const isPasswordCorrect = await passwordDecrypt(password, adminDetail.password);
        if (!isPasswordCorrect) {
            return res.status(401).json(new ApiError(401, "Incorrect Password"));
        }

        
        adminDetail.password = undefined;

        await cookiesForUser(res, adminDetail);

        return res.status(200).json(new ApiResponse(200, adminDetail, "Login Successfully"));

    } catch (err) {
        return res.status(500).json(new ApiError(500, err.message));
    }
}





// const forgetPassword = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const hashPassword = await passwordEncrypt(password);

//     const adminDetail = await adminAuth_Model.findOneAndUpdate(
//       { email: email },
//       { password: hashPassword }
//     );

//     adminDetail.email = undefined;
//     adminDetail.password = undefined;
//     adminDetail.contact = undefined;

//     await cookiesForUser(res, adminDetail);

//     return res.status(200).json(new ApiResponse(200, null, "Your password is Forget Successfully."))

//   }
//   catch (err) {
//     return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]))
//   }
// }


const forgetPassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;
        
        // console.log(req.body);
        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json(new ApiError(400, "Sab fields required hain"));
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json(new ApiError(400, "Passwords match nahi karte"));
        }

        if (newPassword.length < 6) {
            return res.status(400).json(new ApiError(400, "Password kam se kam 6 characters ka hona chahiye"));
        }

        const adminDetail = await adminAuth_Model.findOne({ email });
        if (!adminDetail) {
            return res.status(404).json(new ApiError(404, "Admin not found"));
        }

        
        if (!adminDetail.isOtpVerified) {
            return res.status(400).json(new ApiError(400, "Pehle OTP verify karo"));
        }

       
        const hashPassword = await passwordEncrypt(newPassword);

        
        await adminAuth_Model.findByIdAndUpdate(adminDetail._id, {
            password: hashPassword,
            otp: null,
            otpExpiry: null,
            isOtpVerified: false
        });

        return res.status(200).json(new ApiResponse(200, null, "Password reset successfully"));

    } catch (err) {
        return res.status(500).json(new ApiError(500, err.message));
    }
}










// const updateProfile = async (req, res) => {
//   try {
//     const { _id } = req.user;
//     const { contact, gender, dob, country, state } = req.body;

//     const userDetail = await adminAuth_Model.findById(_id);

//     if (userDetail.profileImage) {
//       deleteFromCloudinary(userDetail.profileImage)
//     }

//     let profileImage = null;

//     if (req.file) {
//       profileImage = await new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           { folder: "image" },
//           (err, result) => {
//             if (err) reject(err);
//             else resolve(result.secure_url);
//           }
//         );
//         stream.end(req.file.buffer);
//       })
//     }

//     const updatedadminDetail = await adminAuth_Model.findByIdAndUpdate(
//       _id,
//       {
//         contact,
//         gender,
//         dob,
//         country,
//         state,
//         profileImage
//       }
//     )

//     return res.status(200).json(new ApiResponse(200, updatedadminDetail, "Profile Update Successfully."));

//   }
//   catch (err) {
//     return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
//   }
// }








const updateProfile = async (req, res) => {
  try {
    const { _id } = req.user;
    
    const { name, email, contact, gender, dob, country, state } = req.body;

    const userDetail = await adminAuth_Model.findById(_id);
    if (!userDetail) {
      return res.status(404).json(new ApiResponse(404, null, "Admin not found"));
    }

    
    let profileImage = userDetail.profileImage; 

    if (req.file) {
      
      if (userDetail.profileImage) {
        await deleteFromCloudinary(userDetail.profileImage);
      }

      profileImage = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "admin_profiles" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result.secure_url);
          }
        );
        stream.end(req.file.buffer);
      });
    }

    
    const updatedadminDetail = await adminAuth_Model.findByIdAndUpdate(
      _id,
      {
        $set: {
          name,
          email, 
          contact,
          gender,
          dob,
          country,
          state,
          profileImage 
        }
      },
      { new: true } 
    ).select("-password"); 

    return res.status(200).json(new ApiResponse(200, updatedadminDetail, "Profile Updated Successfully."));

  } catch (err) {
    console.error("Update Error:", err);
    return res.status(500).json(new ApiError(500, "Internal Server Error", [{ message: err.message }]));
  }
};





















const getMyProfile = async (req, res) => {
  try {
    const { _id } = req.user;
      console.log(_id);
    const userDetail = await adminAuth_Model.findById(_id);
    console.log(userDetail)
    if (!userDetail) {
      return res.status(404).json(new ApiError(404, "User Profile is not found"));
    }

    return res.status(200).json(new ApiResponse(200, userDetail, "Successful"));
  }
  catch (err) {
    return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]))
  }
}


const signupOtp = async (req, res) => {
  try {
    const { email, name } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const emailData = {
      sender: {
        name: process.env.companyName,
        email: process.env.companyEmail,
      },
      to: [{
        email: email,
      }],
      subject: `Your ${process.env.companyName} Signup Verification Code`,
      htmlContent: `
<div style="background: linear-gradient(135deg, #eef2ff, #f8fafc); padding:50px 0; font-family:Arial, sans-serif;">
  
  <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:14px; box-shadow:0 8px 25px rgba(0,0,0,0.08); overflow:hidden;">

    <!-- Header -->
    <div style="background: linear-gradient(90deg, #1e3a8a, #4f46e5); padding:30px; text-align:center; color:white;">
      <h2 style="margin:0; font-size:22px; letter-spacing:1px;">
        VR & Sons Import & Export
      </h2>
      <p style="margin:8px 0 0; font-size:14px; opacity:0.9;">
        Secure Account Verification
      </p>
    </div>

    <!-- Body -->
    <div style="padding:40px;">
      
      <p style="font-size:16px; color:#1f2937;">
        Dear <b>${name}</b>,
      </p>

      <p style="font-size:15px; color:#4b5563; line-height:1.7;">
        Welcome to <b>VR & Sons Import & Export</b>!  
        Please use the verification code below to complete your registration.
      </p>

      <!-- OTP Box -->
      <div style="text-align:center; margin:35px 0;">
        <div style="
          display:inline-block;
          background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
          border:2px solid #4f46e5;
          padding:18px 40px;
          font-size:30px;
          letter-spacing:8px;
          font-weight:bold;
          color:#1e3a8a;
          border-radius:10px;
          box-shadow:0 4px 12px rgba(79,70,229,0.25);">
          ${otp}
        </div>
      </div>

      <p style="font-size:14px; color:#6b7280; text-align:center;">
        This OTP is valid for <b style="color:#1e3a8a;">5 minutes</b>.
      </p>

      <p style="font-size:14px; color:#6b7280; line-height:1.6; text-align:center;">
        If you did not request this registration, please ignore this email.
      </p>

    </div>

    <!-- Footer -->
    <div style="background:#f9fafb; padding:20px; text-align:center; font-size:13px; color:#9ca3af;">
      <p style="margin:5px 0;">Regards,</p>
      <p style="margin:5px 0;"><b style="color:#1e3a8a;">VR & Sons Import & Export Team</b></p>
      <p style="margin-top:10px;">
        © ${new Date().getFullYear()} VR & Sons Import & Export. All rights reserved.
      </p>
    </div>

  </div>

</div>
`
    }

    const result = await brevo(emailData);

    if (!result) {
      return res.status(400).json(new ApiError(400, "Failed to Send Email"));
    }

    return res.status(200).json(new ApiResponse(200, otp, "Otp send on email is successfully"));

  }
  catch (err) {
    return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
  }
}


// const forgetPasswordOtp = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const { name } = req.user

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     const emailData = {
//       sender: {
//         name: process.env.companyName,
//         email: process.env.companyEmail
//       },
//       to: [{
//         email: email
//       }],
//       subject: "Password Forget Verification Otp",
//       htmlContent: `
// <div style="background: linear-gradient(135deg, #eef2ff, #f8fafc); padding:50px 0; font-family:Arial, sans-serif;">
  
//   <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:14px; box-shadow:0 8px 25px rgba(0,0,0,0.08); overflow:hidden;">

//     <!-- Header -->
//     <div style="background: linear-gradient(90deg, #1e3a8a, #4f46e5); padding:30px; text-align:center; color:white;">
//       <h2 style="margin:0; font-size:22px; letter-spacing:1px;">
//         VR & Sons Import & Export
//       </h2>
//       <p style="margin:8px 0 0; font-size:14px; opacity:0.9;">
//         Account Password Forget Verification
//       </p>
//     </div>

//     <!-- Body -->
//     <div style="padding:40px;">
      
//       <p style="font-size:16px; color:#1f2937;">
//         Dear <b>${name}</b>,
//       </p>

//       <p style="font-size:15px; color:#4b5563; line-height:1.7;">
//         Welcome to <b>VR & Sons Import & Export</b>!  
//         Please use the verification code below to complete your forget password process.
//       </p>

//       <!-- OTP Box -->
//       <div style="text-align:center; margin:35px 0;">
//         <div style="
//           display:inline-block;
//           background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
//           border:2px solid #4f46e5;
//           padding:18px 40px;
//           font-size:30px;
//           letter-spacing:8px;
//           font-weight:bold;
//           color:#1e3a8a;
//           border-radius:10px;
//           box-shadow:0 4px 12px rgba(79,70,229,0.25);">
//           ${otp}
//         </div>
//       </div>

//       <p style="font-size:14px; color:#6b7280; text-align:center;">
//         This OTP is valid for <b style="color:#1e3a8a;">5 minutes</b>.
//       </p>

//       <p style="font-size:14px; color:#6b7280; line-height:1.6; text-align:center;">
//         If you did not request this forget password, please ignore this email.
//       </p>

//     </div>

//     <!-- Footer -->
//     <div style="background:#f9fafb; padding:20px; text-align:center; font-size:13px; color:#9ca3af;">
//       <p style="margin:5px 0;">Regards,</p>
//       <p style="margin:5px 0;"><b style="color:#1e3a8a;">VR & Sons Import & Export Team</b></p>
//       <p style="margin-top:10px;">
//         © ${new Date().getFullYear()} VR & Sons Import & Export. All rights reserved.
//       </p>
//     </div>

//   </div>

// </div>
// `
//     }

//     const result = await brevo(emailData);

//     if (!result) {
//       return res.status(400).json(new ApiError(400, "Failed to send email"));
//     }

//     return res.status(200).json(new ApiResponse(200, otp, "Otp send on email is successful"));
//   }
//   catch (err) {
//     return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
//   }
// }



const forgetPasswordOtp = async (req, res) => {
    try {
        
        const adminDetail = req.user;

        
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

       
        await adminAuth_Model.findByIdAndUpdate(adminDetail._id, {
            otp,
            otpExpiry,
            isOtpVerified: false
        });

       
        const emailData = {
            sender: {
                name: process.env.companyName,
                email: process.env.companyEmail
            },
            to: [{ email: adminDetail.email }],
            subject: "Password Reset OTP",
            htmlContent: `
<div style="background: linear-gradient(135deg, #eef2ff, #f8fafc); padding:50px 0; font-family:Arial, sans-serif;">
  <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:14px; box-shadow:0 8px 25px rgba(0,0,0,0.08); overflow:hidden;">
    <div style="background: linear-gradient(90deg, #1e3a8a, #4f46e5); padding:30px; text-align:center; color:white;">
      <h2 style="margin:0; font-size:22px;">VR & Sons Import & Export</h2>
      <p style="margin:8px 0 0; font-size:14px; opacity:0.9;">Password Reset Verification</p>
    </div>
    <div style="padding:40px;">
      <p style="font-size:16px; color:#1f2937;">Dear <b>${adminDetail.name}</b>,</p>
      <p style="font-size:15px; color:#4b5563; line-height:1.7;">
        Use the OTP below to reset your password.
      </p>
      <div style="text-align:center; margin:35px 0;">
        <div style="display:inline-block; background: linear-gradient(135deg, #e0e7ff, #c7d2fe); border:2px solid #4f46e5; padding:18px 40px; font-size:30px; letter-spacing:8px; font-weight:bold; color:#1e3a8a; border-radius:10px;">
          ${otp}
        </div>
      </div>
      <p style="font-size:14px; color:#6b7280; text-align:center;">
        This OTP is valid for <b style="color:#1e3a8a;">5 minutes</b>.
      </p>
    </div>
    <div style="background:#f9fafb; padding:20px; text-align:center; font-size:13px; color:#9ca3af;">
      <p><b style="color:#1e3a8a;">VR & Sons Import & Export Team</b></p>
    </div>
  </div>
</div>`
        };

        const result = await brevo(emailData);
        if (!result) {
            return res.status(400).json(new ApiError(400, "Failed to send email"));
        }

        
        return res.status(200).json(new ApiResponse(200, null, "OTP sent to your email"));

    } catch (err) {
        return res.status(500).json(new ApiError(500, err.message));
    }
}







const Signout = async (req, res) => {
    try {
        res.clearCookie("AccessToken");
        res.clearCookie("RefreshToken");

        return res.status(200).json(new ApiResponse(200, null, "Signout Successfully"))
    }
    catch (err) {
        return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]))
    }
}






const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json(new ApiError(400, "Email aur OTP required hain"));
        }

        const adminDetail = await adminAuth_Model.findOne({ email });
        if (!adminDetail) {
            return res.status(404).json(new ApiError(404, "Admin not found"));
        }

        
        if (!adminDetail.otp) {
            return res.status(400).json(new ApiError(400, "Pehle OTP request karo"));
        }

        
        if (new Date() > adminDetail.otpExpiry) {
            return res.status(400).json(new ApiError(400, "OTP expire ho gaya, dobara bhejo"));
        }

        
        if (adminDetail.otp !== otp) {
            return res.status(400).json(new ApiError(400, "Galat OTP hai"));
        }

      
        await adminAuth_Model.findByIdAndUpdate(adminDetail._id, {
            isOtpVerified: true
        });

        return res.status(200).json(new ApiResponse(200, null, "OTP verified successfully"));

    } catch (err) {
        return res.status(500).json(new ApiError(500, err.message));
    }
}



// export { Signup, Login, forgetPassword, updateProfile, getMyProfile, signupOtp, forgetPasswordOtp, Signout };



export { 
    Signup, Login, forgetPassword, verifyOTP,
    updateProfile, getMyProfile, 
    signupOtp, forgetPasswordOtp, Signout 
};