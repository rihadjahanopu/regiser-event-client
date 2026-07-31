/* eslint-disable */
"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Users,
  Loader2,
  Trash2,
  Upload,
  X,
  Plus,
  Pencil,
  Award,
  CheckCircle2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  designation: string;
  imageUrl: string;
  signatureUrl: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

const emptyForm = {
  name: "",
  role: "",
  designation: "",
  order: "0",
};

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [sigFile, setSigFile] = useState<File | null>(null);
  const [sigPreview, setSigPreview] = useState<string | null>(null);

  const imageRef = useRef<HTMLInputElement>(null);
  const sigRef = useRef<HTMLInputElement>(null);

  const fetchMembers = async () => {
    try {
      const res = await axios.get("/api/admin/team", { withCredentials: true });
      setMembers(res.data.data || []);
    } catch {
      toast.error("Team members লোড করতে পারেনি");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setSigFile(null);
    setSigPreview(null);
    setEditingMember(null);
    if (imageRef.current) imageRef.current.value = "";
    if (sigRef.current) sigRef.current.value = "";
  };

  const startEdit = (m: TeamMember) => {
    setEditingMember(m);
    setForm({ name: m.name, role: m.role, designation: m.designation, order: String(m.order) });
    setImagePreview(m.imageUrl || null);
    setSigPreview(m.signatureUrl || null);
    setImageFile(null);
    setSigFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.role.trim()) {
      toast.error("নাম ও পদবী আবশ্যক");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("role", form.role.trim());
      fd.append("designation", form.designation.trim());
      fd.append("order", form.order || "0");
      if (imageFile) fd.append("image", imageFile);
      if (sigFile) fd.append("signature", sigFile);

      if (editingMember) {
        const res = await axios.put(`/api/admin/team/${editingMember._id}`, fd, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMembers((prev) => prev.map((m) => (m._id === editingMember._id ? res.data.data : m)));
        toast.success("সদস্য আপডেট হয়েছে!");
      } else {
        const res = await axios.post("/api/admin/team", fd, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMembers((prev) => [...prev, res.data.data]);
        toast.success("নতুন সদস্য যোগ হয়েছে!");
      }
      resetForm();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "সংরক্ষণ করতে সমস্যা হয়েছে");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (member: TeamMember) => {
    try {
      const fd = new FormData();
      fd.append("isActive", String(!member.isActive));
      const res = await axios.put(`/api/admin/team/${member._id}`, fd, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMembers((prev) => prev.map((m) => (m._id === member._id ? res.data.data : m)));
      toast.success(member.isActive ? "লুকানো হয়েছে" : "দৃশ্যমান করা হয়েছে");
    } catch {
      toast.error("Status পরিবর্তন করতে পারেনি");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("এই সদস্যকে permanently delete করতে চান?")) return;
    setDeletingId(id);
    try {
      await axios.delete(`/api/admin/team/${id}`, { withCredentials: true });
      setMembers((prev) => prev.filter((m) => m._id !== id));
      toast.success("সদস্য মুছে ফেলা হয়েছে");
    } catch {
      toast.error("Delete করতে সমস্যা হয়েছে");
    } finally {
      setDeletingId(null);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "sig"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === "image") { setImageFile(file); setImagePreview(url); }
    else { setSigFile(file); setSigPreview(url); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Leadership Management</h1>
        <p className="text-slate-400 mt-1 text-sm">
          নেতাদের যোগ করুন, সম্পাদনা করুন ও সাজান — Home page-এ automatically দেখাবে
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Form */}
        <div className="xl:col-span-1">
          <div className="bg-[#0c0c16] border border-white/5 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-white/5 pb-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${editingMember ? "bg-amber-500/15" : "bg-violet-500/15"}`}>
                {editingMember ? (
                  <Pencil className="w-4 h-4 text-amber-400" />
                ) : (
                  <Plus className="w-4 h-4 text-violet-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  {editingMember ? "সম্পাদনা করুন" : "নতুন নেতা যোগ"}
                </p>
                <p className="text-[11px] text-slate-500">
                  {editingMember ? `"${editingMember.name}" সম্পাদনা হচ্ছে` : "নাম, পদবী ও ছবি দিন"}
                </p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: "নাম", key: "name", placeholder: "e.g. Md. Abdur Rahman", required: true },
                { label: "পদ (Role)", key: "role", placeholder: "e.g. President", required: true },
                { label: "বিস্তারিত পদবী", key: "designation", placeholder: "e.g. President, Chhatak Uttar" },
              ].map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    placeholder={field.placeholder}
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                    className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-all"
                  />
                </div>
              ))}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">ক্রম (Order)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={form.order}
                  onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
                  className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-all"
                />
              </div>

              {/* Photo upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">ছবি</label>
                <div
                  className="border-2 border-dashed rounded-xl p-3 cursor-pointer hover:border-violet-500/40 transition-colors border-white/10"
                  onClick={() => imageRef.current?.click()}
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="w-full h-36 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(null); if (imageRef.current) imageRef.current.value = ""; }}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-6 text-slate-500">
                      <Upload className="w-7 h-7 mb-2" />
                      <p className="text-xs">ছবি আপলোড করুন</p>
                    </div>
                  )}
                  <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "image")} />
                </div>
              </div>

              {/* Signature upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">স্বাক্ষর (ঐচ্ছিক)</label>
                <div
                  className="border-2 border-dashed rounded-xl p-3 cursor-pointer hover:border-indigo-500/40 transition-colors border-white/10"
                  onClick={() => sigRef.current?.click()}
                >
                  {sigPreview ? (
                    <div className="relative">
                      <img src={sigPreview} alt="Signature" className="w-full h-20 object-contain rounded-lg" />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setSigFile(null); setSigPreview(null); if (sigRef.current) sigRef.current.value = ""; }}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-4 text-slate-500">
                      <Upload className="w-6 h-6 mb-1" />
                      <p className="text-xs">স্বাক্ষর আপলোড করুন</p>
                    </div>
                  )}
                  <input ref={sigRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, "sig")} />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 h-10 bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                >
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" />সংরক্ষণ...</> : <><CheckCircle2 className="w-4 h-4" />{editingMember ? "আপডেট করুন" : "যোগ করুন"}</>}
                </button>
                {editingMember && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="h-10 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white rounded-xl transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Members List */}
        <div className="xl:col-span-2">
          <div className="bg-[#0c0c16] border border-white/5 rounded-2xl p-6 h-full">
            <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                <Users className="w-4 h-4 text-indigo-400" />
              </div>
              <p className="text-sm font-bold text-white">নেতৃত্ব তালিকা</p>
              <span className="ml-auto text-xs text-slate-500">{members.length} জন</span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
              </div>
            ) : members.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
                  <Users className="w-7 h-7 text-slate-600" />
                </div>
                <p className="font-medium text-slate-400 text-sm">এখনো কোনো নেতা যোগ করা হয়নি</p>
                <p className="text-xs text-slate-600 mt-1">বামের form দিয়ে প্রথম সদস্য যোগ করুন</p>
              </div>
            ) : (
              <div className="space-y-3">
                {members
                  .sort((a, b) => a.order - b.order)
                  .map((member) => (
                  <div
                    key={member._id}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      editingMember?._id === member._id
                        ? "border-violet-500/40 bg-violet-500/5"
                        : "border-white/5 hover:border-white/10 bg-white/2"
                    } ${!member.isActive ? "opacity-50" : ""}`}
                  >
                    {/* Avatar */}
                    {member.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-white text-sm truncate">{member.name}</p>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400">
                          <Award className="w-2.5 h-2.5" />
                          {member.role}
                        </span>
                      </div>
                      {member.designation && (
                        <p className="text-xs text-slate-500 mt-0.5 truncate">{member.designation}</p>
                      )}
                      <p className="text-[10px] text-slate-600 mt-0.5">ক্রম: {member.order}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleToggleActive(member)}
                        title={member.isActive ? "লুকান" : "দেখান"}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        {member.isActive
                          ? <ToggleRight className="w-5 h-5 text-emerald-400" />
                          : <ToggleLeft className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => startEdit(member)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(member._id)}
                        disabled={deletingId === member._id}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        {deletingId === member._id
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
