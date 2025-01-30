import { useEffect, useState } from "react";
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

const CafeSearch = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateDraft, clearDraft } = useReviewDraftStore();
  const { returnPath, setReturnPath, isFromFooter, setIsFromFooter } =
    useNavigationStore();
  const { searchByName, isLoading, error } = useCafeSearch();
  const { checkCafeExists, saveCafe } = useCafeApi();
  const { useUserDraftReviews, createDraft } = useReviewDraftApi();
  const [cafes, setCafes] = useState<ICafeDescription[]>([]);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCafe, setSelectedCafe] = useState<{
    cafe: ICafeDescription;
    cafeId: number;
  } | null>(null);

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
          preventBack: true
        }
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

  useEffect(() => {
    const name = searchParams.get("name");
    searchByName(name).then(setCafes);
  }, [searchParams]); // searchByName 의존성 제거

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

  return (
    <div className={styles.searchPage}>
      <div className={styles.searchBarWrapper}>
        <SearchBar />
      </div>
      <div className={styles.cafeListContainer}>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>검색 중입니다...</p>
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <p>카페 검색 중 오류가 발생했습니다.</p>
          </div>
        ) : cafes.length === 0 ? (
          <div className={styles.noResults}>
            <p>검색 결과가 없습니다.</p>
          </div>
        ) : (
          <CafeList cafeInfo={cafes} onCafeSelect={handleCafeSelect} />
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${selectedCafe?.cafe.name}의 리뷰를 이어서 작성하시겠어요?`}
        subTitle="해당 카페의 임시 저장된 리뷰가 있어요."
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

export default CafeSearch;
