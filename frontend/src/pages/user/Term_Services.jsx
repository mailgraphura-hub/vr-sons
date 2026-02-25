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

const TERMS_CONTENT = [
  {
    title: "1. Acceptance of Terms",
    content: "By accessing and using the VR & Sons Import Export platform, you agree to comply with and be bound by these Terms of Service. This platform is designed as an inquiry-based B2B portal for international trade businesses. If you do not agree with these terms, please refrain from using our website."
  },
  {
    title: "2. Nature of the Platform & Inquiries",
    content: "Our website allows buyers and importers to browse products and submit product-specific inquiries without displaying public pricing. Submitting an inquiry form does not constitute a legally binding contract of sale. All commercial agreements, including pricing, minimum order quantities (MOQ), and shipping terms, will be discussed and finalized privately between VR & Sons and the buyer after an inquiry is received."
  },
  {
    title: "3. User Accounts and Information",
    content: "To submit product inquiries, users must provide accurate business information, including company name, country, email, and contact numbers. You are responsible for maintaining the confidentiality of your account credentials. We reserve the right to suspend or terminate accounts that provide false information or engage in fraudulent trade practices."
  },
  {
    title: "4. Export Compliance and Documentation",
    content: "Our export processes strictly follow proper documentation, regulatory guidelines, and international trade standards to ensure smooth cross-border transactions. Buyers are expected to comply with their respective country's import regulations and customs duties. VR & Sons holds no liability for shipments delayed or rejected due to the buyer's failure to meet local import compliance."
  },
  {
    title: "5. Product Quality and Packaging",
    content: "We maintain strict quality control at every stage of sourcing. All products are carefully packed using export-grade materials to ensure safety, durability, and protection during international transit. However, any claims regarding transit damage or quality discrepancies must be reported within the mutually agreed timeframe stipulated in the final commercial contract."
  },
  {
    title: "6. Intellectual Property",
    content: "All content on this website, including text, WEBP product images, logos, and graphics, is the intellectual property of VR & Sons or its licensors. Unauthorized use, reproduction, or distribution of this material for commercial purposes without explicit permission is strictly prohibited."
  },
  {
    title: "7. Modifications to the Service",
    content: "VR & Sons reserves the right to modify, suspend, or discontinue any part of the website, including product listings and categories, at any time without prior notice. We may also update these Terms of Service periodically. Continued use of the platform after changes are posted constitutes your acceptance of the revised terms."
  },
  {
    title: "8. Governing Law",
    content: "These Terms of Service and any separate commercial agreements established through our platform shall be governed by and construed in accordance with the laws of India, with jurisdiction in Surat, Gujarat."
  }
];

export default function TermsOfService() {
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
                Legal Information
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-neutral-900 mb-6">
              Terms of <span className="text-[#C36A4D]">Service</span>
            </h1>
            <p className="text-neutral-500 font-medium text-sm md:text-base max-w-2xl leading-relaxed">
              Please read these terms carefully before using our platform. By accessing our global trade inquiry system, you agree to the conditions outlined below.
            </p>
            {/* <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest mt-8">
              Last Updated: {lastUpdated}
            </p> */}
          </motion.div>
        </div>
      </section>

      {/* ── CONTENT SECTION ─────────────────────────────────────── */}
      <main className="flex-grow py-20 px-6 md:px-20">
        <div className="max-w-4xl mx-auto">
          
          <div className="space-y-12 md:space-y-16">
            {TERMS_CONTENT.map((section, index) => (
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
                Questions or Concerns?
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed mb-6">
                If you have any questions regarding these Terms of Service or our international trade practices, please contact our support team.
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