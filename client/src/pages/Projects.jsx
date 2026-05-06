import { useState, useEffect, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FiExternalLink, FiGithub, FiFilter } from "react-icons/fi";
import { projectsApi } from "../services/api";
import { useLanguage } from "../contexts/LanguageContext";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const ProjectsScene = lazy(() => import("../components/three/ProjectsScene"));

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
        const data = Array.isArray(response.data) ? response.data : [];
        setProjects(data);
        setFilteredProjects(data);

        // Extract unique categories
        const cats = [...new Set(data.map((p) => p.category).filter(Boolean))];
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

      <section className="projects-3d-section min-h-screen relative overflow-hidden">
        {/* 3D Background */}
        <div className="projects-3d-bg pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#13111c] to-[#0a0a1a] pointer-events-none z-0"></div>
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
          <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

          {/* 3D Scene (Background) */}
          <div className="absolute inset-0 z-10">
            <Suspense fallback={null}>
              <ProjectsScene />
            </Suspense>
          </div>
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-header"
          >
            <span className="section-tag">Portfolio</span>
            <h2 className="section-title">{t("projects.title")}</h2>
            <p className="section-description">{t("projects.subtitle")}</p>
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
                className={`px-5 py-2 rounded-full font-medium transition-all duration-300 backdrop-blur-md ${
                  activeCategory === "all"
                    ? "bg-primary-600/80 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-primary-500/50"
                    : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                }`}
              >
                {t("projects.all")}
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 py-2 rounded-full font-medium transition-all duration-300 backdrop-blur-md ${
                    activeCategory === category
                      ? "bg-primary-600/80 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-primary-500/50"
                      : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
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
              <FiFilter className="w-16 h-16 mx-auto text-gray-500 mb-4" />
              <p className="text-xl text-gray-400">
                {t("projects.noProjects")}
              </p>
            </div>
          ) : (
            <div className="projects-3d-grid">
              {filteredProjects.map((project, index) => (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
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

                    {project.featured && (
                      <span className="absolute top-4 right-4 px-3 py-1 bg-yellow-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                        Featured
                      </span>
                    )}
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
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link project-link-github"
                        >
                          <FiGithub className="w-4 h-4" />
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Glass border effect */}
                  <div className="project-card-glow" />
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
