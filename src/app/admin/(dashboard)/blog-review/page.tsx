"use client";

import { useEffect, useState } from "react";
import { 
  FileCheck2, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Search,
  Clock,
  User,
  Tag,
  ChevronRight,
  X,
  AlertTriangle
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface Blog {
  _id: string;
  title: string;
  category: string;
  status: string;
  shortDescription: string;
  content: string;
  coverImage?: string;
  tags: string[];
  estimatedReadingTime: number;
  author?: { name: string; email: string; image?: string };
  createdAt: string;
}

export default function BlogReviewPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/blogs/review");
      if (res.data.success) {
        setBlogs(res.data.data);
      }
    } catch (err) {
      toast.error("Failed to fetch blogs for review");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setProcessing(id);
    try {
      const res = await axios.post(`/api/admin/blogs/review/${id}/approve`);
      if (res.data.success) {
        toast.success("Blog approved and published successfully!");
        setBlogs(blogs.filter(b => b._id !== id));
        setSelectedBlog(null);
      }
    } catch (err) {
      toast.error("Failed to approve blog");
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async () => {
    if (!rejectingId) return;
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    setProcessing(rejectingId);
    try {
      const res = await axios.post(`/api/admin/blogs/review/${rejectingId}/reject`, {
        reason: rejectionReason.trim()
      });
      if (res.data.success) {
        toast.success("Blog rejected with reason provided");
        setBlogs(blogs.filter(b => b._id !== rejectingId));
        setSelectedBlog(null);
        setShowRejectModal(false);
        setRejectionReason("");
        setRejectingId(null);
      }
    } catch (err) {
      toast.error("Failed to reject blog");
    } finally {
      setProcessing(null);
    }
  };

  const filteredBlogs = blogs.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Blog Review Queue</h1>
          <p className="text-slate-500 text-xs mt-0.5">Review and approve or reject submitted blog posts from users.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            {blogs.length} Pending Review
          </span>
          <button onClick={fetchBlogs} className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-slate-500 transition-all">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by title or category..."
          className="w-full h-10 pl-10 pr-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Blog Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredBlogs.map((blog) => (
            <Card key={blog._id} className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden group hover:shadow-md transition-all">
              {blog.coverImage && (
                <img src={blog.coverImage} alt={blog.title} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500" />
              )}
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                    {blog.status}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {blog.estimatedReadingTime} min read
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight line-clamp-2">{blog.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{blog.shortDescription}</p>

                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <User className="w-3 h-3" />
                  <span>{blog.author?.name || "Unknown Author"}</span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>

                {blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {blog.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setSelectedBlog(blog)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </button>
                  <button
                    onClick={() => handleApprove(blog._id)}
                    disabled={processing === blog._id}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => { setRejectingId(blog._id); setShowRejectModal(true); }}
                    disabled={processing === blog._id}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all disabled:opacity-50"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-slate-500">
          <FileCheck2 className="w-10 h-10 mx-auto mb-3 text-slate-300 dark:text-slate-700" />
          <p className="text-sm">No blogs pending review. All clear!</p>
        </div>
      )}

      {/* Blog Preview Modal */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
            >
              <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                    {selectedBlog.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5 truncate max-w-[400px]">{selectedBlog.title}</h3>
                </div>
                <button onClick={() => setSelectedBlog(null)} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {selectedBlog.coverImage && (
                  <img src={selectedBlog.coverImage} alt="Cover" className="w-full h-48 object-cover rounded-xl" />
                )}
                <p className="text-sm text-slate-500 dark:text-slate-400 italic border-l-4 border-blue-500 pl-3">
                  {selectedBlog.shortDescription}
                </p>
                <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {selectedBlog.content.replace(/<[^>]*>/g, "")}
                </div>
              </div>

              <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex gap-3 justify-end">
                <Button
                  onClick={() => { setRejectingId(selectedBlog._id); setSelectedBlog(null); setShowRejectModal(true); }}
                  className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 border-0"
                >
                  <XCircle className="w-4 h-4 mr-1.5" /> Reject
                </Button>
                <Button
                  onClick={() => handleApprove(selectedBlog._id)}
                  disabled={processing === selectedBlog._id}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" /> Approve & Publish
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rejection Reason Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900 rounded-2xl w-full max-w-md p-6 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Reject Blog Post</h3>
                  <p className="text-xs text-slate-500 mt-0.5">This rejection reason will be shown to the author.</p>
                </div>
              </div>

              <textarea
                rows={4}
                placeholder="Describe in detail why this blog is being rejected (e.g., content quality, inaccurate info, policy violations)..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 resize-none"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => { setShowRejectModal(false); setRejectionReason(""); setRejectingId(null); }}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border-0"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={processing === rejectingId}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {processing ? "Rejecting..." : "Confirm Rejection"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
