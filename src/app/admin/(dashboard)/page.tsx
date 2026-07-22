"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, User, School, CalendarClock, TrendingUp, Loader2 } from "lucide-react";

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
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error || !stats) {
    return <div className="p-4 text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">Failed to load dashboard. Please try again.</div>;
  }

  const cards = [
    {
      title: "Total Registrations",
      value: stats.totalRegistrations,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Today's Registrations",
      value: stats.todayRegistrations,
      icon: CalendarClock,
      color: "text-emerald-600",
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      title: "Total Schools",
      value: stats.totalSchools,
      icon: School,
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Male Participants",
      value: stats.maleCount,
      icon: User,
      color: "text-orange-600",
      bg: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      title: "Female Participants",
      value: stats.femaleCount,
      icon: User,
      color: "text-pink-600",
      bg: "bg-pink-100 dark:bg-pink-900/30",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Here is the latest summary of your event registrations.</p>
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="border-0 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">{card.title}</CardTitle>
                <div className={`p-2 rounded-xl ${card.bg}`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900 dark:text-white transition-all">
                  {card.value.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <RecentRegistrationChart data={stats.last7Days || []} />
      </div>
    </div>
  );
}
