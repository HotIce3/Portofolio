import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiExternalLink,
} from "react-icons/fi";
import { profileApi, projectsApi } from "../services/api";
import { useLanguage } from "../contexts/LanguageContext";
import LoadingSpinner from "../components/UI/LoadingSpinner";

export default function Home() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, projectsRes, skillsRes] = await Promise.all([
          profileApi.get(),
          projectsApi.getAll({ featured: true }),
          profileApi.getSkills(),
        ]);
        setProfile(profileRes.data);
        setProjects(projectsRes.data.slice(0, 3));
        setSkills(skillsRes.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  const socialLinks = [
    { icon: FiGithub, href: profile?.github_url, label: "GitHub" },
    { icon: FiLinkedin, href: profile?.linkedin_url, label: "LinkedIn" },
    { icon: FiMail, href: `mailto:${profile?.email}`, label: "Email" },
  ];

  return (
    <>
      <Helmet>
        <title>Filbert Matthew - Web Developer</title>
        <meta name="description" content="Full Stack Web Developer Portfolio" />
      </Helmet>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center pt-16 md:pt-0">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-primary-600 dark:text-primary-400 font-medium mb-4">
                {t("hero.greeting")}
              </p>
              <h1 className="heading-1 mb-4">
                <span className="text-gradient">{t("hero.name")}</span>
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
                {t("hero.title")}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg">
                {language === "id"
                  ? profile?.bio_id
                  : profile?.bio || t("hero.description")}
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Link to="/projects" className="btn-primary">
                  {t("hero.cta")}
                  <FiArrowRight className="ml-2" />
                </Link>
                <Link to="/contact" className="btn-outline">
                  {t("hero.contact")}
                </Link>
              </div>

              <div className="flex gap-4">
                {socialLinks.map(
                  (social) =>
                    social.href && (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900/50 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200"
                        aria-label={social.label}
                      >
                        <social.icon className="w-5 h-5" />
                      </a>
                    ),
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-80 h-80 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-500 to-primary-700 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-primary-500 to-primary-700 flex items-center justify-center">
                  <span className="text-8xl font-bold text-white">FM</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="section bg-gray-50 dark:bg-gray-800/50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="heading-2 mb-4">{t("about.skills")}</h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {skills.slice(0, 12).map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {skill.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="heading-2 mb-4">{t("projects.featured")}</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card overflow-hidden group"
              >
                <div className="h-48 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white opacity-50">
                    {project.title.charAt(0)}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {language === "id"
                      ? project.title_id || project.title
                      : project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {language === "id"
                      ? project.description_id || project.description
                      : project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies?.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        <FiExternalLink className="w-4 h-4" />
                        {t("projects.liveDemo")}
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        <FiGithub className="w-4 h-4" />
                        {t("projects.viewCode")}
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/projects" className="btn-primary">
              {t("projects.viewAll")}
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-2 text-white mb-4">
              {t("contact.subtitle")}
            </h2>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              {t("hero.description")}
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
            >
              {t("hero.contact")}
              <FiArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
