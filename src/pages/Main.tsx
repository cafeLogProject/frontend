import { useState } from "react";
import { ReviewList } from "@/widgets/reviewList";
import ReviewFilter from "@/entities/review/ui/reviewFilter/ReviewFilter";
import { useQueryClient } from "@tanstack/react-query";
import { Tabs } from "@shared/ui/tabs/Tabs";
import type { Tab } from "@shared/ui/tabs/types";

const Main = () => {
  const [sortType, setSortType] = useState<"NEW" | "HIGH_RATING">("NEW");
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [lastTimestamp, setLastTimestamp] = useState<string>(
    new Date(3000, 0, 1).toISOString()
  );
  const [lastRating, setLastRating] = useState<number | undefined>();
  const [activeTab, setActiveTab] = useState<string>("explore");
  const queryClient = useQueryClient();

  const tabs: Tab[] = [
    { id: "explore", label: "탐색" },
    { id: "following", label: "팔로잉" },
  ];

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

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    setLastTimestamp(new Date(3000, 0, 1).toISOString());
    setLastRating(undefined);
    invalidateReviewsQuery();
  };

  const invalidateReviewsQuery = () => {
    queryClient.invalidateQueries({
      queryKey: ["reviews", "list"],
    });
  };

  return (
    <div>
      <div>
        <Tabs 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
        />
      </div>
      {activeTab === "explore" && (
        <ReviewFilter
          onSortChange={handleSortChange}
          onTagsConfirm={handleTagsConfirm}
        />
      )}
      <ReviewList
        type={activeTab === "explore" ? "all" : "follow"}
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
        key={`${activeTab}-${sortType}-${selectedTagIds.join(",")}`}
      />
    </div>
  );
};

export default Main;
