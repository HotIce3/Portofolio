import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FiExternalLink, FiGithub, FiFilter } from "react-icons/fi";
import { projectsApi } from "../services/api";
import { useLanguage } from "../contexts/LanguageContext";
import LoadingSpinner from "../components/UI/LoadingSpinner";

export default function Projects() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectsApi.getAll();
        setProjects(response.data);
        setFilteredProjects(response.data);

        // Extract unique categories
        const cats = [
          ...new Set(response.data.map((p) => p.category).filter(Boolean)),
        ];
        setCategories(cats);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (activeCategory === "all") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter((p) => p.category === activeCategory),
      );
    }
  }, [activeCategory, projects]);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <>
      <Helmet>
        <title>{t("projects.title")} - Filbert Matthew</title>
      </Helmet>

      <section className="section pt-24 md:pt-32">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="heading-1 mb-4">{t("projects.title")}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t("projects.subtitle")}
            </p>
          </motion.div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap justify-center gap-3 mb-12"
            >
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ${
                  activeCategory === "all"
                    ? "bg-primary-600 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {t("projects.all")}
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ${
                    activeCategory === category
                      ? "bg-primary-600 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </motion.div>
          )}

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <FiFilter className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-xl text-gray-600 dark:text-gray-400">
                {t("projects.noProjects")}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                  className="card overflow-hidden group"
                >
                  <div className="relative h-52 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center overflow-hidden">
                    {project.thumbnail ? (
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <span className="text-6xl font-bold text-white opacity-30">
                        {project.title.charAt(0)}
                      </span>
                    )}

                    {project.featured && (
                      <span className="absolute top-4 right-4 px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-xl font-semibold group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {language === "id"
                          ? project.title_id || project.title
                          : project.title}
                      </h3>
                      {project.category && (
                        <span className="flex-shrink-0 px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                          {project.category}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {language === "id"
                        ? project.description_id || project.description
                        : project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech_stack?.slice(0, 5).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech_stack?.length > 5 && (
                        <span className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                          +{project.tech_stack.length - 5}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          <FiExternalLink className="w-4 h-4" />
                          {t("projects.liveDemo")}
                        </a>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
