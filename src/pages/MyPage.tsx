import { useState, useEffect, useRef } from "react";
import { throttle } from "lodash";
import { FilterBtn, MyProfileHeader } from "@/entities/profile/ui";
import { ReviewList } from "@/widgets/reviewList";
import { CafeList } from "@/widgets/cafeList";
import { useFavoriteApi } from "@/shared/api/favorite";
import Modal from "@/shared/ui/modal/Modal";
import Toast from "@/shared/ui/toast/Toast";
import styles from "@/app/layout/mainLayout/MainLayout.module.scss";
import type { ICafeDescription } from "@shared/api/cafe/types";
import NoContent from "@/shared/ui/noContent/NoContent";

const MyPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"review" | "scrap">(
    "review"
  );
  const { favorites, isLoading } = useFavoriteApi();
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [lastTimestamp, setLastTimestamp] = useState<string>(
    new Date(3000, 0, 1).toISOString()
  );

  useEffect(() => {
    const mainContent = document.querySelector(`.${styles.mainContent}`);
    if (!mainContent || !headerRef.current) return;

    const handleScroll = throttle(() => {
      const scrollTop = mainContent.scrollTop;

      if (!isScrolled && scrollTop > 246) { // 246px은 헤더 축소 완료되기까지의 스크롤 간격
        setIsScrolled(true);

        // 헤더 축소 후 스크롤 위치 보정하기
        // requestAnimationFrame(() => {
        //   const newHeight = headerRef.current?.offsetHeight || 0;
        //   const heightDiff = oldHeight - newHeight;
        //   if (heightDiff > 0) {
        //     mainContent.scrollTop += heightDiff;
        //   }
        // });
      }
       else if (isScrolled && scrollTop < 246) {
        setIsScrolled(false);
      }
    }, 100);

    mainContent.addEventListener("scroll", handleScroll);
    return () => mainContent.removeEventListener("scroll", handleScroll);
  }, [isScrolled]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleFilterChange = (type: "review" | "scrap") => {
    setActiveFilter(type);
  };

  const handleCafeSelect = (cafe: ICafeDescription) => {
    // 카페 선택 시 해당 카페 상세 페이지로 이동
    window.location.href = `/cafe/${cafe.id}`;
  };

  const handleViewReviews = () => {
    setActiveFilter("review");
    const mainContent = document.querySelector(`.${styles.mainContent}`);
    if (!mainContent || !headerRef.current ) return;
    mainContent.scrollTop = 249;
  }

  const handleLoadMore = (timestamp: string) => {
    setLastTimestamp(timestamp);
  };

  return (
    <div>
      <div ref={headerRef}>
        <MyProfileHeader 
          isScrolled={isScrolled} 
          onViewReviews={handleViewReviews}
          />
      </div>
      <div>
        <FilterBtn onChange={handleFilterChange} activeType={activeFilter} />

        {activeFilter === "review" ? (
          <ReviewList 
            type="my" 
            params={{ 
              limit: 10,
              timestamp: lastTimestamp 
            }}
            onLoadMore={handleLoadMore}
          />
        ) : isLoading ? (
          <div>로딩 중...</div>
        ) : (
          <>
            {favorites.length === 0 ? 
              <NoContent 
                logo="noReview"
                mainContent="아직 스크랩한 장소가 없어요"
                subContent="카페를 스크랩하면 나만의 장소들을 모아볼 수 있어요"
              />
              : <CafeList cafeInfo={favorites.map((favorite) => ({
                id: favorite.cafeId,
                name: favorite.cafeName,
                address: favorite.location,
                profileImg: ''
              }))}
              onCafeSelect={handleCafeSelect}
            />
            }
          </>
        )}

      </div>
    </div>
  );
};

export default MyPage;
