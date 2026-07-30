import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

// IMPORTANT: baseURL must point directly at the backend API server.
// Next.js rewrites strip Set-Cookie headers, so auth requests must go to the backend directly.
// CORS is configured on the backend to allow credentials from localhost:3000.
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
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
        privacySettings: { type: "string" }
      }
    })
  ]
});

export const { signIn, signUp, signOut, useSession } = authClient;
