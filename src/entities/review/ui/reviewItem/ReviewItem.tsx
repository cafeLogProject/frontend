import ReviewerInfo from "../reviewerInfo/ReviewerInfo";
import PhotoSwiper from "@shared/ui/photoSwiper/PhotoSwiper.tsx";
import ReviewContent from "../reviewContent/reviewContent";
import ReviewTagList from "../reviewTagList/ReviewTagList";
import type { ShowReviewResponse } from "@shared/api/reviews/types";

interface ReviewItemProps {
  review: ShowReviewResponse;
  showChips?: boolean;
}

const ReviewItem = ({ review, showChips = false }: ReviewItemProps) => {
  return (
    <div>
      <ReviewerInfo
        nickname={review.nickname}
        visitDate={review.visitDate}
        rating={review.rating}
        isProfileImageExist={review.isProfileImageExist}
      />
      <PhotoSwiper 
        imageIds={(review.imageIds || []).map(id => id.toString())} 
        showChips={showChips}
        cafeName={review.cafeName}
        cafeId={review.cafeId}
      />
      <ReviewContent content={review.content} />
      <ReviewTagList tagIds={review.tagIds} />
    </div>
  );
};

export default ReviewItem;
