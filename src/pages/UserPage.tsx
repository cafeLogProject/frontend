import { useState, useEffect, useRef } from "react";
import { throttle } from "lodash";
import { ProfileHeader } from "@/entities/profile/ui";
import { ReviewList } from "@/widgets/reviewList";
import { useFavoriteApi } from "@/shared/api/favorite";
import styles from "@/app/layout/mainLayout/MainLayout.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useUserApi } from "@/shared/api/user/userApi";

const UserPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { favorites, isLoading: isFavLoading } = useFavoriteApi();
  const headerRef = useRef<HTMLDivElement>(null);
  const [myId, setMyId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getMyInfo } = useUserApi();

  //------- 차후 reactQuery 세션스토리지로 userId 가져오도록 수정 필요 ------
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getMyInfo();
        setMyId(response.userId);
        
        if (response.userId === Number(id)) {
          navigate("/mypage", { replace: true });
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [id, navigate]);
  // -------------------------------------------------------

  useEffect(() => {
    const mainContent = document.querySelector(`.${styles.mainContent}`);
    if (!mainContent || !headerRef.current) return;

    const handleScroll = throttle(() => {
      const scrollTop = mainContent.scrollTop;

      if (!isScrolled && scrollTop > 308) {
        setIsScrolled(true);
      } else if (isScrolled && scrollTop < 308) {
        setIsScrolled(false);
      }
    }, 100);

    mainContent.addEventListener("scroll", handleScroll);
    return () => mainContent.removeEventListener("scroll", handleScroll);
  }, [isScrolled]);

  const handleViewReviews = () => {
    const mainContent = document.querySelector(`.${styles.mainContent}`);
    if (!mainContent || !headerRef.current) return;
    mainContent.scrollTop = 309;
  };

  if (isLoading || myId === null) {
    return <div>로딩 중...</div>;
  }

  if (myId === Number(id)) {
    return null;
  }

  return (
    <div>
      <div ref={headerRef}>
        <ProfileHeader 
          isScrolled={isScrolled}
          onViewReviews={handleViewReviews}
        />
      </div>
      <div>
        {isFavLoading ? (
          <div>로딩 중...</div>
        ) : (
          <ReviewList type="my" params={{ limit: 10 }} />
        )}
      </div>
    </div>
  );
};

export default UserPage;
