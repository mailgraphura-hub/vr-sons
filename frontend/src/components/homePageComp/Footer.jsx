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
} from "lucide-react";
import { Link } from "react-router-dom";

import logo from "../../assets/logo/NavLogo.svg";

const Footer = () => {

  const categories = [
    { name: "Food Products", path: "/CategoryProducts/699b74ee545f793544e4f6fa" },
    { name: "Spices", path: "/CategoryProducts/699b753e545f793544e4f6fc" },
    { name: "Agricultural Goods", path: "/CategoryProducts/699b759a545f793544e4f700" },
    { name: "Bricks", path: "/CategoryProducts/699b7571545f793544e4f6fe" },
  ];

  const socialIcons = [
  { icon: Linkedin, color: "hover:bg-[#0077B5]" },
  { icon: Instagram, color: "hover:bg-gradient-to-r hover:from-pink-500 hover:to-yellow-500" },
  { icon: Facebook, color: "hover:bg-[#1877F2]" },
];
  return (
    <footer className="bg-gradient-to-b from-[#f4f1ec] to-[#e9e4dc] px-4 md:px-10 pt-16 pb-12">
      <div className="bg-white rounded-3xl shadow-lg border border-neutral-200 px-8 md:px-16 py-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-8 border-b border-neutral-200">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <img
              src={logo}
              alt="VR & Sons Logo"
              className="h-20 md:h-24 w-auto object-contain"
            />

            <p className="text-sm text-neutral-700 leading-relaxed max-w-xs">
              Leading exporter of premium Food Products, Spices, Agricultural
              Goods & Bricks serving 13+ countries with certified compliance and
              dependable logistics.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-neutral-800">
                <Globe size={16} />
                Serving 13+ Countries Worldwide
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-800">
                <ShieldCheck size={16} />
                100% Compliance & Export Certified
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <div className="md:ml-6">
            <h3 className="text-sm font-semibold text-neutral-900 mb-5 tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm text-neutral-700">
              {[
                { label: "Home", href: "/" },
                { label: "Our Products", href: "/MainCategory" },
                { label: "About Us", href: "/AboutUs" },
                { label: "Blog", href: "/blog" },
                { label: "Contact", href: "/ContactUs" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-black hover:underline underline-offset-4 transition"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Export Categories */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-5 tracking-wide">
              Export Categories
            </h3>
            <ul className="space-y-3 text-sm text-neutral-700">
              {categories.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="hover:text-black hover:underline underline-offset-4 transition"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-5 tracking-wide">
              Contact Information
            </h3>

            <div className="space-y-4 text-sm text-neutral-700">
              <div className="flex gap-2 items-start">
                <Phone size={16} className="mt-1" />
                <a href="tel:+919825474047" className="hover:text-black">
                  +91 98254 74047
                </a>
              </div>

              <div className="flex gap-2 items-start">
                <Mail size={16} className="mt-1" />
                <a
                  href="mailto:support@vrandsons.com"
                  className="hover:text-black"
                >
                  support@vrandsons.com
                </a>
              </div>

              <div className="flex gap-2 items-start">
                <MapPin size={16} className="mt-1" />
                <span>Kamrej, Surat, Gujarat, India</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4 mt-6">
  {socialIcons.map(({ icon: Icon, color }, i) => (
    <a
      key={i}
      href="#"
      className={`w-10 h-10 flex items-center justify-center 
                  rounded-full border border-neutral-300 
                  text-neutral-700 bg-white shadow-sm
                  transition-all duration-300 ease-in-out
                  hover:text-white hover:scale-110 hover:shadow-lg ${color}`}
    >
      <Icon size={18} />
    </a>
  ))}
</div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-6 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm font-semibold text-neutral-900">
            © {new Date().getFullYear()} VR & Sons. Built for global trade
            excellence.
          </p>

          <div className="flex gap-8 text-sm font-semibold text-neutral-900">
            <a
              href="/Term_Services"
              className="hover:underline underline-offset-4"
            >
              Terms of Service
            </a>
            <a
              href="/PrivacyPolicy"
              className="hover:underline underline-offset-4"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
