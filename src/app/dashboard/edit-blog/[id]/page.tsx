"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Upload, 
  Image as ImageIcon, 
  Clock, 
  Sparkles, 
  Save, 
  Send, 
  Bold,
  Italic,
  Code,
  Quote,
  List,
  Heading2,
  Heading3
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditBlogPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = React.use(params);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [shortDescription, setShortDescription] = useState("");
  const [content, setContent] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  
  // File uploads / Previews
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [featuredFile, setFeaturedFile] = useState<File | null>(null);
  const [featuredPreview, setFeaturedPreview] = useState<string | null>(null);

  const [readingTime, setReadingTime] = useState(1);
  const [categories, setCategories] = useState<string[]>([
    "Event Recap", "Insights", "Stories", "Education", "Islamic", "Youth Leadership"
  ]);

  // Load existing blog details and categories
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch categories first
        try {
          const catRes = await axios.get("/api/admin/categories");
          if (catRes.data.success && catRes.data.data.length > 0) {
            setCategories(catRes.data.data.map((c: any) => c.name));
          }
        } catch (e) {}

        // Fetch blog by id
        const res = await axios.get(`/api/blog/by-id/${id}`);
        if (res.data.success) {
          const blog = res.data.data;
          setTitle(blog.title);
          setCategory(blog.category);
          setTags(blog.tags || []);
          setShortDescription(blog.shortDescription);
          setContent(blog.content);
          setSeoTitle(blog.seoTitle || "");
          setSeoDescription(blog.seoDescription || "");
          setCoverPreview(blog.coverImage || null);
          setFeaturedPreview(blog.featuredImage || null);
        }
      } catch (err) {
        toast.error("Failed to load blog details");
        router.push("/dashboard/my-blogs");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, router]);

  // Update reading time automatically
  useEffect(() => {
    const words = content.replace(/<[^>]*>/g, "").split(/\s+/).filter(w => w.length > 0).length;
    const time = Math.ceil(words / 200) || 1;
    setReadingTime(time);
  }, [content]);

  // Helper to add formatted text to custom editor
  const insertFormatting = (type: string) => {
    const textarea = document.getElementById("blog-editor") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    let replacement = "";
    switch (type) {
      case "bold":
        replacement = `**${selected || "bold text"}**`;
        break;
      case "italic":
        replacement = `*${selected || "italic text"}*`;
        break;
      case "code":
        replacement = `\`${selected || "code"}\``;
        break;
      case "quote":
        replacement = `\n> ${selected || "quote"}\n`;
        break;
      case "list":
        replacement = `\n- ${selected || "list item"}\n`;
        break;
      case "h2":
        replacement = `\n## ${selected || "Heading 2"}\n`;
        break;
      case "h3":
        replacement = `\n### ${selected || "Heading 3"}\n`;
        break;
      default:
        return;
    }

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setContent(newContent);
    
    // Focus back on editor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + 2, start + 2 + (selected || "").length);
    }, 50);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const cleanTag = tagInput.trim().replace(/,/g, "");
      if (cleanTag && !tags.includes(cleanTag)) {
        setTags([...tags, cleanTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "cover" | "featured") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "cover") {
        setCoverFile(file);
        setCoverPreview(reader.result as string);
      } else {
        setFeaturedFile(file);
        setFeaturedPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (isDraft: boolean) => {
    if (!title || !category || !shortDescription || !content) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("tags", JSON.stringify(tags));
    formData.append("shortDescription", shortDescription);
    formData.append("content", content);
    formData.append("seoTitle", seoTitle || title);
    formData.append("seoDescription", seoDescription || shortDescription);
    formData.append("isDraft", String(isDraft));

    // Append cover image file if updated
    if (coverFile) {
      formData.append("coverImage", coverFile);
    } else if (coverPreview) {
      formData.append("coverImageUrl", coverPreview);
    }
    
    // Append featured image file if updated
    if (featuredFile) {
      formData.append("featuredImage", featuredFile);
    } else if (featuredPreview) {
      formData.append("featuredImageUrl", featuredPreview);
    }

    try {
      const response = await axios.put(`/api/blog/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(isDraft ? "Draft saved successfully!" : "Submitted for admin review!");
        router.push("/dashboard/my-blogs");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to update blog");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/my-blogs" className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Blog Post</h1>
          <p className="text-slate-400 text-xs mt-0.5">Modify and re-submit your draft or rejected blog post.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-white/5 bg-[#0c0c16] text-white">
            <CardContent className="p-6 space-y-6">
              {/* Blog Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-300">Blog Title <span className="text-red-500">*</span></Label>
                <Input 
                  id="title"
                  placeholder="Enter a compelling title..."
                  className="bg-white/5 border-white/10 h-12 text-white placeholder-slate-500 focus-visible:ring-violet-600 focus-visible:border-violet-600"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Short Description */}
              <div className="space-y-2">
                <Label htmlFor="shortDescription" className="text-slate-300">Short Description <span className="text-red-500">*</span></Label>
                <textarea
                  id="shortDescription"
                  rows={3}
                  placeholder="Provide a brief summary..."
                  className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-600 focus-visible:border-violet-600 resize-y"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                />
              </div>

              {/* Rich Text Editor */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="blog-editor" className="text-slate-300">Blog Content <span className="text-red-500">*</span></Label>
                  <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-0.5 rounded-lg">
                    <button type="button" onClick={() => insertFormatting("bold")} className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-all" title="Bold"><Bold className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => insertFormatting("italic")} className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-all" title="Italic"><Italic className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => insertFormatting("h2")} className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-all text-xs font-bold" title="H2"><Heading2 className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => insertFormatting("h3")} className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-all text-xs font-bold" title="H3"><Heading3 className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => insertFormatting("code")} className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-all" title="Inline Code"><Code className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => insertFormatting("quote")} className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-all" title="Quote"><Quote className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => insertFormatting("list")} className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-all" title="List"><List className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                
                <textarea
                  id="blog-editor"
                  rows={15}
                  placeholder="Write your blog post in detail..."
                  className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-mono text-white placeholder-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-600 focus-visible:border-violet-600 resize-y"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Estimated Reading Time: <strong>{readingTime} min read</strong>
                  </span>
                  <span>Markdown formatting supported</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO Metadata Card */}
          <Card className="border-white/5 bg-[#0c0c16] text-white">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <h3 className="text-sm font-bold">SEO & Metadata Options</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoTitle" className="text-slate-300">SEO Meta Title</Label>
                <Input 
                  id="seoTitle"
                  placeholder="Fallback is the blog title..."
                  className="bg-white/5 border-white/10 text-white placeholder-slate-500"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoDescription" className="text-slate-300">SEO Meta Description</Label>
                <textarea
                  id="seoDescription"
                  rows={2}
                  placeholder="Fallback is the short description..."
                  className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus-visible:outline-none"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel Controls */}
        <div className="space-y-6">
          {/* Cover Image Card */}
          <Card className="border-white/5 bg-[#0c0c16] text-white">
            <CardContent className="p-6 space-y-4">
              <Label className="text-slate-300 block">Cover Image</Label>
              
              <div className="relative group rounded-xl border border-dashed border-white/10 bg-white/5 hover:bg-white/[0.07] overflow-hidden flex flex-col items-center justify-center h-44 cursor-pointer transition-all">
                {coverPreview ? (
                  <>
                    <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-white text-xs font-semibold">
                      Change Image
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4 flex flex-col items-center">
                    <Upload className="w-6 h-6 text-slate-500 mb-2" />
                    <span className="text-xs text-slate-400">Select cover image file</span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "cover")}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>

          {/* Featured Image Card */}
          <Card className="border-white/5 bg-[#0c0c16] text-white">
            <CardContent className="p-6 space-y-4">
              <Label className="text-slate-300 block">Featured Image</Label>
              
              <div className="relative group rounded-xl border border-dashed border-white/10 bg-white/5 hover:bg-white/[0.07] overflow-hidden flex flex-col items-center justify-center h-32 cursor-pointer transition-all">
                {featuredPreview ? (
                  <>
                    <img src={featuredPreview} alt="Featured Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-white text-xs font-semibold">
                      Change Image
                    </div>
                  </>
                ) : (
                  <div className="text-center p-3 flex flex-col items-center">
                    <ImageIcon className="w-5 h-5 text-slate-500 mb-1.5" />
                    <span className="text-xs text-slate-400">Select featured image file</span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "featured")}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>

          {/* Category & Tags Card */}
          <Card className="border-white/5 bg-[#0c0c16] text-white">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-slate-300">Category <span className="text-red-500">*</span></Label>
                <select
                  id="category"
                  className="w-full h-11 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white focus-visible:outline-none"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="" disabled className="bg-[#0c0c16]">Select Category</option>
                  {categories.map((c) => (
                    <option key={c} value={c} className="bg-[#0c0c16]">{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-slate-300">Tags</Label>
                <Input 
                  id="tags"
                  placeholder="Press Enter to add tag"
                  className="bg-white/5 border-white/10 text-white"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                />
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {tags.map((tag, idx) => (
                      <span 
                        key={tag}
                        className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-violet-600/20 border border-violet-500/20 text-violet-300 font-semibold"
                      >
                        {tag}
                        <button type="button" onClick={() => removeTag(idx)} className="hover:text-red-400">&times;</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Form Submit Controls */}
          <Card className="border-white/5 bg-[#0c0c16] text-white">
            <CardContent className="p-6 space-y-3">
              <Button
                type="button"
                onClick={() => handleSubmit(true)}
                disabled={saving}
                className="w-full h-11 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white rounded-xl flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save as Draft
              </Button>

              <Button
                type="button"
                onClick={() => handleSubmit(false)}
                disabled={saving}
                className="w-full h-11 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-violet-600/25"
              >
                <Send className="w-4 h-4" />
                Submit for Review
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
