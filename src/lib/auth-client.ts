import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth`
    : (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000") + "/api/auth",
});

export const { signIn, signUp, signOut, useSession } = authClient;
