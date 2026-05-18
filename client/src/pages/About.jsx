import { useState, useEffect, useRef, Suspense, lazy } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  FiDownload,
  FiMapPin,
  FiMail,
  FiBriefcase,
  FiBook,
  FiCode,
  FiGithub,
  FiLinkedin,
  FiUser,
  FiAward,
  FiCpu,
} from "react-icons/fi";

const SkillsScene = lazy(() => import("../components/three/SkillsScene"));
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
import { profileApi } from "../services/api";
import { useLanguage } from "../contexts/LanguageContext";
import LoadingSpinner from "../components/UI/LoadingSpinner";

/* ── Animated counter hook ── */
function useCounter(target, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

/* ── Typing animation hook ── */
function useTypingEffect(texts, speed = 80, pause = 1800) {
  const [displayed, setDisplayed] = useState("");
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIdx];
    let timeout;
    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx((c) => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx((c) => c - 1), speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setTextIdx((i) => (i + 1) % texts.length);
    }
    setDisplayed(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, textIdx, texts, speed, pause]);

  return displayed;
}

/* ── Stat card with animated counter ── */
function StatCard({ icon: Icon, label, value, color, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useCounter(value, 1200, inView);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay }}
      className="about-stat-card"
      style={{ "--stat-color": color }}
    >
      <div className="about-stat-icon">
        <Icon />
      </div>
      <div className="about-stat-value">{count}+</div>
      <div className="about-stat-label">{label}</div>
    </motion.div>
  );
}

export default function About() {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const fallbackProfile = {
    name: "Filbert Matthew",
    title: "Web Developer",
    bio: "Passionate web developer with expertise in building modern web applications. I love crafting clean, performant, and user-friendly digital experiences using the latest technologies.",
    bio_id:
      "Web developer yang bersemangat dengan keahlian membangun aplikasi web modern. Saya suka membuat pengalaman digital yang bersih, performatif, dan ramah pengguna menggunakan teknologi terkini.",
    email: "filbertmathew63@gmail.com",
    github_url: "https://github.com/HotIce3/",
    linkedin_url: "https://www.linkedin.com/in/fil-mat-b21958337/",
  };

  const fallbackSkills = [
    { id: "fallback-1", name: "React", category: "Frontend", proficiency: 90 },
    {
      id: "fallback-2",
      name: "JavaScript",
      category: "Frontend",
      proficiency: 92,
    },
    {
      id: "fallback-3",
      name: "TypeScript",
      category: "Frontend",
      proficiency: 80,
    },
    { id: "fallback-4", name: "Node.js", category: "Backend", proficiency: 85 },
    {
      id: "fallback-5",
      name: "PostgreSQL",
      category: "Backend",
      proficiency: 82,
    },
    {
      id: "fallback-6",
      name: "Tailwind CSS",
      category: "Frontend",
      proficiency: 88,
    },
    { id: "fallback-7", name: "Python", category: "Backend", proficiency: 75 },
    {
      id: "fallback-8",
      name: "Next.js",
      category: "Frontend",
      proficiency: 78,
    },
    { id: "fallback-9", name: "Git", category: "Tools", proficiency: 88 },
    { id: "fallback-10", name: "Docker", category: "Tools", proficiency: 70 },
    {
      id: "fallback-11",
      name: "Vue.js",
      category: "Frontend",
      proficiency: 72,
    },
    {
      id: "fallback-12",
      name: "MongoDB",
      category: "Backend",
      proficiency: 76,
    },
  ];

  const fallbackEducation = [
    {
      id: "current-s1-mikroskil",
      institution: "Universitas Mikroskil",
      degree: language === "id" ? "S1" : "Bachelor Degree",
      field:
        language === "id" ? "Teknik Informatika" : "Informatics Engineering",
      location: "Medan, Sumatera Utara",
      is_current: true,
      description:
        language === "id"
          ? "Sedang menempuh pendidikan S1 Teknik Informatika di Mikroskil, Medan, Sumatera Utara."
          : "Currently pursuing a Bachelor Degree in Informatics Engineering at Mikroskil, Medan, North Sumatra.",
      description_id:
        "Sedang menempuh pendidikan S1 Teknik Informatika di Mikroskil, Medan, Sumatera Utara.",
    },
  ];

  const [profile, setProfile] = useState(fallbackProfile);
  const [skills, setSkills] = useState(() =>
    [...fallbackSkills].sort((a, b) =>
      b.proficiency !== a.proficiency
        ? b.proficiency - a.proficiency
        : a.name.localeCompare(b.name),
    ),
  );
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState(fallbackEducation);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("skills");
  const [hoveredSkill, setHoveredSkill] = useState(null);

  const typingTexts =
    language === "id"
      ? [
          "Full Stack Developer",
          "UI/UX Enthusiast",
          "Problem Solver",
          "Tech Explorer",
        ]
      : [
          "Full Stack Developer",
          "UI/UX Enthusiast",
          "Problem Solver",
          "Tech Explorer",
        ];
  const typedText = useTypingEffect(typingTexts);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, skillsRes, expRes, eduRes] =
          await Promise.allSettled([
            profileApi.get(),
            profileApi.getSkills(),
            profileApi.getExperiences(),
            profileApi.getEducation(),
          ]);

        if (profileRes.status === "fulfilled") {
          const data = profileRes.value.data;
          const normalizedProfile = data?.profile ?? data;
          setProfile({ ...fallbackProfile, ...(normalizedProfile || {}) });
        }
        if (skillsRes.status === "fulfilled") {
          const data = skillsRes.value.data;
          const fetchedSkills =
            Array.isArray(data) && data.length ? data : fallbackSkills;
          setSkills(
            [...fetchedSkills].sort((a, b) =>
              b.proficiency !== a.proficiency
                ? b.proficiency - a.proficiency
                : a.name.localeCompare(b.name),
            ),
          );
        }
        // Work experience is intentionally empty until real experience is added.
        setExperiences([]);
        if (eduRes.status === "fulfilled") {
          const data = eduRes.value.data;
          setEducation(
            Array.isArray(data) && data.length ? data : fallbackEducation,
          );
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  const skillsByCategory = skills.reduce((acc, skill) => {
    const cat = skill.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const skillIcons = {
    React: { icon: SiReact, color: "#61DAFB" },
    "Vue.js": { icon: SiVuedotjs, color: "#4FC08D" },
    JavaScript: { icon: SiJavascript, color: "#F7DF1E" },
    TypeScript: { icon: SiTypescript, color: "#3178C6" },
    HTML5: { icon: SiHtml5, color: "#E34F26" },
    CSS3: { icon: SiCss3, color: "#1572B6" },
    "Tailwind CSS": { icon: SiTailwindcss, color: "#06B6D4" },
    "Next.js": { icon: SiNextdotjs, color: "#ffffff" },
    "Node.js": { icon: SiNodedotjs, color: "#339933" },
    "Express.js": { icon: SiExpress, color: "#ffffff" },
    PostgreSQL: { icon: SiPostgresql, color: "#4169E1" },
    MongoDB: { icon: SiMongodb, color: "#47A248" },
    Python: { icon: SiPython, color: "#3776AB" },
    "REST API": { icon: TbApi, color: "#6366F1" },
    Git: { icon: SiGit, color: "#F05032" },
    Docker: { icon: SiDocker, color: "#2496ED" },
    "VS Code": { icon: SiVisualstudiocode, color: "#007ACC" },
    Figma: { icon: SiFigma, color: "#F24E1E" },
    Vercel: { icon: SiVercel, color: "#ffffff" },
    GitHub: { icon: SiGithub, color: "#ffffff" },
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString(
      language === "id" ? "id-ID" : "en-US",
      { month: "short", year: "numeric" },
    );
  };

  const tabs = [
    {
      id: "skills",
      label: language === "id" ? "Keahlian" : "Skills",
      icon: FiCpu,
    },
    ...(experiences.length > 0
      ? [
          {
            id: "experience",
            label: language === "id" ? "Pengalaman" : "Experience",
            icon: FiBriefcase,
          },
        ]
      : []),
    ...(education.length > 0
      ? [
          {
            id: "education",
            label: language === "id" ? "Pendidikan" : "Education",
            icon: FiBook,
          },
        ]
      : []),
  ];

  const categoryColors = {
    Frontend: { from: "#6366f1", to: "#a78bfa", text: "#c4b5fd" },
    Backend: { from: "#10b981", to: "#34d399", text: "#6ee7b7" },
    Tools: { from: "#f59e0b", to: "#fbbf24", text: "#fde68a" },
    Other: { from: "#ec4899", to: "#f472b6", text: "#fbcfe8" },
  };

  return (
    <>
      <Helmet>
        <title>{t("about.title")} - Filbert Matthew</title>
      </Helmet>

      <section className="about-page-section">
        {/* Background blobs */}
        <div className="about-bg-blob about-bg-blob--tl" />
        <div className="about-bg-blob about-bg-blob--br" />
        <div className="about-bg-grid" />

        <div className="container-custom relative z-10">
          {/* ── Page header ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-header pt-8"
          >
            <span className="section-tag">{t("nav.about")}</span>
            <h1 className="section-title">{t("about.title")}</h1>
            <p className="section-description">{t("about.subtitle")}</p>
          </motion.div>

          {/* ── Hero profile block ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="about-hero-grid"
          >
            {/* Left – avatar card */}
            <div className="about-avatar-col">
              <div className="about-avatar-card">
                {/* Glow ring */}
                <div className="about-avatar-ring">
                  <div className="about-avatar-inner">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="about-avatar-initials">FM</span>
                    )}
                  </div>
                </div>

                {/* Online badge */}
                <div className="about-online-badge">
                  <span className="about-online-dot" />
                  {language === "id"
                    ? "Tersedia untuk kerja"
                    : "Available for work"}
                </div>

                <h2 className="about-profile-name">
                  {profile?.name || "Filbert Matthew"}
                </h2>

                {/* Typing title */}
                <p className="about-profile-typing">
                  <span>{typedText}</span>
                  <span className="about-cursor">|</span>
                </p>

                {/* Contact info */}
                <div className="about-contact-list">
                  {profile?.location && (
                    <div className="about-contact-item">
                      <FiMapPin className="about-contact-icon" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile?.email && (
                    <div className="about-contact-item">
                      <FiMail className="about-contact-icon" />
                      <a
                        href={`mailto:${profile.email}`}
                        className="about-contact-link"
                      >
                        {profile.email}
                      </a>
                    </div>
                  )}
                </div>

                {/* Social links */}
                <div className="about-socials">
                  {profile?.github_url && (
                    <a
                      href={profile.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="about-social-btn"
                      aria-label="GitHub"
                    >
                      <FiGithub />
                    </a>
                  )}
                  {profile?.linkedin_url && (
                    <a
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="about-social-btn"
                      aria-label="LinkedIn"
                    >
                      <FiLinkedin />
                    </a>
                  )}
                  {profile?.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="about-social-btn"
                      aria-label="Email"
                    >
                      <FiMail />
                    </a>
                  )}
                </div>

                {/* CV button */}
                {profile?.resume_url && (
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about-cv-btn"
                  >
                    <FiDownload />
                    {t("about.downloadCV")}
                  </a>
                )}
              </div>
            </div>

            {/* Right – bio + stats */}
            <div className="about-bio-col">
              {/* Bio card */}
              <div className="about-bio-card">
                <div className="about-bio-header">
                  <FiUser className="about-bio-icon" />
                  <span>{language === "id" ? "Tentang Saya" : "About Me"}</span>
                </div>
                <p className="about-bio-text">
                  {language === "id"
                    ? profile?.bio_id || fallbackProfile.bio_id
                    : profile?.bio || fallbackProfile.bio}
                </p>
              </div>

              {/* Stats row */}
              <div className="about-stats-grid">
                <StatCard
                  icon={FiCode}
                  label={language === "id" ? "Proyek Selesai" : "Projects Done"}
                  value={3}
                  color="#6366f1"
                  delay={0.2}
                />
                <StatCard
                  icon={FiAward}
                  label={language === "id" ? "Teknologi" : "Technologies"}
                  value={skills.length}
                  color="#a78bfa"
                  delay={0.3}
                />
                <StatCard
                  icon={FiBriefcase}
                  label={language === "id" ? "Tahun Coding" : "Years Coding"}
                  value={3}
                  color="#34d399"
                  delay={0.4}
                />
              </div>

              {/* 3D Skills constellation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="skills-3d-container mt-6"
              >
                <Suspense
                  fallback={<div className="skills-loading">Loading 3D...</div>}
                >
                  <SkillsScene />
                </Suspense>
              </motion.div>
            </div>
          </motion.div>

          {/* ── Tab navigation ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="about-tabs-wrapper"
          >
            <div className="about-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`about-tab-btn ${activeTab === tab.id ? "about-tab-btn--active" : ""}`}
                >
                  <tab.icon className="about-tab-icon" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="about-tab-indicator"
                    />
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* ── Tab content ── */}
          <AnimatePresence mode="wait">
            {/* SKILLS TAB */}
            {activeTab === "skills" && (
              <motion.div
                key="skills"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
              >
                {/* Skill badges */}
                <div className="skills-badge-grid mb-10">
                  {skills.slice(0, 12).map((skill) => {
                    const sd = skillIcons[skill.name];
                    const Icon = sd?.icon;
                    return (
                      <motion.div
                        key={skill.id}
                        className="skill-badge-3d"
                        style={{ "--skill-color": sd?.color || "#6366f1" }}
                        whileHover={{ scale: 1.08 }}
                        onHoverStart={() => setHoveredSkill(skill.id)}
                        onHoverEnd={() => setHoveredSkill(null)}
                      >
                        {Icon && (
                          <Icon
                            className="skill-badge-icon"
                            style={{ color: sd?.color }}
                          />
                        )}
                        <span className="skill-badge-name">{skill.name}</span>
                        {typeof skill.proficiency === "number" && (
                          <span className="skill-badge-level">
                            {skill.proficiency}%
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Category cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(skillsByCategory).map(
                    ([category, catSkills], index) => {
                      const colors =
                        categoryColors[category] || categoryColors.Other;
                      return (
                        <motion.div
                          key={category}
                          initial={{ opacity: 0, y: 24 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.08 }}
                          className="about-skill-category-card"
                          style={{
                            "--cat-from": colors.from,
                            "--cat-to": colors.to,
                            "--cat-text": colors.text,
                          }}
                        >
                          <div className="about-skill-category-header">
                            <span
                              className="about-skill-category-dot"
                              style={{
                                background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
                              }}
                            />
                            <h3 className="about-skill-category-title">
                              {category}
                            </h3>
                            <span className="about-skill-category-count">
                              {catSkills.length}
                            </span>
                          </div>

                          <div className="space-y-3">
                            {catSkills.map((skill) => {
                              const sd = skillIcons[skill.name];
                              const Icon = sd?.icon;
                              return (
                                <div key={skill.id} className="about-skill-row">
                                  <div className="about-skill-row-label">
                                    {Icon && (
                                      <Icon
                                        className="w-4 h-4 flex-shrink-0"
                                        style={{ color: sd.color }}
                                      />
                                    )}
                                    <span className="text-gray-200 font-medium text-sm">
                                      {skill.name}
                                    </span>
                                  </div>
                                  <div className="about-skill-bar-wrap">
                                    <div className="about-skill-bar-track">
                                      <motion.div
                                        className="about-skill-bar-fill"
                                        style={{
                                          background: `linear-gradient(90deg, ${colors.from}, ${colors.to})`,
                                        }}
                                        initial={{ width: 0 }}
                                        whileInView={{
                                          width: `${skill.proficiency}%`,
                                        }}
                                        viewport={{ once: true }}
                                        transition={{
                                          duration: 1,
                                          ease: "easeOut",
                                          delay: 0.1,
                                        }}
                                      />
                                    </div>
                                    <span className="about-skill-pct">
                                      {skill.proficiency}%
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      );
                    },
                  )}
                </div>
              </motion.div>
            )}

            {/* EXPERIENCE TAB */}
            {activeTab === "experience" && (
              <motion.div
                key="experience"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="max-w-3xl mx-auto"
              >
                {experiences.map((exp, index) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, x: -24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="about-timeline-item"
                  >
                    <div className="about-timeline-line" />
                    <div className="about-timeline-dot">
                      <FiBriefcase className="w-3 h-3" />
                    </div>
                    <div className="about-timeline-card group">
                      <div className="about-timeline-card-glow" />
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2 relative z-10">
                        <h3 className="text-lg font-bold text-white">
                          {language === "id"
                            ? exp.position_id || exp.position
                            : exp.position}
                        </h3>
                        <span className="about-timeline-date">
                          {formatDate(exp.start_date)} –{" "}
                          {exp.is_current
                            ? t("about.present")
                            : formatDate(exp.end_date)}
                        </span>
                      </div>
                      <p className="text-primary-400 font-semibold mb-2 relative z-10 text-sm">
                        {exp.company}
                        {exp.location && (
                          <span className="text-gray-500">
                            {" "}
                            · {exp.location}
                          </span>
                        )}
                      </p>
                      <p className="text-gray-400 text-sm leading-relaxed relative z-10">
                        {language === "id"
                          ? exp.description_id || exp.description
                          : exp.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* EDUCATION TAB */}
            {activeTab === "education" && (
              <motion.div
                key="education"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="max-w-3xl mx-auto"
              >
                {education.map((edu, index) => (
                  <motion.div
                    key={edu.id}
                    initial={{ opacity: 0, x: -24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="about-timeline-item"
                  >
                    <div className="about-timeline-line about-timeline-line--edu" />
                    <div className="about-timeline-dot about-timeline-dot--edu">
                      <FiBook className="w-3 h-3" />
                    </div>
                    <div className="about-timeline-card group">
                      <div className="about-timeline-card-glow about-timeline-card-glow--edu" />
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2 relative z-10">
                        <h3 className="text-lg font-bold text-white">
                          {edu.institution}
                        </h3>
                        <span className="about-timeline-date">
                          {formatDate(edu.start_date)} –{" "}
                          {edu.is_current
                            ? t("about.present")
                            : formatDate(edu.end_date)}
                        </span>
                      </div>
                      <p className="text-violet-400 font-semibold mb-2 relative z-10 text-sm">
                        {edu.degree}
                        {edu.field && (
                          <span className="text-gray-500"> · {edu.field}</span>
                        )}
                      </p>
                      {edu.description && (
                        <p className="text-gray-400 text-sm leading-relaxed relative z-10">
                          {language === "id"
                            ? edu.description_id || edu.description
                            : edu.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
