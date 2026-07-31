"use client";

import { useEffect, useState } from "react";
import { BookOpen, Eye, Trash2, RefreshCw, Search, Calendar, User, ExternalLink } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

interface Blog {
  _id: string;
  title: string;
  category: string;
  status: string;
  views: number;
  likes: string[];
  comments: any[];
  coverImage?: string;
  author?: { name: string; email: string };
  createdAt: string;
  slug: string;
}

export default function PublishedBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchBlogs(); }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/blogs/published");
      if (res.data.success) setBlogs(res.data.data);
    } catch (err) {
      toast.error("Failed to load published blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this published blog post?")) return;
    try {
      const res = await axios.delete(`/api/admin/blogs/${id}`);
      if (res.data.success) {
        toast.success("Blog deleted");
        setBlogs(blogs.filter(b => b._id !== id));
      }
    } catch (err) {
      toast.error("Failed to delete blog");
    }
  };

  const filtered = blogs.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Published Blogs</h1>
          <p className="text-slate-400 text-xs mt-1">View and manage all live, publicly accessible blog articles.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            {blogs.length} Published
          </span>
          <button onClick={fetchBlogs} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 transition-all border border-white/10" title="Refresh list">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search published blogs..."
          className="w-full h-10 pl-10 pr-4 bg-[#0c0c16] border border-white/10 rounded-xl text-sm placeholder-slate-500 text-white focus:outline-none focus:border-violet-500 transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="border-white/5 bg-[#0c0c16] text-white shadow-xl overflow-hidden rounded-2xl">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filtered.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm text-left">
                <thead className="bg-white/[0.02] border-b border-white/5 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Cover</th>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Author</th>
                    <th className="px-6 py-4 text-center">Views</th>
                    <th className="px-6 py-4 text-center">Likes</th>
                    <th className="px-6 py-4 text-center">Comments</th>
                    <th className="px-6 py-4">Published</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map(blog => (
                    <tr key={blog._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        {blog.coverImage ? (
                          <img src={blog.coverImage} alt={blog.title} className="w-14 h-9 rounded-lg object-cover border border-white/10" />
                        ) : (
                          <div className="w-14 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-slate-500" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-white max-w-[200px] truncate">{blog.title}</td>
                      <td className="px-6 py-4">
                        <span className="text-[11px] px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 font-medium">
                          {blog.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-300 text-xs">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-violet-400" />
                          <span className="truncate">{blog.author?.name || "Unknown"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-white">{blog.views}</td>
                      <td className="px-6 py-4 text-center font-semibold text-white">{blog.likes?.length || 0}</td>
                      <td className="px-6 py-4 text-center font-semibold text-white">{blog.comments?.length || 0}</td>
                      <td className="px-6 py-4 text-slate-400 text-xs">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(blog.createdAt).toLocaleDateString()}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <a
                            href={`/blog/${blog.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/5 transition-all"
                            title="View Live Article"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => handleDelete(blog._id)}
                            className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-500 p-8">
              <BookOpen className="w-10 h-10 mx-auto mb-3 text-slate-600" />
              <p className="text-sm font-medium text-slate-400">No published blogs found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
