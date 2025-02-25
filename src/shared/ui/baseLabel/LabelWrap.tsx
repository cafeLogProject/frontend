import styles from "./LabelWrap.module.scss";
import mail from "@/shared/assets/images/profile/mail.svg";
import alert from "@/shared/assets/images/common/alert.svg";

interface LabelWrapProps {
  label: string;
  showRight: boolean;
  currentLength: number;
  maxLength: number;
  showSocialAccount: boolean;
  socialAccount?: string;
  required?: boolean;
}

const LabelWrap = ({
  label,
  showRight,
  currentLength,
  maxLength,
  showSocialAccount,
  socialAccount,
  required,
}: LabelWrapProps) => {
  return (
    <div className={styles.labelWrap}>
      <div className={styles.label__left}>
        <label>{label}</label>
        {required && <div className={styles.label__required}></div>}
      </div>
      {showSocialAccount && socialAccount && (
        <div className={styles.label__right}>
          <img src={mail} alt="메일 이모티콘" />
          <span>{socialAccount}</span>
        </div>
      )}
      {showRight && (
        <div className={styles.label__right}>
          {currentLength >= maxLength
            ? <img className={styles.label__right__img} src={alert} alt="경고 이모티콘"/>
            : null
          }
          <span>
            <span className={`${styles["label__right--current"]} ${currentLength >= maxLength ? styles["label__right__maxLength"] : ""}`}>
              {currentLength}
            </span>{" "}
            / {maxLength}자
          </span>
        </div>
      )}
    </div>
  );
};

export default LabelWrap;
