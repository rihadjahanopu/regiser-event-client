"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, AlertTriangle } from "lucide-react";

interface CountdownTimerProps {
  eventDate: string; // "YYYY-MM-DD"
  eventStartTime: string; // "HH:mm"
  onAutoClose?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isCutoffReached: boolean; // True if less than 30 mins remaining or passed
}

export function calculateTimeLeft(eventDate: string, eventStartTime: string): TimeLeft {
  if (!eventDate) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0, isCutoffReached: false };
  }

  // Parse target date and time
  const [year, month, day] = eventDate.split("-").map(Number);
  let hours = 0;
  let minutes = 0;

  if (eventStartTime) {
    const parts = eventStartTime.split(":").map(Number);
    hours = parts[0] || 0;
    minutes = parts[1] || 0;
  }

  const targetDate = new Date(year, (month || 1) - 1, day || 1, hours, minutes, 0, 0);
  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();

  // 30 minutes threshold = 30 * 60 * 1000 = 1,800,000 ms
  const CUTOFF_MS = 30 * 60 * 1000;
  const isCutoffReached = diffMs <= CUTOFF_MS;

  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0, isCutoffReached: true };
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hrs = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diffMs / 1000 / 60) % 60);
  const secs = Math.floor((diffMs / 1000) % 60);

  return {
    days,
    hours: hrs,
    minutes: mins,
    seconds: secs,
    totalMs: diffMs,
    isCutoffReached,
  };
}

export default function CountdownTimer({ eventDate, eventStartTime, onAutoClose }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(eventDate, eventStartTime)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const updated = calculateTimeLeft(eventDate, eventStartTime);
      setTimeLeft(updated);

      if (updated.isCutoffReached && onAutoClose) {
        onAutoClose();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [eventDate, eventStartTime, onAutoClose]);

  if (!eventDate) return null;

  if (timeLeft.isCutoffReached) {
    return (
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-amber-700 dark:text-amber-300 flex items-center gap-3 shadow-inner">
        <AlertTriangle className="w-5 h-5 shrink-0 animate-bounce text-amber-500" />
        <div className="text-xs sm:text-sm font-medium">
          <p className="font-semibold text-amber-800 dark:text-amber-200">Registration Closing Soon!</p>
          <p className="opacity-90">Event starts in less than 30 minutes or is currently underway.</p>
        </div>
      </div>
    );
  }

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Mins", value: timeLeft.minutes },
    { label: "Secs", value: timeLeft.seconds },
  ];

  return (
    <div className="w-full bg-linear-to-r from-blue-900/90 via-indigo-950 to-slate-900 border border-blue-500/30 rounded-2xl p-4 sm:p-5 text-white shadow-xl shadow-blue-900/20 backdrop-blur-md">
      <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-blue-400 animate-pulse" />
          <span className="text-xs uppercase tracking-wider font-semibold text-blue-200">
            Event Starts In
          </span>
        </div>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
          LIVE COUNTDOWN
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
        {units.map((unit, index) => (
          <div
            key={unit.label}
            className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10 shadow-inner backdrop-blur-xs group hover:bg-white/10 transition-colors"
          >
            <AnimatePresence mode="popLayout">
              <motion.span
                key={unit.value}
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-xl sm:text-2xl md:text-3xl font-black font-mono tracking-tight text-white group-hover:text-blue-300 transition-colors"
              >
                {String(unit.value).padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
            <span className="text-[10px] sm:text-xs text-blue-200/70 font-medium uppercase tracking-wider mt-1">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
