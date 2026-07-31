/* eslint-disable */
"use client";

import CountdownTimer from "@/components/CountdownTimer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DEFAULT_FIELD_CONFIG, normaliseFieldConfig, type FieldConfig, type FieldSetting } from "@/lib/fieldConfig";
import axios from "axios";
import {
	ArrowLeft,
	Calendar,
	Clock,
	Eye,
	EyeOff,
	ImageIcon,
	Info,
	Layers,
	Loader2,
	MapPin,
	Save,
	Sparkles,
	Upload,
	X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateEventPage() {
	const router = useRouter();
	const [saving, setSaving] = useState(false);

	// Form State
	const [title, setTitle] = useState("");
	const [slug, setSlug] = useState("");
	const [description, setDescription] = useState("");
	const [eventDate, setEventDate] = useState("");
	const [eventStartTime, setEventStartTime] = useState("");
	const [venue, setVenue] = useState("");
	const [showCountdown, setShowCountdown] = useState(true);
	const [status, setStatus] = useState("Upcoming");
	const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
	const [isFeatured, setIsFeatured] = useState(false);

	// Banner Upload & Preview
	const [bannerFile, setBannerFile] = useState<File | null>(null);
	const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(null);

	// Form Field Config Toggles with Enable & Required support
	const [fieldConfig, setFieldConfig] = useState<FieldConfig>(DEFAULT_FIELD_CONFIG);

	const handleTitleChange = (val: string) => {
		setTitle(val);
		if (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, "-")) {
			setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
		}
	};

	const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setBannerFile(file);
			setBannerPreviewUrl(URL.createObjectURL(file));
		}
	};

	const removeBanner = () => {
		setBannerFile(null);
		setBannerPreviewUrl(null);
	};

	const toggleFieldEnabled = (fieldKey: keyof FieldConfig) => {
		setFieldConfig((prev) => ({
			...prev,
			[fieldKey]: {
				...prev[fieldKey],
				enabled: !prev[fieldKey].enabled,
			},
		}));
	};

	const toggleFieldRequired = (fieldKey: keyof FieldConfig) => {
		setFieldConfig((prev) => ({
			...prev,
			[fieldKey]: {
				...prev[fieldKey],
				required: !prev[fieldKey].required,
			},
		}));
	};

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim()) {
			toast.error("Please provide an Event Title");
			return;
		}

		setSaving(true);
		try {
			const formData = new FormData();
			const eventPayload = {
				title,
				slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
				description,
				eventDate,
				eventStartTime,
				venue,
				showCountdown,
				status,
				isRegistrationOpen,
				isFeatured,
				fieldConfig,
			};

			formData.append("data", JSON.stringify(eventPayload));
			if (bannerFile) {
				formData.append("banner", bannerFile);
			}

			const res = await axios.post("/api/admin/events", formData);
			if (res.data.success) {
				toast.success("Event created successfully!");
				router.push("/admin/events");
			} else {
				toast.error(res.data.error || "Failed to create event");
			}
		} catch (error: any) {
			toast.error(error.response?.data?.error || "Failed to create event");
		} finally {
			setSaving(false);
		}
	};

	const fieldGroups = [
		{
			section: "Personal Details",
			fields: [
				{ name: "fullName", label: "Full Name" },
				{ name: "mobile", label: "Mobile Number" },
				{ name: "email", label: "Email Address" },
				{ name: "gender", label: "Gender" },
				{ name: "dob", label: "Date of Birth" },
			],
		},
		{
			section: "Academic Info",
			fields: [
				{ name: "schoolName", label: "School / College Name" },
				{ name: "class", label: "Class" },
				{ name: "subjectGroup", label: "Subject / Group" },
				{ name: "rollNumber", label: "Roll Number" },
				{ name: "regNumber", label: "Registration Number" },
				{ name: "passingYear", label: "Passing Year" },
				{ name: "gradeGpa", label: "GPA / Grade" },
			],
		},
		{
			section: "Location & Extra Info",
			fields: [
				{ name: "address", label: "Address" },
				{ name: "district", label: "District" },
				{ name: "bloodGroup", label: "Blood Group" },
				{ name: "fatherName", label: "Father's Name" },
				{ name: "emergencyContact", label: "Emergency Contact" },
			],
		},
	];

	return (
		<div className="space-y-6 max-w-6xl mx-auto pb-16">
			{/* Top Bar Navigation */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
				<div className="flex items-center gap-3">
					<Link
						href="/admin/events"
						className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors">
						<ArrowLeft className="w-5 h-5" />
					</Link>
					<div>
						<div className="flex items-center gap-2">
							<h1 className="text-2xl font-bold text-white tracking-tight">Create New Event</h1>
							<Badge className="bg-violet-600/20 text-violet-300 border border-violet-500/30">
								New Event
							</Badge>
						</div>
						<p className="text-xs text-slate-400 mt-0.5">
							Configure event details, banner image, registration rules, and form fields.
						</p>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<Button
						type="button"
						variant="outline"
						onClick={() => router.push("/admin/events")}
						className="border-white/10 text-slate-300 hover:bg-white/5 h-10 px-4">
						Cancel
					</Button>
					<Button
						onClick={handleSave}
						disabled={saving}
						className="bg-violet-600 hover:bg-violet-700 text-white font-medium h-10 px-6 shadow-lg shadow-violet-600/30">
						{saving ? (
							<>
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								Publishing...
							</>
						) : (
							<>
								<Save className="w-4 h-4 mr-2" />
								Create Event
							</>
						)}
					</Button>
				</div>
			</div>

			{/* Content Layout */}
			<form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left 2 Columns: Main Details */}
				<div className="lg:col-span-2 space-y-6">
					{/* Basic Information Card */}
					<Card className="bg-[#0f0f1c] border-white/10 text-white shadow-xl">
						<CardHeader className="border-b border-white/5 pb-4">
							<CardTitle className="text-base font-bold flex items-center gap-2 text-violet-300">
								<Info className="w-4 h-4 text-violet-400" />
								Basic Event Details
							</CardTitle>
							<CardDescription className="text-slate-400 text-xs">
								Set title, URL slug, status, and description for the event.
							</CardDescription>
						</CardHeader>
						<CardContent className="p-6 space-y-4">
							<div className="space-y-1.5">
								<Label className="text-xs font-semibold text-slate-200">
									Event Title <span className="text-red-400">*</span>
								</Label>
								<Input
									value={title}
									onChange={(e) => handleTitleChange(e.target.value)}
									placeholder="e.g. বার্ষিক মেধা অন্বেষণ পরীক্ষা ২০২৬"
									className="bg-white/5 border-white/10 text-white text-sm focus:border-violet-500 h-11"
									required
								/>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="space-y-1.5">
									<Label className="text-xs font-semibold text-slate-200">
										URL Slug (e.g. medha-onneshon-2026)
									</Label>
									<Input
										value={slug}
										onChange={(e) => setSlug(e.target.value)}
										placeholder="auto-generated-slug"
										className="bg-white/5 border-white/10 text-white text-xs font-mono h-10"
									/>
								</div>

								<div className="space-y-1.5">
									<Label className="text-xs font-semibold text-slate-200">Event Status</Label>
									<Select value={status} onValueChange={(val) => val && setStatus(val)}>
										<SelectTrigger className="bg-white/5 border-white/10 text-white text-xs h-10">
											<SelectValue />
										</SelectTrigger>
										<SelectContent className="bg-[#18182c] border-white/10 text-white">
											<SelectItem value="Upcoming">Upcoming</SelectItem>
											<SelectItem value="Ongoing">Ongoing</SelectItem>
											<SelectItem value="Completed">Completed</SelectItem>
											<SelectItem value="Draft">Draft</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="space-y-1.5">
								<Label className="text-xs font-semibold text-slate-200">Event Description &amp; Instructions</Label>
								<textarea
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									placeholder="Provide full event rules, eligibility criteria, guidelines, and instructions..."
									rows={4}
									className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 leading-relaxed"
								/>
							</div>
						</CardContent>
					</Card>

					{/* Date, Time & Venue Card */}
					<Card className="bg-[#0f0f1c] border-white/10 text-white shadow-xl">
						<CardHeader className="border-b border-white/5 pb-4">
							<CardTitle className="text-base font-bold flex items-center gap-2 text-indigo-300">
								<Calendar className="w-4 h-4 text-indigo-400" />
								Date, Time &amp; Location
							</CardTitle>
							<CardDescription className="text-slate-400 text-xs">
								Schedule details shown on public registration forms and participant tickets.
							</CardDescription>
						</CardHeader>
						<CardContent className="p-6 space-y-4">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{/* Date Picker */}
								<div className="space-y-1.5">
									<Label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
										<Calendar className="w-3.5 h-3.5 text-indigo-400" /> Event Date
									</Label>
									<div className="relative">
										<Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 pointer-events-none z-10" />
										<input
											type="date"
											value={eventDate}
											onChange={(e) => setEventDate(e.target.value)}
											className="w-full h-10 pl-9 pr-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors [color-scheme:dark] cursor-pointer hover:bg-white/8"
										/>
									</div>
									{eventDate && (
										<p className="text-[10px] text-indigo-300 mt-1 flex items-center gap-1">
											<Calendar className="w-3 h-3" />
											{new Date(eventDate + 'T00:00:00').toLocaleDateString('en-BD', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
										</p>
									)}
								</div>

								{/* Time Picker */}
								<div className="space-y-1.5">
									<Label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
										<Clock className="w-3.5 h-3.5 text-indigo-400" /> Event Start Time
									</Label>
									<div className="relative">
										<Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 pointer-events-none z-10" />
										<input
											type="time"
											value={eventStartTime}
											onChange={(e) => setEventStartTime(e.target.value)}
											className="w-full h-10 pl-9 pr-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors [color-scheme:dark] cursor-pointer hover:bg-white/8"
										/>
									</div>
									{eventStartTime && (
										<p className="text-[10px] text-indigo-300 mt-1 flex items-center gap-1">
											<Clock className="w-3 h-3" />
											{new Date('1970-01-01T' + eventStartTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
										</p>
									)}
								</div>
							</div>

							<div className="space-y-1.5">
								<Label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
									<MapPin className="w-3.5 h-3.5 text-indigo-400" /> Venue / Location Address
								</Label>
								<Input
									value={venue}
									onChange={(e) => setVenue(e.target.value)}
									placeholder="e.g. Chhatak Model High School Auditorium, Sunamganj"
									className="bg-white/5 border-white/10 text-white text-xs h-10"
								/>
							</div>

							{/* Countdown Timer Toggle & Live Preview */}
							<div className="pt-2 border-t border-white/10 space-y-4">
								<div className="flex items-center justify-between p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
									<div className="space-y-0.5">
										<Label className="text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer">
											<Clock className="w-3.5 h-3.5 text-indigo-400" /> Show Live Countdown Clock
										</Label>
										<p className="text-[11px] text-slate-400">
											Display an animated live countdown clock on the public event registration page.
										</p>
									</div>
									<Switch
										checked={showCountdown}
										onCheckedChange={setShowCountdown}
									/>
								</div>

								{showCountdown && eventDate && (
									<div className="space-y-2">
										<Label className="text-[11px] font-medium text-indigo-300 uppercase tracking-wider block">
											Live Countdown Preview
										</Label>
										<CountdownTimer eventDate={eventDate} eventStartTime={eventStartTime || "00:00"} />
									</div>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Event Banner Upload & Preview */}
					<Card className="bg-[#0f0f1c] border-white/10 text-white shadow-xl">
						<CardHeader className="border-b border-white/5 pb-4">
							<CardTitle className="text-base font-bold flex items-center gap-2 text-pink-300">
								<ImageIcon className="w-4 h-4 text-pink-400" />
								Event Cover Banner
							</CardTitle>
							<CardDescription className="text-slate-400 text-xs">
								Upload a header banner image to be displayed at the top of the event page and registration form.
							</CardDescription>
						</CardHeader>
						<CardContent className="p-6">
							{bannerPreviewUrl ? (
								<div className="relative rounded-2xl overflow-hidden border border-white/15 bg-slate-900 group">
									<img
										src={bannerPreviewUrl}
										alt="Banner Preview"
										className="w-full h-56 object-cover"
									/>
									<div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
										<label className="cursor-pointer bg-white/20 hover:bg-white/30 text-white font-medium px-4 py-2 rounded-xl text-xs backdrop-blur-md transition-all">
											Replace Image
											<input
												type="file"
												accept="image/*"
												onChange={handleBannerSelect}
												className="hidden"
											/>
										</label>
										<Button
											type="button"
											variant="destructive"
											size="sm"
											onClick={removeBanner}
											className="h-8 text-xs">
											<X className="w-4 h-4 mr-1" />
											Remove
										</Button>
									</div>
								</div>
							) : (
								<label className="border-2 border-dashed border-white/15 hover:border-violet-500 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer bg-white/3 hover:bg-violet-500/5 transition-all group">
									<div className="p-4 rounded-2xl bg-white/5 text-slate-400 group-hover:text-violet-400 group-hover:bg-violet-500/10 transition-colors">
										<Upload className="w-8 h-8" />
									</div>
									<div className="text-center">
										<p className="text-xs font-semibold text-slate-200">
											Click or drag image to upload Event Banner
										</p>
										<p className="text-[11px] text-slate-400 mt-1">
											PNG, JPG, WEBP recommended • Max 10MB
										</p>
									</div>
									<input
										type="file"
										accept="image/*"
										onChange={handleBannerSelect}
										className="hidden"
									/>
								</label>
							)}
						</CardContent>
					</Card>

					{/* Form Field Configuration with Enable & Required Toggles */}
					<Card className="bg-[#0f0f1c] border-white/10 text-white shadow-xl">
						<CardHeader className="border-b border-white/5 pb-4">
							<CardTitle className="text-base font-bold flex items-center gap-2 text-emerald-300">
								<Layers className="w-4 h-4 text-emerald-400" />
								Registration Form Fields Configuration
							</CardTitle>
							<CardDescription className="text-slate-400 text-xs">
								Set <strong>Enable</strong> (show/hide field) and <strong>Required</strong> (mandatory/optional) toggles for each participant field.
							</CardDescription>
						</CardHeader>
						<CardContent className="p-6 space-y-6">
							{fieldGroups.map((group) => (
								<div key={group.section} className="space-y-3">
									<h3 className="text-xs font-bold uppercase tracking-wider text-violet-400 border-b border-white/5 pb-1">
										{group.section}
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
										{group.fields.map((field) => {
											const fieldKey = field.name as keyof FieldConfig;
											const cfg: FieldSetting = fieldConfig[fieldKey] || {
												required: false,
												enabled: true,
											};
											return (
												<div
													key={field.name}
													className={`rounded-xl border p-3.5 transition-all ${
														cfg.enabled
															? "border-white/10 bg-[#121222]"
															: "border-white/5 bg-white/2 opacity-60"
													}`}>
													{/* Field Header + Badges */}
													<div className="flex items-center justify-between gap-2 mb-3">
														<div className="flex items-center gap-2">
															{cfg.enabled ? (
																<Eye className="w-3.5 h-3.5 text-blue-400 shrink-0" />
															) : (
																<EyeOff className="w-3.5 h-3.5 text-slate-500 shrink-0" />
															)}
															<span
																className={`text-xs font-bold ${
																	cfg.enabled ? "text-white" : "text-slate-400"
																}`}>
																{field.label}
															</span>
														</div>
														<div>
															{!cfg.enabled ? (
																<span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
																	Hidden
																</span>
															) : cfg.required ? (
																<span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
																	Required
																</span>
															) : (
																<span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
																	Optional
																</span>
															)}
														</div>
													</div>

													{/* Dual Toggles: Enable & Required */}
													<div className="flex items-center justify-between gap-3 pt-2 border-t border-white/5 text-xs">
														{/* Enable toggle */}
														<div className="flex items-center gap-2">
															<button
																type="button"
																onClick={() => toggleFieldEnabled(fieldKey)}
																className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
																	cfg.enabled ? "bg-violet-600" : "bg-white/10"
																}`}>
																<span
																	className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
																		cfg.enabled ? "translate-x-4.5" : "translate-x-1"
																	}`}
																/>
															</button>
															<span className="text-[11px] text-slate-400">
																{cfg.enabled ? "Enabled" : "Disabled"}
															</span>
														</div>

														{/* Required toggle */}
														<div
															className={`flex items-center gap-2 ${
																!cfg.enabled ? "opacity-30 pointer-events-none" : ""
															}`}>
															<button
																type="button"
																onClick={() => toggleFieldRequired(fieldKey)}
																disabled={!cfg.enabled}
																className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
																	cfg.required ? "bg-amber-500" : "bg-white/10"
																}`}>
																<span
																	className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
																		cfg.required ? "translate-x-4.5" : "translate-x-1"
																	}`}
																/>
															</button>
															<span className="text-[11px] text-slate-400">
																{cfg.required ? "Required" : "Optional"}
															</span>
														</div>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							))}
						</CardContent>
					</Card>
				</div>

				{/* Right 1 Column: Sidebar & Actions */}
				<div className="space-y-6">
					{/* Status & Visibility Card */}
					<Card className="bg-[#0f0f1c] border-white/10 text-white shadow-xl">
						<CardHeader className="border-b border-white/5 pb-4">
							<CardTitle className="text-sm font-bold text-slate-200">
								Publishing &amp; Controls
							</CardTitle>
						</CardHeader>
						<CardContent className="p-5 space-y-4">
							<div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
								<div className="space-y-0.5">
									<p className="text-xs font-semibold text-white">Registration Open</p>
									<p className="text-[10px] text-slate-400">Allow participants to register</p>
								</div>
								<Switch
									checked={isRegistrationOpen}
									onCheckedChange={setIsRegistrationOpen}
								/>
							</div>

							<div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
								<div className="space-y-0.5">
									<p className="text-xs font-semibold text-amber-300">Featured Event</p>
									<p className="text-[10px] text-slate-400">Display on Homepage Hero</p>
								</div>
								<Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
							</div>
						</CardContent>
					</Card>

					{/* Live Card Preview */}
					<Card className="bg-[#0f0f1c] border-white/10 text-white shadow-xl overflow-hidden">
						<CardHeader className="border-b border-white/5 pb-3">
							<CardTitle className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
								<Sparkles className="w-3.5 h-3.5" /> Live Card Preview
							</CardTitle>
						</CardHeader>
						<div className="p-4 bg-slate-950/50">
							<div className="bg-[#121225] rounded-xl border border-white/10 overflow-hidden shadow-lg">
								<div className="relative h-32 bg-slate-900">
									{bannerPreviewUrl ? (
										<img src={bannerPreviewUrl} alt="Preview" className="w-full h-full object-cover" />
									) : (
										<div className="w-full h-full flex items-center justify-center bg-violet-900/20 text-violet-400">
											<Calendar className="w-8 h-8 opacity-40" />
										</div>
									)}
									<Badge className="absolute top-2 right-2 text-[10px] bg-violet-600 text-white">
										{status}
									</Badge>
								</div>
								<div className="p-3.5 space-y-2">
									<h4 className="text-sm font-bold text-white line-clamp-1">
										{title || "Event Title"}
									</h4>
									<p className="text-[11px] text-slate-400 line-clamp-2">
										{description || "Event description will appear here."}
									</p>
									<div className="pt-2 border-t border-white/5 text-[11px] text-slate-300 space-y-1">
										{eventDate && (
											<div className="flex items-center gap-1.5">
												<Calendar className="w-3 h-3 text-violet-400" />
												<span>{eventDate}</span>
											</div>
										)}
										{venue && (
											<div className="flex items-center gap-1.5">
												<MapPin className="w-3 h-3 text-indigo-400" />
												<span className="truncate">{venue}</span>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</Card>

					{/* Action Buttons */}
					<div className="space-y-3 pt-2">
						<Button
							type="submit"
							disabled={saving}
							className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium h-11 rounded-xl shadow-lg shadow-violet-600/30">
							{saving ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Saving Event...
								</>
							) : (
								<>
									<Save className="w-4 h-4 mr-2" />
									Publish Event
								</>
							)}
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={() => router.push("/admin/events")}
							className="w-full border-white/10 text-slate-300 hover:bg-white/5 h-10 rounded-xl">
							Cancel &amp; Go Back
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
}
