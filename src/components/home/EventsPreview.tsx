/* eslint-disable @typescript-eslint/typedef */
"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, MapPin, Tag } from "lucide-react";
import Link from "next/link";

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

const pastEvents = [
	{
		title: "Medha Jahai Competition 2024",
		date: "25 March 2024",
		type: "Educational",
		participants: "450+",
		color: "#7c3aed",
	},
	{
		title: "Annual Cultural Program 2024",
		date: "15 February 2024",
		type: "Cultural",
		participants: "800+",
		color: "#f59e0b",
	},
	{
		title: "Youth Leadership Workshop 2023",
		date: "10 December 2023",
		type: "Development",
		participants: "200+",
		color: "#10b981",
	},
];

export default function EventsPreview({
	title = "Our Activities",
	subtitle = "Join our upcoming educational, cultural, and Islamic events.",
	upcomingEvent,
}: EventsPreviewProps) {
	const hasUpcoming = upcomingEvent?.name || upcomingEvent?.date;

	const formattedDate =
		upcomingEvent?.date ?
			new Date(upcomingEvent.date).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
			})
		:	null;

	return (
		<section
			id="events"
			className="py-28 px-6 relative overflow-hidden"
			style={{ background: "#0d0d1a" }}>
			<div
				className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px opacity-20"
				style={{
					background:
						"linear-gradient(90deg, transparent, #0ea5e9, transparent)",
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
					<Link href="/events">
						<button className="group flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors shrink-0">
							View All Events
							<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
						</button>
					</Link>
				</motion.div>

				<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
					{/* Upcoming event — big card */}
					{hasUpcoming && (
						<motion.div
							initial={{ opacity: 0, y: 24 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.55 }}
							className="lg:col-span-3 relative rounded-3xl overflow-hidden border border-white/10 group"
							style={{ minHeight: "340px" }}>
							{/* BG */}
							{upcomingEvent.coverUrl ?
								<>
									<img
										src={upcomingEvent.coverUrl}
										alt="Event"
										className="absolute inset-0 w-full h-full object-cover"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-[#07070f] via-[#07070f]/60 to-transparent" />
								</>
							:	<div
									className="absolute inset-0"
									style={{
										background:
											"linear-gradient(135deg, #1e0b3a 0%, #0c1a3a 50%, #071a2e 100%)",
									}}
								/>
							}

							{/* Glow */}
							<div
								className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500"
								style={{
									background:
										"radial-gradient(circle at 30% 30%, rgba(124,58,237,0.3), transparent 60%)",
								}}
							/>

							<div
								className="relative z-10 p-8 flex flex-col justify-end h-full"
								style={{ minHeight: "340px" }}>
								<span
									className="inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-violet-300 border border-violet-500/40 mb-4"
									style={{ background: "rgba(124,58,237,0.2)" }}>
									<span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
									Upcoming Event
								</span>
								<h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
									{upcomingEvent.name || "Upcoming Event"}
								</h3>
								<div className="flex flex-wrap gap-3 mb-6">
									{formattedDate && (
										<span className="flex items-center gap-1.5 text-sm text-slate-300">
											<Calendar className="w-4 h-4 text-violet-400" />
											{formattedDate}
										</span>
									)}
									{upcomingEvent.startTime && (
										<span className="flex items-center gap-1.5 text-sm text-slate-300">
											<Clock className="w-4 h-4 text-cyan-400" />
											{upcomingEvent.startTime}
										</span>
									)}
									{upcomingEvent.address && (
										<span className="flex items-center gap-1.5 text-sm text-slate-300">
											<MapPin className="w-4 h-4 text-pink-400" />
											{upcomingEvent.address}
										</span>
									)}
								</div>
								{upcomingEvent.isOpen ?
									<Link href="/event-form">
										<button
											id="events-preview-register-btn"
											className="group/btn self-start flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all"
											style={{
												background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
												boxShadow: "0 0 30px rgba(124,58,237,0.4)",
											}}>
											Register Now
											<ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
										</button>
									</Link>
								:	<span className="self-start px-6 py-2.5 rounded-full text-sm text-slate-500 border border-white/10">
										Registration Closed
									</span>
								}
							</div>
						</motion.div>
					)}

					{/* Past events list */}
					<div
						className={`${hasUpcoming ? "lg:col-span-2" : "lg:col-span-5"} flex flex-col gap-4`}>
						<p className="text-xs text-slate-500 font-medium tracking-widest uppercase px-1">
							Recent Events
						</p>
						{pastEvents.map((e, i) => (
							<motion.div
								key={e.title}
								initial={{ opacity: 0, x: 20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: i * 0.1 }}
								whileHover={{ x: 4 }}
								className="group flex items-start gap-4 p-4 rounded-2xl border border-white/8 cursor-pointer transition-all"
								style={{ background: "rgba(255,255,255,0.025)" }}>
								<div
									className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-sm"
									style={{
										background: `${e.color}25`,
										border: `1px solid ${e.color}35`,
									}}>
									{i + 1}
								</div>
								<div className="flex-1 min-w-0">
									<h4 className="text-white text-sm font-semibold mb-1 leading-snug group-hover:text-violet-300 transition-colors">
										{e.title}
									</h4>
									<div className="flex items-center gap-3 flex-wrap">
										<span className="text-xs text-slate-500">{e.date}</span>
										<span
											className="text-xs px-2 py-0.5 rounded-full font-medium"
											style={{ color: e.color, background: `${e.color}18` }}>
											<Tag className="w-2.5 h-2.5 inline mr-1" />
											{e.type}
										</span>
										<span className="text-xs text-slate-500">
											{e.participants} participants
										</span>
									</div>
								</div>
							</motion.div>
						))}
						<Link href="/events">
							<button className="w-full mt-2 py-3 rounded-2xl text-sm text-slate-400 border border-white/8 hover:border-white/20 hover:text-white transition-all">
								View More Events →
							</button>
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
