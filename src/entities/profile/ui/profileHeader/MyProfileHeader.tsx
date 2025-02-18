import { useEffect, useState } from "react";
import styles from "./ProfileHeader.module.scss";
import { ProfileHeaderProps } from "../../types";
import DefaultProfile from "@shared/assets/images/profile/profile.svg";
import addImage from "@shared/assets/images/add.svg";
import { useUserApi } from "@shared/api/user/userApi";
import type { UserInfoResponse } from "@shared/api/user/types";
import { useProfileStore } from "@shared/store/useProfileStore";
import { useProfileImageApi } from "@shared/api/user/useProfileImagesApi";
import { useNavigate } from "react-router-dom";
import { useReviewImageApi } from "@/shared/api/images";

const MyProfileHeader = ({ isScrolled, onViewReviews}: ProfileHeaderProps) => {
  const { useMyInfo } = useUserApi();
  const { data: myInfo, isLoading, error } = useMyInfo();
  const navigate = useNavigate();
  const { getProfileImageUrl } = useReviewImageApi();
  const profileImageUrl = myInfo?.isProfileImageExist ? getProfileImageUrl(String(myInfo?.userId)) : null;

  return (
    <div>
      {isScrolled ? (
        <div className={`${styles.profileHead} ${styles["profileHead--shrink"]}`}>
          <div className={styles.profileHead__inner}>
            <img
              className={styles.profileHead__profileImg}
              src={profileImageUrl || DefaultProfile}
              alt="myProfileImage"
            />
            <div className={styles.profileHead__meta}>
              <p className={styles.profileHead__nickName}>
                {myInfo?.nickname || "별명을 설정해주세요"}
              </p>
              <p className={styles.profileHead__introduction}>
                {myInfo?.introduce || ""}
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
          src={profileImageUrl || DefaultProfile}
          alt="myProfileImage" />
        <div className={styles.profileHead__meta}>
          <p className={styles.profileHead__nickName}>
            {myInfo?.nickname || "별명을 설정해주세요"}
          </p>
          <p className={styles.profileHead__introduction}>
            {myInfo?.introduce || ""}
          </p>
        </div>
        <div className={styles.profileHead__buttonContainer}>
          <button onClick={() => onViewReviews()} className={styles.button}>
            <p className={styles.profileHead__count}>{myInfo?.review_cnt}</p>
            <p className={styles.profileHead__label}>리뷰</p>
          </button>
          <button onClick={() => navigate(`/follow/follower/${myInfo?.userId}`)} className={styles.button}>
            <p className={styles.profileHead__count}>{myInfo?.follower_cnt}</p>
            <p className={styles.profileHead__label}>팔로워</p>
          </button>
          <button onClick={() => navigate(`/follow/following/${myInfo?.userId}`)} className={styles.button}>
            <p className={styles.profileHead__count}>{myInfo?.following_cnt}</p>
            <p className={styles.profileHead__label}>팔로잉</p>
          </button>
        </div>
      </div>
    </div>
  </div>
    
  );
};

export default MyProfileHeader;
