import FollowListItem from "@/entities/followListItem/FollowListItem";
import { UserFollowResponse } from "@/shared/api/follow/types";
import styles from "./FollowList.module.scss";
import { useCallback, useEffect, useRef, useState } from "react";

interface FollowListProps {
  userList: UserFollowResponse[] | undefined;
  onUserSelect: (userId: number) => void;
  onLoadMore: () => void;
  hasNextPage: boolean;
  isLoading: boolean;
}

const FollowList = ({
	userList, 
	onUserSelect,
	onLoadMore,
	hasNextPage,
	isLoading,
}: FollowListProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);
	const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
		const [target] = entries;
		if (target.isIntersecting && !isLoading) {
			onLoadMore();
		}
	}, [isLoading, onLoadMore]);

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
			{hasNextPage && (
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