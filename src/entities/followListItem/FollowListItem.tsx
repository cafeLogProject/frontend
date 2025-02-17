import { useReviewImageApi } from "@/shared/api/images";
import styles from "./FollowListItem.module.scss";
import defaultProfile from "@shared/assets/images/profile.svg";
import { UserFollowResponse } from "@/shared/api/follow/types";

interface FollowListItemProps {
  userInfo: UserFollowResponse;
  onSelect: () => void;
}

const FollowListItem = ({ userInfo, onSelect }: FollowListItemProps) => {
  const { getProfileImageUrl } = useReviewImageApi();
  const imageUrl = getProfileImageUrl(String(userInfo.userId));

  return (
    <li className={styles.followItem}>
      <a onClick={onSelect}>
      {/* <a onClick={onSelect} className={styles.followItem__link}> */}
        <div className={styles.followItem__imageWrapper}>
          <img
            src={imageUrl || defaultProfile}
            alt={`${userInfo.nickname} profile`}
            className={styles.followItem__image}
          />
        </div>
        <div className={styles.followItem__info}>
          {/* <p className={styles.followItem__name}>{name}</p>
          <p className={styles.followItem__address}>{address}</p> */}
        </div>
      </a>
    </li>
  );
};

export default FollowListItem;
