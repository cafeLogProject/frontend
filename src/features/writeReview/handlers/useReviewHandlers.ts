import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { ReviewRequest, ReviewResponse } from "@shared/api/reviews/types";
import type { ReviewDraft } from "@shared/store/useReviewDraftStore";
import { useCafeApi } from "@shared/api/cafe/cafe";

interface ReviewHandlers {
  handleSubmit: () => Promise<void>;
  handleRatingChange: (rating: number) => void;
  handleDateChange: (date: string) => void;
  handleContentChange: (content: string) => void;
  handleImageUpload: (imageIds: string[]) => void;
  handleTagSelect: (category: 'menu' | 'interior', tagId: number) => void;
  isSubmitting: boolean;
  error: Error | null;
}

export const useReviewHandlers = (
  draft: ReviewDraft,
  updateDraft: (updates: Partial<ReviewDraft>) => void,
  clearDraft: (preserveFields?: (keyof ReviewDraft)[]) => void,
  createReview: (request: ReviewRequest) => Promise<ReviewResponse>,
  returnPath: string
): ReviewHandlers => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { checkCafeExists, saveCafe } = useCafeApi();

  const validateCafeExists = async () => {
    if (!draft.cafe) return false;
    
    const { exist } = await checkCafeExists({
      name: draft.cafe.name,
      mapx: draft.cafe.mapx,
      mapy: draft.cafe.mapy
    });
    
    return exist;
  };

  const handleSubmit = async () => {
    if (!draft.cafe) return;
    
    try {
      setIsSubmitting(true);
      setError(null);

      // Validate cafe exists or save it
      if (!(await validateCafeExists())) {
        const saveResponse = await saveCafe({
          title: draft.cafe.name,
          category: draft.cafe.category,
          mapx: draft.cafe.mapx,
          mapy: draft.cafe.mapy,
          address: draft.cafe.address,
          roadAddress: draft.cafe.roadAddress,
          link: draft.cafe.link
        });
        
        if (!saveResponse.cafeId) {
          throw new Error("카페 저장에 실패했습니다.");
        }
      }

      // Create review
      await createReview({
        cafeId: draft.cafe.id,
        rating: draft.rating,
        visitDate: draft.visitDate,
        content: draft.content || "",
        imageIds: draft.imageIds,
        tagIds: [...draft.tags.menu, ...draft.tags.interior]
      });

      clearDraft();
      navigate(returnPath || "/");

    } catch (err) {
      setError(err instanceof Error ? err : new Error("리뷰 작성에 실패했습니다."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    handleRatingChange: (rating) => updateDraft({ rating }),
    handleDateChange: (date) => updateDraft({ visitDate: date }),
    handleContentChange: (content) => updateDraft({ content }),
    handleImageUpload: (imageIds) => updateDraft({ imageIds }),
    handleTagSelect: (category, tagId) => {
      updateDraft({
        tags: {
          ...draft.tags,
          [category]: draft.tags[category].includes(tagId)
            ? draft.tags[category].filter(id => id !== tagId)
            : [...draft.tags[category], tagId]
        }
      });
    },
    isSubmitting,
    error
  };
};
