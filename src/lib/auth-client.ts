/* eslint-disable @typescript-eslint/typedef */
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

/**
 * Auth Client Configuration
 *
 * baseURL must point to the Next.js app itself (same origin as the frontend).
 *
 * Why NOT directly to the backend?
 * - In production, frontend is on talamijbd.vercel.app
 * - Backend is on a different domain (e.g., talamij-server.vercel.app)
 * - Browsers block cross-origin Set-Cookie (SameSite=Lax policy)
 * - Cookie never gets saved → user appears logged out every time
 *
 * Solution:
 * - All auth requests go to /api/auth/* on the SAME origin as the frontend
 * - Next.js route handler at /api/auth/[...all]/route.ts proxies to backend
 * - Cookie is set on the frontend domain → browser accepts it ✅
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [
    inferAdditionalFields({
      user: {
        role: { type: "string" },
        username: { type: "string" },
        bio: { type: "string" },
        phoneNumber: { type: "string" },
        website: { type: "string" },
        location: { type: "string" },
        twoFactorEnabled: { type: "boolean" },
        emailNotifications: { type: "boolean" },
        pushNotifications: { type: "boolean" },
        privacySettings: { type: "string" },
      },
    }),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
