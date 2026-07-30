import ProfileSettings from "@/components/dashboard/ProfileSettings";

export default function AdminProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Profile Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage administrative profile details, passwords, and active sessions.</p>
      </div>
      <ProfileSettings isAdmin={true} />
    </div>
  );
}
