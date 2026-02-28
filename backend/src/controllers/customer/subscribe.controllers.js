import { brevo } from "../../config/brevo.config.js";
import promotionModel from "../../models/admin/promotion.models.js";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";

const addSubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    const emailPresent = await promotionModel.findOne({ email: email });

    if (emailPresent) {
      return res.status(401).json(new ApiError(401, "Already Subscribe by this email."));
    }

    const emailData = {
      sender: {
        name: process.env.companyName,
        email: process.env.companyEmail,
      },
      to: [{
        email: email
      }],
      subject: `Welcome to ${process.env.companyName} – Stay Updated with Our Latest Offers`,
      htmlContent: `<div style="background: linear-gradient(135deg, #eef2ff, #f8fafc); padding:50px 0; font-family:Arial, sans-serif;">
  
  <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:14px; box-shadow:0 8px 25px rgba(0,0,0,0.08); overflow:hidden;">

    <!-- Header -->
    <div style="background: linear-gradient(90deg, #1e3a8a, #4f46e5); padding:30px; text-align:center; color:white;">
      <h2 style="margin:0; font-size:22px; letter-spacing:1px;">
        VR & Sons Import & Export
      </h2>
      <p style="margin:8px 0 0; font-size:14px; opacity:0.9;">
        Welcome to Our Exclusive Updates
      </p>
    </div>

    <!-- Body -->
    <div style="padding:40px;">

      <p style="font-size:15px; color:#4b5563; line-height:1.7;">
        Thank you for subscribing to <b>VR & Sons Import & Export</b>!  
        You are now part of our exclusive community.
      </p>

      <p style="font-size:15px; color:#4b5563; line-height:1.7;">
        Stay tuned to receive:
      </p>

      <ul style="font-size:14px; color:#4b5563; line-height:1.8; padding-left:20px;">
        <li>Latest product launches</li>
        <li>Exclusive promotions & special discounts</li>
        <li>Import & export industry updates</li>
        <li>Seasonal offers and limited-time deals</li>
      </ul>

      <!-- Promotion Highlight Box -->
      <div style="text-align:center; margin:35px 0;">
        <div style="
          display:inline-block;
          background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
          border:2px solid #4f46e5;
          padding:18px 30px;
          font-size:18px;
          font-weight:bold;
          color:#1e3a8a;
          border-radius:10px;
          box-shadow:0 4px 12px rgba(79,70,229,0.25);">
          🎉 Don’t Miss Our Upcoming Promotions!
        </div>
      </div>

      <!-- CTA Button -->
      <div style="text-align:center; margin:30px 0;">
        <a href="${"https://vr-sons.vercel.app/"}"
           style="
             display:inline-block;
             background: linear-gradient(90deg, #1e3a8a, #4f46e5);
             color:#ffffff;
             text-decoration:none;
             padding:14px 32px;
             font-size:15px;
             font-weight:bold;
             border-radius:8px;
             box-shadow:0 6px 18px rgba(79,70,229,0.3);
             transition:0.3s ease;">
           Visit Our Website
        </a>
      </div>

      <p style="font-size:14px; color:#6b7280; line-height:1.6; text-align:center;">
        Explore our products and discover exciting opportunities today.
      </p>

    </div>

    <!-- Footer -->
    <div style="background:#f9fafb; padding:20px; text-align:center; font-size:13px; color:#9ca3af;">
      <p style="margin:5px 0;">Warm Regards,</p>
      <p style="margin:5px 0;"><b style="color:#1e3a8a;">VR & Sons Import & Export Team</b></p>
      <p style="margin-top:10px;">
        © ${new Date().getFullYear()} VR & Sons Import & Export. All rights reserved.
      </p>
    </div>

  </div>

</div>`
    }

    const result = await brevo(emailData);

    if (!result) {
      return res.status(400).json(new ApiError(400, "Failed to Send Email"));
    }

    const promotionDetail = await promotionModel.create({ email });

    if (!promotionDetail) {
      return res.status(400).json(new ApiError(400, "Subscribation is failed"));
    }

    return res.status(200).json(new ApiResponse(200, null, "Successful"));
  }
  catch (err) {
    return res.status(500).json(new ApiError(500, err.message, [{ message: err.message, name: err.name }]));
  }
}

export { addSubscribe };