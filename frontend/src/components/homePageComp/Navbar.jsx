import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo/TextLogo.png";

const navLinks = [
  { id: 1, label: "Home", href: "/" },
  { id: 2, label: "About Us", href: "/AboutUs" },
  { id: 3, label: "Category", href: "/MainCategory" },
  { id: 4, label: "Contact Us", href: "/ContactUs" },
  { id: 5, label: "Blog", href: "/blog" },
];

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dashboardLink, setDashboardLink] = useState(null);
  const lastScrollY = useRef(0);
  const location = useLocation();

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

  useEffect(() => {
    const admin = localStorage.getItem("admin");
    const access = localStorage.getItem("access");

    if (admin === "true") {
      setDashboardLink("/admin/dashboard");
    } else if (access === "grant") {
      setDashboardLink("/user/dashboard");
    } else {
      setDashboardLink(null);
    }
  }, []);

  const isActive = (href) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  const ProfileIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path
        fillRule="evenodd"
        d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <section
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ease-in-out pt-2 pb-2 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-[1500px] mx-auto px-4 md:px-8">
        {/* Main navbar row */}
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
          <ul className="hidden md:flex items-center gap-10 text-sm text-neutral-700">
            {navLinks.map((link) => (
              <li key={link.id} className="cursor-pointer transition">
                <a
                  href={link.href}
                  className={`hover:text-black transition ${
                    isActive(link.href)
                      ? "font-black text-black"
                      : "font-semibold"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {dashboardLink ? (
              <Link
                to={dashboardLink}
                className="hidden md:inline-flex items-center justify-center w-10 h-10 rounded-full bg-black text-white hover:bg-neutral-800 transition-all duration-300 shadow-sm"
                aria-label="Go to Dashboard"
              >
                <ProfileIcon />
              </Link>
            ) : (
              <a
                href="/login"
                className="hidden md:inline-flex px-5 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-neutral-800 transition-all duration-300 shadow-sm"
              >
                Get Started
              </a>
            )}

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

        {/* Mobile Dropdown Menu */}
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
                  className={`block px-4 py-2.5 rounded-xl text-sm hover:bg-neutral-50 hover:text-black transition ${
                    isActive(link.href)
                      ? "font-black text-black"
                      : "font-semibold text-neutral-700"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}

            <li className="mt-2">
              {dashboardLink ? (
                <Link
                  to={dashboardLink}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-black text-white text-sm font-semibold hover:bg-neutral-800 transition"
                >
                  <ProfileIcon />
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block text-center w-full px-4 py-2.5 rounded-xl bg-black text-white text-sm font-semibold hover:bg-neutral-800 transition"
                >
                  Get Started
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Navbar;