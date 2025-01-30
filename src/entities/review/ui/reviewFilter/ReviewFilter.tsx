import { useState } from "react";
import styles from "./ReviewFilter.module.scss";
import Button from "@/shared/ui/button/ui/Button";
import filter from "@shared/assets/images/filter.svg";

interface ReviewFilterProps {
  onSortChange: (filter: "latest" | "highRating") => void;
}

const ReviewFilter = ({ onSortChange }: ReviewFilterProps) => {
  const [activeFilter, setActiveFilter] = useState<"latest" | "highRating">("latest");
  
  const handleFilterClick = (filterType: "latest" | "highRating") => {
    setActiveFilter(filterType);
    onSortChange(filterType);
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
      <Button imgUrl={filter} altText="태그 필터링 버튼" className="imgBtn" />
    </div>
  );
};

export default ReviewFilter;
