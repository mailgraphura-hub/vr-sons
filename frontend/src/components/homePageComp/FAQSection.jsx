import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// ██████  DATA — Edit FAQ questions and answers here
// ─────────────────────────────────────────────────────────────────────────────

const FAQ_HEADING = {
  badge: "Explore Our Advantages",
  title: "Frequent Asked\nQuestions",
  subtitle:
    "At VR & Sons, we offer more than just export services; we provide an unparalleled trade experience tailored to meet your needs and exceed your expectations.",
};

const FAQS = [
  {
    q: "What types of products do you export?",
    a: "We export a wide range of products including Food Products, Spices, Agricultural Goods, and Bricks — all sourced and quality-checked to meet international standards.",
  },
  {
    q: "How can I place an inquiry for a product?",
    a: "Browse our product catalog, open any product detail page, and click 'Send Inquiry'. Fill in your details and requirements — our team will respond within 24 hours.",
  },
  {
    q: "Do you display product prices on the website?",
    a: "No. Prices vary based on quantity, destination, and market conditions. We use an inquiry-based model so we can offer you the most competitive, customized pricing.",
  },
  {
    q: "What is the minimum order quantity (MOQ)?",
    a: "MOQ varies by product. Each product detail page displays the specific MOQ. You can also mention your required quantity in the inquiry form.",
  },
  {
    q: "Which countries do you export to?",
    a: "We currently export to 13+ countries across the Middle East, Southeast Asia, Europe, and Africa. We are continuously expanding our global reach.",
  },
  {
    q: "What certifications do you follow?",
    a: "We follow APEDA guidelines, FSSAI norms where applicable, and standard international trade documentation including phytosanitary certificates, COO, and commercial invoices.",
  },
  {
    q: "Can I get product samples before placing a bulk order?",
    a: "Yes. Please mention your interest in samples in the inquiry form and our team will guide you through the process.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const FAQItem = ({ faq, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="border-b border-neutral-100 last:border-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="text-sm text-neutral-800 group-hover:text-neutral-600 transition-colors pr-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {faq.q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          className="text-neutral-400 flex-shrink-0 text-xl leading-none"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-xs text-neutral-500 leading-relaxed pr-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const FAQSection = () => (
  <section className="bg-[#f0ede8] px-6 pt-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
    <div className="bg-white rounded-3xl overflow-hidden px-10 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

        {/* Left */}
        <div>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="flex items-center gap-2 text-xs text-neutral-400 tracking-widest uppercase mb-5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" /> {FAQ_HEADING.badge}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-neutral-900 text-4xl xl:text-5xl font-light leading-[1.1] mb-6 whitespace-pre-line"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {FAQ_HEADING.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xs text-neutral-400 leading-relaxed max-w-xs"
          >
            {FAQ_HEADING.subtitle}
          </motion.p>
        </div>

        {/* Right */}
        <div className="pt-2">
          {FAQS.map((faq, i) => <FAQItem key={i} faq={faq} index={i} />)}
        </div>

      </div>
    </div>
  </section>
);

export default FAQSection;
