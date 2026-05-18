import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { useLanguage } from "../../contexts/LanguageContext";

export default function Navbar() {
  const { t } = useTranslation();
  const { toggleLanguage, currentLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { path: "/", label: t("nav.home") },
    { path: "/projects", label: t("nav.projects") },
    { path: "/about", label: t("nav.about") },
    { path: "/contact", label: t("nav.contact") },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "navbar-3d-scrolled" : "navbar-3d-transparent"
      }`}
      style={{
        background: scrolled ? "rgba(10, 10, 26, 0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(99, 102, 241, 0.1)" : "none",
      }}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl md:text-2xl font-bold"
            style={{
              background: "linear-gradient(135deg, #a78bfa, #6366f1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            <span>Filbert.dev</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `relative font-medium transition-colors duration-200 ${
                        isActive
                          ? "text-violet-400"
                          : "text-gray-300 hover:text-violet-300"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {link.label}
                        {isActive && (
                          <motion.div
                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-violet-400"
                            layoutId="navbar-indicator"
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleLanguage}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl p-3 transition-colors hover:bg-white/10"
                title={t("language.toggle")}
                aria-label={t("language.toggle")}
              >
                <span className="text-lg">{currentLanguage.flag}</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleLanguage}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl p-3 transition-colors hover:bg-white/10"
              title={t("language.toggle")}
              aria-label={t("language.toggle")}
            >
              <span className="text-lg">{currentLanguage.flag}</span>
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl p-3 text-gray-200 transition-colors hover:bg-white/10"
              aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              {isOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-navigation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-3 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a1a]/95 shadow-2xl backdrop-blur-xl"
            >
              <ul className="space-y-1 p-2">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      className={({ isActive }) =>
                        `block w-full rounded-xl px-4 py-3 text-left text-base font-medium transition-colors ${
                          isActive
                            ? "text-violet-400 bg-violet-900/20"
                            : "text-gray-300 hover:bg-white/5"
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
