import React, { useState } from "react";
import { motion } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// ██████  DATA — Edit all footer content here
// ─────────────────────────────────────────────────────────────────────────────

const FOOTER_DATA = {
  companyName: "VR & Sons",
  tagline: "Bridging India to\nthe World",
  description:
    "Trusted exporters of premium-grade Food Products, Spices, Agricultural Goods & Bricks — serving buyers across 13+ countries.",
  contact: {
    phones: ["98254 74047", "98254 74047", "98254 74047"],
    email: "support@vrandsons.com",
    address: "Kamrej, Surat, Gujarat, India",
  },
  quickLinks: [
    { label: "Home",          href: "#" },
    { label: "Our Products",  href: "#" },
    { label: "About Us",      href: "#" },
    { label: "Why Choose Us", href: "#" },
    { label: "Blog",          href: "#" },
    { label: "Contact",       href: "#" },
  ],
  categories: [
    { label: "Food Products",      href: "#" },
    { label: "Spices",             href: "#" },
    { label: "Agricultural Goods", href: "#" },
    { label: "Bricks",             href: "#" },
  ],
  newsletter: {
    placeholder: "Your email address",
    ctaLabel: "Subscribe",
    successLabel: "Subscribed ✓",
    note: "Stay updated with latest trade news & product launches.",
  },
  certifications: ["APEDA Certified", "FSSAI Compliant", "ISO Standards", "Phytosanitary Docs"],
  legal: {
    copyright: "© 2025 VR & Sons Import Export. All rights reserved.",
    links: [
      { label: "Terms of Service", href: "#" },
      { label: "Privacy Policy",   href: "#" },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const Footer2 = () => {
  const [email, setEmail]           = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer
      className="bg-[#f0ede8] px-3 md:px-6 pt-6 pb-6"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="rounded-3xl overflow-hidden" style={{ background: "#1c1c1c" }}>

        {/* ── HERO STRIP — big tagline across top ── */}
        <div className="px-8 md:px-14 pt-12 pb-8 border-b border-white/8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">

            {/* Logo + tagline */}
            <div>
              {/* Logo mark */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-3 mb-5"
              >
                <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1c1c1c" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold tracking-widest uppercase" style={{ letterSpacing: "0.18em" }}>
                    {FOOTER_DATA.companyName}
                  </p>
                  <p className="text-white/30 text-[10px] tracking-widest uppercase">Import Export</p>
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-white font-light leading-[1.05] whitespace-pre-line"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(2.2rem, 5vw, 4rem)",
                }}
              >
                {FOOTER_DATA.tagline}
              </motion.h2>
            </div>

            {/* Description + certifications */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:max-w-xs"
            >
              <p className="text-white/40 text-xs leading-relaxed mb-5">
                {FOOTER_DATA.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {FOOTER_DATA.certifications.map((cert, i) => (
                  <motion.span
                    key={cert}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                    className="text-[10px] text-white/40 border border-white/10 rounded-full px-3 py-1 tracking-wide"
                  >
                    {cert}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-b border-white/8">

          {/* Quick Links */}
          <div className="px-8 md:px-10 py-10 border-b sm:border-b-0 sm:border-r border-white/8">
            <p className="text-white/25 text-[10px] tracking-widest uppercase mb-6">
              Quick Links
            </p>
            <nav className="flex flex-col gap-3">
              {FOOTER_DATA.quickLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 + i * 0.06 }}
                  className="group flex items-center gap-2 text-white/50 text-sm hover:text-white transition-colors"
                >
                  <span className="w-0 group-hover:w-3 h-px bg-white transition-all duration-300 ease-out" />
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </div>

          {/* Product Categories */}
          <div className="px-8 md:px-10 py-10 border-b sm:border-b-0 lg:border-r border-white/8">
            <p className="text-white/25 text-[10px] tracking-widest uppercase mb-6">
              Our Categories
            </p>
            <div className="flex flex-col gap-4">
              {FOOTER_DATA.categories.map((cat, i) => (
                <motion.a
                  key={cat.label}
                  href={cat.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 + i * 0.07 }}
                  className="group flex items-center justify-between text-white/50 text-sm hover:text-white transition-colors border-b border-white/5 pb-4 last:border-0 last:pb-0"
                >
                  <span>{cat.label}</span>
                  <svg
                    width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2"
                    className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transition-transform duration-300"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="px-8 md:px-10 py-10 border-b lg:border-b-0 border-r-0 lg:border-r border-white/8">
            <p className="text-white/25 text-[10px] tracking-widest uppercase mb-6">
              Contact Us
            </p>
            <div className="flex flex-col gap-4">
              {/* Phones */}
              <div>
                <p className="text-white/20 text-[9px] tracking-widest uppercase mb-2">Phone</p>
                {FOOTER_DATA.contact.phones.map((ph, i) => (
                  <motion.a
                    key={i}
                    href={`tel:${ph.replace(/\s/g, "")}`}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.06 }}
                    className="block text-white/50 text-sm hover:text-white transition-colors mb-1"
                  >
                    +91 {ph}
                  </motion.a>
                ))}
              </div>
              {/* Email */}
              <div>
                <p className="text-white/20 text-[9px] tracking-widest uppercase mb-2">Email</p>
                <a
                  href={`mailto:${FOOTER_DATA.contact.email}`}
                  className="text-white/50 text-sm hover:text-white transition-colors break-all"
                >
                  {FOOTER_DATA.contact.email}
                </a>
              </div>
              {/* Address */}
              <div>
                <p className="text-white/20 text-[9px] tracking-widest uppercase mb-2">Address</p>
                <p className="text-white/50 text-sm leading-relaxed">{FOOTER_DATA.contact.address}</p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="px-8 md:px-10 py-10">
            <p className="text-white/25 text-[10px] tracking-widest uppercase mb-6">
              Newsletter
            </p>
            <p className="text-white/35 text-xs leading-relaxed mb-6">
              {FOOTER_DATA.newsletter.note}
            </p>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={FOOTER_DATA.newsletter.placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white/70 placeholder-white/20 outline-none focus:border-white/30 transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              />
              <motion.button
                onClick={() => { if (email) setSubscribed(true); }}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.12)" }}
                whileTap={{ scale: 0.97 }}
                className="w-full border border-white/15 text-white/60 hover:text-white rounded-xl px-4 py-3 text-xs tracking-wide transition-colors"
              >
                {subscribed ? FOOTER_DATA.newsletter.successLabel : FOOTER_DATA.newsletter.ctaLabel}
              </motion.button>
            </div>
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="px-8 md:px-14 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/20 text-[11px]">{FOOTER_DATA.legal.copyright}</p>
          <div className="flex items-center gap-6">
            {FOOTER_DATA.legal.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-white/20 text-[11px] hover:text-white/50 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer2;