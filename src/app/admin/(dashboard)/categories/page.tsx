"use client";

import { useEffect, useState } from "react";
import { Layers, Plus, Trash2, RefreshCw, Tag } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface Category { _id: string; name: string; slug: string; }
interface TagItem { _id: string; name: string; slug: string; }

export default function CategoriesTagsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [newTag, setNewTag] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, tagRes] = await Promise.all([
        axios.get("/api/admin/categories"),
        axios.get("/api/admin/tags"),
      ]);
      if (catRes.data.success) setCategories(catRes.data.data);
      if (tagRes.data.success) setTags(tagRes.data.data);
    } catch (err) {
      toast.error("Failed to fetch categories and tags");
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    setSaving(true);
    try {
      const res = await axios.post("/api/admin/categories", { name: newCategory.trim() });
      if (res.data.success) {
        toast.success("Category added!");
        setCategories([...categories, res.data.data]);
        setNewCategory("");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to add category");
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    try {
      await axios.delete(`/api/admin/categories/${id}`);
      toast.success("Category deleted");
      setCategories(categories.filter(c => c._id !== id));
    } catch (err) { toast.error("Failed to delete category"); }
  };

  const addTag = async () => {
    if (!newTag.trim()) return;
    setSaving(true);
    try {
      const res = await axios.post("/api/admin/tags", { name: newTag.trim() });
      if (res.data.success) {
        toast.success("Tag added!");
        setTags([...tags, res.data.data]);
        setNewTag("");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to add tag");
    } finally {
      setSaving(false);
    }
  };

  const deleteTag = async (id: string) => {
    if (!confirm("Delete this tag?")) return;
    try {
      await axios.delete(`/api/admin/tags/${id}`);
      toast.success("Tag deleted");
      setTags(tags.filter(t => t._id !== id));
    } catch (err) { toast.error("Failed to delete tag"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Categories & Tags</h1>
          <p className="text-slate-400 text-xs mt-0.5">Manage the taxonomy used to organise blog content.</p>
        </div>
        <button onClick={fetchData} className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Categories */}
        <div className="bg-[#0c0c16] border border-white/5 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
              <Layers className="w-4 h-4 text-violet-400" />
            </div>
            <h2 className="text-base font-bold text-white">Categories <span className="text-slate-500 font-normal text-sm">({categories.length})</span></h2>
          </div>
          <div className="flex gap-2">
            <input
              placeholder="New category name..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCategory()}
              className="flex-1 h-9 px-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-all"
            />
            <button
              onClick={addCategory}
              disabled={saving}
              className="h-9 px-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 text-white rounded-xl shrink-0 flex items-center gap-1 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {loading ? (
              <div className="flex justify-center py-8"><div className="w-5 h-5 border-2 border-violet-600 border-t-transparent rounded-full animate-spin"></div></div>
            ) : categories.length > 0 ? categories.map(cat => (
              <div key={cat._id} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/3 border border-white/5 hover:border-white/10 group transition-all">
                <div>
                  <span className="text-sm font-semibold text-slate-200">{cat.name}</span>
                  <span className="text-[10px] text-slate-500 ml-2">/{cat.slug}</span>
                </div>
                <button onClick={() => deleteCategory(cat._id)} className="p-1 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )) : (
              <p className="text-sm text-slate-500 text-center py-8">No categories created yet.</p>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="bg-[#0c0c16] border border-white/5 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
              <Tag className="w-4 h-4 text-indigo-400" />
            </div>
            <h2 className="text-base font-bold text-white">Tags <span className="text-slate-500 font-normal text-sm">({tags.length})</span></h2>
          </div>
          <div className="flex gap-2">
            <input
              placeholder="New tag name..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTag()}
              className="flex-1 h-9 px-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
            <button
              onClick={addTag}
              disabled={saving}
              className="h-9 px-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90 text-white rounded-xl shrink-0 flex items-center gap-1 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto pr-1">
            {loading ? (
              <div className="flex justify-center py-8 w-full"><div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>
            ) : tags.length > 0 ? tags.map(tag => (
              <div key={tag._id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 group hover:border-indigo-500/40 transition-all">
                <span className="text-xs font-semibold">#{tag.name}</span>
                <button onClick={() => deleteTag(tag._id)} className="text-indigo-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              </div>
            )) : (
              <p className="text-sm text-slate-500 text-center py-8 w-full">No tags created yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
