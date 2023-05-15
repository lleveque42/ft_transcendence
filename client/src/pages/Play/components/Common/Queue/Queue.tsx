import { Socket } from "socket.io-client";
import { GameUserStatus } from "../../../enums/UserStatus";

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
			<div className="mb-10">IN QUEUE...</div>
			<button className="btn-primary" onClick={leaveQueue}>
				Leave queue...
			</button>
		</>
	);
}
