import styles from "./FollowBtn.module.scss";
import addImage from "@shared/assets/images/add.svg";
import checkImage from "@shared/assets/images/check.svg";
import { useFollowApi } from "@/shared/api/follow/followApi";
import { useEffect, useState } from "react";

interface FollowBtnProps {
	onChange?: (type: "follow" | "unfollow") => void;
	activeType : "follow" | "unfollow";
	userId: string;
}

const FollowBtn: React.FC<FollowBtnProps> = ({ onChange, activeType, userId }) => {
	const { useFollow, useUnfollow } = useFollowApi();
	const [ isFollowing, setIsFollowing ] = useState(false);

	useEffect(()=>{
		if (activeType === "follow") {
			setIsFollowing(true);
		} else {
			setIsFollowing(false);
		}
	}, [activeType]);

  // 낙관적 업데이트 나중에 추가할 예정
  const handleFollow = () => {
		if (!userId) return;
    if (isFollowing){
			if (onChange) onChange("unfollow");
			setIsFollowing(false);
      useUnfollow.mutate(
				{ id: Number(userId) },
      );
    } else {
			if (onChange) onChange("follow");
			setIsFollowing(true);
      useFollow.mutate(
        { id: Number(userId) },
      );
    }
  };


	return (
		<div>
			{(isFollowing) ? (
				<button onClick={handleFollow} className={styles.followButton__unfollowinner}>
					<img
						className={styles.followButton__unfollowimage}
						src={checkImage}
						alt="팔로잉" 
					/>
					<p className={styles.followButton__unfollowtext}>팔로잉</p>
				</button>
			) : (
				<button onClick={handleFollow} className={styles.followButton__followinner}>
					<img
						className={styles.followButton__followimage}
						src={addImage}
						alt="팔로우" 
					/>
					<p className={styles.followButton__followtext}>팔로우</p>
				</button>
			)}
		</div>
	);
};

export default FollowBtn;