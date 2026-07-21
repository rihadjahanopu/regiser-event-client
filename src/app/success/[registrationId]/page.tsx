"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Download, Printer, CheckCircle2, MapPin, Phone, GraduationCap, Calendar, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function SuccessPage() {
  const params = useParams();
  const registrationId = params.registrationId as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`/api/registration/verify/${registrationId}`);
        const res = response.data;
        if (res.success) {
          setData(res.registration);
        } else {
          toast.error(res.error || "Failed to load ticket.");
        }
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Failed to fetch ticket.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [registrationId]);

  const handleDownloadPDF = async () => {
    setPdfLoading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const QRCode = (await import("qrcode")).default;

      // Ticket size: landscape 200×80 mm
      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: [200, 80] });

      // ── Background ──────────────────────────────────────────────
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, 200, 80, "F");

      // ── Left accent bar ──────────────────────────────────────────
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, 8, 80, "F");

      // ── Dashed divider ───────────────────────────────────────────
      doc.setDrawColor(203, 213, 225);
      doc.setLineDashPattern([2, 2], 0);
      doc.line(140, 5, 140, 75);
      doc.setLineDashPattern([], 0);

      // ── Logo (optional — skip silently if fails) ─────────────────
      try {
        const logoImg = await new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = "/bangladesh-anjumane-talamije-islamia-seeklogo.png";
        });
        doc.addImage(logoImg, "PNG", 16, 12, 14, 14);
      } catch {
        console.warn("Logo load failed — skipping");
      }

      // ── Organization header ──────────────────────────────────────
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text("Bangladesh Anjumane Talamije Islamia", 34, 20);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text("Participant Ticket", 34, 25);

      // ── Participant name ─────────────────────────────────────────
      const fullNameText = String(data.fullName || "").toUpperCase().trim() || "PARTICIPANT";
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42);
      doc.text(fullNameText, 16, 45);

      // ── Detail helper — skips if value is empty ──────────────────
      const field = (label: string, value: string | undefined | null, x: number, y: number) => {
        const v = String(value ?? "").trim();
        if (!v) return;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text(label, x, y);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(15, 23, 42);
        doc.text(v, x, y + 5);
      };

      // Row 1 — institution (truncated if optional fields exist) + passing yr + gpa
      const hasExtra = !!(String(data.passingYear ?? "").trim() || String(data.gradeGpa ?? "").trim());
      const schoolDisplay = hasExtra
        ? String(data.schoolName || "").slice(0, 20) + (String(data.schoolName || "").length > 20 ? "…" : "")
        : String(data.schoolName || "");

      field("INSTITUTION", schoolDisplay, 16, 55);
      field("PASSING YR",  data.passingYear, 80, 55);
      field("GPA/GRADE",   data.gradeGpa,    115, 55);

      // Row 2 — mobile / group / district
      field("MOBILE",   data.mobile,       16,  68);
      field("GROUP",    data.subjectGroup,  70,  68);
      field("DISTRICT", data.district,      105, 68);

      // ── Right side — QR ─────────────────────────────────────────
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text("ADMIT ONE", 170, 18, { align: "center" });

      const verifyUrl = `${window.location.origin}/verify/${data.registrationId}`;
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
        width: 120,
        margin: 0,
        color: { dark: "#000000", light: "#ffffff" },
      });
      doc.addImage(qrDataUrl, "PNG", 152.5, 25, 35, 35);

      // Ticket number
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(59, 130, 246);
      doc.text(`NO. ${data.ticketNumber}`, 170, 68, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text("Scan to verify", 170, 73, { align: "center" });

      doc.save(`ticket-${data.registrationId}.pdf`);
      toast.success("Ticket downloaded as PDF!");
    } catch (err) {
      console.error("PDF generation error:", err);
      toast.error("Failed to generate PDF.");
    } finally {
      setPdfLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500">Generating your ticket...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Ticket Not Found</h2>
            <p className="text-slate-500">The registration ID you provided does not exist.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verification URL that is encoded in the QR code
  // We use window.location.origin to get the current host dynamically
  const verifyUrl = typeof window !== 'undefined' ? `${window.location.origin}/verify/${data.registrationId}` : "";

  return (
    <div className="h-[100dvh] overflow-y-auto bg-slate-50 dark:bg-slate-950 py-8 px-4 flex flex-col items-center print:bg-white print:py-0 print:h-auto print:overflow-visible">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl space-y-6"
      >
        <div className="text-center space-y-2 print:hidden">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Registration Successful!</h1>
          <p className="text-slate-500">Your digital ticket is ready. Please save or print it.</p>
        </div>

        {/* Ticket Card */}
        <div ref={ticketRef} className="rounded-xl overflow-hidden border-2 border-slate-200 shadow-2xl bg-white">
          {/* Header */}
          <div className="bg-blue-600 p-4 sm:p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center p-1 shadow-sm shrink-0">
                <img src="/bangladesh-anjumane-talamije-islamia-seeklogo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight leading-tight">Bangladesh Anjumane Talamije Islamia</h2>
                <p className="text-blue-100 text-sm opacity-90">Participant Ticket</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs sm:text-sm font-medium uppercase tracking-wider text-blue-200">Ticket No.</p>
              <p className="text-lg sm:text-xl font-bold font-mono">{data.ticketNumber}</p>
            </div>
          </div>
          
          <div className="p-4 sm:p-8 relative overflow-hidden">
            {/* Watermark / Hallmark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
              <img src="/bangladesh-anjumane-talamije-islamia-seeklogo.png" alt="Watermark" className="w-80 h-80 object-contain" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start justify-between">
              
              {/* Participant Details */}
              <div className="space-y-6 flex-1 w-full">
                <div>
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">Participant Name</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{data.fullName}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <GraduationCap className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Institution</p>
                      <p className="font-medium">{data.schoolName}</p>
                      <p className="text-sm text-slate-600">{data.class} • {data.subjectGroup}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Contact</p>
                      <p className="font-medium">{data.mobile}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Location</p>
                      <p className="font-medium">{data.district}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Registered On</p>
                      <p className="font-medium">{new Date(data.registrationDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 mt-4 border-t border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-xs text-slate-400 text-center md:text-left">
                    Present this QR code at the event entrance. ID: {data.registrationId}
                  </p>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="flex flex-col items-center p-4 bg-white rounded-xl border border-slate-100 shadow-sm print:border-none print:shadow-none">
                <div className="bg-white p-2">
                  <QRCodeSVG 
                    value={verifyUrl} 
                    size={160} 
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <div className="mt-3 flex items-center justify-center space-x-2 w-full">
                  <div className={`w-2 h-2 rounded-full ${data.status === 'Verified' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <span className="text-sm font-medium uppercase tracking-wide text-slate-700">{data.status}</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 print:hidden pt-4">
          <Button onClick={() => window.print()} variant="outline" className="w-full sm:w-auto h-12 px-6">
            <Printer className="mr-2 h-4 w-4" />
            Print Ticket
          </Button>
          <Button 
            onClick={handleDownloadPDF} 
            disabled={pdfLoading}
            className="w-full sm:w-auto h-12 px-6 bg-blue-600 hover:bg-blue-700"
          >
            {pdfLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating PDF...</>
            ) : (
              <><Download className="mr-2 h-4 w-4" /> Download PDF</>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
