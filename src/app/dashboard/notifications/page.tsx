"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Bell, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  ShieldAlert, 
  Clock, 
  Check, 
  ExternalLink, 
  Loader2,
  Trash2,
  Filter
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { useNotificationStore } from "@/store/useNotificationStore";

interface NotificationItem {
  id: string;
  type: "blog_published" | "blog_rejected" | "blog_review" | "comment" | "system";
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  link?: string;
}

export default function UserNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread" | "blogs" | "system">("all");
  const { setUnreadCount, clearUnread } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/user/notifications");
      if (res.data.success) {
        const data = res.data.data || [];
        setNotifications(data);
        // Sync unread count to global store
        setUnreadCount(data.filter((n: NotificationItem) => !n.read).length);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    clearUnread();
    toast.success("All notifications marked as read");
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      setUnreadCount(updated.filter((n) => !n.read).length);
      return updated;
    });
  };

  const clearNotifications = () => {
    if (!confirm("Are you sure you want to clear all notifications?")) return;
    setNotifications([]);
    clearUnread();
    toast.success("Notifications cleared");
  };

  const filteredNotifications = notifications.filter((item) => {
    if (filter === "unread") return !item.read;
    if (filter === "blogs") return item.type.startsWith("blog") || item.type === "comment";
    if (filter === "system") return item.type === "system";
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "blog_published":
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case "blog_rejected":
        return <XCircle className="w-5 h-5 text-red-400" />;
      case "blog_review":
        return <Clock className="w-5 h-5 text-amber-400" />;
      case "comment":
        return <MessageSquare className="w-5 h-5 text-violet-400" />;
      case "system":
      default:
        return <Bell className="w-5 h-5 text-blue-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="w-9 h-9 animate-spin text-violet-500 mb-3" />
        <p className="text-sm font-medium">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Bell className="w-8 h-8 text-violet-400" />
            Notifications Center
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-violet-600 text-white">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Stay updated with blog submission status, reader feedback, and platform alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearNotifications}
              className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-xs font-semibold text-red-400 transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/5">
        <Filter className="w-4 h-4 text-slate-500 shrink-0 mr-1" />
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            filter === "all"
              ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
              : "text-slate-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            filter === "unread"
              ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
              : "text-slate-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter("blogs")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            filter === "blogs"
              ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
              : "text-slate-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          Blog Updates
        </button>
        <button
          onClick={() => setFilter("system")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            filter === "system"
              ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
              : "text-slate-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          System
        </button>
      </div>

      {/* Notifications List */}
      <Card className="bg-[#0c0c16] border-white/5 text-white">
        <CardContent className="p-6">
          {error ? (
            <div className="text-center py-8 text-red-400 text-sm">
              Failed to load notifications.
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-16 text-slate-500 space-y-3">
              <Bell className="w-12 h-12 mx-auto text-slate-600 opacity-40" />
              <p className="text-sm font-semibold text-slate-400">No notifications found.</p>
              <p className="text-xs text-slate-600">You're all caught up! Updates regarding your blogs will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                    item.read
                      ? "bg-white/[0.01] border-white/5 opacity-80 hover:opacity-100 hover:bg-white/[0.02]"
                      : "bg-violet-600/[0.06] border-violet-500/25 shadow-lg shadow-violet-600/5"
                  }`}
                >
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shrink-0 mt-0.5">
                    {getIcon(item.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-white truncate flex items-center gap-2">
                        {item.title}
                        {!item.read && (
                          <span className="w-2 h-2 rounded-full bg-violet-400 shrink-0" />
                        )}
                      </h4>
                      <span className="text-[11px] text-slate-500 whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.message}
                    </p>

                    {item.link && (
                      <div className="mt-2.5">
                        <Link
                          href={item.link}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
                        >
                          View Details <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
