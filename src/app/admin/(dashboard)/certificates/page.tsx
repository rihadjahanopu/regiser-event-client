/* eslint-disable @typescript-eslint/no-explicit-any */
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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Search,
	Loader2,
	ChevronLeft,
	ChevronRight,
	Award,
	Download,
	Printer,
	Eye,
	History,
	Users,
	Trash2,
	CheckSquare,
	Square,
	ShieldCheck,
	Lock,
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
	const [downloadingBulk, setDownloadingBulk] = useState(false);

	// Preview Modal State
	const [previewCert, setPreviewCert] = useState<any>(null);
	const [previewOpen, setPreviewOpen] = useState(false);

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

	// Helper: load an image URL as a base64 data URL (handles CORS via fetch+blob)
	const loadImageAsDataUrl = async (url: string): Promise<string | null> => {
		if (!url) return null;
		try {
			const resp = await fetch(url, { mode: "cors" });
			const blob = await resp.blob();
			return await new Promise((resolve) => {
				const reader = new FileReader();
				reader.onload = () => resolve(reader.result as string);
				reader.onerror = () => resolve(null);
				reader.readAsDataURL(blob);
			});
		} catch {
			return null;
		}
	};

	// Full-bleed A4 PDF Generation (CORS-safe base64 + html2canvas + jsPDF)
	const downloadPDF = async (certData: any) => {
		const orgName = "Bangladesh Anjumane Talamije Islamia";
		const subHeader = "Chhatak Uttar Upazila";
		const certTitle = "Certificate of Participation";
		const qrValue = `${window.location.origin}/verify/certificate/${certData.certificateId}`;
		const dateStr = certData.eventDate || new Date(certData.generatedDate || Date.now()).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
		const secHash = getSecurityHash(certData.certificateId, certData.registrationId);

		const presName = activeEvent?.presidentName || "Professor Mohammad Farhadul Islam";
		const presTitle = activeEvent?.presidentTitle || "President, Chhatak Uttar";
		const presSigUrl = activeEvent?.presidentSignatureUrl || "";

		const secrName = activeEvent?.secretaryName || "Shah Rezwan Hayat";
		const secrTitle = activeEvent?.secretaryTitle || "General Secretary, Chhatak Uttar";
		const secrSigUrl = activeEvent?.secretarySignatureUrl || "";

		toast.info("Preparing PDF download...");

		// Pre-convert external images to base64 data URLs
		const [presSigData, secrSigData, logoData, QRCodeMod, htmlToImageMod, jsPDFMod] = await Promise.all([
			loadImageAsDataUrl(presSigUrl),
			loadImageAsDataUrl(secrSigUrl),
			loadImageAsDataUrl(window.location.origin + "/bangladesh-anjumane-talamije-islamia-seeklogo.png"),
			import("qrcode"),
			import("html-to-image"),
			import("jspdf").then((m) => m.jsPDF),
		]);

		// Create off-screen rendering container
		const container = document.createElement("div");
		container.style.position = "fixed";
		container.style.top = "0";
		container.style.left = "0";
		container.style.width = "1123px";
		container.style.height = "794px";
		container.style.zIndex = "-9999";
		container.style.pointerEvents = "none";
		container.style.overflow = "hidden";

		container.innerHTML = `
			<div style="width: 1123px; height: 794px; background: #ffffff; padding: 25px 35px 35px 35px; box-sizing: border-box; font-family: 'Playfair Display', Georgia, serif; position: relative; border: 6px solid #16a34a; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; margin: 0; color: #0f172a;">
				<!-- Inner Green Border -->
				<div style="position: absolute; top: 10px; left: 10px; right: 10px; bottom: 10px; border: 1.5px solid #16a34a; pointer-events: none; z-index: 1;"></div>
				
				<!-- Ultra-Faint Single Centered Watermark Seal -->
				<svg width="100%" height="100%" style="position: absolute; top:0; left:0; pointer-events:none; opacity: 0.04; z-index:0;" xmlns="http://www.w3.org/2000/svg">
					<circle cx="561" cy="397" r="280" fill="none" stroke="#16a34a" stroke-width="2"/>
					<circle cx="561" cy="397" r="220" fill="none" stroke="#16a34a" stroke-width="1.5"/>
					<circle cx="561" cy="397" r="160" fill="none" stroke="#16a34a" stroke-width="1.2"/>
					<circle cx="561" cy="397" r="100" fill="none" stroke="#16a34a" stroke-width="1"/>
				</svg>

				<!-- Header Section -->
				<div style="text-align: center; margin-top: 5px; position: relative; z-index: 2;">
					<!-- Left Verified Badge -->
					<div style="position: absolute; top: 0px; left: 20px; text-align: center;">
						<svg width="55" height="55" viewBox="0 0 100 100">
							<polygon points="50,5 64,18 82,18 88,36 100,50 88,64 82,82 64,82 50,95 36,82 18,82 12,64 0,50 12,36 18,18 36,18" fill="none" stroke="#d4af37" stroke-width="3"/>
							<circle cx="50" cy="50" r="32" fill="#16a34a" opacity="0.1"/>
							<circle cx="50" cy="50" r="28" fill="none" stroke="#16a34a" stroke-width="1.5" stroke-dasharray="2 1"/>
							<text x="50" y="46" font-family="sans-serif" font-size="8" font-weight="bold" fill="#15803d" text-anchor="middle">VERIFIED</text>
							<text x="50" y="56" font-family="sans-serif" font-size="5.5" font-weight="bold" fill="#d4af37" text-anchor="middle">OFFICIAL</text>
							<text x="50" y="64" font-family="sans-serif" font-size="5" fill="#15803d" text-anchor="middle">SECURITY</text>
						</svg>
					</div>

					<!-- Right Tamper Badge -->
					<div style="position: absolute; top: 0px; right: 20px; text-align: center;">
						<svg width="55" height="55" viewBox="0 0 100 100">
							<circle cx="50" cy="50" r="46" fill="none" stroke="#16a34a" stroke-width="2.5"/>
							<circle cx="50" cy="50" r="38" fill="none" stroke="#d4af37" stroke-width="1.5" stroke-dasharray="3 2"/>
							<circle cx="50" cy="50" r="30" fill="#16a34a" opacity="0.08"/>
							<text x="50" y="44" font-family="sans-serif" font-size="7" font-weight="bold" fill="#15803d" text-anchor="middle">TAMPER</text>
							<text x="50" y="54" font-family="sans-serif" font-size="7" font-weight="bold" fill="#15803d" text-anchor="middle">EVIDENT</text>
							<text x="50" y="63" font-family="sans-serif" font-size="5.5" fill="#d4af37" text-anchor="middle">PROTECTED</text>
						</svg>
					</div>

					<img src="${logoData || "/bangladesh-anjumane-talamije-islamia-seeklogo.png"}" style="height: 64px; margin-bottom: 6px; display: inline-block;" />
					<h1 style="font-size: 21px; color: #1e293b; font-weight: bold; margin: 0; font-family: 'Playfair Display', Georgia, serif; letter-spacing: 0.5px;">${orgName}</h1>
					<h2 style="font-size: 13px; color: #475569; margin: 3px 0 0 0; font-family: 'Playfair Display', Georgia, serif; font-weight: 500;">${subHeader}</h2>
				</div>

				<!-- Main Body Content -->
				<div style="text-align: center; margin: 8px 0; position: relative; z-index: 2;">
					<div style="font-size: 42px; font-weight: 700; color: #581c87; margin-bottom: 8px; font-family: 'Playfair Display', Georgia, serif;">
						${certTitle}
					</div>
					<div style="font-size: 17px; color: #374151; font-style: italic; margin-bottom: 8px; font-family: 'Playfair Display', Georgia, serif;">
						This is to certify that
					</div>
					<div style="font-size: 52px; font-weight: 400; color: #4c1d95; margin-bottom: 8px; font-family: 'Great Vibes', cursive, Georgia, serif; line-height: 1.1;">
						${certData.fullName}
					</div>
					<div style="font-size: 17px; color: #4b5563; max-width: 850px; margin: 0 auto; line-height: 1.5; font-family: 'Playfair Display', Georgia, serif;">
						successfully registered and participated in the event
					</div>
					<div style="font-size: 28px; font-weight: 700; color: #111827; margin: 8px 0 6px 0; font-family: 'Playfair Display', Georgia, serif;">
						${certData.eventName}
					</div>
					<div style="font-size: 17px; color: #374151; font-style: italic; font-family: 'Playfair Display', Georgia, serif;">
						on ${dateStr}.
					</div>
				</div>

				<!-- Verification QR Code & Hash -->
				<div style="text-align: center; margin-bottom: 6px; position: relative; z-index: 2;">
					<div style="font-size: 9.5px; font-family: sans-serif; color: #64748b; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 3px;">
						VERIFICATION QR CODE
					</div>
					<div id="pdf-qr-box-${certData.registrationId}" style="display: inline-block; background: #fff; padding: 3px; border: 1px solid #e2e8f0; border-radius: 4px;"></div>
					<div style="font-family: monospace; font-size: 10.5px; color: #475569; font-weight: 600; margin-top: 3px;">
						ID: ${certData.certificateId}
					</div>
					<div style="font-family: monospace; font-size: 8.5px; color: #16a34a; font-weight: 700; margin-top: 2px;">
						${secHash}
					</div>
				</div>

				<!-- Bottom Signatures -->
				<div style="display: flex; justify-content: space-between; align-items: flex-end; padding: 0 50px 10px 50px; margin-bottom: 12px; position: relative; z-index: 2;">
					<!-- Left Signature (President) -->
					<div style="text-align: center; width: 250px;">
						<div style="height: 44px; position: relative; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 2px;">
							${presSigData ? `<img src="${presSigData}" style="height: 40px; max-width: 190px; object-fit: contain;" />` : `<svg viewBox="0 0 100 30" width="80" style="stroke: #64748b; fill: none; stroke-width: 1.2;"><path d="M10,20 Q30,5 50,22 T90,12"/></svg>`}
						</div>
						<div style="font-size: 13px; font-weight: bold; color: #1e293b; margin-top: 4px; font-family: 'Playfair Display', Georgia, serif;">${presName}</div>
						<div style="font-size: 10.5px; color: #64748b; font-family: 'Playfair Display', Georgia, serif;">${presTitle}</div>
					</div>

					<!-- Right Signature (Secretary) -->
					<div style="text-align: center; width: 250px;">
						<div style="height: 44px; position: relative; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 2px;">
							${secrSigData ? `<img src="${secrSigData}" style="height: 40px; max-width: 190px; object-fit: contain;" />` : `<svg viewBox="0 0 100 30" width="80" style="stroke: #64748b; fill: none; stroke-width: 1.2;"><path d="M15,15 Q35,25 45,10 T85,18"/></svg>`}
						</div>
						<div style="font-size: 13px; font-weight: bold; color: #1e293b; margin-top: 4px; font-family: 'Playfair Display', Georgia, serif;">${secrName}</div>
						<div style="font-size: 10.5px; color: #64748b; font-family: 'Playfair Display', Georgia, serif;">${secrTitle}</div>
					</div>
				</div>
			</div>
		`;

		document.body.appendChild(container);

		// Generate QR Code into container
		const qrBox = container.querySelector(`#pdf-qr-box-${certData.registrationId}`);
		if (qrBox) {
			const qrCanvas = document.createElement("canvas");
			await QRCodeMod.default.toCanvas(qrCanvas, qrValue, { width: 85, margin: 0 });
			qrBox.appendChild(qrCanvas);
		}

		try {
			const targetEl = container.firstElementChild as HTMLElement;
			const imgData = await htmlToImageMod.toJpeg(targetEl, {
				quality: 0.98,
				pixelRatio: 2,
				width: 1123,
				height: 794,
				skipFonts: true,
				fontEmbedCSS: "",
			});

			const pdf = new jsPDFMod({
				orientation: "landscape",
				unit: "mm",
				format: "a4",
			});

			pdf.addImage(imgData, "JPEG", 0, 0, 297, 210);
			pdf.save(`Certificate-${certData.fullName.replace(/\s+/g, "_")}-${certData.certificateId}.pdf`);
			toast.success("PDF downloaded successfully!");
		} catch (error) {
			console.error("PDF generation error details:", error);
			toast.error("Failed to generate PDF. Please try again.");
		} finally {
			if (container.parentNode) {
				container.parentNode.removeChild(container);
			}
		}
	};

	// Bulk PDF Downloads
	const handleDownloadBulkPDFs = async () => {
		const certsToDownload = participants.filter(
			(p) => selectedRegIds.includes(p.registrationId) && p.certificate
		);

		if (certsToDownload.length === 0) {
			toast.warning("None of the selected participants have certificates generated yet. Generate them first.");
			return;
		}

		setDownloadingBulk(true);
		toast.info(`Preparing ${certsToDownload.length} certificates for download...`);

		for (let i = 0; i < certsToDownload.length; i++) {
			const p = certsToDownload[i];
			const certData = {
				...p.certificate,
				fullName: p.fullName,
				eventAddress: p.certificate.eventAddress || activeEvent?.address || "",
			};
			await downloadPDF(certData);
			await new Promise((resolve) => setTimeout(resolve, 300));
		}

		setDownloadingBulk(false);
		toast.success("Bulk download complete!");
	};

	// Bulk Printing
	const handlePrintBulk = async () => {
		const certsToPrint = participants.filter(
			(p) => selectedRegIds.includes(p.registrationId) && p.certificate
		);

		if (certsToPrint.length === 0) {
			toast.warning("None of the selected participants have certificates generated yet. Generate them first.");
			return;
		}

		const formattedCerts = certsToPrint.map((p) => ({
			...p.certificate,
			fullName: p.fullName,
		}));

		setPrintCerts(formattedCerts);
	};

	// Trigger print when printCerts changes
	useEffect(() => {
		if (printCerts.length > 0) {
			setTimeout(() => {
				window.print();
				setPrintCerts([]);
			}, 500);
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
						size: landscape;
						margin: 0;
					}
					body * {
						visibility: hidden;
						background: none !important;
					}
					#print-capture-area, #print-capture-area * {
						visibility: visible;
					}
					#print-capture-area {
						position: absolute;
						left: 0;
						top: 0;
						width: 297mm;
						height: 210mm;
						margin: 0;
						padding: 0;
						background-color: white !important;
					}
					.print-certificate-page {
						width: 297mm;
						height: 210mm;
						box-sizing: border-box;
						page-break-after: always;
						break-after: page;
						border: 5px solid #16a34a !important;
						background: #ffffff !important;
						-webkit-print-color-adjust: exact;
						print-color-adjust: exact;
						display: flex !important;
						flex-direction: column;
						justify-content: space-between;
						padding: 25px;
						position: relative;
						overflow: hidden;
						margin: 0;
					}
					.print-border-inner {
						position: absolute;
						top: 8px;
						left: 8px;
						right: 8px;
						bottom: 8px;
						border: 1.5px solid #16a34a;
						pointer-events: none;
					}
				}
			`}</style>

			{/* Bulk printing container */}
			{printCerts.length > 0 && (
				<div id="print-capture-area" className="hidden print:block">
					{printCerts.map((cert) => (
						<div key={cert.certificateId} className="print-certificate-page">
							<div className="print-border-inner"></div>
							
							{/* Centered Circular Grid Watermark SVG */}
							<svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', opacity: 0.06, zIndex: 0 }}>
								<defs>
									<pattern id={`print-grid-${cert.certificateId}`} width="120" height="120" patternUnits="userSpaceOnUse">
										<circle cx="60" cy="60" r="55" fill="none" stroke="#16a34a" strokeWidth="0.8"/>
										<circle cx="60" cy="60" r="42" fill="none" stroke="#16a34a" strokeWidth="0.6"/>
										<circle cx="60" cy="60" r="28" fill="none" stroke="#16a34a" strokeWidth="0.5"/>
										<circle cx="60" cy="60" r="14" fill="none" stroke="#16a34a" strokeWidth="0.4"/>
									</pattern>
								</defs>
								<rect width="100%" height="100%" fill={`url(#print-grid-${cert.certificateId})`} />
							</svg>

							{/* Header */}
							<div className="text-center mt-4 relative z-10">
								<img 
									src="/bangladesh-anjumane-talamije-islamia-seeklogo.png" 
									className="h-16 mx-auto mb-2" 
									alt="Logo"
								/>
								<h1 className="text-xl font-bold text-slate-800 font-serif-title">
									Bangladesh Anjumane Talamije Islamia
								</h1>
								<p className="text-sm text-slate-600 font-serif-title">Chhatak Uttar Upazila</p>
							</div>

							{/* Title & Body */}
							<div className="text-center my-3 relative z-10">
								<h2 className="text-4xl font-bold text-purple-900 mb-3 font-serif-title">
									Certificate of Participation
								</h2>
								<p className="text-base italic text-slate-600 mb-2 font-serif-title">This is to certify that</p>
								<h3 className="text-5xl font-normal text-purple-950 mb-3 font-cert-name">
									{cert.fullName}
								</h3>
								<p className="text-base text-slate-600 max-w-xl mx-auto leading-relaxed font-serif-title">
									successfully registered and participated in the event
								</p>
								<h4 className="text-2xl font-bold text-slate-900 mt-2 mb-1 font-serif-title">
									{cert.eventName}
								</h4>
								<p className="text-base italic text-slate-700 font-serif-title">
									on {cert.eventDate || new Date(cert.generatedDate).toLocaleDateString()}.
								</p>
							</div>

							{/* QR Code Center */}
							<div className="text-center mb-1 relative z-10">
								<p className="text-[10px] font-sans text-slate-500 font-semibold tracking-wider mb-1">VERIFICATION QR CODE</p>
								<QRCodeSVG 
									value={`${window.location.origin}/verify/certificate/${cert.certificateId}`} 
									size={70}
									level="L"
									includeMargin={false}
									className="mx-auto"
								/>
								<p className="font-mono text-xs font-semibold text-slate-600 mt-1">ID: {cert.certificateId}</p>
								<p className="font-mono text-[9px] font-bold text-green-700">{getSecurityHash(cert.certificateId, cert.registrationId)}</p>
							</div>

							{/* Signatures */}
							<div className="flex justify-between items-end px-10 pb-4 relative z-10">
								<div className="text-center w-48 font-serif-title">
									<div className="h-9 relative flex items-end justify-center pb-0.5">
										{activeEvent?.presidentSignatureUrl ? (
											<img src={activeEvent.presidentSignatureUrl} className="h-8 max-w-[160px] object-contain mb-1" />
										) : (
											<svg viewBox="0 0 100 30" width="80" className="absolute bottom-1 left-8 stroke-slate-900 fill-none stroke-1.5">
												<path d="M10,20 Q30,5 50,22 T90,12" />
											</svg>
										)}
									</div>
									<p className="font-bold text-slate-800 text-sm mt-1">{activeEvent?.presidentName || "President"}</p>
									<p className="text-xs text-slate-500">{activeEvent?.presidentTitle || "Chhatak Uttar Upazila"}</p>
								</div>
								<div className="text-center w-48 font-serif-title">
									<div className="h-9 relative flex items-end justify-center pb-0.5">
										{activeEvent?.secretarySignatureUrl ? (
											<img src={activeEvent.secretarySignatureUrl} className="h-8 max-w-[160px] object-contain mb-1" />
										) : (
											<svg viewBox="0 0 100 30" width="80" className="absolute bottom-1 left-8 stroke-slate-900 fill-none stroke-1.5">
												<path d="M15,15 Q35,25 45,10 T85,18" />
											</svg>
										)}
									</div>
									<p className="font-bold text-slate-800 text-sm mt-1">{activeEvent?.secretaryName || "General Secretary"}</p>
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
						Generate, download, and print event certificates for participants.
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

				{/* Bulk actions */}
				{activeTab === "participants" && selectedRegIds.length > 0 && (
					<div className="flex flex-wrap gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0">
						<div className="text-sm font-medium text-slate-500 mr-2 flex items-center">
							{selectedRegIds.length} selected
						</div>
						<Button onClick={handleGenerateCertificates} disabled={generating} size="sm" className="bg-purple-700 hover:bg-purple-800 text-white">
							{generating ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
							Generate Certificates
						</Button>
						<Button
							onClick={handleDownloadBulkPDFs}
							variant="outline"
							disabled={downloadingBulk}
							size="sm"
						>
							{downloadingBulk ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <Download className="w-4 h-4 mr-1.5" />}
							Download PDFs
						</Button>
						<Button onClick={handlePrintBulk} variant="outline" size="sm">
							<Printer className="w-4 h-4 mr-1.5" />
							Print Selected
						</Button>
					</div>
				)}
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
																title="Preview"
																onClick={() => {
																	setPreviewCert({ ...cert, fullName: item.fullName });
																	setPreviewOpen(true);
																}}
															>
																<Eye className="w-4 h-4" />
															</Button>
															<Button
																variant="ghost"
																size="sm"
																className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900"
																title="Download PDF"
																onClick={() => downloadPDF({ ...cert, fullName: item.fullName })}
															>
																<Download className="w-4 h-4" />
															</Button>
															<Button
																variant="ghost"
																size="sm"
																className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900"
																title="Print"
																onClick={() => setPrintCerts([{ ...cert, fullName: item.fullName }])}
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
														title="Preview"
														onClick={() => {
															setPreviewCert(item);
															setPreviewOpen(true);
														}}
													>
														<Eye className="w-4 h-4" />
													</Button>
													<Button
														variant="ghost"
														size="sm"
														className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900"
														title="Reprint (PDF)"
														onClick={() => downloadPDF(item)}
													>
														<Download className="w-4 h-4" />
													</Button>
													<Button
														variant="ghost"
														size="sm"
														className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900"
														title="Print"
														onClick={() => setPrintCerts([item])}
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

			{/* Certificate Preview Dialog */}
			<Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
				<DialogContent className="max-w-4xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<Award className="w-5 h-5 text-purple-700" />
							Certificate Preview
						</DialogTitle>
						<DialogDescription>
							Preview of the issued certificate for {previewCert?.fullName}.
						</DialogDescription>
					</DialogHeader>

					{previewCert && (
						<div className="mt-4 flex flex-col items-center">
							{/* Certificate Card matching reference image design */}
							<div className="relative w-full max-w-[800px] aspect-[1.414] bg-white border-[3px] border-green-600 p-6 shadow-md rounded overflow-hidden flex flex-col justify-between select-none text-slate-900">
								{/* Centered Circular Background Watermark Seal */}
								<svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', opacity: 0.04, zIndex: 0 }} xmlns="http://www.w3.org/2000/svg">
									<circle cx="50%" cy="50%" r="35%" fill="none" stroke="#16a34a" strokeWidth="2"/>
									<circle cx="50%" cy="50%" r="28%" fill="none" stroke="#16a34a" strokeWidth="1.5"/>
									<circle cx="50%" cy="50%" r="20%" fill="none" stroke="#16a34a" strokeWidth="1.2"/>
									<circle cx="50%" cy="50%" r="12%" fill="none" stroke="#16a34a" strokeWidth="1"/>
								</svg>

								{/* Inner Green Border */}
								<div className="absolute top-1.5 left-1.5 right-1.5 bottom-1.5 border border-green-600 pointer-events-none z-10"></div>

								{/* Top Header */}
								<div className="text-center mt-2 relative z-20">
									{/* Holographic Security Badge */}
									<div className="absolute top-0 left-2 text-center">
										<svg width="45" height="45" viewBox="0 0 100 100" className="inline-block">
											<polygon points="50,5 64,18 82,18 88,36 100,50 88,64 82,82 64,82 50,95 36,82 18,82 12,64 0,50 12,36 18,18 36,18" fill="none" stroke="#d4af37" strokeWidth="3"/>
											<circle cx="50" cy="50" r="32" fill="#16a34a" opacity="0.1"/>
											<circle cx="50" cy="50" r="28" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeDasharray="2 1"/>
											<text x="50" y="46" fontFamily="sans-serif" fontSize="7" fontWeight="bold" fill="#15803d" textAnchor="middle">VERIFIED</text>
											<text x="50" y="55" fontFamily="sans-serif" fontSize="5" fontWeight="bold" fill="#d4af37" textAnchor="middle">OFFICIAL</text>
											<text x="50" y="62" fontFamily="sans-serif" fontSize="4.5" fill="#15803d" textAnchor="middle">SECURITY</text>
										</svg>
									</div>

									<img
										src="/bangladesh-anjumane-talamije-islamia-seeklogo.png"
										className="h-12 mx-auto mb-1.5 pointer-events-none"
										alt="Logo"
									/>
									<h2 className="text-sm font-bold text-slate-800 font-serif-title leading-tight">
										Bangladesh Anjumane Talamije Islamia
									</h2>
									<p className="text-xs text-slate-500 font-serif-title">Chhatak Uttar Upazila</p>
								</div>

								{/* Title & Body */}
								<div className="text-center relative z-20">
									<h3 className="text-3xl font-bold text-purple-900 mb-1 leading-tight font-serif-title">
										Certificate of Participation
									</h3>
									<p className="text-xs italic text-slate-500 mb-1 font-serif-title">This is to certify that</p>
									<h4 className="text-4xl font-normal text-purple-950 mb-1.5 leading-tight font-cert-name">
										{previewCert.fullName}
									</h4>
									<p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed font-serif-title">
										successfully registered and participated in the event
									</p>
									<h5 className="text-lg font-bold text-slate-900 mt-1 mb-0.5 font-serif-title">
										{previewCert.eventName}
									</h5>
									<p className="text-xs italic text-slate-700 font-serif-title">
										on {previewCert.eventDate || new Date(previewCert.generatedDate || Date.now()).toLocaleDateString()}.
									</p>
								</div>

								{/* Center QR Code */}
								<div className="text-center relative z-20">
									<p className="text-[8px] font-sans text-slate-400 font-semibold tracking-wider mb-0.5">VERIFICATION QR CODE</p>
									<QRCodeSVG
										value={`${window.location.origin}/verify/certificate/${previewCert.certificateId}`}
										size={52}
										level="L"
										includeMargin={false}
										className="mx-auto"
									/>
									<p className="font-mono text-[10px] font-semibold text-slate-600 mt-0.5">ID: {previewCert.certificateId}</p>
									<p className="font-mono text-[8px] font-bold text-green-700 mt-0.5">{getSecurityHash(previewCert.certificateId, previewCert.registrationId)}</p>
								</div>

								{/* Bottom Signatures */}
								<div className="flex justify-between items-end px-6 pb-2 relative z-20 font-serif-title">
									<div className="text-center w-40">
										<div className="h-6 relative flex items-end justify-center pb-0.5">
											{activeEvent?.presidentSignatureUrl ? (
												<img src={activeEvent.presidentSignatureUrl} className="h-5 max-w-[120px] object-contain mb-0.5" />
											) : (
												<svg viewBox="0 0 100 30" width="45" className="absolute bottom-0.5 stroke-slate-900 fill-none stroke-1.5">
													<path d="M10,20 Q30,5 50,22 T90,12" />
												</svg>
											)}
										</div>
										<p className="font-bold text-slate-800 text-xs mt-0.5">{activeEvent?.presidentName || "President"}</p>
										<p className="text-[9px] text-slate-400">{activeEvent?.presidentTitle || "Chhatak Uttar Upazila"}</p>
									</div>
									<div className="text-center w-40">
										<div className="h-6 relative flex items-end justify-center pb-0.5">
											{activeEvent?.secretarySignatureUrl ? (
												<img src={activeEvent.secretarySignatureUrl} className="h-5 max-w-[120px] object-contain mb-0.5" />
											) : (
												<svg viewBox="0 0 100 30" width="45" className="absolute bottom-0.5 stroke-slate-900 fill-none stroke-1.5">
													<path d="M15,15 Q35,25 45,10 T85,18" />
												</svg>
											)}
										</div>
										<p className="font-bold text-slate-800 text-xs mt-0.5">{activeEvent?.secretaryName || "General Secretary"}</p>
										<p className="text-[9px] text-slate-400">{activeEvent?.secretaryTitle || "Chhatak Uttar Upazila"}</p>
									</div>
								</div>
							</div>

							{/* Actions inside Modal */}
							<div className="flex justify-end gap-3 w-full mt-6">
								<Button
									variant="outline"
									onClick={() => downloadPDF(previewCert)}
									className="flex items-center gap-2"
								>
									<Download className="w-4 h-4" />
									Download PDF
								</Button>
								<Button
									onClick={() => setPrintCerts([previewCert])}
									className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white"
								>
									<Printer className="w-4 h-4" />
									Print Certificate
								</Button>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
