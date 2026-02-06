import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;

// API helper functions
export const profileApi = {
  get: () => api.get("/profile"),
  update: (data) => api.put("/profile", data),
  getSkills: () => api.get("/profile/skills"),
  getExperiences: () => api.get("/profile/experiences"),
  getEducation: () => api.get("/profile/education"),
  getTestimonials: () => api.get("/profile/testimonials"),
};

export const projectsApi = {
  getAll: (params) => api.get("/projects", { params }),
  getBySlug: (slug) => api.get(`/projects/slug/${slug}`),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post("/projects", data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

export const contactApi = {
  send: (data) => api.post("/contact", data),
  getAll: (params) => api.get("/contact", { params }),
  markAsRead: (id) => api.patch(`/contact/${id}/read`),
  delete: (id) => api.delete(`/contact/${id}`),
  getUnreadCount: () => api.get("/contact/stats/unread"),
};

export const adminApi = {
  getStats: () => api.get("/admin/stats"),

  // Skills
  getSkills: () => api.get("/admin/skills"),
  createSkill: (data) => api.post("/admin/skills", data),
  updateSkill: (id, data) => api.put(`/admin/skills/${id}`, data),
  deleteSkill: (id) => api.delete(`/admin/skills/${id}`),

  // Experiences
  getExperiences: () => api.get("/admin/experiences"),
  createExperience: (data) => api.post("/admin/experiences", data),
  updateExperience: (id, data) => api.put(`/admin/experiences/${id}`, data),
  deleteExperience: (id) => api.delete(`/admin/experiences/${id}`),

  // Education
  getEducation: () => api.get("/admin/education"),
  createEducation: (data) => api.post("/admin/education", data),
  updateEducation: (id, data) => api.put(`/admin/education/${id}`, data),
  deleteEducation: (id) => api.delete(`/admin/education/${id}`),

  // Testimonials
  getTestimonials: () => api.get("/admin/testimonials"),
  createTestimonial: (data) => api.post("/admin/testimonials", data),
  updateTestimonial: (id, data) => api.put(`/admin/testimonials/${id}`, data),
  deleteTestimonial: (id) => api.delete(`/admin/testimonials/${id}`),

  // Settings
  getSettings: () => api.get("/admin/settings"),
  updateSetting: (key, value, type) =>
    api.put(`/admin/settings/${key}`, { value, type }),
};
