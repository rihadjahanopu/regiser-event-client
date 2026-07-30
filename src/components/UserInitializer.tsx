"use client";

import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useUserStore } from "@/store/useUserStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import axios from "axios";

/**
 * UserInitializer — mounts once in the root layout.
 * Hydrates the Zustand stores from the session and fetches unread notification count.
 * Has no visible UI output.
 */
export default function UserInitializer() {
  const { data: session, isPending } = useSession();
  const { setProfile, clearProfile, isInitialized } = useUserStore();
  const { setUnreadCount } = useNotificationStore();

  // Sync user profile into store
  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      clearProfile();
      return;
    }

    const u = session.user as any;
    setProfile({
      id: u.id,
      name: u.name,
      email: u.email,
      image: u.image || null,
      role: u.role || "user",
      username: u.username,
      bio: u.bio,
      phoneNumber: u.phoneNumber,
      website: u.website,
      location: u.location,
    });
  }, [session, isPending, setProfile, clearProfile]);

  // Fetch unread notification count whenever the user logs in
  useEffect(() => {
    if (!session?.user) return;

    axios
      .get("/api/user/notifications")
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data?.data)) {
          const unread = (res.data.data as any[]).filter((n) => !n.read).length;
          setUnreadCount(unread);
        }
      })
      .catch(() => {});
  }, [session?.user?.id, setUnreadCount]);

  return null;
}
