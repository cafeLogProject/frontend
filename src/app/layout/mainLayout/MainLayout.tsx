import { ReactNode, useEffect } from "react"; // useEffect 추가
import styles from "./MainLayout.module.scss";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import FloatingButton from "@shared/ui/floatingButton/FloatingButton";

interface MainLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  showBackButton?: boolean;
  showWriteButton?: boolean;
  headerTitle?: string;
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
  useEffect(() => {
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);

    return () => {
      window.removeEventListener('resize', setViewportHeight);
    };
  }, []);

  return (
    <div className={styles.mainLayout}>
      {showHeader && (
        <Header
          title={headerTitle}
          count={headerCount}
          showBackButton={showBackButton}
          rightElement={rightElement}
          bgColor={bgColor}
        />
      )}
      <main className={`${styles.mainContent} ${showHeader ? styles.withHeader : ''}`}>
        {children}
        {showWriteButton && <FloatingButton />}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
