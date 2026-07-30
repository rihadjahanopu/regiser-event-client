"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { 
  BarChart2, 
  Eye, 
  Heart, 
  MessageSquare, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Loader2,
  ArrowUpRight,
  Sparkles
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface BlogAnalyticsItem {
  _id: string;
  title: string;
  slug: string;
  category: string;
  status: "Draft" | "Reviewing" | "Pending" | "Published" | "Rejected";
  views: number;
  likes: string[];
  comments: any[];
  estimatedReadingTime: number;
  createdAt: string;
}

export default function UserBlogAnalyticsPage() {
  const [blogs, setBlogs] = useState<BlogAnalyticsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  const fetchMyBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/blog/my-blogs");
      if (res.data.success) {
        setBlogs(res.data.data || []);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Aggregate Metrics
  const totalBlogs = blogs.length;
  const publishedBlogs = blogs.filter((b) => b.status === "Published");
  const totalViews = blogs.reduce((acc, b) => acc + (b.views || 0), 0);
  const totalLikes = blogs.reduce((acc, b) => acc + (b.likes?.length || 0), 0);
  const totalComments = blogs.reduce((acc, b) => acc + (b.comments?.length || 0), 0);
  const reviewingCount = blogs.filter((b) => b.status === "Reviewing" || b.status === "Pending").length;
  const draftCount = blogs.filter((b) => b.status === "Draft").length;
  const rejectedCount = blogs.filter((b) => b.status === "Rejected").length;

  const categories = Array.from(new Set(blogs.map((b) => b.category).filter(Boolean)));

  const filteredBlogs = selectedCategory === "all"
    ? blogs
    : blogs.filter((b) => b.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="w-9 h-9 animate-spin text-violet-500 mb-3" />
        <p className="text-sm font-medium">Loading blog analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-center my-8">
        <p className="font-semibold">Failed to load analytics data.</p>
        <button 
          onClick={fetchMyBlogs}
          className="mt-3 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-xs font-semibold transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <BarChart2 className="w-8 h-8 text-violet-400" />
            Blog Analytics & Performance
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Track engagement, readership metrics, and status breakdown across all your articles.
          </p>
        </div>
        <Link 
          href="/dashboard/add-blog"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium text-sm shadow-lg shadow-violet-600/25 transition-all hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4" />
          Write New Article
        </Link>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="bg-[#0c0c16] border-white/5 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/10 rounded-full blur-2xl -mr-6 -mt-6" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Views</span>
              <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <Eye className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {totalViews.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Across {publishedBlogs.length} published articles
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#0c0c16] border-white/5 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-pink-600/10 rounded-full blur-2xl -mr-6 -mt-6" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Likes</span>
              <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
                <Heart className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {totalLikes.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500">Reader appreciation reactions</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0c0c16] border-white/5 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-600/10 rounded-full blur-2xl -mr-6 -mt-6" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Comments</span>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {totalComments.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500">Community discussion responses</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0c0c16] border-white/5 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-600/10 rounded-full blur-2xl -mr-6 -mt-6" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Articles</span>
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {totalBlogs}
            </div>
            <p className="text-xs text-slate-500">
              {publishedBlogs.length} Published &bull; {reviewingCount} Pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown Section */}
      <Card className="bg-[#0c0c16] border-white/5 text-white">
        <CardContent className="p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
            <FileText className="w-5 h-5 text-violet-400" />
            Article Status Breakdown
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
                <CheckCircle2 className="w-4 h-4" /> Published
              </div>
              <div className="text-2xl font-bold text-white">{publishedBlogs.length}</div>
            </div>

            <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
                <Clock className="w-4 h-4" /> Under Review
              </div>
              <div className="text-2xl font-bold text-white">{reviewingCount}</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-500/20 bg-slate-500/5">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
                <FileText className="w-4 h-4" /> Drafts
              </div>
              <div className="text-2xl font-bold text-white">{draftCount}</div>
            </div>

            <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
              <div className="flex items-center gap-2 text-red-400 text-xs font-semibold mb-1">
                <XCircle className="w-4 h-4" /> Rejected
              </div>
              <div className="text-2xl font-bold text-white">{rejectedCount}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Article Performance Table */}
      <Card className="bg-[#0c0c16] border-white/5 text-white">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-violet-400" />
              Article Performance Overview
            </h2>

            {categories.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Category:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg text-xs h-8 px-2.5 text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="all" className="bg-[#0c0c16]">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#0c0c16]">{cat}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {filteredBlogs.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30 text-violet-400" />
              <p className="text-sm font-medium">No articles found.</p>
              <p className="text-xs mt-1 text-slate-600">Start writing your first article to see live performance analytics.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs text-slate-500 uppercase bg-white/[0.02] border-b border-white/5">
                  <tr>
                    <th className="py-3 px-4">Article Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Views</th>
                    <th className="py-3 px-4 text-center">Likes</th>
                    <th className="py-3 px-4 text-center">Comments</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredBlogs.map((b) => (
                    <tr key={b._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 max-w-xs truncate font-medium text-white">
                        {b.title}
                        <div className="text-[11px] text-slate-500 font-normal">
                          {new Date(b.createdAt).toLocaleDateString()} &bull; {b.estimatedReadingTime || 1} min read
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-white/5 border border-white/10 text-slate-300">
                          {b.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {b.status === "Published" && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            Published
                          </span>
                        )}
                        {b.status === "Reviewing" && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/10 border border-amber-500/20 text-amber-400">
                            Reviewing
                          </span>
                        )}
                        {b.status === "Draft" && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-500/10 border border-slate-500/20 text-slate-400">
                            Draft
                          </span>
                        )}
                        {b.status === "Rejected" && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-500/10 border border-red-500/20 text-red-400">
                            Rejected
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-white">
                        {b.views || 0}
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-white">
                        {b.likes?.length || 0}
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-white">
                        {b.comments?.length || 0}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {b.status === "Published" ? (
                          <Link 
                            href={`/blog/${b.slug}`}
                            className="inline-flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 font-medium"
                          >
                            View Post <ArrowUpRight className="w-3 h-3" />
                          </Link>
                        ) : (
                          <Link 
                            href={`/dashboard/edit-blog/${b._id}`}
                            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white font-medium"
                          >
                            Edit Draft
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
