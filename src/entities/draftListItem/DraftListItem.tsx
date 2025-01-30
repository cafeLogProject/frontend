import { useState, useEffect } from 'react';
import styles from "./DraftListItem.module.scss";
import { formatDate } from '@shared/utils/formatDate';
import { useDraftSelectionStore } from '@shared/store/useDraftSelectionStore';
import uncheckedIcon from '@shared/assets/images/draft/unchecked.svg';
import checkedIcon from '@shared/assets/images/draft/checked.svg';

interface DraftItemCafe {
  id: number;
  name: string;
}

interface DraftItemData {
  id: number;
  cafe: DraftItemCafe;
}

interface DraftListItemProps {
  draft: DraftItemData;
  onSelect: () => void;
  createdAt: string;
}

const DraftListItem = ({
  draft,
  onSelect,
  createdAt,
}: DraftListItemProps) => {
  const [showCheckbox, setShowCheckbox] = useState(false);
  const { isSelectionMode, selectedDrafts, toggleDraftSelection } = useDraftSelectionStore();

  useEffect(() => {
    setShowCheckbox(isSelectionMode);
  }, [isSelectionMode]);

  const handleClick = (e: React.MouseEvent) => {
    if (showCheckbox) {
      e.preventDefault();
      toggleDraftSelection(draft.id!);
    } else {
      onSelect();
    }
  };

  return (
    <li className={styles.draftItem}>
      <a onClick={handleClick} className={styles.draftItem__link}>
        <div className={styles.draftItem__info}>
          <p className={styles.draftItem__name}>{draft.cafe?.name}</p>
          <p className={styles.draftItem__date}>
            {formatDate(createdAt, 'YYYY.MM.DD')} 작성 시작
          </p>
        </div>
        {showCheckbox && (
          <div className={styles.draftItem__checkbox}>
            <img
              src={selectedDrafts.includes(draft.id!) ? checkedIcon : uncheckedIcon}
              alt={selectedDrafts.includes(draft.id!) ? "선택됨" : "선택되지 않음"}
              className={styles.checkboxIcon}
              onClick={(e) => {
                e.stopPropagation();
                toggleDraftSelection(draft.id!);
              }}
            />
          </div>
        )}
      </a>
    </li>
  );
};

export default DraftListItem;