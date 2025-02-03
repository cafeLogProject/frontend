import { useState } from "react";
import styles from "./ReviewFilter.module.scss";
import Button from "@/shared/ui/button/ui/Button";
import filter from "@shared/assets/images/filter.svg";
import BottomSheet from "@shared/ui/bottomSheet/BottomSheet";
import TagSelector from "@/features/writeReview/ui/TagSelector";
import resetIcon from "@shared/assets/images/reset.svg";

interface ReviewFilterProps {
  onSortChange: (filter: "latest" | "highRating") => void;
  onTagsConfirm: (tags: { menu: number[]; interior: number[] }) => void;
}

const ReviewFilter = ({ onSortChange, onTagsConfirm }: ReviewFilterProps) => {
  const [activeFilter, setActiveFilter] = useState<"latest" | "highRating">("latest");
  const [isTagSelectorOpen, setIsTagSelectorOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<{
    menu: number[];
    interior: number[];
  }>({
    menu: [],
    interior: []
  });

  const handleFilterClick = (filterType: "latest" | "highRating") => {
    setActiveFilter(filterType);
    onSortChange(filterType);
  };

  const handleTagClick = (category: "menu" | "interior", id: number) => {
    setSelectedTags(prev => ({
      ...prev,
      [category]: prev[category]?.includes(id)
        ? prev[category]?.filter(tagId => tagId !== id)
        : [...(prev[category] || []), id]
    }));
  };

  const handleConfirm = () => {
    onTagsConfirm(selectedTags);
    setIsTagSelectorOpen(false);
  };

  return (
    <div className={styles.reviewFilter}>
      <div className={styles.reviewFilter__btnWraper}>
        <Button
          className={`${styles.reviewFilter__filterBtn} ${activeFilter === "latest" ? styles.active : ""}`}
          text="최신순"
          altText="최신순으로 확인하기"
          onClick={() => handleFilterClick("latest")}
        />
        <Button
          className={`${styles.reviewFilter__filterBtn} ${activeFilter === "highRating" ? styles.active : ""}`}
          text="평점 높은 순"
          altText="평점 높은 순으로 확인하기"
          onClick={() => handleFilterClick("highRating")}
        />
      </div>
      <div className={styles.filterButtonContainer}>
        <Button
          imgUrl={filter}
          altText="태그 필터링 버튼"
          className={`imgBtn ${styles.filterButton}`}
          onClick={() => setIsTagSelectorOpen(true)} 
        />
        {Object.values(selectedTags).flat().length > 0 && (
          <div className={styles.filterDot} />
        )}
      </div>

      <BottomSheet 
        isOpen={isTagSelectorOpen} 
        onClose={() => setIsTagSelectorOpen(false)}
      >
        <div className={styles.bottomSheetContainer}>
          <div className={styles.titleContainer}>
            <h2 className={styles.title}>필터</h2>
            <span className={styles.tagCount}>
              {Object.values(selectedTags).flat().length}
            </span>
          </div>
          <TagSelector
            selectedTags={selectedTags}
            onTagClick={handleTagClick}
          />
          <div className={styles.bottomSheetButtons}>
            <Button
              className={styles.resetButton}
              text={
                <div className={styles.resetButtonContent}>
                  <img src={resetIcon} alt="초기화" className={styles.resetIcon} />
                  <span>초기화</span>
                </div>
              }
              onClick={() => {
                setSelectedTags({ menu: [], interior: [] });
              }}
            />
            <Button
              className={styles.confirmButton}
              text="완료"
              onClick={handleConfirm}
            />
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};

export default ReviewFilter;
