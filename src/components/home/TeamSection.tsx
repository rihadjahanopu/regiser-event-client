"use client";

import { motion } from "framer-motion";
import { Award, Users } from "lucide-react";

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  designation: string;
  imageUrl: string;
  signatureUrl: string;
  order: number;
}

interface TeamSectionProps {
  title?: string;
  subtitle?: string;
  members?: TeamMember[];
}

const ACCENT_COLORS = [
  { accent: "#7c3aed", glow: "rgba(124,58,237,0.3)" },
  { accent: "#ec4899", glow: "rgba(236,72,153,0.3)" },
  { accent: "#0ea5e9", glow: "rgba(14,165,233,0.3)" },
  { accent: "#10b981", glow: "rgba(16,185,129,0.3)" },
  { accent: "#f59e0b", glow: "rgba(245,158,11,0.3)" },
  { accent: "#ef4444", glow: "rgba(239,68,68,0.3)" },
];

export default function TeamSection({
  title = "Our Leaders",
  subtitle = "The dedicated leadership guiding our organization with vision and integrity.",
  members = [],
}: TeamSectionProps) {
  return (
    <section id="team" className="py-28 px-6 relative overflow-hidden" style={{ background: "#07070f" }}>
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px opacity-20"
        style={{ background: "linear-gradient(90deg, transparent, #a855f7, transparent)" }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-4 px-3 py-1 rounded-full border border-purple-500/30 text-purple-400"
            style={{ background: "rgba(168,85,247,0.1)" }}
          >
            Leadership
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{title}</h2>
          {subtitle && (
            <p className="text-slate-400 text-lg max-w-xl mx-auto">{subtitle}</p>
          )}
        </motion.div>

        {/* Empty State */}
        {members.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center py-24 rounded-3xl border border-white/8"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}
            >
              <Users className="w-7 h-7 text-purple-400" />
            </div>
            <p className="text-white font-semibold text-lg mb-1">কোনো নেতা এখনো যোগ করা হয়নি</p>
            <p className="text-slate-500 text-sm text-center max-w-xs">
              Admin প্যানেল থেকে Leadership Management-এ গিয়ে নেতা যোগ করুন।
            </p>
          </motion.div>
        ) : (
          <div
            className={`grid gap-8 max-w-5xl mx-auto ${
              members.length === 1
                ? "grid-cols-1 max-w-sm"
                : members.length === 2
                ? "grid-cols-1 md:grid-cols-2 max-w-3xl"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {members.map((member, i) => {
              const { accent, glow } = ACCENT_COLORS[i % ACCENT_COLORS.length];
              const initial = (member.name || "?").charAt(0).toUpperCase();
              return (
                <motion.div
                  key={member._id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="group relative rounded-3xl p-8 border border-white/8 overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
                    style={{ background: `radial-gradient(circle at 50% 0%, ${glow} 0%, transparent 70%)` }}
                  />

                  <div className="relative z-10 flex flex-col items-center text-center">
                    {/* Avatar */}
                    {member.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-20 h-20 rounded-2xl object-cover mb-6 border-2 shadow-xl"
                        style={{ borderColor: `${accent}50`, boxShadow: `0 0 30px ${glow}` }}
                      />
                    ) : (
                      <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-6 border shadow-xl"
                        style={{
                          background: `linear-gradient(135deg, ${accent}30, ${accent}10)`,
                          borderColor: `${accent}50`,
                          boxShadow: `0 0 30px ${glow}`,
                        }}
                      >
                        {initial}
                      </div>
                    )}

                    {/* Role Badge */}
                    <span
                      className="text-xs px-3 py-1 rounded-full font-semibold mb-3 border"
                      style={{
                        color: accent,
                        borderColor: `${accent}40`,
                        background: `${accent}15`,
                      }}
                    >
                      <Award className="w-3 h-3 inline mr-1" />
                      {member.role}
                    </span>

                    <h3 className="text-white text-xl font-bold mb-1">{member.name}</h3>
                    {member.designation && (
                      <p className="text-slate-400 text-sm mb-6">{member.designation}</p>
                    )}

                    {/* Signature */}
                    {member.signatureUrl && (
                      <div className="pt-4 border-t border-white/8 w-full flex flex-col items-center">
                        <span className="text-[11px] text-slate-500 mb-2">Official Signature</span>
                        <img
                          src={member.signatureUrl}
                          alt={`${member.name} Signature`}
                          className="h-12 object-contain opacity-80 filter drop-shadow"
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
