"use client";

import { useEffect, useState } from "react";
import { 
  Eye, 
  ThumbsUp, 
  MessageSquare, 
  TrendingUp, 
  Edit3, 
  Trash2, 
  Copy, 
  ExternalLink, 
  Calendar,
  Sparkles,
  Search,
  Plus,
  RefreshCw,
  X
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface Blog {
  _id: string;
  title: string;
  slug?: string;
  category: string;
  status: "Draft" | "Reviewing" | "Pending" | "Published" | "Rejected";
  views: number;
  likes: string[];
  comments: any[];
  reach: number;
  coverImage?: string;
  content: string;
  shortDescription: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export default function MyBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPreview, setSelectedPreview] = useState<Blog | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/blog/my-blogs");
      if (response.data.success) {
        setBlogs(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to load your blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this draft blog post?")) return;
    try {
      const res = await axios.delete(`/api/blog/${id}`);
      if (res.data.success) {
        toast.success("Blog deleted successfully");
        setBlogs(blogs.filter(b => b._id !== id));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to delete blog");
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const res = await axios.post(`/api/blog/${id}/duplicate`);
      if (res.data.success) {
        toast.success("Blog duplicated successfully! Check your drafts.");
        fetchBlogs();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to duplicate blog");
    }
  };

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) || 
    b.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Publications</h1>
          <p className="text-slate-400 text-xs mt-0.5">Manage and track your published articles, reviews, and drafts.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchBlogs}
            className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all"
            title="Refresh list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link href="/dashboard/add-blog">
            <Button className="h-10 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl flex items-center gap-1.5 shadow-lg shadow-violet-600/20">
              <Plus className="w-4 h-4" />
              Write Blog
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#0c0c16] border border-white/5 rounded-2xl p-4">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by title or category..."
            className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-xl text-sm placeholder-slate-500 text-white focus:outline-none focus:ring-1 focus:ring-violet-600 focus:border-violet-600"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Blogs Table */}
      <Card className="border-white/5 bg-[#0c0c16] text-white overflow-hidden shadow-2xl">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredBlogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-slate-300">
                <thead className="bg-white/[0.02] border-b border-white/5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Cover</th>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-center">Views</th>
                    <th className="px-6 py-4 text-center">Likes</th>
                    <th className="px-6 py-4 text-center">Comments</th>
                    <th className="px-6 py-4 text-center">Reach</th>
                    <th className="px-6 py-4">Created Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredBlogs.map((blog) => (
                    <tr key={blog._id} className="hover:bg-white/[0.01] transition-all">
                      <td className="px-6 py-4 shrink-0">
                        {blog.coverImage ? (
                          <img 
                            src={blog.coverImage} 
                            alt={blog.title} 
                            className="w-12 h-8 rounded object-cover border border-white/10" 
                          />
                        ) : (
                          <div className="w-12 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-slate-500">
                            No Img
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-white max-w-[200px] truncate" title={blog.title}>
                        {blog.title}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                          {blog.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          blog.status === "Published" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          blog.status === "Draft" ? "bg-slate-500/10 text-slate-400 border border-white/10" :
                          blog.status === "Reviewing" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                          blog.status === "Pending" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                          blog.status === "Rejected" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                          "bg-slate-500/10 text-slate-400 border border-white/10"
                        }`}>
                          {blog.status}
                        </span>
                        {blog.status === "Rejected" && blog.rejectionReason && (
                          <p className="text-[10px] text-red-400/80 mt-1 max-w-[100px] truncate" title={blog.rejectionReason}>
                            Reason: {blog.rejectionReason}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-white">{blog.views || 0}</td>
                      <td className="px-6 py-4 text-center font-medium text-white">{blog.likes?.length || 0}</td>
                      <td className="px-6 py-4 text-center font-medium text-white">{blog.comments?.length || 0}</td>
                      <td className="px-6 py-4 text-center font-medium text-white">{Math.round(blog.reach || (blog.views * 1.2 + (blog.likes?.length || 0) * 2))}</td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          {/* Preview Action */}
                          <button 
                            onClick={() => setSelectedPreview(blog)}
                            className="p-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-slate-400 hover:text-white transition-all"
                            title="Inline Preview"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          
                          {/* View Action (Dynamic Detail Page) */}
                          <Link 
                            href={`/blog/${blog.slug}`} 
                            target="_blank"
                            className="p-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-slate-400 hover:text-white transition-all flex items-center justify-center"
                            title="Open Article Page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          {/* Edit Action (Draft or Rejected only) */}
                          {(blog.status === "Draft" || blog.status === "Rejected") ? (
                            <Link 
                              href={`/dashboard/edit-blog/${blog._id}`} 
                              className="p-1.5 rounded-lg bg-violet-600/10 border border-violet-500/15 hover:bg-violet-600/20 text-violet-400 hover:text-violet-300 transition-all flex items-center justify-center"
                              title="Edit"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </Link>
                          ) : (
                            <button 
                              disabled 
                              className="p-1.5 rounded-lg bg-white/5 text-slate-700 cursor-not-allowed"
                              title="Edit disabled (Only drafts or rejected posts)"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Delete Action (Draft only) */}
                          {blog.status === "Draft" ? (
                            <button 
                              onClick={() => handleDelete(blog._id)}
                              className="p-1.5 rounded-lg bg-red-500/15 border border-red-500/15 hover:bg-red-500/25 text-red-400 hover:text-red-300 transition-all"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button 
                              disabled 
                              className="p-1.5 rounded-lg bg-white/5 text-slate-700 cursor-not-allowed"
                              title="Delete disabled (Only drafts can be deleted)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Duplicate Action */}
                          <button 
                            onClick={() => handleDuplicate(blog._id)}
                            className="p-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-slate-400 hover:text-white transition-all"
                            title="Duplicate"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-500">
              No blog publications found matching your search.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Modal Popup */}
      <AnimatePresence>
        {selectedPreview && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#0c0c16] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden text-white"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-5 border-b border-white/5">
                <div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-violet-600/20 text-violet-400 font-bold border border-violet-500/20 uppercase">
                    {selectedPreview.category}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5 truncate max-w-[500px]">
                    Previewing: {selectedPreview.title}
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedPreview(null)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body Content */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {selectedPreview.coverImage && (
                  <img 
                    src={selectedPreview.coverImage} 
                    alt="Cover" 
                    className="w-full h-56 object-cover rounded-xl border border-white/10" 
                  />
                )}
                
                <h1 className="text-2xl font-extrabold text-white">{selectedPreview.title}</h1>
                <p className="text-slate-400 text-sm italic border-l-2 border-violet-500 pl-3.5">
                  {selectedPreview.shortDescription}
                </p>

                <div 
                  className="text-slate-300 text-sm leading-relaxed prose prose-invert max-w-none font-sans"
                  dangerouslySetInnerHTML={{ __html: selectedPreview.content.replace(/\n/g, "<br/>") }}
                />
              </div>

              {/* Footer */}
              <div className="p-4 bg-white/[0.01] border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Created: {new Date(selectedPreview.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-3">
                  <span>Views: <strong>{selectedPreview.views}</strong></span>
                  <span>Likes: <strong>{selectedPreview.likes?.length || 0}</strong></span>
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
