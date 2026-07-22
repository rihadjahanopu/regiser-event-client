/* eslint-disable @typescript-eslint/typedef */
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
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
						Registrations
					</h1>
					<p className="text-slate-500">
						Manage all event participants ({total} total)
					</p>
				</div>
				<div className="flex flex-wrap gap-2">
					<Button
						variant="outline"
						onClick={exportExcel}
						disabled={exportLoading === "excel"}>
						{exportLoading === "excel" ?
							<PdfLoader className="mr-2 h-4 w-4 animate-spin" />
						:	<Download className="mr-2 h-4 w-4" />}
						Excel
					</Button>
					<Button
						variant="outline"
						onClick={exportPDF}
						disabled={exportLoading === "pdf"}>
						{exportLoading === "pdf" ?
							<PdfLoader className="mr-2 h-4 w-4 animate-spin" />
						:	<Download className="mr-2 h-4 w-4" />}
						PDF
					</Button>
				</div>
			</div>

			<div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
				<div className="relative w-full sm:w-72">
					<Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
					<Input
						placeholder="Search by name, mobile, ID..."
						className="pl-9"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
				<div className="w-full sm:w-48">
					<Select
						value={status}
						onValueChange={(val) => setStatus(val ?? "All")}>
						<SelectTrigger>
							<SelectValue placeholder="Filter by status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="All">All Statuses</SelectItem>
							<SelectItem value="Verified">Verified</SelectItem>
							<SelectItem value="Pending">Pending</SelectItem>
							<SelectItem value="Invalid">Invalid</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow className="bg-slate-50 dark:bg-slate-800/50">
								<TableHead className="w-12 text-center">S.N.</TableHead>
								<TableHead>Registration ID</TableHead>
								<TableHead>Name</TableHead>
								<TableHead>Mobile</TableHead>
								<TableHead>School / College</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Actions</TableHead>
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
									<TableRow key={item._id}>
										<TableCell className="font-medium text-slate-500 text-center">
											{(page - 1) * 10 + index + 1}
										</TableCell>
										<TableCell className="font-mono text-sm">
											{item.registrationId}
										</TableCell>
										<TableCell className="font-medium">
											{item.fullName}
										</TableCell>
										<TableCell>{item.mobile}</TableCell>
										<TableCell
											className="max-w-[150px] truncate"
											title={item.schoolName}>
											{item.schoolName}
										</TableCell>
										<TableCell className="text-slate-500">
											{new Date(item.registrationDate).toLocaleDateString()}
										</TableCell>
										<TableCell>
											<Badge
												variant={
													item.status === "Verified" ? "default"
													: item.status === "Pending" ?
														"secondary"
													:	"destructive"
												}
												className={
													item.status === "Verified" ?
														"bg-green-100 text-green-700 hover:bg-green-100"
													:	""
												}>
												{item.status}
											</Badge>
										</TableCell>
										<TableCell className="text-right">
											<DropdownMenu>
												<DropdownMenuTrigger
													render={
														<Button
															variant="ghost"
															className="h-8 w-8 p-0"
														/>
													}>
													<span className="sr-only">Open menu</span>
													<MoreHorizontal className="h-4 w-4" />
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuGroup>
														<DropdownMenuLabel>Actions</DropdownMenuLabel>

														<DropdownMenuItem
															onClick={() => {
																setViewData(item);
																setViewModalOpen(true);
															}}>
															<Eye className="mr-2 h-4 w-4" />
															View Details
														</DropdownMenuItem>

														<DropdownMenuItem
															onClick={() => {
																setEditData(item);
																setEditModalOpen(true);
															}}>
															<Edit2 className="mr-2 h-4 w-4" />
															Edit
														</DropdownMenuItem>

														<DropdownMenuItem
															onClick={() =>
																navigator.clipboard.writeText(
																	item.registrationId
																)
															}>
															Copy ID
														</DropdownMenuItem>

														<DropdownMenuItem
															className="text-red-600 focus:bg-red-50 focus:text-red-600"
															onClick={() => handleDelete(item.registrationId)}>
															<Trash2 className="mr-2 h-4 w-4" />
															Delete
														</DropdownMenuItem>
													</DropdownMenuGroup>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														render={
															<Link
																href={`/success/${item.registrationId}`}
																target="_blank"
															/>
														}>
														<Eye className="mr-2 h-4 w-4" />
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
				<div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-800">
					<div className="text-xs sm:text-sm text-slate-500">
						Showing {Math.min((page - 1) * 10 + 1, total)}–
						{Math.min(page * 10, total)} of {total}
					</div>
					<div className="flex space-x-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setPage((p) => Math.max(1, p - 1))}
							disabled={page === 1 || loading}>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<div className="flex items-center justify-center px-4 text-sm font-medium">
							Page {page} of {totalPages || 1}
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
							disabled={page >= totalPages || loading}>
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
