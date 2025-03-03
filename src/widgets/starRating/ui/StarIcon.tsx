import StarEmpty from '@shared/assets/images/star-rating/star.svg';
import StarFilled from '@shared/assets/images/star-rating/star-filled.svg';
import { StarIconProps } from '../types/types';
import styles from './StarRating.module.scss';

export const StarIcon = ({ filled, size = 40, onClick, onMouseEnter, onMouseLeave }: StarIconProps) => (
  <img 
    src={filled ? StarFilled : StarEmpty}
    alt="star"
    className={styles.star}
    style={{ width: size, height: size }}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  />
);