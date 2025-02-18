import { useReviewImageApi } from "@/shared/api/images";
import styles from "./FollowListItem.module.scss";
import defaultProfile from "@shared/assets/images/profile.svg";
import { UserFollowResponse } from "@/shared/api/follow/types";
import FollowBtn from "../profile/ui/followBtn/FollowBtn";

interface FollowListItemProps {
  userInfo: UserFollowResponse;
  onSelect: () => void;
}

const FollowListItem = ({ userInfo, onSelect }: FollowListItemProps) => {
  const { getProfileImageUrl } = useReviewImageApi();
  const imageUrl = getProfileImageUrl(String(userInfo.userId));

  return (
    <div className={styles.followListItem}>
      <div className={styles.followListItem__inner}>
        <button className={styles.followListItem__meta} onClick={onSelect}>
          <img
            src={imageUrl || defaultProfile}
            alt={`${userInfo.nickname} profile`}
            className={styles.followListItem__image}
          />
          <div className={styles.followListItem__infoContainer}>
            <p className={styles.followListItem__nickname}>{userInfo.nickname}</p>
            <p className={styles.followListItem__etc}>{
              `리뷰 ${userInfo.review_cnt}・팔로워 ${userInfo.follower_cnt}` 
            }</p>
          </div>
        </button>
        <FollowBtn 
          onChange={()=>{}} 
          activeType={userInfo.isFollow? "follow" : "unfollow"} 
          userId={String(userInfo.userId) || ""}
          size="small"
        />
      </div>
    </div>
  );
};

export default FollowListItem;
