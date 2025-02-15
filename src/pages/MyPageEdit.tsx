import { debounce } from "lodash";
import { useEffect, useState, useRef } from "react";
import { useUserApi } from "@/shared/api/user/userApi";
import { useProfileImageApi } from "@/shared/api/user/useProfileImagesApi";
import { useUserStore } from "@/shared/store/useUserStore";
import { useProfileStore } from "@/shared/store/useProfileStore";
import { useProfileEditStore } from "@/shared/store/useProfileEditStore";
import { useNavigate } from "react-router-dom";
import PhotoEdit from "@/entities/profile/ui/photoEdit/PhotoEdit";
import ProfileBtnWrap from "@/entities/profile/ui/profileBtnWrap/ProfileBtnWrap";
import ProfileForm from "@/entities/profile/ui/profileForm/ProfileForm";
import styles from "./styles/MyPageEdit.module.scss";

const MyPageEdit = () => {
  const { getMyInfo, checkNicknameExistence, updateUserInfo } = useUserApi();
  const { setUserData, setNicknameError, userData } = useUserStore();
  const { getProfileImage, uploadProfileImage } = useProfileImageApi();
  const { setProfileImageUrl, file } = useProfileStore();
  const { setHandleComplete } = useProfileEditStore();
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        await getMyInfo({
          onSuccess: (data) => {
            console.log("사용자 정보 조회 성공:", data);
            setUserData(data);
            if (data.userId) {
              getProfileImage(data.userId).then((url) => {
                console.log(url);
                setProfileImageUrl(url);
              });
            }
          },
          onError: (err) => {
            console.error("사용자 정보 조회 중 오류 발생:", err);
          },
        });
      } catch (err) {
        console.error("사용자 정보 조회 처리 중 오류:", err);
      }
    };

    fetchUserInfo();
  }, [setUserData, getProfileImage, setProfileImageUrl]);

  useEffect(() => {
    // navigate 함수 변경 시 로그 출력 - 버그 수정, 호출 최적화 후 삭제할 것
    if (navigateRef.current !== navigate) {
      console.log('navigate 함수 변경됨:', {
        oldNavigate: navigateRef.current,
        newNavigate: navigate,
        timestamp: new Date().toISOString()
      });
      navigateRef.current = navigate;
    }
  }, [navigate]);

  const handleComplete = async () => {
    try {
      if (file) {
        await uploadProfileImage(file);
      }

      const { nickname, introduce, userId } = userData;
      await updateUserInfo({ nickname, introduce });
      
      if (userId) {
        const newImageUrl = await getProfileImage(userId);
        if (newImageUrl) {
          setProfileImageUrl(newImageUrl);
        }
      }
      
      alert("프로필 수정이 완료되었습니다!");
      navigateRef.current("/mypage", { replace: true });
    } catch (error) {
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    setHandleComplete(handleComplete);
  }, [file, userData]);

  const handleNicknameChange = debounce(async (nickname: string) => {
    if (nickname.length === 0) {
      setNicknameError("닉네임은 1자 이상 20자 이하로 입력해주세요.");
      return;
    }
    if (nickname.length < 1 || nickname.length > 20) {
      setNicknameError("닉네임은 1자 이상 20자 이하로 입력해주세요.");
      return;
    }
    setNicknameError("");

    try {
      const response = await checkNicknameExistence(nickname);
      if (response.exist) {
        setNicknameError("중복된 닉네임입니다.");
        console.log("중복");
      } else {
        setNicknameError("");
        setUserData((prev) => ({ ...prev, nickname }));
      }
    } catch (error) {
      console.error("닉네임 중복 확인 실패:", error);
    }
  }, 300);

  return (
    <div className={styles.MyPageEdit}>
      <PhotoEdit />
      <ProfileForm onNicknameChange={handleNicknameChange} />
      <ProfileBtnWrap />
    </div>
  );
};

export default MyPageEdit;
