import React, { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import logo from "../../assets/logo/TextLogo.png"; 

const navLinks = [
  { id: 1, label: "Home", href: "/" },
  { id: 2, label: "About Us", href: "AboutUs" },
  { id: 3, label: "Category", href: "/MainCategory" },
  { id: 4, label: "Contact Us", href: "/ContactUs" },
  { id: 5, label: "Blog", href: "/blog" },
];

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsVisible(false);
        setMenuOpen(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ease-in-out pt-2 pb-2 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-[1500px] mx-auto px-4 md:px-8">

        {/* Main navbar row - Solid White Background */}
        <div className="flex items-center justify-between px-5 md:px-8 py-3 md:py-4 rounded-full bg-white shadow-md border border-gray-100">

          {/* Logo Section */}
          <Link to="/" className="flex items-center">
            <img 
              src={logo} 
              alt="Logo" 
              className="h-8 md:h-10 w-auto object-contain" 
            />
          </Link>

          {/* Center Links — desktop only */}
          <ul className="hidden md:flex items-center gap-10 text-sm font-semibold text-neutral-700">
            {navLinks.map((link) => (
              <li key={link.id} className="hover:text-black cursor-pointer transition">
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <a 
              href="/login"
              className="hidden md:inline-flex px-5 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-neutral-800 transition-all duration-300 shadow-sm"
            >
              Get Started
            </a>

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-full border border-neutral-200 bg-white shadow-sm gap-1.5"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              <span
                className={`block h-0.5 w-4 bg-black rounded-full transition-all duration-300 origin-center ${
                  menuOpen ? "rotate-45 translate-y-[6px]" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-4 bg-black rounded-full transition-all duration-300 ${
                  menuOpen ? "opacity-0 scale-x-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-4 bg-black rounded-full transition-all duration-300 origin-center ${
                  menuOpen ? "-rotate-45 -translate-y-[6px]" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu - Solid White */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="flex flex-col gap-1 px-4 py-4 rounded-2xl bg-white shadow-xl border border-gray-100">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-black transition"
                >
                  {link.label}
                </a>
              </li>
            ))}

            <li className="mt-2">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block text-center w-full px-4 py-2.5 rounded-xl bg-black text-white text-sm font-semibold hover:bg-neutral-800 transition"
              >
                Get Started
              </Link>
            </li>
          </ul>
        </div>

      </div>
    </section>
  );
};

export default Navbar;