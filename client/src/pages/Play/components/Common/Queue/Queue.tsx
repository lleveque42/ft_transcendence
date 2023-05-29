import { Socket } from "socket.io-client";
import { GameUserStatus } from "../../../enums/UserStatus";
import styles from "./Queue.module.scss";
import Loader from "react-loaders";

interface QueueProps {
	gameSocket: Socket | null;
	setGameUserStatus: React.Dispatch<React.SetStateAction<GameUserStatus>>;
}

export default function Queue({ gameSocket, setGameUserStatus }: QueueProps) {
	function leaveQueue() {
		gameSocket?.emit("leaveQueue");
		gameSocket?.once("leftQueue", () => {
			setGameUserStatus(GameUserStatus.connected);
		});
	}

	return (
		<div
			className={`${styles.queueContainer} d-flex flex-column align-items justify-content`}
		>
			<div className={`${styles.textContainer} underTitle mb-10 flex-1`}>
				<div className="title">PONG</div>
				<div className="underTitle">In queue...</div>
			</div>
			<div className={`flex-1`}>
				<Loader type="ball-zig-zag" innerClassName="queue-loader" active />
			</div>
			<div
				className={`${styles.buttonContainer} d-flex align-items justify-content flex-1`}
			>
				<button
					className="btn-primary d-flex flex-column align-items justify-content pl-10 pr-10 p-5"
					onClick={leaveQueue}
				>
					<div className={styles.buttonText}>Leave queue</div>
					<div className={styles.buttonIcon}>
						<i className="fa-solid fa-right-from-bracket"></i>
					</div>
				</button>
			</div>
		</div>
	);
}
