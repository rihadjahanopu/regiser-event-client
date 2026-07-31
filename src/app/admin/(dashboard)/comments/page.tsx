"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Trash2, RefreshCw, Search, ExternalLink } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface Comment {
  id: string;
  blogId: string;
  blogTitle: string;
  blogSlug: string;
  userName: string;
  userImage?: string;
  content: string;
  createdAt: string;
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchComments(); }, []);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/comments");
      if (res.data.success) setComments(res.data.data);
    } catch (err) {
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Permanently delete this comment?")) return;
    try {
      const res = await axios.delete(`/api/admin/comments/${commentId}`);
      if (res.data.success) {
        toast.success("Comment deleted");
        setComments(comments.filter(c => c.id !== commentId));
      }
    } catch (err) {
      toast.error("Failed to delete comment");
    }
  };

  const filtered = comments.filter(c =>
    c.userName.toLowerCase().includes(search.toLowerCase()) ||
    c.content.toLowerCase().includes(search.toLowerCase()) ||
    c.blogTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Comment Moderation</h1>
          <p className="text-slate-400 text-xs mt-0.5">Review and remove inappropriate or flagged reader comments.</p>
        </div>
        <button onClick={fetchComments} className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search by user, content, or blog title..."
          className="w-full h-10 pl-10 pr-4 bg-[#0c0c16] border border-white/10 rounded-xl text-sm placeholder-slate-500 text-white focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-[#0c0c16] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-7 h-7 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filtered.length > 0 ? (
          <div className="divide-y divide-white/5">
            {filtered.map(comment => (
              <div key={comment.id} className="p-5 flex items-start gap-4 hover:bg-white/3 transition-all group">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {comment.userName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-white">{comment.userName}</span>
                    <span className="text-[11px] text-slate-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-2">{comment.content}</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <MessageSquare className="w-3 h-3" />
                    <span>On: </span>
                    <span className="font-medium text-violet-400 truncate max-w-[250px]">{comment.blogTitle}</span>
                    <a
                      href={`/blog/${comment.blogSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-violet-400 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0 opacity-0 group-hover:opacity-100"
                  title="Delete comment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 text-slate-700" />
            <p className="text-sm text-slate-500">No comments found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
