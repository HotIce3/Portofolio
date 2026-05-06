import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiGithub, FiLinkedin, FiMail, FiHeart } from "react-icons/fi";

export default function Footer() {
  const { t } = useTranslation();
  const location = useLocation();
  const currentYear = new Date().getFullYear();
  const isHomePage = location.pathname === "/";

  const socialLinks = [
    {
      icon: FiGithub,
      href: "https://github.com/HotIce3/",
      label: "GitHub",
    },
    {
      icon: FiLinkedin,
      href: "https://www.linkedin.com/in/fil-mat-b21958337/",
      label: "LinkedIn",
    },
    { icon: FiMail, href: "mailto:filbertmathew63@gmail.com", label: "Email" },
  ];

  return (
      <footer
        style={{
          background: "linear-gradient(180deg, #0a0a1a 0%, #050510 100%)",
          borderTop: "1px solid rgba(99, 102, 241, 0.08)",
        }}
      >
        <div className="container-custom py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <Link
                to="/"
                className="text-2xl font-bold"
                style={{
                  background: "linear-gradient(135deg, #a78bfa, #6366f1)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Filbert.dev
              </Link>
              <p className="mt-4" style={{ color: "rgba(148, 163, 184, 0.7)" }}>
                Full Stack Web Developer
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3
                className="font-semibold mb-4"
                style={{ color: "#e2e8f0" }}
              >
                Quick Links
              </h3>
              <ul className="space-y-2">
                {[
                  { to: "/projects", label: t("nav.projects") },
                  { to: "/about", label: t("nav.about") },
                  { to: "/contact", label: t("nav.contact") },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="transition-colors"
                      style={{ color: "rgba(148, 163, 184, 0.6)" }}
                      onMouseEnter={(e) =>
                        (e.target.style.color = "#a78bfa")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.color = "rgba(148, 163, 184, 0.6)")
                      }
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h3
                className="font-semibold mb-4"
                style={{ color: "#e2e8f0" }}
              >
                {t("contact.followMe")}
              </h3>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg transition-all duration-300"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      color: "rgba(148, 163, 184, 0.6)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(99, 102, 241, 0.15)";
                      e.currentTarget.style.borderColor =
                        "rgba(99, 102, 241, 0.3)";
                      e.currentTarget.style.color = "#a78bfa";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.05)";
                      e.currentTarget.style.borderColor =
                        "rgba(255, 255, 255, 0.08)";
                      e.currentTarget.style.color =
                        "rgba(148, 163, 184, 0.6)";
                    }}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div
            className="mt-12 pt-8 text-center"
            style={{
              borderTop: "1px solid rgba(99, 102, 241, 0.08)",
            }}
          >
            <p style={{ color: "rgba(148, 163, 184, 0.5)" }}>
              © {currentYear} Filbert Matthew. {t("footer.rights")}.
            </p>
            <p
              className="mt-2 text-sm flex items-center justify-center gap-1"
              style={{ color: "rgba(148, 163, 184, 0.4)" }}
            >
              {t("footer.madeWith")}{" "}
              <FiHeart style={{ color: "#f472b6" }} /> {t("footer.by")}{" "}
              Filbert Matthew
            </p>
          </div>
        </div>
    </footer>
  );
}
