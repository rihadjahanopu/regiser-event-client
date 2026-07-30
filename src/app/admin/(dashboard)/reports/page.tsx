"use client";

import { BarChart3, TrendingUp, Flag, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { label: "Total Reports", value: "0", icon: Flag, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-900/20" },
  { label: "Pending Review", value: "0", icon: FileText, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
  { label: "Resolved", value: "0", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Reports & Analytics</h1>
        <p className="text-slate-500 text-xs mt-0.5">Site-wide activity reports and flagged content statistics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">{s.label}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <CardContent className="py-20 flex flex-col items-center justify-center gap-3 text-center">
          <BarChart3 className="w-12 h-12 text-slate-300 dark:text-slate-700" />
          <p className="text-slate-500 text-sm font-medium">Reports module coming soon</p>
          <p className="text-slate-400 text-xs max-w-sm">Detailed reporting and analytics with flagged content, engagement data, and site health will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
