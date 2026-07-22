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
} from "lucide-react";

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

  // Form Field Config state
  const [fieldConfig, setFieldConfig] = useState<Record<string, boolean>>({
    email: false,
    dob: false,
    fatherName: false,
    rollNumber: false,
    regNumber: false,
    bloodGroup: false,
    emergencyContact: false,
    passingYear: false,
    gradeGpa: false,
  });
  const [savingFieldConfig, setSavingFieldConfig] = useState(false);

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
        if (d.fieldConfig) {
          setFieldConfig(d.fieldConfig);
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

  const toggleFieldRequired = (fieldName: string) => {
    setFieldConfig((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
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
            Choose which optional fields should be set to <strong>Required (বাধ্যতামূলক)</strong>. Fields that are not toggled will remain <strong>Optional</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveFieldConfig} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "email", label: "Email Address" },
                { name: "dob", label: "Date of Birth" },
                { name: "fatherName", label: "Father's Name" },
                { name: "rollNumber", label: "Roll Number" },
                { name: "regNumber", label: "Registration Number" },
                { name: "bloodGroup", label: "Blood Group" },
                { name: "emergencyContact", label: "Emergency Contact" },
                { name: "passingYear", label: "Passing Year" },
                { name: "gradeGpa", label: "GPA / Grade" },
              ].map((field) => (
                <div
                  key={field.name}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-150 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                >
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {field.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      fieldConfig[field.name]
                        ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}>
                      {fieldConfig[field.name] ? "Required" : "Optional"}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleFieldRequired(field.name)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        fieldConfig[field.name] ? "bg-amber-500" : "bg-slate-300 dark:bg-slate-700"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          fieldConfig[field.name] ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-150 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <span className="text-xs text-slate-500 italic">
                Note: Core fields (Name, Mobile, Gender, Address, School, Class, Group) are always Required.
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

