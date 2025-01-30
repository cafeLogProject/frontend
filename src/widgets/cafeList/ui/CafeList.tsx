import CafeItem from "@entities/cafeListItem/CafeListItem";
import styles from "./CafeList.module.scss";
import type { ICafeDescription } from "@shared/api/cafe/types";

interface CafeListProps {
  cafeInfo: ICafeDescription[];
  onCafeSelect: (cafe: ICafeDescription) => void;
}

export const CafeList = ({ cafeInfo, onCafeSelect }: CafeListProps) => (
  <ul className={styles.cafeList}>
    {cafeInfo?.length > 0 && cafeInfo.map((cafe, index) => (
      <CafeItem
        key={`${cafe.name}-${cafe.mapx}-${cafe.mapy}-${index}`}
        {...cafe}
        onSelect={() => onCafeSelect(cafe)}
      />
    ))}
  </ul>
);
