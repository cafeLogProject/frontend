import { useState } from "react";
import { ReviewList } from "@/widgets/reviewList";
import ReviewFilter from "@/entities/review/ui/reviewFilter/ReviewFilter";
import { useQueryClient } from "@tanstack/react-query";

const Main = () => {
  const [sortType, setSortType] = useState<"NEW" | "HIGH_RATING">("NEW");
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [lastTimestamp, setLastTimestamp] = useState<string>(
    new Date(3000, 0, 1).toISOString()
  );
  const [lastRating, setLastRating] = useState<number | undefined>();
  const queryClient = useQueryClient();

  const handleSortChange = (filter: "latest" | "highRating") => {
    setSortType(filter === "latest" ? "NEW" : "HIGH_RATING");
    setLastTimestamp(new Date(3000, 0, 1).toISOString());
    setLastRating(undefined);
    invalidateReviewsQuery();
  };
  
  const handleTagsConfirm = (tags: { menu: number[]; interior: number[] }) => {
    const allTags = [...tags.menu, ...tags.interior];
    setSelectedTagIds(allTags);
    setLastTimestamp(new Date(3000, 0, 1).toISOString());
    setLastRating(undefined);
    invalidateReviewsQuery();
  };

  const handleLoadMore = (timestamp: string, rating?: number) => {
    setLastTimestamp(timestamp);
    if (rating !== undefined) {
      setLastRating(rating);
    }
  };

  const invalidateReviewsQuery = () => {
    queryClient.invalidateQueries({
      queryKey: ["reviews", "list"],
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
          tagIds: selectedTagIds,
          timestamp: lastTimestamp,
          ...(sortType === "HIGH_RATING" && {
            rating: lastRating,
          }),
        }}
        onLoadMore={handleLoadMore}
        key={`${sortType}-${selectedTagIds.join(",")}`}
      />
    </div>
  );
};

export default Main;
