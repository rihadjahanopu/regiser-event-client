"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { 
  LayoutDashboard, 
  FileText, 
  PenTool, 
  BarChart2, 
  Bell, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  User
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out successfully");
          router.push("/admin/login");
        }
      }
    });
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Add Blog", href: "/dashboard/add-blog", icon: PenTool },
    { name: "My Blogs", href: "/dashboard/my-blogs", icon: FileText },
    { name: "Blog Analytics", href: "/dashboard/analytics", icon: BarChart2 },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
    { name: "Profile Settings", href: "/dashboard/profile", icon: Settings },
  ];

  const user = session?.user;

  return (
    <div className="min-h-screen bg-[#07070e] text-white flex">
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
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0c0c16] border-r border-white/5 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:block flex flex-col`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-wider uppercase bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Portal
            </span>
            <span className="text-slate-500 text-xs px-1.5 py-0.5 rounded bg-white/5 border border-white/10 uppercase">
              User
            </span>
          </Link>
          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-violet-600/25 to-indigo-600/10 border border-violet-500/25 text-violet-300 font-medium shadow-lg shadow-violet-500/5' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-sm">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Card */}
        {user && (
          <div className="p-4 border-t border-white/5 bg-white/[0.01]">
            <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg mb-3">
              {user.image ? (
                <img src={user.image} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-white/10" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-violet-600/30 text-violet-300 flex items-center justify-center font-semibold border border-white/10">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate leading-tight">{user.name}</p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-3 px-3 py-2.5 rounded-xl w-full text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors border border-transparent"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 md:px-8 bg-[#07070e]/80 backdrop-blur-md sticky top-0 z-30">
          <button 
            className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1"></div>
          <div className="flex items-center space-x-4">
            {/* Header Icons / Quick Links */}
            <Link 
              href="/" 
              className="text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-all"
            >
              View Main Site
            </Link>
          </div>
        </header>
        
        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
