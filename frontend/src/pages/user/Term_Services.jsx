import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, ShieldCheck, Globe, Package, FileText, Lock, RefreshCw, Landmark, Mail } from "lucide-react";

// IMPORT YOUR COMPONENTS HERE:
// import Navbar from "../../components/homePageComp/Navbar";
// import Footer from "../../components/homePageComp/Footer";

const TERMS_CONTENT = [
  {
    id: "acceptance",
    icon: <Scale size={20} />,
    title: "1. Acceptance of Terms",
    content: "By accessing and using the VR & Sons Import Export platform, you agree to comply with and be bound by these Terms of Service. This platform is designed as an inquiry-based B2B portal for international trade businesses. If you do not agree with these terms, please refrain from using our website."
  },
  {
    id: "nature",
    icon: <Globe size={20} />,
    title: "2. Nature of the Platform",
    content: "Our website allows buyers and importers to browse products and submit product-specific inquiries without displaying public pricing. Submitting an inquiry form does not constitute a legally binding contract of sale. All commercial agreements, including pricing, minimum order quantities (MOQ), and shipping terms, will be discussed and finalized privately between VR & Sons and the buyer after an inquiry is received."
  },
  {
    id: "accounts",
    icon: <Lock size={20} />,
    title: "3. User Accounts",
    content: "To submit product inquiries, users must provide accurate business information, including company name, country, email, and contact numbers. You are responsible for maintaining the confidentiality of your account credentials. We reserve the right to suspend or terminate accounts that provide false information or engage in fraudulent trade practices."
  },
  {
    id: "compliance",
    icon: <FileText size={20} />,
    title: "4. Export Compliance",
    content: "Our export processes strictly follow proper documentation, regulatory guidelines, and international trade standards to ensure smooth cross-border transactions. Buyers are expected to comply with their respective country's import regulations and customs duties. VR & Sons holds no liability for shipments delayed or rejected due to the buyer's failure to meet local import compliance."
  },
  {
    id: "quality",
    icon: <Package size={20} />,
    title: "5. Quality & Packaging",
    content: "We maintain strict quality control at every stage of sourcing. All products are carefully packed using export-grade materials to ensure safety, durability, and protection during international transit. However, any claims regarding transit damage or quality discrepancies must be reported within the mutually agreed timeframe stipulated in the final commercial contract."
  },
  {
    id: "intellectual",
    icon: <ShieldCheck size={20} />,
    title: "6. Intellectual Property",
    content: "All content on this website, including text, WEBP product images, logos, and graphics, is the intellectual property of VR & Sons or its licensors. Unauthorized use, reproduction, or distribution of this material for commercial purposes without explicit permission is strictly prohibited."
  },
  {
    id: "modifications",
    icon: <RefreshCw size={20} />,
    title: "7. Modifications",
    content: "VR & Sons reserves the right to modify, suspend, or discontinue any part of the website, including product listings and categories, at any time without prior notice. We may also update these Terms of Service periodically. Continued use of the platform after changes are posted constitutes your acceptance of the revised terms."
  },
  {
    id: "governing",
    icon: <Landmark size={20} />,
    title: "8. Governing Law",
    content: "These Terms of Service and any separate commercial agreements established through our platform shall be governed by and construed in accordance with the laws of India, with jurisdiction in Surat, Gujarat."
  }
];

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState(TERMS_CONTENT[0].id);

  // Smooth scroll to section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="bg-[#FCFCFC] text-neutral-900 font-sans min-h-screen">
      {/* <Navbar /> */}

      {/* ── HERO SECTION ────────────────────────────────────────── */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden bg-neutral-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#C36A4D_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-[#C36A4D]/20 text-[#C36A4D] text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
              Legal Framework
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-8">
              TERMS OF <span className="text-neutral-500 underline decoration-[#C36A4D] decoration-4 underline-offset-8">SERVICE</span>
            </h1>
            <p className="text-neutral-400 text-lg max-w-2xl leading-relaxed">
              Updated October 2025 • High-standard guidelines for global B2B partnerships and ethical trade operations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── MAIN LAYOUT ─────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Sticky Sidebar Navigation */}
          <aside className="lg:w-1/4 hidden lg:block">
            <div className="sticky top-32 space-y-2 p-6 bg-white border border-neutral-100 rounded-3xl shadow-sm">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-6 px-4">Jump to Section</p>
              {TERMS_CONTENT.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    scrollToSection(item.id);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    activeSection === item.id 
                    ? "bg-[#C36A4D] text-white shadow-lg shadow-[#C36A4D]/20" 
                    : "text-neutral-500 hover:bg-neutral-50 hover:text-[#C36A4D]"
                  }`}
                >
                  {item.icon}
                  {item.title.split('. ')[1]}
                </button>
              ))}
            </div>
          </aside>

          {/* Content Area */}
          <div className="lg:w-3/4 space-y-24">
            {TERMS_CONTENT.map((section, index) => (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                onViewportEnter={() => setActiveSection(section.id)}
                className="group scroll-mt-32"
              >
                <div className="flex items-start gap-6">
                  <div className="hidden md:flex items-center justify-center w-14 h-14 rounded-2xl bg-white border border-neutral-100 text-[#C36A4D] shadow-sm group-hover:scale-110 transition-transform duration-500">
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-6 group-hover:text-[#C36A4D] transition-colors">
                      {section.title}
                    </h2>
                    <div className="prose prose-neutral max-w-none">
                      <p className="text-neutral-600 leading-[2] text-lg font-normal">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.section>
            ))}

            {/* Support Card */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden p-8 md:p-12 bg-[#C36A4D] rounded-[2.5rem] text-white shadow-2xl shadow-[#C36A4D]/30"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              
              <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <h3 className="text-3xl font-bold mb-4">Legal Inquiry?</h3>
                  <p className="text-white/80 leading-relaxed mb-0">
                    Our compliance team is available to clarify any specific international trade regulations or terms listed here.
                  </p>
                </div>
                <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/20">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-lg text-[#C36A4D]">
                        <Mail size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-white/60 font-bold uppercase tracking-tighter">Support Email</p>
                        <a href="mailto:support@vrandsons.com" className="font-semibold hover:underline">support@vrandsons.com</a>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-lg text-[#C36A4D]">
                        <Globe size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-white/60 font-bold uppercase tracking-tighter">Office</p>
                        <p className="font-semibold uppercase text-xs">Kamrej, Surat, Gujarat, India</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  );
}