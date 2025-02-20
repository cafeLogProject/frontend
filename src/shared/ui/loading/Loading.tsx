import Lottie from "lottie-react";
import styles from "./Loading.module.scss";
import spinnerAnimation from '@shared/assets/images/spinner.json';


const Loading = () => {
  return (
    <div className={styles.loading}>
      <Lottie
        animationData={spinnerAnimation}
        style={{ width: 40, height: 40 }}
        loop={true}
      />
    </div>
  );
};

export default Loading;