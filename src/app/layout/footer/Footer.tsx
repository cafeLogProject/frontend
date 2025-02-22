import { useNavigate, useLocation } from "react-router-dom";
import { useNavigationStore } from "@shared/store/useNavigationStore";
import styles from "./Footer.module.scss";
import homeIcon from "@shared/assets/images/nav/home.svg";
import homeIconOn from "@shared/assets/images/nav/home-on.svg";
import searchIcon from "@shared/assets/images/nav/search.svg";
import searchIconOn from "@shared/assets/images/nav/search-on.svg";
import profileIcon from "@shared/assets/images/nav/profile.svg";
import profileIconOn from "@shared/assets/images/nav/profile-on.svg";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isFromFooter, setIsFromFooter } = useNavigationStore();

  const handleSearchClick = () => {
    setIsFromFooter(true);
    navigate("/search");
  };

  const isActive = (path) => {
    if (path === "/search") {
      return location.pathname === path && isFromFooter;
    }
    return location.pathname === path;
  };

  return (
    <footer className={styles.footer}>
      <nav className={styles.nav}>
        <div onClick={() => navigate("/")} className={styles.navItem}>
          <button className={styles.navButton}>
            <img src={isActive("/") ? homeIconOn : homeIcon} alt="홈" />
            <span style={{ color: isActive("/") ? "#FF8922" : "#767676" }}>
              홈
            </span>
          </button>
        </div>
        <div onClick={handleSearchClick} className={styles.navItem}>
          <button onClick={handleSearchClick} className={styles.navButton}>
            <img
              src={isActive("/search") ? searchIconOn : searchIcon}
              alt="검색"
            />
            <span
              style={{ color: isActive("/search") ? "#FF8922" : "#767676" }}
            >
              검색
            </span>
          </button>
        </div>
        <div onClick={() => navigate("/mypage")} className={styles.navItem}>
          <button className={styles.navButton}>
            <img
              src={isActive("/mypage") ? profileIconOn : profileIcon}
              alt="프로필"
            />
            <span
              style={{ color: isActive("/mypage") ? "#FF8922" : "#767676" }}
            >
              프로필
            </span>
          </button>
        </div>
      </nav>
    </footer>
  );
};

export default Footer;
