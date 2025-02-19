import styles from "./NoContent.module.scss";
import noResultIcon from "@shared/assets/images/no_result.svg";
import noReviewIcon from "@shared/assets/images/no_review.svg";

interface NoContentProps {
  logo: 'noReview' | 'noResult';
  mainContent: string;
  subContent: string;
}

const NoContent = ({
  logo,
  mainContent,
  subContent
} : NoContentProps) => {

  return (
    <div>
      <img 
        src= {logo === "noResult"? noResultIcon : noReviewIcon} 
        alt="컨텐츠 없음"
      /> 
      <p>{mainContent}</p>
      <p>{subContent}</p>
    </div>
  );
};

export default NoContent;
