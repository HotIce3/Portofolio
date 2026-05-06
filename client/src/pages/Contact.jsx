import { useState, useEffect, Suspense, lazy } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  FiSend,
  FiMail,
  FiMapPin,
  FiPhone,
  FiGithub,
  FiLinkedin,
  FiTwitter,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { contactApi, profileApi } from "../services/api";

const ProjectsScene = lazy(() => import("../components/three/ProjectsScene"));

export default function Contact() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    profileApi
      .get()
      .then((res) => setProfile(res.data))
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await contactApi.send(formData);
      toast.success(t("contact.success"));
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error(error.response?.data?.error || t("contact.error"));
    } finally {
      setLoading(false);
    }
  };

  const socialLinks = [
    { icon: FiGithub, href: profile?.github_url, label: "GitHub" },
    { icon: FiLinkedin, href: profile?.linkedin_url, label: "LinkedIn" },
    { icon: FiTwitter, href: profile?.twitter_url, label: "Twitter" },
  ].filter((s) => s.href);

  return (
    <>
      <Helmet>
        <title>{t("contact.title")} - Filbert Matthew</title>
      </Helmet>

      <section className="cta-3d-section min-h-screen relative overflow-hidden">
        <div className="cta-bg-pattern" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#13111c] to-[#0a0a1a] pointer-events-none z-0"></div>
        <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-primary-600/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

        {/* 3D Scene (Background) */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <Suspense fallback={null}>
            <ProjectsScene />
          </Suspense>
        </div>

        <div className="container-custom relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-header"
          >
            <span className="section-tag">{t("nav.contact")}</span>
            <h2 className="section-title">{t("contact.title")}</h2>
            <p className="section-description">{t("contact.subtitle")}</p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sticky top-24 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <h2 className="text-xl font-semibold mb-6 text-white">
                  {t("contact.info")}
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/5 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                      <FiMail className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-300">Email</h3>
                      <a
                        href={`mailto:${profile?.email || "filbertmathew63@gmail.com"}`}
                        className="text-gray-400 hover:text-primary-400 transition-colors"
                      >
                        {profile?.email || "filbertmathew63@gmail.com"}
                      </a>
                    </div>
                  </div>

                  {profile?.phone && (
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/5 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                        <FiPhone className="w-5 h-5 text-primary-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-300">Phone</h3>
                        <a
                          href={`tel:${profile.phone}`}
                          className="text-gray-400 hover:text-primary-400 transition-colors"
                        >
                          {profile.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {profile?.location && (
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/5 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                        <FiMapPin className="w-5 h-5 text-primary-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-300">
                          {t("contact.location")}
                        </h3>
                        <p className="text-gray-400">{profile.location}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                {socialLinks.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-white/10">
                    <h3 className="font-medium text-gray-300 mb-4">
                      {t("contact.followMe")}
                    </h3>
                    <div className="flex gap-3">
                      {socialLinks.map((social) => (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-primary-500/50 hover:text-primary-400 transition-all duration-300 shadow-[0_4px_10px_rgba(0,0,0,0.2)] hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                          aria-label={social.label}
                        >
                          <social.icon className="w-5 h-5" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              <form
                onSubmit={handleSubmit}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
              >
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      {t("contact.name")}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-500 hover:bg-white/10"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      {t("contact.email")}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-500 hover:bg-white/10"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    {t("contact.subject")}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-500 hover:bg-white/10"
                    placeholder="Project Inquiry"
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    {t("contact.message")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-500 hover:bg-white/10 resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-3 px-6 bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-500 hover:to-violet-500 text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin text-xl">⏳</span>
                      {t("contact.sending")}
                    </>
                  ) : (
                    <>
                      <FiSend className="w-5 h-5" />
                      {t("contact.send")}
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
