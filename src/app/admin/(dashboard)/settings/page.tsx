"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ImageIcon,
  Upload,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Clock,
  MapPin,
  Phone,
  FileText,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Award,
  PenLine,
  X,
} from "lucide-react";
import { DEFAULT_FIELD_CONFIG, type FieldConfig } from "@/lib/fieldConfig";

export default function SettingsPage() {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Event info state
  const [eventName, setEventName] = useState("");
  const [eventAddress, setEventAddress] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventStartTime, setEventStartTime] = useState("");
  const [organiserContact, setOrganiserContact] = useState("");
  const [showCountdown, setShowCountdown] = useState(true);
  const [savingEvent, setSavingEvent] = useState(false);
  const [clearingEvent, setClearingEvent] = useState(false);

  // Form Field Config state — each field has { required, enabled }
  const [fieldConfig, setFieldConfig] = useState<FieldConfig>(DEFAULT_FIELD_CONFIG);
  const [savingFieldConfig, setSavingFieldConfig] = useState(false);

  // Certificate Signature state
  const [presidentName, setPresidentName] = useState("President");
  const [presidentTitle, setPresidentTitle] = useState("President, Chhatak Uttar");
  const [presidentSignatureUrl, setPresidentSignatureUrl] = useState("");
  const [secretaryName, setSecretaryName] = useState("General Secretary");
  const [secretaryTitle, setSecretaryTitle] = useState("General Secretary, Chhatak Uttar");
  const [secretarySignatureUrl, setSecretarySignatureUrl] = useState("");

  // Signature upload state
  const [uploadingPresidentSig, setUploadingPresidentSig] = useState(false);
  const [uploadingSecretarySig, setUploadingSecretarySig] = useState(false);
  const [deletingPresidentSig, setDeletingPresidentSig] = useState(false);
  const [deletingSecretarySig, setDeletingSecretarySig] = useState(false);
  const presidentSigInputRef = useRef<HTMLInputElement>(null);
  const secretarySigInputRef = useRef<HTMLInputElement>(null);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/settings");
      if (res.data.success && res.data.data) {
        const d = res.data.data;
        setCoverUrl(d.eventCoverUrl || null);
        setIsRegistrationOpen(d.isRegistrationOpen ?? true);
        setEventName(d.eventName || "");
        setEventAddress(d.eventAddress || "");
        setEventDate(d.eventDate || "");
        setEventStartTime(d.eventStartTime || "");
        setOrganiserContact(d.organiserContact || "");
        setShowCountdown(d.showCountdown ?? true);
        setPresidentName(d.presidentName || "President");
        setPresidentTitle(d.presidentTitle || "President, Chhatak Uttar");
        setPresidentSignatureUrl(d.presidentSignatureUrl || "");
        setSecretaryName(d.secretaryName || "General Secretary");
        setSecretaryTitle(d.secretaryTitle || "General Secretary, Chhatak Uttar");
        setSecretarySignatureUrl(d.secretarySignatureUrl || "");
        if (d.fieldConfig) {
          // Normalise legacy boolean format or new object format
          const raw = d.fieldConfig as Record<string, any>;
          const keys = Object.keys(DEFAULT_FIELD_CONFIG) as (keyof FieldConfig)[];
          const normalised = { ...DEFAULT_FIELD_CONFIG };
          keys.forEach((k) => {
            const v = raw[k];
            if (v === null || v === undefined) return;
            if (typeof v === "boolean") {
              normalised[k] = { required: v, enabled: true };
            } else if (typeof v === "object") {
              normalised[k] = {
                required: v.required ?? DEFAULT_FIELD_CONFIG[k].required,
                enabled: v.enabled ?? DEFAULT_FIELD_CONFIG[k].enabled,
              };
            }
          });
          setFieldConfig(normalised);
        }
      }
    } catch {
      toast.error("Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const toggleRegistrationStatus = async () => {
    setUpdatingStatus(true);
    try {
      const res = await axios.put("/api/admin/settings/status", {
        isOpen: !isRegistrationOpen,
      });
      if (res.data.success) {
        setIsRegistrationOpen(res.data.data.isRegistrationOpen);
        toast.success(`Registration is now ${res.data.data.isRegistrationOpen ? "Open" : "Closed"}`);
      } else {
        toast.error(res.data.error);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update registration status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSaveEventDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingEvent(true);
    try {
      const res = await axios.put("/api/admin/settings/event", {
        eventName,
        eventAddress,
        eventDate,
        eventStartTime,
        organiserContact,
        showCountdown,
        presidentName,
        presidentTitle,
        presidentSignatureUrl,
        secretaryName,
        secretaryTitle,
        secretarySignatureUrl,
      });

      if (res.data.success) {
        toast.success("Event details saved successfully!");
      } else {
        toast.error(res.data.error || "Failed to save event details");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to save event details");
    } finally {
      setSavingEvent(false);
    }
  };

  const handleClearEventDetails = async () => {
    if (!window.confirm("Are you sure you want to clear/delete event details?")) return;
    setClearingEvent(true);
    try {
      const res = await axios.delete("/api/admin/settings/event");
      if (res.data.success) {
        setEventName("");
        setEventAddress("");
        setEventDate("");
        setEventStartTime("");
        setOrganiserContact("");
        setShowCountdown(true);
        toast.success("Event details cleared!");
      } else {
        toast.error(res.data.error);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to clear event details");
    } finally {
      setClearingEvent(false);
    }
  };

  const handleSaveFieldConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingFieldConfig(true);
    try {
      const res = await axios.put("/api/admin/settings/field-config", {
        fieldConfig,
      });
      if (res.data.success) {
        toast.success("Form field validation configuration updated!");
      } else {
        toast.error(res.data.error || "Failed to update validation configuration");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update validation configuration");
    } finally {
      setSavingFieldConfig(false);
    }
  };

  const toggleFieldRequired = (fieldName: keyof FieldConfig) => {
    setFieldConfig((prev) => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], required: !prev[fieldName].required },
    }));
  };

  const toggleFieldEnabled = (fieldName: keyof FieldConfig) => {
    setFieldConfig((prev) => ({
      ...prev,
      [fieldName]: { ...prev[fieldName], enabled: !prev[fieldName].enabled },
    }));
  };

  // ── Signature Upload Handlers ────────────────────────────────────────────
  const handlePresidentSignatureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPresidentSig(true);
    const formData = new FormData();
    formData.append("signature", file);
    try {
      const res = await axios.post("/api/admin/settings/signature/president", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        setPresidentSignatureUrl(res.data.data.presidentSignatureUrl);
        toast.success("President signature uploaded!");
      } else {
        toast.error(res.data.error);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to upload signature");
    } finally {
      setUploadingPresidentSig(false);
      if (presidentSigInputRef.current) presidentSigInputRef.current.value = "";
    }
  };

  const handlePresidentSignatureDelete = async () => {
    if (!window.confirm("Delete president signature?")) return;
    setDeletingPresidentSig(true);
    try {
      const res = await axios.delete("/api/admin/settings/signature/president");
      if (res.data.success) {
        setPresidentSignatureUrl("");
        toast.success("President signature removed");
      } else {
        toast.error(res.data.error);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to delete signature");
    } finally {
      setDeletingPresidentSig(false);
    }
  };

  const handleSecretarySignatureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingSecretarySig(true);
    const formData = new FormData();
    formData.append("signature", file);
    try {
      const res = await axios.post("/api/admin/settings/signature/secretary", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        setSecretarySignatureUrl(res.data.data.secretarySignatureUrl);
        toast.success("Secretary signature uploaded!");
      } else {
        toast.error(res.data.error);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to upload signature");
    } finally {
      setUploadingSecretarySig(false);
      if (secretarySigInputRef.current) secretarySigInputRef.current.value = "";
    }
  };

  const handleSecretarySignatureDelete = async () => {
    if (!window.confirm("Delete secretary signature?")) return;
    setDeletingSecretarySig(true);
    try {
      const res = await axios.delete("/api/admin/settings/signature/secretary");
      if (res.data.success) {
        setSecretarySignatureUrl("");
        toast.success("Secretary signature removed");
      } else {
        toast.error(res.data.error);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to delete signature");
    } finally {
      setDeletingSecretarySig(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("cover", file);

    try {
      const res = await axios.post("/api/admin/settings/cover", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        setCoverUrl(res.data.data.eventCoverUrl);
        toast.success("Cover image uploaded successfully!");
      } else {
        toast.error(res.data.error);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete the cover image?")) return;
    setDeleting(true);
    try {
      const res = await axios.delete("/api/admin/settings/cover");
      if (res.data.success) {
        setCoverUrl(null);
        toast.success("Cover image deleted");
      } else {
        toast.error(res.data.error);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to delete image");
    } finally {
      setDeleting(false);
    }
  };

  const handleClearAllData = async () => {
    const isConfirmed = window.confirm(
      "WARNING: Are you absolutely sure you want to delete ALL registrations? This action cannot be undone and will erase all data permanently!"
    );

    if (!isConfirmed) return;

    const doubleCheck = window.prompt("Type 'DELETE ALL' to confirm:");
    if (doubleCheck !== "DELETE ALL") {
      toast.error("Confirmation failed. Data was not deleted.");
      return;
    }

    setClearing(true);
    try {
      const res = await axios.delete("/api/admin/registrations");
      if (res.data.success) {
        toast.success("All registrations have been permanently deleted.");
      } else {
        toast.error(res.data.error);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to clear data");
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500">Manage event schedule, appearance, and global configuration.</p>
      </div>

      {/* Registration Status */}
      <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="space-y-1">
            <CardTitle className="text-lg">Registration Status</CardTitle>
            <CardDescription>
              Turn event registration on or off manually.
            </CardDescription>
          </div>
          <div>
            <button
              onClick={toggleRegistrationStatus}
              disabled={updatingStatus || loading}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${
                isRegistrationOpen ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  isRegistrationOpen ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </CardHeader>

        {/* Cover Image Upload */}
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
            <ImageIcon className="w-5 h-5 text-blue-600" />
            Event Cover Image
          </CardTitle>
          <CardDescription>
            This image will be displayed at the top of the Registration Form. Recommended size: 1200×400px.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : coverUrl ? (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
                <img
                  src={coverUrl}
                  alt="Event Cover"
                  className="w-full h-52 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex-1"
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  Replace Image
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 sm:flex-none"
                >
                  {deleting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Delete Image
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center h-52 gap-4 cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors group"
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                  <p className="text-sm text-slate-500 font-medium">Uploading to Cloudinary...</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Click to upload cover image</p>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
                  </div>
                </>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
        </CardContent>
      </Card>

      {/* ── Event Details & Schedule Management ── */}
      <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
            <FileText className="w-5 h-5 text-blue-600" />
            Event Details & Schedule
          </CardTitle>
          <CardDescription>
            Configure Event Name, Location, Date, Time, Organiser Contact, and Countdown Timer. These will be displayed on the Registration Form & downloadable Ticket PDF. Form auto-closes 30m before Start Time!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveEventDetails} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                <FileText className="w-4 h-4 text-slate-400" /> Event Name
              </label>
              <Input
                placeholder="e.g. Medha Jahai Competition 2026"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="h-10"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                <MapPin className="w-4 h-4 text-slate-400" /> Event Address / Venue
              </label>
              <Input
                placeholder="e.g. Chhatak Uttar Secondary School Grounds"
                value={eventAddress}
                onChange={(e) => setEventAddress(e.target.value)}
                className="h-10"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                  <Calendar className="w-4 h-4 text-slate-400" /> Event Date
                </label>
                <Input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="h-10"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                  <Clock className="w-4 h-4 text-slate-400" /> Event Start Time
                </label>
                <Input
                  type="time"
                  value={eventStartTime}
                  onChange={(e) => setEventStartTime(e.target.value)}
                  className="h-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                <Phone className="w-4 h-4 text-slate-400" /> Organiser Contact
              </label>
              <Input
                placeholder="e.g. 01700000000 / info@talamij.org"
                value={organiserContact}
                onChange={(e) => setOrganiserContact(e.target.value)}
                className="h-10"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Show Countdown Timer
                </p>
                <p className="text-xs text-slate-500">
                  Display an animated live countdown clock on the registration form.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCountdown(!showCountdown)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  showCountdown ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showCountdown ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Signature & Authority Management */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-5 space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-600" />
                Certificate Authorized Signatures
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-purple-50/40 dark:bg-purple-950/10 p-4 rounded-xl border border-purple-100 dark:border-purple-900/30">
                {/* President */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider block flex items-center gap-1.5">
                    <PenLine className="w-3.5 h-3.5" /> President Signature
                  </span>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">President Name</label>
                    <Input
                      placeholder="e.g. Professor Mohammad Farhadul Islam"
                      value={presidentName}
                      onChange={(e) => setPresidentName(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">President Title / Designation</label>
                    <Input
                      placeholder="e.g. President, Chhatak Uttar"
                      value={presidentTitle}
                      onChange={(e) => setPresidentTitle(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                  {/* Signature Image Upload */}
                  <div>
                    <label className="text-xs text-slate-500 block mb-1.5">Signature Image Upload</label>
                    {presidentSignatureUrl ? (
                      <div className="relative group rounded-xl overflow-hidden border-2 border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 p-3 flex flex-col items-center gap-2">
                        <img
                          src={presidentSignatureUrl}
                          alt="President signature"
                          className="h-16 object-contain mix-blend-multiply dark:mix-blend-normal"
                        />
                        <div className="flex gap-2 w-full">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs h-7 border-purple-200 dark:border-purple-800"
                            onClick={() => presidentSigInputRef.current?.click()}
                            disabled={uploadingPresidentSig}
                          >
                            {uploadingPresidentSig ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Upload className="w-3 h-3 mr-1" />}
                            Replace
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="text-xs h-7 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                            onClick={handlePresidentSignatureDelete}
                            disabled={deletingPresidentSig}
                          >
                            {deletingPresidentSig ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => presidentSigInputRef.current?.click()}
                        disabled={uploadingPresidentSig}
                        className="w-full border-2 border-dashed border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 rounded-xl p-4 flex flex-col items-center gap-2 bg-purple-50/40 dark:bg-purple-950/10 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all group cursor-pointer"
                      >
                        {uploadingPresidentSig ? (
                          <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                        ) : (
                          <Upload className="w-6 h-6 text-purple-400 group-hover:text-purple-600 transition-colors" />
                        )}
                        <span className="text-xs text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300">
                          {uploadingPresidentSig ? "Uploading…" : "Click to upload signature image"}
                        </span>
                        <span className="text-[10px] text-slate-400">PNG, JPG, SVG • Transparent background recommended</span>
                      </button>
                    )}
                    <input
                      ref={presidentSigInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePresidentSignatureUpload}
                    />
                  </div>
                </div>

                {/* Secretary */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider block flex items-center gap-1.5">
                    <PenLine className="w-3.5 h-3.5" /> Secretary Signature
                  </span>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Secretary Name</label>
                    <Input
                      placeholder="e.g. Shah Rezwan Hayat"
                      value={secretaryName}
                      onChange={(e) => setSecretaryName(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Secretary Title / Designation</label>
                    <Input
                      placeholder="e.g. General Secretary, Chhatak Uttar"
                      value={secretaryTitle}
                      onChange={(e) => setSecretaryTitle(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                  {/* Signature Image Upload */}
                  <div>
                    <label className="text-xs text-slate-500 block mb-1.5">Signature Image Upload</label>
                    {secretarySignatureUrl ? (
                      <div className="relative group rounded-xl overflow-hidden border-2 border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 p-3 flex flex-col items-center gap-2">
                        <img
                          src={secretarySignatureUrl}
                          alt="Secretary signature"
                          className="h-16 object-contain mix-blend-multiply dark:mix-blend-normal"
                        />
                        <div className="flex gap-2 w-full">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs h-7 border-purple-200 dark:border-purple-800"
                            onClick={() => secretarySigInputRef.current?.click()}
                            disabled={uploadingSecretarySig}
                          >
                            {uploadingSecretarySig ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Upload className="w-3 h-3 mr-1" />}
                            Replace
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="text-xs h-7 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                            onClick={handleSecretarySignatureDelete}
                            disabled={deletingSecretarySig}
                          >
                            {deletingSecretarySig ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => secretarySigInputRef.current?.click()}
                        disabled={uploadingSecretarySig}
                        className="w-full border-2 border-dashed border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 rounded-xl p-4 flex flex-col items-center gap-2 bg-purple-50/40 dark:bg-purple-950/10 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all group cursor-pointer"
                      >
                        {uploadingSecretarySig ? (
                          <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                        ) : (
                          <Upload className="w-6 h-6 text-purple-400 group-hover:text-purple-600 transition-colors" />
                        )}
                        <span className="text-xs text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300">
                          {uploadingSecretarySig ? "Uploading…" : "Click to upload signature image"}
                        </span>
                        <span className="text-[10px] text-slate-400">PNG, JPG, SVG • Transparent background recommended</span>
                      </button>
                    )}
                    <input
                      ref={secretarySigInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleSecretarySignatureUpload}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button type="submit" disabled={savingEvent} className="bg-blue-600 hover:bg-blue-700">
                {savingEvent ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" /> Save Event Details
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleClearEventDetails}
                disabled={clearingEvent}
              >
                {clearingEvent ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Clearing...
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4 mr-2 text-slate-500" /> Clear Details
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ── Form Field Configuration ── */}
      <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
            Registration Form Field Settings
          </CardTitle>
          <CardDescription>
            প্রতিটি field-এ দুটো toggle: <strong>Enable</strong> (field দেখাবে/লুকাবে) এবং <strong>Required</strong> (বাধ্যতামূলক করবে)। Disabled field form-এ দেখাবে না।
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveFieldConfig} className="space-y-6">
            {/* Column headers */}
            <div className="hidden md:grid md:grid-cols-2 gap-4">
              <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-3 pb-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Field</span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider w-24 text-center">Enable</span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider w-24 text-center">Required</span>
              </div>
              <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-3 pb-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Field</span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider w-24 text-center">Enable</span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider w-24 text-center">Required</span>
              </div>
            </div>

            {/* All 17 Form Fields grouped by section */}
            <div className="space-y-6">
              {[
                {
                  section: "Personal Details",
                  fields: [
                    { name: "fullName", label: "Full Name" },
                    { name: "mobile",   label: "Mobile Number" },
                    { name: "email",    label: "Email Address" },
                    { name: "gender",   label: "Gender" },
                    { name: "dob",      label: "Date of Birth" },
                  ],
                },
                {
                  section: "Academic Info",
                  fields: [
                    { name: "schoolName",   label: "School / College Name" },
                    { name: "class",        label: "Class" },
                    { name: "subjectGroup", label: "Subject / Group" },
                    { name: "rollNumber",   label: "Roll Number" },
                    { name: "regNumber",    label: "Registration Number" },
                    { name: "passingYear",  label: "Passing Year" },
                    { name: "gradeGpa",     label: "GPA / Grade" },
                  ],
                },
                {
                  section: "Location & Extra Info",
                  fields: [
                    { name: "address",          label: "Address" },
                    { name: "district",         label: "District" },
                    { name: "bloodGroup",       label: "Blood Group" },
                    { name: "fatherName",       label: "Father's Name" },
                    { name: "emergencyContact", label: "Emergency Contact" },
                  ],
                },
              ].map((group) => (
                <div key={group.section} className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 border-b border-slate-200 dark:border-slate-800 pb-1">
                    {group.section}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {group.fields.map((field) => {
                      const fieldKey = field.name as keyof FieldConfig;
                      const cfg = fieldConfig[fieldKey] || { required: false, enabled: true };
                      return (
                        <div
                          key={field.name}
                          className={`rounded-xl border p-3 transition-all ${
                            cfg.enabled
                              ? "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                              : "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 opacity-70"
                          }`}
                        >
                          {/* Field name + status badge */}
                          <div className="flex items-center gap-2 mb-3">
                            {cfg.enabled ? (
                              <Eye className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            ) : (
                              <EyeOff className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            )}
                            <span className={`text-sm font-semibold flex-1 ${
                              cfg.enabled ? "text-slate-800 dark:text-slate-100" : "text-slate-400 dark:text-slate-500"
                            }`}>
                              {field.label}
                            </span>
                            {!cfg.enabled && (
                              <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500">
                                Hidden
                              </span>
                            )}
                            {cfg.enabled && cfg.required && (
                              <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                                Required
                              </span>
                            )}
                            {cfg.enabled && !cfg.required && (
                              <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                                Optional
                              </span>
                            )}
                          </div>

                          {/* Two toggles side by side */}
                          <div className="flex items-center gap-4">
                            {/* Enable toggle */}
                            <div className="flex items-center gap-2 flex-1">
                              <button
                                type="button"
                                onClick={() => toggleFieldEnabled(fieldKey)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                                  cfg.enabled ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                    cfg.enabled ? "translate-x-6" : "translate-x-1"
                                  }`}
                                />
                              </button>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {cfg.enabled ? "Enabled" : "Disabled"}
                              </span>
                            </div>

                            {/* Required toggle — only active when field is enabled */}
                            <div className={`flex items-center gap-2 flex-1 ${
                              !cfg.enabled ? "opacity-40 pointer-events-none" : ""
                            }`}>
                              <button
                                type="button"
                                onClick={() => toggleFieldRequired(fieldKey)}
                                disabled={!cfg.enabled}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                                  cfg.required ? "bg-amber-500" : "bg-slate-300 dark:bg-slate-700"
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                    cfg.required ? "translate-x-6" : "translate-x-1"
                                  }`}
                                />
                              </button>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {cfg.required ? "Required" : "Optional"}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-150 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <span className="text-xs text-slate-500 italic">
                সবগুলো (১৭টি) Form Field এখন Admin Settings থেকে Enable/Disable ও Required/Optional করা যায়।
              </span>
              <Button type="submit" disabled={savingFieldConfig} className="bg-blue-600 hover:bg-blue-700">
                {savingFieldConfig ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" /> Save Field Settings
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border border-red-200 dark:border-red-900 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-500">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Destructive actions that cannot be undone. Please proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-red-100 dark:border-red-900/50 rounded-lg bg-red-50/50 dark:bg-red-950/20">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white">Clear All Registrations</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Permanently delete all registered users from the database.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleClearAllData}
              disabled={clearing}
            >
              {clearing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Clearing...
                </>
              ) : (
                "Clear All Data"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

