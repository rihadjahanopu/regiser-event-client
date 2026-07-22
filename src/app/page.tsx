"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import CountdownTimer, { calculateTimeLeft } from "@/components/CountdownTimer";
import {
	ArrowLeft,
	ArrowRight,
	BookOpen,
	Calendar,
	CheckCircle2,
	Clock,
	GraduationCap,
	Heart,
	Layers,
	Loader2,
	Mail,
	MapPin,
	Phone,
	User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { RegistrationFormValues } from "@/lib/validations";
import { buildDynamicSchema, normaliseFieldConfig, DEFAULT_FIELD_CONFIG, type FieldConfig } from "@/lib/fieldConfig";
import axios from "axios";
import Image from "next/image";

// eslint-disable-next-line @typescript-eslint/typedef
const STEPS = [
	{
		id: 1,
		title: "Personal Info",
		icon: User,
		description: "Basic personal details",
		fields: ["fullName", "mobile", "email", "gender"],
	},
	{
		id: 2,
		title: "Academic Info",
		icon: GraduationCap,
		description: "Your education details",
		fields: [
			"schoolName",
			"class",
			"subjectGroup",
			"rollNumber",
			"regNumber",
			"passingYear",
			"gradeGpa",
		],
	},
	{
		id: 3,
		title: "Location & Extra",
		icon: MapPin,
		description: "Address and additional info",
		fields: [
			"address",
			"district",
			"bloodGroup",
			"fatherName",
			"emergencyContact",
		],
	},
];

// eslint-disable-next-line @typescript-eslint/typedef
const SIDE_ICONS = [
	{ icon: BookOpen, label: "Academic Excellence" },
	{ icon: Heart, label: "Health & Safety" },
	{ icon: Layers, label: "Multi-Subject Programs" },
];

export default function RegistrationPage() {
	// eslint-disable-next-line @typescript-eslint/typedef
	const router = useRouter();
	const [step, setStep] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [direction, setDirection] = useState(1);
	const [coverUrl, setCoverUrl] = useState<string | null>(null);
	const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
	const [isLoadingSettings, setIsLoadingSettings] = useState(true);

	// Event details state
	const [eventDetails, setEventDetails] = useState<{
		eventName?: string;
		eventAddress?: string;
		eventDate?: string;
		eventStartTime?: string;
		organiserContact?: string;
		showCountdown?: boolean;
	}>({});
	const [isCutoffClosed, setIsCutoffClosed] = useState(false);

	// Form Field config state
	const [fieldConfig, setFieldConfig] = useState<FieldConfig>(DEFAULT_FIELD_CONFIG);

	useEffect(() => {
		axios
			.get("/api/settings")
			.then((res) => {
				if (res.data.success && res.data.data) {
					const data = res.data.data;
					setCoverUrl(data.eventCoverUrl || null);
					setIsRegistrationOpen(data.isRegistrationOpen ?? true);
					setEventDetails({
						eventName: data.eventName || "",
						eventAddress: data.eventAddress || "",
						eventDate: data.eventDate || "",
						eventStartTime: data.eventStartTime || "",
						organiserContact: data.organiserContact || "",
						showCountdown: data.showCountdown ?? true,
					});

					if (data.fieldConfig) {
						setFieldConfig(normaliseFieldConfig(data.fieldConfig));
					}

					if (data.eventDate) {
						const timeLeft = calculateTimeLeft(data.eventDate, data.eventStartTime || "");
						if (timeLeft.isCutoffReached) {
							setIsCutoffClosed(true);
						}
					}
				}
			})
			.catch(() => {
				/* silent */
			})
			.finally(() => setIsLoadingSettings(false));
	}, []);

	// Dynamically generated schema based on admin config
	const dynamicSchema = useMemo(() => {
		return buildDynamicSchema(fieldConfig);
	}, [fieldConfig]);

	// eslint-disable-next-line @typescript-eslint/typedef
	const form = useForm<RegistrationFormValues>({
		resolver: zodResolver(dynamicSchema) as any,
		defaultValues: {
			fullName: "",
			mobile: "",
			email: "",
			gender: undefined,
			dob: "",
			fatherName: "",
			address: "",
			district: "",
			schoolName: "",
			class: "",
			subjectGroup: "",
			rollNumber: "",
			regNumber: "",
			bloodGroup: "",
			emergencyContact: "",
			passingYear: "",
			gradeGpa: "",
		},
		mode: "onChange",
	});

	// eslint-disable-next-line @typescript-eslint/typedef
	const currentStep = STEPS[step];
	// eslint-disable-next-line @typescript-eslint/typedef
	const isLastStep = step === STEPS.length - 1;

	async function handleNext() {
		// eslint-disable-next-line @typescript-eslint/typedef
		const fields = currentStep.fields as (keyof RegistrationFormValues)[];
		// eslint-disable-next-line @typescript-eslint/typedef
		const valid = await form.trigger(fields);
		if (!valid) return;
		setDirection(1);
		setStep((s) => s + 1);
	}

	function handleBack() {
		setDirection(-1);
		setStep((s) => s - 1);
	}

	async function onSubmit(data: RegistrationFormValues) {
		setIsSubmitting(true);
		try {
			// eslint-disable-next-line @typescript-eslint/typedef
			const response = await axios.post("/api/registration/register", data);
			// eslint-disable-next-line @typescript-eslint/typedef
			const result = response.data;
			if (result.success && result.registrationId) {
				toast.success("Registration successful! Generating your ticket...");
				router.push(`/success/${result.registrationId}`);
			} else {
				toast.error(result.error || "Failed to register.");
			}
		} catch (error: any) {
			toast.error(
				error.response?.data?.error || "Something went wrong. Please try again."
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	// eslint-disable-next-line @typescript-eslint/typedef
	const slideVariants = {
		enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
		center: { x: 0, opacity: 1 },
		exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
	};

	return (
		<div className="h-dvh w-full flex flex-col lg:flex-row bg-slate-950 overflow-hidden">
			{/* ─── Left Panel ─── */}
			<div className="hidden lg:flex lg:w-2/5 xl:w-1/3 flex-col relative">
				{/* Gradient background */}
				<div className="absolute inset-0 bg-linear-to-br from-blue-600 via-blue-700 to-indigo-900" />
				{/* Animated circles */}
				<div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
				<div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-2xl animate-pulse delay-1000" />

				<div className="relative z-10 flex flex-col h-full p-10 justify-between">
					{/* Logo / Brand */}
					<div className="flex items-center space-x-3">
						<div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1 shadow-md">
							<Image
								src="/bangladesh-anjumane-talamije-islamia-seeklogo.png"
								alt="Logo"
								width={48}
								height={48}
								className="w-full h-full object-contain"
							/>
						</div>
						<span className="text-white font-bold text-xl tracking-tight leading-tight max-w-100">
							Bangladesh Anjumane Talamije Islamia
							<br />
							Chhatak Uttar Upazila
						</span>
					</div>

					{/* Main copy */}
					<div className="space-y-6">
						<div className="space-y-3">
							<h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
								Register &<br />
								Get Your
								<br />
								<span className="text-blue-200">Digital Ticket</span>
							</h1>
							<p className="text-blue-100/80 text-base leading-relaxed max-w-xs">
								Fill out the form to secure your spot. You&apos;ll receive a
								unique QR-verified ticket instantly.
							</p>
						</div>

						{/* Feature list */}
						<div className="space-y-3">
							{SIDE_ICONS.map(({ icon: Icon, label }) => (
								<div
									key={label}
									className="flex items-center space-x-3">
									<div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
										<Icon className="w-4 h-4 text-white" />
									</div>
									<span className="text-white/80 text-sm">{label}</span>
								</div>
							))}
						</div>
					</div>

					{/* Step indicators */}
					<div className="space-y-2">
						{STEPS.map((s, i) => {
							// eslint-disable-next-line @typescript-eslint/typedef
							const StepIcon = s.icon;
							// eslint-disable-next-line @typescript-eslint/typedef
							const isDone = i < step;
							// eslint-disable-next-line @typescript-eslint/typedef
							const isCurrent = i === step;
							return (
								<div
									key={s.id}
									className={`flex items-center space-x-3 transition-all duration-300 ${isCurrent ? "opacity-100" : "opacity-40"}`}>
									<div
										className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
											isDone ? "bg-green-400"
											: isCurrent ? "bg-white"
											: "bg-white/20"
										}`}>
										{isDone ?
											<CheckCircle2 className="w-4 h-4 text-green-900" />
										:	<StepIcon
												className={`w-3.5 h-3.5 ${isCurrent ? "text-blue-700" : "text-white"}`}
											/>
										}
									</div>
									<div>
										<p className="text-white text-sm font-medium">{s.title}</p>
										{isCurrent && (
											<p className="text-blue-200 text-xs">{s.description}</p>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Developer Credit - Desktop Left Panel */}
				<div className="relative z-10 px-10 pb-6">
					<div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/20">
						<div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
						<p className="text-xs text-white/70">
							Developed by{" "}
							<span className="font-bold text-white">Rihad Jahan Opu</span>
						</p>
					</div>
				</div>
			</div>

			{/* ─── Right Panel ─── */}
			<div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
				{/* Mobile header */}
				<div className="lg:hidden flex items-center justify-between px-6 py-4 border-b bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
					<div className="flex items-center space-x-2">
						<div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-0.5 border border-slate-200">
							<Image
								src="/bangladesh-anjumane-talamije-islamia-seeklogo.png"
								alt="Logo"
								width={32}
								height={32}
								className="w-full h-full object-contain"
							/>
						</div>
						<span className="font-bold text-sm text-slate-900 dark:text-white leading-tight max-w-37.5">
							Bangladesh Anjumane Talamije Islamia Chhatak Uttar Upazila
						</span>
					</div>
					<Badge variant="secondary">
						Step {step + 1} of {STEPS.length}
					</Badge>
				</div>

				{/* Progress bar */}
				<div className="w-full h-1 bg-slate-200 dark:bg-slate-800">
					<motion.div
						className="h-full bg-blue-600"
						animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
						transition={{ duration: 0.4, ease: "easeInOut" }}
					/>
				</div>

				{/* Form area — scrollable */}
				<div className="flex-1 overflow-y-auto">
					<div className="min-h-full flex flex-col justify-center p-5 sm:p-8 md:p-10 max-w-xl mx-auto w-full py-6 space-y-6">
						{/* Event Cover Image */}
						{coverUrl && (
							<div className="rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
								<Image
									src={coverUrl}
									alt="Event Cover"
									width={800}
									height={400}
									className="w-full h-auto max-h-60 object-contain mx-auto"
								/>
							</div>
						)}

						{/* Event Header Card (if event details are set) */}
						{(eventDetails.eventName || eventDetails.eventAddress || eventDetails.eventDate || eventDetails.organiserContact) && (
							<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
								{eventDetails.eventName && (
									<h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
										{eventDetails.eventName}
									</h2>
								)}

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
									{eventDetails.eventAddress && (
										<div className="flex items-center space-x-2">
											<MapPin className="w-4 h-4 text-blue-500 shrink-0" />
											<span>{eventDetails.eventAddress}</span>
										</div>
									)}

									{(eventDetails.eventDate || eventDetails.eventStartTime) && (
										<div className="flex items-center space-x-2">
											<Calendar className="w-4 h-4 text-blue-500 shrink-0" />
											<span>
												{eventDetails.eventDate}{" "}
												{eventDetails.eventStartTime ? `@ ${eventDetails.eventStartTime}` : ""}
											</span>
										</div>
									)}

									{eventDetails.organiserContact && (
										<div className="flex items-center space-x-2 sm:col-span-2">
											<Phone className="w-4 h-4 text-blue-500 shrink-0" />
											<span>Organiser: <strong className="text-slate-800 dark:text-slate-200">{eventDetails.organiserContact}</strong></span>
										</div>
									)}
								</div>
							</div>
						)}

						{/* Fancy Live Countdown Timer */}
						{eventDetails.eventDate && eventDetails.showCountdown !== false && !isCutoffClosed && (
							<CountdownTimer
								eventDate={eventDetails.eventDate}
								eventStartTime={eventDetails.eventStartTime || "00:00"}
								onAutoClose={() => setIsCutoffClosed(true)}
							/>
						)}

						{isLoadingSettings ? (
							<div className="flex flex-col items-center justify-center py-20 text-slate-500">
								<Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
								<p>Loading form...</p>
							</div>
						) : !isRegistrationOpen || isCutoffClosed ? (
							<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center shadow-sm">
								<div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
									<Heart className="w-8 h-8" />
								</div>
								<h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
									{isCutoffClosed ? "Registration Closed (Event Starting Soon)" : "Registration Closed"}
								</h2>
								<p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto">
									{isCutoffClosed
										? "Registration automatically closed 30 minutes before event start time or event is ongoing."
										: "There are currently no active registrations running. Please check back later or contact the organizers."}
								</p>
							</div>
						) : (
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-6 w-full">
									<AnimatePresence
										mode="wait"
										custom={direction}>
										<motion.div
											key={step}
											custom={direction}
											variants={slideVariants}
											initial="enter"
											animate="center"
											exit="exit"
											transition={{ duration: 0.3, ease: "easeInOut" }}
											className="space-y-6">
											{/* Step header */}
											<div className="space-y-1">
												<div className="flex items-center space-x-2 mb-1">
													{(() => {
														// eslint-disable-next-line @typescript-eslint/typedef
														const Icon = currentStep.icon;
														return <Icon className="w-5 h-5 text-blue-600" />;
													})()}
													<span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
														Step {step + 1} of {STEPS.length}
													</span>
												</div>
												<h2 className="text-2xl font-bold text-slate-900 dark:text-white">
													{currentStep.title}
												</h2>
												<p className="text-slate-500 dark:text-slate-400 text-sm">
													{currentStep.description}
												</p>
											</div>

											{/* ── Step 1: Personal ── */}
											{step === 0 && (
												<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
													{fieldConfig.fullName?.enabled !== false && (
													<FormField
														control={form.control}
														name="fullName"
														render={({ field }) => (
															<FormItem className="sm:col-span-2">
																<FormLabel>
																	Full Name{" "}
																	{fieldConfig.fullName?.required ? (
																		<span className="text-red-500">*</span>
																	) : (
																		<span className="text-slate-400 text-xs">(Optional)</span>
																	)}
																</FormLabel>
																<FormControl>
																	<Input
																		placeholder="John Doe"
																		className="h-11"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													)}

													{fieldConfig.mobile?.enabled !== false && (
													<FormField
														control={form.control}
														name="mobile"
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	Mobile{" "}
																	{fieldConfig.mobile?.required ? (
																		<span className="text-red-500">*</span>
																	) : (
																		<span className="text-slate-400 text-xs">(Optional)</span>
																	)}
																</FormLabel>
																<FormControl>
																	<div className="relative">
																		<Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
																		<Input
																			placeholder="01XXXXXXXXX"
																			className="pl-9 h-11"
																			{...field}
																		/>
																	</div>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													)}

													{fieldConfig.email?.enabled !== false && (
													<FormField
														control={form.control}
														name="email"
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	Email{" "}
																	{fieldConfig.email?.required ? (
																		<span className="text-red-500">*</span>
																	) : (
																		<span className="text-slate-400 text-xs">(Optional)</span>
																	)}
																</FormLabel>
																<FormControl>
																	<div className="relative">
																		<Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
																		<Input
																			type="email"
																			placeholder="you@example.com"
																			className="pl-9 h-11"
																			{...field}
																		/>
																	</div>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													)}

													{fieldConfig.gender?.enabled !== false && (
													<FormField
														control={form.control}
														name="gender"
														render={({ field }) => (
															<FormItem className="sm:col-span-2">
																<FormLabel>
																	Gender{" "}
																	{fieldConfig.gender?.required ? (
																		<span className="text-red-500">*</span>
																	) : (
																		<span className="text-slate-400 text-xs">(Optional)</span>
																	)}
																</FormLabel>
																<div className="grid grid-cols-3 gap-3">
																	{["Male", "Female", "Other"].map((g) => (
																		<button
																			key={g}
																			type="button"
																			onClick={() => field.onChange(g)}
																			className={`h-11 rounded-lg border-2 text-sm font-medium transition-all ${
																				field.value === g ?
																					"border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
																				:	"border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
																			}`}>
																			{g}
																		</button>
																	))}
																</div>
																<FormMessage />
															</FormItem>
														)}
													/>
													)}
												</div>
											)}

											{/* ── Step 2: Academic ── */}
											{step === 1 && (
												<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
													{fieldConfig.schoolName?.enabled !== false && (
													<FormField
														control={form.control}
														name="schoolName"
														render={({ field }) => (
															<FormItem className="sm:col-span-2">
																<FormLabel>
																	School / College Name{" "}
																	{fieldConfig.schoolName?.required ? (
																		<span className="text-red-500">*</span>
																	) : (
																		<span className="text-slate-400 text-xs">(Optional)</span>
																	)}
																</FormLabel>
																<FormControl>
																	<Input
																		placeholder="Dhaka College"
																		className="h-11"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													)}

													{fieldConfig.class?.enabled !== false && (
													<FormField
														control={form.control}
														name="class"
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	Class{" "}
																	{fieldConfig.class?.required ? (
																		<span className="text-red-500">*</span>
																	) : (
																		<span className="text-slate-400 text-xs">(Optional)</span>
																	)}
																</FormLabel>
																<FormControl>
																	<Input
																		placeholder="XI / HSC"
																		className="h-11"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													)}

													{fieldConfig.subjectGroup?.enabled !== false && (
													<FormField
														control={form.control}
														name="subjectGroup"
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	Subject / Group{" "}
																	{fieldConfig.subjectGroup?.required ? (
																		<span className="text-red-500">*</span>
																	) : (
																		<span className="text-slate-400 text-xs">(Optional)</span>
																	)}
																</FormLabel>
																<Select
																	onValueChange={field.onChange}
																	value={field.value ?? ""}>
																	<FormControl>
																		<SelectTrigger className="h-11">
																			<SelectValue placeholder="Select group" />
																		</SelectTrigger>
																	</FormControl>
																	<SelectContent>
																		{[
																			"Science",
																			"Commerce",
																			"Arts",
																			"Other",
																		].map((g) => (
																			<SelectItem
																				key={g}
																				value={g}>
																				{g}
																			</SelectItem>
																		))}
																	</SelectContent>
																</Select>
																<FormMessage />
															</FormItem>
														)}
													/>
													)}

													{fieldConfig.rollNumber?.enabled !== false && (
													<FormField
														control={form.control}
														name="rollNumber"
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	Roll Number{" "}
																	{fieldConfig.rollNumber?.required ? (
																		<span className="text-red-500">*</span>
																	) : (
																		<span className="text-slate-400 text-xs">(Optional)</span>
																	)}
																</FormLabel>
																<FormControl>
																	<Input
																		placeholder="12345"
																		className="h-11"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													)}

													{fieldConfig.regNumber?.enabled !== false && (
													<FormField
														control={form.control}
														name="regNumber"
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	Registration Number{" "}
																	{fieldConfig.regNumber?.required ? (
																		<span className="text-red-500">*</span>
																	) : (
																		<span className="text-slate-400 text-xs">(Optional)</span>
																	)}
																</FormLabel>
																<FormControl>
																	<Input
																		placeholder="REG-123456"
																		className="h-11"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													)}

													{fieldConfig.passingYear?.enabled !== false && (
													<FormField
														control={form.control}
														name="passingYear"
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	Passing Year{" "}
																	{fieldConfig.passingYear?.required ? (
																		<span className="text-red-500">*</span>
																	) : (
																		<span className="text-slate-400 text-xs">(Optional)</span>
																	)}
																</FormLabel>
																<FormControl>
																	<Input
																		placeholder="2025"
																		className="h-11"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													)}

													{fieldConfig.gradeGpa?.enabled !== false && (
													<FormField
														control={form.control}
														name="gradeGpa"
														render={({ field }) => (
															<FormItem className="sm:col-span-2">
																<FormLabel>
																	Grade / GPA{" "}
																	{fieldConfig.gradeGpa?.required ? (
																		<span className="text-red-500">*</span>
																	) : (
																		<span className="text-slate-400 text-xs">(Optional)</span>
																	)}
																</FormLabel>
																<FormControl>
																	<Input
																		placeholder="5.00 / A+"
																		className="h-11"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													)}
												</div>
											)}

											{/* ── Step 3: Location ── */}
											{step === 2 && (
												<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
													{fieldConfig.address?.enabled !== false && (
													<FormField
														control={form.control}
														name="address"
														render={({ field }) => (
															<FormItem className="sm:col-span-2">
																<FormLabel>
																	Address{" "}
																	{fieldConfig.address?.required ? (
																		<span className="text-red-500">*</span>
																	) : (
																		<span className="text-slate-400 text-xs">(Optional)</span>
																	)}
																</FormLabel>
																<FormControl>
																	<Input
																		placeholder="123 Main Street, Area"
																		className="h-11"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													)}

													{fieldConfig.district?.enabled !== false && (
													<FormField
														control={form.control}
														name="district"
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	District{" "}
																	{fieldConfig.district?.required ? (
																		<span className="text-red-500">*</span>
																	) : (
																		<span className="text-slate-400 text-xs">(Optional)</span>
																	)}
																</FormLabel>
																<FormControl>
																	<Input
																		placeholder="Dhaka"
																		className="h-11"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													)}

													{fieldConfig.bloodGroup?.enabled !== false && (
													<FormField
														control={form.control}
														name="bloodGroup"
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	Blood Group{" "}
																	{fieldConfig.bloodGroup?.required ? (
																		<span className="text-red-500">*</span>
																	) : (
																		<span className="text-slate-400 text-xs">(Optional)</span>
																	)}
																</FormLabel>
																<Select
																	onValueChange={field.onChange}
																	value={field.value ?? ""}>
																	<FormControl>
																		<SelectTrigger className="h-11">
																			<SelectValue placeholder="Select" />
																		</SelectTrigger>
																	</FormControl>
																	<SelectContent>
																		{[
																			"A+",
																			"A-",
																			"B+",
																			"B-",
																			"AB+",
																			"AB-",
																			"O+",
																			"O-",
																		].map((bg) => (
																			<SelectItem
																				key={bg}
																				value={bg}>
																				{bg}
																			</SelectItem>
																		))}
																	</SelectContent>
																</Select>
																<FormMessage />
															</FormItem>
														)}
													/>
													)}

													{fieldConfig.fatherName?.enabled !== false && (
													<FormField
														control={form.control}
														name="fatherName"
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	Father&apos;s Name{" "}
																	{fieldConfig.fatherName?.required ? (
																		<span className="text-red-500">*</span>
																	) : (
																		<span className="text-slate-400 text-xs">(Optional)</span>
																	)}
																</FormLabel>
																<FormControl>
																	<Input
																		placeholder="Father's full name"
																		className="h-11"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													)}

													{fieldConfig.emergencyContact?.enabled !== false && (
													<FormField
														control={form.control}
														name="emergencyContact"
														render={({ field }) => (
															<FormItem>
																<FormLabel>
																	Emergency Contact{" "}
																	{fieldConfig.emergencyContact?.required ? (
																		<span className="text-red-500">*</span>
																	) : (
																		<span className="text-slate-400 text-xs">(Optional)</span>
																	)}
																</FormLabel>
																<FormControl>
																	<div className="relative">
																		<Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
																		<Input
																			placeholder="01XXXXXXXXX"
																			className="pl-9 h-11"
																			{...field}
																		/>
																	</div>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													)}
												</div>
											)}
										</motion.div>
									</AnimatePresence>

									{/* Navigation buttons */}
									<div className="flex items-center justify-between pt-2">
										{step > 0 ?
											<Button
												type="button"
												variant="outline"
												onClick={handleBack}
												className="h-11 px-5">
												<ArrowLeft className="mr-2 h-4 w-4" />
												Back
											</Button>
										:	<div />}

										{isLastStep ?
											<Button
												type="submit"
												className="h-11 px-8 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25"
												disabled={isSubmitting}>
												{isSubmitting ?
													<>
														<Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
														Submitting...
													</>
												:	<>
														<CheckCircle2 className="mr-2 h-4 w-4" /> Complete
														Registration
													</>
												}
											</Button>
										:	<Button
												type="button"
												onClick={handleNext}
												className="h-11 px-8 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25">
												Next Step
												<ArrowRight className="ml-2 h-4 w-4" />
											</Button>
										}
									</div>
								</form>
							</Form>
						)}
					</div>
				</div>

				{/* Developer Credit */}
				<div className="lg:hidden flex items-center justify-center py-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
					<p className="text-xs text-slate-400">
						Developed by{" "}
						<span className="font-semibold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
							Rihad Jahan Opu
						</span>
					</p>
				</div>
			</div>
		</div>
	);
}
