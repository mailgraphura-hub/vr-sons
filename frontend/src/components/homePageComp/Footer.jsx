import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Globe, ShieldCheck } from "lucide-react";

// ═══════════════════════════════════════════════════════════════
//  DATA & CONFIGURATION 
//  (Update anything here, and the footer will automatically change)
// ═══════════════════════════════════════════════════════════════

const COMPANY_DATA = {
  name: "VR & Sons",
  tagline: "Import Export",
  description: "Trusted exporters of high-quality Food Products, Spices, Agricultural Goods & Bricks to 13+ countries worldwide.",
  highlights: [
    { icon: Globe, text: "Serving 13+ Countries Globally" },
    { icon: ShieldCheck, text: "Compliance & Export Certified" },
  ],
  contact: {
    phone: "+91 98254 74047",
    email: "support@vrandsons.com",
    address: "Kamrej, Surat, Gujarat, India",
  }
};

const FOOTER_LINKS = {
  quickLinks: [
    { label: "Home", href: "/" },
    { label: "Our Products", href: "/MainCategory" },
    { label: "About Us", href: "/AboutUs" },
    // { label: "Why Choose Us", href: "/#why-choose-us" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/ContactUs" },
  ],
  categories: [
    { label: "Food Products", href: "/MainCategory" },
    { label: "Spices", href: "/MainCategory" },
    { label: "Agricultural Goods", href: "/MainCategory" },
    { label: "Bricks", href: "/MainCategory" },
  ],
  legal: [
    { label: "Terms of Service", href: "/Term_Services" },
    { label: "Privacy Policy", href: "/PrivacyPolicy" },
  ]
};

// ═══════════════════════════════════════════════════════════════
//  COMPONENT
// ═══════════════════════════════════════════════════════════════

const Footer = () => {
  return (
    <footer className="bg-[#f4f1ec] px-4 md:px-8 pt-10 pb-6 font-sans">
      <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 px-8 md:px-14 py-12">
        
        {/* ── Top Section ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-neutral-100">
          
          {/* 1. Brand & Description */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xl font-semibold text-neutral-900">
              {COMPANY_DATA.name}
            </h2>
            <p className="text-xs tracking-widest uppercase text-neutral-400 mt-1">
              {COMPANY_DATA.tagline}
            </p>
            <p className="text-sm text-neutral-500 mt-4 leading-relaxed max-w-xs">
              {COMPANY_DATA.description}
            </p>

            {/* FIX: Extracted highlight.icon to a capitalized variable 'Icon' */}
            {COMPANY_DATA.highlights.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <div key={index} className="flex items-center gap-2 mt-4 text-sm text-neutral-600">
                  <Icon size={16} />
                  <span>{highlight.text}</span>
                </div>
              );
            })}
          </motion.div>

          {/* 2. Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-neutral-500">
              {FOOTER_LINKS.quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-black transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* 3. Export Categories */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">
              Export Categories
            </h3>
            <ul className="space-y-2 text-sm text-neutral-500">
              {FOOTER_LINKS.categories.map((category) => (
                <li key={category.label}>
                  <a
                    href={category.href}
                    className="hover:text-black transition-colors duration-300"
                  >
                    {category.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* 4. Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">
              Contact Information
            </h3>
            <div className="space-y-3 text-sm text-neutral-500">
              <div className="flex items-start gap-2 group">
                <Phone size={16} className="mt-1 flex-shrink-0" />
                <a href={`tel:${COMPANY_DATA.contact.phone.replace(/[^+\d]/g, '')}`} className="group-hover:text-black transition-colors">
                  {COMPANY_DATA.contact.phone}
                </a>
              </div>
              <div className="flex items-start gap-2 group">
                <Mail size={16} className="mt-1 flex-shrink-0" />
                <a href={`mailto:${COMPANY_DATA.contact.email}`} className="group-hover:text-black transition-colors">
                  {COMPANY_DATA.contact.email}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span className="leading-relaxed">{COMPANY_DATA.contact.address}</span>
              </div>
            </div>
          </motion.div>

        </div>

        {/* ── Bottom Bar ── */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-6 gap-4">
          <p className="text-xs text-neutral-400">
            © {new Date().getFullYear()} {COMPANY_DATA.name} {COMPANY_DATA.tagline}. All rights reserved.
          </p>

          <div className="flex gap-6 text-xs text-neutral-400">
            {FOOTER_LINKS.legal.map((link) => (
              <a key={link.label} href={link.href} className="hover:text-neutral-700 transition-colors">
                {link.label}
              </a>
            ))}
          </div>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;