import { useNavigate } from "react-router-dom";
import { useReviewDraftApi } from "@shared/api/reviews/reviewDraftApi";
import styles from "@app/layout/header/Header.module.scss";

const DraftCounter = () => {
  const navigate = useNavigate();
  const { useUserDraftReviews } = useReviewDraftApi();
  const draftListQuery = useUserDraftReviews();
  
  if (draftListQuery.isLoading || draftListQuery.isError) {
    return null;
  }

  const count = draftListQuery.data?.length ?? 0;
  
  // count가 0인 경우 null 반환하여 컴포넌트를 렌더링하지 않음
  if (count === 0) {
    return null;
  }
  
  return (
    <span 
      className={styles.completeButton}
      onClick={() => navigate("/draft")}
      style={{ cursor: "pointer" }}
    >
      작성중 <span style={{ color: "#FF8922" }}>{count}</span>
    </span>
  );
};

export default DraftCounter;