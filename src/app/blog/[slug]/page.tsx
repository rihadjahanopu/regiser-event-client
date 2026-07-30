"use client";

import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  Share2,
  Heart,
  MessageCircle,
  Eye,
  Send,
  Loader2,
  Bookmark,
} from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import axios from "axios";
import { authClient } from "@/lib/auth-client";

interface Comment {
  id: string;
  author: { name: string; image?: string };
  content: string;
  createdAt: string;
}

interface Blog {
  _id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  shortDescription: string;
  content: string;
  coverImage?: string;
  estimatedReadingTime: number;
  views: number;
  likes: string[];
  comments: Comment[];
  author?: { _id: string; name: string; image?: string };
  createdAt: string;
}

export default function SingleBlogPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (!slug) return;
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/api/blog/detail/${slug}`);
        if (res.data.success) {
          const data: Blog = res.data.data;
          setBlog(data);
          setLikeCount(data.likes?.length || 0);
          if (session?.user?.id) {
            setLiked(data.likes?.includes(session.user.id));
          }
        } else {
          setNotFound(true);
        }
      } catch (err: any) {
        if (err.response?.status === 404) setNotFound(true);
        else toast.error("Failed to load blog post");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug, session?.user?.id]);

  const handleLike = async () => {
    if (!session?.user) {
      toast.error("Please sign in to like posts");
      return;
    }
    try {
      const res = await axios.post(`/api/blog/${blog!._id}/like`);
      if (res.data.success) {
        const wasLiked = liked;
        setLiked(!wasLiked);
        setLikeCount(prev => wasLiked ? prev - 1 : prev + 1);
      }
    } catch (err) {
      toast.error("Failed to update like");
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error("Please sign in to comment");
      return;
    }
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    try {
      const res = await axios.post(`/api/blog/${blog!._id}/comment`, {
        content: commentText.trim(),
      });
      if (res.data.success) {
        toast.success("Comment posted!");
        setCommentText("");
        // Map server comment shape to local Comment interface
        const serverComment = res.data.data;
        const newComment: Comment = {
          id: String(Date.now()),
          author: { name: serverComment.userName, image: serverComment.userImage },
          content: serverComment.content,
          createdAt: serverComment.createdAt,
        };
        setBlog(prev =>
          prev ? { ...prev, comments: [newComment, ...prev.comments] } : prev
        );
      }
    } catch (err) {
      toast.error("Failed to post comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  if (loading) {
    return (
      <main style={{ background: "#060612" }}>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </main>
    );
  }

  if (notFound || !blog) {
    return (
      <main style={{ background: "#060612" }}>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-4xl font-bold text-white mb-3">Blog Not Found</h1>
          <p className="text-slate-400 text-sm mb-6">The article you&apos;re looking for doesn&apos;t exist or may have been removed.</p>
          <Link href="/blog">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </button>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main style={{ background: "#060612" }}>
      <Navbar />
      <div className="pt-28 pb-24 px-6 max-w-4xl mx-auto min-h-screen">
        <Link href="/blog">
          <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </button>
        </Link>

        {/* Cover Image */}
        {blog.coverImage && (
          <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-10 border border-white/8">
            <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Article Header */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="text-xs px-3 py-1 rounded-full font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
              <Tag className="w-3 h-3 inline mr-1" />
              {blog.category}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {blog.estimatedReadingTime} min read
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {blog.views} views
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-5">
            {blog.title}
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-6">{blog.shortDescription}</p>

          {/* Author */}
          {blog.author && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-white/8 bg-white/3">
              {blog.author.image ? (
                <img src={blog.author.image} alt={blog.author.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-violet-700/40 flex items-center justify-center text-sm font-bold text-violet-300">
                  {blog.author.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-white">{blog.author.name}</p>
                <p className="text-xs text-slate-500">Author</p>
              </div>
            </div>
          )}

          <div className="h-px bg-white/10 w-full mt-8" />
        </div>

        {/* Tags */}
        {blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {blog.tags.map(tag => (
              <span key={tag} className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-slate-300 hover:bg-white/10 transition-all cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Article Content */}
        <div
          className="prose prose-invert prose-lg max-w-none mb-12 text-slate-300 leading-relaxed
            prose-headings:text-white prose-strong:text-white prose-a:text-violet-400 prose-a:hover:text-violet-300
            prose-blockquote:border-violet-500 prose-blockquote:text-slate-400 prose-code:text-violet-300
            prose-pre:bg-slate-900 prose-pre:border prose-pre:border-white/10"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Like & Share */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10 mb-12">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                liked
                  ? "bg-rose-600/20 text-rose-400 border border-rose-500/30"
                  : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/8"
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? "fill-rose-400" : ""}`} />
              {likeCount} Likes
            </button>
            <span className="flex items-center gap-1.5 text-sm text-slate-500">
              <MessageCircle className="w-4 h-4" />
              {blog.comments.length} Comments
            </span>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/8"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>

        {/* Comments Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">
            Comments ({blog.comments.length})
          </h2>

          {/* Add Comment */}
          <form onSubmit={handleComment} className="space-y-3">
            <textarea
              rows={3}
              placeholder={session?.user ? "Write a comment..." : "Sign in to leave a comment..."}
              disabled={!session?.user}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm px-4 py-3 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {session?.user && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingComment || !commentText.trim()}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingComment ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Post Comment
                </button>
              </div>
            )}
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {blog.comments.length > 0 ? (
              blog.comments.map(comment => (
                <div key={comment.id} className="p-4 rounded-xl border border-white/8 bg-white/3 flex gap-3">
                  <div className="shrink-0">
                    {comment.author?.image ? (
                      <img src={comment.author.image} alt={comment.author.name} className="w-8 h-8 rounded-full object-cover border border-white/10" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-violet-700/30 flex items-center justify-center text-xs font-bold text-violet-300">
                        {comment.author?.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-white">{comment.author?.name || "User"}</span>
                      <span className="text-[11px] text-slate-500">
                        {new Date(comment.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-8">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
