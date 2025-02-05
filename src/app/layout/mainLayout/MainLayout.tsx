import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./MainLayout.module.scss";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import FloatingButton from "@shared/ui/floatingButton/FloatingButton";
import Modal from "@shared/ui/modal/Modal";

interface MainLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  showBackButton?: boolean;
  showWriteButton?: boolean;
  headerTitle?: string | React.ReactElement;
  headerCount?: number;
  rightElement?: React.ReactNode;
  bgColor?: string;
  onBackClick?: () => void;
}

const MainLayout = ({
  children,
  showHeader = true,
  showFooter = true,
  showBackButton = true,
  showWriteButton = true,
  headerTitle = "",
  headerCount,
  rightElement,
  bgColor = "#fff",
}: MainLayoutProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setViewportHeight();
    window.addEventListener("resize", setViewportHeight);

    return () => {
      window.removeEventListener("resize", setViewportHeight);
    };
  }, []);

  const handleBackButtonClick = () => {
    if (location.pathname === "/mypage/edit") {
      setIsModalOpen(true);
    } else {
      window.history.back();
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmNavigation = () => {
    setIsModalOpen(false);
    window.history.back();
  };

  return (
    <div className={styles.mainLayout}>
      {showHeader && (
        <Header
          title={headerTitle}
          count={headerCount}
          showBackButton={showBackButton}
          rightElement={rightElement}
          bgColor={bgColor}
          onBackButtonClick={handleBackButtonClick}
        />
      )}
      <main
        className={`${styles.mainContent} ${showHeader ? styles.withHeader : ""}`}
      >
        {children}
        {showWriteButton && <FloatingButton />}
      </main>
      {showFooter && <Footer />}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="수정을 취소하시겠어요?"
        primaryButton={{
          text: "네",
          altText: "취소할께요",
          onClick: handleConfirmNavigation,
          className: "modal-btn modal-btn-yes",
        }}
        secondaryButton={{
          text: "계속 수정하기",
          altText: "계속 수정하기",
          onClick: handleCloseModal,
          className: "modal-btn modal-btn-no",
        }}
      />
    </div>
  );
};

export default MainLayout;
