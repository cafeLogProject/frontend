import React from "react";
import DeleteIcon from "@shared/assets/images/photo-uploader/delete.svg";
import { UploadedImage } from "../types";
import styles from "./PhotoThumbnail.module.scss";

interface PhotoThumbnailProps {
  image: UploadedImage;
  onDelete: (id: string) => void;
}

export const PhotoThumbnail: React.FC<PhotoThumbnailProps> = ({
  image,
  onDelete,
}) => {
  return (
    <div
      className={styles.thumbnailContainer}
      onClick={() => onDelete(image.id)}
      role="button"
      tabIndex={0}
    >
      <img
        src={image.previewUrl}
        alt="업로드된 이미지"
        className={styles.image}
      />
      <div className={styles.deleteButton} aria-hidden="true">
        <img src={DeleteIcon} alt="" />
      </div>
    </div>
  );
};