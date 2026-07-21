"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon, Upload, Trash2, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/settings");
      if (res.data.success) {
        setCoverUrl(res.data.data?.eventCoverUrl || null);
        setIsRegistrationOpen(res.data.data?.isRegistrationOpen ?? true);
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
        isOpen: !isRegistrationOpen
      });
      if (res.data.success) {
        setIsRegistrationOpen(res.data.data.isRegistrationOpen);
        toast.success(`Registration is now ${res.data.data.isRegistrationOpen ? 'Open' : 'Closed'}`);
      } else {
        toast.error(res.data.error);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update registration status");
    } finally {
      setUpdatingStatus(false);
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
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500">Manage event appearance and global configuration.</p>
      </div>

      <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="space-y-1">
            <CardTitle className="text-lg">Registration Status</CardTitle>
            <CardDescription>
              Turn event registration on or off. When off, users cannot submit new registrations.
            </CardDescription>
          </div>
          <div>
            <button
              onClick={toggleRegistrationStatus}
              disabled={updatingStatus || loading}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${
                isRegistrationOpen ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  isRegistrationOpen ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </CardHeader>
        
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
              {/* Preview */}
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

      <Card className="border border-red-200 dark:border-red-900 shadow-sm mt-8">
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
