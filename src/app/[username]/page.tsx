"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { motion } from "framer-motion";
import {
  User,
  MapPin,
  Globe,
  Calendar,
  Share2,
  BookOpen,
  Clock,
  Lock,
  ShieldAlert,
  Sparkles,
  Check,
  ExternalLink,
  FileText,
  Phone,
  ArrowLeft,
  Eye,
  MessageCircle,
  Heart
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { Card, CardContent } from "@/components/ui/card";

interface PublicUser {
  id: string;
  name: string;
  username: string;
  image: string | null;
  role: string;
  createdAt: string;
  isPrivate: boolean;
  bio?: string;
  website?: string;
  location?: string;
  phoneNumber?: string;
}

interface UserBlog {
  _id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  coverImage?: string;
  estimatedReadingTime: number;
  createdAt: string;
  views?: number;
  likes?: string[];
  comments?: any[];
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params?.username as string;

  const [user, setUser] = useState<PublicUser | null>(null);
  const [blogs, setBlogs] = useState<UserBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!username) return;
    const fetchPublicProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/user/public/${encodeURIComponent(username)}`);
        if (res.data.success) {
          setUser(res.data.user);
          setBlogs(res.data.blogs || []);
        } else {
          setNotFound(true);
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          toast.error("Failed to load user profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [username]);

  const handleShareProfile = () => {
    if (typeof window === "undefined") return;
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    toast.success("Profile link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070f] text-white flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm mt-4 font-medium">Loading user profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !user) {
    return (
      <div className="min-h-screen bg-[#07070f] text-white flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-24 text-center">
          <div className="w-20 h-20 rounded-3xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-6">
            <ShieldAlert className="w-10 h-10 text-violet-400" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">User Not Found</h1>
          <p className="text-slate-400 max-w-md mb-8 text-sm leading-relaxed">
            The profile for <span className="text-violet-400 font-mono">@{username}</span> does not exist or may have been updated.
          </p>
          <Link href="/">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 font-semibold text-sm transition-all shadow-lg shadow-violet-600/20">
              <ArrowLeft className="w-4 h-4" /> Return to Home
            </button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const formattedJoinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-[#07070f] text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        {/* Profile Hero Header Card */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-white/[0.05] to-[#0c0c16] shadow-2xl mb-8">
          {/* Ambient Glow Background Accent */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-600/20 blur-[120px] pointer-events-none rounded-full" />

          {/* Banner Top Gradient */}
          <div className="h-36 sm:h-48 w-full bg-gradient-to-r from-violet-900/40 via-indigo-900/30 to-purple-900/40 border-b border-white/5 relative">
            <div className="absolute right-4 top-4">
              <button
                onClick={handleShareProfile}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-xs font-semibold backdrop-blur-md transition-all text-white"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Share Profile"}
              </button>
            </div>
          </div>

          {/* Profile Info Section */}
          <div className="px-6 sm:px-8 pb-8 pt-0 relative flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 -mt-16 sm:-mt-20">
            {/* Avatar & Key Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              {/* Profile Image */}
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-[#0c0c16] bg-slate-900 shadow-2xl shrink-0 relative group">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-4xl font-bold text-white">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>

              {/* Name, Username, Role */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {user.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-violet-500/10 text-violet-400 border border-violet-500/20">
                    {user.role || "Member"}
                  </span>
                </div>

                <p className="text-sm font-mono text-violet-400/90 font-medium">
                  @{user.username}
                </p>
              </div>
            </div>

            {/* Additional Meta (Join Date, Location, Website) */}
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 text-xs text-slate-400 font-medium">
              {formattedJoinDate && (
                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Joined {formattedJoinDate}</span>
                </div>
              )}
              {user.location && (
                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{user.location}</span>
                </div>
              )}
              {user.website && (
                <a
                  href={user.website.startsWith("http") ? user.website : `https://${user.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/5 text-indigo-400 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{user.website.replace(/^https?:\/\//, "")}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* User Bio Card Content */}
          {user.bio && !user.isPrivate && (
            <div className="px-6 sm:px-8 pb-8 border-t border-white/5 pt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" /> About
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-3xl whitespace-pre-line">
                {user.bio}
              </p>
            </div>
          )}
        </div>

        {/* Private Profile Notice */}
        {user.isPrivate ? (
          <Card className="bg-[#0c0c16] border-white/10 text-white text-center py-16 px-6 rounded-3xl">
            <CardContent className="max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold">This Profile is Private</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The user @{user.username} has chosen to keep their profile details and articles private.
              </p>
            </CardContent>
          </Card>
        ) : (
          /* User's Published Articles / Content Section */
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-violet-400" />
                <h2 className="text-xl font-bold tracking-tight text-white">
                  Published Articles
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white/10 text-slate-300">
                  {blogs.length}
                </span>
              </div>
            </div>

            {blogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                  <motion.div
                    key={blog._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="group"
                  >
                    <Link href={`/blog/${blog.slug}`}>
                      <Card className="bg-[#0c0c16] border-white/10 hover:border-violet-500/50 transition-all duration-300 overflow-hidden h-full flex flex-col group-hover:shadow-xl group-hover:shadow-violet-600/10">
                        {blog.coverImage && (
                          <div className="h-44 w-full overflow-hidden relative">
                            <img
                              src={blog.coverImage}
                              alt={blog.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-semibold text-violet-300 border border-white/10">
                              {blog.category}
                            </span>
                          </div>
                        )}

                        <CardContent className="p-5 flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            {!blog.coverImage && (
                              <span className="inline-block bg-violet-500/10 text-violet-400 px-2.5 py-0.5 rounded-lg text-[10px] font-semibold border border-violet-500/20 mb-1">
                                {blog.category}
                              </span>
                            )}
                            <h3 className="font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-2 text-base leading-snug">
                              {blog.title}
                            </h3>
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                              {blog.shortDescription}
                            </p>
                          </div>

                          <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {blog.estimatedReadingTime || 3} min read
                              </span>
                              {blog.views !== undefined && (
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3 text-slate-400" />
                                  {blog.views}
                                </span>
                              )}
                            </div>
                            <span>
                              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-white/10 rounded-3xl bg-white/[0.01] p-8">
                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h4 className="text-base font-semibold text-slate-300 mb-1">
                  No published articles yet
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  @{user.username} hasn't published any articles on the platform yet.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
