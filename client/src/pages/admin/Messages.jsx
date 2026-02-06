import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiTrash2,
  FiCheck,
  FiX,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { contactApi } from "../../services/api";
import LoadingSpinner from "../../components/UI/LoadingSpinner";

export default function AdminMessages() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await contactApi.getAll();
      setMessages(response.data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id, isRead) => {
    try {
      await contactApi.markAsRead(id, { is_read: isRead });
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_read: isRead } : m)),
      );
    } catch (error) {
      console.error("Failed to update message:", error);
      toast.error("Failed to update message");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;

    try {
      await contactApi.delete(id);
      toast.success("Message deleted");
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Failed to delete message:", error);
      toast.error("Failed to delete message");
    }
  };

  const toggleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      // Mark as read when expanded
      const message = messages.find((m) => m.id === id);
      if (message && !message.is_read) {
        handleMarkAsRead(id, true);
      }
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (filter === "unread") return !m.is_read;
    if (filter === "read") return m.is_read;
    return true;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>{t("admin.messages")} - Admin Panel</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="heading-2">{t("admin.messages")}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {messages.filter((m) => !m.is_read).length} unread of{" "}
              {messages.length} total
            </p>
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            {["all", "unread", "read"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                  filter === f
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Messages List */}
        <div className="space-y-3">
          {filteredMessages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`card overflow-hidden ${
                !message.is_read ? "ring-2 ring-primary-500" : ""
              }`}
            >
              {/* Header */}
              <div
                onClick={() => toggleExpand(message.id)}
                className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-600 dark:text-primary-400 font-semibold text-lg">
                      {message.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {message.name}
                      </p>
                      {!message.is_read && (
                        <span className="w-2 h-2 bg-primary-600 rounded-full" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {message.email}
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                      {message.subject || "No subject"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(message.created_at).toLocaleDateString()}
                    </span>
                    {expandedId === message.id ? (
                      <FiChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <FiChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedId === message.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                          {message.message}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <a
                          href={`mailto:${message.email}?subject=Re: ${message.subject || "Your Message"}`}
                          className="btn-primary text-sm py-2"
                        >
                          <FiMail className="mr-2 w-4 h-4" />
                          Reply
                        </a>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(message.id, !message.is_read);
                          }}
                          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                            message.is_read
                              ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                              : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          }`}
                        >
                          <FiCheck className="w-4 h-4" />
                          {message.is_read ? "Mark Unread" : "Mark Read"}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(message.id);
                          }}
                          className="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 flex items-center gap-2"
                        >
                          <FiTrash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {filteredMessages.length === 0 && (
            <div className="card p-12 text-center">
              <FiMail className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {filter === "all" ? "No messages yet" : `No ${filter} messages`}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
