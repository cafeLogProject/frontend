import { Tag } from "@shared/ui/tag";
import { TAGS } from "@shared/constants/tags";
import styles from "./TagSelector.module.scss";

interface TagSelectorProps {
  selectedTags: {
    menu?: number[];
    interior?: number[];
  };
  onTagClick: (category: "menu" | "interior", id: number) => void;
}

const TagSelector = ({ selectedTags, onTagClick }: TagSelectorProps) => {
  return (
    <div className={styles.tagContainer}>
      <div className={styles.tagSection}>
        <h3>메뉴</h3>
        <div className={styles.tags}>
          {TAGS.menu.map((tag) => (
            <Tag
              key={tag.id}
              content={tag.description}
              defaultIcon={tag.defaultIcon}
              activeIcon={tag.activeIcon}
              isActive={selectedTags.menu?.includes(tag.id) || false}
              onClick={() => onTagClick("menu", tag.id)}
            />
          ))}
        </div>
      </div>
      <div className={styles.tagSection}>
        <h3>인테리어</h3>
        <div className={styles.tags}>
          {TAGS.interior.map((tag) => (
            <Tag
              key={tag.id}
              content={tag.description}
              defaultIcon={tag.defaultIcon}
              activeIcon={tag.activeIcon}
              isActive={selectedTags.interior?.includes(tag.id) || false}
              onClick={() => onTagClick("interior", tag.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagSelector;
