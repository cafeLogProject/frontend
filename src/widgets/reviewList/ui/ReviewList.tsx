import { useEffect, useState } from "react";
import { ReviewItem } from "@/entities/review/ui";
import { useReviewApi } from "@shared/api/reviews/reviewApi";
import type { ShowReviewResponse, ShowReviewListRequest, ShowUserReviewRequest } from "@shared/api/reviews/types";
import styles from "./ReviewList.module.scss";
import { useUserApi } from "@shared/api/user/userApi";

interface ReviewListProps {
  type?: 'all' | 'my';
  params?: ShowReviewListRequest | ShowUserReviewRequest;
}

const ReviewList = ({ type = 'all', params = { limit: 10 } }: ReviewListProps) => {
  const { useReviewList, useMyReviews } = useReviewApi();
  const { getUserInfo } = useUserApi();
  const [currentUserId, setCurrentUserId] = useState<number | undefined>();
  
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfo();
        setCurrentUserId(userInfo.userId);
      } catch (error) {
        console.error("사용자 정보 조회 실패:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const reviewListQuery = type === 'all' ? useReviewList({
    sort: "NEW",
    ...params as ShowReviewListRequest
  }) : undefined;
  
  const myReviewsQuery = type === 'my' ? useMyReviews({
    ...params as ShowUserReviewRequest
  }) : undefined;

  const reviews = type === 'all' ? reviewListQuery?.data : myReviewsQuery?.data;

  if (reviewListQuery?.isError || myReviewsQuery?.isError) {
    return <div>리뷰를 불러오는데 실패했습니다.</div>;
  }

  if (reviewListQuery?.isLoading || myReviewsQuery?.isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <ul className={styles.reviewList}>
      {reviews?.map(review => (
        <li key={review.reviewId} className={styles.reviewList__item}>
          <ReviewItem 
            review={review} 
            showChips={true}
            currentUserId={currentUserId} 
          />
        </li>
      ))}
    </ul>
  );
};

export default ReviewList;
