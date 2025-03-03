import { useState } from "react";
import clsx from "clsx";
import { StarIcon } from "./StarIcon";
import styles from "./StarRating.module.scss";

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  showRatingText?: boolean;
  showRatingValue?: boolean;
  size?: number;
  rootClassName?: string;
  starsContainerClassName?: string;
  ratingTextClassName?: string;
}

const getRatingText = (value: number) => {
  if (!value) return "";

  switch (Math.floor(value)) {
    case 1:
      return "(실망스러워요.)";
    case 2:
      return "(별로에요.)";
    case 3:
      return "(그럭저럭이에요.)";
    case 4:
      return "(만족스러워요!)";
    case 5:
      return "(최고예요!)";
    default:
      return "";
  }
};

export const StarRating = ({
  value,
  onChange,
  showRatingText = false,
  showRatingValue = false,
  size = 40,
  rootClassName,
  starsContainerClassName,
  ratingTextClassName,
}: StarRatingProps) => {
  const [hover, setHover] = useState(0);
  const isInteractive = !!onChange;

  return (
    <div className={clsx(styles.container, rootClassName)}>
      <div className={clsx(styles.stars, starsContainerClassName)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            filled={star <= (hover || value)}
            size={size}
            onClick={isInteractive ? () => onChange(star) : undefined}
            onMouseEnter={isInteractive ? () => setHover(star) : undefined}
            onMouseLeave={isInteractive ? () => setHover(0) : undefined}
          />
        ))}
      </div>
      {showRatingText && value > 0 && (
        <div className={styles.ratingTextContainer}>
          <span
            className={clsx(
              styles.ratingValue,
              value <= 2 ? styles.low : value <= 4 ? styles.medium : styles.high
            )}
          >
            {value.toFixed(1)} {getRatingText(value)}
          </span>
        </div>
      )}
      {showRatingValue && (
        <p className={clsx(styles.ratingText, ratingTextClassName)}>
          {value.toFixed(1)}
        </p>
      )}
    </div>
  );
};
