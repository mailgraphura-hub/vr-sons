import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone, Mail, MapPin, ChevronDown,
  Clock, Globe, HelpCircle
} from "lucide-react";

import Navbar from "../../components/homePageComp/Navbar";
import Footer from "../../components/homePageComp/Footer";

// ═══════════════════════════════════════════════════════════════
//  DATA
// ═══════════════════════════════════════════════════════════════

const CONTACT_INFO = [
  { icon: Phone, label: "Phone Numbers", lines: ["98254 74047", "98254 74047", "98254 74047"] },
  { icon: Mail, label: "Email Address", lines: ["support@vrandsons.com"] },
  { icon: MapPin, label: "Office Address", lines: ["Kamrej, Surat", "Gujarat, India"] },
  { icon: Clock, label: "Business Hours", lines: ["Mon – Sat: 9:00 AM – 7:00 PM", "Sunday: Closed"] },
];

const FAQ_DATA = [
  {
    question: "Do I need to create an account to send an inquiry?",
    answer: "Yes, to ensure secure and streamlined communication, we request all our buyers to create an account. Once logged in, you can send product-specific inquiries directly from your personalized dashboard."
  },
  {
    question: "What is your Minimum Order Quantity (MOQ)?",
    answer: "Our MOQ varies depending on the product category (Spices, Agricultural Goods, Bricks, etc.). Please log in and view the specific product details, or mention your required quantity in your inquiry."
  },
  {
    question: "Do you provide sample shipments for quality checks?",
    answer: "Absolutely. We understand the importance of quality assurance in global trade. Sample shipments can be arranged upon request before finalizing bulk commercial orders."
  },
  {
    question: "What are your standard export payment terms?",
    answer: "We generally work with standard international trade payment terms including Letter of Credit (L/C) and Telegraphic Transfer (T/T). Specific terms can be negotiated based on the order volume and relationship."
  },
  {
    question: "How do you ensure the safe transit of goods?",
    answer: "All our products are packed using export-grade materials. We partner with reliable international logistics providers to ensure secure handling and timely delivery across our 13+ export countries."
  }
];

// ═══════════════════════════════════════════════════════════════

const FadeUp = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const SectionLabel = ({ children }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="w-6 h-0.5 bg-[#C36A4D]" />
    <span className="text-[9px] font-black uppercase tracking-[0.5em] text-[#C36A4D]">
      {children}
    </span>
  </div>
);

// ── FAQ Accordion Item ─────────────────────────────────────────
const FAQItem = ({ faq, isOpen, onClick }) => {
  return (
    <div className="border border-neutral-200 rounded-2xl bg-white overflow-hidden transition-all duration-300 hover:border-[#C36A4D]/30">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 text-left bg-transparent"
      >
        <span className="text-neutral-900 font-bold text-sm md:text-base pr-4">
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center flex-shrink-0"
        >
          <ChevronDown size={16} className="text-[#C36A4D]" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-5 pb-5 text-neutral-500 text-sm leading-relaxed border-t border-neutral-100 pt-4">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// ── Main Component ────────────────────────────────────────────
export default function ContactUs() {
  const [openFAQ, setOpenFAQ] = useState(0); // First FAQ open by default

  return (
    <div className="bg-white text-neutral-900 font-sans overflow-x-hidden min-h-screen">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative h-[60vh] flex flex-col justify-end px-6 md:px-20 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1800&q=80"
            alt="Contact Hero"
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.2) saturate(0.6)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        <div className="absolute right-24 top-0 w-px h-full bg-gradient-to-b from-transparent via-[#C36A4D]/30 to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-7xl mx-auto w-full"
        >
          <SectionLabel>Get In Touch</SectionLabel>
          <h1
            className="font-black uppercase tracking-tighter leading-[0.82] text-white mb-5"
            style={{ fontSize: "clamp(3.5rem, 9vw, 8.5rem)" }}
          >
            Contact <span className="text-[#C36A4D]">Us</span>
          </h1>
          <p className="text-white/70 text-base max-w-md border-l-2 border-[#C36A4D]/50 pl-5 leading-relaxed">
            Our global support team is ready to assist you with onboarding, compliance, and trade inquiries.
          </p>
        </motion.div>
      </section>

      {/* ── CONTACT INFO CARDS ─────────────────────────────────── */}
      <section className="py-20 px-6 md:px-20 border-b border-neutral-100 bg-neutral-50/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CONTACT_INFO.map((item, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div className="group bg-white border border-neutral-200 shadow-sm rounded-3xl p-7 h-full flex flex-col justify-between
                hover:border-[#C36A4D]/30 hover:shadow-[0_20px_50px_-15px_rgba(195,106,77,0.08)]
                transition-all duration-500">
                <div>
                  <div className="w-11 h-11 rounded-2xl bg-[#C36A4D]/10 border border-[#C36A4D]/20 flex items-center justify-center mb-6
                    group-hover:bg-[#C36A4D] group-hover:border-[#C36A4D] transition-all duration-300">
                    <item.icon size={18} className="text-[#C36A4D] group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-[8px] font-black uppercase tracking-[0.4em] text-neutral-400 mb-3">
                    {item.label}
                  </p>
                  {item.lines.map((line, j) => (
                    <p key={j} className="text-neutral-800 text-sm font-semibold leading-relaxed">{line}</p>
                  ))}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── FAQ + MAP SECTION ─────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-20 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-14">
        <Navbar/>

          {/* ── FAQ SECTION (Replaced the Form) ─── (3/5 width) */}
          <div className="lg:col-span-3">
            <FadeUp>
              <div className="flex items-center gap-3 mb-2">
                <HelpCircle size={16} className="text-[#C36A4D]" />
                <SectionLabel>Trade Queries</SectionLabel>
              </div>
              <h2
                className="text-neutral-900 font-black uppercase tracking-tighter mb-10"
                style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
              >
                Frequently Asked <span className="text-[#C36A4D]">Questions</span>
              </h2>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="space-y-4">
                {FAQ_DATA.map((faq, index) => (
                  <FAQItem 
                    key={index} 
                    faq={faq} 
                    isOpen={openFAQ === index}
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  />
                ))}
              </div>
            </FadeUp>
            
            {/* Call to action prompting them to login */}
            <FadeUp delay={0.2}>
               <div className="mt-10 p-6 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                 <div>
                    <h4 className="text-neutral-900 font-bold mb-1">Ready to request a quote?</h4>
                    <p className="text-neutral-500 text-sm">Create an account to browse products and send direct inquiries.</p>
                 </div>
                 <a 
                   href="/login" 
                   className="whitespace-nowrap px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-neutral-800 transition-colors"
                 >
                   Login / Register
                 </a>
               </div>
            </FadeUp>
          </div>

          {/* ── SIDEBAR MAP & INFO ─── (2/5 width) */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Map embed */}
            <FadeUp delay={0.1}>
              <div className="rounded-3xl overflow-hidden border border-neutral-200 shadow-sm h-64">
                <iframe
                  title="VR & Sons Location"
                  src="https://maps.google.com/maps?q=Kamrej,Surat,Gujarat,India&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                />
              </div>
            </FadeUp>

            {/* Quick info panel */}
            <FadeUp delay={0.15}>
              <div className="bg-neutral-50 border border-neutral-200 shadow-sm rounded-3xl p-8 flex-1">
                <div className="flex items-center gap-2 mb-6">
                  <Globe size={14} className="text-[#C36A4D]" />
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-neutral-500">
                    Global Trade Inquiry
                  </p>
                </div>

                <h3 className="text-neutral-900 text-xl font-black uppercase tracking-tight mb-4">
                  Why Trade With Us?
                </h3>

                <ul className="space-y-4">
                  {[
                    "Strict Quality Control",
                    "Direct manufacturer pricing",
                    "Export documentation support",
                    "Reliable Global Logistics",
                    "Dedicated account manager",
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-neutral-600 text-sm font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C36A4D] mt-2 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 pt-6 border-t border-neutral-200">
                  <p className="text-[8px] font-black uppercase tracking-[0.4em] text-neutral-400 mb-3">
                    Inquiry Response Time
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-neutral-700 text-sm font-bold">Within 24 business hours</span>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>

        </div>
      </section>

       <Footer/>

    </div>
  );
}