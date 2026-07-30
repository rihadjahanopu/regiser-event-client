"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Trash2, RefreshCw, Search, ExternalLink } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Comment Moderation</h1>
          <p className="text-slate-500 text-xs mt-0.5">Review and remove inappropriate or flagged reader comments.</p>
        </div>
        <button onClick={fetchComments} className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-slate-500 transition-all">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by user, content, or blog title..."
          className="w-full h-10 pl-10 pr-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-7 h-7 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filtered.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(comment => (
                <div key={comment.id} className="p-5 flex items-start gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-all">
                  <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-bold shrink-0">
                    {comment.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{comment.userName}</span>
                      <span className="text-[11px] text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-2">{comment.content}</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <MessageSquare className="w-3 h-3" />
                      <span>On: </span>
                      <span className="font-medium text-blue-600 dark:text-blue-400 truncate max-w-[250px]">{comment.blogTitle}</span>
                      <a
                        href={`/blog/${comment.blogSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shrink-0"
                    title="Delete comment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400">
              <MessageSquare className="w-10 h-10 mx-auto mb-3 text-slate-300 dark:text-slate-700" />
              <p className="text-sm">No comments found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
