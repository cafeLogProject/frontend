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

const CafeInfo = () => {
  const { id } = useParams();
  const { getCafe } = useCafeApi();
  const { getCafeReviews } = useReviewApi();
  const navigate = useNavigate();
  const { setReturnPath } = useNavigationStore();
  const { updateDraft } = useReviewDraftStore();

  const [cafeInfo, setCafeInfo] = useState<ICafeDescription | null>(null);
  const [reviews, setReviews] = useState<ShowReviewResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
        
        const reviewsData = await getCafeReviews(data.id, {
          page: 1,
          size: 10,
          sort: "latest"
        });
        setReviews(reviewsData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("카페 정보를 불러오는데 실패했습니다."));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCafeInfo();
  }, [id]);

  const handleWriteReviewClick = () => {
    if (cafeInfo) {
      setReturnPath(`/cafe/${cafeInfo.id}`);
      updateDraft({ cafe: cafeInfo });
      navigate('/review/write');
    }
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error || !cafeInfo) {
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
        onBookmarkClick={() => console.log("Bookmark clicked")}
      />
      <div className={styles.divider} />
      <div className={styles.ratingWrapper}>
        <div className={styles.ratingHeader}>
          <label className={styles.ratingLabel}>리뷰</label>
          <span className={styles.reviewCount}>({reviews.length}개)</span>
        </div>
        <div className={styles.ratingScoreContainer}>
          <div className={styles.ratingScore}>
            <StarRating 
              value={cafeInfo.avgStar || 0}
              showRatingText={true}
              size={36}
              starsContainerClassName={styles.starRatingStars}
              ratingTextClassName={styles.ratingText}
            />
          </div>
        </div>
      </div>
      
      {reviews.length > 0 ? (
        <ul className={styles.reviewList}>
          {reviews.map((review) => (
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
