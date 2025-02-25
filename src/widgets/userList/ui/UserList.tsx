import styles from './UserList.module.scss';
import { UserSearchResponse } from '@/shared/api/user/types';
import UserItem from '@entities/userListItem/UserListItem';

interface UserListProps {
  users: UserSearchResponse[];
  onUserSelect: (userId: number) => void;
  renderFollowButton?: (user: UserSearchResponse) => React.ReactNode;
}

export const UserList = ({ users, onUserSelect, renderFollowButton }: UserListProps) => (
  <ul className={styles.userList}>
    {users.map((user) => (
      <UserItem
        key={user.userId}
        userId={user.userId}
        nickname={user.nickname}
        isProfileImageExist={user.isProfileImageExist}
        isFollow={user.isFollow}
        followerCountMessage={user.followerCountMessage}
        onSelect={() => onUserSelect(user.userId)}
        renderFollowButton={renderFollowButton ? () => renderFollowButton(user) : undefined}
      />
    ))}
  </ul>
);