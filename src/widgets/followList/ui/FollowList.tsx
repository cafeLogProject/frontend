import FollowListItem from "@/entities/followListItem/FollowListItem";
import { UserFollowResponse } from "@/shared/api/follow/types";
// import { userInfo } from "os";
import styles from "./FollowList.module.scss";

interface FollowListProps {
  userList: UserFollowResponse[] | undefined;
  onUserSelect: (userId: number) => void;
}

const FollowList = ({
	 userList, 
	 onUserSelect 
}: FollowListProps) => {

	return (
		// <ul>
		<ul className={styles.followList}>	
			{userList && userList?.length > 0 && userList.map((_userInfo, index) => (
				<FollowListItem
					key={_userInfo.userId || index} 
					userInfo={_userInfo}
					onSelect={() => onUserSelect(_userInfo.userId)}
				/>
			))}
		</ul>
	);
};

export default FollowList;
