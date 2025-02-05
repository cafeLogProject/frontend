import { useEffect, useState } from "react";
import styles from "./ProfileHeader.module.scss";
import { ProfileHeaderProps } from "../../types";
import MyProfileImage from "@shared/assets/images/profile/profile.svg";
import { useUserApi } from "@shared/api/user/userApi";
import type { UserInfoResponse } from "@shared/api/user/types";
import { useProfileStore } from "@shared/store/useProfileStore";
import { useProfileImageApi } from "@shared/api/user/useProfileImagesApi";

const ProfileHeader = ({ isScrolled }: ProfileHeaderProps) => {
  const { getUserInfo } = useUserApi();
  const { getProfileImage } = useProfileImageApi();
  const [userInfo, setUserInfo] = useState<UserInfoResponse | null>(null);

  const { profileImageUrl, setProfileImageUrl } = useProfileStore();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserInfo();
        setUserInfo(response);

        // 여기서 userId를 이용해 프로필 이미지를 가져옴
        if (response.userId) {
          const newImageUrl = await getProfileImage(response.userId);
          if (newImageUrl) {
            setProfileImageUrl(newImageUrl);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    if (!profileImageUrl) {
      fetchUserData();
    }
  }, [profileImageUrl]);

  return (
    <div
      className={`${styles.profileHead} ${
        isScrolled ? styles["profileHead--shrink"] : ""
      }`}
    >
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
            {userInfo?.introduce || "자기소개를 입력해주세요"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
