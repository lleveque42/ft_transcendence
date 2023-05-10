import { Socket } from "socket.io-client";
import { UserStatus } from "../../enums/UserStatus";

interface QueueProps {
	gameSocket: Socket | null;
	setUserStatus: React.Dispatch<React.SetStateAction<UserStatus>>;
}

export default function Queue({ gameSocket, setUserStatus }: QueueProps) {
	function leaveQueue() {
		gameSocket?.emit("leaveQueue");
		gameSocket?.once("leftQueue", () => {
			setUserStatus(UserStatus.connected);
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
