import { useState } from "react";
import { ReviewList } from "@/widgets/reviewList";
import ReviewFilter from "@/entities/review/ui/reviewFilter/ReviewFilter";
import { useQueryClient } from '@tanstack/react-query';

const Main = () => {
  const [sortType, setSortType] = useState<"NEW" | "HIGH_RATING">("NEW");
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const queryClient = useQueryClient();

  const handleSortChange = (filter: "latest" | "highRating") => {
    setSortType(filter === "latest" ? "NEW" : "HIGH_RATING");
    invalidateReviewsQuery();
  };

  const handleTagsConfirm = (tags: { menu: number[]; interior: number[] }) => {
    const allTags = [...tags.menu, ...tags.interior];
    setSelectedTagIds(allTags);
    invalidateReviewsQuery();
  };

  const invalidateReviewsQuery = () => {
    queryClient.invalidateQueries({ 
      queryKey: ['reviews', 'list'] 
    });
  };

  return (
    <div>
      <ReviewFilter 
        onSortChange={handleSortChange} 
        onTagsConfirm={handleTagsConfirm}
      />
      <ReviewList 
        type="all" 
        params={{ 
          sort: sortType,
          limit: 10,
          tagIds: selectedTagIds
        }}
        key={`${sortType}-${selectedTagIds.join(',')}`}
      />
    </div>
  );
};

export default Main;
