import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./FullScreenViewer.module.scss";

interface FullScreenViewerProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

const FullScreenViewer = ({ images, initialIndex, onClose }) => {
  return (
    <div className={styles.viewer} onClick={onClose}>
      <Swiper 
        initialSlide={initialIndex}
        className={styles.swiper}
        onClick={(_swiper, event) => event.stopPropagation()}
      >
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