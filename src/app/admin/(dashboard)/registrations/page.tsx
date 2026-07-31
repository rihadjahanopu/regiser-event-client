/* eslint-disable */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
	ChevronLeft,
	ChevronRight,
	Download,
	Edit2,
	Eye,
	Loader2,
	MoreHorizontal,
	Loader2 as PdfLoader,
	Search,
	Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function RegistrationsPage() {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState("All");
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [total, setTotal] = useState(0);
	const [exportLoading, setExportLoading] = useState<"excel" | "pdf" | null>(
		null
	);

	const [editModalOpen, setEditModalOpen] = useState(false);
	const [editData, setEditData] = useState<any>(null);
	const [saving, setSaving] = useState(false);

	// View State
	const [viewModalOpen, setViewModalOpen] = useState(false);
	const [viewData, setViewData] = useState<any>(null);

	const fetchRegistrations = async () => {
		setLoading(true);
		try {
			const response = await axios.get("/api/admin/registrations", {
				params: { page, limit: 10, search, status },
			});

			const result = response.data;
			if (result.success) {
				setData(result.data);
				setTotalPages(result.totalPages);
				setTotal(result.total);
			} else {
				toast.error(result.error);
			}
		} catch (error: any) {
			toast.error(
				error.response?.data?.error || "Failed to fetch registrations."
			);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (
			!window.confirm(
				"Are you sure you want to delete this registration? This action cannot be undone."
			)
		)
			return;
		try {
			const response = await axios.delete(`/api/admin/registrations/${id}`);
			if (response.data.success) {
				toast.success("Registration deleted successfully");
				fetchRegistrations();
			} else {
				toast.error(response.data.error);
			}
		} catch (error: any) {
			toast.error(
				error.response?.data?.error || "Failed to delete registration"
			);
		}
	};

	const handleUpdate = async () => {
		if (!editData) return;
		setSaving(true);
		try {
			const response = await axios.put(
				`/api/admin/registrations/${editData.registrationId}`,
				{
					fullName: editData.fullName,
					mobile: editData.mobile,
					status: editData.status,
				}
			);
			if (response.data.success) {
				toast.success("Registration updated successfully");
				setEditModalOpen(false);
				fetchRegistrations();
			} else {
				toast.error(response.data.error);
			}
		} catch (error: any) {
			toast.error(
				error.response?.data?.error || "Failed to update registration"
			);
		} finally {
			setSaving(false);
		}
	};

	// Debounced search
	useEffect(() => {
		const timer = setTimeout(() => {
			setPage(1);
			fetchRegistrations();
		}, 500);
		return () => clearTimeout(timer);
	}, [search, status]);

	// Pagination effect
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		fetchRegistrations();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page]);

	const exportExcel = async () => {
		setExportLoading("excel");
		try {
			// Fetch ALL registrations for export

			const response = await axios.get("/api/admin/registrations", {
				params: { page: 1, limit: 10000, search, status },
			});

			const rows = response.data.data;

			const { utils, writeFile } = await import("xlsx");
			const ws = utils.json_to_sheet(
				rows.map((r: any, index: number) => ({
					"S.N.": index + 1,
					"Registration ID": r.registrationId,
					"Ticket No": r.ticketNumber,
					"Full Name": r.fullName,
					Mobile: r.mobile,
					Email: r.email || "",
					Gender: r.gender,
					DOB: r.dob || "",
					"Blood Group": r.bloodGroup || "",
					"Father's Name": r.fatherName || "",
					"School/College": r.schoolName,
					Class: r.class,
					"Subject Group": r.subjectGroup,
					"Roll No": r.rollNumber || "",
					"Passing Year": r.passingYear || "",
					"GPA/Grade": r.gradeGpa || "",
					Address: r.address || "",
					District: r.district,
					"Registration Number": r.regNumber || r.registrationNumber || "",
					"Emergency Contact": r.emergencyContact || "",
					Status: r.status,
					Date: new Date(r.registrationDate).toLocaleDateString(),
				}))
			);
			const wb = utils.book_new();
			utils.book_append_sheet(wb, ws, "Registrations");
			writeFile(wb, `registrations-${Date.now()}.xlsx`);
			toast.success(`Exported ${rows.length} registrations to Excel!`);
		} catch (err) {
			toast.error("Failed to export Excel");
		} finally {
			setExportLoading(null);
		}
	};

	const exportPDF = async () => {
		setExportLoading("pdf");
		try {
			const response = await axios.get("/api/admin/registrations", {
				params: { page: 1, limit: 10000, search, status },
			});
			const rows = response.data.data;

			const jsPDF = (await import("jspdf")).jsPDF;
			const autoTable = (await import("jspdf-autotable")).default;

			const doc = new jsPDF({ orientation: "landscape" });
			doc.setFontSize(14); // ফন্ট সাইজ ছোট করা হলো
			doc.text(
				"Bangladesh Anjumane Talamije Islamia, Chhatak Uttar Upazila",
				14,
				15
			);
			doc.setFontSize(10);
			doc.text(
				`Generated: ${new Date().toLocaleString()} | Total: ${rows.length} | Developed by Rihad`,
				14,
				22
			);

			autoTable(doc, {
				startY: 28,
				head: [
					[
						"S.N.",
						"ID",
						"Name",
						"Mobile",
						"Institution",
						"Class",
						"Passing",
						"GPA",
						"Group",
						"Address",
						"Blood",
						"Reg",
						"Roll",
					],
				],
				body: rows.map((r: any, index: number) => [
					index + 1,
					r.registrationId,
					r.fullName,
					r.mobile,
					r.schoolName,
					r.class,
					r.passingYear || "",
					r.gradeGpa || "",
					r.subjectGroup,
					r.address,
					r.bloodGroup || "",
					r.regNumber || r.registrationNumber || "",
					r.rollNumber || "",
				]),
				styles: { fontSize: 8 },
				headStyles: { fillColor: [37, 99, 235] },
				alternateRowStyles: { fillColor: [248, 250, 252] },
			});

			doc.save(`registrations-${Date.now()}.pdf`);
			toast.success(`Exported ${rows.length} registrations to PDF!`);
		} catch (err) {
			console.error(err);
			toast.error("Failed to export PDF");
		} finally {
			setExportLoading(null);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-5">
				<div>
					<h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
						Registrations
					</h1>
					<p className="text-slate-400 text-xs mt-1">
						Manage all event participants ({total} total registrations)
					</p>
				</div>
				<div className="flex flex-wrap gap-2">
					<Button
						onClick={exportExcel}
						disabled={exportLoading === "excel"}
						className="bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold rounded-xl">
						{exportLoading === "excel" ?
							<PdfLoader className="mr-2 h-3.5 w-3.5 animate-spin" />
						:	<Download className="mr-2 h-3.5 w-3.5 text-violet-400" />}
						Excel Export
					</Button>
					<Button
						onClick={exportPDF}
						disabled={exportLoading === "pdf"}
						className="bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold rounded-xl">
						{exportLoading === "pdf" ?
							<PdfLoader className="mr-2 h-3.5 w-3.5 animate-spin" />
						:	<Download className="mr-2 h-3.5 w-3.5 text-indigo-400" />}
						PDF Export
					</Button>
				</div>
			</div>

			<div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#0c0c16] p-4 rounded-2xl shadow-xl border border-white/5">
				<div className="relative w-full sm:w-72">
					<Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
					<Input
						placeholder="Search by name, mobile, ID..."
						className="pl-10 bg-white/5 border-white/10 text-white placeholder-slate-500 rounded-xl text-sm"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
				<div className="w-full sm:w-48">
					<Select
						value={status}
						onValueChange={(val) => setStatus(val ?? "All")}>
						<SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl text-sm">
							<SelectValue placeholder="Filter by status" />
						</SelectTrigger>
						<SelectContent className="bg-[#0c0c16] border-white/10 text-white">
							<SelectItem value="All">All Statuses</SelectItem>
							<SelectItem value="Verified">Verified</SelectItem>
							<SelectItem value="Pending">Pending</SelectItem>
							<SelectItem value="Invalid">Invalid</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="bg-[#0c0c16] rounded-2xl shadow-xl border border-white/5 overflow-hidden">
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow className="bg-white/[0.02] border-b border-white/5 text-slate-400">
								<TableHead className="w-12 text-center text-slate-400 font-extrabold uppercase text-[11px]">S.N.</TableHead>
								<TableHead className="text-slate-400 font-extrabold uppercase text-[11px]">Registration ID</TableHead>
								<TableHead className="text-slate-400 font-extrabold uppercase text-[11px]">Name</TableHead>
								<TableHead className="text-slate-400 font-extrabold uppercase text-[11px]">Mobile</TableHead>
								<TableHead className="text-slate-400 font-extrabold uppercase text-[11px]">School / College</TableHead>
								<TableHead className="text-slate-400 font-extrabold uppercase text-[11px]">Date</TableHead>
								<TableHead className="text-slate-400 font-extrabold uppercase text-[11px]">Status</TableHead>
								<TableHead className="text-right text-slate-400 font-extrabold uppercase text-[11px]">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{loading ?
								<TableRow>
									<TableCell
										colSpan={8}
										className="h-32 text-center">
										<Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-600" />
									</TableCell>
								</TableRow>
							: data.length === 0 ?
								<TableRow>
									<TableCell
										colSpan={8}
										className="h-32 text-center text-slate-500">
										No registrations found.
									</TableCell>
								</TableRow>
							:	data.map((item, index) => (
									<TableRow key={item._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
										<TableCell className="font-medium text-slate-500 text-center">
											{(page - 1) * 10 + index + 1}
										</TableCell>
										<TableCell className="font-mono text-xs text-violet-300 font-semibold">
											{item.registrationId}
										</TableCell>
										<TableCell className="font-semibold text-white">
											{item.fullName}
										</TableCell>
										<TableCell className="text-slate-300 text-xs">{item.mobile}</TableCell>
										<TableCell
											className="max-w-[150px] truncate text-slate-300 text-xs"
											title={item.schoolName}>
											{item.schoolName}
										</TableCell>
										<TableCell className="text-slate-400 text-xs">
											{new Date(item.registrationDate).toLocaleDateString()}
										</TableCell>
										<TableCell>
											<span
												className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
													item.status === "Verified"
														? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
														: item.status === "Pending"
														? "bg-amber-500/10 text-amber-400 border-amber-500/20"
														: "bg-red-500/10 text-red-400 border-red-500/20"
												}`}>
												{item.status}
											</span>
										</TableCell>
										<TableCell className="text-right">
											<DropdownMenu>
												<DropdownMenuTrigger
													render={
														<Button
															variant="ghost"
															className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl"
														/>
													}>
													<span className="sr-only">Open menu</span>
													<MoreHorizontal className="h-4 w-4" />
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end" className="bg-[#0c0c16] border-white/10 text-white">
													<DropdownMenuGroup>
														<DropdownMenuLabel className="text-slate-400 text-xs font-bold uppercase">Actions</DropdownMenuLabel>

														<DropdownMenuItem
															className="hover:bg-white/5 cursor-pointer text-xs"
															onClick={() => {
																setViewData(item);
																setViewModalOpen(true);
															}}>
															<Eye className="mr-2 h-3.5 w-3.5 text-violet-400" />
															View Details
														</DropdownMenuItem>

														<DropdownMenuItem
															className="hover:bg-white/5 cursor-pointer text-xs"
															onClick={() => {
																setEditData(item);
																setEditModalOpen(true);
															}}>
															<Edit2 className="mr-2 h-3.5 w-3.5 text-indigo-400" />
															Edit
														</DropdownMenuItem>

														<DropdownMenuItem
															className="hover:bg-white/5 cursor-pointer text-xs"
															onClick={() => {
																navigator.clipboard.writeText(
																	item.registrationId
																);
																toast.success("Registration ID copied!");
															}}>
															Copy ID
														</DropdownMenuItem>

														<DropdownMenuItem
															className="text-red-400 hover:bg-red-500/10 cursor-pointer text-xs"
															onClick={() => handleDelete(item.registrationId)}>
															<Trash2 className="mr-2 h-3.5 w-3.5" />
															Delete
														</DropdownMenuItem>
													</DropdownMenuGroup>
													<DropdownMenuSeparator className="bg-white/5" />
													<DropdownMenuItem
														className="hover:bg-white/5 cursor-pointer text-xs"
														render={
															<Link
																href={`/success/${item.registrationId}`}
																target="_blank"
															/>
														}>
														<Eye className="mr-2 h-3.5 w-3.5 text-emerald-400" />
														View Ticket
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))
							}
						</TableBody>
					</Table>
				</div>

				{/* Pagination */}
				<div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-white/[0.01]">
					<div className="text-xs text-slate-400">
						Showing {Math.min((page - 1) * 10 + 1, total)}–
						{Math.min(page * 10, total)} of {total}
					</div>
					<div className="flex space-x-2">
						<Button
							size="sm"
							onClick={() => setPage((p) => Math.max(1, p - 1))}
							disabled={page === 1 || loading}
							className="bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs">
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<div className="flex items-center justify-center px-4 text-xs font-semibold text-slate-300">
							Page {page} of {totalPages || 1}
						</div>
						<Button
							size="sm"
							onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
							disabled={page >= totalPages || loading}
							className="bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs">
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>

			{/* Edit Modal */}
			<Dialog
				open={editModalOpen}
				onOpenChange={setEditModalOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Registration</DialogTitle>
						<DialogDescription>
							Update the participant&apos;s details or application status.
						</DialogDescription>
					</DialogHeader>
					{editData && (
						<div className="grid gap-4 py-4">
							<div className="grid gap-2">
								<Label htmlFor="fullName">Full Name</Label>
								<Input
									id="fullName"
									value={editData.fullName}
									onChange={(e) =>
										setEditData({ ...editData, fullName: e.target.value })
									}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="mobile">Mobile Number</Label>
								<Input
									id="mobile"
									value={editData.mobile}
									onChange={(e) =>
										setEditData({ ...editData, mobile: e.target.value })
									}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="regNumber">Registration Number</Label>
								<Input
									id="regNumber"
									value={editData.regNumber || ""}
									onChange={(e) =>
										setEditData({ ...editData, regNumber: e.target.value })
									}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="status">Status</Label>
								<Select
									value={editData.status}
									onValueChange={(value) =>
										setEditData({ ...editData, status: value })
									}>
									<SelectTrigger id="status">
										<SelectValue placeholder="Select status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Pending">Pending</SelectItem>
										<SelectItem value="Verified">Verified</SelectItem>
										<SelectItem value="Invalid">Invalid</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					)}
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setEditModalOpen(false)}>
							Cancel
						</Button>
						<Button
							onClick={handleUpdate}
							disabled={saving}>
							{saving ?
								<Loader2 className="h-4 w-4 animate-spin mr-2" />
							:	null}
							Save Changes
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* View Details Modal */}
			<Dialog
				open={viewModalOpen}
				onOpenChange={setViewModalOpen}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Registration Details</DialogTitle>
						<DialogDescription>
							Complete details for {viewData?.fullName} (
							{viewData?.registrationId})
						</DialogDescription>
					</DialogHeader>
					{viewData && (
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 text-sm">
							<div>
								<span className="font-semibold text-slate-500">Full Name:</span>{" "}
								{viewData.fullName}
							</div>
							<div>
								<span className="font-semibold text-slate-500">Mobile:</span>{" "}
								{viewData.mobile}
							</div>
							<div>
								<span className="font-semibold text-slate-500">Email:</span>{" "}
								{viewData.email || "N/A"}
							</div>
							<div>
								<span className="font-semibold text-slate-500">Gender:</span>{" "}
								{viewData.gender}
							</div>
							<div>
								<span className="font-semibold text-slate-500">
									Date of Birth:
								</span>{" "}
								{viewData.dob || "N/A"}
							</div>
							<div>
								<span className="font-semibold text-slate-500">
									Blood Group:
								</span>{" "}
								{viewData.bloodGroup || "N/A"}
							</div>
							<div>
								<span className="font-semibold text-slate-500">
									Father&apos;s Name:
								</span>{" "}
								{viewData.fatherName || "N/A"}
							</div>

							<div className="sm:col-span-2 border-t pt-2 mt-2 font-semibold">
								Academic Info
							</div>
							<div>
								<span className="font-semibold text-slate-500">
									School/College:
								</span>{" "}
								{viewData.schoolName}
							</div>
							<div>
								<span className="font-semibold text-slate-500">Class:</span>{" "}
								{viewData.class}
							</div>
							<div>
								<span className="font-semibold text-slate-500">
									Subject Group:
								</span>{" "}
								{viewData.subjectGroup}
							</div>
							<div>
								<span className="font-semibold text-slate-500">Roll No:</span>{" "}
								{viewData.rollNumber || "N/A"}
							</div>
							<div>
								<span className="font-semibold text-slate-500">Reg No:</span>{" "}
								{viewData.regNumber || "N/A"}
							</div>
							<div>
								<span className="font-semibold text-slate-500">
									Passing Year:
								</span>{" "}
								{viewData.passingYear || "N/A"}
							</div>
							<div>
								<span className="font-semibold text-slate-500">GPA/Grade:</span>{" "}
								{viewData.gradeGpa || "N/A"}
							</div>

							<div className="sm:col-span-2 border-t pt-2 mt-2 font-semibold">
								Location & Extra
							</div>
							<div className="sm:col-span-2">
								<span className="font-semibold text-slate-500">Address:</span>{" "}
								{viewData.address || "N/A"}
							</div>
							<div>
								<span className="font-semibold text-slate-500">District:</span>{" "}
								{viewData.district}
							</div>
							<div>
								<span className="font-semibold text-slate-500">
									Emergency Contact:
								</span>{" "}
								{viewData.emergencyContact || "N/A"}
							</div>

							<div className="sm:col-span-2 border-t pt-2 mt-2 font-semibold">
								System Info
							</div>
							<div>
								<span className="font-semibold text-slate-500">Status:</span>{" "}
								{viewData.status}
							</div>
							<div>
								<span className="font-semibold text-slate-500">Date:</span>{" "}
								{new Date(viewData.registrationDate).toLocaleString()}
							</div>
						</div>
					)}
					<DialogFooter>
						<Button onClick={() => setViewModalOpen(false)}>Close</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
