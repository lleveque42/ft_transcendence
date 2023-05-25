import { useNavigate } from "react-router-dom";
import styles from "./DetectedAfk.module.scss";
import stylesParent from "../../../Play.module.scss";

export default function DetectedAfk() {
	const navigate = useNavigate();

	return (
		<div
			className={`${styles.alertContainer} ${stylesParent.buttonContainer} d-flex flex-column align-items justify-content`}
		>
			<div className={`underTitle mb-20 ${styles.messageContainer}`}>
				You've been detected as afk in previous game(s).
				<br />
				<br /> Every game you're detected as afk is counted as a defeat.
			</div>
			<button
				className={`btn-primary ${styles.btnDetectedAfk}`}
				onClick={() => navigate("/playMinimized")}
			>
				Reconnect
			</button>
		</div>
	);
}
