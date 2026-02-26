import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Eye, 
  Database, 
  Cookie, 
  UserCheck, 
  Lock, 
  Send, 
  FileWarning, 
  Mail, 
  Globe 
} from "lucide-react";

// IMPORT YOUR COMPONENTS HERE:
// import Navbar from "../../components/homePageComp/Navbar";
// import Footer from "../../components/homePageComp/Footer";

const PRIVACY_CONTENT = [
  {
    id: "collection",
    icon: <Database size={20} />,
    title: "1. Information We Collect",
    content: "We collect information you provide directly to us through our inquiry forms, including your name, company name, email address, phone number, and business country. This data is essential for processing B2B trade inquiries and establishing professional communication."
  },
  {
    id: "usage",
    icon: <Eye size={20} />,
    title: "2. How We Use Data",
    content: "Your information is used strictly to facilitate international trade inquiries, provide product quotations, and improve our platform's user experience. We do not use your business data for unrelated marketing purposes without your explicit consent."
  },
  {
    id: "cookies",
    icon: <Cookie size={20} />,
    title: "3. Cookies & Tracking",
    content: "VR & Sons uses cookies to enhance site navigation and analyze website traffic. Cookies help us understand which product categories are most relevant to our global buyers. You can manage your cookie preferences through your browser settings at any time."
  },
  {
    id: "security",
    icon: <Lock size={20} />,
    title: "4. Data Security",
    content: "We implement robust technical and organizational security measures to protect your business information from unauthorized access, loss, or alteration. While we strive to use commercially acceptable means to protect your data, no method of transmission over the internet is 100% secure."
  },
  {
    id: "sharing",
    icon: <Send size={20} />,
    title: "5. Third-Party Sharing",
    content: "We do not sell or rent your business data to third parties. Information may only be shared with trusted logistics partners or regulatory authorities when necessary to fulfill an export order or comply with Indian export-import laws."
  },
  {
    id: "rights",
    icon: <UserCheck size={20} />,
    title: "6. Your Data Rights",
    content: "You have the right to request access to the personal data we hold about you, or to request corrections or deletion of your information. To exercise these rights, please contact our data compliance officer through the provided support channels."
  },
  {
    id: "retention",
    icon: <FileWarning size={20} />,
    title: "7. Data Retention",
    content: "We retain your business inquiry data for as long as necessary to provide our services and comply with legal obligations, resolve disputes, and enforce our commercial agreements."
  },
  {
    id: "compliance",
    icon: <ShieldCheck size={20} />,
    title: "8. Legal Compliance",
    content: "Our privacy practices are governed by the Information Technology Act of India and international data protection standards where applicable to our global trade operations."
  }
];

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState(PRIVACY_CONTENT[0].id);

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
              Data Protection
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-8">
              PRIVACY <span className="text-neutral-500 underline decoration-[#C36A4D] decoration-4 underline-offset-8">POLICY</span>
            </h1>
            <p className="text-neutral-400 text-lg max-w-2xl leading-relaxed">
              Updated October 2025 • Transparency regarding how we handle, store, and protect your global business data.
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
              {PRIVACY_CONTENT.map((item) => (
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
            {PRIVACY_CONTENT.map((section) => (
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
                  <h3 className="text-3xl font-bold mb-4">Privacy Concerns?</h3>
                  <p className="text-white/80 leading-relaxed mb-0">
                    If you have questions about how we handle your data or wish to request data deletion, contact our privacy officer.
                  </p>
                </div>
                <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/20">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-lg text-[#C36A4D]">
                        <Mail size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-white/60 font-bold uppercase tracking-tighter">Privacy Email</p>
                        <a href="mailto:privacy@vrandsons.com" className="font-semibold hover:underline">privacy@vrandsons.com</a>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-lg text-[#C36A4D]">
                        <Globe size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-white/60 font-bold uppercase tracking-tighter">HQ Office</p>
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