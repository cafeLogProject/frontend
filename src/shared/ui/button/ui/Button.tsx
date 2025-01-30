import type { ButtonProps } from "../types/types";

export const Button: React.FC<ButtonProps> = ({
  onClick,
  imgUrl,
  altText,
  text,
  className,
  textClassName,
}) => {
  return (
    <button onClick={onClick} className={className}>
      {imgUrl && <img src={imgUrl} alt={altText} />}
      {text && <p className={textClassName}>{text}</p>}
    </button>
  );
};

export default Button;
