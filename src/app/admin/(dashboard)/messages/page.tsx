/* eslint-disable */
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Mail,
  MessageSquare,
  Trash2,
  CheckCheck,
  Search,
  Loader2,
  Clock,
  User,
  Inbox,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Phone,
  Eye,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [markingAllRead, setMarkingAllRead] = useState(false);

  const fetchMessages = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await axios.get("/api/admin/messages", { withCredentials: true });
      if (res.data.success) {
        setMessages(res.data.data || []);
      }
    } catch {
      toast.error("মেসেজ লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(true);
    // Poll for new messages every 10 seconds for real-time update
    const interval = setInterval(() => fetchMessages(false), 10000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await axios.patch(`/api/admin/messages/${id}/read`, {}, { withCredentials: true });
      if (res.data.success) {
        setMessages((prev) =>
          prev.map((m) => (m._id === id ? { ...m, isRead: true } : m))
        );
        if (selectedMessage?._id === id) {
          setSelectedMessage((prev) => (prev ? { ...prev, isRead: true } : null));
        }
        toast.success("Marked as read");
      }
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAllRead(true);
    try {
      const res = await axios.patch("/api/admin/messages/read-all", {}, { withCredentials: true });
      if (res.data.success) {
        setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
        toast.success("All messages marked as read");
      }
    } catch {
      toast.error("Failed to mark all as read");
    } finally {
      setMarkingAllRead(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিত এই মেসেজটি মুছতে চান?")) return;
    setDeletingId(id);
    try {
      const res = await axios.delete(`/api/admin/messages/${id}`, { withCredentials: true });
      if (res.data.success) {
        setMessages((prev) => prev.filter((m) => m._id !== id));
        if (selectedMessage?._id === id) setSelectedMessage(null);
        toast.success("মেসেজ মুছে ফেলা হয়েছে");
      }
    } catch {
      toast.error("Delete করতে সমস্যা হয়েছে");
    } finally {
      setDeletingId(null);
    }
  };

  const openMessageModal = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      handleMarkAsRead(msg._id);
    }
  };

  // Filtering & Search
  const unreadCount = messages.filter((m) => !m.isRead).length;
  const todayCount = messages.filter((m) => {
    const d = new Date(m.createdAt);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  }).length;

  const filteredMessages = messages.filter((m) => {
    if (filter === "unread" && m.isRead) return false;
    if (filter === "read" && !m.isRead) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchEmail = m.email.toLowerCase().includes(q);
      const matchPhone = m.phone.toLowerCase().includes(q);
      const matchMsg = m.message.toLowerCase().includes(q);
      return matchName || matchEmail || matchPhone || matchMsg;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Contact Messages</h1>
              <p className="text-xs text-slate-400">
                ওয়েবসাইট থেকে পাঠানো মেসেজসমূহ ও রিয়েল-টাইম নোটিফিকেশন
              </p>
            </div>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={markingAllRead}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600/20 text-violet-300 border border-violet-500/30 hover:bg-violet-600/30 transition-all self-start sm:self-auto cursor-pointer"
          >
            {markingAllRead ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCheck className="w-4 h-4 text-violet-400" />
            )}
            <span>সব মেসেজ Read হিসেবে চিহ্নিত করুন</span>
          </button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">মোট মেসেজ</p>
            <h3 className="text-2xl font-bold text-white">{messages.length}</h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-violet-500/20 flex items-center gap-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-violet-300 font-medium uppercase tracking-wider">পড়েনি (Unread)</p>
            <h3 className="text-2xl font-bold text-violet-300">{unreadCount}</h3>
          </div>
          {unreadCount > 0 && (
            <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-violet-500 animate-ping" />
          )}
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">আজকের মেসেজ</p>
            <h3 className="text-2xl font-bold text-white">{todayCount}</h3>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-2xl border border-white/5">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(["all", "unread", "read"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all capitalize cursor-pointer whitespace-nowrap ${
                filter === t
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                  : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {t === "all" ? `All (${messages.length})` : t === "unread" ? `Unread (${unreadCount})` : `Read (${messages.length - unreadCount})`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="নাম, ইমেইল বা মেসেজ খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-white/5 bg-slate-900/30 text-slate-500">
          <Inbox className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="text-base font-medium">কোনো মেসেজ পাওয়া যায়নি</p>
          <p className="text-xs mt-1 text-slate-600">
            {search ? "আপনার সার্চ কোয়েরির সাথে কোনো মেসেজ মিলেনি" : "ওয়েবসাইট থেকে নতুন কোনো মেসেজ আসেনি"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((msg) => (
            <motion.div
              layout
              key={msg._id}
              onClick={() => openMessageModal(msg)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                !msg.isRead
                  ? "bg-violet-950/20 border-violet-500/40 hover:border-violet-500/70 shadow-lg shadow-violet-900/10"
                  : "bg-slate-900/40 border-white/5 hover:border-white/15 hover:bg-slate-900/60"
              }`}
            >
              <div className="flex items-start gap-4 min-w-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                    !msg.isRead
                      ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                      : "bg-white/10 text-slate-300"
                  }`}
                >
                  {msg.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-semibold text-white truncate">{msg.name}</h4>
                    {!msg.isRead && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-violet-500/20 text-violet-300 border border-violet-500/30">
                        New
                      </span>
                    )}
                    <span className="text-[11px] text-slate-500">
                      {new Date(msg.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                    {msg.email && (
                      <span className="flex items-center gap-1 truncate">
                        <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                        {msg.email}
                      </span>
                    )}
                    {msg.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-500 shrink-0" />
                        {msg.phone}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div
                className="flex items-center gap-2 self-end sm:self-center shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => openMessageModal(msg)}
                  className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="View Message"
                >
                  <Eye className="w-4 h-4" />
                </button>

                {!msg.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(msg._id)}
                    className="p-2 rounded-xl bg-violet-600/20 text-violet-300 hover:bg-violet-600/30 transition-colors"
                    title="Mark as Read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}

                {msg.email && (
                  <a
                    href={`mailto:${msg.email}?subject=Reply from Talamij`}
                    className="p-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                    title="Reply Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}

                <button
                  onClick={() => handleDelete(msg._id)}
                  disabled={deletingId === msg._id}
                  className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  title="Delete Message"
                >
                  {deletingId === msg._id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Message Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0f0f1c] border border-white/10 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedMessage(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-xl bg-white/5 hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-violet-600/30 text-violet-300 border border-violet-500/30 flex items-center justify-center text-lg font-bold">
                  {selectedMessage.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedMessage.name}</h3>
                  <p className="text-xs text-slate-400">
                    {new Date(selectedMessage.createdAt).toLocaleString("en-US", {
                      dateStyle: "full",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-2 text-xs">
                {selectedMessage.email && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-medium">Email:</span>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-blue-400 hover:underline flex items-center gap-1"
                    >
                      {selectedMessage.email} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
                {selectedMessage.phone && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-medium">Phone:</span>
                    <a
                      href={`tel:${selectedMessage.phone}`}
                      className="text-emerald-400 hover:underline"
                    >
                      {selectedMessage.phone}
                    </a>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Message Content
                </h4>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto custom-scrollbar">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                {selectedMessage.email && (
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Response from Talamij Organization`}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white transition-all flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" /> Reply Email
                  </a>
                )}
                <button
                  onClick={() => handleDelete(selectedMessage._id)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
