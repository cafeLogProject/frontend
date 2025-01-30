import { useState } from "react";
import { ReviewList } from "@/widgets/reviewList";
import ReviewFilter from "@/entities/review/ui/reviewFilter/ReviewFilter";
import { useQueryClient } from '@tanstack/react-query';

const Main = () => {
  const [sortType, setSortType] = useState<"NEW" | "HIGH_RATING">("NEW");
  const queryClient = useQueryClient();

  const handleSortChange = (filter: "latest" | "highRating") => {
    setSortType(filter === "latest" ? "NEW" : "HIGH_RATING");
    // 필터 변경 시 쿼리 무효화
    queryClient.invalidateQueries({ 
      queryKey: ['reviews', 'list', { sort: filter === "latest" ? "NEW" : "HIGH_RATING" }] 
    });
  };

  return (
    <div>
      <ReviewFilter onSortChange={handleSortChange} />
      <ReviewList 
        type="all" 
        params={{ 
          sort: sortType, 
          limit: 10 
        }}
        key={sortType}
      />
    </div>
  );
};

export default Main;
