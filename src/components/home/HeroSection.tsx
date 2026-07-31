"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, UserCheck } from "lucide-react";
import Link from "next/link";

interface HeroSectionProps {
	eyebrow?: string;
	titleLine1?: string;
	titleLine2?: string;
	description?: string;
	ctaRegisterText?: string;
	ctaAboutText?: string;
	ctaEventsText?: string;
}

export default function HeroSection({
	eyebrow = "Chhatak Uttar Upazila",
	titleLine1 = "Bangladesh Anjumane",
	titleLine2 = "Talamije Islamia",
	description = "Dedicated to fostering education, ethical values, leadership skills, and community welfare among students and youth.",
	ctaRegisterText = "Register for Event",
	ctaAboutText = "Learn About Us",
	ctaEventsText = "View All Events",
}: HeroSectionProps) {
	return (
		<section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">
			{/* Multi-layer background */}
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,_#1e0b3a_0%,_#0d0d1a_45%,_#060612_100%)]" />

			{/* Animated orbs */}
			<motion.div
				className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none"
				style={{ background: "radial-gradient(circle, #7c3aed, #4338ca)" }}
				animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
				transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
			/>
			<motion.div
				className="absolute bottom-1/4 right-[-10%] w-[400px] h-[400px] rounded-full opacity-15 blur-3xl pointer-events-none"
				style={{ background: "radial-gradient(circle, #0ea5e9, #06b6d4)" }}
				animate={{ x: [0, -40, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
				transition={{
					duration: 15,
					repeat: Infinity,
					ease: "easeInOut",
					delay: 3,
				}}
			/>
			<motion.div
				className="absolute top-2/3 left-1/3 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
				style={{ background: "radial-gradient(circle, #f472b6, #e879f9)" }}
				animate={{ scale: [1, 1.3, 1] }}
				transition={{
					duration: 8,
					repeat: Infinity,
					ease: "easeInOut",
					delay: 1,
				}}
			/>

			{/* Subtle grid */}
			<div
				className="absolute inset-0 opacity-[0.04] pointer-events-none"
				style={{
					backgroundImage:
						"linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
					backgroundSize: "80px 80px",
				}}
			/>

			<div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
				{/* Logo Badge & Eyebrow */}
				<motion.div
					initial={{ opacity: 0, y: -16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="flex flex-col items-center gap-3 mb-6">
					<span
						className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold border border-violet-400/30 text-violet-300"
						style={{
							background: "rgba(124,58,237,0.12)",
							backdropFilter: "blur(12px)",
						}}>
						<span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
						{eyebrow}
					</span>
				</motion.div>

				{/* Main heading */}
				<motion.h1
					initial={{ opacity: 0, y: 24 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.75, delay: 0.1 }}
					className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-[1.12] tracking-tight">
					<span className="text-white">{titleLine1}</span>
					{titleLine2 && (
						<>
							<br />
							<span
								style={{
									background:
										"linear-gradient(135deg, #c4b5fd 0%, #818cf8 40%, #67e8f9 100%)",
									WebkitBackgroundClip: "text",
									WebkitTextFillColor: "transparent",
									backgroundClip: "text",
								}}>
								{titleLine2}
							</span>
						</>
					)}
				</motion.h1>

				{/* Tagline */}
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.22 }}
					className="text-base md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
					{description}
				</motion.p>

				{/* CTAs including Event Registration Form */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.32 }}
					className="flex flex-wrap justify-center items-center gap-4">
					{/* Primary Event Registration Form CTA */}
					{ctaRegisterText && (
						<Link href="/event-form">
							<button
								id="hero-register-form-btn"
								className="group relative overflow-hidden px-8 py-4 rounded-2xl text-base font-bold text-white cursor-pointer transition-all"
								style={{
									background:
										"linear-gradient(135deg, #7c3aed 0%, #4f46e5 60%, #2563eb 100%)",
									boxShadow: "0 0 40px rgba(124,58,237,0.5)",
								}}>
								<span className="relative z-10 flex items-center gap-2.5">
									<UserCheck className="w-5 h-5" />
									{ctaRegisterText}
									<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
								</span>
								<div className="absolute inset-0 bg-white/15 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
							</button>
						</Link>
					)}

					{ctaAboutText && (
						<Link href="/about">
							<button
								id="hero-about-btn"
								className="px-7 py-4 rounded-2xl text-base font-semibold text-white border border-white/15 hover:bg-white/10 transition-all cursor-pointer"
								style={{
									backdropFilter: "blur(12px)",
									background: "rgba(255,255,255,0.04)",
								}}>
								{ctaAboutText}
							</button>
						</Link>
					)}

					{ctaEventsText && (
						<a href="https://talamij.rihadjahanopu.com/events" target="_blank" rel="noopener noreferrer">
							<button
								id="hero-events-btn"
								className="px-7 py-4 rounded-2xl text-base font-semibold text-slate-300 hover:text-white border border-white/10 hover:bg-white/5 transition-all cursor-pointer">
								{ctaEventsText}
							</button>
						</a>
					)}
				</motion.div>

				{/* Scroll indicator */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1.2, duration: 0.6 }}
					className="mt-16 flex flex-col items-center gap-1">
					<span className="text-xs text-slate-600 font-medium tracking-widest uppercase">
						Scroll Down
					</span>
					<motion.div
						animate={{ y: [0, 6, 0] }}
						transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
						<ChevronDown className="w-5 h-5 text-slate-600" />
					</motion.div>
				</motion.div>
			</div>

			{/* Bottom fade */}
			<div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#07070f] to-transparent pointer-events-none" />
		</section>
	);
}
