import { toast } from "react-toastify";
import checked from "@/shared/assets/images/common/checked.svg";
import styles from "./CustomToast.module.scss";
import yellowAlert from "@/shared/assets/images/common/yellowAlert.svg";

export const showErrorToast = (message?: string) => {
  toast(
    <div className="toast-content">
      <div className="toast-content-left">
        <img src={yellowAlert} />
        <span className={styles.toastContent}>{message || "알 수 없는 에러 발생"}</span>
      </div>
    </div>,
    {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      closeButton: false,
    }
  );
};

export const showSuccessToast = (message: string) => {
  toast(
    <div className="toast-content">
      <div className="toast-content-left">
        <img src={checked} />
        <span>{message}</span>
      </div>
    </div>,
    {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      closeButton: false,
    }
  );
}
