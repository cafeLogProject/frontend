import styles from "./Input.module.scss";

interface InputProps {
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  hasError?: boolean;
}

const Input = ({ placeholder, value, onChange, hasError }: InputProps) => {
  return (
    <input
      className={`${styles.input} ${hasError ? styles.error : ""}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default Input;
