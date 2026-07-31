"use client";

import { BarChart3, TrendingUp, Flag, FileText } from "lucide-react";

const stats = [
  { label: "Total Reports", value: "0", icon: Flag, gradient: "from-rose-500 to-pink-500", bg: "bg-rose-500/10" },
  { label: "Pending Review", value: "0", icon: FileText, gradient: "from-amber-500 to-orange-500", bg: "bg-amber-500/10" },
  { label: "Resolved", value: "0", icon: TrendingUp, gradient: "from-emerald-500 to-teal-500", bg: "bg-emerald-500/10" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Reports & Analytics</h1>
        <p className="text-slate-400 text-xs mt-0.5">Site-wide activity reports and flagged content statistics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-[#0c0c16] border border-white/5 rounded-2xl p-5 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-400">{s.label}</p>
                <p className="text-2xl font-bold text-white">{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[#0c0c16] border border-white/5 rounded-2xl py-20 flex flex-col items-center justify-center gap-3 text-center">
        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-1">
          <BarChart3 className="w-7 h-7 text-slate-600" />
        </div>
        <p className="text-slate-300 text-sm font-medium">Reports module coming soon</p>
        <p className="text-slate-500 text-xs max-w-sm">Detailed reporting and analytics with flagged content, engagement data, and site health will appear here.</p>
      </div>
    </div>
  );
}
