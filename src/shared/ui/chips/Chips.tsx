import { useNavigate } from "react-router-dom";
import styles from "./Chips.module.scss";
import ChipsImage from "@shared/assets/images/chips.svg";

interface ChipsProps {
  cafeName: string;
  cafeId?: number;
  onClick?: () => void;
}

const Chips: React.FC<ChipsProps> = ({ cafeName, cafeId, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (cafeId) {
      navigate(`/cafe/${cafeId}`);
    }
  };

  return (
    <div className={styles.chips} onClick={handleClick}>
      <img src={ChipsImage} alt="location-icon" />
      <p>{cafeName}</p>
    </div>
  );
};

export default Chips;
