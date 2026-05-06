import { useState, useEffect, Suspense, lazy } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  FiDownload,
  FiMapPin,
  FiMail,
  FiBriefcase,
  FiBook,
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

export default function About() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  // Fallback data so the About page still renders even if some backend endpoints fail
  const fallbackProfile = {
    name: "Filbert Matthew",
    title: "Web Developer",
    bio: "Passionate web developer with expertise in building modern web applications",
    bio_id:
      "Web developer yang bersemangat dengan keahlian membangun aplikasi web modern",
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
  const [skills, setSkills] = useState(() => 
    [...fallbackSkills].sort((a, b) => {
      if (b.proficiency !== a.proficiency) return b.proficiency - a.proficiency;
      return a.name.localeCompare(b.name);
    })
  );
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);

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
          setProfile(normalizedProfile || fallbackProfile);
        }

        if (skillsRes.status === "fulfilled") {
          const data = skillsRes.value.data;
          const fetchedSkills = Array.isArray(data) && data.length ? data : fallbackSkills;
          const sortedSkills = [...fetchedSkills].sort((a, b) => {
            if (b.proficiency !== a.proficiency) return b.proficiency - a.proficiency;
            return a.name.localeCompare(b.name);
          });
          setSkills(sortedSkills);
        }

        if (expRes.status === "fulfilled") {
          const data = expRes.value.data;
          setExperiences(Array.isArray(data) ? data : []);
        }

        if (eduRes.status === "fulfilled") {
          const data = eduRes.value.data;
          setEducation(Array.isArray(data) ? data : []);
        }
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

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
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
    "Next.js": { icon: SiNextdotjs, color: "#000000" },
    "Node.js": { icon: SiNodedotjs, color: "#339933" },
    "Express.js": { icon: SiExpress, color: "#000000" },
    PostgreSQL: { icon: SiPostgresql, color: "#4169E1" },
    MongoDB: { icon: SiMongodb, color: "#47A248" },
    Python: { icon: SiPython, color: "#3776AB" },
    "REST API": { icon: TbApi, color: "#6366F1" },
    Git: { icon: SiGit, color: "#F05032" },
    Docker: { icon: SiDocker, color: "#2496ED" },
    "VS Code": { icon: SiVisualstudiocode, color: "#007ACC" },
    Figma: { icon: SiFigma, color: "#F24E1E" },
    Vercel: { icon: SiVercel, color: "#000000" },
    GitHub: { icon: SiGithub, color: "#181717" },
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <Helmet>
        <title>{t("about.title")} - Filbert Matthew</title>
      </Helmet>

      <section className="skills-3d-section min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#13111c] to-[#0a0a1a] pointer-events-none z-0"></div>
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

        <div className="container-custom relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-header"
          >
            <span className="section-tag">{t("nav.about")}</span>
            <h2 className="section-title">{t("about.title")}</h2>
            <p className="section-description">{t("about.subtitle")}</p>
          </motion.div>

          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid lg:grid-cols-3 gap-12 mb-20"
          >
            {/* Avatar & Info */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="w-48 h-48 mx-auto lg:mx-0 rounded-2xl bg-gradient-to-br from-primary-600/40 to-violet-600/40 p-[2px] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                  <div className="w-full h-full bg-[#0a0a1a] rounded-2xl overflow-hidden flex items-center justify-center">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl font-bold text-white/50">
                        FM
                      </span>
                    )}
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-center lg:text-left mb-2 text-white">
                  {profile?.name || "Filbert Matthew"}
                </h2>
                <p className="text-primary-400 font-medium text-center lg:text-left mb-4">
                  {profile?.title || "Web Developer"}
                </p>

                <div className="space-y-3 text-gray-400">
                  {profile?.location && (
                    <div className="flex items-center gap-2 justify-center lg:justify-start">
                      <FiMapPin className="w-4 h-4 text-primary-400" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile?.email && (
                    <div className="flex items-center gap-2 justify-center lg:justify-start">
                      <FiMail className="w-4 h-4 text-primary-400" />
                      <a
                        href={`mailto:${profile.email}`}
                        className="hover:text-primary-300 transition-colors"
                      >
                        {profile.email}
                      </a>
                    </div>
                  )}
                </div>

                {profile?.resume_url && (
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full mt-6 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl border border-white/10 transition-all duration-300 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                  >
                    <FiDownload className="mr-2" />
                    {t("about.downloadCV")}
                  </a>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="lg:col-span-2">
              <div className="prose prose-lg prose-invert max-w-none bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">
                <p className="text-gray-300 leading-relaxed text-lg font-light">
                  {language === "id"
                    ? profile?.bio_id
                    : profile?.bio || t("about.description")}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Skills Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20 relative"
          >
            <h2 className="heading-2 mb-8 text-center text-white">
              {t("about.skills")}
            </h2>

            {/* 3D Skills Constellation (same as Home) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="skills-3d-container"
            >
              <Suspense
                fallback={<div className="skills-loading">Loading 3D...</div>}
              >
                <SkillsScene />
              </Suspense>
            </motion.div>

            {/* Skill badges (same style as Home) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="skills-badge-grid mb-10"
            >
              {skills.slice(0, 12).map((skill) => {
                const skillData = skillIcons[skill.name];
                const IconComponent = skillData?.icon;

                return (
                  <div
                    key={skill.id}
                    className="skill-badge-3d"
                    style={{ "--skill-color": skillData?.color || "#6366f1" }}
                  >
                    {IconComponent && (
                      <IconComponent
                        className="skill-badge-icon"
                        style={{ color: skillData?.color }}
                      />
                    )}
                    <span className="skill-badge-name">{skill.name}</span>
                    {typeof skill.proficiency === "number" && (
                      <span className="skill-badge-level">
                        {skill.proficiency}%
                      </span>
                    )}
                  </div>
                );
              })}
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(skillsByCategory).map(
                ([category, categorySkills], index) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-primary-500/30 transition-colors"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <h3 className="font-semibold text-lg mb-4 text-primary-400 relative z-10">
                      {category}
                    </h3>
                    <div className="space-y-3 relative z-10">
                      {categorySkills.map((skill) => {
                        const skillData = skillIcons[skill.name];
                        const IconComponent = skillData?.icon;

                        return (
                          <div key={skill.id}>
                            <div className="flex justify-between mb-1">
                              <span className="font-medium text-gray-200 flex items-center gap-2">
                                {IconComponent && (
                                  <IconComponent
                                    className="w-4 h-4 drop-shadow-md"
                                    style={{ color: skillData.color }}
                                  />
                                )}
                                {skill.name}
                              </span>
                              <span className="text-sm text-gray-400 font-mono">
                                {skill.proficiency}%
                              </span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                              <motion.div
                                className="h-full bg-gradient-to-r from-primary-500 to-violet-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                initial={{ width: 0 }}
                                whileInView={{ width: `${skill.proficiency}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, ease: "easeOut" }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                ),
              )}
            </div>
          </motion.div>

          {/* Experience Section */}
          {experiences.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-20"
            >
              <h2 className="heading-2 mb-8 text-center flex items-center justify-center gap-3">
                <FiBriefcase className="text-primary-600 dark:text-primary-400" />
                {t("about.experience")}
              </h2>

              <div className="max-w-3xl mx-auto">
                {experiences.map((exp, index) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-8 pb-8 border-l-2 border-primary-200 dark:border-primary-800 last:pb-0"
                  >
                    <div className="absolute left-[-9px] top-0 w-4 h-4 bg-primary-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)] border-2 border-[#0a0a1a]" />

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-primary-500/30 transition-colors">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2 relative z-10">
                        <h3 className="text-xl font-semibold text-white">
                          {language === "id"
                            ? exp.position_id || exp.position
                            : exp.position}
                        </h3>
                        <span className="text-sm text-gray-400 font-mono bg-white/5 px-2 py-1 rounded border border-white/10">
                          {formatDate(exp.start_date)} -{" "}
                          {exp.is_current
                            ? t("about.present")
                            : formatDate(exp.end_date)}
                        </span>
                      </div>
                      <p className="text-primary-400 font-medium mb-2 relative z-10">
                        {exp.company} {exp.location && `• ${exp.location}`}
                      </p>
                      <p className="text-gray-300 relative z-10">
                        {language === "id"
                          ? exp.description_id || exp.description
                          : exp.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Education Section */}
          {education.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="heading-2 mb-8 text-center flex items-center justify-center gap-3">
                <FiBook className="text-primary-600 dark:text-primary-400" />
                {t("about.education")}
              </h2>

              <div className="max-w-3xl mx-auto">
                {education.map((edu, index) => (
                  <motion.div
                    key={edu.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-8 pb-8 border-l-2 border-primary-200 dark:border-primary-800 last:pb-0"
                  >
                    <div className="absolute left-[-9px] top-0 w-4 h-4 bg-primary-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)] border-2 border-[#0a0a1a]" />

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-violet-500/30 transition-colors">
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2 relative z-10">
                        <h3 className="text-xl font-semibold text-white">
                          {edu.institution}
                        </h3>
                        <span className="text-sm text-gray-400 font-mono bg-white/5 px-2 py-1 rounded border border-white/10">
                          {formatDate(edu.start_date)} -{" "}
                          {edu.is_current
                            ? t("about.present")
                            : formatDate(edu.end_date)}
                        </span>
                      </div>
                      <p className="text-violet-400 font-medium mb-2 relative z-10">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </p>
                      {edu.description && (
                        <p className="text-gray-300 relative z-10">
                          {language === "id"
                            ? edu.description_id || edu.description
                            : edu.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
