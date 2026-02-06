import { useState, useEffect } from "react";
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
import { profileApi } from "../services/api";
import { useLanguage } from "../contexts/LanguageContext";
import LoadingSpinner from "../components/UI/LoadingSpinner";

export default function About() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, skillsRes, expRes, eduRes] = await Promise.all([
          profileApi.get(),
          profileApi.getSkills(),
          profileApi.getExperiences(),
          profileApi.getEducation(),
        ]);
        setProfile(profileRes.data);
        setSkills(skillsRes.data);
        setExperiences(expRes.data);
        setEducation(eduRes.data);
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

      <section className="section pt-24 md:pt-32">
        <div className="container-custom">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="heading-1 mb-4">{t("about.title")}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t("about.subtitle")}
            </p>
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
                <div className="w-48 h-48 mx-auto lg:mx-0 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mb-6 shadow-xl">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.name}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <span className="text-6xl font-bold text-white">FM</span>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-center lg:text-left mb-2">
                  {profile?.name || "Filbert Matthew"}
                </h2>
                <p className="text-primary-600 dark:text-primary-400 font-medium text-center lg:text-left mb-4">
                  {profile?.title || "Web Developer"}
                </p>

                <div className="space-y-3 text-gray-600 dark:text-gray-400">
                  {profile?.location && (
                    <div className="flex items-center gap-2 justify-center lg:justify-start">
                      <FiMapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile?.email && (
                    <div className="flex items-center gap-2 justify-center lg:justify-start">
                      <FiMail className="w-4 h-4" />
                      <a
                        href={`mailto:${profile.email}`}
                        className="hover:text-primary-600 dark:hover:text-primary-400"
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
                    className="btn-primary w-full mt-6"
                  >
                    <FiDownload className="mr-2" />
                    {t("about.downloadCV")}
                  </a>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="lg:col-span-2">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
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
            className="mb-20"
          >
            <h2 className="heading-2 mb-8 text-center">{t("about.skills")}</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(skillsByCategory).map(
                ([category, categorySkills], index) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="card p-6"
                  >
                    <h3 className="font-semibold text-lg mb-4 text-primary-600 dark:text-primary-400">
                      {category}
                    </h3>
                    <div className="space-y-3">
                      {categorySkills.map((skill) => (
                        <div key={skill.id}>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                              {skill.name}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {skill.proficiency}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.proficiency}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      ))}
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
                    <div className="absolute left-[-9px] top-0 w-4 h-4 bg-primary-600 rounded-full" />

                    <div className="card p-6">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <h3 className="text-xl font-semibold">
                          {language === "id"
                            ? exp.position_id || exp.position
                            : exp.position}
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(exp.start_date)} -{" "}
                          {exp.is_current
                            ? t("about.present")
                            : formatDate(exp.end_date)}
                        </span>
                      </div>
                      <p className="text-primary-600 dark:text-primary-400 font-medium mb-2">
                        {exp.company} {exp.location && `• ${exp.location}`}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
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
                    <div className="absolute left-[-9px] top-0 w-4 h-4 bg-primary-600 rounded-full" />

                    <div className="card p-6">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <h3 className="text-xl font-semibold">
                          {edu.institution}
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(edu.start_date)} -{" "}
                          {edu.is_current
                            ? t("about.present")
                            : formatDate(edu.end_date)}
                        </span>
                      </div>
                      <p className="text-primary-600 dark:text-primary-400 font-medium mb-2">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </p>
                      {edu.description && (
                        <p className="text-gray-600 dark:text-gray-400">
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
