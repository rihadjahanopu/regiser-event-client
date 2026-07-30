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
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

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

  // Upload form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch all gallery images
  const fetchImages = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/gallery`, {
        withCredentials: true,
      });
      setImages(res.data.data || []);
    } catch (err) {
      toast.error("Gallery images load করতে পারেনি");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // File selection + preview
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

  // Upload
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
        `${API_URL}/api/admin/gallery/upload`,
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

  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm("এই ছবিটি permanently delete করতে চান?")) return;
    setDeletingId(id);
    try {
      await axios.delete(`${API_URL}/api/admin/gallery/${id}`, {
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Gallery Management
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          ছবি upload করুন, দেখুন এবং মুছুন — Public gallery-তে automatically দেখাবে
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Upload Form */}
        <div className="xl:col-span-1">
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-500" />
                নতুন ছবি Upload
              </CardTitle>
              <CardDescription>
                Cloudinary-তে store হবে, gallery-তে দেখাবে
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpload} className="space-y-4">
                {/* Drop zone */}
                <div
                  className={`relative border-2 border-dashed rounded-xl transition-colors cursor-pointer ${
                    preview
                      ? "border-blue-400 dark:border-blue-500"
                      : "border-slate-300 dark:border-slate-700 hover:border-blue-400"
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
                      <ImageIcon className="w-10 h-10 text-slate-400 mb-3" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        ক্লিক করুন অথবা ছবি drag করুন
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
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
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g. Youth Leadership Summit"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  type="submit"
                  disabled={uploading || !selectedFile}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload করুন
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Gallery Grid */}
        <div className="xl:col-span-2">
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm h-full">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-violet-500" />
                Gallery Images
                <span className="ml-auto text-sm font-normal text-slate-500">
                  {images.length} টি ছবি
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : images.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
                  <ImageIcon className="w-12 h-12 mb-4 opacity-30" />
                  <p className="font-medium">এখনো কোনো ছবি নেই</p>
                  <p className="text-sm mt-1">বামের form দিয়ে প্রথম ছবিটি upload করুন</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {images.map((img) => (
                    <div
                      key={img._id}
                      className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <img
                        src={img.imageUrl}
                        alt={img.title}
                        className="w-full h-40 object-cover"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-200 flex items-center justify-center">
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
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                          {img.title}
                        </p>
                        <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300">
                          {img.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
