import { useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import backIcon from "@shared/assets/images/common/back.svg";
import cancelIcon from "@shared/assets/images/common/cancel.svg";
import { useDraftSelectionStore } from "@/shared/store/useDraftSelectionStore";

interface HeaderProps {
  showBackButton?: boolean;
  title?: string | React.ReactElement;
  count?: number;
  rightElement?: React.ReactNode;
  bgColor?: string;
  onBackClick?: () => void;
  onBackButtonClick?: () => void;
}

const Header = ({
  showBackButton = true,
  title,
  count,
  rightElement,
  bgColor = "#fff",
  onBackClick,
  onBackButtonClick,
}: HeaderProps) => {
  const navigate = useNavigate();
  const { isSelectionMode, setSelectionMode } = useDraftSelectionStore();

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSelectionMode) {
      setSelectionMode(false);
    } else if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className={styles.header} style={{ backgroundColor: bgColor }}>
      <div className={styles.headerContent}>
        {showBackButton && (
          <button onClick={handleBackClick} className={styles.backButton}>
            <img
              src={isSelectionMode ? cancelIcon : backIcon}
              alt={isSelectionMode ? "선택 취소" : "뒤로가기"}
            />
          </button>
        )}
        {title && (
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>{title}</h1>
            {count !== undefined && (
              <span className={styles.count}>{count}</span>
            )}
          </div>
        )}
        {rightElement && (
          <div className={styles.rightElement}>{rightElement}</div>
        )}
      </div>
    </header>
  );
};

export default Header;
