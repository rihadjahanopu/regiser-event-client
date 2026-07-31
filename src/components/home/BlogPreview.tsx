/* eslint-disable @typescript-eslint/typedef */
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Tag, BookOpen } from "lucide-react";
import axios from "axios";

const API_URL: string =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const ACCENT_COLORS: { accent: string; bg: string }[] = [
	{ accent: "#7c3aed", bg: "#7c3aed18" },
	{ accent: "#0ea5e9", bg: "#0ea5e918" },
	{ accent: "#10b981", bg: "#10b98118" },
	{ accent: "#f59e0b", bg: "#f59e0b18" },
	{ accent: "#ec4899", bg: "#ec489918" },
	{ accent: "#ef4444", bg: "#ef444418" },
];

interface BlogPost {
	_id: string;
	title: string;
	slug: string;
	excerpt?: string;
	content?: string;
	category?: { name: string } | string;
	tags?: string[];
	createdAt: string;
	readTime?: string;
	coverImage?: string;
}

interface BlogPreviewProps {
	title?: string;
	subtitle?: string;
}

function formatDate(dateStr: string) {
	return new Date(dateStr).toLocaleDateString("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

function getExcerpt(post: BlogPost): string {
	if (post.excerpt) return post.excerpt;
	if (post.content) {
		const plain: string = post.content.replace(/<[^>]+>/g, "").trim();
		return plain.length > 140 ? plain.slice(0, 140) + "…" : plain;
	}
	return "";
}

function getCategoryName(cat: BlogPost["category"]): string {
	if (!cat) return "General";
	if (typeof cat === "string") return cat;
	return cat.name || "General";
}

export default function BlogPreview({
	title = "Latest News & Blogs",
	subtitle = "Stay updated with our latest news, articles, and announcements.",
}: BlogPreviewProps) {
	const [posts, setPosts] = useState<BlogPost[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		axios
			.get("/api/blog/published?limit=3&page=1")
			.then((res) => {
				if (res.data.success && res.data.data) {
					setPosts(res.data.data.slice(0, 3));
				}
			})
			.catch(() => {
				/* silent */
			})
			.finally(() => setLoading(false));
	}, []);

	return (
		<section
			id="blog"
			className="py-28 px-6 relative overflow-hidden"
			style={{ background: "#0a0a14" }}>
			<div
				className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-px opacity-20"
				style={{
					background:
						"linear-gradient(90deg, transparent, #10b981, transparent)",
				}}
			/>

			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
					<div>
						<span
							className="inline-block text-xs font-semibold tracking-widest uppercase mb-4 px-3 py-1 rounded-full border border-emerald-500/30 text-emerald-400"
							style={{ background: "rgba(16,185,129,0.1)" }}>
							Blog & News
						</span>
						<h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
							{title}
						</h2>
						{subtitle && (
							<p className="text-slate-400 text-sm mt-2">{subtitle}</p>
						)}
					</div>
					<Link href="/blog">
						<button className="group flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors shrink-0">
							View All Posts
							<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
						</button>
					</Link>
				</motion.div>

				{/* Loading skeleton */}
				{loading && (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{[0, 1, 2].map((i) => (
							<div
								key={i}
								className="rounded-2xl border border-white/8 overflow-hidden animate-pulse"
								style={{ background: "rgba(255,255,255,0.025)" }}>
								<div className="h-1 w-full bg-white/10" />
								<div className="p-6 space-y-3">
									<div className="h-3 w-24 rounded bg-white/10" />
									<div className="h-4 w-full rounded bg-white/10" />
									<div className="h-4 w-3/4 rounded bg-white/10" />
									<div className="h-3 w-full rounded bg-white/8 mt-4" />
									<div className="h-3 w-full rounded bg-white/8" />
									<div className="h-3 w-1/2 rounded bg-white/8" />
								</div>
							</div>
						))}
					</div>
				)}

				{/* Empty state */}
				{!loading && posts.length === 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="flex flex-col items-center justify-center py-24 rounded-3xl border border-white/8"
						style={{ background: "rgba(255,255,255,0.02)" }}>
						<div
							className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
							style={{
								background: "rgba(16,185,129,0.1)",
								border: "1px solid rgba(16,185,129,0.2)",
							}}>
							<BookOpen className="w-7 h-7 text-emerald-400" />
						</div>
						<p className="text-white font-semibold text-lg mb-1">
							এখনো কোনো ব্লগ প্রকাশিত হয়নি
						</p>
						<p className="text-slate-500 text-sm text-center max-w-xs">
							Admin প্যানেল থেকে ব্লগ approve করলে এখানে দেখাবে।
						</p>
					</motion.div>
				)}

				{/* Blog Cards */}
				{!loading && posts.length > 0 && (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{posts.map((post, i) => {
							const { accent, bg } = ACCENT_COLORS[i % ACCENT_COLORS.length];
							const categoryName: string = getCategoryName(post.category);
							const excerpt: string = getExcerpt(post);
							return (
								<motion.article
									key={post._id}
									initial={{ opacity: 0, y: 28 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5, delay: i * 0.1 }}
									whileHover={{ y: -6 }}
									className="group flex flex-col rounded-2xl border border-white/8 overflow-hidden cursor-pointer"
									style={{ background: "rgba(255,255,255,0.025)" }}>
									{/* Cover image or gradient bar */}
									{post.coverImage ?
										<Image
											src={post.coverImage}
											alt={post.title}
											width={600}
											height={144}
											className="w-full h-36 object-cover"
										/>
									:	<div
											className="h-1 w-full"
											style={{
												background: `linear-gradient(90deg, ${accent}, transparent)`,
											}}
										/>
									}

									<div className="p-6 flex flex-col flex-1">
										{/* Category + read time */}
										<div className="flex items-center gap-3 mb-4 flex-wrap">
											<span
												className="text-xs px-2.5 py-1 rounded-full font-medium"
												style={{ color: accent, background: bg }}>
												<Tag className="w-2.5 h-2.5 inline mr-1" />
												{categoryName}
											</span>
											<span className="text-xs text-slate-600 flex items-center gap-1">
												<Clock className="w-3 h-3" />
												{post.readTime || "3 min read"}
											</span>
										</div>

										<h3 className="text-white font-semibold text-base leading-snug mb-3 group-hover:text-violet-200 transition-colors line-clamp-2 flex-1">
											{post.title}
										</h3>
										{excerpt && (
											<p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-5">
												{excerpt}
											</p>
										)}

										<div className="flex items-center justify-between mt-auto pt-4 border-t border-white/6">
											<span className="text-xs text-slate-600">
												{formatDate(post.createdAt)}
											</span>
											<Link href={`/blog/${post.slug}`}>
												<span className="text-xs font-medium flex items-center gap-1 group-hover:text-white text-slate-400 transition-colors">
													Read <ArrowRight className="w-3 h-3" />
												</span>
											</Link>
										</div>
									</div>
								</motion.article>
							);
						})}
					</div>
				)}

				{!loading && posts.length > 0 && (
					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						className="text-center mt-10">
						<Link href="/blog">
							<button
								className="px-8 py-3 rounded-2xl text-sm font-semibold text-white border border-white/15 hover:bg-white/8 transition-all"
								style={{ backdropFilter: "blur(12px)" }}>
								View All Blogs →
							</button>
						</Link>
					</motion.div>
				)}
			</div>
		</section>
	);
}
