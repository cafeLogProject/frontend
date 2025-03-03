import { useReviewImageApi } from "@/shared/api/images";
import styles from "./FollowListItem.module.scss";
import defaultProfile from "@shared/assets/images/profile/profile.svg";
import { UserFollowResponse } from "@/shared/api/follow/types";
import FollowBtn from "../profile/ui/followBtn/FollowBtn";

interface FollowListItemProps {
  userInfo: UserFollowResponse;
  onSelect: () => void;
}

const FollowListItem = ({ userInfo, onSelect }: FollowListItemProps) => {
  const { getProfileImageUrl } = useReviewImageApi();
  const imageUrl = userInfo.isProfileImageExist ? getProfileImageUrl(String(userInfo.userId)) : null;

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
        { userInfo.isFollow === 2? null : 
          <FollowBtn 
          onChange={()=>{}} 
          activeType={userInfo.isFollow? "follow" : "unfollow"} 
          userId={String(userInfo.userId) || ""}
          size="small"
          />
        }
      </div>
    </div>
  );
};

export default FollowListItem;
