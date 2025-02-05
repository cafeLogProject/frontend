import { create } from "zustand";

interface ProfileStore {
  file: File | null;
  setFile: (file: File | null) => void;
  profileImageUrl: string | null;
  setProfileImageUrl: (url: string | null) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  file: null,
  setFile: (file) => set({ file }),
  profileImageUrl: null,
  setProfileImageUrl: (url) => set({ profileImageUrl: url }),
}));
