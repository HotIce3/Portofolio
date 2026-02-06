import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FiSave, FiSettings, FiLock } from "react-icons/fi";
import toast from "react-hot-toast";
import { adminApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../../components/UI/LoadingSpinner";

export default function AdminSettings() {
  const { t } = useTranslation();
  const { updatePassword } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({});
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await adminApi.getSettings();
      const settingsObj = {};
      response.data.forEach((s) => {
        settingsObj[s.key] = s.value;
      });
      setSettings(settingsObj);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        await adminApi.updateSetting(key, value);
      }
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      await updatePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
      );
      toast.success("Password updated successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Failed to update password:", error);
      toast.error(error.response?.data?.error || "Failed to update password");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>{t("admin.settings")} - Admin Panel</title>
      </Helmet>

      <div className="max-w-4xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="heading-2">{t("admin.settings")}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your website settings and preferences
          </p>
        </div>

        {/* Site Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <FiSettings className="text-primary-600" />
            Site Settings
          </h2>

          <div className="space-y-6">
            <div>
              <label className="label">Site Title</label>
              <input
                type="text"
                value={settings.site_title || ""}
                onChange={(e) =>
                  handleSettingChange("site_title", e.target.value)
                }
                className="input"
                placeholder="Filbert Matthew - Web Developer"
              />
            </div>

            <div>
              <label className="label">Site Description</label>
              <textarea
                value={settings.site_description || ""}
                onChange={(e) =>
                  handleSettingChange("site_description", e.target.value)
                }
                rows={3}
                className="input resize-none"
                placeholder="Portfolio website description for SEO..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label">Primary Color</label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={settings.primary_color || "#3b82f6"}
                    onChange={(e) =>
                      handleSettingChange("primary_color", e.target.value)
                    }
                    className="w-12 h-12 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.primary_color || "#3b82f6"}
                    onChange={(e) =>
                      handleSettingChange("primary_color", e.target.value)
                    }
                    className="input flex-1"
                    placeholder="#3b82f6"
                  />
                </div>
              </div>

              <div>
                <label className="label">Default Language</label>
                <select
                  value={settings.default_language || "en"}
                  onChange={(e) =>
                    handleSettingChange("default_language", e.target.value)
                  }
                  className="input"
                >
                  <option value="en">English</option>
                  <option value="id">Indonesia</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="dark_mode_default"
                checked={settings.dark_mode_default === "true"}
                onChange={(e) =>
                  handleSettingChange(
                    "dark_mode_default",
                    e.target.checked ? "true" : "false",
                  )
                }
                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label
                htmlFor="dark_mode_default"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Enable dark mode by default
              </label>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="btn-primary"
            >
              <FiSave className="mr-2" />
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </motion.div>

        {/* Change Password */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <FiLock className="text-primary-600" />
            Change Password
          </h2>

          <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
            <div>
              <label className="label">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                required
                minLength={6}
                className="input"
              />
            </div>

            <div>
              <label className="label">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                required
                minLength={6}
                className="input"
              />
            </div>

            <div>
              <label className="label">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                required
                minLength={6}
                className="input"
              />
            </div>

            <button type="submit" className="btn-primary">
              Update Password
            </button>
          </form>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6 border-2 border-red-200 dark:border-red-900/30"
        >
          <h2 className="text-lg font-semibold mb-4 text-red-600 dark:text-red-400">
            Danger Zone
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            These actions are irreversible. Please be careful.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => toast.error("This feature is not implemented yet")}
              className="px-4 py-2 rounded-lg border-2 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium"
            >
              Reset All Data
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
