import { useNavigate, useLocation } from "react-router-dom";
import { DraftList } from "@/widgets/draftList";
import { useReviewDraftStore } from "@/shared/store/useReviewDraftStore";
import { useDraftSelectionStore } from "@/shared/store/useDraftSelectionStore";
import { useReviewDraftApi } from "@shared/api/reviews/reviewDraftApi";
import styles from "./styles/DraftReview.module.scss";
import { useState, useEffect } from "react";
import { useQueryClient } from '@tanstack/react-query';

const DraftReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { updateDraft } = useReviewDraftStore();
  const { isSelectionMode, selectedDrafts, setSelectionMode, clearSelection } = useDraftSelectionStore();
  const { useDraftReview, useUserDraftReviews } = useReviewDraftApi();
  const [selectedDraftId, setSelectedDraftId] = useState<number | null>(null);
  
  // location.state에서 cafeId 추출
  const cafeId = location.state?.cafeId as number | undefined;

  const draftQuery = useDraftReview(selectedDraftId, {
    enabled: selectedDraftId !== null,
    staleTime: 0,
  });

  useEffect(() => {
    if (draftQuery.data) {
      const menuTags: number[] = [];
      const interiorTags: number[] = [];

      (draftQuery.data.tagIds ?? []).forEach((tagId) => {
        if (tagId <= 100) {
          menuTags.push(tagId);
        } else {
          interiorTags.push(tagId);
        }
      });

      const draftData = {
        id: draftQuery.data.draftReviewId,
        cafe: {
          id: draftQuery.data.cafeId,
          name: draftQuery.data.cafeName,
        },
        content: draftQuery.data.content,
        rating: draftQuery.data.rating,
        visitDate: draftQuery.data.visitDate,
        imageIds: draftQuery.data.imageIds?.map((id) => id.toString()),
        tags: {
          menu: menuTags,
          interior: interiorTags,
        },
      };

      updateDraft(draftData);

      // 스토어 업데이트가 완료된 후 네비게이션
      Promise.resolve().then(() => {
        navigate("/review/write", { state: { from: '/draft' } });
      });
    }

    return () => {
      setSelectionMode(false);
      clearSelection();
    };
  }, [draftQuery.data]);

  const handleDraftSelect = async (draftId: number) => {
    if (!isSelectionMode) {
      setSelectedDraftId(draftId);
    }
  };

  return (
    <div className={styles.draftReview}>
      <div className={styles.draftGuide}>
        {isSelectionMode 
          ? (
            <>
              총 <span style={{ color: '#FF8922' }}>{selectedDrafts.length}</span>개 선택
            </>
          )
          : "최대 100개까지, 90일이 지나면 자동으로 사라져요."
        }
      </div>
      <DraftList onSelect={handleDraftSelect} cafeId={cafeId} />
      
      {isSelectionMode && (
        <>
          <div className={styles.buttonOverlay} />
          <div className={styles.buttonContainer}>
            <button 
              onClick={() => {/* 전체 삭제 로직 */}}
              disabled={selectedDrafts.length === 0}
            >
              전체 삭제
            </button>
            <button 
              onClick={() => {/* 선택 삭제 로직 */}}
              disabled={selectedDrafts.length === 0}
            >
              선택 삭제
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DraftReview;
