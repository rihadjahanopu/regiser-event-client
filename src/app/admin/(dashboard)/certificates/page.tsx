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
			<div style="width: 1123px; height: 794px; background: #ffffff; padding: 25px 35px 35px 35px; box-sizing: border-box; font-family: 'Playfair Display', Georgia, serif; position: relative; border: 8px solid #14532d; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; margin: 0; color: #0f172a;">
				<!-- Inner Gold Foil Border -->
				<div style="position: absolute; top: 10px; left: 10px; right: 10px; bottom: 10px; border: 2px solid #d97706; pointer-events: none; z-index: 1;"></div>
				<div style="position: absolute; top: 14px; left: 14px; right: 14px; bottom: 14px; border: 1px solid #166534; pointer-events: none; z-index: 1;"></div>

				<!-- Corner Golden Flourish Ornaments -->
				<svg width="60" height="60" viewBox="0 0 100 100" style="position: absolute; top: 16px; left: 16px; z-index: 2; pointer-events: none;">
					<path d="M5,5 L45,5 L45,12 L12,12 L12,45 L5,45 Z" fill="#d97706"/>
					<circle cx="20" cy="20" r="4" fill="#166534"/>
				</svg>
				<svg width="60" height="60" viewBox="0 0 100 100" style="position: absolute; top: 16px; right: 16px; z-index: 2; pointer-events: none;">
					<path d="M95,5 L55,5 L55,12 L88,12 L88,45 L95,45 Z" fill="#d97706"/>
					<circle cx="80" cy="20" r="4" fill="#166534"/>
				</svg>
				<svg width="60" height="60" viewBox="0 0 100 100" style="position: absolute; bottom: 16px; left: 16px; z-index: 2; pointer-events: none;">
					<path d="M5,95 L45,95 L45,88 L12,88 L12,55 L5,55 Z" fill="#d97706"/>
					<circle cx="20" cy="80" r="4" fill="#166534"/>
				</svg>
				<svg width="60" height="60" viewBox="0 0 100 100" style="position: absolute; bottom: 16px; right: 16px; z-index: 2; pointer-events: none;">
					<path d="M95,95 L55,95 L55,88 L88,88 L88,55 L95,55 Z" fill="#d97706"/>
					<circle cx="80" cy="80" r="4" fill="#166534"/>
				</svg>
				
				<!-- Watermark Seal & Logo -->
				<svg width="100%" height="100%" style="position: absolute; top:0; left:0; pointer-events:none; opacity: 0.035; z-index:0;" xmlns="http://www.w3.org/2000/svg">
					<circle cx="561" cy="397" r="280" fill="none" stroke="#16a34a" stroke-width="2"/>
					<circle cx="561" cy="397" r="220" fill="none" stroke="#d97706" stroke-width="1.5"/>
					<circle cx="561" cy="397" r="160" fill="none" stroke="#16a34a" stroke-width="1.2"/>
					<circle cx="561" cy="397" r="100" fill="none" stroke="#d97706" stroke-width="1"/>
				</svg>

				<!-- Rounded Center Watermark Logo -->
				<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 340px; height: 340px; opacity: 0.055; pointer-events: none; z-index: 0; display: flex; align-items: center; justify-content: center;">
					<img src="${logoData || "/bangladesh-anjumane-talamije-islamia-seeklogo.png"}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 50%;" />
				</div>

				<!-- Header Section -->
				<div style="text-align: center; margin-top: 5px; position: relative; z-index: 2;">
					<div style="font-family: 'Traditional Arabic', 'Amiri', 'DejaVu Sans', serif; font-size: 22px; color: #15803d; font-weight: bold; margin-bottom: 12px; line-height: 1;">﷽</div>
					<img src="${logoData || "/bangladesh-anjumane-talamije-islamia-seeklogo.png"}" style="height: 68px; width: 68px; border-radius: 50%; object-fit: contain; margin-bottom: 6px; display: inline-block; background: #ffffff; padding: 2px; border: 2px solid #d97706; box-shadow: 0 2px 8px rgba(0,0,0,0.06);" />
					<h1 style="font-size: 22px; color: #0f172a; font-weight: bold; margin: 0; font-family: 'Playfair Display', Georgia, serif; letter-spacing: 0.8px;">${orgName}</h1>
					<h2 style="font-size: 13.5px; color: #475569; margin: 3px 0 0 0; font-family: 'Playfair Display', Georgia, serif; font-weight: 500; letter-spacing: 0.5px;">${subHeader}</h2>
				</div>

				<!-- Main Body Content -->
				<div style="text-align: center; margin: 6px 0; position: relative; z-index: 2;">
					<div style="font-size: 38px; font-weight: 700; color: #581c87; margin-bottom: 4px; font-family: 'Playfair Display', Georgia, serif; letter-spacing: 1.5px; text-transform: uppercase;">
						${certTitle}
					</div>
					<div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 8px;">
						<div style="width: 70px; height: 1px; background: linear-gradient(to right, transparent, #d97706);"></div>
						<span style="color: #d97706; font-size: 12px;">✦</span>
						<div style="width: 70px; height: 1px; background: linear-gradient(to left, transparent, #d97706);"></div>
					</div>
					<div style="font-size: 17px; color: #475569; font-style: italic; margin-bottom: 8px; font-family: 'Playfair Display', Georgia, serif;">
						This is to certify that
					</div>
					<div style="font-size: 54px; font-weight: 400; color: #3b0764; margin-bottom: 8px; font-family: 'Great Vibes', cursive, Georgia, serif; line-height: 1.1;">
						${certData.fullName}
					</div>
					<div style="font-size: 17px; color: #4b5563; max-width: 850px; margin: 0 auto; line-height: 1.5; font-family: 'Playfair Display', Georgia, serif;">
						successfully registered and participated in the event
					</div>
					<div style="font-size: 28px; font-weight: 700; color: #0f172a; margin: 8px 0 6px 0; font-family: 'Playfair Display', Georgia, serif;">
						${certData.eventName}
					</div>
					<div style="font-size: 17px; color: #374151; font-style: italic; font-family: 'Playfair Display', Georgia, serif;">
						on ${dateStr}.
					</div>
				</div>

				<!-- Verification QR Code & Security Badge Frame -->
				<div style="text-align: center; margin-bottom: 4px; position: relative; z-index: 2;">
					<div style="font-size: 9px; font-family: sans-serif; color: #d97706; font-weight: 700; letter-spacing: 1.5px; margin-bottom: 4px; text-transform: uppercase;">
						Official Security Verification
					</div>
					<div id="pdf-qr-box-${certData.registrationId}" style="display: inline-block; background: #ffffff; padding: 5px; border: 2px solid #f59e0b; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.04);"></div>
					<div style="font-family: 'Courier New', monospace; font-size: 11px; color: #1e293b; font-weight: 700; margin-top: 4px; letter-spacing: 0.5px;">
						ID: ${certData.certificateId}
					</div>
					<div style="font-family: 'Courier New', monospace; font-size: 8.5px; color: #16a34a; font-weight: 700; margin-top: 2px;">
						${secHash}
					</div>
				</div>

				<!-- Bottom Signatures -->
				<div style="display: flex; justify-content: space-between; align-items: flex-end; padding: 0 60px 0 60px; position: relative; z-index: 2;">
					<!-- Left Signature (President) -->
					<div style="text-align: center; width: 240px; margin-bottom: 50px;">
						<div style="height: 48px; position: relative; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 2px;">
							${presSigData ? `<img src="${presSigData}" style="height: 44px; max-width: 190px; object-fit: contain;" />` : ''}
						</div>
						<div style="border-top: 1.5px solid #cbd5e1; margin: 4px auto 6px auto; width: 170px;"></div>
						<div style="font-size: 13.5px; font-weight: bold; color: #0f172a; font-family: 'Playfair Display', Georgia, serif;">${presName}</div>
						<div style="font-size: 10.5px; color: #64748b; font-family: 'Playfair Display', Georgia, serif; margin-top: 2px;">${presTitle}</div>
					</div>

					<!-- Right Signature (Secretary) -->
					<div style="text-align: center; width: 240px; margin-bottom: 50px;">
						<div style="height: 48px; position: relative; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 2px;">
							${secrSigData ? `<img src="${secrSigData}" style="height: 44px; max-width: 190px; object-fit: contain;" />` : ''}
						</div>
						<div style="border-top: 1.5px solid #cbd5e1; margin: 4px auto 6px auto; width: 170px;"></div>
						<div style="font-size: 13.5px; font-weight: bold; color: #0f172a; font-family: 'Playfair Display', Georgia, serif;">${secrName}</div>
						<div style="font-size: 10.5px; color: #64748b; font-family: 'Playfair Display', Georgia, serif; margin-top: 2px;">${secrTitle}</div>
					</div>
				</div>
			</div>
		`;

		document.body.appendChild(container);

		// Generate High-Density QR Code canvas
		const qrBox = container.querySelector(`#pdf-qr-box-${certData.registrationId}`);
		if (qrBox) {
			const qrCanvas = document.createElement("canvas");
			await QRCodeMod.default.toCanvas(qrCanvas, qrValue, {
				width: 360,
				margin: 1,
				color: {
					dark: "#1e1b4b",
					light: "#ffffff",
				},
				errorCorrectionLevel: "H",
			});
			qrCanvas.style.width = "85px";
			qrCanvas.style.height = "85px";
			qrCanvas.style.display = "block";
			qrBox.appendChild(qrCanvas);
		}

		try {
			const targetEl = container.firstElementChild as HTMLElement;

			// Monkey-patch to suppress cross-origin cssRules SecurityError
			// html-to-image internally iterates document.styleSheets; cross-origin sheets throw
			const patchedGetStyleSheets = () => {
				const sheets: CSSStyleSheet[] = [];
				for (const sheet of Array.from(document.styleSheets)) {
					try {
						// eslint-disable-next-line @typescript-eslint/no-unused-expressions
						sheet.cssRules; // test access — throws if cross-origin
						sheets.push(sheet);
					} catch {
						// skip cross-origin sheet silently
					}
				}
				return sheets;
			};

			const imgData = await htmlToImageMod.toPng(targetEl, {
				quality: 1.0,
				pixelRatio: 4,
				width: 1123,
				height: 794,
				cacheBust: true,
				skipFonts: false,
				filter: (node: HTMLElement) => {
					// Skip external <link rel="stylesheet"> tags — these are cross-origin
					// and cause "Cannot access cssRules" SecurityError in html-to-image
					if (
						node.tagName === "LINK" &&
						(node as HTMLLinkElement).rel === "stylesheet" &&
						!(node as HTMLLinkElement).href?.startsWith(window.location.origin)
					) {
						return false;
					}
					return true;
				},
				// Provide a custom font embed function that safely skips cross-origin sheets
				fontEmbedCSS: (() => {
					try {
						const safeSheets = patchedGetStyleSheets();
						return safeSheets
							.map((sheet) => {
								try {
									return Array.from(sheet.cssRules)
										.map((r) => r.cssText)
										.join("\n");
								} catch {
									return "";
								}
							})
							.join("\n");
					} catch {
						return "";
					}
				})(),
			});


			const pdf = new jsPDFMod({
				orientation: "landscape",
				unit: "mm",
				format: "a4",
				compress: true,
			});

			pdf.addImage(imgData, "PNG", 0, 0, 297, 210, undefined, "FAST");
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
						size: A4 landscape;
						margin: 0mm;
					}
					html, body {
						width: 297mm;
						height: 210mm;
						margin: 0;
						padding: 0;
					}
					body * {
						visibility: hidden;
						background: none !important;
					}
					#print-capture-area, #print-capture-area * {
						visibility: visible;
					}
					#print-capture-area {
						position: fixed;
						left: 0;
						top: 0;
						width: 297mm;
						margin: 0;
						padding: 0;
						background: white !important;
					}
					.print-certificate-page {
						width: 297mm;
						height: 210mm;
						max-height: 210mm;
						box-sizing: border-box;
						page-break-after: always;
						break-after: page;
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
						margin: 0;
						color: #0f172a;
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
								<div className="flex items-center justify-center gap-3.5 my-1.5">
									<div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-600"></div>
									<span className="text-amber-600 text-xs">✦</span>
									<div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-600"></div>
								</div>
								<p className="text-base italic text-slate-600 mb-1.5 font-serif-title">This is to certify that</p>
								<h3 className="text-5xl font-normal text-purple-950 mb-2 leading-tight font-cert-name">
									{cert.fullName}
								</h3>
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
								<p className="font-mono text-xs font-semibold text-slate-600 mt-1">ID: {cert.certificateId}</p>
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
				<DialogContent className="w-11/12 max-w-4xl max-h-[92vh] flex flex-col justify-between overflow-y-auto p-4 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
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
						<div className="mt-2 flex flex-col items-center w-full">
							{/* Scrollable Certificate Card Container */}
							<div className="w-full overflow-x-auto py-2 flex justify-center items-start">
								<div className="relative bg-white border-[7px] border-green-900 shadow-lg rounded select-none text-slate-900 flex flex-col justify-between" style={{ width: '760px', minWidth: '760px', aspectRatio: '1.414' }}>
									{/* Inner Gold Foil Borders */}
									<div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', bottom: '10px', border: '2px solid #d97706', pointerEvents: 'none', zIndex: 1 }}></div>
									<div style={{ position: 'absolute', top: '14px', left: '14px', right: '14px', bottom: '14px', border: '1px solid #166534', pointerEvents: 'none', zIndex: 1 }}></div>

									{/* Corner Golden Flourish Ornaments */}
									<svg width="60" height="60" viewBox="0 0 100 100" style={{ position: 'absolute', top: '14px', left: '14px', zIndex: 2, pointerEvents: 'none' }}>
										<path d="M5,5 L45,5 L45,12 L12,12 L12,45 L5,45 Z" fill="#d97706"/>
										<circle cx="20" cy="20" r="4" fill="#166534"/>
									</svg>
									<svg width="60" height="60" viewBox="0 0 100 100" style={{ position: 'absolute', top: '14px', right: '14px', zIndex: 2, pointerEvents: 'none' }}>
										<path d="M95,5 L55,5 L55,12 L88,12 L88,45 L95,45 Z" fill="#d97706"/>
										<circle cx="80" cy="20" r="4" fill="#166534"/>
									</svg>
									<svg width="60" height="60" viewBox="0 0 100 100" style={{ position: 'absolute', bottom: '14px', left: '14px', zIndex: 2, pointerEvents: 'none' }}>
										<path d="M5,95 L45,95 L45,88 L12,88 L12,55 L5,55 Z" fill="#d97706"/>
										<circle cx="20" cy="80" r="4" fill="#166534"/>
									</svg>
									<svg width="60" height="60" viewBox="0 0 100 100" style={{ position: 'absolute', bottom: '14px', right: '14px', zIndex: 2, pointerEvents: 'none' }}>
										<path d="M95,95 L55,95 L55,88 L88,88 L88,55 L95,55 Z" fill="#d97706"/>
										<circle cx="80" cy="80" r="4" fill="#166534"/>
									</svg>

									{/* Centered Background Watermark Seal */}
									<svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', opacity: 0.035, zIndex: 0 }} xmlns="http://www.w3.org/2000/svg">
										<circle cx="50%" cy="50%" r="35%" fill="none" stroke="#16a34a" strokeWidth="2"/>
										<circle cx="50%" cy="50%" r="28%" fill="none" stroke="#d97706" strokeWidth="1.5"/>
										<circle cx="50%" cy="50%" r="20%" fill="none" stroke="#16a34a" strokeWidth="1.2"/>
										<circle cx="50%" cy="50%" r="12%" fill="none" stroke="#d97706" strokeWidth="1"/>
									</svg>

									{/* Rounded Center Watermark Logo */}
									<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-[0.055] pointer-events-none z-0 flex items-center justify-center">
										<img src="/bangladesh-anjumane-talamije-islamia-seeklogo.png" className="w-full h-full object-contain rounded-full" alt="Watermark Logo" />
									</div>

									{/* Top Header */}
									<div className="text-center mt-2 relative z-20 px-4">
										<div className="font-serif text-xl text-emerald-700 font-bold mb-2">﷽</div>
										<img
											src="/bangladesh-anjumane-talamije-islamia-seeklogo.png"
											className="h-12 w-12 rounded-full object-contain mx-auto mb-1.5 pointer-events-none p-0.5 border-2 border-amber-600 bg-white shadow-sm"
											alt="Logo"
										/>
										<h2 className="text-base font-bold text-slate-800 font-serif-title leading-tight tracking-wide">
											Bangladesh Anjumane Talamije Islamia
										</h2>
										<p className="text-xs text-slate-500 font-serif-title">Chhatak Uttar Upazila</p>
									</div>

									{/* Title & Body */}
									<div className="text-center relative z-20 my-1">
										<h3 className="text-3xl font-bold text-purple-900 mb-0.5 leading-none font-serif-title uppercase tracking-wider whitespace-nowrap">
											Certificate of Participation
										</h3>
										<div className="flex items-center justify-center gap-3 my-1.5">
											<div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-600"></div>
											<span className="text-amber-600 text-xs">✦</span>
											<div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-600"></div>
										</div>
										<p className="text-xs italic text-slate-500 mb-0.5 font-serif-title">This is to certify that</p>
										<h4 className="text-4xl font-normal text-purple-950 mb-1 leading-tight font-cert-name">
											{previewCert.fullName}
										</h4>
										<p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed font-serif-title">
											successfully registered and participated in the event
										</p>
										<h5 className="text-lg font-bold text-slate-900 mt-0.5 mb-0.5 font-serif-title">
											{previewCert.eventName}
										</h5>
										<p className="text-xs italic text-slate-700 font-serif-title">
											on {previewCert.eventDate || new Date(previewCert.generatedDate || Date.now()).toLocaleDateString()}.
										</p>
									</div>

									{/* Center QR Code */}
									<div className="text-center relative z-20 my-0.5">
										<p className="text-[8px] font-sans text-amber-600 font-bold tracking-widest uppercase mb-0.5">Official Security Verification</p>
										<div className="inline-block p-1 bg-white border border-amber-500 rounded shadow-xs">
											<QRCodeSVG
												value={`${window.location.origin}/verify/certificate/${previewCert.certificateId}`}
												size={52}
												level="H"
												includeMargin={false}
												fgColor="#1e1b4b"
												className="mx-auto"
											/>
										</div>
										<p className="font-mono text-[10px] font-semibold text-slate-600 mt-0.5">ID: {previewCert.certificateId}</p>
										<p className="font-mono text-[8px] font-bold text-green-700 mt-0.5">{getSecurityHash(previewCert.certificateId, previewCert.registrationId)}</p>
									</div>

									{/* Bottom Signatures */}
									<div className="flex justify-between items-end px-6 pb-5 mb-[50px] relative z-20 font-serif-title">
										<div className="text-center w-40">
											<div className="h-6 relative flex items-end justify-center pb-0.5">
												{activeEvent?.presidentSignatureUrl ? (
													<img src={activeEvent.presidentSignatureUrl} className="h-5 max-w-[120px] object-contain mb-0.5" />
												) : null}
											</div>
											<div className="border-t border-slate-300 w-28 mx-auto my-0.5"></div>
											<p className="font-bold text-slate-800 text-xs mt-0.5">{activeEvent?.presidentName || "President"}</p>
											<p className="text-[9px] text-slate-400">{activeEvent?.presidentTitle || "Chhatak Uttar Upazila"}</p>
										</div>
										<div className="text-center w-40">
											<div className="h-6 relative flex items-end justify-center pb-0.5">
												{activeEvent?.secretarySignatureUrl ? (
													<img src={activeEvent.secretarySignatureUrl} className="h-5 max-w-[120px] object-contain mb-0.5" />
												) : null}
											</div>
											<div className="border-t border-slate-300 w-28 mx-auto my-0.5"></div>
											<p className="font-bold text-slate-800 text-xs mt-0.5">{activeEvent?.secretaryName || "General Secretary"}</p>
											<p className="text-[9px] text-slate-400">{activeEvent?.secretaryTitle || "Chhatak Uttar Upazila"}</p>
										</div>
									</div>
								</div>
							</div>

							{/* Actions inside Modal */}
							<div className="flex flex-col sm:flex-row justify-end gap-3 w-full mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
								<Button
									variant="outline"
									onClick={() => {
										const certData = {
											...previewCert,
											fullName: previewCert.fullName,
											eventAddress: previewCert.eventAddress || activeEvent?.address || "",
										};
										downloadPDF(certData);
									}}
									className="flex items-center justify-center gap-2 cursor-pointer"
								>
									<Download className="w-4 h-4" />
									Download PDF
								</Button>
								<Button
									onClick={() => {
										const certData = {
											...previewCert,
											fullName: previewCert.fullName,
											eventAddress: previewCert.eventAddress || activeEvent?.address || "",
										};
										setPrintCerts([certData]);
									}}
									className="flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-800 text-white cursor-pointer"
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
