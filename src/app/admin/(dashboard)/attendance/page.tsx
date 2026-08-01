/* eslint-disable */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { Html5Qrcode } from "html5-qrcode";
import {
	AlertCircle,
	Camera,
	CameraOff,
	CheckCircle2,
	Clock,
	Loader2,
	QrCode,
	RefreshCw,
	Search,
	UserCheck,
	UserX,
	Users,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const playSound = (type: "success" | "warning" | "error") => {
	try {
		const ctx = new (
			window.AudioContext || (window as any).webkitAudioContext
		)();
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.connect(gain);
		gain.connect(ctx.destination);

		if (type === "success") {
			osc.type = "sine";
			osc.frequency.setValueAtTime(587.33, ctx.currentTime);
			osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
			gain.gain.setValueAtTime(0.3, ctx.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
			osc.start(ctx.currentTime);
			osc.stop(ctx.currentTime + 0.3);
		} else if (type === "warning") {
			osc.type = "triangle";
			osc.frequency.setValueAtTime(440, ctx.currentTime);
			gain.gain.setValueAtTime(0.3, ctx.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
			osc.start(ctx.currentTime);
			osc.stop(ctx.currentTime + 0.35);
		} else {
			osc.type = "sawtooth";
			osc.frequency.setValueAtTime(220, ctx.currentTime);
			osc.frequency.setValueAtTime(160, ctx.currentTime + 0.15);
			gain.gain.setValueAtTime(0.4, ctx.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
			osc.start(ctx.currentTime);
			osc.stop(ctx.currentTime + 0.4);
		}
	} catch {
		/* ignore */
	}
};

export default function QrAttendancePage() {
	const [data, setData] = useState<any[]>([]);
	const [stats, setStats] = useState({
		totalPresent: 0,
		totalAbsent: 0,
		totalCount: 0,
	});
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState("All");
	const [events, setEvents] = useState<any[]>([]);
	const [selectedEventId, setSelectedEventId] = useState("all");

	const [manualCode, setManualCode] = useState("");
	const [scanningLoading, setScanningLoading] = useState(false);

	const [lastScanResult, setLastScanResult] = useState<{
		type: "success" | "warning" | "error";
		message: string;
		registration?: any;
	} | null>(null);

	const [cameraActive, setCameraActive] = useState(false);
	const [cameraStarting, setCameraStarting] = useState(false);
	const [cameraReady, setCameraReady] = useState(false);
	const html5QrcodeRef = useRef<Html5Qrcode | null>(null);

	useEffect(() => {
		axios
			.get("/api/admin/events")
			.then((res) => {
				if (res.data.success) setEvents(res.data.data);
			})
			.catch(() => {});
	}, []);

	const fetchAttendance = useCallback(async () => {
		try {
			const params: any = { search, filter };
			if (selectedEventId && selectedEventId !== "all") {
				params.eventId = selectedEventId;
			}
			const res = await axios.get("/api/admin/attendance", { params });
			if (res.data.success) {
				setData(res.data.data);
				setStats(res.data.stats);
			}
		} catch (error: any) {
			toast.error(error.response?.data?.error || "Failed to load attendance");
		} finally {
			setLoading(false);
		}
	}, [search, filter, selectedEventId]);

	useEffect(() => {
		fetchAttendance();
	}, [fetchAttendance]);

	const processCheckIn = async (code: string) => {
		if (!code || scanningLoading) return;
		setScanningLoading(true);
		try {
			const res = await axios.post("/api/admin/attendance/scan", {
				qrCode: code.trim(),
			});
			if (res.data.success) {
				playSound("success");
				setLastScanResult({
					type: "success",
					message: res.data.message || "Successfully Checked In!",
					registration: res.data.registration,
				});
				toast.success(`Check-in: ${res.data.registration.fullName}`);
				fetchAttendance();
			}
		} catch (error: any) {
			const resData = error.response?.data;
			if (resData?.alreadyCheckedIn) {
				playSound("warning");
				setLastScanResult({
					type: "warning",
					message: resData.error || "Already checked in",
					registration: resData.registration,
				});
				toast.warning(`Already present: ${resData.registration?.fullName}`);
			} else {
				playSound("error");
				setLastScanResult({
					type: "error",
					message: resData?.error || "Invalid QR code",
				});
				toast.error(resData?.error || "Invalid QR Code");
			}
		} finally {
			setScanningLoading(false);
		}
	};

	// ========== MOBILE FIX: facingMode approach ==========
	const startCamera = async () => {
		setCameraStarting(true);
		setCameraReady(true);
		await new Promise((r) => setTimeout(r, 200)); // div render time

		try {
			const html5Qr = new Html5Qrcode("reader");
			html5QrcodeRef.current = html5Qr;

			// PRIMARY: facingMode object (works on mobile)
			await html5Qr.start(
				{ facingMode: "environment" },
				{
					fps: 10,
					qrbox: { width: 250, height: 250 },
				},
				(decodedText) => processCheckIn(decodedText),
				() => {}
			);

			setCameraActive(true);
		} catch (err: any) {
			console.error("Primary camera error:", err.name, err.message);

			// FALLBACK: try with getCameras if facingMode fails
			if (html5QrcodeRef.current) {
				try {
					await html5QrcodeRef.current.stop();
				} catch {}
				html5QrcodeRef.current.clear();
				html5QrcodeRef.current = null;
			}

			try {
				const devices = await Html5Qrcode.getCameras();
				if (!devices || devices.length === 0) {
					toast.error("No camera found");
					setCameraReady(false);
					setCameraStarting(false);
					return;
				}

				const backCamera = devices.find((d) =>
					d.label.toLowerCase().includes("back")
				);
				const cameraId =
					backCamera ? backCamera.id : devices[devices.length - 1].id;

				const html5Qr = new Html5Qrcode("reader");
				html5QrcodeRef.current = html5Qr;

				await html5Qr.start(
					cameraId,
					{ fps: 10, qrbox: { width: 250, height: 250 } },
					(decodedText) => processCheckIn(decodedText),
					() => {}
				);

				setCameraActive(true);
			} catch (fallbackErr: any) {
				console.error("Fallback error:", fallbackErr);
				if (fallbackErr.name === "NotAllowedError") {
					toast.error(
						"Camera permission denied. Chrome Settings → Site Settings → Camera → Allow"
					);
				} else {
					toast.error(fallbackErr.message || "Camera failed to start");
				}
				setCameraReady(false);
			}
		} finally {
			setCameraStarting(false);
		}
	};

	const stopCamera = async () => {
		if (html5QrcodeRef.current) {
			try {
				await html5QrcodeRef.current.stop();
			} catch {}
			html5QrcodeRef.current.clear();
			html5QrcodeRef.current = null;
		}
		setCameraActive(false);
		setCameraReady(false);
	};

	useEffect(() => {
		return () => {
			if (html5QrcodeRef.current) {
				html5QrcodeRef.current.stop().catch(() => {});
				html5QrcodeRef.current.clear();
				html5QrcodeRef.current = null;
			}
		};
	}, []);

	const handleResetAttendance = async (regId: string, name: string) => {
		if (!confirm(`Mark ${name} as Absent?`)) return;
		try {
			const res = await axios.patch(`/api/admin/attendance/${regId}/reset`);
			if (res.data.success) {
				toast.success(`Marked ${name} as Absent`);
				fetchAttendance();
			}
		} catch {
			toast.error("Failed to reset");
		}
	};

	const presentPercentage =
		stats.totalCount > 0 ?
			Math.round((stats.totalPresent / stats.totalCount) * 100)
		:	0;

	return (
		<div className="space-y-6 max-w-7xl mx-auto pb-12">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-linear-to-r from-violet-900/20 via-indigo-900/10 to-transparent p-6 rounded-2xl border border-violet-500/20">
				<div>
					<div className="flex items-center gap-2.5">
						<div className="p-2 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400">
							<QrCode className="w-6 h-6" />
						</div>
						<h1 className="text-2xl font-bold text-white tracking-tight">
							QR Attendance & Check-in
						</h1>
					</div>
					<p className="text-sm text-slate-400 mt-1">
						Scan participant ticket QR codes or search manually.
					</p>
				</div>
				<Button
					variant="outline"
					onClick={() => {
						setLoading(true);
						fetchAttendance();
					}}
					className="border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300">
					<RefreshCw
						className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
					/>
					<span className="text-xs font-semibold">Refresh</span>
				</Button>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card className="bg-[#0f0f1c] border-white/10 text-white">
					<CardContent className="p-5 flex items-center justify-between">
						<div>
							<p className="text-xs font-semibold text-slate-400 uppercase">
								Total Registered
							</p>
							<p className="text-3xl font-extrabold">{stats.totalCount}</p>
						</div>
						<div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
							<Users className="w-6 h-6" />
						</div>
					</CardContent>
				</Card>
				<Card className="bg-[#0f0f1c] border-emerald-500/20 text-white relative overflow-hidden">
					<div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full" />
					<CardContent className="p-5 flex items-center justify-between">
						<div>
							<p className="text-xs font-semibold text-emerald-400 uppercase">
								Present
							</p>
							<div className="flex items-baseline gap-2">
								<p className="text-3xl font-extrabold text-emerald-400">
									{stats.totalPresent}
								</p>
								<span className="text-xs text-emerald-400/80">
									({presentPercentage}%)
								</span>
							</div>
						</div>
						<div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
							<UserCheck className="w-6 h-6" />
						</div>
					</CardContent>
				</Card>
				<Card className="bg-[#0f0f1c] border-white/10 text-white">
					<CardContent className="p-5 flex items-center justify-between">
						<div>
							<p className="text-xs font-semibold text-slate-400 uppercase">
								Absent
							</p>
							<p className="text-3xl font-extrabold text-amber-400">
								{stats.totalAbsent}
							</p>
						</div>
						<div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
							<UserX className="w-6 h-6" />
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Scanner Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
				{/* Camera Scanner */}
				<Card className="lg:col-span-6 bg-[#0f0f1c] border-white/10 text-white flex flex-col">
					<CardHeader className="border-b border-white/5 pb-4">
						<CardTitle className="text-lg font-bold flex items-center justify-between">
							<span className="flex items-center gap-2">
								<Camera className="w-5 h-5 text-violet-400" />
								Live Camera Scanner
							</span>
							{cameraActive && (
								<Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 animate-pulse">
									Camera Active
								</Badge>
							)}
						</CardTitle>
					</CardHeader>

					<CardContent className="p-6 flex-1 flex flex-col items-center justify-center min-h-[320px]">
						{/* FIXED: explicit width/height for mobile */}
						<div
							id="reader"
							className={`w-full rounded-2xl overflow-hidden border-2 border-dashed ${
								cameraReady ?
									"border-violet-500 bg-black block"
								:	"border-white/10 hidden"
							}`}
							style={{ minHeight: cameraReady ? "250px" : "0" }}
						/>

						{!cameraReady && (
							<div className="text-center p-8 border border-dashed border-white/10 rounded-2xl w-full bg-white/[0.02]">
								<div className="w-16 h-16 rounded-full bg-violet-600/10 text-violet-400 flex items-center justify-center mx-auto mb-4 border border-violet-500/20">
									<QrCode className="w-8 h-8" />
								</div>
								<h3 className="text-base font-semibold text-white">
									Ready to Scan
								</h3>
								<p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
									Allow camera access to scan participant tickets.
								</p>
							</div>
						)}

						<div className="mt-6 flex gap-3 w-full max-w-sm">
							{!cameraActive ?
								<Button
									onClick={startCamera}
									disabled={cameraStarting}
									className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-2.5 rounded-xl shadow-lg shadow-violet-600/30">
									{cameraStarting ?
										<>
											<Loader2 className="w-4 h-4 mr-2 animate-spin" />
											Starting...
										</>
									:	<>
											<Camera className="w-4 h-4 mr-2" />
											Start Camera
										</>
									}
								</Button>
							:	<Button
									onClick={stopCamera}
									variant="destructive"
									className="w-full font-medium py-2.5 rounded-xl">
									<CameraOff className="w-4 h-4 mr-2" />
									Stop Camera
								</Button>
							}
						</div>
					</CardContent>
				</Card>

				{/* Manual Entry */}
				<Card className="lg:col-span-6 bg-[#0f0f1c] border-white/10 text-white flex flex-col">
					<CardHeader className="border-b border-white/5 pb-4">
						<CardTitle className="text-lg font-bold flex items-center gap-2">
							<Search className="w-5 h-5 text-indigo-400" />
							Manual Entry
						</CardTitle>
					</CardHeader>

					<CardContent className="p-6 space-y-6 flex-1 flex flex-col justify-between">
						<form
							onSubmit={(e) => {
								e.preventDefault();
								if (manualCode.trim()) {
									processCheckIn(manualCode);
									setManualCode("");
								}
							}}
							className="space-y-4">
							<div>
								<label className="text-xs font-semibold text-slate-300 mb-2 block">
									Registration ID (e.g. REG-123456)
								</label>
								<div className="flex gap-2">
									<Input
										value={manualCode}
										onChange={(e) => setManualCode(e.target.value)}
										placeholder="REG-XXXXXX"
										className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 font-mono"
									/>
									<Button
										type="submit"
										disabled={!manualCode.trim() || scanningLoading}
										className="bg-violet-600 hover:bg-violet-700 text-white shrink-0 px-5">
										{scanningLoading ?
											<Loader2 className="w-4 h-4 animate-spin" />
										:	"Check In"}
									</Button>
								</div>
							</div>
						</form>

						{lastScanResult ?
							<div
								className={`p-4 rounded-2xl border ${
									lastScanResult.type === "success" ?
										"bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
									: lastScanResult.type === "warning" ?
										"bg-amber-500/10 border-amber-500/30 text-amber-300"
									:	"bg-red-500/10 border-red-500/30 text-red-300"
								}`}>
								<div className="flex items-start gap-3">
									{lastScanResult.type === "success" && (
										<CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
									)}
									{lastScanResult.type === "warning" && (
										<AlertCircle className="w-6 h-6 text-amber-400 shrink-0" />
									)}
									{lastScanResult.type === "error" && (
										<AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
									)}
									<div className="flex-1 min-w-0">
										<p className="font-bold text-sm">
											{lastScanResult.message}
										</p>
										{lastScanResult.registration && (
											<div className="mt-3 text-xs space-y-1.5 pt-2 border-t font-medium opacity-90">
												<div className="flex justify-between">
													<span>Name:</span>
													<span className="font-bold">
														{lastScanResult.registration.fullName}
													</span>
												</div>
												<div className="flex justify-between">
													<span>Ticket:</span>
													<span className="font-mono">
														{lastScanResult.registration.ticketNumber}
													</span>
												</div>
												<div className="flex justify-between">
													<span>School:</span>
													<span>
														{lastScanResult.registration.schoolName || "N/A"}
													</span>
												</div>
												<div className="flex justify-between">
													<span>Mobile:</span>
													<span>{lastScanResult.registration.mobile}</span>
												</div>
											</div>
										)}
									</div>
								</div>
							</div>
						:	<div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] text-xs text-slate-400 text-center">
								Scan a ticket to view details here.
							</div>
						}
					</CardContent>
				</Card>
			</div>

			{/* Table */}
			<Card className="bg-[#0f0f1c] border-white/10 text-white">
				<CardHeader className="border-b border-white/5 pb-4">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<CardTitle className="text-lg font-bold">
							Attendance Directory
						</CardTitle>
						<div className="flex flex-wrap items-center gap-3">
							<div className="relative w-full sm:w-64">
								<Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
								<Input
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									placeholder="Search..."
									className="pl-9 bg-white/5 border-white/10 text-white text-xs h-9"
								/>
							</div>
							{events.length > 0 && (
								<Select
									value={selectedEventId}
									onValueChange={(v) => setSelectedEventId(v || "all")}>
									<SelectTrigger className="w-48 bg-white/5 border-white/10 text-white text-xs h-9">
										<SelectValue placeholder="All Events" />
									</SelectTrigger>
									<SelectContent className="bg-[#141424] border-white/10 text-white">
										<SelectItem value="all">All Events</SelectItem>
										{events.map((ev) => (
											<SelectItem
												key={ev._id}
												value={ev._id}>
												{ev.title}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
							<Select
								value={filter}
								onValueChange={(v) => setFilter(v || "All")}>
								<SelectTrigger className="w-36 bg-white/5 border-white/10 text-white text-xs h-9">
									<SelectValue placeholder="Filter" />
								</SelectTrigger>
								<SelectContent className="bg-[#141424] border-white/10 text-white">
									<SelectItem value="All">All</SelectItem>
									<SelectItem value="Present">Present</SelectItem>
									<SelectItem value="Absent">Absent</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardHeader>

				<CardContent className="p-0">
					{loading ?
						<div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
							<Loader2 className="w-5 h-5 animate-spin text-violet-400" />
							Loading...
						</div>
					: data.length === 0 ?
						<div className="p-12 text-center text-slate-400">
							No participants found.
						</div>
					:	<div className="overflow-x-auto">
							<Table>
								<TableHeader className="bg-white/5">
									<TableRow className="border-white/5 hover:bg-transparent">
										<TableHead className="text-slate-400 text-xs">
											Reg ID
										</TableHead>
										<TableHead className="text-slate-400 text-xs">
											Participant
										</TableHead>
										<TableHead className="text-slate-400 text-xs">
											Institution
										</TableHead>
										<TableHead className="text-slate-400 text-xs">
											Status
										</TableHead>
										<TableHead className="text-slate-400 text-xs">
											Time
										</TableHead>
										<TableHead className="text-right text-slate-400 text-xs">
											Action
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{data.map((item) => (
										<TableRow
											key={item._id}
											className="border-white/5 hover:bg-white/5">
											<TableCell className="font-mono text-xs font-semibold text-violet-300">
												<div>{item.registrationId}</div>
												<div className="text-[10px] text-slate-400">
													{item.ticketNumber}
												</div>
											</TableCell>
											<TableCell>
												<div className="font-semibold text-sm text-white">
													{item.fullName}
												</div>
												<div className="text-xs text-slate-400">
													{item.mobile}
												</div>
											</TableCell>
											<TableCell className="text-xs text-slate-300">
												<div>{item.schoolName || "N/A"}</div>
												<div className="text-[11px] text-slate-500">
													Class: {item.class || "N/A"}
												</div>
											</TableCell>
											<TableCell>
												{item.attendance === "Present" ?
													<Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 gap-1 text-xs">
														<UserCheck className="w-3 h-3" />
														Present
													</Badge>
												:	<Badge className="bg-slate-800 text-slate-400 border-white/10 gap-1 text-xs">
														<UserX className="w-3 h-3" />
														Absent
													</Badge>
												}
											</TableCell>
											<TableCell className="text-xs text-slate-400">
												{item.attendedAt ?
													<span className="flex items-center gap-1 text-emerald-400/90 font-mono">
														<Clock className="w-3 h-3" />
														{new Date(item.attendedAt).toLocaleTimeString(
															"en-BD",
															{ hour: "2-digit", minute: "2-digit" }
														)}
													</span>
												:	<span className="text-slate-600">—</span>}
											</TableCell>
											<TableCell className="text-right">
												{item.attendance === "Present" ?
													<Button
														size="sm"
														variant="ghost"
														onClick={() =>
															handleResetAttendance(
																item.registrationId,
																item.fullName
															)
														}
														className="text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 h-8">
														Mark Absent
													</Button>
												:	<Button
														size="sm"
														onClick={() => processCheckIn(item.registrationId)}
														className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8">
														Mark Present
													</Button>
												}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					}
				</CardContent>
			</Card>
		</div>
	);
}
