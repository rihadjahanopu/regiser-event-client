"use client";

import { useEffect, useState } from "react";
import { 
  BookOpen, 
  Eye, 
  ThumbsUp, 
  TrendingUp, 
  MessageSquare, 
  FileText,
  Calendar,
  ChevronRight,
  Plus
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts";
import Link from "next/link";
import { motion } from "framer-motion";

interface Blog {
  _id: string;
  title: string;
  category: string;
  status: string;
  views: number;
  likes: string[];
  comments: any[];
  reach: number;
  createdAt: string;
}

export default function UserDashboardHome() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("/api/blog/my-blogs");
      if (response.data.success) {
        setBlogs(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Calculate statistics
  const totalBlogs = blogs.length;
  const totalViews = blogs.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalLikes = blogs.reduce((acc, curr) => acc + (curr.likes?.length || 0), 0);
  const totalComments = blogs.reduce((acc, curr) => acc + (curr.comments?.length || 0), 0);
  const totalReach = blogs.reduce((acc, curr) => acc + (curr.views || 0) * 1.2 + (curr.likes?.length || 0) * 2, 0);

  // Chart data: Top 5 blogs by views
  const topBlogsChartData = [...blogs]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
    .map(b => ({
      name: b.title.length > 20 ? b.title.substring(0, 20) + "..." : b.title,
      Views: b.views,
      Likes: b.likes?.length || 0,
      Comments: b.comments?.length || 0
    }));

  // Analytics timeline data (grouped by date of creation)
  const timelineData = [...blogs]
    .slice()
    .reverse()
    .map(b => {
      const date = new Date(b.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      return {
        date,
        Views: b.views,
        Likes: b.likes?.length || 0
      };
    });

  const recentBlogs = blogs.slice(0, 3);

  const stats = [
    { name: "Total Blogs", value: totalBlogs, icon: BookOpen, color: "text-blue-400", bg: "bg-blue-500/10" },
    { name: "Total Views", value: totalViews, icon: Eye, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { name: "Total Likes", value: totalLikes, icon: ThumbsUp, color: "text-red-400", bg: "bg-red-500/10" },
    { name: "Estimated Reach", value: Math.round(totalReach), icon: TrendingUp, color: "text-violet-400", bg: "bg-violet-500/10" }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-400 text-sm mt-1">Analyze your blog performance, draft new posts, and read reviews.</p>
        </div>
        <Link href="/dashboard/add-blog">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white transition-all shadow-lg shadow-violet-600/20 hover:shadow-violet-600/35 hover:-translate-y-0.5">
            <Plus className="w-4 h-4" />
            Write New Blog
          </button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-[#0c0c16] border border-white/5 rounded-2xl p-6 flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">{stat.name}</span>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} border border-white/5`}>
                <Icon className="w-5 h-5" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <div className="bg-[#0c0c16] border border-white/5 rounded-2xl p-6 lg:col-span-2 space-y-4">
          <div>
            <h3 className="text-lg font-bold">Views & Likes Timeline</h3>
            <p className="text-xs text-slate-500">Timeline of post views and likes activity.</p>
          </div>
          <div className="h-72 w-full">
            {timelineData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0c0c16",
                      borderColor: "rgba(255,255,255,0.08)",
                      borderRadius: "12px",
                      color: "#fff"
                    }}
                  />
                  <Area type="monotone" dataKey="Views" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorViews)" strokeWidth={2} />
                  <Area type="monotone" dataKey="Likes" stroke="#f43f5e" fillOpacity={1} fill="url(#colorLikes)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                No timeline data available. Create blogs to see metrics!
              </div>
            )}
          </div>
        </div>

        {/* Top Posts */}
        <div className="bg-[#0c0c16] border border-white/5 rounded-2xl p-6 flex flex-col space-y-4">
          <div>
            <h3 className="text-lg font-bold">Top Performing Blogs</h3>
            <p className="text-xs text-slate-500">Your articles ranked by viewer count.</p>
          </div>
          <div className="h-72 w-full">
            {topBlogsChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topBlogsChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={10} width={80} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0c0c16",
                      borderColor: "rgba(255,255,255,0.08)",
                      borderRadius: "12px",
                      color: "#fff"
                    }}
                  />
                  <Bar dataKey="Views" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                No blog analytics data.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lower Grid — Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Blogs */}
        <div className="bg-[#0c0c16] border border-white/5 rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">Recent Blog Posts</h3>
              <p className="text-xs text-slate-500">Your latest articles and draft updates.</p>
            </div>
            <Link href="/dashboard/my-blogs" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {recentBlogs.length > 0 ? (
              recentBlogs.map((b) => (
                <div key={b._id} className="p-4 rounded-xl border border-white/5 hover:bg-white/[0.02] transition-all flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-white/5 border border-white/10 text-slate-400 uppercase">
                      {b.category}
                    </span>
                    <h4 className="text-sm font-semibold mt-1.5 text-white truncate">{b.title}</h4>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(b.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      b.status === "Published" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      b.status === "Draft" ? "bg-slate-500/10 text-slate-400 border border-white/10" :
                      b.status === "Reviewing" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                      b.status === "Rejected" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                      "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-500 text-sm">
                No blog posts created yet.
              </div>
            )}
          </div>
        </div>

        {/* Notifications & Comments summary */}
        <div className="bg-[#0c0c16] border border-white/5 rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="text-lg font-bold">Recent Reader Engagement</h3>
            <p className="text-xs text-slate-500">Comments left by readers on your publications.</p>
          </div>
          
          <div className="space-y-3.5">
            {blogs.flatMap(b => b.comments.map(c => ({ ...c, blogTitle: b.title, blogId: b._id }))).slice(0, 3).length > 0 ? (
              blogs.flatMap(b => b.comments.map(c => ({ ...c, blogTitle: b.title, blogId: b._id })))
                .slice(0, 3)
                .map((comment, i) => (
                  <div key={i} className="p-3.5 rounded-xl border border-white/5 hover:bg-white/[0.02] flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-white/10 flex items-center justify-center text-xs font-bold text-violet-300 shrink-0">
                      {comment.userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-semibold text-white">{comment.userName}</span>
                        <span className="text-[10px] text-slate-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{comment.content}</p>
                      <p className="text-[10px] text-violet-400 mt-1.5 truncate">on &ldquo;{comment.blogTitle}&rdquo;</p>
                    </div>
                  </div>
                ))
            ) : (
              <div className="py-8 text-center text-slate-500 text-sm">
                No comments or engagement activity recorded.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
