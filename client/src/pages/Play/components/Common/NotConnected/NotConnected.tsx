import Loader from "react-loaders";
import styles from "../../../Play.module.scss";

export default function notConnected() {
	return (
		<>
			<div className={`${styles.textContainer} underTitle mb-50`}>
				<div className="title">PONG</div>
				<div className="underTitle">Connecting...</div>
			</div>
			<Loader type="ball-zig-zag" innerClassName="queue-loader mb-50" active />
		</>
	);
}
