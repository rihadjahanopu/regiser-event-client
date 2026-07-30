/* eslint-disable @typescript-eslint/typedef */
"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const stats = [
	{ value: 5000, suffix: "+", label: "Members", color: "#7c3aed" },
	{ value: 48, suffix: "+", label: "Events", color: "#0ea5e9" },
	{ value: 6, suffix: "+", label: "Years", color: "#f59e0b" },
	{ value: 12, suffix: "", label: "Districts Active", color: "#10b981" },
];

function useCountUp(
	target: number,
	duration: number = 2000,
	shouldStart: boolean = false
) {
	const [count, setCount] = useState(0);
	useEffect(() => {
		if (!shouldStart) return;
		let startTime: number | null = null;
		const animate = (timestamp: number) => {
			if (!startTime) startTime = timestamp;
			const progress = Math.min((timestamp - startTime) / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 3);
			setCount(Math.floor(eased * target));
			if (progress < 1) requestAnimationFrame(animate);
			else setCount(target);
		};
		requestAnimationFrame(animate);
	}, [target, duration, shouldStart]);
	return count;
}

function StatCard({
	value,
	suffix,
	label,
	color,
	delay,
}: {
	value: number;
	suffix: string;
	label: string;
	color: string;
	delay: number;
}) {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true });
	const [started, setStarted] = useState(false);
	const count = useCountUp(value, 2000, started);

	useEffect(() => {
		if (inView) {
			const t = setTimeout(() => setStarted(true), delay * 1000);
			return () => clearTimeout(t);
		}
	}, [inView, delay]);

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5, delay }}
			className="text-center">
			<div
				className="text-5xl md:text-6xl font-bold mb-2 tabular-nums"
				style={{ color }}>
				{count}
				{suffix}
			</div>
			<p className="text-slate-400 text-sm font-medium">{label}</p>
			<div
				className="w-8 h-0.5 mx-auto mt-3 rounded-full opacity-60"
				style={{ background: color }}
			/>
		</motion.div>
	);
}

interface StatsSectionProps {
	members?: string;
	events?: string;
	years?: string;
	districts?: string;
}

function parseStat(rawStr?: string, defaultVal: number = 0, defaultSuffix: string = "") {
	if (!rawStr) return { value: defaultVal, suffix: defaultSuffix };
	const matches = rawStr.trim().match(/^(\d+)(.*)$/);
	if (matches) {
		return { value: parseInt(matches[1], 10), suffix: matches[2] || "" };
	}
	return { value: defaultVal, suffix: rawStr };
}

export default function StatsSection({
	members = "5000+",
	events = "48+",
	years = "6+",
	districts = "12",
}: StatsSectionProps) {
	const parsedMembers = parseStat(members, 5000, "+");
	const parsedEvents = parseStat(events, 48, "+");
	const parsedYears = parseStat(years, 6, "+");
	const parsedDistricts = parseStat(districts, 12, "");

	const statsList = [
		{ value: parsedMembers.value, suffix: parsedMembers.suffix, label: "Members", color: "#7c3aed" },
		{ value: parsedEvents.value, suffix: parsedEvents.suffix, label: "Events", color: "#0ea5e9" },
		{ value: parsedYears.value, suffix: parsedYears.suffix, label: "Years", color: "#f59e0b" },
		{ value: parsedDistricts.value, suffix: parsedDistricts.suffix, label: "Districts Active", color: "#10b981" },
	];

	return (
		<section
			className="py-20 px-6 relative overflow-hidden"
			style={{ background: "#0a0a14" }}>
			<div
				className="absolute inset-0 opacity-30 pointer-events-none"
				style={{
					background:
						"radial-gradient(ellipse at center, rgba(124,58,237,0.12) 0%, transparent 70%)",
				}}
			/>
			<div className="max-w-5xl mx-auto relative">
				<motion.p
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					className="text-center text-slate-500 text-sm font-medium tracking-widest uppercase mb-14">
					Talamij in Numbers
				</motion.p>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-4">
					{statsList.map((s, i) => (
						<StatCard
							key={s.label}
							{...s}
							delay={i * 0.12}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
