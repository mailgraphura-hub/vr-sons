import React from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  ShieldCheck,
  Linkedin,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";

const COMPANY_DATA = {
  name: "VR & Sons",
  tagline: "Import Export",
  description:
    "Trusted exporters of high-quality Food Products, Spices, Agricultural Goods & Bricks to 13+ countries worldwide.",
  highlights: [
    { icon: Globe, text: "Serving 13+ Countries Globally" },
    { icon: ShieldCheck, text: "Compliance & Export Certified" },
  ],
  contact: {
    phone: "+91 98254 74047",
    email: "support@vrandsons.com",
    address: "Kamrej, Surat, Gujarat, India",
  },
  social: [
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
  ],
};

const FOOTER_LINKS = {
  quickLinks: [
    { label: "Home", href: "/" },
    { label: "Our Products", href: "/MainCategory" },
    { label: "About Us", href: "/AboutUs" },
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
  ],
};

const Footer = () => {
  return (
    <footer className="bg-[#f4f1ec] px-4 md:px-8 pt-12 pb-8">
      <div className="bg-white rounded-3xl border border-neutral-200 px-8 md:px-14 py-14">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-neutral-200">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold text-neutral-900">
              {COMPANY_DATA.name}
            </h2>

            <p className="text-xs tracking-[0.3em] uppercase text-neutral-400 mt-1">
              {COMPANY_DATA.tagline}
            </p>

            <p className="text-sm text-neutral-600 mt-5 leading-relaxed max-w-xs">
              {COMPANY_DATA.description}
            </p>

            {COMPANY_DATA.highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 mt-4 text-sm text-neutral-600"
                >
                  <Icon size={16} />
                  <span>{item.text}</span>
                </div>
              );
            })}

            {/* Social Media */}
            <div className="flex gap-4 mt-6">
              {COMPANY_DATA.social.map((item, index) => {
                const Icon = item.icon;
                return (
                  <a
                    key={index}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="w-9 h-9 flex items-center justify-center rounded-full border border-neutral-200 text-neutral-500 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-300"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm text-neutral-600">
              {FOOTER_LINKS.quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-neutral-900 transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-5">
              Export Categories
            </h3>
            <ul className="space-y-3 text-sm text-neutral-600">
              {FOOTER_LINKS.categories.map((category) => (
                <li key={category.label}>
                  <a
                    href={category.href}
                    className="hover:text-neutral-900 transition-colors duration-300"
                  >
                    {category.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-5">
              Contact Information
            </h3>
            <div className="space-y-4 text-sm text-neutral-600">
              <div className="flex items-start gap-3">
                <Phone size={16} className="mt-1" />
                <a
                  href={`tel:${COMPANY_DATA.contact.phone.replace(/[^+\d]/g, "")}`}
                >
                  {COMPANY_DATA.contact.phone}
                </a>
              </div>

              <div className="flex items-start gap-3">
                <Mail size={16} className="mt-1" />
                <a href={`mailto:${COMPANY_DATA.contact.email}`}>
                  {COMPANY_DATA.contact.email}
                </a>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-1" />
                <span>{COMPANY_DATA.contact.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 gap-4">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} {COMPANY_DATA.name}{" "}
            {COMPANY_DATA.tagline}. All rights reserved.
          </p>

          <div className="flex gap-6 text-xs text-neutral-500">
            {FOOTER_LINKS.legal.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-neutral-900 transition-colors"
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

export default Footer;
