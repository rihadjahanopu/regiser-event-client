"use client";

import Link from "next/link";
import { Heart, Share2, Play, Globe, LogIn, UserPlus } from "lucide-react";

interface FooterProps {
  description?: string;
  copyrightText?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  websiteUrl?: string;
  navbarLogoUrl?: string;
  siteTitle?: string;
  siteSubtitle?: string;
}

export default function Footer({
  description = "Bangladesh Anjumane Talamije Islamia, Chhatak Uttar Upazila branch. Dedicated to educational excellence, moral values, and youth leadership.",
  copyrightText,
  facebookUrl = "#",
  youtubeUrl = "#",
  websiteUrl = "#",
  navbarLogoUrl,
  siteTitle = "Talamije Islamia",
  siteSubtitle = "Chhatak Uttar Upazila",
}: FooterProps) {
  return (
    <footer className="relative py-16 px-6 border-t border-white/8" style={{ background: "#05050b" }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Col 1: Brand */}
        <div className="space-y-4 md:col-span-1">
          <Link href="/" className="flex items-center gap-3">
            <img
              src={navbarLogoUrl || "/bangladesh-anjumane-talamije-islamia-seeklogo.png"}
              alt={siteTitle || "Talamij Logo"}
              className="w-9 h-9 object-contain drop-shadow rounded-full"
            />
            <div className="flex flex-col">
              <span
                className="text-base font-bold tracking-tight leading-snug"
                style={{
                  background: "linear-gradient(135deg, #e2d9f3, #a5b4fc)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {siteTitle}
              </span>
              {siteSubtitle && (
                <span className="text-[10px] text-slate-500 font-medium">{siteSubtitle}</span>
              )}
            </div>
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="text-white text-sm font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li>
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
            </li>
            <li>
              <Link href="/events" className="hover:text-white transition-colors">Events</Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-white transition-colors">Blog & News</Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Programs & Activities */}
        <div>
          <h4 className="text-white text-sm font-semibold mb-4">Programs</h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li>Medha Jahai Competition</li>
            <li>Educational Workshops</li>
            <li>Cultural Programs</li>
            <li>Volunteer Activities</li>
            <li>
              <Link href="/event-form" className="text-violet-400 hover:text-violet-300 transition-colors">
                Event Registration →
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Social & Account Actions (Login / Register) */}
        <div>
          <h4 className="text-white text-sm font-semibold mb-4">Account & Portal</h4>
          <div className="flex items-center gap-3 mb-6">
            {facebookUrl && (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Social Link"
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/8"
              >
                <Share2 className="w-4 h-4" />
              </a>
            )}
            {youtubeUrl && (
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Video Link"
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/8"
              >
                <Play className="w-4 h-4" />
              </a>
            )}
            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Website Link"
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/8"
              >
                <Globe className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Login & Register buttons in Footer replacing Admin Panel link */}
          <div className="flex flex-col gap-2">
            <Link href="/admin/login">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/8 transition-colors cursor-pointer">
                <LogIn className="w-3.5 h-3.5" />
                Login to Portal
              </button>
            </Link>
            <Link href="/admin/register">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white transition-colors cursor-pointer" style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
                <UserPlus className="w-3.5 h-3.5" />
                Register New Account
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>
          {copyrightText ||
            `© ${new Date().getFullYear()} Bangladesh Anjumane Talamije Islamia (Chhatak Uttar Upazila). All rights reserved.`}
        </p>
        <div className="flex items-center gap-3">
          <p className="flex items-center gap-1">
            Developed by{" "}
            <a
              href="https://www.rihadjahanopu.com/"
              target="_blank"
              rel="noreferrer"
              className="text-slate-300 hover:text-violet-400 font-medium underline underline-offset-2 transition-colors"
            >
              Rihad Jahan Opu
            </a>
          </p>
          <span>•</span>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
