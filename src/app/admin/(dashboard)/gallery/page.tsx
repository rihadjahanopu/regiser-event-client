/* eslint-disable */
"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  ImageIcon,
  Loader2,
  Trash2,
  Upload,
  X,
  FolderOpen,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const CATEGORIES = [
  "Festival",
  "Awards",
  "Workshop",
  "Culture",
  "Seminar",
  "Community",
  "Other",
];

interface GalleryImage {
  _id: string;
  title: string;
  category: string;
  imageUrl: string;
  publicId: string;
  createdAt: string;
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = async () => {
    try {
      const res = await axios.get("/api/admin/gallery", {
        withCredentials: true,
      });
      setImages(res.data.data || []);
    } catch (err) {
      toast.error("Gallery images লোড করতে পারেনি");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("কোনো ছবি select করা হয়নি");
      return;
    }
    if (!title.trim()) {
      toast.error("Title দিন");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("title", title.trim());
      formData.append("category", category);

      const res = await axios.post(
        "/api/admin/gallery/upload",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("ছবি সফলভাবে upload হয়েছে!");
      setImages((prev) => [res.data.data, ...prev]);
      setTitle("");
      setCategory(CATEGORIES[0]);
      clearFile();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error || "Upload করতে সমস্যা হয়েছে"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("এই ছবিটি permanently delete করতে চান?")) return;
    setDeletingId(id);
    try {
      await axios.delete(`/api/admin/gallery/${id}`, {
        withCredentials: true,
      });
      toast.success("ছবি delete হয়েছে");
      setImages((prev) => prev.filter((img) => img._id !== id));
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Delete করতে সমস্যা হয়েছে");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Gallery Management</h1>
        <p className="text-slate-400 mt-1 text-sm">
          ছবি upload করুন, দেখুন এবং মুছুন — Public gallery-তে automatically দেখাবে
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="xl:col-span-1">
          <div className="bg-[#0c0c16] border border-white/5 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-white/5 pb-4">
              <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
                <Upload className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">নতুন ছবি Upload</p>
                <p className="text-[11px] text-slate-500">Cloudinary-তে store হবে</p>
              </div>
            </div>
            <form onSubmit={handleUpload} className="space-y-4">
              {/* Drop zone */}
              <div
                className={`relative border-2 border-dashed rounded-xl transition-colors cursor-pointer ${
                  preview
                    ? "border-violet-500/50"
                    : "border-white/10 hover:border-violet-500/40"
                }`}
                onClick={() => !preview && fileInputRef.current?.click()}
              >
                {preview ? (
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearFile();
                      }}
                      className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-3">
                      <ImageIcon className="w-6 h-6 text-slate-500" />
                    </div>
                    <p className="text-sm text-slate-400">
                      ক্লিক করুন অথবা ছবি drag করুন
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      PNG, JPG, WEBP — সর্বোচ্চ 10MB
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="e.g. Youth Leadership Summit"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-all"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-all"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={uploading || !selectedFile}
                className="w-full h-10 bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload করুন
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="xl:col-span-2">
          <div className="bg-[#0c0c16] border border-white/5 rounded-2xl p-6 h-full">
            <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                <FolderOpen className="w-4 h-4 text-indigo-400" />
              </div>
              <p className="text-sm font-bold text-white">Gallery Images</p>
              <span className="ml-auto text-xs text-slate-500">{images.length} টি ছবি</span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
              </div>
            ) : images.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
                  <ImageIcon className="w-7 h-7 text-slate-600" />
                </div>
                <p className="font-medium text-slate-400 text-sm">এখনো কোনো ছবি নেই</p>
                <p className="text-xs text-slate-600 mt-1">বামের form দিয়ে প্রথম ছবিটি upload করুন</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {images.map((img) => (
                  <div
                    key={img._id}
                    className="group relative rounded-xl overflow-hidden border border-white/5 bg-white/3 hover:border-white/10 transition-all"
                  >
                    <img
                      src={img.imageUrl}
                      alt={img.title}
                      className="w-full h-40 object-cover"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-200 flex items-center justify-center">
                      <button
                        onClick={() => handleDelete(img._id)}
                        disabled={deletingId === img._id}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow-lg"
                      >
                        {deletingId === img._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {/* Info */}
                    <div className="p-2.5">
                      <p className="text-xs font-semibold text-slate-200 truncate">
                        {img.title}
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400">
                        {img.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
