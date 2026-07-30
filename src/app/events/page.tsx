/* eslint-disable */
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
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

  useEffect(() => {
    axios
      .get("/api/settings")
      .then((res) => {
        if (res.data.success && res.data.data) {
          setSettings(res.data.data);
        }
      })
      .catch(() => {});
  }, []);

  const hasUpcoming = settings.eventName || settings.eventDate;

  const formattedDate = settings.eventDate
    ? new Date(settings.eventDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      })
    : null;

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
        {/* Upcoming Event */}
        {hasUpcoming && (
          <section className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-8"
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "#7c3aed" }}
              />
              <h2 className="text-xl font-bold text-white">Upcoming Event</h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
              className="relative rounded-3xl overflow-hidden border border-white/10 group"
              style={{ minHeight: "420px" }}
            >
              {/* Background */}
              {settings.eventCoverUrl ? (
                <>
                  <img
                    src={settings.eventCoverUrl}
                    alt="Event Cover"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#07070f]/95 via-[#07070f]/70 to-transparent" />
                </>
              ) : (
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #1e0b3a 0%, #0c1a3a 50%, #071a2e 100%)",
                  }}
                />
              )}

              {/* Decorative glows */}
              <div
                className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                style={{
                  background:
                    "radial-gradient(circle at 20% 50%, rgba(124,58,237,0.35), transparent 55%)",
                }}
              />
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background:
                    "radial-gradient(circle at 80% 30%, rgba(14,165,233,0.3), transparent 45%)",
                }}
              />

              <div
                className="relative z-10 p-10 md:p-14 flex flex-col justify-end h-full"
                style={{ minHeight: "420px" }}
              >
                <span
                  className="inline-flex self-start items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold text-violet-200 border border-violet-400/40 mb-6"
                  style={{ background: "rgba(124,58,237,0.25)" }}
                >
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
                  Upcoming Event
                </span>

                <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight max-w-2xl">
                  {settings.eventName || "Upcoming Event"}
                </h3>

                <div className="flex flex-wrap gap-6 mb-8">
                  {formattedDate && (
                    <div className="flex items-center gap-2.5 text-slate-200">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-violet-500/20 border border-violet-500/30">
                        <Calendar className="w-4 h-4 text-violet-300" />
                      </div>
                      <span className="text-sm font-medium">{formattedDate}</span>
                    </div>
                  )}
                  {settings.eventStartTime && (
                    <div className="flex items-center gap-2.5 text-slate-200">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-cyan-500/20 border border-cyan-500/30">
                        <Clock className="w-4 h-4 text-cyan-300" />
                      </div>
                      <span className="text-sm font-medium">
                        {settings.eventStartTime}
                      </span>
                    </div>
                  )}
                  {settings.eventAddress && (
                    <div className="flex items-center gap-2.5 text-slate-200">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-pink-500/20 border border-pink-500/30">
                        <MapPin className="w-4 h-4 text-pink-300" />
                      </div>
                      <span className="text-sm font-medium">
                        {settings.eventAddress}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-4">
                  {(settings.isRegistrationOpen ?? true) ? (
                    <Link href="/event-form">
                      <button
                        id="events-page-register-btn"
                        className="group flex items-center gap-2 px-8 py-3.5 rounded-2xl text-base font-semibold text-white transition-all cursor-pointer"
                        style={{
                          background:
                            "linear-gradient(135deg, #7c3aed, #4f46e5)",
                          boxShadow: "0 0 40px rgba(124,58,237,0.4)",
                        }}
                      >
                        Register Now
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </Link>
                  ) : (
                    <span className="px-8 py-3.5 rounded-2xl text-base font-medium text-slate-400 border border-white/15">
                      Registration Closed
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </section>
        )}

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
