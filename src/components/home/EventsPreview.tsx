/* eslint-disable @typescript-eslint/typedef */
"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

interface EventsPreviewProps {
	title?: string;
	subtitle?: string;
	upcomingEvent?: {
		name?: string;
		date?: string;
		address?: string;
		startTime?: string;
		isOpen?: boolean;
		coverUrl?: string | null;
	};
}

interface EventItem {
	_id: string;
	title: string;
	date?: string;
	address?: string;
	startTime?: string;
	coverUrl?: string | null;
	isRegistrationOpen?: boolean;
	slug?: string;
	description?: string;
	registrationCount?: number;
}

const EVENT_ACCENT_COLORS = [
	{ glow: "#7c3aed", bg: "rgba(124,58,237,0.15)", border: "rgba(124,58,237,0.3)" },
	{ glow: "#0ea5e9", bg: "rgba(14,165,233,0.15)", border: "rgba(14,165,233,0.3)" },
	{ glow: "#10b981", bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.3)" },
	{ glow: "#f59e0b", bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.3)" },
	{ glow: "#ec4899", bg: "rgba(236,72,153,0.15)", border: "rgba(236,72,153,0.3)" },
];

function formatDate(dateStr?: string) {
	if (!dateStr) return null;
	try {
		return new Date(dateStr).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	} catch {
		return dateStr;
	}
}

export default function EventsPreview({
	title = "Our Activities",
	subtitle = "Join our upcoming educational, cultural, and Islamic events.",
}: EventsPreviewProps) {
	const [events, setEvents] = useState<EventItem[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		axios
			.get("/api/events")
			.then((res) => {
				if (res.data.success && res.data.data) {
					// Sort by date descending (latest first), already sorted by server but ensure
					const sorted = [...res.data.data].sort((a: EventItem, b: EventItem) => {
						if (!a.date) return 1;
						if (!b.date) return -1;
						return new Date(b.date).getTime() - new Date(a.date).getTime();
					});
					setEvents(sorted);
				}
			})
			.catch(() => {})
			.finally(() => setLoading(false));
	}, []);

	return (
		<section
			id="events"
			className="py-28 px-6 relative overflow-hidden"
			style={{ background: "#0d0d1a" }}>
			{/* Top line */}
			<div
				className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px opacity-20"
				style={{
					background: "linear-gradient(90deg, transparent, #0ea5e9, transparent)",
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
							className="inline-block text-xs font-semibold tracking-widest uppercase mb-4 px-3 py-1 rounded-full border border-cyan-500/30 text-cyan-400"
							style={{ background: "rgba(14,165,233,0.1)" }}>
							Events
						</span>
						<h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
							{title}
						</h2>
						{subtitle && (
							<p className="text-slate-400 text-sm mt-2">{subtitle}</p>
						)}
					</div>
					<a
						href="https://talamij.rihadjahanopu.com/events"
						target="_blank"
						rel="noopener noreferrer">
						<button className="group flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors shrink-0">
							View All Events
							<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
						</button>
					</a>
				</motion.div>

				{/* Events Grid */}
				{loading ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="rounded-2xl border border-white/8 animate-pulse"
								style={{ background: "rgba(255,255,255,0.03)", height: "260px" }}
							/>
						))}
					</div>
				) : events.length === 0 ? (
					<div className="text-center py-16 text-slate-500 text-sm">
						No events available at the moment.
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
						{events.map((event, i) => {
							const accent = EVENT_ACCENT_COLORS[i % EVENT_ACCENT_COLORS.length];
							const isLatest = i === 0;
							const formattedDate = formatDate(event.date);

							return (
								<motion.div
									key={event._id}
									initial={{ opacity: 0, y: 24 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.45, delay: i * 0.08 }}
									whileHover={{ y: -4 }}
									className="group relative rounded-2xl overflow-hidden border transition-all duration-300"
									style={{
										background: "rgba(255,255,255,0.03)",
										borderColor: isLatest ? accent.border : "rgba(255,255,255,0.08)",
										boxShadow: isLatest ? `0 0 30px ${accent.glow}18` : "none",
									}}>
									{/* Cover image or gradient */}
									{event.coverUrl ? (
										<>
											<img
												src={event.coverUrl}
												alt={event.title}
												className="w-full h-44 object-cover"
											/>
											<div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-transparent to-[#0d0d1a]/80" />
										</>
									) : (
										<div
											className="w-full h-44 flex items-center justify-center"
											style={{
												background: `linear-gradient(135deg, ${accent.bg}, rgba(13,13,26,0.8))`,
											}}>
											<Calendar
												className="w-10 h-10 opacity-30"
												style={{ color: accent.glow }}
											/>
										</div>
									)}

									{/* Badges */}
									<div className="absolute top-3 left-3 flex gap-2">
										{isLatest && (
											<span
												className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white"
												style={{ background: accent.glow }}>
												<span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
												Latest
											</span>
										)}
										{event.isRegistrationOpen && (
											<span
												className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
												style={{ background: "rgba(16,185,129,0.2)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)" }}>
												Open
											</span>
										)}
									</div>

									{/* Content */}
									<div className="p-5">
										<h3 className="text-white font-bold text-base leading-snug mb-3 group-hover:text-violet-300 transition-colors line-clamp-2">
											{event.title}
										</h3>

										<div className="space-y-1.5 mb-4">
											{formattedDate && (
												<div className="flex items-center gap-2 text-xs text-slate-400">
													<Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: accent.glow }} />
													{formattedDate}
												</div>
											)}
											{event.startTime && (
												<div className="flex items-center gap-2 text-xs text-slate-400">
													<Clock className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
													{event.startTime}
												</div>
											)}
											{event.address && (
												<div className="flex items-center gap-2 text-xs text-slate-400">
													<MapPin className="w-3.5 h-3.5 shrink-0 text-pink-400" />
													<span className="truncate">{event.address}</span>
												</div>
											)}
											{event.registrationCount !== undefined && (
												<div className="flex items-center gap-2 text-xs text-slate-400">
													<Users className="w-3.5 h-3.5 shrink-0 text-amber-400" />
													{event.registrationCount} registered
												</div>
											)}
										</div>

										{event.isRegistrationOpen ? (
											<Link href={`/event-form${event.slug ? `?event=${event.slug}` : ""}`}>
												<button
													className="w-full py-2 rounded-xl text-xs font-semibold text-white transition-all"
													style={{ background: `linear-gradient(135deg, ${accent.glow}, ${accent.glow}cc)` }}>
													Register Now →
												</button>
											</Link>
										) : (
											<div className="w-full py-2 rounded-xl text-xs text-slate-500 text-center border border-white/8">
												Registration Closed
											</div>
										)}
									</div>
								</motion.div>
							);
						})}
					</div>
				)}

				{/* Bottom View All button */}
				{events.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 12 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="mt-10 text-center">
						<a
							href="https://talamij.rihadjahanopu.com/events"
							target="_blank"
							rel="noopener noreferrer">
							<button className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl text-sm font-semibold text-slate-300 border border-white/10 hover:border-white/25 hover:text-white hover:bg-white/5 transition-all">
								View All Events
								<ArrowRight className="w-4 h-4" />
							</button>
						</a>
					</motion.div>
				)}
			</div>
		</section>
	);
}
