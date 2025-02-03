/**
 * 사용되지 않음
 */
import PhotoSwiper from "@shared/ui/photoSwiper/PhotoSwiper.tsx";
import CafeInfoItem from "./CafeInfoItem";
import styles from "./CafeInfo.module.scss";

const CafeInfo = () => {
  return (
    <div>
      <div className={styles.photoSwiperOverride}>
        <PhotoSwiper showChips={false} imageIds={[]} />
      </div>
      <CafeInfoItem
        name="로우키"
        address="서울 성동구 연무장 3길 6 (성수동 2가)"
        link="https://instagram.com/cafename"
        onBookmarkClick={() => console.log("Bookmark clicked")}
        isBookmarked={false}
      />

    </div>
  );
};

export default CafeInfo;
