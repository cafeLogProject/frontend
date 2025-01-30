import { create } from 'zustand';

interface DraftSelectionStore {
  isSelectionMode: boolean;
  selectedDrafts: number[];
  setSelectionMode: (mode: boolean) => void;
  toggleDraftSelection: (draftId: number) => void;
  clearSelection: () => void;
}

export const useDraftSelectionStore = create<DraftSelectionStore>((set) => ({
  isSelectionMode: false,
  selectedDrafts: [],
  setSelectionMode: (mode) => set({ isSelectionMode: mode }),
  toggleDraftSelection: (draftId) => 
    set((state) => ({
      selectedDrafts: state.selectedDrafts.includes(draftId)
        ? state.selectedDrafts.filter(id => id !== draftId)
        : [...state.selectedDrafts, draftId]
    })),
  clearSelection: () => set({ selectedDrafts: [], isSelectionMode: false }),
}));
