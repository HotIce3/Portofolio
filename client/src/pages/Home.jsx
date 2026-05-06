import { useState, useEffect, lazy, Suspense } from "react";
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
  FiChevronDown,
} from "react-icons/fi";
import {
  SiReact,
  SiVuedotjs,
  SiJavascript,
  SiTypescript,
  SiHtml5,
  SiCss3,
  SiTailwindcss,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiPostgresql,
  SiMongodb,
  SiPython,
  SiGit,
  SiDocker,
  SiVisualstudiocode,
  SiFigma,
  SiVercel,
  SiGithub,
} from "react-icons/si";
import { TbApi } from "react-icons/tb";
import { profileApi, projectsApi } from "../services/api";
import { useLanguage } from "../contexts/LanguageContext";
import LoadingSpinner from "../components/UI/LoadingSpinner";

import HeroScene from "../components/three/HeroScene";
import SkillsScene from "../components/three/SkillsScene";
import ProjectsScene from "../components/three/ProjectsScene";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

export default function Home() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  // Fallback data so 3D portfolio renders even without backend
  const fallbackProfile = {
    name: "Filbert Matthew",
    title: "Full Stack Web Developer",
    bio: "Passionate Full Stack Developer creating modern web applications with cutting-edge technologies. Experienced in React, Node.js, and cloud deployment.",
    bio_id: "Full Stack Developer yang bersemangat dalam membuat aplikasi web modern dengan teknologi terkini. Berpengalaman di React, Node.js, dan cloud deployment.",
    email: "filbertmathew63@gmail.com",
    github_url: "https://github.com/HotIce3/",
    linkedin_url: "https://www.linkedin.com/in/fil-mat-b21958337/",
  };

  const fallbackSkills = [
    { id: 1, name: "React", category: "Frontend", proficiency: 90 },
    { id: 2, name: "JavaScript", category: "Frontend", proficiency: 92 },
    { id: 3, name: "TypeScript", category: "Frontend", proficiency: 80 },
    { id: 4, name: "Node.js", category: "Backend", proficiency: 85 },
    { id: 5, name: "PostgreSQL", category: "Backend", proficiency: 82 },
    { id: 6, name: "Tailwind CSS", category: "Frontend", proficiency: 88 },
    { id: 7, name: "Python", category: "Backend", proficiency: 75 },
    { id: 8, name: "Next.js", category: "Frontend", proficiency: 78 },
    { id: 9, name: "Git", category: "Tools", proficiency: 88 },
    { id: 10, name: "Docker", category: "Tools", proficiency: 70 },
    { id: 11, name: "Vue.js", category: "Frontend", proficiency: 72 },
    { id: 12, name: "MongoDB", category: "Backend", proficiency: 76 },
  ];

  const [profile, setProfile] = useState(fallbackProfile);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState(fallbackSkills);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, projectsRes, skillsRes] = await Promise.allSettled([
          profileApi.get(),
          projectsApi.getAll({ featured: true }),
          profileApi.getSkills(),
        ]);
        if (profileRes.status === "fulfilled") {
          setProfile(profileRes.value.data.profile || fallbackProfile);
        }
        if (projectsRes.status === "fulfilled") {
          const data = projectsRes.value.data;
          setProjects(Array.isArray(data) ? data.slice(0, 3) : []);
        }
        if (skillsRes.status === "fulfilled") {
          setSkills(skillsRes.value.data.length ? skillsRes.value.data : fallbackSkills);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const socialLinks = [
    { icon: FiGithub, href: profile?.github_url, label: "GitHub" },
    { icon: FiLinkedin, href: profile?.linkedin_url, label: "LinkedIn" },
    { icon: FiMail, href: `mailto:${profile?.email}`, label: "Email" },
  ];

  const skillIcons = {
    React: { icon: SiReact, color: "#61DAFB" },
    "Vue.js": { icon: SiVuedotjs, color: "#4FC08D" },
    JavaScript: { icon: SiJavascript, color: "#F7DF1E" },
    TypeScript: { icon: SiTypescript, color: "#3178C6" },
    HTML5: { icon: SiHtml5, color: "#E34F26" },
    CSS3: { icon: SiCss3, color: "#1572B6" },
    "Tailwind CSS": { icon: SiTailwindcss, color: "#06B6D4" },
    "Next.js": { icon: SiNextdotjs, color: "#a78bfa" },
    "Node.js": { icon: SiNodedotjs, color: "#339933" },
    "Express.js": { icon: SiExpress, color: "#a78bfa" },
    PostgreSQL: { icon: SiPostgresql, color: "#4169E1" },
    MongoDB: { icon: SiMongodb, color: "#47A248" },
    Python: { icon: SiPython, color: "#3776AB" },
    "REST API": { icon: TbApi, color: "#6366F1" },
    Git: { icon: SiGit, color: "#F05032" },
    Docker: { icon: SiDocker, color: "#2496ED" },
    "VS Code": { icon: SiVisualstudiocode, color: "#007ACC" },
    Figma: { icon: SiFigma, color: "#F24E1E" },
    Vercel: { icon: SiVercel, color: "#a78bfa" },
    GitHub: { icon: SiGithub, color: "#a78bfa" },
  };

  return (
    <>
      <Helmet>
        <title>Filbert Matthew - Web Developer | 3D Portfolio</title>
        <meta
          name="description"
          content="Full Stack Web Developer Portfolio - Immersive 3D Experience"
        />
      </Helmet>

      {/* ═══════════════════════════════════════════ */}
      {/* HERO SECTION WITH 3D BACKGROUND            */}
      {/* ═══════════════════════════════════════════ */}
      <section className="hero-3d-section">
        {/* 3D Canvas Background */}
        <div className="hero-3d-canvas">
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </div>

        {/* Gradient overlays */}
        <div className="hero-gradient-top" />
        <div className="hero-gradient-bottom" />

        {/* Content */}
        <div className="container-custom hero-3d-content">
          <div className="hero-3d-grid">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="hero-text-block"
            >
              <motion.div
                variants={fadeUp}
                custom={0}
                className="hero-badge"
              >
                <span className="hero-badge-dot" />
                <span>{t("hero.greeting")}</span>
              </motion.div>

              <motion.h1 variants={fadeUp} custom={1} className="hero-title">
                <span className="hero-title-gradient">{t("hero.name")}</span>
              </motion.h1>

              <motion.h2 variants={fadeUp} custom={2} className="hero-subtitle">
                {t("hero.title")}
              </motion.h2>

              <motion.p variants={fadeUp} custom={3} className="hero-description">
                {language === "id"
                  ? profile?.bio_id
                  : profile?.bio || t("hero.description")}
              </motion.p>

              <motion.div
                variants={fadeUp}
                custom={4}
                className="hero-actions"
              >
                <Link to="/projects" className="hero-btn-primary" id="cta-projects">
                  <span>{t("hero.cta")}</span>
                  <FiArrowRight className="hero-btn-icon" />
                </Link>
                <Link to="/contact" className="hero-btn-outline" id="cta-contact">
                  <span>{t("hero.contact")}</span>
                </Link>
              </motion.div>

              <motion.div
                variants={fadeUp}
                custom={5}
                className="hero-socials"
              >
                {socialLinks.map(
                  (social) =>
                    social.href && (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hero-social-link"
                        aria-label={social.label}
                      >
                        <social.icon className="w-5 h-5" />
                      </a>
                    ),
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="hero-scroll-indicator"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <FiChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* SKILLS SECTION WITH 3D CONSTELLATION       */}
      {/* ═══════════════════════════════════════════ */}
      <section className="skills-3d-section" id="skills-section">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <span className="section-tag">Technologies</span>
            <h2 className="section-title">{t("about.skills")}</h2>
            <p className="section-description">
              Interactive 3D skill constellation — hover to explore
            </p>
          </motion.div>

          {/* 3D Skills Constellation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="skills-3d-container"
          >
            <Suspense fallback={<div className="skills-loading">Loading 3D...</div>}>
              <SkillsScene />
            </Suspense>
          </motion.div>

          {/* Skill Badges Fallback / Additional Display */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="skills-badge-grid"
          >
            {skills.slice(0, 12).map((skill, index) => {
              const skillData = skillIcons[skill.name];
              const IconComponent = skillData?.icon;

              return (
                <motion.div
                  key={skill.id}
                  variants={fadeUp}
                  custom={index}
                  className="skill-badge-3d"
                  style={{
                    "--skill-color": skillData?.color || "#6366f1",
                  }}
                >
                  {IconComponent && (
                    <IconComponent
                      className="skill-badge-icon"
                      style={{ color: skillData.color }}
                    />
                  )}
                  <span className="skill-badge-name">{skill.name}</span>
                  <span className="skill-badge-level">{skill.proficiency}%</span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* FEATURED PROJECTS WITH 3D BACKGROUND       */}
      {/* ═══════════════════════════════════════════ */}
      <section className="projects-3d-section" id="projects-section">
        {/* 3D Background */}
        <div className="projects-3d-bg">
          <Suspense fallback={null}>
            <ProjectsScene />
          </Suspense>
        </div>

        <div className="container-custom projects-3d-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <span className="section-tag">Portfolio</span>
            <h2 className="section-title">{t("projects.featured")}</h2>
          </motion.div>

          <div className="projects-3d-grid">
            {projects.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="project-card-3d"
              >
                <div className="project-card-image">
                  {project.thumbnail ? (
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="project-card-img"
                    />
                  ) : (
                    <div className="project-card-placeholder">
                      <span>{project.title.charAt(0)}</span>
                    </div>
                  )}
                  <div className="project-card-overlay" />
                </div>

                <div className="project-card-body">
                  <h3 className="project-card-title">
                    {language === "id"
                      ? project.title_id || project.title
                      : project.title}
                  </h3>
                  <p className="project-card-desc">
                    {language === "id"
                      ? project.description_id || project.description
                      : project.description}
                  </p>

                  <div className="project-card-tech">
                    {project.tech_stack?.slice(0, 4).map((tech) => (
                      <span key={tech} className="project-tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="project-card-links">
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                      >
                        <FiExternalLink className="w-4 h-4" />
                        {t("projects.liveDemo")}
                      </a>
                    )}
                  </div>
                </div>

                {/* Glass border effect */}
                <div className="project-card-glow" />
              </motion.article>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="projects-cta"
          >
            <Link to="/projects" className="hero-btn-primary">
              <span>{t("projects.viewAll")}</span>
              <FiArrowRight className="hero-btn-icon" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* CTA SECTION                                */}
      {/* ═══════════════════════════════════════════ */}
      <section className="cta-3d-section">
        <div className="cta-bg-pattern" />
        <div className="container-custom cta-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="cta-title">{t("contact.subtitle")}</h2>
            <p className="cta-description">{t("hero.description")}</p>
            <Link to="/contact" className="cta-button" id="cta-contact-bottom">
              <span>{t("hero.contact")}</span>
              <FiArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
