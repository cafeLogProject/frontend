import styles from './UserListItem.module.scss';
import type { UserSearchResponse } from '@/shared/api/user/types';
import profileIcon from "@shared/assets/images/profile/profile.svg";
import myProfileIcon from "@shared/assets/images/profile/myProfile.svg";
import { useEffect, useState } from 'react';
import { useProfileImageApi } from '@shared/api/user/useProfileImagesApi';
import { useReviewImageApi } from '@/shared/api/images';

interface UserItemProps extends UserSearchResponse {
  onSelect: () => void;
  renderFollowButton?: () => React.ReactNode;
  currentUserId?: number;
}

const UserItem = ({ 
  userId,
  nickname, 
  isProfileImageExist,
  followerCountMessage,
  onSelect,
  renderFollowButton,
  currentUserId
}: UserItemProps) => {
  const { getProfileImageUrl } = useReviewImageApi();
  const profileImageUrl = getProfileImageUrl(String(userId));
  const isOwner = currentUserId === userId;

  return (
    <li className={styles.userItem}>
      <div className={styles.userItem__container}>
        <button onClick={onSelect} className={styles.userItem__link}>
          <div className={styles.userItem__imageWrapper}>
            <img
              src={(isProfileImageExist && profileImageUrl) || (isOwner ? myProfileIcon : profileIcon)}
              alt={`${nickname} profile`}
              className={styles.userItem__image}
            />
          </div>
          <div className={styles.userItem__info}>
            <p className={styles.userItem__name}>{nickname}</p>
            <p className={styles.userItem__meta}>{followerCountMessage}</p>
          </div>
        </button>
        {renderFollowButton && (
          <div className={styles.userItem__followButton}>
            {renderFollowButton()}
          </div>
        )}
      </div>
    </li>
  );
};

export default UserItem;