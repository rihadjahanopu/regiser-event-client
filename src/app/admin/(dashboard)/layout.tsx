/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/typedef */
"use client";

import { signOut, useSession } from "@/lib/auth-client";
import { useUserStore } from "@/store/useUserStore";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
	Award,
	Bell,
	BookOpen,
	Crown,
	ExternalLink,
	FileCheck2,
	Flag,
	Images,
	Layers,
	LayoutDashboard,
	LogOut,
	Mail,
	Menu,
	MessageSquare,
	ShieldCheck,
	Sliders,
	Tag,
	User,
	Users,
	X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const router = useRouter();
	const { data: session, isPending } = useSession();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [unreadCount, setUnreadCount] = useState(0);
	const prevUnreadCount = useRef<number | null>(null);

	// Zustand store profile for real-time live avatar/name updates
	const profile = useUserStore((s) => s.profile);

	useEffect(() => {
		if (!isPending && session?.user && (session.user as any).role !== "admin") {
			toast.error("Access denied. Admin privileges required.");
			router.replace("/dashboard");
		}
	}, [session, isPending, router]);

	// Real-time unread messages notification polling
	useEffect(() => {
		if (!session?.user) return;

		const checkUnread = async () => {
			try {
				const res = await axios.get("/api/admin/messages/unread-count", {
					withCredentials: true,
				});
				if (res.data.success) {
					const currentCount = res.data.unreadCount || 0;
					setUnreadCount(currentCount);

					// If unread count increased, trigger real-time toast
					if (
						prevUnreadCount.current !== null &&
						currentCount > prevUnreadCount.current &&
						res.data.latestUnread
					) {
						const latest = res.data.latestUnread;
						toast.info(`📩 New Message from ${latest.name}`, {
							description:
								latest.message.length > 50 ?
									`${latest.message.slice(0, 50)}...`
								:	latest.message,
							action: {
								label: "View",
								onClick: () => router.push("/admin/messages"),
							},
						});
					}
					prevUnreadCount.current = currentCount;
				}
			} catch {
				/* silent catch */
			}
		};

		checkUnread();
		const interval = setInterval(checkUnread, 8000);
		return () => clearInterval(interval);
	}, [session, router]);

	const handleLogout = async () => {
		try {
			await signOut({
				fetchOptions: {
					onSuccess: () => {
						toast.success("Logged out successfully");
						window.location.href = "/admin/login";
					},
					onError: () => {
						window.location.href = "/admin/login";
					},
				},
			});
		} catch {
			window.location.href = "/admin/login";
		}
	};

	const navItems = [
		{ name: "Dashboard", href: "/admin", icon: LayoutDashboard },
		{
			name: "Messages",
			href: "/admin/messages",
			icon: Mail,
			badge: unreadCount,
		},
		{ name: "Registrations", href: "/admin/registrations", icon: Users },
		{ name: "Certificates", href: "/admin/certificates", icon: Award },
		{ name: "User Management", href: "/admin/users", icon: Users },
		{ name: "Gallery", href: "/admin/gallery", icon: Images },
		{ name: "Leadership", href: "/admin/team", icon: Crown },
		{ name: "Blog Review", href: "/admin/blog-review", icon: FileCheck2 },
		{ name: "Published Blogs", href: "/admin/published-blogs", icon: BookOpen },
		{ name: "Categories", href: "/admin/categories", icon: Layers },
		{ name: "Tags", href: "/admin/tags", icon: Tag },
		{ name: "Comments", href: "/admin/comments", icon: MessageSquare },
		{ name: "Reports", href: "/admin/reports", icon: Flag },
		{ name: "Site Settings", href: "/admin/settings", icon: Sliders },
		{ name: "Profile Settings", href: "/admin/profile", icon: User },
	];

	const user = profile || session?.user;

	return (
		<div className="h-screen bg-[#07070e] text-white flex overflow-hidden">
			{/* Mobile Sidebar Overlay */}
			<AnimatePresence>
				{sidebarOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
						onClick={() => setSidebarOpen(false)}
					/>
				)}
			</AnimatePresence>

			{/* Sidebar */}
			<aside
				className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0c0c16] border-r border-white/5 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:sticky md:top-0 md:h-screen md:flex flex-col shrink-0`}>
				{/* Sidebar Header */}
				<div className="h-16 flex items-center justify-between px-6 border-b border-white/5 shrink-0">
					<Link
						href="/admin"
						className="flex items-center gap-2.5">
						<div className="w-8 h-8 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
							<ShieldCheck className="w-4 h-4" />
						</div>
						<div className="flex flex-col">
							<span className="text-base font-bold tracking-wider uppercase bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
								Talamij
							</span>
							<span className="text-[10px] text-violet-400 font-semibold tracking-widest uppercase -mt-0.5">
								Admin Panel
							</span>
						</div>
					</Link>
					<button
						className="md:hidden text-slate-400 hover:text-white"
						onClick={() => setSidebarOpen(false)}>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Sidebar Nav links */}
				<nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
					{navItems.map((item) => {
						const Icon = item.icon;
						const isActive =
							pathname === item.href ||
							(pathname.startsWith(item.href) && item.href !== "/admin");

						return (
							<Link
								key={item.name}
								href={item.href}
								onClick={() => setSidebarOpen(false)}
								className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
									isActive ?
										"bg-linear-to-r from-violet-600/25 to-indigo-600/10 border border-violet-500/25 text-violet-300 font-medium shadow-lg shadow-violet-500/5"
									:	"text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
								}`}>
								<div className="flex items-center space-x-3">
									<Icon className="w-4 h-4 shrink-0" />
									<span className="text-sm">{item.name}</span>
								</div>
								{item.badge !== undefined && item.badge > 0 && (
									<span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-600 text-white shadow-md shadow-violet-600/40">
										{item.badge}
									</span>
								)}
							</Link>
						);
					})}
				</nav>

				{/* Admin User Card Footer */}
				{user && (
					<div className="p-4 border-t border-white/5 bg-white/1 shrink-0 space-y-3">
						<div className="flex items-center gap-3 px-2 py-1.5 rounded-xl bg-white/5 border border-white/5">
							{user.image ?
								<img
									src={user.image}
									alt={user.name || "Admin"}
									className="w-9 h-9 rounded-full object-cover border border-white/10"
								/>
							:	<div className="w-9 h-9 rounded-full bg-violet-600/30 text-violet-300 flex items-center justify-center font-semibold border border-white/10">
									{user.name?.charAt(0)?.toUpperCase() || "A"}
								</div>
							}
							<div className="min-w-0 flex-1">
								<div className="flex items-center gap-1.5">
									<p className="text-xs font-semibold text-white truncate">
										{user.name}
									</p>
									<span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-violet-500/20 text-violet-300 border border-violet-500/30">
										Admin
									</span>
								</div>
								<p className="text-[10px] text-slate-500 truncate mt-0.5">
									{user.email}
								</p>
							</div>
						</div>

						<button
							onClick={handleLogout}
							className="flex items-center space-x-3 px-3 py-2 rounded-xl w-full text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors border border-transparent text-xs font-medium">
							<LogOut className="w-4 h-4 shrink-0" />
							<span>Sign Out</span>
						</button>
					</div>
				)}
			</aside>

			{/* Main Content Area */}
			<main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
				{/* Top Header Bar */}
				<header className="h-16 border-b border-white/5 flex items-center justify-between px-6 md:px-8 bg-[#07070e]/80 backdrop-blur-md sticky top-0 z-30 shrink-0">
					<button
						className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white"
						onClick={() => setSidebarOpen(true)}>
						<Menu className="w-6 h-6" />
					</button>

					<div className="flex-1"></div>

					<div className="flex items-center gap-3">
						{/* Notification Bell */}
						<Link
							href="/admin/messages"
							className="relative p-2 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white transition-all"
							title="Messages & Notifications">
							<Bell className="w-4 h-4" />
							{unreadCount > 0 && (
								<span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-600 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
									{unreadCount > 9 ? "9+" : unreadCount}
								</span>
							)}
						</Link>

						<Link
							href="/"
							target="_blank"
							className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-all font-medium">
							<span>View Main Site</span>
							<ExternalLink className="w-3 h-3" />
						</Link>

						<Link
							href="/admin/profile"
							className="flex items-center gap-2 p-1.5 rounded-xl border border-white/10 hover:bg-white/5 text-white transition-all text-xs font-medium">
							{user?.image ?
								<img
									src={user.image}
									alt={user.name || "Admin"}
									className="w-6 h-6 rounded-full object-cover border border-white/20"
								/>
							:	<div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white">
									{user?.name?.charAt(0)?.toUpperCase() || "A"}
								</div>
							}
							<span className="hidden sm:inline max-w-25 truncate">
								{user?.name}
							</span>
						</Link>
					</div>
				</header>

				{/* Dynamic Page Content */}
				<div className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</div>
			</main>
		</div>
	);
}
