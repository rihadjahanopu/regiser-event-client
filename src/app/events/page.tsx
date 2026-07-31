/* eslint-disable */
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import CountdownTimer from "@/components/CountdownTimer";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Tag,
  Users,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const pastEvents = [
  {
    title: "Medha Jahai Competition 2024",
    date: "25 March 2024",
    location: "Chhatok North, Sunamganj",
    type: "Educational",
    participants: "450+",
    color: "#7c3aed",
    description:
      "Annual competition with talented students from across the country. Special awards in Mathematics, Science, and Literature.",
  },
  {
    title: "Annual Cultural Program 2024",
    date: "15 February 2024",
    location: "Sunamganj Sadar",
    type: "Cultural",
    participants: "800+",
    color: "#f59e0b",
    description:
      "Celebrating culture through folk music, poetry, and traditional dance. A stage for young artists to showcase their talent.",
  },
  {
    title: "Youth Leadership Workshop 2023",
    date: "10 December 2023",
    location: "Chhatok North",
    type: "Development",
    participants: "200+",
    color: "#10b981",
    description:
      "Special workshop to cultivate leadership qualities in youth. Developing skills in public speaking, teamwork, and problem-solving.",
  },
  {
    title: "Volunteer Tree Plantation 2023",
    date: "5 June 2023",
    location: "Sunamganj District",
    type: "Community",
    participants: "300+",
    color: "#22c55e",
    description:
      "Environmental awareness drive and tree planting campaign. Placed over 500 saplings across different locations.",
  },
  {
    title: "Youth Leadership Summit 2023",
    date: "20 March 2023",
    location: "Sylhet",
    type: "Seminar",
    participants: "500+",
    color: "#0ea5e9",
    description:
      "Gathering of young entrepreneurs and leaders. Keynote talks, panel discussions, and networking sessions.",
  },
  {
    title: "Education Development Conference 2022",
    date: "15 November 2022",
    location: "Chhatok North",
    type: "Educational",
    participants: "350+",
    color: "#ec4899",
    description:
      "Collaborative discussion between teachers, parents, and students to enhance education standards. Scholarship distribution.",
  },
];

interface Settings {
  eventName?: string;
  eventDate?: string;
  eventAddress?: string;
  eventStartTime?: string;
  isRegistrationOpen?: boolean;
  eventCoverUrl?: string | null;
  eventsPageBadge?: string;
  eventsPageTitle?: string;
  eventsPageSubtitle?: string;
  upcomingEventNotice?: string;
  noEventMessage?: string;
  navbarLogoUrl?: string;
  siteTitle?: string;
  siteSubtitle?: string;
  footerDescription?: string;
  footerCopyrightText?: string;
  footerFacebookUrl?: string;
  footerYoutubeUrl?: string;
  footerWebsiteUrl?: string;
}

export default function EventsPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [realEvents, setRealEvents] = useState<any[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get("/api/settings").catch(() => ({ data: { success: false } })),
      axios.get("/api/events").catch(() => ({ data: { success: false } })),
    ]).then(([setRes, eventRes]) => {
      if (setRes.data.success && setRes.data.data) {
        setSettings(setRes.data.data);
      }
      if (eventRes.data.success && eventRes.data.data) {
        setRealEvents(eventRes.data.data);
      }
      setEventsLoading(false);
    });
  }, []);

  const pageBadge = settings.eventsPageBadge || "Our Activities";
  const pageTitle = settings.eventsPageTitle || "Events & Programs";
  const pageSubtitle = settings.eventsPageSubtitle || "Explore our past, current, and upcoming educational, cultural, and leadership programs.";

  return (
    <main style={{ background: "#060612" }}>
      <Navbar
        isRegistrationOpen={settings.isRegistrationOpen ?? true}
        navbarLogoUrl={settings.navbarLogoUrl}
        siteTitle={settings.siteTitle}
        siteSubtitle={settings.siteSubtitle}
      />

      {/* Page Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, #1a0b38 0%, #060612 70%)",
          }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-px opacity-25"
          style={{
            background:
              "linear-gradient(90deg, transparent, #0ea5e9, #7c3aed, transparent)",
          }}
        />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border border-cyan-400/30 text-cyan-300"
              style={{ background: "rgba(14,165,233,0.1)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              {pageBadge}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            {pageTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            {pageSubtitle}
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        {/* Active & Upcoming Events Section */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-8"
          >
            <span
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ background: "#7c3aed" }}
            />
            <h2 className="text-2xl font-bold text-white">Active & Upcoming Events</h2>
          </motion.div>

            {realEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {realEvents.map((ev) => (
                  <motion.div
                    key={ev._id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative rounded-3xl overflow-hidden border border-white/10 group bg-[#0e0e1d] flex flex-col justify-between"
                  >
                    {/* Banner Image */}
                    <div className="relative h-56 w-full bg-slate-900 overflow-hidden">
                      {ev.bannerUrl ? (
                        <img
                          src={ev.bannerUrl}
                          alt={ev.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-violet-900/40 to-indigo-900/30 text-violet-400">
                          <Calendar className="w-12 h-12 opacity-50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e1d] via-[#0e0e1d]/40 to-transparent" />
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                            ev.isRegistrationOpen
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                              : "bg-slate-800 text-slate-400 border-white/10"
                          }`}
                        >
                          {ev.isRegistrationOpen ? "Registration Open" : "Closed"}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8 space-y-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2 leading-snug">
                          {ev.title}
                        </h3>
                        {ev.description && (
                          <p className="text-sm text-slate-400 line-clamp-3 mb-4">
                            {ev.description}
                          </p>
                        )}

                        <div className="space-y-2 text-xs text-slate-300">
                          {ev.eventDate && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-violet-400 shrink-0" />
                              <span>{ev.eventDate}</span>
                            </div>
                          )}
                          {ev.eventStartTime && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                              <span>{ev.eventStartTime}</span>
                            </div>
                          )}
                          {ev.venue && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-pink-400 shrink-0" />
                              <span className="truncate">{ev.venue}</span>
                            </div>
                          )}
                        </div>

                        {ev.eventDate && ev.showCountdown !== false && (
                          <div className="mt-4">
                            <CountdownTimer eventDate={ev.eventDate} eventStartTime={ev.eventStartTime || "00:00"} />
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        {ev.isRegistrationOpen ? (
                          <Link
                            href={`/event-form?event=${ev.slug}`}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-600/30 w-full"
                          >
                            <span>Register Now</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        ) : (
                          <span className="text-xs text-slate-500 italic text-center w-full py-2">
                            Registration is currently closed for this event.
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65 }}
                className="relative rounded-3xl overflow-hidden border border-white/10 group"
                style={{ minHeight: "360px" }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #1e0b3a 0%, #0c1a3a 50%, #071a2e 100%)",
                  }}
                />
                <div className="relative z-10 p-10 flex flex-col justify-center items-center text-center h-full">
                  <Calendar className="w-12 h-12 text-violet-400 mb-3" />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {settings.eventName || "No Active Event"}
                  </h3>
                  <p className="text-sm text-slate-400 max-w-md mb-6">
                    {settings.upcomingEventNotice ||
                      "There are currently no active event registrations open. Stay tuned!"}
                  </p>
                  {settings.isRegistrationOpen && (
                    <Link
                      href="/event-form"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-500"
                    >
                      <span>Register Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </motion.div>
            )}
          </section>

        {/* Past Events */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-10"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-1 h-6 rounded-full"
                style={{ background: "linear-gradient(#0ea5e9, #7c3aed)" }}
              />
              <h2 className="text-xl font-bold text-white">Past Events</h2>
            </div>
            <span className="text-sm text-slate-500">
              Total {pastEvents.length} events
            </span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event, i) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="group relative rounded-2xl border border-white/8 overflow-hidden flex flex-col"
                style={{ background: "rgba(255,255,255,0.025)" }}
              >
                {/* Top accent bar */}
                <div
                  className="h-1 w-full"
                  style={{
                    background: `linear-gradient(90deg, ${event.color}, transparent)`,
                  }}
                />

                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${event.color}15 0%, transparent 60%)`,
                  }}
                />

                <div className="relative z-10 p-6 flex flex-col flex-1">
                  {/* Badge + participants */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-semibold"
                      style={{
                        color: event.color,
                        background: `${event.color}18`,
                      }}
                    >
                      <Tag className="w-3 h-3 inline mr-1" />
                      {event.type}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Users className="w-3 h-3" />
                      {event.participants}
                    </span>
                  </div>

                  <h3 className="text-white font-bold text-base leading-snug mb-2 group-hover:text-violet-200 transition-colors flex-1">
                    {event.title}
                  </h3>

                  <p className="text-slate-500 text-sm leading-relaxed mb-5 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-white/6 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Calendar className="w-3 h-3" />
                        {event.date}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </span>
                    </div>
                    <span
                      className="w-8 h-8 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0"
                      style={{
                        background: `${event.color}20`,
                        color: event.color,
                      }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      <Footer
        description={settings.footerDescription}
        copyrightText={settings.footerCopyrightText}
        facebookUrl={settings.footerFacebookUrl}
        youtubeUrl={settings.footerYoutubeUrl}
        websiteUrl={settings.footerWebsiteUrl}
        navbarLogoUrl={settings.navbarLogoUrl}
        siteTitle={settings.siteTitle}
        siteSubtitle={settings.siteSubtitle}
      />
    </main>
  );
}
