import { useNavigate } from "react-router-dom";
import styles from "./styles/GeneralErrorPage.module.scss";
import Error from "@shared/assets/images/error.svg";

type GeneralErrorPageProps = {
	mainText: string;
	subText: string;
};

const GeneralErrorPage = (
	{ mainText, subText }: GeneralErrorPageProps
) => {
	return (
		<div>
			<div className={styles.generalErrorPageContainer}>
				<div className={styles.generalErrorText}>
					<img src={Error} alt="Error" />
					<p className={styles.generalErrorText__main}>{mainText}</p>
					<p className={styles.generalErrorText__sub}>{subText}</p>
				</div>
				<button
				className={styles.generalErrorButton}
				onClick={() => window.location.replace("/")}
				type="button" 
				>
					<p className={styles.content}>홈으로 이동하기</p>
				</button>
			</div>
		</div>
	);
};

export default GeneralErrorPage;