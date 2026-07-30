/* eslint-disable @typescript-eslint/typedef */
"use client";

import { motion } from "framer-motion";
import { Eye, Heart, Lightbulb, Target } from "lucide-react";

const values = [
	{
		icon: Target,
		title: "Mission",
		text: "Guiding talented youth on the right path to contribute to the nation's development.",
		color: "#7c3aed",
	},
	{
		icon: Eye,
		title: "Vision",
		text: "Building an educated, aware, and well-organized generation of young people.",
		color: "#0ea5e9",
	},
	{
		icon: Heart,
		title: "Values",
		text: "Honesty, unity, dedication, and patriotism are our core driving forces.",
		color: "#f472b6",
	},
	{
		icon: Lightbulb,
		title: "Innovation",
		text: "Opening doors to new possibilities through the integration of education and technology.",
		color: "#10b981",
	},
];

interface AboutSectionProps {
	badge?: string;
	title?: string;
	paragraph1?: string;
	paragraph2?: string;
	foundedYear?: string;
	missionText?: string;
	visionText?: string;
	valuesText?: string;
	innovationText?: string;
}

export default function AboutSection({
	badge = "About Us",
	title = "Talamij — A Journey of Dreams",
	paragraph1 = "Talamij is a voluntary organization working to develop the talents of young students, cultivate leadership skills, and foster a sense of social responsibility. We believe every young person holds limitless potential within them.",
	paragraph2 = "Through the combination of quality education, good health, and rich culture, we aim to build an enlightened generation devoted to serving their country and nation.",
	foundedYear = "2018",
	missionText = "Guiding talented youth on the right path to contribute to the nation's development.",
	visionText = "Building an educated, aware, and well-organized generation of young people.",
	valuesText = "Honesty, unity, dedication, and patriotism are our core driving forces.",
	innovationText = "Opening doors to new possibilities through the integration of education and technology.",
}: AboutSectionProps) {
	const values = [
		{
			icon: Target,
			title: "Mission",
			text: missionText,
			color: "#7c3aed",
		},
		{
			icon: Eye,
			title: "Vision",
			text: visionText,
			color: "#0ea5e9",
		},
		{
			icon: Heart,
			title: "Values",
			text: valuesText,
			color: "#f472b6",
		},
		{
			icon: Lightbulb,
			title: "Innovation",
			text: innovationText,
			color: "#10b981",
		},
	];

	return (
		<section
			id="about"
			className="relative py-28 px-6 overflow-hidden"
			style={{ background: "#07070f" }}>
			<div
				className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px opacity-25"
				style={{
					background:
						"linear-gradient(90deg, transparent, #7c3aed, #4f46e5, transparent)",
				}}
			/>

			<div className="max-w-6xl mx-auto">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
					{/* Left text */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.65 }}>
						<span
							className="inline-block text-xs font-semibold tracking-widest uppercase mb-5 px-3 py-1 rounded-full border border-violet-500/30 text-violet-400"
							style={{ background: "rgba(124,58,237,0.1)" }}>
							{badge}
						</span>
						<h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
							{title}
						</h2>
						<div className="space-y-4 text-slate-400 text-base leading-relaxed">
							{paragraph1 && <p>{paragraph1}</p>}
							{paragraph2 && <p>{paragraph2}</p>}
						</div>

						{foundedYear && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 0.3 }}
								className="mt-8 flex items-center gap-4">
								<div className="h-px flex-1 bg-white/8" />
								<span className="text-slate-600 text-sm">Founded in {foundedYear}</span>
								<div className="h-px flex-1 bg-white/8" />
							</motion.div>
						)}
					</motion.div>

					{/* Right values grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{values.map((v, i) => {
							const Icon = v.icon;
							return (
								<motion.div
									key={v.title}
									initial={{ opacity: 0, y: 24 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.45, delay: i * 0.08 }}
									whileHover={{ y: -4 }}
									className="group p-5 rounded-2xl border border-white/8 relative overflow-hidden"
									style={{ background: "rgba(255,255,255,0.025)" }}>
									<div
										className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
										style={{
											background: `radial-gradient(circle at 50% 0%, ${v.color}18 0%, transparent 60%)`,
										}}
									/>
									<div
										className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
										style={{
											background: `${v.color}18`,
											border: `1px solid ${v.color}30`,
										}}>
										<Icon
											className="w-5 h-5"
											style={{ color: v.color }}
										/>
									</div>
									<h3 className="text-white font-semibold mb-1.5">{v.title}</h3>
									<p className="text-slate-400 text-sm leading-relaxed">
										{v.text}
									</p>
								</motion.div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
