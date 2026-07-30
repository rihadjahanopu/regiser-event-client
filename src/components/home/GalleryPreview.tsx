"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ImageIcon } from "lucide-react";

interface GalleryPhoto {
  _id: string;
  title: string;
  category: string;
  imageUrl: string;
}

interface GalleryPreviewProps {
  title?: string;
  subtitle?: string;
  photos?: GalleryPhoto[];
}

export default function GalleryPreview({
  title = "Photo Gallery",
  subtitle = "Highlights of our past events, seminars, and activities.",
  photos = [],
}: GalleryPreviewProps) {
  return (
    <section id="gallery" className="py-28 px-6 relative overflow-hidden" style={{ background: "#07070f" }}>
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px opacity-20"
        style={{ background: "linear-gradient(90deg, transparent, #f472b6, transparent)" }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <span
              className="inline-block text-xs font-semibold tracking-widest uppercase mb-4 px-3 py-1 rounded-full border border-pink-500/30 text-pink-400"
              style={{ background: "rgba(244,114,182,0.1)" }}
            >
              Gallery
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-slate-400 text-sm mt-2">{subtitle}</p>
            )}
          </div>
          <Link href="/gallery">
            <button className="group flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors shrink-0">
              View All Photos
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </motion.div>

        {/* Grid or Empty State */}
        {photos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center py-24 rounded-3xl border border-white/8"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: "rgba(244,114,182,0.1)", border: "1px solid rgba(244,114,182,0.2)" }}
            >
              <ImageIcon className="w-7 h-7 text-pink-400" />
            </div>
            <p className="text-white font-semibold text-lg mb-1">কোনো ছবি এখনো আপলোড হয়নি</p>
            <p className="text-slate-500 text-sm text-center max-w-xs">
              Admin প্যানেল থেকে Gallery-তে ছবি যোগ করুন, এখানে automatically দেখাবে।
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-[180px]">
            {photos.map((photo, i) => (
              <motion.div
                key={photo._id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                whileHover={{ scale: 1.02 }}
                className={`relative rounded-2xl overflow-hidden group cursor-pointer border border-white/8 ${
                  i === 0 ? "col-span-2 row-span-2" : ""
                }`}
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white text-sm font-medium">{photo.title}</p>
                  {photo.category && (
                    <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/20">
                      {photo.category}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {photos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <Link href="/gallery">
              <button
                className="px-8 py-3 rounded-2xl text-sm font-semibold text-white border border-white/15 hover:bg-white/8 transition-all"
                style={{ backdropFilter: "blur(12px)" }}
              >
                View Full Gallery →
              </button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
