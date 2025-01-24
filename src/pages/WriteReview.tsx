import { useNavigate } from "react-router-dom";
import { useNavigationStore } from "@shared/store/useNavigationStore";
import { StarRating } from "@widgets/starRating";
import { DatePicker } from "@widgets/datePicker";
import { useReviewDraftStore } from "@shared/store/useReviewDraftStore";
import { usePhotoUploaderStore } from "@shared/store/usePhotoUploaderStore";
import { useEffect } from "react";
import CafeListItem from "@entities/cafeListItem/CafeListItem";
import { InputWrapper } from "@shared/ui/input/Input";
import { Textarea } from "@shared/ui/textarea";
import styles from "./styles/WriteReview.module.scss";
import { useReviewApi } from "@shared/api/reviews/reviewApi";
import { PhotoUploader } from "@widgets/photoUploader";
import TagSelector from "@features/writeReview/ui/TagSelector";
import { useReviewHandlers } from "@features/writeReview/handlers/useReviewHandlers";

const WriteReview = () => {
  const returnPath = useNavigationStore((state) => state.returnPath);
  const { draft, updateDraft, clearDraft } = useReviewDraftStore();
  const { images, config } = usePhotoUploaderStore();
  const { createReview, isLoading } = useReviewApi();

  const {
    handleSubmit,
    handleRatingChange,
    handleDateChange,
    handleContentChange,
    handleImageUpload,
    handleTagSelect,
    isSubmitting,
    error,
  } = useReviewHandlers(
    draft,
    updateDraft,
    clearDraft,
    createReview,
    returnPath ?? "/"
  );

  useEffect(() => {
    if (localStorage.getItem("review-draft")) {
      clearDraft(["cafe"]);
      return;
    }

    if (!draft.cafe) {
      clearDraft();
    }
  }, [clearDraft]);

  if (!draft.cafe) {
    return (
      <div>
        <p>카페를 선택해주세요.</p>
      </div>
    );
  }

  const isValidForm = () => {
    return draft.rating > 0 && draft.visitDate;
  };

  return (
    <div className={styles.container}>
      <div className="selected-cafe">
        <CafeListItem {...draft.cafe} onSelect={() => {}} />
      </div>

      <InputWrapper
        label={<span className={styles.mainLabel}>언제 방문했나요?</span>}
        className={styles.inputLabel}
        isRequired={true}
        error={
          !draft.visitDate &&
          (draft.tags.menu?.length > 0 || draft.tags.interior?.length > 0)
            ? "방문 날짜를 입력해주세요."
            : undefined
        }
      >
        <DatePicker
          value={draft.visitDate}
          onChange={handleDateChange}
          className={
            !draft.visitDate &&
            (draft.tags.menu?.length > 0 || draft.tags.interior?.length > 0)
              ? styles.errorInput
              : ""
          }
        />
      </InputWrapper>

      <InputWrapper
        label={<span className={styles.mainLabel}>{draft.cafe.name} 어땠나요?</span>}
        className={styles.inputLabel}
        isRequired={true}
        error={
          !draft.rating &&
          (draft.tags.menu?.length > 0 || draft.tags.interior?.length > 0)
            ? "별점을 선택해주세요."
            : undefined
        }
      >
        <StarRating
          value={draft.rating}
          onChange={handleRatingChange}
          showRatingText={true}
          rootClassName={`${styles.starRatingContainer} ${
            !draft.rating && (draft.tags.menu?.length > 0 || draft.tags.interior?.length > 0) 
              ? styles.errorInput 
              : ""
          }`}
          starsContainerClassName={`${styles.starRatingStars} ${
            draft.rating > 0 ? styles.noMarginBottom : ""
          }`}
        />
      </InputWrapper>

      <div className={styles.divider} />

      <InputWrapper
        label={
          <div className={styles.reviewLabelContainer}>
            <span className={styles.mainLabel}>구체적으로 알려주세요.</span>
            <span className={styles.subLabel}>
              (최대 5개)
            </span>
          </div>
        }
        className={styles.inputLabel}
      >
        <TagSelector
          selectedTags={draft.tags}
          onTagClick={(category, tagId) => handleTagSelect(category, tagId)}
        />
      </InputWrapper>

      <InputWrapper
        label={
          <div className={styles.reviewLabelContainer}>
            <span>상세 리뷰</span>
            <span className={styles.charCount}>
              {draft.content?.length || 0} / 200자
            </span>
          </div>
        }
        fullWidthLabel={true}
        className={styles.inputLabel}
      >
        <Textarea
          value={draft.content || ""}
          onChange={handleContentChange}
          placeholder="예. 드립커피는 과일의 향이 섞여 있어 향긋하고 상큼했습니다."
          maxLength={200}
          className={styles.reviewTextarea}
        />
      </InputWrapper>

      <InputWrapper
        label={
          <div className={styles.reviewLabelContainer}>
            <span>사진 첨부</span>
            <span className={styles.photoCount}>
              {images.length} / {config.maxCount}장
            </span>
          </div>
        }
        fullWidthLabel={true}
        className={styles.inputLabel}
      >
        <PhotoUploader
          initialImageIds={draft.imageIds}
          onImageUploaded={(imageId) =>
            handleImageUpload([...(draft.imageIds || []), imageId])
          }
          onImageRemoved={(imageId) =>
            handleImageUpload(
              draft.imageIds?.filter((id) => id !== imageId) || []
            )
          }
        />
      </InputWrapper>

      {error && <div className={styles.error}>{error.message}</div>}

      <div className={styles.buttonOverlay} />
      <button
        className={styles.submitButton}
        onClick={handleSubmit}
        disabled={!isValidForm() || isSubmitting}
      >
        {isSubmitting ? "작성 중..." : "작성 완료"}
      </button>
    </div>
  );
};

export default WriteReview;
