import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FiFolder, FiMail, FiEye, FiTrendingUp } from "react-icons/fi";
import { adminApi, contactApi } from "../../services/api";
import LoadingSpinner from "../../components/UI/LoadingSpinner";

export default function Dashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, messagesRes] = await Promise.all([
          adminApi.getStats(),
          contactApi.getAll({ limit: 5 }),
        ]);
        setStats(statsRes.data);
        setRecentMessages(messagesRes.data.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const statCards = [
    {
      icon: FiFolder,
      label: t("admin.totalProjects"),
      value: stats?.totalProjects || 0,
      color: "bg-blue-500",
      link: "/admin/projects",
    },
    {
      icon: FiMail,
      label: t("admin.totalMessages"),
      value: stats?.totalMessages || 0,
      color: "bg-green-500",
      link: "/admin/messages",
    },
    {
      icon: FiEye,
      label: t("admin.unreadMessages"),
      value: stats?.unreadMessages || 0,
      color: "bg-orange-500",
      link: "/admin/messages",
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t("admin.dashboard")} - Admin Panel</title>
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="heading-2">{t("admin.dashboard")}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={stat.link}
                className="card p-6 flex items-center gap-4 hover:scale-[1.02] transition-transform"
              >
                <div className={`p-4 ${stat.color} rounded-xl`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {t("admin.recentMessages")}
            </h2>
            <Link
              to="/admin/messages"
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              View all
            </Link>
          </div>

          {recentMessages.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No messages yet
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentMessages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                    !message.is_read
                      ? "bg-primary-50/50 dark:bg-primary-900/10"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-600 dark:text-primary-400 font-semibold">
                        {message.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {message.name}
                        </p>
                        {!message.is_read && (
                          <span className="w-2 h-2 bg-primary-600 rounded-full" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {message.subject || "No subject"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 truncate">
                        {message.message}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                      {new Date(message.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
