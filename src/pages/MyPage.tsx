import { useState, useEffect, useRef } from "react";
import { throttle } from "lodash";
import { ProfileHeader, FilterBtn } from "@/entities/profile/ui";
import { ReviewList } from "@/widgets/reviewList";
import Modal from "@/shared/ui/modal/Modal";
import Toast from "@/shared/ui/toast/Toast";
import styles from "@/app/layout/mainLayout/MainLayout.module.scss";

const MyPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mainContent = document.querySelector(`.${styles.mainContent}`);
    if (!mainContent || !headerRef.current) return;

    const handleScroll = throttle(() => {
      const scrollTop = mainContent.scrollTop;

      if (!isScrolled && scrollTop > 156) {
        const oldHeight = headerRef.current?.offsetHeight || 0;
        setIsScrolled(true);

        // 헤더 축소 후 스크롤 위치 보정하기
        // requestAnimationFrame(() => {
        //   const newHeight = headerRef.current?.offsetHeight || 0;
        //   const heightDiff = oldHeight - newHeight;
        //   if (heightDiff > 0) {
        //     mainContent.scrollTop += heightDiff;
        //   }
        // });
      } else if (isScrolled && scrollTop < 76) {
        setIsScrolled(false);
      }
    }, 100);

    mainContent.addEventListener("scroll", handleScroll);
    return () => mainContent.removeEventListener("scroll", handleScroll);
  }, [isScrolled]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <div ref={headerRef}>
        <ProfileHeader isScrolled={isScrolled} />
      </div>
      <div
        ref={contentRef}
        style={{
          // paddingTop: isScrolled ? "84px" : "252px",
          paddingTop: "252px",
        }}
      >
        <FilterBtn />
        <ReviewList type="my" params={{ limit: 10 }} />
        <button onClick={openModal}>Open Modal</button>
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="정말 나가시겠어요?"
          description="작성 중인 내용은 임시 저장되어 다음에 이어서 작성할 수 있어요."
          primaryButton={{
            text: "나가기",
            altText: "나가기",
            onClick: closeModal,
            className: "modal-btn modal-btn-yes",
          }}
          secondaryButton={{
            text: "계속 작성하기",
            altText: "계속 작성하기",
            onClick: closeModal,
            className: "modal-btn modal-btn-no",
          }}
        />
        <Toast
          icon={true}
          message="리뷰 작성이 완료되었습니다"
          linkTo="/search"
          linkText="보러가기"
        />
      </div>
    </div>
  );
};

export default MyPage;
