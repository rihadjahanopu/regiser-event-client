"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ContactSectionProps {
  title?: string;
  subtitle?: string;
  contactEmail?: string;
  organiserContact?: string;
  eventAddress?: string;
}

export default function ContactSection({
  title = "Get in Touch",
  subtitle = "For any questions, suggestions, or collaboration opportunities, write to us or reach out directly.",
  contactEmail = "contact@talamij.org",
  organiserContact,
  eventAddress,
}: ContactSectionProps) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) {
      toast.error("Please enter your name and message.");
      return;
    }
    setSending(true);
    setTimeout(() => {
      toast.success("Your message has been sent successfully! Thank you.");
      setFormData({ name: "", email: "", message: "" });
      setSending(false);
    }, 1000);
  };

  return (
    <section id="contact" className="py-28 px-6 relative overflow-hidden" style={{ background: "#0a0a14" }}>
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px opacity-20"
        style={{ background: "linear-gradient(90deg, transparent, #3b82f6, transparent)" }}
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
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-4 px-3 py-1 rounded-full border border-blue-500/30 text-blue-400"
            style={{ background: "rgba(59,130,246,0.1)" }}
          >
            Contact
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="p-8 rounded-3xl border border-white/8 space-y-6" style={{ background: "rgba(255,255,255,0.025)" }}>
              <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-blue-500/10 border border-blue-500/30 text-blue-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">Office / Address</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {eventAddress || "Chhatok North, Sunamganj, Bangladesh"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-violet-500/10 border border-violet-500/30 text-violet-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">Phone / Mobile</h4>
                  <p className="text-slate-400 text-sm">
                    {organiserContact || "+880 1700 000 000"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-pink-500/10 border border-pink-500/30 text-pink-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">Email</h4>
                  <p className="text-slate-400 text-sm">{contactEmail}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form
              onSubmit={handleSubmit}
              className="p-8 rounded-3xl border border-white/8 space-y-5"
              style={{ background: "rgba(255,255,255,0.025)" }}
            >
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                Send a Message
              </h3>

              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Email or Phone</label>
                <input
                  type="text"
                  placeholder="Email or mobile number"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Message *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write your message in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
              >
                {sending ? "Sending..." : (
                  <>
                    Send Message <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
