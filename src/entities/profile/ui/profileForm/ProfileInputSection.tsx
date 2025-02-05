import { useState, useEffect } from "react";
import styles from "./ProfilForm.module.scss";
import Input from "@/shared/ui/baseInput/Input";
import LabelWrap from "@/shared/ui/baseLabel/LabelWrap";
import Textarea from "@/shared/ui/baseTextarea/Textarea";
import alert from "@/shared/assets/images/common/alert.svg";

interface ProfileInputSectionProps {
  label: string;
  placeholder: string;
  maxLength: number;
  showRight: boolean;
  showInput?: boolean;
  showSocialAccount: boolean;
  showTextarea?: boolean;
  socialAccount?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  errorMessage?: string;
}

const ProfileInputSection = ({
  label,
  placeholder,
  required,
  maxLength,
  showRight,
  showInput,
  showTextarea,
  showSocialAccount,
  socialAccount,
  value = "",
  onChange,
  errorMessage,
}: ProfileInputSectionProps) => {
  const [inputValue, setInputValue] = useState<string>(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;

    if (value.length <= maxLength) {
      setInputValue(value);
      if (onChange) {
        onChange(value);
      }
    }
  };

  return (
    <div className={styles.profileForm__item}>
      <LabelWrap
        label={label}
        required={required}
        showRight={showRight}
        currentLength={inputValue.length}
        maxLength={maxLength}
        showSocialAccount={showSocialAccount}
        socialAccount={socialAccount}
      />
      {showInput && (
        <>
          <Input
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            hasError={!!errorMessage}
          />
          {errorMessage && (
            <div className={styles.errorMessage}>
              <img src={alert} alt="닉네임 중복" />
              <p>{errorMessage}</p>
            </div>
          )}
        </>
      )}
      {showTextarea && (
        <Textarea
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
        />
      )}
    </div>
  );
};

export default ProfileInputSection;
