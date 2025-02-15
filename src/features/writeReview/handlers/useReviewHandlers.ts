import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { ReviewRequest, ReviewResponse } from "@shared/api/reviews/types";
import type { ReviewDraft } from "@shared/store/useReviewDraftStore";
import { useCafeApi } from "@shared/api/cafe/cafe";
import { useReviewDraftApi } from "@shared/api/reviews/reviewDraftApi";
import { UpdateDraftReviewRequest } from '@/shared/api/reviews/types';
import { useQueryClient } from "@tanstack/react-query";

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
  updateLocalDraft: (updates: Partial<ReviewDraft>) => void,
  clearDraft: (preserveFields?: (keyof ReviewDraft)[]) => void,
  createReview: (request: ReviewRequest) => Promise<ReviewResponse>,
  returnPath: string
): ReviewHandlers => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { checkCafeExists, saveCafe } = useCafeApi();
  const { updateDraft } = useReviewDraftApi();

  const validateCafeExists = async () => {
    if (!draft.cafe) return false;
    
    const { exist } = await checkCafeExists({
      name: draft.cafe.name,
      mapx: draft.cafe.mapx,
      mapy: draft.cafe.mapy
    });
    
    return exist;
  };

  // 로컬 상태와 서버 상태를 모두 업데이트하는 함수
  const handleDraftUpdate = async (updates: Partial<ReviewDraft>) => {
    // 로컬 상태 업데이트
    updateLocalDraft(updates);

    // draft.id가 있는 경우에만 서버 업데이트
    if (draft.id) {
      try {
        // Only include fields that were actually updated
        const updatePayload: UpdateDraftReviewRequest = {};
        
        if ('content' in updates) updatePayload.content = updates.content;
        if ('rating' in updates) updatePayload.rating = updates.rating;
        if ('visitDate' in updates) updatePayload.visitDate = updates.visitDate;
        if ('tags' in updates && updates.tags) {  // tags가 존재할 때만 tagIds 포함
          updatePayload.tagIds = [...updates.tags.menu, ...updates.tags.interior];
        }

        await updateDraft(draft.id, updatePayload);
        // 특정 draft의 캐시를 무효화
        await queryClient.invalidateQueries({ 
          queryKey: ['draftReview', draft.id] 
        });
      } catch (error) {
        console.error("리뷰 초안 업데이트 실패:", error);
      }
    }
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

      if (!draft.id) {
        throw new Error("리뷰 초안 ID가 없습니다.");
      }

      // Create review
      await createReview({
        draftId: draft.id,
        cafeId: draft.cafe.id,
        rating: draft.rating,
        visitDate: draft.visitDate,
        content: draft.content || "",
        imageIds: draft.imageIds,
        tagIds: [...draft.tags.menu, ...draft.tags.interior]
      });

      clearDraft();
      // navigate(returnPath || "/");
      navigate("/", { replace: true });

    } catch (err) {
      setError(err instanceof Error ? err : new Error("리뷰 작성에 실패했습니다."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    handleRatingChange: (rating) => handleDraftUpdate({ rating }),
    handleDateChange: (date) => handleDraftUpdate({ visitDate: date }),
    handleContentChange: (content) => handleDraftUpdate({ content }),
    handleImageUpload: (imageIds) => handleDraftUpdate({ imageIds }),
    handleTagSelect: (category, tagId) => {
      const newTags = {
        ...draft.tags,
        [category]: draft.tags[category].includes(tagId)
          ? draft.tags[category].filter(id => id !== tagId)
          : [...draft.tags[category], tagId]
      };
      handleDraftUpdate({ tags: newTags });
    },
    isSubmitting,
    error
  };
};
