"use client";

import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, Tag, ArrowRight, Search, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  shortDescription: string;
  coverImage?: string;
  estimatedReadingTime: number;
  views: number;
  likes: string[];
  author?: { name: string; image?: string };
  createdAt: string;
}

const categoryColors: Record<string, { color: string; bg: string; accent: string }> = {
  "Event Recap": { color: "text-violet-400", bg: "from-violet-600/20 to-indigo-600/10", accent: "#7c3aed" },
  "Insights": { color: "text-cyan-400", bg: "from-cyan-600/20 to-blue-600/10", accent: "#0ea5e9" },
  "Stories": { color: "text-emerald-400", bg: "from-emerald-600/20 to-teal-600/10", accent: "#10b981" },
  "Education": { color: "text-amber-400", bg: "from-amber-600/20 to-orange-600/10", accent: "#f59e0b" },
  "Islamic": { color: "text-green-400", bg: "from-green-600/20 to-emerald-600/10", accent: "#22c55e" },
  "Youth Leadership": { color: "text-pink-400", bg: "from-pink-600/20 to-rose-600/10", accent: "#ec4899" },
};

const getColor = (cat: string) =>
  categoryColors[cat] || { color: "text-slate-400", bg: "from-slate-600/20 to-slate-600/10", accent: "#64748b" };

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>([]);
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    axios
      .get("/api/settings")
      .then((res) => {
        if (res.data.success && res.data.data) setSettings(res.data.data);
      })
      .catch(() => {});

    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("/api/blog/published");
      if (res.data.success) {
        const data: Blog[] = res.data.data;
        setBlogs(data);
        // Extract unique categories from blogs
        const cats = Array.from(new Set(data.map(b => b.category)));
        setCategories(["All", ...cats]);
      }
    } catch (err) {
      console.error("Failed to load blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(b => {
    const matchCat = selectedCategory === "All" || b.category === selectedCategory;
    const matchSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.shortDescription.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

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
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-4 px-3 py-1 rounded-full border border-emerald-500/30 text-emerald-400"
            style={{ background: "rgba(16,185,129,0.1)" }}
          >
            {settings.blogPageBadge || settings.blogSectionTitle || "Official Blog"}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {settings.blogPageTitle || "Our Blog & News Collection"}
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            {settings.blogPageSubtitle || settings.blogSectionSubtitle || "Articles on Talamij activities, event recaps, youth empowerment, and education."}
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                  selectedCategory === cat
                    ? "bg-violet-600 text-white border-violet-500 shadow-lg shadow-violet-500/20"
                    : "text-slate-400 border-white/10 hover:bg-white/5 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredBlogs.map((article, i) => {
              const colors = getColor(article.category);
              return (
                <motion.article
                  key={article._id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  whileHover={{ y: -4 }}
                  className="flex flex-col rounded-3xl border border-white/8 overflow-hidden bg-slate-900/30 relative group"
                >
                  {article.coverImage && (
                    <div className="w-full h-48 overflow-hidden">
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  <div className="p-7 flex flex-col flex-1">
                    <div
                      className="h-0.5 w-16 mb-5 rounded-full"
                      style={{ background: colors.accent }}
                    />

                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="text-xs px-3 py-1 rounded-full font-medium"
                        style={{ color: colors.accent, background: `${colors.accent}18` }}
                      >
                        <Tag className="w-3 h-3 inline mr-1" />
                        {article.category}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {article.estimatedReadingTime} min read
                      </span>
                    </div>

                    <h2 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-violet-300 transition-colors leading-tight line-clamp-2">
                      {article.title}
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                      {article.shortDescription}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-white/6 mt-auto">
                      <div className="flex items-center gap-2">
                        {article.author?.image ? (
                          <img src={article.author.image} alt={article.author.name} className="w-7 h-7 rounded-full object-cover border border-white/10" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-violet-600/30 flex items-center justify-center text-xs font-bold text-violet-300">
                            {article.author?.name?.charAt(0) || "?"}
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-medium text-white">{article.author?.name || "Author"}</p>
                          <p className="text-[10px] text-slate-500">
                            {new Date(article.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                      <Link href={`/blog/${article.slug}`}>
                        <span className="text-xs font-semibold text-violet-400 group-hover:text-violet-300 flex items-center gap-1">
                          Read Article <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-slate-400 text-lg">No articles found matching your search.</p>
            <button
              onClick={() => { setSearch(""); setSelectedCategory("All"); }}
              className="mt-4 text-xs text-violet-400 hover:text-violet-300 underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
