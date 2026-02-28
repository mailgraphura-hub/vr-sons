import customerAuth_Model from "../../models/customer/auth.model.js";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";
import { cookiesForUser } from "../../utils/cookiesForUser.js";
import { passwordDecrypt, passwordEncrypt } from "../../utils/bcryption.js";
import { cloudinary, deleteFromCloudinary } from "../../config/cloudinary.config.js";
import { brevo } from '../../config/brevo.config.js';
import { OAuth2Client } from "google-auth-library"

const Signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashPassword = await passwordEncrypt(password)

    const customerDetail = customerAuth_Model({
      name,
      email,
      password: hashPassword
    });

    await customerDetail.save();

    customerDetail.password = undefined;
    customerDetail.email = undefined;

    await cookiesForUser(res, customerDetail);

    return res.status(200).json(new ApiResponse(200, null, "Customer Signup Successfully."));
  }
  catch (err) {
    return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
  }
}

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const customerDetail = await customerAuth_Model.findOne({ email: email });

    const decryptResult = await passwordDecrypt(password, customerDetail.password);

    if (!decryptResult) {
      return res.status(401).json(new ApiError(401, "Incorrect Password"));
    }

    customerDetail.password = undefined;
    customerDetail.email = undefined;
    customerDetail.contact = undefined;

    await cookiesForUser(res, customerDetail);

    return res.status(200).json(new ApiResponse(200, null, "Access Granted"));
  }
  catch (err) {
    return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]))
  }
}

const forgetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashPassword = await passwordEncrypt(password);

    const customerDetail = await customerAuth_Model.findOneAndUpdate(
      { email: email },
      { password: hashPassword }
    );

    customerDetail.email = undefined;
    customerDetail.password = undefined;
    customerDetail.contact = undefined;

    await cookiesForUser(res, customerDetail);

    return res.status(200).json(new ApiResponse(200, null, "Your password is Forget Successfully."))

  }
  catch (err) {
    return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]))
  }
}

const updateProfile = async (req, res) => {
  try {
    const { _id } = req.user;
    const { contact, gender, dob, country, state } = req.body;

    const userDetail = await customerAuth_Model.findById(_id);
    if (!userDetail) {
      return res.status(404).json({ message: "User not found" });
    }

    let profileImage = userDetail.profileImage;

    if (req.file) {
      const uploadedImage = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "image" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      profileImage = uploadedImage.secure_url;

      if (userDetail.profileImage) {
        await deleteFromCloudinary(userDetail.profileImage);
      }
    }

    const updatedCustomerDetail = await customerAuth_Model.findByIdAndUpdate(
      _id,
      {
        contact,
        gender,
        dob,
        country,
        state,
        profileImage,
      },
      { returnDocument: "after" }
    );

    return res.status(200).json(
      new ApiResponse(200, updatedCustomerDetail, "Profile Updated Successfully.")
    );
  } catch (err) {
    return res.status(500).json(
      new ApiError(500, err.message, [{ message: err.message, name: err.name }])
    );
  }
};


const getMyProfile = async (req, res) => {
  try {
    const { _id } = req.user;

    const userDetail = await customerAuth_Model.findById(_id);

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


const forgetPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const { name } = req.user

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const emailData = {
      sender: {
        name: process.env.companyName,
        email: process.env.companyEmail
      },
      to: [{
        email: email
      }],
      subject: "Password Forget Verification Otp",
      htmlContent: `
<div style="background: linear-gradient(135deg, #eef2ff, #f8fafc); padding:50px 0; font-family:Arial, sans-serif;">
  
  <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:14px; box-shadow:0 8px 25px rgba(0,0,0,0.08); overflow:hidden;">

    <!-- Header -->
    <div style="background: linear-gradient(90deg, #1e3a8a, #4f46e5); padding:30px; text-align:center; color:white;">
      <h2 style="margin:0; font-size:22px; letter-spacing:1px;">
        VR & Sons Import & Export
      </h2>
      <p style="margin:8px 0 0; font-size:14px; opacity:0.9;">
        Account Password Forget Verification
      </p>
    </div>

    <!-- Body -->
    <div style="padding:40px;">
      
      <p style="font-size:16px; color:#1f2937;">
        Dear <b>${name}</b>,
      </p>

      <p style="font-size:15px; color:#4b5563; line-height:1.7;">
        Welcome to <b>VR & Sons Import & Export</b>!  
        Please use the verification code below to complete your forget password process.
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
        If you did not request this forget password, please ignore this email.
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
      return res.status(400).json(new ApiError(400, "Failed to send email"));
    }

    return res.status(200).json(new ApiResponse(200, otp, "Otp send on email is successful"));
  }
  catch (err) {
    return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
  }
}

const GoogleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    const client = new OAuth2Client(process.env.Google_ClientId)

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.Google_ClientId
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;


    let user = await customerAuth_Model.findOne({ email });

    if (!user) {
      user = customerAuth_Model({
        email: email,
        name,
        profileImage: picture
      })

      await user.save();
    }


    await cookiesForUser(res, user);

    return res.status(200).json(new ApiResponse(200, { userEmail: email }, "Successful"));
  }
  catch (err) {
    return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name, GoogleAuth }]));
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


export { Signup, Login, forgetPassword, updateProfile, getMyProfile, signupOtp, forgetPasswordOtp, GoogleAuth, Signout };