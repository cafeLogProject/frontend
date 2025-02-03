export interface ButtonProps {
  onClick?: () => void;
  imgUrl?: string;
  altText?: string;
  text?: string | React.ReactNode;
  className?: string;
  textClassName?: string;
}
