import styles from './UserList.module.scss';
import { UserSearchResponse } from '@/shared/api/user/types';
import UserItem from '@entities/userListItem/UserListItem';
import { useState, useEffect } from 'react';
import { useUserApi } from '@/shared/api/user/userApi';

interface UserListProps {
  users: UserSearchResponse[];
  onUserSelect: (userId: number) => void;
  renderFollowButton?: (user: UserSearchResponse) => React.ReactNode;
}

export const UserList = ({ users, onUserSelect, renderFollowButton }: UserListProps) => {
  const [currentUserId, setCurrentUserId] = useState<number | undefined>();
  const { getMyInfo } = useUserApi();
  
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

  return (
    <ul className={styles.userList}>
      {users.map((user) => (
        <UserItem
          key={user.userId}
          userId={user.userId}
          nickname={user.nickname}
          isProfileImageExist={user.isProfileImageExist}
          isFollow={user.isFollow}
          followerCountMessage={user.followerCountMessage}
          currentUserId={currentUserId}
          onSelect={() => onUserSelect(user.userId)}
          renderFollowButton={renderFollowButton ? () => renderFollowButton(user) : undefined}
        />
      ))}
    </ul>
  );
};