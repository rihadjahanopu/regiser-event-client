"use client";

import { useEffect, useState } from "react";
import { BookOpen, Eye, Trash2, RefreshCw, Search, Calendar, User } from "lucide-react";
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Published Blogs</h1>
          <p className="text-slate-500 text-xs mt-0.5">View and manage all publicly published blog articles.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            {blogs.length} Published
          </span>
          <button onClick={fetchBlogs} className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-slate-500 transition-all">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search published blogs..."
          className="w-full h-10 pl-10 pr-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm placeholder-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-7 h-7 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filtered.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500">
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
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filtered.map(blog => (
                    <tr key={blog._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-all">
                      <td className="px-6 py-4">
                        {blog.coverImage ? (
                          <img src={blog.coverImage} alt={blog.title} className="w-14 h-9 rounded object-cover border border-slate-200 dark:border-slate-700" />
                        ) : (
                          <div className="w-14 h-9 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-slate-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white max-w-[180px] truncate">{blog.title}</td>
                      <td className="px-6 py-4">
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">{blog.category}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1.5">
                        <User className="w-3 h-3" />{blog.author?.name || "Unknown"}
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-slate-900 dark:text-white">{blog.views}</td>
                      <td className="px-6 py-4 text-center font-medium text-slate-900 dark:text-white">{blog.likes?.length || 0}</td>
                      <td className="px-6 py-4 text-center font-medium text-slate-900 dark:text-white">{blog.comments?.length || 0}</td>
                      <td className="px-6 py-4 text-slate-400 text-xs">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(blog.createdAt).toLocaleDateString()}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <a
                            href={`/blog/${blog.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                            title="View Live"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => handleDelete(blog._id)}
                            className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all"
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
            <div className="py-20 text-center text-slate-400">
              <BookOpen className="w-10 h-10 mx-auto mb-3 text-slate-300 dark:text-slate-700" />
              <p className="text-sm">No published blogs found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
