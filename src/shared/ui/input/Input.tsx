import { ReactNode } from "react";
import styles from "./Input.module.scss";
import AlertIcon from "@shared/assets/images/common/alert.svg";

interface InputWrapperProps {
  children?: ReactNode;
  label?: ReactNode;
  className?: string;
  isRequired?: boolean;
  error?: string;
  fullWidthLabel?: boolean;
}

export const InputWrapper = ({
  children,
  label,
  className,
  isRequired,
  error,
  fullWidthLabel = false,
}: InputWrapperProps) => {
  return (
    <div className={styles.inputContainer}>
      {label && (
        <label className={`${styles.label} ${className || ""}`}>
          <span className={`${styles.labelText} ${fullWidthLabel ? styles.fullWidth : ''}`}>
            {label}
            {isRequired && <span className={styles.required} />}
          </span>
        </label>
      )}
      <div className={styles.inputWrapper}>
        <div className={styles.inputContent}>
          {children}
        </div>
        {error && (
          <div className={styles.errorText}>
            <img src={AlertIcon} alt="경고" className={styles.alertIcon} />
            {error}
          </div>
        )}
      </div>
    </div>
  );
};
