import { Tag } from "@shared/ui/tag";
import { TAGS } from "@shared/constants/tags";
import styles from "./TagSelector.module.scss";
import { useState } from "react";
import AlertIcon from "@shared/assets/images/common/alert.svg";

interface TagSelectorProps {
  selectedTags: {
    menu?: number[];
    interior?: number[];
  };
  onTagClick: (category: "menu" | "interior", id: number) => void;
  error?: string;
}

const TagSelector = ({ selectedTags, onTagClick, error }: TagSelectorProps) => {
  const totalSelectedTags =
    (selectedTags.menu?.length || 0) + (selectedTags.interior?.length || 0);
  const [localError, setLocalError] = useState<string | undefined>(error);

  const handleTagClick = (category: "menu" | "interior", id: number) => {
    // 이미 선택된 태그인 경우 선택 해제 허용
    if (selectedTags[category]?.includes(id)) {
      onTagClick(category, id);
      setLocalError(undefined);
      return;
    }

    // 5개 초과 선택 시도시 에러 메시지 표시
    if (totalSelectedTags >= 5) {
      setLocalError("최대 5개까지 선택 가능해요.");
      return;
    }

    onTagClick(category, id);
    setLocalError(undefined);
  };

  return (
    <div
      className={`${styles.tagContainer} ${localError ? styles.errorTagContainer : ""}`}
    >
      <div className={styles.tagSection}>
        <span className={styles.tagSubLabel}>메뉴</span>
        <div className={styles.tags}>
          {TAGS.menu.map((tag) => (
            <Tag
              key={tag.id}
              content={tag.description}
              defaultIcon={tag.defaultIcon}
              activeIcon={tag.activeIcon}
              isActive={selectedTags.menu?.includes(tag.id) || false}
              onClick={() => handleTagClick("menu", tag.id)}
            />
          ))}
        </div>
      </div>
      <div className={styles.tagSection}>
        <span className={styles.tagSubLabel}>매장</span>
        <div className={styles.tags}>
          {TAGS.interior.map((tag) => (
            <Tag
              key={tag.id}
              content={tag.description}
              defaultIcon={tag.defaultIcon}
              activeIcon={tag.activeIcon}
              isActive={selectedTags.interior?.includes(tag.id) || false}
              onClick={() => handleTagClick("interior", tag.id)}
            />
          ))}
        </div>
      </div>
      {localError && (
        <div className={styles.errorText}>
          <img src={AlertIcon} alt="경고" className={styles.alertIcon} />
          {localError}
        </div>
      )}
    </div>
  );
};

export default TagSelector;
