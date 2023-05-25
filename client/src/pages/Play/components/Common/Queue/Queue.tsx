import { Socket } from "socket.io-client";
import { GameUserStatus } from "../../../enums/UserStatus";
import styles from "../../../Play.module.scss";
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
		<>
			<div className="underTitle mb-10">In queue...</div>
			<Loader type="ball-zig-zag" innerClassName="nobody-loader" active />
			<div
				className={`${styles.buttonContainer} d-flex align-items justify-content`}
			>
				<button className="btn-primary" onClick={leaveQueue}>
					Leave queue...
				</button>
			</div>
		</>
	);
}
