/* eslint-disable */
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Users, 
  User, 
  School, 
  CalendarClock, 
  Loader2,
  FileCheck2,
  Award,
  Sliders,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  TrendingUp
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import RecentRegistrationChart from "@/components/admin/RecentRegistrationChart";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/api/admin/dashboard");
        if (res.data.success) {
          setStats(res.data.stats);
          setError(false);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    // Fetch immediately on mount
    fetchStats();

    // Poll every 5 seconds for real-time updates
    const interval = setInterval(fetchStats, 5000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <div className="w-9 h-9 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-medium">Loading admin dashboard statistics...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6 text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl text-sm font-medium">
        Failed to load admin dashboard. Please refresh or check connection.
      </div>
    );
  }

  const cards = [
    {
      title: "Total Registrations",
      value: stats.totalRegistrations || 0,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Today's Registrations",
      value: stats.todayRegistrations || 0,
      icon: CalendarClock,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Total Schools",
      value: stats.totalSchools || 0,
      icon: School,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
    },
    {
      title: "Male Participants",
      value: stats.maleCount || 0,
      icon: User,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Female Participants",
      value: stats.femaleCount || 0,
      icon: User,
      color: "text-pink-400",
      bg: "bg-pink-500/10 border-pink-500/20",
    },
  ];

  const quickActions = [
    {
      title: "Review Blog Submissions",
      description: "Approve or reject community article drafts",
      icon: FileCheck2,
      href: "/admin/blog-review",
      badge: "Review",
      color: "text-violet-400"
    },
    {
      title: "Manage Registrations",
      description: "View, filter and verify attendee tickets",
      icon: Users,
      href: "/admin/registrations",
      badge: "Attendees",
      color: "text-indigo-400"
    },
    {
      title: "Issue Certificates",
      description: "Generate and deliver event completion certificates",
      icon: Award,
      href: "/admin/certificates",
      badge: "Certificates",
      color: "text-emerald-400"
    },
    {
      title: "System Settings",
      description: "Configure website settings and event parameters",
      icon: Sliders,
      href: "/admin/settings",
      badge: "Settings",
      color: "text-amber-400"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Live Overview
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Admin Control Center
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Monitor real-time event registrations, manage blog approvals, and oversee portal activity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/blog-review">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white transition-all shadow-lg shadow-violet-600/20">
              <FileCheck2 className="w-4 h-4" />
              Review Blogs
            </button>
          </Link>
          <Link href="/admin/registrations">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all">
              <Users className="w-4 h-4 text-violet-400" />
              All Registrations
            </button>
          </Link>
        </div>
      </div>

      {/* Overview Stats Cards Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              className="bg-[#0c0c16] border border-white/5 rounded-2xl p-5 flex flex-col justify-between hover:border-violet-500/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl ${card.bg} border shrink-0`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white group-hover:text-violet-300 transition-colors">
                  {card.value.toLocaleString()}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <RecentRegistrationChart data={stats.last7Days || []} />
      </div>

      {/* Quick Administrative Actions Grid */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-violet-400" />
            Quick Administration Shortcuts
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.href}>
                <Card className="bg-[#0c0c16] border-white/5 hover:border-violet-500/40 text-white rounded-2xl transition-all duration-300 h-full group hover:shadow-lg hover:shadow-violet-600/10">
                  <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5">
                          {action.badge}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-white group-hover:text-violet-300 transition-colors pt-1">
                        {action.title}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {action.description}
                      </p>
                    </div>

                    <div className="flex items-center text-xs font-semibold text-violet-400 group-hover:text-violet-300 pt-2 border-t border-white/5">
                      <span>Open Tool</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
