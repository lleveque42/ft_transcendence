import Loader from "react-loaders";
import styles from "../../../Play.module.scss"

export default function WaitingOpponentReconnection() {
	return (
		<>
			<div
				className={`d-flex flex-column align-items justify-content mb-50`}
			>
				<div className={`${styles.textContainer} underTitle flex-1 mb-50`}>
					<div className="title">PONG</div>
					<div className="underTitle">Opponent disconnected, waiting for reconnection...</div>
				</div>
				<div className={`flex-1 mb-50`}>
					<Loader type="ball-zig-zag" innerClassName="queue-loader" active />
				</div>
			</div>
		</>
	);
}
