import React, { useEffect, useState } from "react";
import DeleteIcon from "@shared/assets/images/photo-uploader/delete.svg";
import { UploadedImage } from "../types";
import styles from "./PhotoThumbnail.module.scss";
import Lottie from 'lottie-react';
import spinnerAnimation from '@shared/assets/images/spinner.json';

interface PhotoThumbnailProps {
  image: UploadedImage;
  onDelete: (id: string) => void;
}

export const PhotoThumbnail: React.FC<PhotoThumbnailProps> = ({
  image,
  onDelete,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (image.file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(image.file);
    }
  }, [image.file]);

  // Use server URL if uploaded, otherwise use local preview
  const displayUrl = image.uploadedUrl || previewUrl || image.previewUrl;
  
  return (
    <div
      className={styles.thumbnailContainer}
      onClick={() => onDelete(image.id)}
      role="button"
      tabIndex={0}
    >
      <img
        src={displayUrl}
        alt="업로드된 이미지" 
        className={styles.image}
      />
      {image.isUploading && (
        <div className={styles.spinner}>
          <Lottie
            animationData={spinnerAnimation}
            style={{ width: 24, height: 24 }}
            loop={true}
          />
        </div>
      )}
      {!image.isUploading && (
        <div className={styles.deleteButton} aria-hidden="true">
          <img src={DeleteIcon} alt="" />
        </div>
      )}
    </div>
  );
};
