/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
	Search,
	Loader2,
	ChevronLeft,
	ChevronRight,
	Award,
	Printer,
	History,
	Users,
	Trash2,
	CheckSquare,
	Square,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function CertificatesPage() {
	const { data: session } = useSession();
	const adminName = session?.user?.name || session?.user?.email || "Admin";

	// Tab state: "participants" or "history"
	const [activeTab, setActiveTab] = useState<"participants" | "history">("participants");

	// Participants Tab State
	const [participants, setParticipants] = useState<any[]>([]);
	const [loadingParticipants, setLoadingParticipants] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("All");
	const [eventFilter, setEventFilter] = useState("Active");
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [eventsList, setEventsList] = useState<string[]>([]);
	const [activeEvent, setActiveEvent] = useState<any>(null);

	// Selection State
	const [selectedRegIds, setSelectedRegIds] = useState<string[]>([]);

	// Certificate History State
	const [historyCerts, setHistoryCerts] = useState<any[]>([]);
	const [loadingHistory, setLoadingHistory] = useState(true);
	const [historySearch, setHistorySearch] = useState("");
	const [historyPage, setHistoryPage] = useState(1);
	const [historyTotalPages, setHistoryTotalPages] = useState(1);
	const [historyTotalCount, setHistoryTotalCount] = useState(0);

	// Action Loading States
	const [generating, setGenerating] = useState(false);

	// Print Area State
	const [printCerts, setPrintCerts] = useState<any[]>([]);

	// Fetch Participants
	const fetchParticipants = async () => {
		setLoadingParticipants(true);
		try {
			const res = await axios.get("/api/admin/certificates/registrations", {
				params: {
					page,
					limit: 10,
					search: searchQuery,
					status: statusFilter,
					event: eventFilter,
				},
			});
			if (res.data.success) {
				setParticipants(res.data.data);
				setTotalPages(res.data.totalPages);
				setTotalCount(res.data.total);
				setEventsList(res.data.events);
				setActiveEvent(res.data.activeEvent);
			}
		} catch (error: any) {
			toast.error(error.response?.data?.error || "Failed to fetch participants");
		} finally {
			setLoadingParticipants(false);
		}
	};

	// Fetch History
	const fetchHistory = async () => {
		setLoadingHistory(true);
		try {
			const res = await axios.get("/api/admin/certificates", {
				params: {
					page: historyPage,
					limit: 10,
					search: historySearch,
					event: eventFilter === "Active" ? (activeEvent?.name || "") : eventFilter,
				},
			});
			if (res.data.success) {
				setHistoryCerts(res.data.data);
				setHistoryTotalPages(res.data.totalPages);
				setHistoryTotalCount(res.data.total);
			}
		} catch (error: any) {
			toast.error(error.response?.data?.error || "Failed to fetch history");
		} finally {
			setLoadingHistory(false);
		}
	};

	// Trigger Search with debounce
	useEffect(() => {
		const timer = setTimeout(() => {
			if (activeTab === "participants") {
				setPage(1);
				fetchParticipants();
			} else {
				setHistoryPage(1);
				fetchHistory();
			}
		}, 500);
		return () => clearTimeout(timer);
	}, [searchQuery, historySearch, statusFilter, eventFilter, activeTab]);

	// Page Change effects
	useEffect(() => {
		if (activeTab === "participants") {
			fetchParticipants();
		}
	}, [page]);

	useEffect(() => {
		if (activeTab === "history") {
			fetchHistory();
		}
	}, [historyPage]);

	// Selection Helper
	const toggleSelectParticipant = (regId: string) => {
		setSelectedRegIds((prev) =>
			prev.includes(regId) ? prev.filter((id) => id !== regId) : [...prev, regId]
		);
	};

	const toggleSelectAll = () => {
		const pageRegIds = participants.map((p) => p.registrationId);
		const allSelected = pageRegIds.every((id) => selectedRegIds.includes(id));

		if (allSelected) {
			setSelectedRegIds((prev) => prev.filter((id) => !pageRegIds.includes(id)));
		} else {
			setSelectedRegIds((prev) => {
				const union = new Set([...prev, ...pageRegIds]);
				return Array.from(union);
			});
		}
	};

	// Generate Certificates
	const handleGenerateCertificates = async () => {
		if (selectedRegIds.length === 0) {
			toast.warning("Please select at least one participant");
			return;
		}

		setGenerating(true);
		try {
			const res = await axios.post("/api/admin/certificates/generate", {
				registrationIds: selectedRegIds,
				generatedByAdmin: adminName,
			});
			if (res.data.success) {
				toast.success(res.data.message);
				setSelectedRegIds([]);
				fetchParticipants();
			}
		} catch (error: any) {
			toast.error(error.response?.data?.error || "Failed to generate certificates");
		} finally {
			setGenerating(false);
		}
	};

	// Revoke Certificate
	const handleRevokeCertificate = async (certificateId: string) => {
		if (!window.confirm("Are you sure you want to revoke this certificate? This action cannot be undone.")) {
			return;
		}
		try {
			const res = await axios.delete(`/api/admin/certificates/${certificateId}`);
			if (res.data.success) {
				toast.success("Certificate revoked successfully");
				if (activeTab === "history") {
					fetchHistory();
				} else {
					fetchParticipants();
				}
			}
		} catch (error: any) {
			toast.error(error.response?.data?.error || "Failed to revoke certificate");
		}
	};

	// Generate a Security Hash String for Tamper Protection
	const getSecurityHash = (certId: string, regId: string) => {
		const str = `${certId}-${regId}-TALAMIJ-SECURE-2026`;
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			hash = (hash << 5) - hash + str.charCodeAt(i);
			hash |= 0;
		}
		const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, "0");
		return `SEC-HASH: 8F9B-${hex.slice(0, 4)}-${hex.slice(4, 8)}`;
	};

	// Bulk Printing for Selected
	const handlePrintBulk = () => {
		const certsToPrint = participants.filter((p) => selectedRegIds.includes(p.registrationId));

		if (certsToPrint.length === 0) {
			toast.warning("Please select at least one participant to print.");
			return;
		}

		const formattedCerts = certsToPrint.map((p) => ({
			certificateId: p.certificate?.certificateId || `CERT-${p.registrationId}`,
			registrationId: p.registrationId,
			fullName: p.fullName,
			eventName: p.certificate?.eventName || activeEvent?.name || "Event",
			eventDate: p.certificate?.eventDate || activeEvent?.date || "",
			generatedDate: p.certificate?.generatedDate || new Date().toISOString(),
		}));

		setPrintCerts(formattedCerts);
	};

	// Print All Certificates
	const handlePrintAll = async () => {
		try {
			toast.info("Preparing all certificates for print...");
			const res = await axios.get("/api/admin/certificates/registrations", {
				params: {
					page: 1,
					limit: 5000,
					search: searchQuery,
					status: statusFilter,
					event: eventFilter,
				},
			});

			if (res.data.success && res.data.data.length > 0) {
				const allCerts = res.data.data.map((p: any) => ({
					certificateId: p.certificate?.certificateId || `CERT-${p.registrationId}`,
					registrationId: p.registrationId,
					fullName: p.fullName,
					eventName: p.certificate?.eventName || res.data.activeEvent?.name || activeEvent?.name || "Event",
					eventDate: p.certificate?.eventDate || res.data.activeEvent?.date || activeEvent?.date || "",
					generatedDate: p.certificate?.generatedDate || new Date().toISOString(),
				}));
				setPrintCerts(allCerts);
			} else {
				toast.warning("No participants found to print.");
			}
		} catch (error: any) {
			toast.error(error.response?.data?.error || "Failed to fetch all certificates for printing.");
		}
	};

	// Trigger print when printCerts changes
	useEffect(() => {
		if (printCerts.length > 0) {
			const originalTitle = document.title;
			if (printCerts.length === 1) {
				const c = printCerts[0];
				document.title = `Certificate-${c.registrationId || c.certificateId}`;
			} else {
				document.title = `Certificates-All-${printCerts.length}-Items`;
			}

			const timer = setTimeout(() => {
				window.print();
				setPrintCerts([]);
				document.title = originalTitle;
			}, 500);

			return () => clearTimeout(timer);
		}
	}, [printCerts]);

	// Run on initial load
	useEffect(() => {
		if (activeTab === "participants") {
			fetchParticipants();
		} else {
			fetchHistory();
		}
	}, [activeTab]);

	return (
		<div className="space-y-6">
			{/* Print Styles matching green border & purple typography with zero outer page margins */}
			<style>{`
				@media print {
					@page {
						size: A4 landscape;
						margin: 0mm;
					}
					html, body {
						width: 297mm !important;
						height: auto !important;
						min-height: 0 !important;
						margin: 0 !important;
						padding: 0 !important;
						overflow: visible !important;
						background: white !important;
					}
					body * {
						visibility: hidden !important;
					}
					header, nav, aside, main, button, table, .print\:hidden {
						display: none !important;
					}
					#print-capture-area, #print-capture-area * {
						visibility: visible !important;
					}
					#print-capture-area {
						position: absolute !important;
						left: 0 !important;
						top: 0 !important;
						width: 297mm !important;
						height: auto !important;
						margin: 0 !important;
						padding: 0 !important;
						background: white !important;
						overflow: visible !important;
						display: block !important;
						z-index: 999999 !important;
					}
					.print-certificate-page {
						width: 297mm !important;
						height: 210mm !important;
						max-height: 210mm !important;
						box-sizing: border-box !important;
						page-break-after: always !important;
						break-after: page !important;
						page-break-inside: avoid !important;
						break-inside: avoid !important;
						border: 7px solid #14532d !important;
						background: #ffffff !important;
						-webkit-print-color-adjust: exact;
						print-color-adjust: exact;
						display: flex !important;
						flex-direction: column;
						justify-content: space-between;
						padding: 18px 22px;
						position: relative;
						overflow: hidden;
						margin: 0 !important;
						color: #0f172a;
					}
					.print-certificate-page:last-child {
						page-break-after: avoid !important;
						break-after: avoid !important;
					}
					.print-certificate-page h1 { font-size: 18px !important; margin: 0 !important; }
					.print-certificate-page h2 { font-size: 32px !important; margin: 2px 0 !important; }
					.print-certificate-page h3 { font-size: 40px !important; margin: 3px 0 !important; }
					.print-certificate-page h4 { font-size: 20px !important; margin: 2px 0 !important; }
				}
			`}</style>

			{/* Bulk printing container */}
			{printCerts.length > 0 && (
				<div id="print-capture-area" className="hidden print:block">
					{printCerts.map((cert) => (
						<div key={cert.certificateId} className="print-certificate-page font-serif-title">
							{/* Inner Gold Foil Borders */}
							<div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', bottom: '10px', border: '2px solid #d97706', pointerEvents: 'none', zIndex: 1 }}></div>
							<div style={{ position: 'absolute', top: '14px', left: '14px', right: '14px', bottom: '14px', border: '1px solid #166534', pointerEvents: 'none', zIndex: 1 }}></div>

							{/* Corner Golden Flourish Ornaments */}
							<svg width="60" height="60" viewBox="0 0 100 100" style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 2, pointerEvents: 'none' }}>
								<path d="M5,5 L45,5 L45,12 L12,12 L12,45 L5,45 Z" fill="#d97706"/>
								<circle cx="20" cy="20" r="4" fill="#166534"/>
							</svg>
							<svg width="60" height="60" viewBox="0 0 100 100" style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 2, pointerEvents: 'none' }}>
								<path d="M95,5 L55,5 L55,12 L88,12 L88,45 L95,45 Z" fill="#d97706"/>
								<circle cx="80" cy="20" r="4" fill="#166534"/>
							</svg>
							<svg width="60" height="60" viewBox="0 0 100 100" style={{ position: 'absolute', bottom: '16px', left: '16px', zIndex: 2, pointerEvents: 'none' }}>
								<path d="M5,95 L45,95 L45,88 L12,88 L12,55 L5,55 Z" fill="#d97706"/>
								<circle cx="20" cy="80" r="4" fill="#166534"/>
							</svg>
							<svg width="60" height="60" viewBox="0 0 100 100" style={{ position: 'absolute', bottom: '16px', right: '16px', zIndex: 2, pointerEvents: 'none' }}>
								<path d="M95,95 L55,95 L55,88 L88,88 L88,55 L95,55 Z" fill="#d97706"/>
								<circle cx="80" cy="80" r="4" fill="#166534"/>
							</svg>

							{/* Watermark Seal */}
							<svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', opacity: 0.035, zIndex: 0 }} xmlns="http://www.w3.org/2000/svg">
								<circle cx="50%" cy="50%" r="35%" fill="none" stroke="#16a34a" strokeWidth="2"/>
								<circle cx="50%" cy="50%" r="28%" fill="none" stroke="#d97706" strokeWidth="1.5"/>
								<circle cx="50%" cy="50%" r="20%" fill="none" stroke="#16a34a" strokeWidth="1.2"/>
								<circle cx="50%" cy="50%" r="12%" fill="none" stroke="#d97706" strokeWidth="1"/>
							</svg>

							{/* Rounded Center Watermark Logo */}
							<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 opacity-[0.055] pointer-events-none z-0 flex items-center justify-center">
								<img src="/bangladesh-anjumane-talamije-islamia-seeklogo.png" className="w-full h-full object-contain rounded-full" alt="Watermark Logo" />
							</div>

							{/* Header */}
							<div className="text-center mt-3 relative z-10">
								<div className="font-serif text-xl text-emerald-700 font-bold mb-2">﷽</div>
								<img 
									src="/bangladesh-anjumane-talamije-islamia-seeklogo.png" 
									className="h-16 w-16 rounded-full object-contain mx-auto mb-1.5 p-0.5 border-2 border-amber-600 bg-white shadow-sm" 
									alt="Logo"
								/>
								<h1 className="text-xl font-bold text-slate-800 font-serif-title tracking-wide">
									Bangladesh Anjumane Talamije Islamia
								</h1>
								<p className="text-sm text-slate-600 font-serif-title">Chhatak Uttar Upazila</p>
							</div>

							{/* Title & Body */}
							<div className="text-center my-2 relative z-10">
								<h2 className="text-4xl font-bold text-purple-900 mb-1 font-serif-title uppercase tracking-wider">
									Certificate of Participation
								</h2>
								<div className="flex items-center justify-center my-1.5">
									<svg width="160" height="14" viewBox="0 0 160 14" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' } as React.CSSProperties}>
										<defs>
											<linearGradient id="grad-left-p" x1="0" y1="0" x2="1" y2="0">
												<stop offset="0%" stopColor="transparent" />
												<stop offset="100%" stopColor="#d97706" />
											</linearGradient>
											<linearGradient id="grad-right-p" x1="0" y1="0" x2="1" y2="0">
												<stop offset="0%" stopColor="#d97706" />
												<stop offset="100%" stopColor="transparent" />
											</linearGradient>
										</defs>
										<line x1="0" y1="7" x2="64" y2="7" stroke="url(#grad-left-p)" strokeWidth="1" />
										<text x="80" y="11" textAnchor="middle" fill="#d97706" fontSize="12" fontFamily="serif">✦</text>
										<line x1="96" y1="7" x2="160" y2="7" stroke="url(#grad-right-p)" strokeWidth="1" />
									</svg>
								</div>
								<p className="text-base italic text-slate-600 mb-1.5 font-serif-title">This is to certify that</p>
								<h3 className="text-5xl font-normal text-purple-950 mb-1 leading-tight font-cert-name">
									{cert.fullName}
								</h3>
								{cert.registrationId && (
									<p className="text-sm font-mono font-bold text-purple-900/80 mb-2">
										Registration ID: {cert.registrationId}
									</p>
								)}
								<p className="text-base text-slate-600 max-w-xl mx-auto leading-relaxed font-serif-title">
									successfully registered and participated in the event
								</p>
								<h4 className="text-2xl font-bold text-slate-900 mt-1.5 mb-1 font-serif-title">
									{cert.eventName}
								</h4>
								<p className="text-base italic text-slate-700 font-serif-title">
									on {cert.eventDate || new Date(cert.generatedDate).toLocaleDateString()}.
								</p>
							</div>
							<div className="text-center mb-1 relative z-10">
								<p className="text-[9px] font-sans text-amber-600 font-bold tracking-widest uppercase mb-1">Official Security Verification</p>
								<div className="inline-block p-1.5 bg-white border-2 border-amber-500 rounded-lg shadow-sm">
									<QRCodeSVG 
										value={`${window.location.origin}/verify/certificate/${cert.certificateId}`} 
										size={75}
										level="H"
										includeMargin={false}
										fgColor="#1e1b4b"
										className="mx-auto"
									/>
								</div>
								<p className="font-mono text-xs font-semibold text-slate-600 mt-1">Cert ID: {cert.certificateId} | Reg ID: {cert.registrationId}</p>
								<p className="font-mono text-[9px] font-bold text-green-700">{getSecurityHash(cert.certificateId, cert.registrationId)}</p>
							</div>

							{/* Signatures */}
							<div className="flex justify-between items-end px-10 pb-5 relative z-10 mb-[50px]">
								<div className="text-center w-48 font-serif-title">
									<div className="h-9 relative flex items-end justify-center pb-0.5">
										{activeEvent?.presidentSignatureUrl ? (
											<img src={activeEvent.presidentSignatureUrl} className="h-8 max-w-[160px] object-contain mb-1" />
										) : null}
									</div>
									<div className="border-t border-slate-300 w-32 mx-auto my-1"></div>
									<p className="font-bold text-slate-800 text-sm mt-0.5">{activeEvent?.presidentName || "President"}</p>
									<p className="text-xs text-slate-500">{activeEvent?.presidentTitle || "Chhatak Uttar Upazila"}</p>
								</div>
								<div className="text-center w-48 font-serif-title">
									<div className="h-9 relative flex items-end justify-center pb-0.5">
										{activeEvent?.secretarySignatureUrl ? (
											<img src={activeEvent.secretarySignatureUrl} className="h-8 max-w-[160px] object-contain mb-1" />
										) : null}
									</div>
									<div className="border-t border-slate-300 w-32 mx-auto my-1"></div>
									<p className="font-bold text-slate-800 text-sm mt-0.5">{activeEvent?.secretaryName || "General Secretary"}</p>
									<p className="text-xs text-slate-500">{activeEvent?.secretaryTitle || "Chhatak Uttar Upazila"}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Page Header */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
						<Award className="w-8 h-8 text-purple-700" />
						Certificate Manage
					</h1>
					<p className="text-slate-500">
						Generate and print event certificates for participants.
					</p>
				</div>
				<div className="flex items-center gap-3">
					<div className="flex rounded-lg border border-slate-200 dark:border-slate-800 p-1 bg-white dark:bg-slate-900">
						<button
							onClick={() => setActiveTab("participants")}
							className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
								activeTab === "participants"
									? "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-semibold"
									: "text-slate-600 dark:text-slate-400 hover:text-slate-900"
							}`}
						>
							<Users className="w-4 h-4" />
							Participants
						</button>
						<button
							onClick={() => setActiveTab("history")}
							className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
								activeTab === "history"
									? "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-semibold"
									: "text-slate-600 dark:text-slate-400 hover:text-slate-900"
							}`}
						>
							<History className="w-4 h-4" />
							Certificate History
						</button>
					</div>
				</div>
			</div>

			{/* Toolbar / Filters */}
			<div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
				<div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
					{/* Event Selector */}
					<div className="w-full sm:w-60">
						<label className="text-xs font-semibold text-slate-500 block mb-1.5">Manage Event</label>
						<Select value={eventFilter} onValueChange={(val) => setEventFilter(val ?? "Active")}>
							<SelectTrigger>
								<SelectValue placeholder="Select Event" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Active">Active Event (from Settings)</SelectItem>
								<SelectItem value="All">All Events</SelectItem>
								{eventsList.map(
									(evt) =>
										evt !== (activeEvent?.name || "Active Event") && (
											<SelectItem key={evt} value={evt}>
												{evt}
											</SelectItem>
										)
								)}
							</SelectContent>
						</Select>
					</div>

					{/* Search */}
					<div className="w-full sm:w-64">
						<label className="text-xs font-semibold text-slate-500 block mb-1.5">Search Participants</label>
						<div className="relative">
							<Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
							{activeTab === "participants" ? (
								<Input
									placeholder="Search name, mobile, registration ID..."
									className="pl-9"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							) : (
								<Input
									placeholder="Search name, ID..."
									className="pl-9"
									value={historySearch}
									onChange={(e) => setHistorySearch(e.target.value)}
								/>
							)}
						</div>
					</div>

					{/* Status Filter */}
					{activeTab === "participants" && (
						<div className="w-full sm:w-44">
							<label className="text-xs font-semibold text-slate-500 block mb-1.5">Registration Status</label>
							<Select value={statusFilter} onValueChange={(val) => setStatusFilter(val ?? "All")}>
								<SelectTrigger>
									<SelectValue placeholder="Status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="All">All Statuses</SelectItem>
									<SelectItem value="Verified">Verified Only</SelectItem>
									<SelectItem value="Pending">Pending Only</SelectItem>
									<SelectItem value="Invalid">Invalid Only</SelectItem>
								</SelectContent>
							</Select>
						</div>
					)}
				</div>

				{/* Actions */}
				<div className="flex flex-wrap gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0">
					{activeTab === "participants" && selectedRegIds.length > 0 && (
						<>
							<div className="text-sm font-medium text-slate-500 mr-2 flex items-center">
								{selectedRegIds.length} selected
							</div>
							<Button onClick={handleGenerateCertificates} disabled={generating} size="sm" className="bg-purple-700 hover:bg-purple-800 text-white">
								{generating ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
								Generate Certificates
							</Button>
							<Button onClick={handlePrintBulk} variant="outline" size="sm">
								<Printer className="w-4 h-4 mr-1.5" />
								Print Selected
							</Button>
						</>
					)}
					<Button onClick={handlePrintAll} variant="outline" size="sm" className="border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-950 font-semibold">
						<Printer className="w-4 h-4 mr-1.5" />
						Print All
					</Button>
				</div>
			</div>

			{/* Main Table */}
			{activeTab === "participants" ? (
				<div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow className="bg-slate-50 dark:bg-slate-800/50">
									<TableHead className="w-12 text-center">
										<button onClick={toggleSelectAll} className="p-1 focus:outline-none">
											{participants.length > 0 &&
											participants.every((p) => selectedRegIds.includes(p.registrationId)) ? (
												<CheckSquare className="w-4 h-4 text-purple-700" />
											) : (
												<Square className="w-4 h-4 text-slate-400" />
											)}
										</button>
									</TableHead>
									<TableHead className="w-12 text-center">S.N.</TableHead>
									<TableHead>Registration ID</TableHead>
									<TableHead>Participant Name</TableHead>
									<TableHead>Mobile Number</TableHead>
									<TableHead>Academic Institution</TableHead>
									<TableHead>Certificate Status</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{loadingParticipants ? (
									<TableRow>
										<TableCell colSpan={8} className="h-40 text-center">
											<Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-700" />
											<p className="text-slate-400 mt-2 text-sm">Loading participants data...</p>
										</TableCell>
									</TableRow>
								) : participants.length === 0 ? (
									<TableRow>
										<TableCell colSpan={8} className="h-40 text-center text-slate-500">
											No participants found under current filters.
										</TableCell>
									</TableRow>
								) : (
									participants.map((item, index) => {
										const isSelected = selectedRegIds.includes(item.registrationId);
										const cert = item.certificate;

										return (
											<TableRow
												key={item._id}
												className={isSelected ? "bg-purple-50/30 dark:bg-purple-950/20" : ""}
											>
												<TableCell className="text-center">
													<button
														onClick={() => toggleSelectParticipant(item.registrationId)}
														className="p-1 focus:outline-none"
													>
														{isSelected ? (
															<CheckSquare className="w-4 h-4 text-purple-700" />
														) : (
															<Square className="w-4 h-4 text-slate-400" />
														)}
													</button>
												</TableCell>
												<TableCell className="font-medium text-slate-500 text-center">
													{(page - 1) * 10 + index + 1}
												</TableCell>
												<TableCell className="font-mono text-sm">{item.registrationId}</TableCell>
												<TableCell className="font-medium text-slate-900 dark:text-white">
													{item.fullName}
												</TableCell>
												<TableCell>{item.mobile}</TableCell>
												<TableCell className="max-w-[200px] truncate" title={item.schoolName}>
													{item.schoolName}
												</TableCell>
												<TableCell>
													{cert ? (
														<Badge className="bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-50 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800">
															Generated: {cert.certificateId}
														</Badge>
													) : (
														<Badge variant="outline" className="text-slate-400 border-slate-200">
															Not Generated
														</Badge>
													)}
												</TableCell>
												<TableCell className="text-right">
													{cert ? (
														<div className="flex justify-end gap-1.5">
															<Button
																variant="ghost"
																size="sm"
																className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900"
																title="Print"
																onClick={() =>
																	setPrintCerts([
																		{
																			certificateId: cert?.certificateId || `CERT-${item.registrationId}`,
																			registrationId: item.registrationId,
																			fullName: item.fullName,
																			eventName: cert?.eventName || activeEvent?.name || "Event",
																			eventDate: cert?.eventDate || activeEvent?.date || "",
																			generatedDate: cert?.generatedDate || new Date().toISOString(),
																		},
																	])
																}
															>
																<Printer className="w-4 h-4" />
															</Button>
															<Button
																variant="ghost"
																size="sm"
																className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
																title="Revoke Certificate"
																onClick={() => handleRevokeCertificate(cert.certificateId)}
															>
																<Trash2 className="w-4 h-4" />
															</Button>
														</div>
													) : (
														<Button
															variant="link"
															size="sm"
															className="h-8 px-2 text-purple-700 hover:text-purple-900 font-semibold"
															onClick={() => {
																setSelectedRegIds([item.registrationId]);
																setGenerating(true);
																axios
																	.post("/api/admin/certificates/generate", {
																		registrationIds: [item.registrationId],
																		generatedByAdmin: adminName,
																	})
																	.then((res) => {
																		if (res.data.success) {
																			toast.success("Certificate generated successfully");
																			setSelectedRegIds([]);
																			fetchParticipants();
																		}
																	})
																	.catch((err) => {
																		toast.error(err.response?.data?.error || "Failed to generate");
																	})
																	.finally(() => {
																		setGenerating(false);
																	});
															}}
														>
															Generate
														</Button>
													)}
												</TableCell>
											</TableRow>
										);
									})
								)}
							</TableBody>
						</Table>
					</div>

					{/* Pagination */}
					<div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800">
						<div className="text-xs sm:text-sm text-slate-500">
							Showing {Math.min((page - 1) * 10 + 1, totalCount)}–
							{Math.min(page * 10, totalCount)} of {totalCount} participants
						</div>
						<div className="flex items-center space-x-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setPage((p) => Math.max(1, p - 1))}
								disabled={page === 1 || loadingParticipants}
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<div className="text-sm font-medium px-2">
								Page {page} of {totalPages || 1}
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
								disabled={page >= totalPages || loadingParticipants}
							>
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			) : (
				/* History Table */
				<div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow className="bg-slate-50 dark:bg-slate-800/50">
									<TableHead className="w-12 text-center">S.N.</TableHead>
									<TableHead>Certificate ID</TableHead>
									<TableHead>Participant Name</TableHead>
									<TableHead>Registration ID</TableHead>
									<TableHead>Event Name</TableHead>
									<TableHead>Generated By</TableHead>
									<TableHead>Issued Date</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{loadingHistory ? (
									<TableRow>
										<TableCell colSpan={8} className="h-40 text-center">
											<Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-700" />
											<p className="text-slate-400 mt-2 text-sm">Loading certificate history...</p>
										</TableCell>
									</TableRow>
								) : historyCerts.length === 0 ? (
									<TableRow>
										<TableCell colSpan={8} className="h-40 text-center text-slate-500">
											No issued certificates found matching filters.
										</TableCell>
									</TableRow>
								) : (
									historyCerts.map((item, index) => (
										<TableRow key={item._id}>
											<TableCell className="font-medium text-slate-500 text-center">
												{(historyPage - 1) * 10 + index + 1}
											</TableCell>
											<TableCell className="font-mono text-sm font-semibold">{item.certificateId}</TableCell>
											<TableCell className="font-medium text-slate-900 dark:text-white">
												{item.fullName}
											</TableCell>
											<TableCell className="font-mono text-sm">{item.registrationId}</TableCell>
											<TableCell className="max-w-[200px] truncate" title={item.eventName}>
												{item.eventName}
											</TableCell>
											<TableCell className="text-slate-600 dark:text-slate-400">{item.generatedByAdmin}</TableCell>
											<TableCell className="text-slate-500">
												{new Date(item.generatedDate).toLocaleDateString()}
											</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end gap-1.5">
													<Button
														variant="ghost"
														size="sm"
														className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900"
														title="Print"
														onClick={() =>
															setPrintCerts([
																{
																	...item,
																	fullName: item.fullName,
																	registrationId: item.registrationId,
																},
															])
														}
													>
														<Printer className="w-4 h-4" />
													</Button>
													<Button
														variant="ghost"
														size="sm"
														className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
														title="Revoke Certificate"
														onClick={() => handleRevokeCertificate(item.certificateId)}
													>
														<Trash2 className="w-4 h-4" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>

					{/* History Pagination */}
					<div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800">
						<div className="text-xs sm:text-sm text-slate-500">
							Showing {Math.min((historyPage - 1) * 10 + 1, historyTotalCount)}–
							{Math.min(historyPage * 10, historyTotalCount)} of {historyTotalCount} certificates
						</div>
						<div className="flex items-center space-x-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
								disabled={historyPage === 1 || loadingHistory}
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<div className="text-sm font-medium px-2">
								Page {historyPage} of {historyTotalPages || 1}
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setHistoryPage((p) => Math.min(historyTotalPages, p + 1))}
								disabled={historyPage >= historyTotalPages || loadingHistory}
							>
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			)}


		</div>
	);
}
