/* eslint-disable @typescript-eslint/typedef */
"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  LogIn,
  Menu,
  UserPlus,
  X,
  ChevronDown,
  User,
  LayoutDashboard,
  Settings,
  Key,
  BookOpen,
  Bookmark,
  LogOut,
  Bell
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import axios from "axios";
import { toast } from "sonner";
import { useUserStore } from "@/store/useUserStore";
import { useNotificationStore } from "@/store/useNotificationStore";

interface NavbarProps {
  isRegistrationOpen?: boolean;
  navbarLogoUrl?: string;
  siteTitle?: string;
  siteSubtitle?: string;
}

export default function Navbar({
  isRegistrationOpen: propIsOpen,
  navbarLogoUrl: propLogoUrl,
  siteTitle: propSiteTitle,
  siteSubtitle: propSiteSubtitle,
}: NavbarProps = {}) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>(propLogoUrl || "");
  const [siteTitle, setSiteTitle] = useState<string>(propSiteTitle || "");
  const [siteSubtitle, setSiteSubtitle] = useState<string>(propSiteSubtitle || "");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!propLogoUrl || !propSiteTitle) {
      axios.get("/api/settings").then((res) => {
        if (res.data?.success && res.data?.data) {
          if (res.data.data.navbarLogoUrl) setLogoUrl(res.data.data.navbarLogoUrl);
          if (res.data.data.siteTitle) setSiteTitle(res.data.data.siteTitle);
          if (res.data.data.siteSubtitle) setSiteSubtitle(res.data.data.siteSubtitle);
        }
      }).catch(() => {});
    }
  }, [propLogoUrl, propSiteTitle]);

  useEffect(() => {
    if (propLogoUrl) setLogoUrl(propLogoUrl);
    if (propSiteTitle) setSiteTitle(propSiteTitle);
    if (propSiteSubtitle) setSiteSubtitle(propSiteSubtitle);
  }, [propLogoUrl, propSiteTitle, propSiteSubtitle]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged out successfully");
            setDropdownOpen(false);
            setOpen(false);
            window.location.href = "/admin/login";
          },
          onError: () => {
            window.location.href = "/admin/login";
          }
        }
      });
    } catch {
      window.location.href = "/admin/login";
    }
  };

  // Use Zustand profile for avatar/name (updates live after profile save)
  const zustandProfile = useUserStore((s) => s.profile);
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  const user = zustandProfile || session?.user;
  const isLoggedIn = !!session && !!user;
  const isAdmin = (zustandProfile?.role || (session?.user as any)?.role) === "admin";

  // Determine Nav links based on Role
  let navLinks: { label: string; href: string }[] = [];
  if (!isLoggedIn) {
    // Guest Links
    navLinks = [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Events", href: "/events" },
      { label: "Blogs", href: "/blog" },
      { label: "Contact", href: "/#contact" },
    ];
  } else if (isAdmin) {
    // Admin Links
    navLinks = [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Events", href: "/events" },
      { label: "Blogs", href: "/blog" },
      { label: "Dashboard", href: "/admin" },
    ];
  } else {
    // Regular Logged-in User Links
    navLinks = [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Events", href: "/events" },
      { label: "Blogs", href: "/blog" },
      { label: "My Blogs", href: "/dashboard/my-blogs" },
      { label: "Write Blog", href: "/dashboard/add-blog" },
      { label: "Dashboard", href: "/dashboard" },
    ];
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(7,7,15,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}
    >
      <div
        className="max-w-7xl mx-auto px-6 flex items-center justify-between"
        style={{ height: "68px" }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <img
            src={logoUrl || "/bangladesh-anjumane-talamije-islamia-seeklogo.png"}
            alt={siteTitle || "Talamij Logo"}
            className="w-10 h-10 object-contain drop-shadow rounded-full"
          />
          {(siteTitle || siteSubtitle) && (
            <div className="flex flex-col hidden sm:flex">
              {siteTitle && (
                <span className="text-sm font-bold text-white leading-tight">
                  {siteTitle}
                </span>
              )}
              {siteSubtitle && (
                <span className="text-[10px] text-slate-400 font-medium">
                  {siteSubtitle}
                </span>
              )}
            </div>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label + link.href}
              href={link.href}
              className="px-3.5 py-2 text-sm text-slate-400 hover:text-white transition-colors font-medium rounded-lg hover:bg-white/5"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth State / CTA */}
        <div className="hidden md:flex items-center gap-2.5">
          {!isPending && (
            <>
              {isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-white font-medium text-sm"
                  >
                    {user?.image ? (
                      <img
                        src={user.image}
                        alt={user.name || "User"}
                        className="w-6 h-6 rounded-full object-cover border border-white/20"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white border border-white/20">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                    <span className="max-w-[120px] truncate">{user?.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Profile Dropdown Menu */}
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/10 bg-[#0c0c16]/95 backdrop-blur-2xl p-2 shadow-2xl z-50 text-slate-300"
                      >
                        <div className="px-3 py-2 border-b border-white/5 mb-1.5">
                          <p className="text-xs text-slate-500 font-medium">Signed in as</p>
                          <p className="text-sm font-semibold text-white truncate">{user?.email}</p>
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-violet-500/10 text-violet-400 mt-1 border border-violet-500/20">
                            {user?.role || "user"}
                          </span>
                        </div>

                        {/* Dropdown Links */}
                        <Link
                          href={isAdmin ? "/admin/profile" : "/dashboard/profile"}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-white/5 hover:text-white transition-colors"
                        >
                          <User className="w-4 h-4" />
                          My Profile
                        </Link>
                        <Link
                          href={isAdmin ? "/admin" : "/dashboard"}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-white/5 hover:text-white transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <Link
                          href={isAdmin ? "/admin/profile" : "/dashboard/profile"}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-white/5 hover:text-white transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Profile Settings
                        </Link>
                        <Link
                          href={isAdmin ? "/admin/profile" : "/dashboard/profile"}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-white/5 hover:text-white transition-colors"
                        >
                          <Key className="w-4 h-4" />
                          Change Password
                        </Link>
                        {!isAdmin && (
                          <>
                            <Link
                              href="/dashboard/my-blogs"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-white/5 hover:text-white transition-colors"
                            >
                              <BookOpen className="w-4 h-4" />
                              My Blogs
                            </Link>
                            <Link
                              href="/dashboard/my-blogs"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-white/5 hover:text-white transition-colors"
                            >
                              <Bookmark className="w-4 h-4" />
                              Saved Blogs
                            </Link>
                          </>
                        )}

                        <div className="border-t border-white/5 my-1.5" />

                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 px-3 py-2 w-full text-left rounded-lg text-sm hover:bg-red-500/10 hover:text-red-400 text-slate-400 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link href="/admin/login">
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                      <LogIn className="w-3.5 h-3.5" />
                      Login
                    </button>
                  </Link>
                  <Link href="/admin/register">
                    <button
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer"
                      style={{
                        background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                        boxShadow: "0 0 16px rgba(124,58,237,0.35)",
                      }}
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Register
                    </button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-slate-300 hover:text-white p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="md:hidden border-t border-white/8 overflow-hidden"
            style={{
              background: "rgba(7,7,15,0.97)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="px-6 py-5 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label + link.href + "mobile"}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 text-slate-300 hover:text-white text-base font-medium transition-colors rounded-lg hover:bg-white/5"
                >
                  {link.label}
                </Link>
              ))}

              <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-white/8">
                {isLoggedIn ? (
                  <>
                    <div className="px-3 py-2 flex items-center gap-3 mb-2">
                      {user?.image ? (
                        <img
                          src={user.image}
                          alt={user.name || "User"}
                          className="w-10 h-10 rounded-full object-cover border border-white/20"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-sm font-bold text-white">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}
                      <div>
                        <p className="text-white font-semibold text-sm">{user?.name}</p>
                        <p className="text-slate-500 text-xs truncate max-w-[180px]">{user?.email}</p>
                      </div>
                    </div>

                    <Link
                      href={isAdmin ? "/admin/profile" : "/dashboard/profile"}
                      onClick={() => setOpen(false)}
                      className="px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg flex items-center gap-2"
                    >
                      <User className="w-4 h-4" /> My Profile
                    </Link>
                    <Link
                      href={isAdmin ? "/admin" : "/dashboard"}
                      onClick={() => setOpen(false)}
                      className="px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-2 text-left w-full mt-2"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      href="/admin/login"
                      className="flex-1"
                      onClick={() => setOpen(false)}
                    >
                      <button className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-300 border border-white/10">
                        Login
                      </button>
                    </Link>
                    <Link
                      href="/admin/register"
                      className="flex-1"
                      onClick={() => setOpen(false)}
                    >
                      <button
                        className="w-full py-2.5 rounded-xl text-xs font-semibold text-white"
                        style={{
                          background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                        }}
                      >
                        Register
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
