import { create } from 'zustand';

interface ProfileEditStore {
  isEditing: boolean;
  handleComplete: () => Promise<void>;
  setHandleComplete: (handler: () => Promise<void>) => void;
}

export const useProfileEditStore = create<ProfileEditStore>((set) => ({
  isEditing: false,
  handleComplete: async () => {},
  setHandleComplete: (handler) => set({ handleComplete: handler }),
}));
