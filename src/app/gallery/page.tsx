/* eslint-disable */
"use client";

import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Loader2, ImageIcon } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface GalleryImage {
  _id: string;
  title: string;
  category: string;
  imageUrl: string;
}

export default function GalleryPage() {
  const [allPhotos, setAllPhotos] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    // Fetch Settings
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) setSettings(data.data);
      })
      .catch(() => {});

    const fetchGallery = async () => {
      try {
        const res = await fetch("/api/settings/gallery?all=true");
        const data = await res.json();
        if (data.success) {
          const photos: GalleryImage[] = data.data;
          setAllPhotos(photos);

          // Build unique categories
          const cats = Array.from(new Set(photos.map((p) => p.category)));
          setCategories(["All", ...cats]);
        }
      } catch (err) {
        console.error("Failed to fetch gallery", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const filteredPhotos =
    activeCategory === "All"
      ? allPhotos
      : allPhotos.filter((p) => p.category === activeCategory);

  return (
    <main style={{ background: "#060612" }}>
      <Navbar
        isRegistrationOpen={settings.isRegistrationOpen ?? true}
        navbarLogoUrl={settings.navbarLogoUrl}
        siteTitle={settings.siteTitle}
        siteSubtitle={settings.siteSubtitle}
      />
      <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
        {/* Header */}
        <div className="text-center mb-12">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-4 px-3 py-1 rounded-full border border-pink-500/30 text-pink-400"
            style={{ background: "rgba(244,114,182,0.1)" }}
          >
            {settings.galleryPageBadge || settings.gallerySectionTitle || "Official Gallery"}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {settings.galleryPageTitle || "Our Photos & Memories"}
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            {settings.galleryPageSubtitle || settings.gallerySectionSubtitle || "Moments from Talamij's various events, workshops, and community activities."}
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-10 h-10 animate-spin text-pink-400" />
          </div>
        ) : allPhotos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center text-slate-500">
            <ImageIcon className="w-14 h-14 mb-4 opacity-20" />
            <p className="text-lg font-medium">এখনো কোনো ছবি নেই</p>
            <p className="text-sm mt-1">Admin panel থেকে gallery-তে ছবি upload করুন</p>
          </div>
        ) : (
          <>
            {/* Category filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeCategory === cat
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                      : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/8"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Photo Grid */}
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredPhotos.map((photo) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={photo._id}
                  className="relative group rounded-3xl overflow-hidden border border-white/10 shadow-xl bg-slate-900/50"
                  style={{ height: "260px" }}
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <span className="text-[10px] uppercase font-bold text-pink-400 tracking-wider mb-1">
                      {photo.category}
                    </span>
                    <h3 className="text-white font-semibold text-lg">{photo.title}</h3>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
      <Footer />
    </main>
  );
}
