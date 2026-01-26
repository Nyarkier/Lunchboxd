import { useEffect, useState } from "react";
import { AdminLayout } from "../layouts/AdminLayout";
import {
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
} from "../services/adminService";
import type { ContactMessage } from "../types/types";

export function AdminInbox() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null,
  );

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getContactMessages();
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages");
      console.error("Error loading messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      const message = messages.find((m) => m.id === messageId);
      if (message) {
        await updateContactMessageStatus(messageId, "read");
        setMessages(
          messages.map((m) =>
            m.id === messageId ? { ...m, status: "read" } : m,
          ),
        );
        if (selectedMessage?.id === messageId) {
          setSelectedMessage({ ...selectedMessage, status: "read" });
        }
      }
    } catch (err) {
      console.error("Error marking message as read:", err);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteContactMessage(messageId);
      setMessages(messages.filter((m) => m.id !== messageId));
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
            <p className="mt-4 text-slate-600">Loading messages...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">📧 Inbox</h1>
          <p className="text-slate-600">
            Manage contact messages and feedback from users
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {messages.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-slate-600 text-lg">No messages yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Messages List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <div className="space-y-2 p-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        onClick={() => handleMarkAsRead(message.id)}
                        className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedMessage?.id === message.id
                            ? "bg-orange-50 border-2 border-orange-500"
                            : "bg-slate-50 border-2 border-transparent hover:bg-slate-100"
                        } ${message.status === "unread" ? "font-semibold" : ""}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div
                            className="flex-1 cursor-pointer"
                            onClick={() => setSelectedMessage(message)}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-block w-2 h-2 rounded-full ${
                                  message.status === "unread"
                                    ? "bg-orange-500"
                                    : "bg-slate-300"
                                }`}
                              ></span>
                              <h3 className="text-slate-900">
                                {message.senderName}
                              </h3>
                            </div>
                            <p className="text-sm text-slate-600 mt-1">
                              {message.subject}
                            </p>
                            <p className="text-xs text-slate-500 mt-2">
                              {formatDate(message.submittedAt)}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMessage(message.id);
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                            title="Delete message"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <div className="text-3xl font-bold text-orange-500">
                    {messages.filter((m) => m.status === "unread").length}
                  </div>
                  <p className="text-slate-600 text-sm mt-2">Unread</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <div className="text-3xl font-bold text-blue-500">
                    {messages.filter((m) => m.status === "read").length}
                  </div>
                  <p className="text-slate-600 text-sm mt-2">Read</p>
                </div>
              </div>
            </div>

            {/* Message Detail */}
            {selectedMessage && (
              <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-4">
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900">
                      {selectedMessage.subject}
                    </h2>
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-semibold text-slate-700">
                        From:
                      </span>
                      <span className="ml-2 text-slate-600">
                        {selectedMessage.senderName}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold text-slate-700">
                        Email:
                      </span>
                      <span className="ml-2 text-slate-600">
                        {selectedMessage.senderEmail}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold text-slate-700">
                        Date:
                      </span>
                      <span className="ml-2 text-slate-600">
                        {formatDate(selectedMessage.submittedAt)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4 mb-4">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>

                <div className="space-y-2">
                  {selectedMessage.status === "unread" && (
                    <button
                      onClick={() => handleMarkAsRead(selectedMessage.id)}
                      className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-semibold"
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                    className="w-full bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm font-semibold"
                  >
                    Delete Message
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
