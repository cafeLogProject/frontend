import styles from "./ReviewTagList.module.scss";
import ReviewTag from "../reviewTag/ReviewTag";
import { useState } from "react";
import { TagMapper } from "@shared/lib/tagMapper";

interface ReviewTagListProps {
  tagIds: number[];
}

const ReviewTagList = ({ tagIds }: ReviewTagListProps) => {
  const [showAll, setShowAll] = useState(false);

  const allTags = tagIds.map(id => {
    let tag = TagMapper.findTagById("menu", id);
    if (!tag) {
      tag = TagMapper.findTagById("interior", id);
    }
    return tag ? {
      id,
      content: tag.description
    } : null;
  }).filter((tag): tag is { id: number; content: string } => tag !== null);

  const visibleTags = showAll ? allTags : allTags.slice(0, 2);

  return (
    <div className={styles.tagList}>
      {visibleTags.map((tag) => (
        <ReviewTag key={tag.id} content={tag.content} id={tag.id} />
      ))}
      {!showAll && allTags.length > 2 && (
        <button className={styles.tagBtn} onClick={() => setShowAll(true)}>
          + {allTags.length - 2}
        </button>
      )}
    </div>
  );
};

export default ReviewTagList;
