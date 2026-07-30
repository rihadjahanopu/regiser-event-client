import ProfileSettings from "@/components/dashboard/ProfileSettings";

export default function UserProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account profile, credentials, and configuration settings.</p>
      </div>
      <ProfileSettings isAdmin={false} />
    </div>
  );
}
