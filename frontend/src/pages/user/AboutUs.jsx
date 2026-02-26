import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Truck,
  Globe,
  Package,
  Handshake,
  FileCheck,
  ArrowUpRight,
} from "lucide-react";

import Navbar from "../../components/homePageComp/Navbar";
import Footer from "../../components/homePageComp/Footer";

/* COUNT COMPONENT */
function Counter({ target, suffix }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(counter);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);

    return () => clearInterval(counter);
  }, [target]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export default function AboutPage() {
  return (
    <div className="bg-white text-neutral-900 font-sans overflow-x-hidden">
      <Navbar />

      {/*  HERO SECTION  */}
      <section className="relative h-[75vh] flex items-center justify-center text-center overflow-hidden">
        <img
          src="https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.35)" }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="relative z-10 px-6 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-4xl md:text-6xl font-black text-white leading-tight"
          >
            About <span className="text-[#C36A4D]">VR & Sons</span>
          </motion.h1>

          <div className="mt-8">
            <a
              href="/MainCategory"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#C36A4D] text-white text-xs font-black uppercase tracking-[0.3em] hover:shadow-[0_15px_40px_rgba(195,106,77,0.4)] transition-all duration-300"
            >
              Explore Products
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/*  BRIDGING SECTION  */}
      <section className="py-16 md:py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-black mb-6">
              Bridging Manufacturers <br />
              <span className="text-[#C36A4D]">With Global Buyers</span>
            </h2>

            <p className="text-neutral-600 leading-relaxed mb-6">
              VR & Sons Import Export is a professionally managed trading
              company dedicated to sourcing and exporting high-quality products
              worldwide. We maintain strict quality standards and transparent
              trade practices.
            </p>

            <p className="text-neutral-600 leading-relaxed">
              Our structured supply chain ensures smooth coordination from
              procurement to international delivery.
            </p>
          </div>

          <div>
            <img
              src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
              alt=""
              className="rounded-3xl shadow-xl"
            />
          </div>
        </div>
      </section>

      {/*  COUNTING NUMBERS  */}
      <section className="bg-black text-white py-14 md:py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          <div>
            <h3 className="text-4xl md:text-5xl font-black text-[#C36A4D]">
              <Counter target={25} suffix="+" />
            </h3>
            <p className="mt-3 text-sm uppercase tracking-widest text-white/70">
              Countries Exported
            </p>
          </div>

          <div>
            <h3 className="text-4xl md:text-5xl font-black text-[#C36A4D]">
              <Counter target={500} suffix="+" />
            </h3>
            <p className="mt-3 text-sm uppercase tracking-widest text-white/70">
              Global Clients
            </p>
          </div>

          <div>
            <h3 className="text-4xl md:text-5xl font-black text-[#C36A4D]">
              <Counter target={15} suffix="+" />
            </h3>
            <p className="mt-3 text-sm uppercase tracking-widest text-white/70">
              Years Experience
            </p>
          </div>
        </div>
      </section>

      {/* MISSION & VISION  */}
      <section className="py-16 md:py-20 px-6 bg-neutral-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition duration-500">
            <h3 className="text-2xl md:text-3xl font-black mb-6">
              Our <span className="text-[#C36A4D]">Mission</span>
            </h3>
            <p className="text-neutral-600 leading-relaxed">
              To simplify global trade by connecting manufacturers with reliable
              buyers worldwide, ensuring transparency, compliance, and seamless
              logistics across borders.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition duration-500">
            <h3 className="text-2xl md:text-3xl font-black mb-6">
              Our <span className="text-[#C36A4D]">Vision</span>
            </h3>
            <p className="text-neutral-600 leading-relaxed">
              To become a globally trusted export partner delivering efficiency,
              quality assurance, and long-term business growth.
            </p>
          </div>
        </div>
      </section>

      {/*  WHY CHOOSE US  */}
      <section className="py-16 md:py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-12">
            Why Choose <span className="text-[#C36A4D]">Us</span>
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Premium Quality" },
              { icon: Truck, title: "Reliable Logistics" },
              { icon: Handshake, title: "Trusted Partnerships" },
              { icon: Package, title: "Secure Packaging" },
              { icon: Globe, title: "Global Reach" },
              { icon: FileCheck, title: "Full Compliance" },
            ].map((item, i) => (
              <div
                key={i}
                className="group bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:border-[#C36A4D]/40"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#C36A4D]/10 flex items-center justify-center mb-6 group-hover:bg-[#C36A4D] transition">
                  <item.icon
                    size={22}
                    className="text-[#C36A4D] group-hover:text-white transition"
                  />
                </div>

                <h3 className="font-black text-lg mb-3 group-hover:text-[#C36A4D] transition">
                  {item.title}
                </h3>

                <p className="text-neutral-600 text-sm leading-relaxed">
                  Structured supply chains and international standards ensure
                  seamless export operations.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  READY TO TRADE  */}
      <section className="relative py-20 px-6 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.3)" }}
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-5xl font-black mb-6">
            Ready To Trade <span className="text-[#C36A4D]">Globally?</span>
          </h2>

          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Partner with us to explore reliable export opportunities and expand
            your international business network.
          </p>

          <a
            href="/login"
            className="px-10 py-4 rounded-2xl bg-[#C36A4D] text-white font-black uppercase tracking-[0.3em] text-xs hover:shadow-[0_15px_40px_rgba(195,106,77,0.5)] transition-all duration-300"
          >
            Get Started
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
