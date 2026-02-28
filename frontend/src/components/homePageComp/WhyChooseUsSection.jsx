import React from "react";
import { motion } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// ██████  DATA — Edit all "Why Choose Us" content here
// ─────────────────────────────────────────────────────────────────────────────

const WHY_SECTION = {
  badge: "Explore Our Advantages",
  heading: "Why VR & Sons\nStands Unrivalled?",
  ctaLabel: "Send Inquiry Now",
};

const ADVANTAGES = [
  {
    title: "Quality Assurance",
    desc: "We maintain strict quality control at every stage of sourcing and export to ensure all products meet international standards and customer expectations.",
    icon: "shield",
  },
  {
    title: "Reliable Logistics",
    desc: "Our well-managed supply chain and reliable shipping partners ensure timely delivery, secure handling, and smooth global transportation of goods.",
    icon: "truck",
  },
  {
    title: "Trust & Transparency",
    desc: "We build long-term international relationships through ethical trade practices, transparent communication, and consistent product reliability.",
    icon: "handshake",
  },
  {
    title: "Export-Grade Packaging",
    desc: "All products are carefully packed using export-grade materials to ensure safety, durability, and protection during international transit.",
    icon: "package",
  },
  {
    title: "Global Reach",
    desc: "We connect trusted manufacturers with buyers worldwide, expanding trade opportunities across 13+ international markets.",
    icon: "globe",
  },
  {
    title: "Full Compliance",
    desc: "Our export processes follow proper documentation, regulatory guidelines, and international trade standards to ensure smooth cross-border transactions.",
    icon: "document",
  },
  {
    title: "Remote Order Placement",
    desc: "Submit inquiries online from anywhere in the world. We handle all formalities and keep you updated at every step of the export process.",
    icon: "remote",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const AdvantageIcon = ({ type }) => {
  const icons = {
    shield:    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    truck:     <><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></>,
    handshake: <><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" /><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></>,
    package:   <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></>,
    globe:     <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>,
    document:  <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>,
    remote:    <><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></>,
  };
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      {icons[type]}
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const WhyChooseUsSection = () => (
  <section className="bg-[#f0ede8] pt-6 px-3 md:px-6 pb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
    <div className="bg-white rounded-3xl overflow-hidden px-5 md:px-10 py-8 md:py-12">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8 md:mb-12">
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 text-xs text-neutral-400 tracking-widest uppercase mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
            {WHY_SECTION.badge}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-neutral-900 text-3xl md:text-5xl xl:text-6xl font-light leading-[1.05] whitespace-pre-line"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {WHY_SECTION.heading}
          </motion.h2>
        </div>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-3 bg-black text-white rounded-full px-6 py-3 text-sm self-start flex-shrink-0"
        >
          <motion.span
            className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
            </svg>
          </motion.span>
          {WHY_SECTION.ctaLabel}
        </motion.button>
      </div>

      {/* Top row — 4 columns on large */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 border-t border-neutral-100 pt-8 md:pt-10 mb-8 md:mb-10">
        {ADVANTAGES.slice(0, 4).map((adv, i) => (
          <motion.div
            key={adv.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="text-neutral-400 mb-3"><AdvantageIcon type={adv.icon} /></div>
            <h4 className="text-sm font-semibold text-neutral-900 mb-2 leading-tight">{adv.title}</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">{adv.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Bottom row — 3 columns on large */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 border-t border-neutral-100 pt-8 md:pt-10">
        {ADVANTAGES.slice(4).map((adv, i) => (
          <motion.div
            key={adv.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="text-neutral-400 mb-3"><AdvantageIcon type={adv.icon} /></div>
            <h4 className="text-sm font-semibold text-neutral-900 mb-2 leading-tight">{adv.title}</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">{adv.desc}</p>
          </motion.div>
        ))}
      </div>

    </div>
  </section>
);

export default WhyChooseUsSection;
