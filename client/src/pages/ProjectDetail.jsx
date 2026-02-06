import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FiArrowLeft, FiExternalLink, FiGithub } from "react-icons/fi";
import { projectsApi } from "../services/api";
import { useLanguage } from "../contexts/LanguageContext";
import LoadingSpinner from "../components/UI/LoadingSpinner";

export default function ProjectDetail() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await projectsApi.getBySlug(slug);
        setProject(response.data);
      } catch (error) {
        console.error("Failed to fetch project:", error);
        setError("Project not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="heading-2 mb-4">Project Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {t("common.error")}
          </p>
          <button onClick={() => navigate(-1)} className="btn-primary">
            <FiArrowLeft className="mr-2" />
            {t("common.back")}
          </button>
        </div>
      </div>
    );
  }

  const title =
    language === "id" ? project.title_id || project.title : project.title;
  const description =
    language === "id"
      ? project.description_id || project.description
      : project.description;

  return (
    <>
      <Helmet>
        <title>{title} - Filbert Matthew</title>
        <meta name="description" content={description} />
      </Helmet>

      <section className="section pt-24 md:pt-32">
        <div className="container-custom max-w-4xl">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <FiArrowLeft />
              {t("common.back")}
            </button>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8"
          >
            {project.thumbnail_url ? (
              <img
                src={project.thumbnail_url}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <span className="text-8xl font-bold text-white opacity-30">
                  {title.charAt(0)}
                </span>
              </div>
            )}
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Category & Featured Badge */}
            <div className="flex items-center gap-3 mb-4">
              {project.category && (
                <span className="px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                  {project.category}
                </span>
              )}
              {project.featured && (
                <span className="px-3 py-1 text-sm font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full">
                  Featured
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="heading-1 mb-6">{title}</h1>

            {/* Description */}
            <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                {description}
              </p>
            </div>

            {/* Technologies */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">
                {t("projects.technologies")}
              </h2>
              <div className="flex flex-wrap gap-3">
                {project.technologies?.map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-4 pt-8 border-t border-gray-200 dark:border-gray-700">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <FiExternalLink className="mr-2" />
                  {t("projects.liveDemo")}
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  <FiGithub className="mr-2" />
                  {t("projects.viewCode")}
                </a>
              )}
            </div>

            {/* Project Images Gallery */}
            {project.images?.length > 0 && (
              <div className="mt-12">
                <h2 className="text-lg font-semibold mb-6">Screenshots</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {project.images.map((image) => (
                    <div
                      key={image.id}
                      className="rounded-xl overflow-hidden shadow-lg"
                    >
                      <img
                        src={image.image_url}
                        alt={image.caption || title}
                        className="w-full h-auto"
                      />
                      {image.caption && (
                        <p className="p-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
                          {image.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
