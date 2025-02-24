import { useState } from "react";
import { useReviewApi } from "@shared/api/reviews/reviewApi";
import styles from "./ReviewMore.module.scss";
import Button from "@/shared/ui/button/ui/Button";
import Modal from "@/shared/ui/modal/Modal";

interface ReviewMoreProps {
  reviewId: number;
  isOwner: boolean; // 새로 추가된 prop
  onDelete?: () => void;
  onModalOpen?: () => void; // 추가
  onModalClose?: () => void; // 추가
}

const ReviewMore = ({ 
  reviewId, 
  isOwner,
  onDelete,
  onModalOpen,
  onModalClose 
}: ReviewMoreProps) => {
  const { deleteReview } = useReviewApi();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 표시할 수 있는 버튼의 개수를 계산
  const getVisibleButtonCount = () => {
    let count = 0;
    if (isOwner) {
      count += 2; // 수정, 삭제 버튼
    }
    // 향후 다른 버튼들이 추가될 때마다 조건에 따라 카운트 증가
    // 예: if (canShare) count++;
    return count;
  };

  // 외부에서 버튼 표시 여부를 확인할 수 있도록 버튼 카운트 노출
  const visibleButtonCount = getVisibleButtonCount();

  const openModal = () => {
    setIsModalOpen(true);
    onModalOpen?.();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    onModalClose?.();
  };

  const handleDelete = async () => {
    console.log('handleDelete called with reviewId:', reviewId);
    try {
      await deleteReview(reviewId, {
        onSuccess: () => {
          console.log('Delete successful');
          setIsModalOpen(false);
          onDelete?.();
        },
        onError: (error) => {
          console.error("리뷰 삭제 실패:", error);
        }
      });
    } catch (error) {
      console.error("리뷰 삭제 중 오류 발생:", error);
    }
  };

  return (
    <div className={styles.reviewMore}>
      {isOwner && (
        <>
          <Button className={styles.reviewMore__btn} text="수정" altText="수정" />
          <Button
            className={`${styles.reviewMore__btn} ${styles["reviewMore__btn--delete"]}`}
            text="삭제"
            altText="삭제"
            onClick={openModal}
          />
        </>
      )}
      {/* 향후 공유 버튼 등이 추가될 수 있는 위치 */}

      {isOwner && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="내가 작성한 리뷰를 삭제하시겠어요?"
          description="삭제된 글은 복구되지 않아요."
          primaryButton={{
            text: "취소",
            onClick: () => {
              setIsModalOpen(false);
            },
            className: "modal-btn modal-btn-no"
          }}
          secondaryButton={{
            text: "네",
            onClick: handleDelete,
            className: "modal-btn modal-btn-yes"
          }}
        />
      )}
    </div>
  );
};

export { type ReviewMoreProps };
export default ReviewMore;
