export const createPromotionEmail = (offerTitle, offerDescription) => {
    return `
    <div style="background:linear-gradient(135deg,#eef2ff,#f8fafc);padding:50px 0;font-family:Arial,sans-serif;">
  
  <div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:14px;
              box-shadow:0 12px 30px rgba(0,0,0,0.08);overflow:hidden;">

    <!-- Header -->
    <div style="background:linear-gradient(90deg,#1e3a8a,#4f46e5);
                padding:35px;text-align:center;color:#ffffff;">
      <h2 style="margin:0;font-size:24px;letter-spacing:1px;">
        VR & Sons Import & Export
      </h2>
      <p style="margin:8px 0 0;font-size:14px;opacity:0.9;">
        Exclusive Promotions & Latest Updates
      </p>
    </div>

    <!-- Body -->
    <div style="padding:40px;">
      
      <!-- Offer Badge -->
      <div style="text-align:center;margin-bottom:25px;">
        <span style="background:#e0e7ff;color:#1e3a8a;
                     padding:8px 18px;border-radius:50px;
                     font-size:13px;font-weight:bold;">
          🔥 Limited Time Offer
        </span>
      </div>

      <!-- Offer Title -->
      <h3 style="color:#111827;font-size:20px;text-align:center;margin-top:0;">
        ${offerTitle}
      </h3>

      <!-- Offer Description -->
      <p style="color:#4b5563;font-size:15px;line-height:1.7;text-align:center;margin-bottom:30px;">
        ${offerDescription}
      </p>

      <!-- Highlight Box -->
      <div style="background:linear-gradient(135deg,#e0e7ff,#c7d2fe);
                  padding:20px;border-radius:10px;text-align:center;
                  border:1px solid #c7d2fe;margin-bottom:30px;">
        <p style="margin:0;font-size:16px;color:#1e3a8a;font-weight:bold;">
          🚀 Explore our newest products and unbeatable deals today!
        </p>
      </div>

      <!-- CTA Button -->
      <div style="text-align:center;">
        <a href="https://vr-sons.vercel.app/"
           style="
             display:inline-block;
             background:linear-gradient(90deg,#1e3a8a,#4f46e5);
             color:#ffffff;
             padding:14px 35px;
             font-size:15px;
             font-weight:bold;
             text-decoration:none;
             border-radius:8px;
             box-shadow:0 8px 20px rgba(79,70,229,0.3);
             transition:all 0.3s ease;">
          Visit Our Website
        </a>
      </div>

      <!-- Divider -->
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:35px 0;" />

      <!-- Closing -->
      <p style="font-size:14px;color:#6b7280;text-align:center;line-height:1.6;">
        Thank you for being a valued subscriber.  
        We look forward to serving your import & export needs.
      </p>

    </div>

    <!-- Footer -->
    <div style="background:#f9fafb;padding:20px;text-align:center;
                font-size:12px;color:#9ca3af;">
      <p style="margin:5px 0;">Warm Regards,</p>
      <p style="margin:5px 0;">
        <b style="color:#1e3a8a;">VR & Sons Import & Export Team</b>
      </p>
      <p style="margin-top:10px;">
        © ${new Date().getFullYear()} VR & Sons Import & Export. All rights reserved.
      </p>
    </div>

  </div>
</div>
    `;
};