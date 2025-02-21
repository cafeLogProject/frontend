import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import styles from "./FullScreenViewer.module.scss";
import ArrowLeft from "@shared/assets/images/photo/nav-arrow-left.svg";
import ArrowRight from "@shared/assets/images/photo/nav-arrow-right.svg";

interface FullScreenViewerProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

const FullScreenViewer = ({
  images,
  initialIndex,
  onClose,
}: FullScreenViewerProps) => {
  const [isFirst, setIsFirst] = useState(initialIndex === 0);
  const [isLast, setIsLast] = useState(initialIndex === images.length - 1);

  const handleSlideChange = (swiper: SwiperType) => {
    setIsFirst(swiper.isBeginning);
    setIsLast(swiper.isEnd);
  };

  return (
    <div className={styles.viewer} onClick={onClose}>
      <Swiper
        initialSlide={initialIndex}
        className={styles.swiper}
        modules={[Navigation]}
        navigation={{
          prevEl: ".custom-button-prev",
          nextEl: ".custom-button-next",
        }}
        onSlideChange={handleSlideChange}
        onClick={(_swiper, event) => event.stopPropagation()}
      >
        <button
          className={`custom-button-prev ${styles.navButton} ${styles.prevButton} ${isFirst ? styles.hidden : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <img src={ArrowLeft} alt="Previous" />
        </button>

        <button
          className={`custom-button-next ${styles.navButton} ${styles.nextButton} ${isLast ? styles.hidden : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <img src={ArrowRight} alt="Next" />
        </button>
        {images.map((url) => (
          <SwiperSlide key={url}>
            <img src={url} className={styles.image} alt="" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FullScreenViewer;
