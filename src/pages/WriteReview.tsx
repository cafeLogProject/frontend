import { useNavigate, useLocation } from "react-router-dom";
import { useNavigationStore } from "@shared/store/useNavigationStore";
import { StarRating } from "@widgets/starRating";
import { DatePicker } from "@widgets/datePicker";
import { useReviewDraftStore } from "@shared/store/useReviewDraftStore";
import { usePhotoUploaderStore } from "@shared/store/usePhotoUploaderStore";
import { useEffect, useState } from "react";
import CafeListItem from "@entities/cafeListItem/CafeListItem";
import { InputWrapper } from "@shared/ui/input/Input";
import { Textarea } from "@shared/ui/textarea";
import styles from "./styles/WriteReview.module.scss";
import { useReviewApi } from "@shared/api/reviews/reviewApi";
import { PhotoUploader } from "@widgets/photoUploader";
import TagSelector from "@features/writeReview/ui/TagSelector";
import { useReviewHandlers } from "@features/writeReview/handlers/useReviewHandlers";
import { useCafeApi } from "@shared/api/cafe/cafe";
import Modal from "@/shared/ui/modal/Modal"; // 모달 컴포넌트 import
import { useBlocker } from "@/shared/hooks/useBlocker"; // 커스텀 훅 생성 필요
import MainLayout from "@app/layout/mainLayout/MainLayout"; // MainLayout 컴포넌트 import

const WriteReview = () => {
  const location = useLocation();
  const { returnPath, setReturnPath } = useNavigationStore();
  const { draft, updateDraft, clearDraft } = useReviewDraftStore();
  // draftReviewId를 명시적으로 전달
  const { images, config } = usePhotoUploaderStore(draft.id!);
  const { createReview, isLoading } = useReviewApi();
  const { getCafe } = useCafeApi();
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // location.state에서 preventBack 확인
  const preventBack = location.state?.preventBack;

  // 초안 작성 여부 확인
  const isDrafting = location.state?.from === "/search";

  // BackButton 클릭 시 호출될 핸들러
  const handleBackClick = (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
    }

    if (
      preventBack ||
      draft.content ||
      draft.rating > 0 ||
      draft.visitDate ||
      draft.tags.menu.length > 0 ||
      draft.tags.interior.length > 0
    ) {
      handleBlock();
      return false;
    }

    // 작성된 내용이 없는 경우
    clearDraft();
    navigate("/", { replace: true });
    return true;
  };

  // 페이지 이탈 시도 시 호출될 함수
  const handleBlock = () => {
    setIsModalOpen(true);
  };

  const { setModalState } = useBlocker(handleBlock, preventBack);

  // 모달에서 "나가기" 선택 시
  const handleExit = () => {
    Promise.all([
      setIsModalOpen(false),
      setModalState(false),
      clearDraft(),
    ]).then(() => {
      navigate("/", {
        replace: true,
        state: { from: null },
      });
    });
  };

  const handleContinue = () => {
    setIsModalOpen(false);
    setModalState(false);
  };

  useEffect(() => {
    const from = location.state?.from;
    const searchParams = location.state?.searchParams;
    if (from) {
      const returnTo = searchParams ? `${from}${searchParams}` : from;
      setReturnPath(returnTo);
    }
  }, [location.state, setReturnPath]);

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
    returnPath || "/"
  );

  // console.log('WriteReview 마운트:', {
  //   draft,
  //   location: window.location.pathname
  // });

  useEffect(() => {
    // console.log('WriteReview useEffect:', {
    //   draftId: draft.id,
    //   cafe: draft.cafe
    // });
  }, [draft]);

  useEffect(() => {
    const fetchCafeInfo = async () => {
      // DraftReview 또는 CafeSearch에서 온 경우
      if (
        (location.state?.from === "/draft" ||
          location.state?.from === "/search") &&
        draft.cafe?.id
      ) {
        try {
          const cafeInfo = await getCafe(draft.cafe.id.toString());
          updateDraft({ cafe: cafeInfo });
        } catch (error) {
          console.error("카페 정보 조회 실패:", error);
        }
        return;
      }

      // 일반적인 케이스 처리
      if (localStorage.getItem("review-draft")) {
        clearDraft(["cafe", "id"]);
        return;
      }

      if (!draft.cafe) {
        clearDraft();
      }
    };

    fetchCafeInfo();
  }, [clearDraft, location, draft.cafe?.id, getCafe, updateDraft]);

  // if (!draft.cafe) {
  //   return (
  //     <div>
  //       <p>카페를 선택해주세요.</p>
  //     </div>
  //   );
  // }

  if (!draft.cafe) {
    navigate("/");
    return null;
  }

  const isValidForm = () => {
    return draft.rating > 0 && draft.visitDate && !isImageUploading;
  };

  return (
    <MainLayout
      showHeader={true}
      showFooter={false}
      showBackButton={true}
      showWriteButton={false}
      headerTitle="리뷰 작성"
      onBackClick={handleBackClick} // BackButton 클릭 핸들러 추가
    >
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
          label={
            <span className={styles.mainLabel}>
              {draft.cafe.name} 어땠나요?
            </span>
          }
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
              !draft.rating &&
              (draft.tags.menu?.length > 0 || draft.tags.interior?.length > 0)
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
              <span className={styles.subLabel}>(최대 5개)</span>
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
              <span className={styles.reviewSubLabel}>상세 리뷰</span>
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
              <span className={styles.reviewSubLabel}>사진 첨부</span>
              <span className={styles.photoCount}>
                {images.length} / {config.maxCount}장
              </span>
            </div>
          }
          fullWidthLabel={true}
          className={styles.inputLabel}
        >
          {draft.id ? (
            <PhotoUploader
              draftReviewId={draft.id}
              initialImageIds={draft.imageIds}
              onImageUploaded={(newImageIds: string[]) =>
                handleImageUpload([...(draft.imageIds || []), ...newImageIds])
              }
              onImageRemoved={(imageId) =>
                handleImageUpload(
                  draft.imageIds?.filter((id) => id !== imageId) || []
                )
              }
              onUploadStateChange={setIsImageUploading}
            />
          ) : (
            <div>리뷰 초안이 필요합니다.</div>
          )}
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

        <Modal
          isOpen={isModalOpen}
          onClose={handleContinue}
          title="정말 나가시겠어요?"
          description="작성 중인 내용은 임시 저장되어 다음에 이어서 작성할 수 있어요."
          primaryButton={{
            text: "나가기",
            onClick: handleExit,
            className: "modal-btn modal-btn-yes",
          }}
          secondaryButton={{
            text: "계속 작성하기",
            onClick: handleContinue,
            className: "modal-btn modal-btn-no",
          }}
        />
      </div>
    </MainLayout>
  );
};

export default WriteReview;
