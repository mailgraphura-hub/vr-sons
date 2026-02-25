import React from "react";
import { motion } from "framer-motion";

// IMPORT YOUR COMPONENTS HERE:
import Navbar from "../../components/homePageComp/Navbar";
import Footer from "../../components/homePageComp/Footer";

const FadeUp = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

const PRIVACY_CONTENT = [
  {
    title: "1. Introduction",
    content: "VR & Sons Import Export values your privacy and is committed to protecting your personal and business data. This Privacy Policy explains how we collect, use, and safeguard the information you provide when using our global B2B product inquiry platform."
  },
  {
    title: "2. Information We Collect",
    content: "When you register for an account or submit a product inquiry on our platform, we collect specific information to facilitate international trade. This includes your Name, Email, Mobile Number, Company Name, Country, Required Quantity, and any specific messages or requirements you provide[cite: 107, 108, 109, 110, 111, 112, 113]."
  },
  {
    title: "3. How We Use Your Information",
    content: "The information we collect is strictly used to process your product inquiries, communicate export quotes, manage your user dashboard, and facilitate global trade operations. When you submit an inquiry, it is automatically linked to the specific product ID to help our admin team provide accurate and timely responses[cite: 115, 139]."
  },
  {
    title: "4. Data Protection & Security",
    content: "We implement robust security measures to protect your data. This includes secure password hashing, role-based access control (differentiating between standard Users and Admins), and secure data transmission protocols to ensure your business information remains confidential."
  },
  {
    title: "5. Sharing of Information (Third Parties)",
    content: "We do not sell, trade, or rent your personal or business information to outside parties. However, to fulfill your export orders, we may share necessary logistical information with our reliable shipping partners and supply chain networks to ensure timely delivery and smooth global transportation of goods."
  },
  {
    title: "6. Cookies and Tracking Technologies",
    content: "Our website utilizes cookies to enhance performance, maintain secure user sessions (JWT/Session Authentication) [cite: 202], and provide an optimized, SEO-friendly browsing experience[cite: 189]. You can choose to disable cookies through your browser settings, though this may limit your ability to use certain features like the inquiry dashboard."
  },
  {
    title: "7. Your Data Rights",
    content: "As a registered user (Buyer/Importer), you have the right to access, update, or request the deletion of your personal data from our systems. You can manage your profile details directly through your account dashboard or by contacting our support team."
  },
  {
    title: "8. Changes to This Privacy Policy",
    content: "We may update this Privacy Policy periodically to reflect changes in international trade laws or our platform's operations. We encourage our global partners to review this page occasionally for any updates."
  }
];

export default function PrivacyPolicy() {
  const lastUpdated = "October 2025";

  return (
    <div className="bg-white text-neutral-900 font-sans min-h-screen flex flex-col">
      
      {/* ── HEADER ──────────────────────────────────────────────── */}
      <Navbar />

      {/* ── HERO SECTION ────────────────────────────────────────── */}
      <section className="pt-32 pb-16 px-6 md:px-20 bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-0.5 bg-[#C36A4D]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C36A4D]">
                Data Protection
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-neutral-900 mb-6">
              Privacy <span className="text-[#C36A4D]">Policy</span>
            </h1>
            <p className="text-neutral-500 font-medium text-sm md:text-base max-w-2xl leading-relaxed">
              Your trust is the foundation of our global trade network. Learn how we handle, secure, and protect your business data across our platform.
            </p>
            <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest mt-8">
              Effective Date: {lastUpdated}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CONTENT SECTION ─────────────────────────────────────── */}
      <main className="flex-grow py-20 px-6 md:px-20">
        <div className="max-w-4xl mx-auto">
          
          <div className="space-y-12 md:space-y-16">
            {PRIVACY_CONTENT.map((section, index) => (
              <FadeUp key={index} delay={index * 0.05}>
                <div className="group">
                  <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-4 group-hover:text-[#C36A4D] transition-colors duration-300">
                    {section.title}
                  </h2>
                  <div className="w-12 h-px bg-neutral-200 mb-5 group-hover:bg-[#C36A4D]/30 transition-colors duration-300" />
                  <p className="text-neutral-600 leading-[1.8] text-[15px] font-medium">
                    {section.content}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Contact Block */}
          <FadeUp delay={0.2}>
            <div className="mt-20 p-8 md:p-12 bg-neutral-50 border border-neutral-200 rounded-3xl">
              <h3 className="text-lg font-bold text-neutral-900 mb-3">
                Data Privacy Inquiries
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed mb-6">
                If you have questions about how we handle your data or wish to exercise your data protection rights, please reach out to us at:
              </p>
              
              <div className="space-y-2 text-sm font-medium text-neutral-800">
                <p>
                  <span className="text-neutral-400 mr-2">Email:</span> 
                  <a href="mailto:support@vrandsons.com" className="hover:text-[#C36A4D] transition-colors">
                    support@vrandsons.com
                  </a> 
                </p>
                <p>
                  <span className="text-neutral-400 mr-2">Address:</span> 
                  Kamrej, Surat, Gujarat, India 
                </p>
              </div>
            </div>
          </FadeUp>

        </div>
      </main>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <Footer />

    </div>
  );
}