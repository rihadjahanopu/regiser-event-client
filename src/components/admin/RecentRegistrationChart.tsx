/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart3, LineChart, Calendar } from "lucide-react";

interface DayData {
  date: string;
  label?: string;
  day?: string;
  count: number;
}

interface RecentRegistrationChartProps {
  data: DayData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-[#0c0c16]/95 backdrop-blur-xl p-3.5 rounded-xl border border-white/10 shadow-2xl text-xs space-y-1.5 text-white">
        <p className="font-semibold text-slate-200 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-violet-400" />
          {item.label || item.date} {item.day ? `(${item.day})` : ""}
        </p>
        <div className="flex items-center gap-2 pt-1">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-500 inline-block animate-pulse" />
          <span className="text-slate-400">Registrations:</span>
          <span className="font-bold text-sm text-violet-400">
            {item.count.toLocaleString()}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export default function RecentRegistrationChart({ data }: RecentRegistrationChartProps) {
  const [chartType, setChartType] = useState<"area" | "bar">("area");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formattedData = (data || []).map((d) => {
    let label = d.label;
    let dayName = d.day;
    if (!label && d.date) {
      const parts = d.date.split("-");
      if (parts.length === 3) {
        const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        label = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
      } else {
        label = d.date;
      }
    }
    return {
      ...d,
      label: label || d.date,
      day: dayName || "",
    };
  });

  const total7Days = formattedData.reduce((acc, curr) => acc + curr.count, 0);
  const avgDaily = (total7Days / Math.max(formattedData.length, 1)).toFixed(1);
  const peakDay = formattedData.reduce(
    (max, curr) => (curr.count > max.count ? curr : max),
    formattedData[0] || { count: 0, label: "-" }
  );

  return (
    <Card className="col-span-1 lg:col-span-2 bg-[#0c0c16] border-white/5 text-white rounded-2xl overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <CardTitle className="flex items-center space-x-2 text-base font-bold text-white">
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span>Recent Registration Trend (Last 7 Days)</span>
          </CardTitle>
          <p className="text-xs text-slate-400 mt-1">
            Daily breakdown of new event registrations over the past week
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
          <Badge variant="outline" className="bg-violet-500/10 text-violet-300 border-violet-500/20 px-3 py-1 font-medium text-xs">
            7-Day Total: {total7Days.toLocaleString()}
          </Badge>

          <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setChartType("area")}
              className={`h-7 px-2.5 text-xs rounded-lg font-medium transition-all ${
                chartType === "area"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <LineChart className="w-3.5 h-3.5 mr-1" />
              Area
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setChartType("bar")}
              className={`h-7 px-2.5 text-xs rounded-lg font-medium transition-all ${
                chartType === "bar"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 mr-1" />
              Bar
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              7-Day Total
            </div>
            <div className="text-xl font-bold text-white mt-1">
              {total7Days}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Daily Avg
            </div>
            <div className="text-xl font-bold text-white mt-1">
              {avgDaily}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 col-span-2 sm:col-span-1 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Peak Day
              </div>
              <div className="text-xl font-bold text-white mt-1">
                {peakDay && peakDay.count > 0 ? `${peakDay.label}` : "-"}
              </div>
            </div>
            {peakDay && peakDay.count > 0 && (
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold text-xs">
                {peakDay.count}
              </Badge>
            )}
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          {!mounted ? (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
              Loading Chart...
            </div>
          ) : formattedData.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
              <Calendar className="w-8 h-8 mb-2 opacity-50 text-slate-400" />
              <p className="text-sm">No registration data available for the last 7 days.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "area" ? (
                <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRegistrations" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" opacity={0.06} />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    dy={8}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRegistrations)"
                    activeDot={{ r: 6, stroke: "#c4b5fd", strokeWidth: 2, fill: "#7c3aed" }}
                  />
                </AreaChart>
              ) : (
                <BarChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" opacity={0.06} />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    dy={8}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="count"
                    fill="#7c3aed"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={48}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
