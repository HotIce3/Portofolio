import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FiSave, FiUser } from "react-icons/fi";
import toast from "react-hot-toast";
import { profileApi } from "../../services/api";
import LoadingSpinner from "../../components/UI/LoadingSpinner";

export default function AdminProfile() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    bio: "",
    bio_id: "",
    email: "",
    phone: "",
    location: "",
    avatar_url: "",
    resume_url: "",
    github_url: "",
    linkedin_url: "",
    twitter_url: "",
    instagram_url: "",
    website_url: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await profileApi.get();
      setFormData(response.data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await profileApi.update(formData);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>{t("admin.profile")} - Admin Panel</title>
      </Helmet>

      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="heading-2">{t("admin.profile")}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your public profile information
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6"
          >
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <FiUser className="text-primary-600" />
              Basic Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Title / Position</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Web Developer"
                  className="input"
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div className="md:col-span-2">
                <label className="label">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location || ""}
                  onChange={handleChange}
                  placeholder="Jakarta, Indonesia"
                  className="input"
                />
              </div>
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <h2 className="text-lg font-semibold mb-6">Bio</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label">Bio (English)</label>
                <textarea
                  name="bio"
                  value={formData.bio || ""}
                  onChange={handleChange}
                  rows={5}
                  className="input resize-none"
                  placeholder="Tell visitors about yourself..."
                />
              </div>
              <div>
                <label className="label">Bio (Indonesia)</label>
                <textarea
                  name="bio_id"
                  value={formData.bio_id || ""}
                  onChange={handleChange}
                  rows={5}
                  className="input resize-none"
                  placeholder="Ceritakan tentang diri Anda..."
                />
              </div>
            </div>
          </motion.div>

          {/* URLs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <h2 className="text-lg font-semibold mb-6">Links & URLs</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label">Avatar URL</label>
                <input
                  type="url"
                  name="avatar_url"
                  value={formData.avatar_url || ""}
                  onChange={handleChange}
                  className="input"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="label">Resume/CV URL</label>
                <input
                  type="url"
                  name="resume_url"
                  value={formData.resume_url || ""}
                  onChange={handleChange}
                  className="input"
                  placeholder="https://..."
                />
              </div>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <h2 className="text-lg font-semibold mb-6">Social Links</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label">GitHub</label>
                <input
                  type="url"
                  name="github_url"
                  value={formData.github_url || ""}
                  onChange={handleChange}
                  className="input"
                  placeholder="https://github.com/username"
                />
              </div>
              <div>
                <label className="label">LinkedIn</label>
                <input
                  type="url"
                  name="linkedin_url"
                  value={formData.linkedin_url || ""}
                  onChange={handleChange}
                  className="input"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <label className="label">Twitter</label>
                <input
                  type="url"
                  name="twitter_url"
                  value={formData.twitter_url || ""}
                  onChange={handleChange}
                  className="input"
                  placeholder="https://twitter.com/username"
                />
              </div>
              <div>
                <label className="label">Instagram</label>
                <input
                  type="url"
                  name="instagram_url"
                  value={formData.instagram_url || ""}
                  onChange={handleChange}
                  className="input"
                  placeholder="https://instagram.com/username"
                />
              </div>
              <div className="md:col-span-2">
                <label className="label">Personal Website</label>
                <input
                  type="url"
                  name="website_url"
                  value={formData.website_url || ""}
                  onChange={handleChange}
                  className="input"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </motion.div>

          {/* Submit */}
          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="btn-primary">
              <FiSave className="mr-2" />
              {saving ? "Saving..." : t("admin.save")}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
