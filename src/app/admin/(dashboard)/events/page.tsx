/* eslint-disable */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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
import axios from "axios";
import {
	Calendar,
	Clock,
	Edit2,
	Eye,
	Globe,
	Loader2,
	MapPin,
	Plus,
	Sparkles,
	Trash2,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminEventsPage() {
	const [events, setEvents] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	// Modal states
	const [modalOpen, setModalOpen] = useState(false);
	const [editingEvent, setEditingEvent] = useState<any>(null);
	const [saving, setSaving] = useState(false);

	// Form State
	const [title, setTitle] = useState("");
	const [slug, setSlug] = useState("");
	const [description, setDescription] = useState("");
	const [eventDate, setEventDate] = useState("");
	const [eventStartTime, setEventStartTime] = useState("");
	const [venue, setVenue] = useState("");
	const [status, setStatus] = useState("Upcoming");
	const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
	const [isFeatured, setIsFeatured] = useState(false);
	const [bannerFile, setBannerFile] = useState<File | null>(null);

	// Field Config Toggles
	const [fieldConfig, setFieldConfig] = useState<any>({
		email: true,
		dob: false,
		fatherName: true,
		motherName: false,
		rollNumber: false,
		regNumber: false,
		bloodGroup: false,
		emergencyContact: true,
		passingYear: false,
		gradeGpa: false,
		gender: true,
		address: true,
		district: true,
		schoolName: true,
		class: true,
		subjectGroup: true,
	});

	const fetchEvents = async () => {
		setLoading(true);
		try {
			const res = await axios.get("/api/admin/events");
			if (res.data.success) {
				setEvents(res.data.data);
			}
		} catch (error: any) {
			toast.error(error.response?.data?.error || "Failed to load events");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchEvents();
	}, []);

	const openCreateModal = () => {
		setEditingEvent(null);
		setTitle("");
		setSlug("");
		setDescription("");
		setEventDate("");
		setEventStartTime("");
		setVenue("");
		setStatus("Upcoming");
		setIsRegistrationOpen(true);
		setIsFeatured(false);
		setBannerFile(null);
		setFieldConfig({
			email: true,
			dob: false,
			fatherName: true,
			motherName: false,
			rollNumber: false,
			regNumber: false,
			bloodGroup: false,
			emergencyContact: true,
			passingYear: false,
			gradeGpa: false,
			gender: true,
			address: true,
			district: true,
			schoolName: true,
			class: true,
			subjectGroup: true,
		});
		setModalOpen(true);
	};

	const openEditModal = (ev: any) => {
		setEditingEvent(ev);
		setTitle(ev.title || "");
		setSlug(ev.slug || "");
		setDescription(ev.description || "");
		setEventDate(ev.eventDate || "");
		setEventStartTime(ev.eventStartTime || "");
		setVenue(ev.venue || "");
		setStatus(ev.status || "Upcoming");
		setIsRegistrationOpen(ev.isRegistrationOpen ?? true);
		setIsFeatured(ev.isFeatured ?? false);
		setBannerFile(null);
		setFieldConfig({
			email: true,
			dob: false,
			fatherName: true,
			motherName: false,
			rollNumber: false,
			regNumber: false,
			bloodGroup: false,
			emergencyContact: true,
			passingYear: false,
			gradeGpa: false,
			gender: true,
			address: true,
			district: true,
			schoolName: true,
			class: true,
			subjectGroup: true,
			...(ev.fieldConfig || {}),
		});
		setModalOpen(true);
	};

	const handleSaveEvent = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim()) {
			toast.error("Event title is required");
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
				status,
				isRegistrationOpen,
				isFeatured,
				fieldConfig,
			};

			formData.append("data", JSON.stringify(eventPayload));
			if (bannerFile) {
				formData.append("banner", bannerFile);
			}

			if (editingEvent) {
				const res = await axios.put(`/api/admin/events/${editingEvent._id}`, formData);
				if (res.data.success) {
					toast.success("Event updated successfully!");
					setModalOpen(false);
					fetchEvents();
				}
			} else {
				const res = await axios.post("/api/admin/events", formData);
				if (res.data.success) {
					toast.success("Event created successfully!");
					setModalOpen(false);
					fetchEvents();
				}
			}
		} catch (error: any) {
			toast.error(error.response?.data?.error || "Failed to save event");
		} finally {
			setSaving(false);
		}
	};

	const toggleRegistrationStatus = async (ev: any) => {
		try {
			const updatedStatus = !ev.isRegistrationOpen;
			const res = await axios.put(`/api/admin/events/${ev._id}`, {
				data: { isRegistrationOpen: updatedStatus },
			});
			if (res.data.success) {
				toast.success(
					`Registration for ${ev.title} is now ${updatedStatus ? "OPEN" : "CLOSED"}`
				);
				fetchEvents();
			}
		} catch {
			toast.error("Failed to toggle status");
		}
	};

	const handleDeleteEvent = async (id: string, eventTitle: string) => {
		if (!confirm(`Are you sure you want to delete "${eventTitle}"?`)) return;
		try {
			const res = await axios.delete(`/api/admin/events/${id}`);
			if (res.data.success) {
				toast.success("Event deleted successfully");
				fetchEvents();
			}
		} catch {
			toast.error("Failed to delete event");
		}
	};

	const activeCount = events.filter((e) => e.isRegistrationOpen).length;
	const totalRegistrations = events.reduce((acc, curr) => acc + (curr.registrationCount || 0), 0);

	return (
		<div className="space-y-6 max-w-7xl mx-auto pb-12">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-linear-to-r from-violet-900/20 via-indigo-900/10 to-transparent p-6 rounded-2xl border border-violet-500/20">
				<div>
					<div className="flex items-center gap-2.5">
						<div className="p-2 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400">
							<Calendar className="w-6 h-6" />
						</div>
						<h1 className="text-2xl font-bold text-white tracking-tight">
							Multi-Event Management
						</h1>
					</div>
					<p className="text-sm text-slate-400 mt-1">
						Create and manage multiple concurrent events, set registration rules, and customize forms per event.
					</p>
				</div>

				<Link
					href="/admin/events/create"
					className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-violet-600/30 text-xs transition-colors">
					<Plus className="w-4 h-4 mr-1" />
					Create New Event
				</Link>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card className="bg-[#0f0f1c] border-white/10 text-white">
					<CardContent className="p-5 flex items-center justify-between">
						<div>
							<p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
								Total Events
							</p>
							<p className="text-3xl font-extrabold text-white mt-1">{events.length}</p>
						</div>
						<div className="p-3.5 rounded-2xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
							<Calendar className="w-6 h-6" />
						</div>
					</CardContent>
				</Card>

				<Card className="bg-[#0f0f1c] border-emerald-500/20 text-white">
					<CardContent className="p-5 flex items-center justify-between">
						<div>
							<p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
								Registration Open
							</p>
							<p className="text-3xl font-extrabold text-emerald-400 mt-1">{activeCount}</p>
						</div>
						<div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
							<Sparkles className="w-6 h-6" />
						</div>
					</CardContent>
				</Card>

				<Card className="bg-[#0f0f1c] border-white/10 text-white">
					<CardContent className="p-5 flex items-center justify-between">
						<div>
							<p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
								Total Registrations
							</p>
							<p className="text-3xl font-extrabold text-indigo-400 mt-1">{totalRegistrations}</p>
						</div>
						<div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
							<Users className="w-6 h-6" />
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Events Grid */}
			{loading ? (
				<div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
					<Loader2 className="w-5 h-5 animate-spin text-violet-400" />
					Loading events...
				</div>
			) : events.length === 0 ? (
				<Card className="bg-[#0f0f1c] border-white/10 text-white p-12 text-center">
					<Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
					<h3 className="text-lg font-bold">No Events Found</h3>
					<p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
						Click the "Create New Event" button above to add your first event.
					</p>
				</Card>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{events.map((ev) => (
						<Card
							key={ev._id}
							className="bg-[#0f0f1c] border-white/10 text-white flex flex-col overflow-hidden group hover:border-violet-500/40 transition-all">
							{/* Banner Image */}
							<div className="relative h-44 bg-slate-900 overflow-hidden">
								{ev.bannerUrl ? (
									<img
										src={ev.bannerUrl}
										alt={ev.title}
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center bg-linear-to-br from-violet-900/40 to-indigo-900/30 text-violet-400">
										<Calendar className="w-12 h-12 opacity-50" />
									</div>
								)}

								<div className="absolute top-3 right-3 flex items-center gap-2">
									{ev.isFeatured && (
										<Badge className="bg-amber-500/80 text-black font-bold text-[10px]">
											Featured
										</Badge>
									)}
									<Badge
										className={
											ev.isRegistrationOpen
												? "bg-emerald-600 text-white font-semibold"
												: "bg-slate-800 text-slate-400 border-white/10"
										}>
										{ev.isRegistrationOpen ? "Registration Open" : "Closed"}
									</Badge>
								</div>
							</div>

							{/* Content */}
							<CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
								<div>
									<div className="flex items-center justify-between text-xs text-violet-400 font-mono mb-1">
										<span>/{ev.slug}</span>
										<Badge variant="outline" className="border-white/10 text-slate-300 text-[10px]">
											{ev.status}
										</Badge>
									</div>

									<h3 className="text-lg font-bold text-white line-clamp-1">{ev.title}</h3>

									{ev.description && (
										<p className="text-xs text-slate-400 mt-1 line-clamp-2">{ev.description}</p>
									)}

									<div className="mt-4 space-y-1.5 text-xs text-slate-300">
										{ev.eventDate && (
											<div className="flex items-center gap-2">
												<Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
												<span>{ev.eventDate}</span>
											</div>
										)}
										{ev.eventStartTime && (
											<div className="flex items-center gap-2">
												<Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
												<span>{ev.eventStartTime}</span>
											</div>
										)}
										{ev.venue && (
											<div className="flex items-center gap-2">
												<MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
												<span className="truncate">{ev.venue}</span>
											</div>
										)}
									</div>
								</div>

								{/* Bottom Controls */}
								<div className="pt-3 border-t border-white/5 space-y-3">
									<div className="flex items-center justify-between text-xs">
										<span className="text-slate-400 flex items-center gap-1.5">
											<Users className="w-3.5 h-3.5 text-indigo-400" />
											Registrations:
										</span>
										<span className="font-bold text-white bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
											{ev.registrationCount || 0}
										</span>
									</div>

									<div className="flex items-center justify-between gap-2 pt-1">
										<div className="flex items-center gap-2">
											<Switch
												checked={ev.isRegistrationOpen}
												onCheckedChange={() => toggleRegistrationStatus(ev)}
											/>
											<span className="text-[11px] text-slate-400">Reg Toggle</span>
										</div>

										<div className="flex items-center gap-1">
											<Link
												href={`/event-form?event=${ev.slug}`}
												target="_blank"
												className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white"
												title="Preview Registration Form">
												<Globe className="w-4 h-4" />
											</Link>

											<Link
												href={`/admin/events/${ev._id}/edit`}
												className="p-1.5 rounded-lg border border-white/10 hover:bg-violet-500/20 text-violet-400 hover:text-violet-300 transition-colors"
												title="Edit Event">
												<Edit2 className="w-4 h-4" />
											</Link>

											<Button
												size="sm"
												variant="ghost"
												onClick={() => handleDeleteEvent(ev._id, ev.title)}
												className="h-8 px-2 text-red-400 hover:text-red-300 hover:bg-red-500/10">
												<Trash2 className="w-4 h-4" />
											</Button>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{/* Create / Edit Event Dialog */}
			<Dialog open={modalOpen} onOpenChange={setModalOpen}>
				<DialogContent className="bg-[#121222] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="text-xl font-bold">
							{editingEvent ? "Edit Event" : "Create New Event"}
						</DialogTitle>
						<DialogDescription className="text-slate-400 text-xs">
							Fill in the details below to publish or update an event.
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={handleSaveEvent} className="space-y-4 py-2">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-1.5 sm:col-span-2">
								<Label className="text-xs font-semibold text-slate-300">
									Event Title <span className="text-red-400">*</span>
								</Label>
								<Input
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									placeholder="e.g. বার্ষিক মেধা অন্বেষণ পরীক্ষা ২০২৬"
									className="bg-white/5 border-white/10 text-white text-xs"
									required
								/>
							</div>

							<div className="space-y-1.5">
								<Label className="text-xs font-semibold text-slate-300">
									URL Slug (e.g. medha-onneshon-2026)
								</Label>
								<Input
									value={slug}
									onChange={(e) => setSlug(e.target.value)}
									placeholder="Auto-generated if blank"
									className="bg-white/5 border-white/10 text-white text-xs font-mono"
								/>
							</div>

							<div className="space-y-1.5">
								<Label className="text-xs font-semibold text-slate-300">Event Status</Label>
								<Select value={status} onValueChange={(val) => setStatus(val || "Upcoming")}>
									<SelectTrigger className="bg-white/5 border-white/10 text-white text-xs">
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

							<div className="space-y-1.5 sm:col-span-2">
								<Label className="text-xs font-semibold text-slate-300">Description</Label>
								<textarea
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									placeholder="Event details, eligibility, rules..."
									rows={3}
									className="w-full rounded-xl bg-white/5 border border-white/10 p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
								/>
							</div>

							<div className="space-y-1.5">
								<Label className="text-xs font-semibold text-slate-300">Event Date</Label>
								<Input
									value={eventDate}
									onChange={(e) => setEventDate(e.target.value)}
									placeholder="e.g. 15 March, 2026"
									className="bg-white/5 border-white/10 text-white text-xs"
								/>
							</div>

							<div className="space-y-1.5">
								<Label className="text-xs font-semibold text-slate-300">Start Time</Label>
								<Input
									value={eventStartTime}
									onChange={(e) => setEventStartTime(e.target.value)}
									placeholder="e.g. 10:00 AM"
									className="bg-white/5 border-white/10 text-white text-xs"
								/>
							</div>

							<div className="space-y-1.5 sm:col-span-2">
								<Label className="text-xs font-semibold text-slate-300">Venue / Location</Label>
								<Input
									value={venue}
									onChange={(e) => setVenue(e.target.value)}
									placeholder="e.g. Chhatak Model High School Auditorium"
									className="bg-white/5 border-white/10 text-white text-xs"
								/>
							</div>

							<div className="space-y-1.5 sm:col-span-2">
								<Label className="text-xs font-semibold text-slate-300">Event Banner Image</Label>
								<Input
									type="file"
									accept="image/*"
									onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
									className="bg-white/5 border-white/10 text-white text-xs"
								/>
							</div>
						</div>

						{/* Switches */}
						<div className="pt-2 border-t border-white/10 flex flex-wrap gap-6">
							<div className="flex items-center gap-2">
								<Switch
									id="regOpen"
									checked={isRegistrationOpen}
									onCheckedChange={setIsRegistrationOpen}
								/>
								<Label htmlFor="regOpen" className="text-xs cursor-pointer text-slate-200">
									Open Registration Now
								</Label>
							</div>

							<div className="flex items-center gap-2">
								<Switch id="feat" checked={isFeatured} onCheckedChange={setIsFeatured} />
								<Label htmlFor="feat" className="text-xs cursor-pointer text-slate-200">
									Featured on Homepage Hero
								</Label>
							</div>
						</div>

						{/* Custom Form Fields Config Section */}
						<div className="pt-3 border-t border-white/10">
							<h4 className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-2">
								Registration Form Fields Configuration
							</h4>
							<p className="text-[11px] text-slate-400 mb-3">
								Toggle which fields participants must enter when registering for this specific event:
							</p>

							<div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
								{Object.keys(fieldConfig).map((key) => (
									<div key={key} className="flex items-center gap-2">
										<Switch
											id={`field-${key}`}
											checked={fieldConfig[key]}
											onCheckedChange={(checked) =>
												setFieldConfig((prev: any) => ({ ...prev, [key]: checked }))
											}
										/>
										<Label
											htmlFor={`field-${key}`}
											className="text-xs capitalize cursor-pointer text-slate-300">
											{key.replace(/([A-Z])/g, " $1")}
										</Label>
									</div>
								))}
							</div>
						</div>

						<DialogFooter className="pt-4 border-t border-white/10">
							<Button
								type="button"
								variant="outline"
								onClick={() => setModalOpen(false)}
								className="border-white/10 text-slate-300">
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={saving}
								className="bg-violet-600 hover:bg-violet-700 text-white font-medium">
								{saving ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										Saving...
									</>
								) : editingEvent ? (
									"Update Event"
								) : (
									"Create Event"
								)}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
