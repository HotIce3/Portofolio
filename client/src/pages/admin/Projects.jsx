import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiExternalLink,
  FiGithub,
  FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { projectsApi } from "../../services/api";
import LoadingSpinner from "../../components/UI/LoadingSpinner";

export default function AdminProjects() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    title_id: "",
    slug: "",
    description: "",
    description_id: "",
    thumbnail_url: "",
    live_url: "",
    github_url: "",
    technologies: "",
    category: "",
    featured: false,
    status: "published",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectsApi.getAll({ status: undefined });
      setProjects(response.data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      title_id: "",
      slug: "",
      description: "",
      description_id: "",
      thumbnail_url: "",
      live_url: "",
      github_url: "",
      technologies: "",
      category: "",
      featured: false,
      status: "published",
    });
    setShowModal(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || "",
      title_id: project.title_id || "",
      slug: project.slug || "",
      description: project.description || "",
      description_id: project.description_id || "",
      thumbnail_url: project.thumbnail_url || "",
      live_url: project.live_url || "",
      github_url: project.github_url || "",
      technologies: project.technologies?.join(", ") || "",
      category: project.category || "",
      featured: project.featured || false,
      status: project.status || "published",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ...formData,
      technologies: formData.technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      if (editingProject) {
        await projectsApi.update(editingProject.id, data);
        toast.success("Project updated successfully");
      } else {
        await projectsApi.create(data);
        toast.success("Project created successfully");
      }
      setShowModal(false);
      fetchProjects();
    } catch (error) {
      console.error("Failed to save project:", error);
      toast.error(error.response?.data?.error || "Failed to save project");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("admin.confirmDelete"))) return;

    try {
      await projectsApi.delete(id);
      toast.success("Project deleted successfully");
      fetchProjects();
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast.error("Failed to delete project");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>{t("admin.projects")} - Admin Panel</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="heading-2">{t("admin.manageProjects")}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {projects.length} project{projects.length !== 1 && "s"}
            </p>
          </div>
          <button onClick={openCreateModal} className="btn-primary">
            <FiPlus className="mr-2" />
            {t("admin.addProject")}
          </button>
        </div>

        {/* Projects List */}
        <div className="grid gap-4">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card p-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0">
                  {project.thumbnail_url ? (
                    <img
                      src={project.thumbnail_url}
                      alt={project.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-white opacity-50">
                      {project.title.charAt(0)}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {project.title}
                    </h3>
                    {project.featured && (
                      <span className="px-2 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded">
                        Featured
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 text-xs rounded ${
                        project.status === "published"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {project.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    {project.category && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {project.category}
                      </span>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-primary-600"
                      >
                        <FiExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-primary-600"
                      >
                        <FiGithub className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(project)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {projects.length === 0 && (
            <div className="card p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No projects yet
              </p>
              <button onClick={openCreateModal} className="btn-primary">
                <FiPlus className="mr-2" />
                Create your first project
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {editingProject
                  ? t("admin.editProject")
                  : t("admin.addProject")}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Title (EN)</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Title (ID)</label>
                  <input
                    type="text"
                    name="title_id"
                    value={formData.title_id}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="label">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Description (EN)</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="input resize-none"
                  />
                </div>
                <div>
                  <label className="label">Description (ID)</label>
                  <textarea
                    name="description_id"
                    value={formData.description_id}
                    onChange={handleChange}
                    rows={3}
                    className="input resize-none"
                  />
                </div>
              </div>

              <div>
                <label className="label">Thumbnail URL</label>
                <input
                  type="url"
                  name="thumbnail_url"
                  value={formData.thumbnail_url}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Live URL</label>
                  <input
                    type="url"
                    name="live_url"
                    value={formData.live_url}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">GitHub URL</label>
                  <input
                    type="url"
                    name="github_url"
                    value={formData.github_url}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="label">Technologies (comma separated)</label>
                <input
                  type="text"
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleChange}
                  placeholder="React, Node.js, PostgreSQL"
                  className="input"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Full Stack, Frontend, etc."
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label
                  htmlFor="featured"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Featured project
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {t("admin.save")}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  {t("admin.cancel")}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
}
