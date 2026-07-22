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
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl text-xs space-y-1">
        <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-blue-500" />
          {item.label || item.date} {item.day ? `(${item.day})` : ""}
        </p>
        <div className="flex items-center gap-2 pt-1">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block animate-pulse" />
          <span className="text-slate-500 dark:text-slate-400">Registrations:</span>
          <span className="font-bold text-sm text-blue-600 dark:text-blue-400">
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
    <Card className="col-span-1 lg:col-span-2 border-0 shadow-lg shadow-slate-200/50 dark:shadow-none dark:bg-slate-900 overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/60">
        <div>
          <CardTitle className="flex items-center space-x-2 text-lg font-bold text-slate-900 dark:text-white">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span>Recent Registration Trend (Last 7 Days)</span>
          </CardTitle>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Daily breakdown of new event registrations over the past week
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
          <Badge variant="outline" className="bg-blue-50/50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 px-3 py-1 font-medium">
            7-Day Total: {total7Days.toLocaleString()}
          </Badge>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setChartType("area")}
              className={`h-7 px-2.5 text-xs rounded-md font-medium transition-all ${
                chartType === "area"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <LineChart className="w-3.5 h-3.5 mr-1" />
              Area
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setChartType("bar")}
              className={`h-7 px-2.5 text-xs rounded-md font-medium transition-all ${
                chartType === "bar"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
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
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              7-Day Total
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {total7Days}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Daily Avg
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {avgDaily}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 col-span-2 sm:col-span-1 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Peak Day
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {peakDay && peakDay.count > 0 ? `${peakDay.label}` : "-"}
              </div>
            </div>
            {peakDay && peakDay.count > 0 && (
              <Badge className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-0 font-bold">
                {peakDay.count}
              </Badge>
            )}
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          {!mounted ? (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              Loading Chart...
            </div>
          ) : formattedData.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
              <Calendar className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">No registration data available for the last 7 days.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "area" ? (
                <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRegistrations" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    dy={8}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRegistrations)"
                    activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2, fill: "#ffffff" }}
                  />
                </AreaChart>
              ) : (
                <BarChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    dy={8}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="count"
                    fill="#3b82f6"
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
