import { useRef } from "react";
import { useProfileStore } from "@shared/store/useProfileStore";
import styles from "./PhotoEdit.module.scss";
import profile from "@shared/assets/images/profile/profile.svg";
import edit from "@shared/assets/images/profile/image-edit.svg";
import Button from "@/shared/ui/button/ui/Button";

const PhotoEdit = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { file, setFile, profileImageUrl } = useProfileStore();
  useProfileStore();

  const preview = file ? URL.createObjectURL(file) : profileImageUrl || profile;

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <div className={styles.photoEditWrap}>
      <div className={styles.photoEditBox}>
        <img
          className={styles.photoEditBox__profile}
          src={preview}
          alt="profile-img"
        />

        <Button
          onClick={handleClick}
          className={`imgBtn ${styles["photoEditBox__profile--edit"]}`}
          imgUrl={edit}
          altText="프로필 사진 선택"
        />
        <label
          htmlFor="photoUpload"
          className={styles.photoEditBox__profilefileInput}
        >
          <input
            id="photoUpload"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            title="이미지 파일 선택"
          />
        </label>
      </div>
    </div>
  );
};

export default PhotoEdit;
