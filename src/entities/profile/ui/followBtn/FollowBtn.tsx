import styles from "./FollowBtn.module.scss";
import addImageWhite from "@shared/assets/images/add_white.svg";
import addImageOrange from "@shared/assets/images/add_orange.svg";
import checkImage from "@shared/assets/images/check.svg";
import { useFollowApi } from "@/shared/api/follow/followApi";
import { useEffect, useState } from "react";

interface FollowBtnProps {
	onChange?: (type: "follow" | "unfollow") => void;
	activeType : "follow" | "unfollow";
	userId: string;
	size: "small" | "large";
}

const FollowBtn: React.FC<FollowBtnProps> = ({ onChange, activeType, userId, size }) => {
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
			<button onClick={handleFollow} className={`${styles[`followBtn__${size}__unfollowinner`]}`}>
				<img
					className={styles.followBtn__unfollowimage}
					src={checkImage}
					alt="팔로잉" 
				/>
				<p className={styles.followBtn__unfollowtext}>팔로잉</p>
			</button>
		) : (
			<button onClick={handleFollow} className={`${styles[`followBtn__${size}__followinner`]}`}>
				<img
					className={styles.followBtn__followimage}
					src={size==="small" ? addImageOrange : addImageWhite}
					alt="팔로우" 
				/>
				<p className={styles.followBtn__followtext}>팔로우</p>
			</button>
		)}
	</div>
	);
};

export default FollowBtn;