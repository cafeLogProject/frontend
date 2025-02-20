import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNavigationStore } from "@shared/store/useNavigationStore";
import { useReviewDraftStore } from "@shared/store/useReviewDraftStore";
import PhotoSwiper from "@shared/ui/photoSwiper/PhotoSwiper.tsx";
import CafeInfoItem from "@entities/cafeInfo/ui/CafeInfoItem";
import { StarRating } from "@widgets/starRating";
import { useCafeApi } from "@shared/api/cafe/cafe";
import type { ICafeDescription } from "@shared/api/cafe/types";
import styles from "./styles/CafeInfo.module.scss";
import NoReview from "@shared/assets/images/review/no-review.svg";
import { ReviewItem } from "@/entities/review/ui";
import { useReviewApi } from "@shared/api/reviews/reviewApi";
import type { ShowReviewResponse } from "@shared/api/reviews/types";
import { useReviewDraftApi } from "@shared/api/reviews/reviewDraftApi";
import { useFavoriteApi } from "@shared/api/favorite";
import Lottie from 'lottie-react';
import spinnerAnimation from '@shared/assets/images/spinner.json';

const CafeInfo = () => {
  const { id } = useParams();
  const { getCafe } = useCafeApi();
  const { useCafeReviews } = useReviewApi();
  const navigate = useNavigate();
  const { setReturnPath } = useNavigationStore();
  const { updateDraft } = useReviewDraftStore();
  const { createDraft } = useReviewDraftApi();
  const { toggleFavorite } = useFavoriteApi();

  const [cafeInfo, setCafeInfo] = useState<ICafeDescription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [shouldNavigate, setShouldNavigate] = useState(false);

  const reviewsQuery = useCafeReviews(Number(id), {
    page: 1,
    size: 10,
    sort: "latest"
  });

  useEffect(() => {
    const fetchCafeInfo = async () => {
      if (!id) {
        setError(new Error("카페 ID가 없습니다. URL을 확인해주세요."));
        setIsLoading(false);
        return;
      }

      try {
        const data = await getCafe(id);
        setCafeInfo(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("카페 정보를 불러오는데 실패했습니다."));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCafeInfo();
  }, [id]);

  const handleWriteReviewClick = async () => {
    if (!cafeInfo) return;
  
    try {
      // 1. 네비게이션 상태 업데이트
      setReturnPath(`/cafe/${cafeInfo.id}`);
      
      // 2. Draft 스토어 업데이트
      updateDraft({ 
        cafe: cafeInfo
      });
  
      // 3. Draft 생성
      try {
        const response = await createDraft({
          cafeId: cafeInfo.id,
          rating: 0,
          visitDate: '',
          content: '',
          imageIds: [],
          tagIds: []
        });
  
        // 4. Draft ID 업데이트
        await updateDraft({ 
          id: response.draftReviewId,
          cafe: cafeInfo
        });

        // 5. 네비게이션 트리거
        setShouldNavigate(true);

      } catch (error) {
        console.error('Draft 생성 실패:', error);
      }
    } catch (error) {
      console.error("리뷰 작성 페이지 이동 중 오류 발생:", error);
    }
  };

  const handleBookmarkClick = async () => {
    if (!cafeInfo) return;
    
    try {
      await toggleFavorite(
        {
          cafeId: cafeInfo.id,
          isScrap: !cafeInfo.isScrap
        },
        {
          onSuccess: async () => {
            // 북마크 토글 후 카페 정보 다시 가져오기
            const updatedCafeInfo = await getCafe(cafeInfo.id.toString());
            setCafeInfo(updatedCafeInfo);
          },
          onError: (error) => {
            console.error("즐겨찾기 토글 실패:", error.message);
          }
        }
      );
    } catch (error) {
      console.error("즐겨찾기 처리 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    if (shouldNavigate) {
      navigate('/review/write', {
        replace: true,
        state: { from: `/cafe/${cafeInfo?.id}` }
      });
      setShouldNavigate(false);
    } 
  }, [shouldNavigate, navigate, cafeInfo]);

  if (isLoading || reviewsQuery.isLoading) {
    return (
      <div className={`${styles.loadingIndicator} ${styles['loadingIndicator--center']}`}>
        <Lottie
          animationData={spinnerAnimation}
          style={{ width: 40, height: 40 }}
          loop={true}
        />
      </div>
    );
  }

  if (error || !cafeInfo || reviewsQuery.isError) {
    return <div>카페 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <div>
      <div className={styles.photoSwiperOverride}>
        <PhotoSwiper showChips={false} imageIds={(cafeInfo.imageIds ?? []).map(String)} />
      </div>
      <CafeInfoItem
        name={cafeInfo.name}
        address={cafeInfo.address}
        link={cafeInfo.link}
        onBookmarkClick={handleBookmarkClick}
        isBookmarked={cafeInfo.isScrap ?? false}
      />
      <div className={styles.divider} />
      <div className={styles.ratingWrapper}>
        <div className={styles.ratingHeader}>
          <label className={styles.ratingLabel}>리뷰</label>
          <span className={styles.reviewCount}>({reviewsQuery.data?.length ?? 0}개)</span>
        </div>
        <div className={styles.ratingScoreContainer}>
          <div className={styles.ratingScore}>
            <StarRating 
              value={cafeInfo.avgStar || 0}
              showRatingValue={true}
              size={36}
              starsContainerClassName={styles.starRatingStars}
              ratingTextClassName={styles.ratingText}
            />
          </div>
        </div>
      </div>
      
      {reviewsQuery.data && reviewsQuery.data.length > 0 ? (
        <ul className={styles.reviewList}>
          {reviewsQuery.data.map((review) => (
            <li key={review.reviewId} className={styles.reviewList__item}>
              <ReviewItem review={review} />
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.noRatingContainer}>
          <img src={NoReview} alt="No Review" />
          <div className={styles.noRatingText}>
            <p className={styles.noRatingText__main}>아직 작성된 리뷰가 없어요</p>
            <p className={styles.noRatingText__sub}>이 카페의 첫 리뷰를 작성해 볼까요?</p>
          </div>
          <button 
            className={styles.writeReviewButton}
            onClick={handleWriteReviewClick}
          >
            작성하러 가기
          </button>
        </div>
      )}
    </div>
  );
};

export default CafeInfo;
