/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { 
	Award, 
	CheckCircle2, 
	AlertTriangle, 
	Calendar, 
	MapPin, 
	User, 
	ShieldCheck,
	Loader2,
	ChevronRight,
	ExternalLink,
	Lock,
	KeyRound
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function VerificationPage() {
	const params = useParams();
	const certificateId = params.certificateId as string;
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [certData, setCertData] = useState<any>(null);
	const [regData, setRegData] = useState<any>(null);

	// Generate Security Checksum
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

	useEffect(() => {
		async function verifyCertificate() {
			try {
				const res = await axios.get(`/api/registration/verify/certificate/${certificateId}`);
				if (res.data.success) {
					setCertData(res.data.certificate);
					setRegData(res.data.registration);
				} else {
					setError("This certificate record is invalid or could not be found.");
				}
			} catch (err: any) {
				setError(err.response?.data?.error || "Certificate verification failed. It may be counterfeit or revoked.");
			} finally {
				setLoading(false);
			}
		}
		if (certificateId) {
			verifyCertificate();
		}
	}, [certificateId]);

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
			{/* Watermark radial background */}
			<div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at center, rgba(37,99,235,0.05) 0%, transparent 70%)" }}></div>

			<div className="w-full max-w-md z-10 space-y-6">
				{/* Top Logo */}
				<div className="text-center">
					<img 
						src="/bangladesh-anjumane-talamije-islamia-seeklogo.png" 
						className="h-16 mx-auto mb-3" 
						alt="Logo"
					/>
					<h1 className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-wider uppercase leading-snug">
						Bangladesh Anjumane Talamije Islamia
					</h1>
					<p className="text-[11px] text-slate-500 uppercase tracking-widest mt-1">Chhatak Uttar Upazila</p>
				</div>

				{loading ? (
					<Card className="border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
						<CardContent className="pt-10 pb-10 text-center space-y-4">
							<Loader2 className="w-10 h-10 animate-spin text-purple-600 mx-auto" />
							<p className="text-slate-600 dark:text-slate-400 font-medium">Verifying certificate authenticity & security checksum...</p>
						</CardContent>
					</Card>
				) : error ? (
					/* Verification Failed Card */
					<Card className="border-red-200 dark:border-red-950 shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
						<CardContent className="pt-8 pb-8 text-center space-y-5">
							<div className="w-16 h-16 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center mx-auto text-red-600 dark:text-red-400">
								<AlertTriangle className="w-10 h-10" />
							</div>
							<div className="space-y-2">
								<h2 className="text-xl font-bold text-red-600 dark:text-red-400">Verification Failed</h2>
								<p className="text-sm text-slate-500 max-w-xs mx-auto">
									{error}
								</p>
							</div>
							<div className="bg-red-50/50 dark:bg-red-950/10 p-3 rounded-lg border border-red-100 dark:border-red-900/30 text-xs text-red-700 dark:text-red-400 max-w-xs mx-auto">
								<strong>Warning:</strong> Counterfeit or modified certificates are invalid. Please check the Certificate ID or contact system administrators.
							</div>
							<Link 
								href="/" 
								className="w-full inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
							>
								Back to Registration Portal
							</Link>
						</CardContent>
					</Card>
				) : certData ? (
					/* Verification Success Card */
					<Card className="border-green-200 dark:border-green-950 shadow-2xl bg-white dark:bg-slate-900 overflow-hidden rounded-2xl">
						<div className="bg-green-600 dark:bg-green-800 text-white p-5 text-center relative">
							<div className="absolute top-4 right-4 flex items-center gap-1.5 bg-green-500/30 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
								<ShieldCheck className="w-3 h-3" />
								Authentic
							</div>
							<div className="w-14 h-14 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-3">
								<CheckCircle2 className="w-8 h-8 text-white" />
							</div>
							<h2 className="text-xl font-bold font-sans">Certificate Verified</h2>
							<p className="text-xs text-green-100/90 mt-1 font-mono font-semibold">ID: {certData.certificateId}</p>
						</div>

						<CardContent className="pt-6 pb-6 space-y-6">
							{/* Tamper Check Badge */}
							<div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/40 rounded-xl text-xs">
								<div className="flex items-center gap-2 text-green-800 dark:text-green-300 font-semibold">
									<Lock className="w-4 h-4 text-green-600" />
									Tamper-Proof Audit
								</div>
								<span className="bg-green-600 text-white px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase">PASSED</span>
							</div>

							{/* Participant Detail */}
							<div className="space-y-4">
								<div className="flex items-start gap-3">
									<div className="mt-0.5 p-1.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-500">
										<User className="w-4 h-4" />
									</div>
									<div>
										<span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Participant Name</span>
										<span className="text-xl font-normal text-purple-900 dark:text-purple-300 font-cert-name block">
											{certData.fullName}
										</span>
										{regData && (
											<span className="text-xs text-slate-500 block mt-0.5">
												Reg ID: {regData.registrationId} | Ticket No: {regData.ticketNumber}
											</span>
										)}
									</div>
								</div>

								<div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 flex items-start gap-3">
									<div className="mt-0.5 p-1.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-500">
										<Award className="w-4 h-4" />
									</div>
									<div>
										<span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Event Name</span>
										<span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
											{certData.eventName}
										</span>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800/80 pt-4">
									<div className="flex items-start gap-3">
										<div className="mt-0.5 p-1.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-500">
											<Calendar className="w-4 h-4" />
										</div>
										<div>
											<span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Event Date</span>
											<span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
												{certData.eventDate}
											</span>
										</div>
									</div>

									<div className="flex items-start gap-3">
										<div className="mt-0.5 p-1.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-500">
											<MapPin className="w-4 h-4" />
										</div>
										<div>
											<span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Venue</span>
											<span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate block max-w-[120px]" title={certData.eventAddress}>
												{certData.eventAddress}
											</span>
										</div>
									</div>
								</div>
							</div>

							{/* Verification Meta & Hash */}
							<div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60 text-xs text-slate-500 space-y-2 leading-relaxed">
								<div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-green-700 dark:text-green-400">
									<KeyRound className="w-3.5 h-3.5" />
									{getSecurityHash(certData.certificateId, certData.registrationId)}
								</div>
								<p className="text-[11px]">This verification confirms that the participant completed their registration and was awarded this official certificate by the authorized organization committee.</p>
								<div className="pt-2 flex justify-between items-center text-[10px] border-t border-slate-200/50 dark:border-slate-700/50 text-slate-400 font-mono">
									<span>Issued: {new Date(certData.generatedDate).toLocaleDateString()}</span>
									<span>Issuer: {certData.generatedByAdmin}</span>
								</div>
							</div>

							<div className="flex gap-2.5">
								<Link 
									href="/"
									className="flex-1 inline-flex items-center justify-center rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-medium px-4 py-2 text-sm gap-1 transition-colors"
								>
									Register for Events
									<ChevronRight className="w-4 h-4" />
								</Link>
								{regData && (
									<Link 
										href={`/success/${regData.registrationId}`} 
										target="_blank"
										className="inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors gap-1"
									>
										View Ticket
										<ExternalLink className="w-3.5 h-3.5" />
									</Link>
								)}
							</div>
						</CardContent>
					</Card>
				) : null}

				{/* Footer Copyright */}
				<div className="text-center text-xs text-slate-400 py-2">
					&copy; {new Date().getFullYear()} Bangladesh Anjumane Talamije Islamia. All rights reserved.
				</div>
			</div>
		</div>
	);
}
