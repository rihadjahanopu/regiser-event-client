"use client";

import { useEffect, useState } from "react";
import { Layers, Plus, Trash2, RefreshCw, Tag } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Categories & Tags</h1>
          <p className="text-slate-500 text-xs mt-0.5">Manage the taxonomy used to organise blog content.</p>
        </div>
        <button onClick={fetchData} className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-slate-500 transition-all">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Categories */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Layers className="w-4 h-4 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Categories ({categories.length})</h2>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="New category name..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCategory()}
                className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 h-9 text-sm"
              />
              <Button onClick={addCategory} disabled={saving} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-3 shrink-0">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-8"><div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
              ) : categories.length > 0 ? categories.map(cat => (
                <div key={cat._id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 group">
                  <div>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{cat.name}</span>
                    <span className="text-[10px] text-slate-400 ml-2">/{cat.slug}</span>
                  </div>
                  <button onClick={() => deleteCategory(cat._id)} className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )) : (
                <p className="text-sm text-slate-400 text-center py-6">No categories created yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Tag className="w-4 h-4 text-violet-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Tags ({tags.length})</h2>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="New tag name..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag()}
                className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 h-9 text-sm"
              />
              <Button onClick={addTag} disabled={saving} size="sm" className="bg-violet-600 hover:bg-violet-700 text-white h-9 px-3 shrink-0">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-8 w-full"><div className="w-5 h-5 border-2 border-violet-600 border-t-transparent rounded-full animate-spin"></div></div>
              ) : tags.length > 0 ? tags.map(tag => (
                <div key={tag._id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800 text-violet-700 dark:text-violet-400 group">
                  <span className="text-xs font-semibold">#{tag.name}</span>
                  <button onClick={() => deleteTag(tag._id)} className="text-violet-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                </div>
              )) : (
                <p className="text-sm text-slate-400 text-center py-6 w-full">No tags created yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
