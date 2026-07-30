/* eslint-disable @typescript-eslint/typedef */
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

// baseURL must point to the backend's /api/auth endpoint directly.
// This was the original working format — do NOT remove /api/auth suffix.
export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_API_URL
		? `${process.env.NEXT_PUBLIC_API_URL}/api/auth`
		: "http://localhost:5000/api/auth",
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
