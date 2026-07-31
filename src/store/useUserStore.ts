/* eslint-disable @typescript-eslint/typedef */
import { create } from "zustand";

interface UserProfile {
	id: string;
	name: string;
	email: string;
	image: string | null;
	role: string;
	username?: string;
	bio?: string;
	phoneNumber?: string;
	website?: string;
	location?: string;
}

interface UserStore {
	profile: UserProfile | null;
	isInitialized: boolean;
	setProfile: (profile: UserProfile) => void;
	updateAvatar: (imageUrl: string) => void;
	updateName: (name: string) => void;
	updateUsername: (username: string) => void;
	clearProfile: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
	profile: null,
	isInitialized: false,

	setProfile: (profile) => set({ profile, isInitialized: true }),

	updateAvatar: (imageUrl) =>
		set((state) => ({
			profile: state.profile ? { ...state.profile, image: imageUrl } : null,
		})),

	updateName: (name) =>
		set((state) => ({
			profile: state.profile ? { ...state.profile, name } : null,
		})),

	updateUsername: (username) =>
		set((state) => ({
			profile: state.profile ? { ...state.profile, username } : null,
		})),

	clearProfile: () => set({ profile: null, isInitialized: false }),
}));
