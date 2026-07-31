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
  X,
  AlertTriangle,
  Sparkles
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

  const handleApprove = async (blogId: string) => {
    setProcessing(blogId);
    try {
      const res = await axios.post(`/api/admin/blogs/${blogId}/approve`);
      if (res.data.success) {
        toast.success("Blog article approved and published successfully!");
        setBlogs(blogs.filter(b => b._id !== blogId));
        if (selectedBlog?._id === blogId) setSelectedBlog(null);
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
      toast.error("Please provide a rejection reason for the author");
      return;
    }

    setProcessing(rejectingId);
    try {
      const res = await axios.post(`/api/admin/blogs/${rejectingId}/reject`, {
        rejectionReason
      });
      if (res.data.success) {
        toast.success("Blog article rejected");
        setBlogs(blogs.filter(b => b._id !== rejectingId));
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Moderation Queue
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Blog Review Queue</h1>
          <p className="text-slate-400 text-xs mt-1">Review and approve or reject submitted blog posts from authors.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
            {blogs.length} Pending Review
          </span>
          <button onClick={fetchBlogs} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 transition-all border border-white/10" title="Refresh queue">
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
          className="w-full h-10 pl-10 pr-4 bg-[#0c0c16] border border-white/10 rounded-xl text-sm placeholder-slate-500 text-white focus:outline-none focus:border-violet-500 transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Blog Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredBlogs.map((blog) => (
            <Card key={blog._id} className="border-white/5 bg-[#0c0c16] text-white shadow-xl overflow-hidden group hover:border-violet-500/40 transition-all flex flex-col justify-between">
              <div>
                {blog.coverImage && (
                  <div className="h-40 w-full overflow-hidden relative">
                    <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {blog.status}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {blog.estimatedReadingTime} min read
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug line-clamp-2 group-hover:text-violet-300 transition-colors">{blog.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{blog.shortDescription}</p>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                    <User className="w-3 h-3 text-violet-400" />
                    <span className="truncate">{blog.author?.name || "Unknown Author"}</span>
                    <span>&bull;</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>

                  {blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {blog.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </div>

              <div className="p-5 pt-0">
                <div className="flex gap-2 pt-3 border-t border-white/5">
                  <button
                    onClick={() => setSelectedBlog(blog)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </button>
                  <button
                    onClick={() => handleApprove(blog._id)}
                    disabled={processing === blog._id}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => { setRejectingId(blog._id); setShowRejectModal(true); }}
                    disabled={processing === blog._id}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all disabled:opacity-50"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-slate-500 bg-[#0c0c16] rounded-2xl border border-white/5 p-8">
          <FileCheck2 className="w-10 h-10 mx-auto mb-3 text-slate-600" />
          <p className="text-sm font-medium text-slate-400">No blogs pending review. All clear!</p>
        </div>
      )}

      {/* Blog Preview Modal */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#0c0c16] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden text-white shadow-2xl"
            >
              <div className="flex justify-between items-center p-5 border-b border-white/5">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {selectedBlog.category}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5 truncate max-w-[400px]">{selectedBlog.title}</h3>
                </div>
                <button onClick={() => setSelectedBlog(null)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/5">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {selectedBlog.coverImage && (
                  <img src={selectedBlog.coverImage} alt="Cover" className="w-full h-52 object-cover rounded-xl border border-white/5" />
                )}
                <p className="text-sm text-slate-300 italic border-l-4 border-violet-500 pl-3 py-1 bg-white/[0.02] rounded-r-lg">
                  {selectedBlog.shortDescription}
                </p>
                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap pt-2">
                  {selectedBlog.content.replace(/<[^>]*>/g, "")}
                </div>
              </div>

              <div className="p-4 border-t border-white/5 flex gap-3 justify-end bg-white/[0.01]">
                <Button
                  onClick={() => { setRejectingId(selectedBlog._id); setSelectedBlog(null); setShowRejectModal(true); }}
                  className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-xl"
                >
                  <XCircle className="w-4 h-4 mr-1.5" /> Reject
                </Button>
                <Button
                  onClick={() => handleApprove(selectedBlog._id)}
                  disabled={processing === selectedBlog._id}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#0c0c16] border border-red-500/20 rounded-2xl w-full max-w-md p-6 space-y-4 text-white shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Reject Blog Post</h3>
                  <p className="text-xs text-slate-400 mt-0.5">This rejection reason will be shown to the author.</p>
                </div>
              </div>

              <textarea
                rows={4}
                placeholder="Describe in detail why this blog is being rejected (e.g., content quality, inaccurate info, policy violations)..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 resize-none"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => { setShowRejectModal(false); setRejectionReason(""); setRejectingId(null); }}
                  className="flex-1 bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={processing === rejectingId}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-600/20"
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
