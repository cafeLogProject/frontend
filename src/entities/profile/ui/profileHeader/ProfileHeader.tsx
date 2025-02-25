import { useEffect, useState } from "react";
import styles from "./ProfileHeader.module.scss";
import { ProfileHeaderProps } from "../../types";
import DefaultProfileImg from "@shared/assets/images/profile/profile.svg";
import { useUserApi } from "@shared/api/user/userApi";
import { useProfileStore } from "@shared/store/useProfileStore";
import { useProfileImageApi } from "@shared/api/user/useProfileImagesApi";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import FollowBtn from "../followBtn/FollowBtn";
import { useReviewImageApi } from "@/shared/api/images";
const ProfileHeader = ({ isScrolled, onViewReviews }: ProfileHeaderProps) => {
  const { id } = useParams();
  const { useUserInfo, useMyInfo} = useUserApi();
  const { data: userInfo, isLoading: isUserInfoLoading } = useUserInfo(Number(id));
  const navigate = useNavigate();
  const { getProfileImageUrl } = useReviewImageApi();
  const profileImageUrl = userInfo?.isProfileImageExist ? getProfileImageUrl(String(userInfo?.userId)) : null;
  
  return (
    <div>
      {isScrolled ? (
        <div className={`${styles.profileHead} ${styles["profileHead--shrink"]}`}>
          <div className={styles.profileHead__inner}>
            <img
              className={styles.profileHead__profileImg}
              src={profileImageUrl || DefaultProfileImg}
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
          src={profileImageUrl || DefaultProfileImg}
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
            <p className={styles.profileHead__count}>{userInfo?.review_cnt}</p>
            <p className={styles.profileHead__label}>리뷰</p>
          </button>
          <button onClick={() => navigate(`/follow/follower/${id}`)} className={styles.button}>
            <p className={styles.profileHead__count}>{userInfo?.follower_cnt}</p>
            <p className={styles.profileHead__label}>팔로워</p>
          </button>
          <button onClick={() => navigate(`/follow/following/${id}`)} className={styles.button}>
            <p className={styles.profileHead__count}>{userInfo?.following_cnt}</p>
            <p className={styles.profileHead__label}>팔로잉</p>
          </button>
        </div>
        <FollowBtn 
          onChange={()=>{}} 
          activeType={userInfo.isFollow? "follow" : "unfollow"} 
          userId={id || ""}
          size="large"
        />
      </div>
    </div>
  </div>
    
  );
};

export default ProfileHeader;
