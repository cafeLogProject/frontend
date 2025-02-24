import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CafeList } from "@widgets/cafeList";
import { SearchBar } from "@features/search/ui/SearchBar";
import { useCafeSearch } from "@shared/api/cafe/cafeSearch";
import { useReviewDraftStore } from "@shared/store/useReviewDraftStore";
import { useNavigationStore } from "@shared/store/useNavigationStore";
import type { ICafeDescription } from "@shared/api/cafe/types";
import { useCafeApi } from "@/shared/api/cafe/cafe";
import { useReviewDraftApi } from "@shared/api/reviews/reviewDraftApi";
import Modal from "@shared/ui/modal/Modal";
import styles from "./styles/CafeSearch.module.scss";
import { Tabs } from "@shared/ui/tabs/Tabs";
import type { Tab } from "@shared/ui/tabs/types";
import NoContent from "@/shared/ui/noContent/NoContent";
import { useUserApi } from "@/shared/api/user/userApi";
import { UserList } from "@widgets/userList";
import FollowBtn from "@entities/profile/ui/followBtn/FollowBtn";

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateDraft, clearDraft } = useReviewDraftStore();
  const { returnPath, setReturnPath, isFromFooter, setIsFromFooter } =
    useNavigationStore();
  const {
    searchByName,
    isLoading: isCafeLoading,
    error: cafeError,
  } = useCafeSearch();

  // TODO: 프로필 검색 구현 필요
  // const { searchByName, isLoading: isProfileLoading, error: profileError } = useProfileSearch();

  const { checkCafeExists, saveCafe } = useCafeApi();
  const { useUserDraftReviews, createDraft } = useReviewDraftApi();
  const [cafes, setCafes] = useState<ICafeDescription[]>([]);

  // TODO: 프로필 타입 정의 필요
  // const [profiles, setProfiles] = useState<any[]>([]);

  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCafe, setSelectedCafe] = useState<{
    cafe: ICafeDescription;
    cafeId: number;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<string>("cafe");

  const tabs: Tab[] = [
    { id: "cafe", label: "카페" },
    { id: "profile", label: "프로필" },
  ];

  useEffect(() => {
    console.log("selectedCafe updated:", selectedCafe);
  }, [selectedCafe]);

  const draftsQuery = useUserDraftReviews(selectedCafe?.cafeId, {
    enabled:
      selectedCafe !== null &&
      typeof selectedCafe?.cafeId === "number" &&
      selectedCafe.cafeId > 0, // cafeId가 유효한 값인 경우에만 쿼리 실행
  });

  const handleCafeSelect = async (cafe: ICafeDescription) => {
    try {
      const { cafeId, exist } = await checkCafeExists({
        name: cafe.name,
        mapx: cafe.mapx,
        mapy: cafe.mapy,
      });

      if (typeof cafeId === "undefined") {
        console.error("카페 ID가 정의되지 않았습니다.");
        return;
      }

      let selectedCafeId = cafeId;

      if (!exist) {
        const saveResponse = await saveCafe({
          title: cafe.name,
          category: cafe.category,
          mapx: cafe.mapx,
          mapy: cafe.mapy,
          address: cafe.address,
          roadAddress: cafe.roadAddress,
          link: cafe.link,
        });

        if (saveResponse.cafeId) {
          selectedCafeId = saveResponse.cafeId;
        } else {
          console.error("카페 저장 실패");
          return;
        }
      }

      if (isFromFooter) {
        navigate(`/cafe/${selectedCafeId}`);
        return;
      }

      setSelectedCafe({ cafe, cafeId: selectedCafeId });
    } catch (error) {
      console.error("카페 선택 중 오류 발생:", error);
    }
  };

  const handleNewDraft = async (cafe: ICafeDescription, cafeId: number) => {
    try {
      const response = await createDraft({
        cafeId: cafeId,
        rating: 0,
        visitDate: "",
        content: "",
        imageIds: [],
        tagIds: [],
      });

      console.log("Draft 생성:", response);

      await updateDraft({
        id: response.draftReviewId,
        cafe: {
          ...cafe,
          id: cafeId,
        },
        rating: response.rating,
        visitDate: response.visitDate,
        content: response.content,
        imageIds: response.imageIds,
        tags: {
          menu: response.tagIds.filter((id) => id >= 1 && id <= 99),
          interior: response.tagIds.filter((id) => id >= 100),
        },
      });

      // replace: true로 설정하여 현재 /search 페이지를 대체
      navigate("/review/write", {
        replace: true,
        state: {
          from: "/search",
          preventBack: true,
        },
      });
    } catch (error) {
      console.error("Draft 생성 실패:", error);
    }
  };

  const handleContinueWriting = () => {
    if (!selectedCafe) return;

    // draftsQuery 사용
    if (!draftsQuery.data) return;

    if (draftsQuery.data.length === 1) {
      const draft = draftsQuery.data[0];
      updateDraft({
        id: draft.draftReviewId,
        cafe: {
          id: selectedCafe.cafeId,
          name: draft.cafeName,
        },
      });
      navigate("/review/write", {
        state: {
          from: "/search",
          searchParams: window.location.search,
          isContinue: true,
        },
      });
    } else {
      navigate("/draft", {
        state: {
          cafeId: selectedCafe.cafeId,
          from: "/search",
          searchParams: window.location.search,
        },
      });
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (shouldNavigate) {
      navigate("/review/write", {
        replace: true,
        state: { from: "/search" },
      });
      setShouldNavigate(false);
    }
  }, [shouldNavigate, navigate]);

  // 검색어와 탭이 변경될 때마다 해당 탭의 검색 실행
  useEffect(() => {
    const query = searchParams.get("name");
    if (!query) return;

    switch (activeTab) {
      case "cafe":
        // TODO: 프로필 검색 결과 초기화
        searchByName(query).then(setCafes);
        break;
      case "profile":
        // 카페 검색 결과 초기화
        setCafes([]);
        // TODO: 프로필 검색 API 호출
        break;
    }
  }, [searchParams, activeTab]);

  useEffect(() => {
    // selectedCafe와 draftsQuery.data가 모두 있을 때만 실행
    if (!selectedCafe || !draftsQuery.data) return;

    if (draftsQuery.data.length > 0 && !shouldNavigate) {
      // shouldNavigate가 false일 때만 모달 표시
      setIsModalOpen(true);
    } else {
      handleNewDraft(selectedCafe.cafe, selectedCafe.cafeId);
    }
  }, [draftsQuery.data, selectedCafe, shouldNavigate]);

  const { useSearchUsers } = useUserApi();

  const handleUserSelect = (userId: number) => {
    navigate(`/userpage/${userId}`);
  };

  const ProfileSearchResults = ({ nickname }: { nickname: string }) => {
    const { data: users, error } = useSearchUsers(nickname);
  
    const handleFollowChange = (userId: number) => (type: "follow" | "unfollow") => {
      console.log(`User ${userId} ${type}`);
    };
  
    if (error) {
      return (
        <div className={styles.errorContainer}>
          <p>프로필 검색 중 오류가 발생했습니다.</p>
        </div>
      );
    }
  
    if (!users || users.length === 0) {
      return (
        <NoContent
          logo="noResult"
          mainContent="해당 유저를 찾을 수 없어요"
          subContent="닉네임이 정확한지 확인하거나, 다른 닉네임을 찾아보세요!"
        />
      );
    }
  
    return (
      <UserList 
        users={users} 
        onUserSelect={handleUserSelect}
        renderFollowButton={(user) => (
          user.isFollow !== 2 && (
            <FollowBtn
              onChange={handleFollowChange(user.userId)}
              activeType={user.isFollow ? "follow" : "unfollow"}
              userId={String(user.userId)}
              size="small"
            />
          )
        )}
      />
    );
  };

  const renderContent = () => {
    if (!isFromFooter) {
      return (
        <div className={styles.cafeListContainer}>
          {isCafeLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>검색 중입니다...</p>
            </div>
          ) : cafeError ? (
            <div className={styles.errorContainer}>
              <p>카페 검색 중 오류가 발생했습니다.</p>
            </div>
          ) : cafes.length === 0 ? (
            <NoContent
              logo="noResult"
              mainContent="해당 카페를 찾을 수 없어요"
              subContent="카페명이 정확한지 확인하거나, 다른 카페를 찾아보세요!"
            />
          ) : (
            <CafeList cafeInfo={cafes} onCafeSelect={handleCafeSelect} />
          )}
        </div>
      );
    }
    switch (activeTab) {
      case "cafe":
        return (
          <div className={styles.cafeListContainer}>
            {isCafeLoading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>검색 중입니다...</p>
              </div>
            ) : cafeError ? (
              <div className={styles.errorContainer}>
                <p>카페 검색 중 오류가 발생했습니다.</p>
              </div>
            ) : cafes.length === 0 ? (
              <NoContent
                logo="noResult"
                mainContent="해당 카페를 찾을 수 없어요"
                subContent="카페명이 정확한지 확인하거나, 다른 카페를 찾아보세요!"
              />
            ) : (
              <CafeList cafeInfo={cafes} onCafeSelect={handleCafeSelect} />
            )}
          </div>
        );
      case "profile":
        const query = searchParams.get("name");
        return query ? (
          <div className={styles.profileListContainer}>
            <Suspense
              fallback={
                <div className={styles.loadingContainer}>
                  <div className={styles.loadingSpinner}></div>
                  <p>검색 중입니다...</p>
                </div>
              }
            >
              <ProfileSearchResults nickname={query} />
            </Suspense>
          </div>
        ) : (
          <NoContent
            logo="noResult"
            mainContent="해당 닉네임의 사용자를 찾을 수 없어요"
            subContent="닉네임을 다시 확인하거나 다른 사용자를 찾아보세요!"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.searchPage}>
      <div className={styles.searchBarWrapper}>
        <SearchBar initialValue={searchParams.get("name") || ""} />
      </div>
      <div>
        {isFromFooter && (
          <div>
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        )}
      </div>
      {renderContent()}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${selectedCafe?.cafe.name}의 리뷰를 이어서 작성하시겠어요?`}
        description="해당 카페의 임시 저장된 리뷰가 있어요."
        primaryButton={{
          text: "새로 작성하기",
          onClick: () => {
            // setIsModalOpen(false);
            if (selectedCafe) {
              handleNewDraft(selectedCafe.cafe, selectedCafe.cafeId);
            }
          },
          className: "modal-btn modal-btn-no",
        }}
        secondaryButton={{
          text: "이어서 작성하기",
          onClick: handleContinueWriting,
          className: "modal-btn modal-btn-yes",
        }}
      />
    </div>
  );
};

export default Search;
