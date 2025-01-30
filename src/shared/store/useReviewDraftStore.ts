import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ICafeDescription } from '@shared/api/cafe/types';

export interface ReviewDraft {
  id?: number;
  cafe: ICafeDescription | null;
  rating: number;
  visitDate: string;
  content?: string;
  imageIds: string[];
  tags: {
    menu: number[];
    interior: number[];
  };

}

interface ReviewDraftStore {
  draft: ReviewDraft;
  updateDraft: (updates: Partial<ReviewDraft>) => void;
  clearDraft: (preserveFields?: (keyof ReviewDraft)[]) => void;
}

const initialDraft: ReviewDraft = {
  id: undefined,
  cafe: null,
  rating: 0,
  visitDate: '',
  content: '',
  imageIds: [],
  tags: {
    menu: [],
    interior: []
  },
};

export const useReviewDraftStore = create<ReviewDraftStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      updateDraft: (updates) => 
        set((state) => ({
          draft: {
            ...state.draft,
            ...updates
          }
        })),
      clearDraft: (preserveFields = []) => set((state) => ({
        draft: {
          ...initialDraft,
          ...Object.fromEntries(
            preserveFields.map(field => [field, state.draft[field]])
          )
        }
      })),
    }),
    {
      name: 'review-draft',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

const store = useReviewDraftStore.getState();
console.log('localStorage draft:', localStorage.getItem('review-draft'));
console.log('store draft:', store.draft);