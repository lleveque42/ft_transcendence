import styles from "../../../Play.module.scss";
import styles2 from "./GameCancelled.module.scss";

export default function GameCancelled() {
	return (
		<>
			<div className={`${styles.textContainer} underTitle mb-20`}>
				<div className="title">PONG</div>
				<div className="underTitle">Game cancelled</div>
			</div>
			<div className={`${styles2.cancelled} underTitle mb-30`}>
				Game cancelled, opponent disconnected.
			</div>
		</>
	);
}
