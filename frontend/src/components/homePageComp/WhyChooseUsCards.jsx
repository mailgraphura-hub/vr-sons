import React from "react";
import { motion } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// ██████  DATA — Edit advantages/cards here
// ─────────────────────────────────────────────────────────────────────────────

const SECTION_HEADING = {
  badge: "Our Advantages",
  title: "Why Choose\nVR & Sons?",
};

const WHY_CHOOSE_US = [
  {
    title: "Quality",
    desc: "We maintain strict quality control at every stage of sourcing and export to ensure all products meet international standards and customer expectations.",
  },
  {
    title: "Logistics",
    desc: "Our well-managed supply chain and reliable shipping partners ensure timely delivery, secure handling, and smooth global transportation of goods.",
  },
  {
    title: "Trust",
    desc: "We build long-term international relationships through ethical trade practices, transparent communication, and consistent product reliability.",
  },
  {
    title: "Packaging",
    desc: "All products are carefully packed using export-grade materials to ensure safety, durability, and protection during international transit.",
  },
  {
    title: "Global Reach",
    desc: "We connect trusted manufacturers with buyers worldwide, expanding trade opportunities across multiple international markets.",
  },
  {
    title: "Compliance",
    desc: "Our export processes follow proper documentation, regulatory guidelines, and international trade standards to ensure smooth cross-border transactions.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const WhyChooseUsCards = () => (
  <section className="bg-[#f0ede8] px-6 pt-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
    <div className="bg-white rounded-3xl overflow-hidden px-10 py-12">

      <motion.p
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="flex items-center gap-2 text-xs text-neutral-400 tracking-widest uppercase mb-5"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" /> {SECTION_HEADING.badge}
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-neutral-900 text-4xl xl:text-5xl font-light leading-[1.1] mb-10 whitespace-pre-line"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
      >
        {SECTION_HEADING.title}
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {WHY_CHOOSE_US.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            className="bg-neutral-50 border border-neutral-100 rounded-2xl p-6 hover:border-neutral-300 transition-colors"
          >
            <h3 className="text-neutral-900 font-medium text-sm mb-2">{item.title}</h3>
            <p className="text-neutral-400 text-xs leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>

    </div>
  </section>
);

export default WhyChooseUsCards;
