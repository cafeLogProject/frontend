import ReactModal from "react-modal";
import Button from "../button/ui/Button";
import { ButtonProps } from "../button/types/types";

ReactModal.setAppElement('#root');

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  primaryButton: ButtonProps;
  secondaryButton: ButtonProps;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  primaryButton,
  secondaryButton,
}) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <h1>{title}</h1>
      {description && <h2 className="modal-description">{description}</h2>}
      <div className="modal-btn-wrap">
        <Button {...secondaryButton} />
        <Button {...primaryButton} />
      </div>
    </ReactModal>
  );
};

export default Modal;
