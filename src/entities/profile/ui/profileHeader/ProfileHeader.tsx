import { useEffect, useState } from "react";
import styles from "./ProfileHeader.module.scss";
import { ProfileHeaderProps } from "../../types";
import MyProfileImage from "@shared/assets/images/profile/profile.svg";
import { useUserApi } from "@shared/api/user/userApi";
import { useProfileStore } from "@shared/store/useProfileStore";
import { useProfileImageApi } from "@shared/api/user/useProfileImagesApi";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import FollowBtn from "../followBtn/FollowBtn";
const ProfileHeader = ({ isScrolled, onViewReviews }: ProfileHeaderProps) => {
  const { id } = useParams();
  const { useUserInfo } = useUserApi();
  const { getProfileImage } = useProfileImageApi();
  const { profileImageUrl, setProfileImageUrl } = useProfileStore();
  const { data: userInfo, isLoading, error } = useUserInfo(Number(id));
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id || !userInfo) return;
      // 이미지 URL 가져오기
      const newImageUrl = await getProfileImage(Number(id));
      if (newImageUrl) {
        setProfileImageUrl(newImageUrl);
      }
      if (userInfo.isFollow) {
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }
    }
    fetchUserData();
  }, [id, userInfo]);

  
  return (
    <div>
      {isScrolled ? (
        <div className={`${styles.profileHead} ${styles["profileHead--shrink"]}`}>
          <div className={styles.profileHead__inner}>
            <img
              className={styles.profileHead__profileImg}
              src={profileImageUrl || MyProfileImage}
              alt="myProfileImage"
            />
            <div className={styles.profileHead__meta}>
              <p className={styles.profileHead__nickName}>
                {userInfo?.nickname || "별명을 설정해주세요"}
              </p>
              <p className={styles.profileHead__introduction}>
                {userInfo?.introduce || ""}
              </p>
            </div>
          </div>
        </div>
      ) : (
        null
      )}
    <div className={styles.profileHead}>
      <div className={styles.profileHead__inner}>
        <img
          className={styles.profileHead__profileImg}
          src={profileImageUrl || MyProfileImage}
          alt="myProfileImage" />
        <div className={styles.profileHead__meta}>
          <p className={styles.profileHead__nickName}>
            {userInfo?.nickname || "별명을 설정해주세요"}
          </p>
          <p className={styles.profileHead__introduction}>
            {userInfo?.introduce || ""}
          </p>
        </div>
        <div className={styles.profileHead__buttonContainer}>
          <button onClick={() => onViewReviews()} className={styles.button}>
            <p className={styles.profileHead__count}>8</p>
            <p className={styles.profileHead__label}>리뷰</p>
          </button>
          <button onClick={() => console.log("팔로워 수 클릭")} className={styles.button}>
            <p className={styles.profileHead__count}>6</p>
            <p className={styles.profileHead__label}>팔로워</p>
          </button>
          <button onClick={() => console.log("팔로잉 수 클릭")} className={styles.button}>
            <p className={styles.profileHead__count}>5</p>
            <p className={styles.profileHead__label}>팔로잉</p>
          </button>
        </div>
        <FollowBtn 
          onChange={()=>{}} 
          activeType={isFollowing? "follow" : "unfollow"} 
          userId={id || ""}
          size="large"
        />
      </div>
    </div>
  </div>
    
  );
};

export default ProfileHeader;
