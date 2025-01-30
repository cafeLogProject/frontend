import Button from "@shared/ui/button/ui/Button";
import { useDraftSelectionStore } from "@shared/store/useDraftSelectionStore";
import styles from "./SelectionModeButton.module.scss";
import edit from "@shared/assets/images/draft/edit.svg";

const SelectionModeButton = () => {
  const { isSelectionMode, setSelectionMode } = useDraftSelectionStore();

  const handleClick = () => {
    setSelectionMode(!isSelectionMode);
  };

  return (
    <Button
      className={`${styles.selectionModeButton} ${
        isSelectionMode ? styles['selectionModeButton--selected'] : ''
      }`}
      onClick={handleClick}
      imgUrl={!isSelectionMode ? edit : undefined}
      text={isSelectionMode ? "완료" : undefined}
      altText={isSelectionMode ? "완료" : "초안 수정"}
      textClassName={styles.selectionModeButton__text}
    />
  );
};

export default SelectionModeButton;