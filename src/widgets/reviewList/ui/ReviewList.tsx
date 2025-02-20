import { useEffect, useRef, useState, useCallback } from "react";
import { ReviewItem } from "@/entities/review/ui";
import { useReviewApi } from "@shared/api/reviews/reviewApi";
import type { ShowReviewResponse, ShowReviewListRequest, ShowUserReviewRequest, ShowMyReviewRequest } from "@shared/api/reviews/types";
import styles from "./ReviewList.module.scss";
import { useUserApi } from "@shared/api/user/userApi";
import NoContent from "@/shared/ui/noContent/NoContent";

interface ReviewListProps {
  type?: 'all' | 'user' | 'my' | 'follow';
  params?: ShowReviewListRequest | ShowUserReviewRequest | ShowMyReviewRequest;
  onLoadMore?: (timestamp: string, rating?: number) => void;
}

const ReviewList = ({ type = 'all', params = { limit: 10 }, onLoadMore }: ReviewListProps) => {
  const [reviews, setReviews] = useState<ShowReviewResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

  const { useReviewList, useMyReviews, useUserReviews, useFollowingReviews } = useReviewApi();
  const { getMyInfo } = useUserApi();
  const [currentUserId, setCurrentUserId] = useState<number | undefined>();
  
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getMyInfo();
        setCurrentUserId(userInfo.userId);
      } catch (error) {
        console.error("사용자 정보 조회 실패:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const reviewListQuery = type === 'all' ? useReviewList({
    ...{sort: "NEW"},
    ...(params as ShowReviewListRequest)
  }) : undefined

  const userReviewsQuery = type === 'user' ? useUserReviews({
    ...(params as ShowUserReviewRequest),
  }) : undefined
  
  const myReviewsQuery = type === 'my' ? useMyReviews({
    ...params as ShowMyReviewRequest
  }) : undefined;

  const followingReviewsQuery = type === 'follow' ? useFollowingReviews({
    ...(params as ShowUserReviewRequest),
  }) : undefined;

  useEffect(() => {
    const queryData = 
      type === 'all' ? reviewListQuery?.data : 
      type === 'my' ? myReviewsQuery?.data : 
      type === 'user' ? userReviewsQuery?.data :
      type === 'follow' ? followingReviewsQuery?.data : 
      (console.log("type 오류"), undefined);
  
    if (queryData) {
      if (params.timestamp === new Date(3000, 0, 1).toISOString()) {
        setReviews(queryData);
      } else {
        setReviews(prev => [...prev, ...queryData]);
      }
      setHasMore(queryData.length === params.limit);
    }
  }, [reviewListQuery?.data, userReviewsQuery?.data, myReviewsQuery?.data, followingReviewsQuery?.data]);

  // 백엔드에서 대신 처리해줘서 사용되지 않는 함수. 삭제해도 무방하지만 추후 유틸리티 클래스로 이동할 수도 있음.
  const normalizeTimestamp = (timestamp: string) => {
    const cleanTime = timestamp.endsWith('Z') ? timestamp.slice(0, -1) : timestamp;
    const [datePart, nanosPart = ''] = cleanTime.split('.');
    const micros = nanosPart.padEnd(6, '0').slice(0, 6);
    const microsInt = parseInt(micros) - 1;
    const normalizedMicros = microsInt.toString().padStart(6, '0');
    return `${datePart}.${normalizedMicros}`;
  };

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && hasMore && !isLoading) {
      const lastReview = reviews[reviews.length - 1];
      if (lastReview && onLoadMore) {
        if (type === 'all' && (params as ShowReviewListRequest).sort === "HIGH_RATING") {
          onLoadMore(lastReview.createdAt, lastReview.rating);
        } else {
          onLoadMore(lastReview.createdAt);
        }
      }
    }
  }, [hasMore, isLoading, reviews, onLoadMore, type, params]);

  useEffect(() => {
    setIsLoading(
      reviewListQuery?.isFetching || 
      myReviewsQuery?.isFetching || 
      followingReviewsQuery?.isFetching || 
      false
    );
  }, [reviewListQuery?.isFetching, myReviewsQuery?.isFetching, followingReviewsQuery?.isFetching]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    });

    if (loadMoreTriggerRef.current) {
      observer.observe(loadMoreTriggerRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  if (reviewListQuery?.isError || myReviewsQuery?.isError) {
    return <div>리뷰를 불러오는데 실패했습니다.</div>;
  }

  return (
    <div>
      {reviews.length === 0 ? 
      <NoContent 
        logo="noReview"
        mainContent="아직 작성된 리뷰가 없어요"
        subContent="최근에 다녀오신 카페는 어땠나요?"
      />
      : <div className={styles.reviewListContainer}>
          <ul className={styles.reviewList}>
            {reviews.map(review => (
              <li key={review.reviewId} className={styles.reviewList__item}>
                <ReviewItem 
                  review={review} 
                  showChips={true}
                  currentUserId={currentUserId} 
                  />
              </li>
            ))}
          </ul>

          {hasMore && (
            <div 
            ref={loadMoreTriggerRef}
            className={styles.loadMoreTrigger}
            style={{ height: '20px', margin: '20px 0' }}
            />
          )}
          
          {isLoading && (
            <div className={styles.loadingIndicator}>
              로딩 중...
            </div>
          )}
        </div>
      }
    </div>
  );
};

export default ReviewList;
