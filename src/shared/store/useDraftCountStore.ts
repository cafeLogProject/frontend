import { create } from 'zustand';

interface DraftCountStore {
  count: number;
  setCount: (count: number) => void;
}

export const useDraftCountStore = create<DraftCountStore>((set) => ({
  count: 0,
  setCount: (count) => set({ count }),
}));
