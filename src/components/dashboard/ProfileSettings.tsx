"use client";

import { useEffect, useState } from "react";
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Upload, 
  Trash2, 
  Monitor, 
  Globe, 
  MapPin, 
  Mail, 
  Phone, 
  Info,
  Check,
  Smartphone,
  Eye,
  EyeOff
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSession, authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

interface Session {
  id: string;
  userAgent: string;
  ipAddress: string;
  expiresAt: string;
  createdAt: string;
  isCurrent: boolean;
}

export default function ProfileSettings({ isAdmin = false }: { isAdmin?: boolean }) {
  const router = useRouter();
  const { data: authSession, isPending } = useSession();
  const { updateAvatar, updateName } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);

  // Personal Info Form State
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Settings State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [privacySettings, setPrivacySettings] = useState("public");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Delete Account State
  const [deletePassword, setDeletePassword] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Active Tab: "personal", "account", "security"
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    if (authSession?.user) {
      const u = authSession.user;
      setName(u.name || "");
      setUsername(u.username || "");
      setBio(u.bio || "");
      setPhoneNumber(u.phoneNumber || "");
      setWebsite(u.website || "");
      setLocation(u.location || "");
      setAvatarPreview(u.image || null);
      
      setEmailNotifications(u.emailNotifications !== false);
      setPushNotifications(u.pushNotifications !== false);
      setPrivacySettings(u.privacySettings || "public");
      setTwoFactorEnabled(!!u.twoFactorEnabled);
    }
  }, [authSession]);

  useEffect(() => {
    if (activeTab === "security") {
      fetchSessions();
    }
  }, [activeTab]);

  const fetchSessions = async () => {
    setSessionsLoading(true);
    try {
      const endpoint = isAdmin ? "/api/admin/sessions" : "/api/user/sessions";
      const res = await axios.get(endpoint);
      if (res.data.success) {
        setSessions(res.data.data);
      }
    } catch (err) {
      toast.error("Failed to load active sessions");
    } finally {
      setSessionsLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("bio", bio);
    formData.append("phoneNumber", phoneNumber);
    formData.append("website", website);
    formData.append("location", location);
    
    if (avatarFile) {
      formData.append("image", avatarFile);
    }

    try {
      const res = await axios.put("/api/user/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      if (res.data.success) {
        toast.success("Profile information updated successfully!");
        if (res.data.user?.image) {
          setAvatarPreview(res.data.user.image);
          updateAvatar(res.data.user.image);
        }
        if (res.data.user?.name) {
          updateName(res.data.user.name);
        }
        setAvatarFile(null);
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update profile information");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async () => {
    setLoading(true);
    try {
      const res = await axios.put("/api/user/settings", {
        emailNotifications,
        pushNotifications,
        privacySettings,
        twoFactorEnabled
      });
      if (res.data.success) {
        toast.success("Account preferences updated successfully!");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update account settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    setChangingPassword(true);
    try {
      const { error } = await authClient.changePassword({
        newPassword,
        currentPassword,
        revokeOtherSessions: false
      });

      if (error) {
        toast.error(error.message || "Failed to change password");
      } else {
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      toast.error("An error occurred while changing password");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      const res = await axios.post("/api/user/sessions/revoke", { sessionId });
      if (res.data.success) {
        toast.success("Session revoked successfully");
        setSessions(sessions.filter(s => s.id !== sessionId));
      }
    } catch (err) {
      toast.error("Failed to revoke session");
    }
  };

  const handleRevokeAllOtherSessions = async () => {
    if (!confirm("Are you sure you want to log out from all other devices?")) return;
    try {
      const endpoint = isAdmin ? "/api/admin/sessions/revoke-all" : "/api/user/sessions/revoke-all";
      const res = await axios.post(endpoint);
      if (res.data.success) {
        toast.success("Logged out from all other devices successfully");
        fetchSessions();
      }
    } catch (err) {
      toast.error("Failed to revoke other sessions");
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletePassword) {
      toast.error("Please enter your password to confirm account deletion");
      return;
    }
    if (!confirm("WARNING: This is permanent. All your data will be deleted. Are you sure you want to delete your account?")) return;

    setDeletingAccount(true);
    try {
      const res = await axios.delete("/api/user/account", {
        data: { password: deletePassword }
      });

      if (res.data.success) {
        toast.success("Account deleted. We are sorry to see you go.");
        router.push("/admin/login");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Incorrect password. Failed to delete account.");
    } finally {
      setDeletingAccount(false);
    }
  };

  const parseUserAgent = (ua: string) => {
    if (ua.includes("Firefox")) return "Firefox Browser";
    if (ua.includes("Chrome") && ua.includes("Safari")) return "Chrome Browser";
    if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari Browser";
    if (ua.includes("Edge")) return "Edge Browser";
    return ua.length > 30 ? ua.substring(0, 30) + "..." : ua;
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Sidebar Tabs */}
      <div className="md:col-span-1 flex flex-col gap-1">
        <button
          onClick={() => setActiveTab("personal")}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-all ${
            activeTab === "personal"
              ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
              : "text-slate-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <User className="w-4 h-4" />
          Personal Info
        </button>
        <button
          onClick={() => setActiveTab("account")}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-all ${
            activeTab === "account"
              ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
              : "text-slate-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <Bell className="w-4 h-4" />
          Account & Prefs
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-all ${
            activeTab === "security"
              ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
              : "text-slate-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <Shield className="w-4 h-4" />
          Security & Sessions
        </button>
      </div>

      {/* Main Settings Form Container */}
      <div className="md:col-span-3">
        {activeTab === "personal" && (
          <Card className="bg-[#0c0c16] border-white/5 text-white">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-white/5 pb-3">
                <User className="text-violet-400 w-5 h-5" />
                Personal Information
              </h2>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                {/* Profile Photo Uploader */}
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative group w-24 h-24 rounded-full overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-slate-500" />
                    )}
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-all">
                      <Upload className="w-4 h-4 text-white" />
                      <span className="text-[10px] text-white mt-1">Upload</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </label>
                  </div>
                  <div className="text-center sm:text-left space-y-1">
                    <h4 className="text-sm font-semibold">Profile Picture</h4>
                    <p className="text-xs text-slate-500">Allowed formats: PNG, JPG, GIF. Max file size: 5MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-slate-300">Full Name</Label>
                    <Input
                      id="fullName"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-white/5 border-white/10"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-slate-300">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. user123"
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">Email Address (Read-only)</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <Input
                      id="email"
                      value={authSession?.user?.email || ""}
                      className="bg-white/5 border-white/10 pl-10 cursor-not-allowed text-slate-400"
                      readOnly
                    />
                  </div>
                  <p className="text-[10px] text-slate-600 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" /> For email changes, please contact support.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-slate-300">Bio</Label>
                  <textarea
                    id="bio"
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 focus-visible:outline-none resize-y"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-300 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" /> Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-slate-300 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5" /> Website
                    </Label>
                    <Input
                      id="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://example.com"
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-slate-300 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> Location
                    </Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Dhaka, Bangladesh"
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 h-10 px-5 rounded-xl shadow-lg shadow-violet-600/20"
                >
                  {loading ? "Updating..." : "Save Information"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {activeTab === "account" && (
          <Card className="bg-[#0c0c16] border-white/5 text-white">
            <CardContent className="p-6 space-y-8">
              {/* Notification Preferences */}
              <div>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
                  <Bell className="text-violet-400 w-5 h-5" />
                  Notifications & Preferences
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-white/[0.01]">
                    <div>
                      <h4 className="text-sm font-semibold">Email Notifications</h4>
                      <p className="text-xs text-slate-500">Receive periodic emails for comments, approvals, and platform updates.</p>
                    </div>
                    <input 
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="w-4 h-4 rounded accent-violet-600 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-white/[0.01]">
                    <div>
                      <h4 className="text-sm font-semibold">Push Notifications</h4>
                      <p className="text-xs text-slate-500">Enable in-browser desktop and mobile push notification alerts.</p>
                    </div>
                    <input 
                      type="checkbox"
                      checked={pushNotifications}
                      onChange={(e) => setPushNotifications(e.target.checked)}
                      className="w-4 h-4 rounded accent-violet-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
                  <Shield className="text-violet-400 w-5 h-5" />
                  Privacy & Extra Options
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-white/[0.01]">
                    <div>
                      <h4 className="text-sm font-semibold">Profile Visibility</h4>
                      <p className="text-xs text-slate-500">Select whether your user profile detail page is public or private.</p>
                    </div>
                    <select
                      value={privacySettings}
                      onChange={(e) => setPrivacySettings(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-lg text-xs h-9 px-2 text-white"
                    >
                      <option value="public" className="bg-[#0c0c16]">Public Profile</option>
                      <option value="private" className="bg-[#0c0c16]">Private Profile</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-white/[0.01]">
                    <div>
                      <h4 className="text-sm font-semibold">Two-Factor Authentication</h4>
                      <p className="text-xs text-slate-500">Add an extra layer of security to your account with 2FA checks.</p>
                    </div>
                    <input 
                      type="checkbox"
                      checked={twoFactorEnabled}
                      onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                      className="w-4 h-4 rounded accent-violet-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  onClick={handleUpdateSettings}
                  disabled={loading}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 h-10 px-5 rounded-xl"
                >
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "security" && (
          <div className="space-y-6">
            {/* Change Password Card */}
            <Card className="bg-[#0c0c16] border-white/5 text-white">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-white/5 pb-3">
                  <Lock className="text-violet-400 w-5 h-5" />
                  Change Password
                </h2>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="bg-white/5 border-white/10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-3 text-slate-500 hover:text-white"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="bg-white/5 border-white/10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-3 text-slate-500 hover:text-white"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-white/5 border-white/10"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={changingPassword}
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 h-10 px-5 rounded-xl mt-2"
                  >
                    {changingPassword ? "Updating Password..." : "Update Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Active Sessions Card */}
            <Card className="bg-[#0c0c16] border-white/5 text-white">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-3">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Monitor className="text-violet-400 w-5 h-5" />
                    Active Login Sessions
                  </h2>
                  {sessions.length > 1 && (
                    <button
                      onClick={handleRevokeAllOtherSessions}
                      className="text-xs font-semibold text-red-400 hover:text-red-300"
                    >
                      Logout from Other Devices
                    </button>
                  )}
                </div>

                {sessionsLoading ? (
                  <div className="flex justify-center items-center py-6">
                    <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : sessions.length > 0 ? (
                  <div className="space-y-3.5">
                    {sessions.map((s) => (
                      <div
                        key={s.id}
                        className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01] flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 shrink-0">
                            {s.userAgent.includes("Mobi") ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-semibold text-white">{parseUserAgent(s.userAgent)}</span>
                              {s.isCurrent && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold uppercase">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              IP: {s.ipAddress} &bull; Created: {new Date(s.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {!s.isCurrent && (
                          <button
                            onClick={() => handleRevokeSession(s.id)}
                            className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
                            title="Revoke Session (Log out device)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm py-4">No active sessions loaded.</p>
                )}
              </CardContent>
            </Card>

            {/* Danger Zone — Delete Account */}
            {!isAdmin && (
              <Card className="border-red-500/20 bg-red-500/[0.02] text-white">
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold mb-2 text-red-400 flex items-center gap-2">
                    <Trash2 className="w-5 h-5" />
                    Danger Zone
                  </h2>
                  <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                    Permanently delete your user account and revoke all sessions. This action is irreversible. All published drafts will lose authorship connection.
                  </p>

                  <form onSubmit={handleDeleteAccount} className="space-y-4 max-w-sm">
                    <div className="space-y-2">
                      <Label htmlFor="deleteConfirmPassword">Confirm Password</Label>
                      <Input
                        id="deleteConfirmPassword"
                        type="password"
                        placeholder="Enter password to confirm deletion"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        className="bg-white/5 border-red-500/20 focus-visible:ring-red-500 text-white placeholder-slate-600"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={deletingAccount}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold h-10 px-5 rounded-xl shadow-lg shadow-red-600/15"
                    >
                      {deletingAccount ? "Deleting Account..." : "Permanently Delete Account"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
