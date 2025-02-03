import styles from "./FilterBtn.module.scss";
import Button from "@/shared/ui/button/ui/Button";

interface FilterBtnProps {
  onChange: (type: "review" | "scrap") => void;
  activeType: "review" | "scrap";
}

const FilterBtn: React.FC<FilterBtnProps> = ({ onChange, activeType }) => {
  return (
    <div className={styles.filterBtnWrap}>
      <Button
        className={`${styles.reviewFilterBtn} ${
          activeType === "review" ? styles["reviewFilterBtn--on"] : ""
        }`}
        text="내가 작성한 리뷰"
        onClick={() => onChange("review")}
      />
      <Button
        className={`${styles.reviewFilterBtn} ${
          activeType === "scrap" ? styles["reviewFilterBtn--on"] : ""
        }`}
        text="스크랩한 장소"
        onClick={() => onChange("scrap")}
      />
    </div>
  );
};

export default FilterBtn;
