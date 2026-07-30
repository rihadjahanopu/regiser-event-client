/* eslint-disable */
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { motion } from "framer-motion";
import {
	Target,
	Eye,
	Heart,
	Lightbulb,
	Award,
	Users,
	BookOpen,
	Globe,
	Shield,
	Star,
} from "lucide-react";
import Link from "next/link";

const milestones = [
	{
		year: "2018",
		title: "Foundation",
		description:
			"Talamij Organization officially began its journey in Chhatok North, Sunamganj. The founders envisioned a structured platform for youth talent development.",
		color: "#7c3aed",
	},
	{
		year: "2019",
		title: "First Medha Jahai",
		description:
			"The first 'Medha Jahai Competition' was held with over 150 student participants, becoming Talamij's flagship annual event.",
		color: "#0ea5e9",
	},
	{
		year: "2021",
		title: "District Expansion",
		description:
			"Talamij activities expanded across 6 sub-districts of Sunamganj. Membership crossed 1,000 with a dedicated volunteer team.",
		color: "#f59e0b",
	},
	{
		year: "2023",
		title: "Inter-District Activities",
		description:
			"Outreach extended to multiple districts in the Sylhet division. Over 500 young leaders joined the Youth Leadership Summit. Membership exceeded 5,000.",
		color: "#10b981",
	},
	{
		year: "2024",
		title: "Digital Transformation",
		description:
			"Launched online registration, digital certificates, and organization web portal to reach and empower more youth through digital tools.",
		color: "#ec4899",
	},
];

const values = [
	{
		icon: Shield,
		title: "Integrity & Transparency",
		description:
			"Maintaining honesty, accountability, and transparency in every activity of our organization.",
		color: "#7c3aed",
	},
	{
		icon: Heart,
		title: "Humanity & Service",
		description:
			"Dedicated to human welfare to build a compassionate and responsible society.",
		color: "#ec4899",
	},
	{
		icon: Users,
		title: "Unity & Collaboration",
		description:
			"Fostering strong community ties by respecting diverse perspectives and working together.",
		color: "#0ea5e9",
	},
	{
		icon: Lightbulb,
		title: "Innovation & Creativity",
		description:
			"Pioneering new paths in education and development through technology and creative thinking.",
		color: "#f59e0b",
	},
	{
		icon: BookOpen,
		title: "Knowledge & Education",
		description:
			"Commitment to lifelong learning and creating knowledge opportunities beyond traditional curricula.",
		color: "#10b981",
	},
	{
		icon: Globe,
		title: "Patriotism & Responsibility",
		description:
			"Pledging to build a prosperous nation through civic duty and social responsibility.",
		color: "#8b5cf6",
	},
];

interface Settings {
	presidentName?: string;
	presidentTitle?: string;
	secretaryName?: string;
	secretaryTitle?: string;
	presidentSignatureUrl?: string;
	secretarySignatureUrl?: string;
	isRegistrationOpen?: boolean;
	navbarLogoUrl?: string;
	siteTitle?: string;
	siteSubtitle?: string;

	aboutHeroBadge?: string;
	aboutBadge?: string;
	aboutHeroTitle?: string;
	aboutTitle?: string;
	aboutHeroSubtitle?: string;
	aboutParagraph1?: string;
	aboutParagraph2?: string;
	aboutMissionTitle?: string;
	aboutMissionDetail?: string;
	aboutMissionText?: string;
	aboutVisionTitle?: string;
	aboutVisionDetail?: string;
	aboutVisionText?: string;
	aboutPromiseTitle?: string;
	aboutPromiseDetail?: string;
	aboutHistoryStory?: string;
	aboutCoverUrl?: string;

	aboutHistorySectionBadge?: string;
	aboutHistorySectionTitle?: string;
	aboutMilestones?: Array<{
		year: string;
		title: string;
		description: string;
		color: string;
	}>;

	aboutPrinciplesSectionBadge?: string;
	aboutPrinciplesSectionTitle?: string;
	aboutPrinciplesSectionSubtitle?: string;
	aboutCoreValues?: Array<{
		title: string;
		description: string;
		color: string;
	}>;

	aboutBoardSectionBadge?: string;
	aboutBoardSectionTitle?: string;
	aboutBoardMembers?: Array<{
		name: string;
		title: string;
		role: string;
		photoUrl: string;
		photoPublicId: string;
		accent: string;
	}>;

	aboutJoinTitle?: string;
	aboutJoinSubtitle?: string;
	aboutJoinEventsButtonText?: string;
	aboutJoinContactButtonText?: string;

	footerDescription?: string;
	footerCopyrightText?: string;
	footerFacebookUrl?: string;
	footerYoutubeUrl?: string;
	footerWebsiteUrl?: string;
}

export default function AboutPage() {
	const [settings, setSettings] = useState<Settings>({});

	useEffect(() => {
		axios
			.get("/api/settings")
			.then((res) => {
				if (res.data.success && res.data.data) {
					setSettings(res.data.data);
				}
			})
			.catch(() => {});
	}, []);

	const heroBadge =
		settings.aboutHeroBadge || settings.aboutBadge || "About Us";
	const heroTitle =
		settings.aboutHeroTitle ||
		settings.aboutTitle ||
		"Talamij — A Journey of Dreams";
	const heroSubtitle =
		settings.aboutHeroSubtitle ||
		settings.aboutParagraph1 ||
		"A non-profit organization dedicated to youth talent development, leadership building, and fostering social responsibility.";

	const missionTitle = settings.aboutMissionTitle || "Our Mission";
	const missionDetail =
		settings.aboutMissionDetail ||
		settings.aboutMissionText ||
		"Guiding talented youth on the right path to contribute to national development. Inspiring youth participation in education, culture, and social development.";

	const visionTitle = settings.aboutVisionTitle || "Our Vision";
	const visionDetail =
		settings.aboutVisionDetail ||
		settings.aboutVisionText ||
		"Building an educated, conscious, and organized youth generation — advancing the country toward a bright future with knowledge, ethics, and humanity.";

	const promiseTitle = settings.aboutPromiseTitle || "Our Promise";
	const promiseDetail =
		settings.aboutPromiseDetail ||
		settings.aboutParagraph2 ||
		"Giving every young person the opportunity to develop their full potential. Creating an enlightened generation through quality education, health, and culture.";

	return (
		<main style={{ background: "#060612" }}>
			<Navbar
				isRegistrationOpen={settings.isRegistrationOpen ?? true}
				navbarLogoUrl={settings.navbarLogoUrl}
				siteTitle={settings.siteTitle}
				siteSubtitle={settings.siteSubtitle}
			/>

			{/* Page Hero */}
			<section className="relative pt-32 pb-20 px-6 overflow-hidden">
				{settings.aboutCoverUrl ?
					<div className="absolute inset-0">
						<img
							src={settings.aboutCoverUrl}
							alt="About Cover"
							className="w-full h-full object-cover opacity-20"
						/>
						<div className="absolute inset-0 bg-linear-to-b from-[#060612]/80 via-[#060612]/90 to-[#060612]" />
					</div>
				:	<div
						className="absolute inset-0"
						style={{
							background:
								"radial-gradient(ellipse 80% 60% at 50% -10%, #1e0b38 0%, #060612 70%)",
						}}
					/>
				}
				<motion.div
					className="absolute top-1/4 left-[-5%] w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
					style={{ background: "radial-gradient(circle, #7c3aed, #4338ca)" }}
					animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
					transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
				/>
				<motion.div
					className="absolute bottom-1/4 right-[-5%] w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
					style={{ background: "radial-gradient(circle, #0ea5e9, #06b6d4)" }}
					animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
					transition={{
						duration: 12,
						repeat: Infinity,
						ease: "easeInOut",
						delay: 2,
					}}
				/>

				<div className="relative max-w-5xl mx-auto text-center">
					<motion.div
						initial={{ opacity: 0, y: -12 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="flex justify-center mb-6">
						<span
							className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border border-violet-400/30 text-violet-300"
							style={{ background: "rgba(124,58,237,0.1)" }}>
							<span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
							{heroBadge}
						</span>
					</motion.div>

					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.65, delay: 0.1 }}
						className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
						{heroTitle}
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
						{heroSubtitle}
					</motion.p>
				</div>
			</section>

			{/* Mission & Vision */}
			<section
				className="py-24 px-6 relative overflow-hidden"
				style={{ background: "#07070f" }}>
				<div
					className="absolute top-0 left-1/2 -translate-x-1/2 w-175 h-px opacity-20"
					style={{
						background:
							"linear-gradient(90deg, transparent, #7c3aed, transparent)",
					}}
				/>
				<div className="max-w-6xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{[
							{
								icon: Target,
								title: missionTitle,
								description: missionDetail,
								color: "#7c3aed",
								label: "Mission",
							},
							{
								icon: Eye,
								title: visionTitle,
								description: visionDetail,
								color: "#0ea5e9",
								label: "Vision",
							},
							{
								icon: Star,
								title: promiseTitle,
								description: promiseDetail,
								color: "#f59e0b",
								label: "Promise",
							},
						].map((item, i) => {
							const Icon = item.icon;
							return (
								<motion.div
									key={item.title}
									initial={{ opacity: 0, y: 24 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5, delay: i * 0.1 }}
									whileHover={{ y: -6 }}
									className="group relative rounded-3xl p-8 border border-white/8 overflow-hidden"
									style={{ background: "rgba(255,255,255,0.025)" }}>
									<div
										className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
										style={{
											background: `radial-gradient(circle at 50% 0%, ${item.color}18 0%, transparent 60%)`,
										}}
									/>
									<span
										className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full mb-4 inline-block"
										style={{
											color: item.color,
											background: `${item.color}15`,
										}}>
										{item.label}
									</span>
									<div
										className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 relative"
										style={{
											background: `${item.color}18`,
											border: `1px solid ${item.color}30`,
										}}>
										<Icon
											className="w-6 h-6"
											style={{ color: item.color }}
										/>
									</div>
									<h3 className="text-white font-bold text-xl mb-3 relative">
										{item.title}
									</h3>
									<p className="text-slate-400 text-sm leading-relaxed relative">
										{item.description}
									</p>
								</motion.div>
							);
						})}
					</div>
				</div>
			</section>

			{/* Our Story */}
			<section
				className="py-24 px-6 relative overflow-hidden"
				style={{ background: "#0a0a14" }}>
				<div
					className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-px opacity-20"
					style={{
						background:
							"linear-gradient(90deg, transparent, #0ea5e9, transparent)",
					}}
				/>
				<div className="max-w-6xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-16">
						<span
							className="inline-block text-xs font-semibold tracking-widest uppercase mb-4 px-3 py-1 rounded-full border border-cyan-500/30 text-cyan-400"
							style={{ background: "rgba(14,165,233,0.1)" }}>
							{settings.aboutHistorySectionBadge || "Our History"}
						</span>
						<h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
							{settings.aboutHistorySectionTitle || "Talamij's Journey"}
						</h2>
					</motion.div>

					{/* Timeline */}
					<div className="relative">
						{/* Center line */}
						<div
							className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px hidden md:block"
							style={{
								background:
									"linear-gradient(to bottom, transparent, #7c3aed40, #0ea5e940, transparent)",
							}}
						/>

						<div className="space-y-10">
							{(settings.aboutMilestones?.length ?
								settings.aboutMilestones
							:	milestones
							).map((m, i) => (
								<motion.div
									key={m.year + "-" + i}
									initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.55, delay: i * 0.1 }}
									className={`flex items-center gap-8 md:gap-0 ${
										i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
									}`}>
									<div className="flex-1 md:px-12">
										<div
											className={`p-6 rounded-2xl border border-white/8 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 ${
												i % 2 === 0 ? "md:text-right" : ""
											}`}
											style={{ background: "rgba(255,255,255,0.025)" }}>
											<div
												className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
												style={{
													background: `radial-gradient(circle at ${i % 2 === 0 ? "100% 0%" : "0% 0%"}, ${m.color || "#7c3aed"}15 0%, transparent 60%)`,
												}}
											/>
											<div
												className="text-2xl font-bold mb-1 relative"
												style={{ color: m.color || "#7c3aed" }}>
												{m.year}
											</div>
											<h3 className="text-white font-bold text-lg mb-2 relative">
												{m.title}
											</h3>
											<p className="text-slate-400 text-sm leading-relaxed relative">
												{m.description}
											</p>
										</div>
									</div>

									{/* Center dot */}
									<div className="hidden md:flex relative z-10 shrink-0">
										<div
											className="w-4 h-4 rounded-full border-2 border-[#060612]"
											style={{
												background: m.color || "#7c3aed",
												boxShadow: `0 0 12px ${m.color || "#7c3aed"}`,
											}}
										/>
									</div>

									<div className="flex-1 hidden md:block" />
								</motion.div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Values */}
			<section
				className="py-24 px-6 relative overflow-hidden"
				style={{ background: "#07070f" }}>
				<div
					className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-px opacity-20"
					style={{
						background:
							"linear-gradient(90deg, transparent, #a855f7, transparent)",
					}}
				/>
				<div className="max-w-6xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-16">
						<span
							className="inline-block text-xs font-semibold tracking-widest uppercase mb-4 px-3 py-1 rounded-full border border-purple-500/30 text-purple-400"
							style={{ background: "rgba(168,85,247,0.1)" }}>
							{settings.aboutPrinciplesSectionBadge || "Values"}
						</span>
						<h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
							{settings.aboutPrinciplesSectionTitle || "Our Core Principles"}
						</h2>
						<p className="text-slate-400 text-lg max-w-xl mx-auto">
							{settings.aboutPrinciplesSectionSubtitle ||
								"These core principles drive every decision and activity at Talamij."}
						</p>
					</motion.div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
						{(settings.aboutCoreValues?.length ?
							settings.aboutCoreValues
						:	values
						).map((v, i) => {
							const defaultIcons = [
								Shield,
								Heart,
								Users,
								Lightbulb,
								BookOpen,
								Globe,
							];
							const Icon =
								(v as any).icon || defaultIcons[i % defaultIcons.length];
							const color = v.color || "#7c3aed";
							return (
								<motion.div
									key={v.title + "-" + i}
									initial={{ opacity: 0, y: 24 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.45, delay: i * 0.07 }}
									whileHover={{ y: -5 }}
									className="group p-6 rounded-2xl border border-white/8 relative overflow-hidden"
									style={{ background: "rgba(255,255,255,0.025)" }}>
									<div
										className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
										style={{
											background: `radial-gradient(circle at 50% 0%, ${color}18 0%, transparent 60%)`,
										}}
									/>
									<div
										className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 relative"
										style={{
											background: `${color}18`,
											border: `1px solid ${color}30`,
										}}>
										<Icon
											className="w-5 h-5"
											style={{ color: color }}
										/>
									</div>
									<h3 className="text-white font-semibold mb-2 relative">
										{v.title}
									</h3>
									<p className="text-slate-400 text-sm leading-relaxed relative">
										{v.description}
									</p>
									<div
										className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl"
										style={{
											background: `linear-gradient(90deg, ${color}, transparent)`,
										}}
									/>
								</motion.div>
							);
						})}
					</div>
				</div>
			</section>

			{/* Leadership */}
			<section
				className="py-24 px-6 relative overflow-hidden"
				style={{ background: "#0a0a14" }}>
				<div
					className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-px opacity-20"
					style={{
						background:
							"linear-gradient(90deg, transparent, #f472b6, transparent)",
					}}
				/>
				<div className="max-w-5xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-14">
						<span
							className="inline-block text-xs font-semibold tracking-widest uppercase mb-4 px-3 py-1 rounded-full border border-pink-500/30 text-pink-400"
							style={{ background: "rgba(244,114,182,0.1)" }}>
							{settings.aboutBoardSectionBadge || "Leadership"}
						</span>
						<h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
							{settings.aboutBoardSectionTitle || "Our Executive Board"}
						</h2>
					</motion.div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
						{((
							settings.aboutBoardMembers &&
							settings.aboutBoardMembers.length > 0
						) ?
							settings.aboutBoardMembers
						:	[
								{
									name: settings.presidentName || "President",
									title: settings.presidentTitle || "President, Talamij",
									role: "President",
									photoUrl: "",
									photoPublicId: "",
									accent: "#7c3aed",
								},
								{
									name: settings.secretaryName || "General Secretary",
									title:
										settings.secretaryTitle || "General Secretary, Talamij",
									role: "General Secretary",
									photoUrl: "",
									photoPublicId: "",
									accent: "#ec4899",
								},
							]
						).map((leader, i) => {
							const accent = leader.accent || "#7c3aed";
							const initial = (leader.name || "?").charAt(0).toUpperCase();
							return (
								<motion.div
									key={leader.role + "-" + i}
									initial={{ opacity: 0, y: 28 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5, delay: i * 0.15 }}
									whileHover={{ y: -6 }}
									className="group relative rounded-3xl p-8 border border-white/8 overflow-hidden text-center flex flex-col justify-between"
									style={{ background: "rgba(255,255,255,0.025)" }}>
									<div
										className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
										style={{
											background: `radial-gradient(circle at 50% 0%, ${accent}25 0%, transparent 70%)`,
										}}
									/>
									<div className="relative z-10 flex flex-col items-center">
										{leader.photoUrl ?
											<div
												className="w-24 h-24 rounded-2xl overflow-hidden mb-5 border shadow-xl"
												style={{
													borderColor: `${accent}50`,
													boxShadow: `0 0 30px ${accent}25`,
												}}>
												<img
													src={leader.photoUrl}
													alt={leader.name}
													className="w-full h-full object-cover"
												/>
											</div>
										:	<div
												className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-5 border"
												style={{
													background: `linear-gradient(135deg, ${accent}30, ${accent}10)`,
													borderColor: `${accent}50`,
													boxShadow: `0 0 30px ${accent}25`,
												}}>
												{initial}
											</div>
										}
										{leader.role && (
											<span
												className="text-xs px-3 py-1 rounded-full font-semibold mb-3 border flex items-center gap-1"
												style={{
													color: accent,
													borderColor: `${accent}40`,
													background: `${accent}15`,
												}}>
												<Award className="w-3 h-3" />
												{leader.role}
											</span>
										)}
										<h3 className="text-white text-xl font-bold mb-1">
											{leader.name}
										</h3>
										<p className="text-slate-400 text-sm mb-4">
											{leader.title}
										</p>
									</div>

									{/* Optional Official Signature if matching President or Secretary */}
									{((leader.role?.toLowerCase().includes("president") &&
										settings.presidentSignatureUrl) ||
										(leader.role?.toLowerCase().includes("secretary") &&
											settings.secretarySignatureUrl)) && (
										<div className="relative z-10 pt-4 border-t border-white/8 w-full flex flex-col items-center mt-auto">
											<span className="text-[11px] text-slate-500 mb-2">
												Official Signature
											</span>
											<img
												src={
													leader.role?.toLowerCase().includes("president") ?
														settings.presidentSignatureUrl
													:	settings.secretarySignatureUrl
												}
												alt={`${leader.name} Signature`}
												className="h-12 object-contain opacity-80"
											/>
										</div>
									)}
								</motion.div>
							);
						})}
					</div>
				</div>
			</section>

			{/* Join CTA */}
			<section
				className="py-24 px-6 relative overflow-hidden"
				style={{ background: "#07070f" }}>
				<div
					className="absolute inset-0 opacity-20 pointer-events-none"
					style={{
						background:
							"radial-gradient(ellipse at center, rgba(124,58,237,0.2), transparent 65%)",
					}}
				/>
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="max-w-3xl mx-auto text-center relative z-10 rounded-3xl p-12 border border-white/10"
					style={{
						background:
							"linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(14,165,233,0.05) 100%)",
						backdropFilter: "blur(20px)",
						boxShadow: "0 0 60px rgba(124,58,237,0.15)",
					}}>
					<div
						className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6 border"
						style={{
							background: "linear-gradient(135deg, #7c3aed30, #7c3aed10)",
							borderColor: "#7c3aed50",
						}}>
						T
					</div>
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
						{settings.aboutJoinTitle || "Join Our Organization"}
					</h2>
					<p className="text-slate-400 text-lg mb-8 leading-relaxed">
						{settings.aboutJoinSubtitle ||
							"Become part of the growing Talamij family. Together, let's build an enlightened generation and a better tomorrow."}
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<Link href="/events">
							<button
								id="about-events-btn"
								className="group flex items-center gap-2 px-8 py-3.5 rounded-2xl text-base font-semibold text-white transition-all cursor-pointer"
								style={{
									background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
									boxShadow: "0 0 30px rgba(124,58,237,0.35)",
								}}>
								{settings.aboutJoinEventsButtonText || "View Events"}
							</button>
						</Link>
						<Link href="/#contact">
							<button
								id="about-contact-btn"
								className="px-8 py-3.5 rounded-2xl text-base font-semibold text-white border border-white/15 hover:bg-white/5 transition-all cursor-pointer">
								{settings.aboutJoinContactButtonText || "Contact Us"}
							</button>
						</Link>
					</div>
				</motion.div>
			</section>

			<Footer
				description={settings.footerDescription}
				copyrightText={settings.footerCopyrightText}
				facebookUrl={settings.footerFacebookUrl}
				youtubeUrl={settings.footerYoutubeUrl}
				websiteUrl={settings.footerWebsiteUrl}
				navbarLogoUrl={settings.navbarLogoUrl}
				siteTitle={settings.siteTitle}
				siteSubtitle={settings.siteSubtitle}
			/>
		</main>
	);
}
