import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth`
    : (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000") + "/api/auth",
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
