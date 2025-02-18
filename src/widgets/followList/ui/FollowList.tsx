import FollowListItem from "@/entities/followListItem/FollowListItem";
import { UserFollowResponse } from "@/shared/api/follow/types";
// import { userInfo } from "os";
import styles from "./FollowList.module.scss";
import { useCallback, useEffect, useRef, useState } from "react";

interface FollowListProps {
  userList: UserFollowResponse[] | undefined;
  onUserSelect: (userId: number) => void;
	onLoadMore: () => void;
}

const FollowList = ({
	userList, 
	onUserSelect,
	onLoadMore,
}: FollowListProps) => {

	// ---------무한 스크롤 관련----------
	// const [reviews, setReviews] = useState<ShowReviewResponse[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const observerRef = useRef<IntersectionObserver | null>(null);
	const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

	// const { useReviewList, useMyReviews } = useReviewApi();
	// const { getMyInfo } = useUserApi();
	// const [currentUserId, setCurrentUserId] = useState<number | undefined>();
	
	// useEffect(() => {
	// 	const fetchUserInfo = async () => {
	// 		try {
	// 			const userInfo = await getMyInfo();
	// 			setCurrentUserId(userInfo.userId);
	// 		} catch (error) {
	// 			console.error("사용자 정보 조회 실패:", error);
	// 		}
	// 	};

	// 	fetchUserInfo();
	// }, []);

// 	const reviewListQuery = type === 'all' ? useReviewList({
// 		...{sort: "NEW"},
// 		...(params as ShowReviewListRequest)
// }) : undefined
	
// 	const myReviewsQuery = type === 'my' ? useMyReviews({
// 		...params as ShowUserReviewRequest
// 	}) : undefined;

	// useEffect(() => {
	// 	const queryData = type === 'all' ? reviewListQuery?.data : myReviewsQuery?.data;
	// 	if (queryData) {
	// 		if (params.timestamp === new Date(3000, 0, 1).toISOString()) {
	// 			setReviews(queryData);
	// 		} else {
	// 			setReviews(prev => [...prev, ...queryData]);
	// 		}
	// 		setHasMore(queryData.length === params.limit);
	// 	}
	// }, [reviewListQuery?.data, myReviewsQuery?.data]);

	const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
		const [target] = entries;
		if (target.isIntersecting && hasMore && !isLoading) {
			// const lastReview = reviews[reviews.length - 1];
			// if (lastReview && onLoadMore) {
					onLoadMore();
			// }
		}
	}, [hasMore, isLoading, onLoadMore]);

	// useEffect(() => {
	// 	setIsLoading(reviewListQuery?.isFetching || myReviewsQuery?.isFetching || false);
	// }, [reviewListQuery?.isFetching, myReviewsQuery?.isFetching]);

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

	// if (reviewListQuery?.isError || myReviewsQuery?.isError) {
	// 	return <div>리뷰를 불러오는데 실패했습니다.</div>;
	// }

	// ---------------------

	return (
		<div>
			<ul className={styles.followList}>	
				{userList && userList?.length > 0 && userList.map((_userInfo, index) => (
					<FollowListItem
						key={_userInfo.userId || index} 
						userInfo={_userInfo}
						onSelect={() => onUserSelect(_userInfo.userId)}
					/>
				))}
			</ul>
			{hasMore && (
        <div 
          ref={loadMoreTriggerRef}
          className={styles.loadMoreTrigger}
          style={{ height: '20px', margin: '20px 0' }}
        />
      )}
		</div>
		
	);
};

export default FollowList;
