import Loader from "react-loaders";
import styles from "./ReadyToStart.module.scss";

export default function ReadyToStart() {
	return (
		<div
			className={`${styles.readyContainer} d-flex flex-column align-items justify-content`}
		>
			<div className={`${styles.textContainer} underTitle flex-1`}>
				<div className="title">PONG</div>
				<div className="underTitle">Waiting for other player...</div>
			</div>
			<div className={`flex-1`}>
				<Loader type="ball-zig-zag" innerClassName="queue-loader" active />
			</div>
		</div>
	);
}
