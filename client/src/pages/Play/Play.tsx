import { useState } from "react";
import OwnerGameRender from "./components/OwnerViewComponents/OwnerGameRender";
import PlayerGameRender from "./components/PlayerViewComponents/PlayerGameRender";
import styles from "./Play.module.scss";
// import { Socket, io } from "socket.io-client";
// import { useUser } from "../../context";
import { useGameSocket } from "./context/GameSocketProvider";
// import { GameSocketContext } from "./context/GameSocketProvider";

export default function GameTest() {
	const [points, setPoints] = useState({ left: 0, right: 0 });
	const [ballStopped, setBallStopped] = useState(true);
	const { gameSocket } = useGameSocket();
	// const { user } = useUser();
	// const [socket, setSocket] = useState<Socket | null>(null);

	const owner: boolean = true;

	function handleClick() {
		setBallStopped(!ballStopped);
	}

	function showUsers() {
		if (gameSocket) gameSocket.emit("showUsers");
	}

	return (
		<div
			className={`container ${styles.gamePage} d-flex flex-column align-items justify-content`}
		>
			<div className="title">
				Pong <h2 className="underTitle">Game</h2>
			</div>
			<div
				className={`${styles.sizeContainer} d-flex flex-column align-items justify-content`}
			>
				<div
					className={`${styles.pointContainer} d-flex flex-row align-items justify-content-space-between`}
				>
					<div className={styles.leftPoints}>{points.left} player1</div>
					<div className={styles.rightPoints}>player2 {points.right}</div>
				</div>
				<div className={`${styles.gameContainer}`}>
					{owner ? (
						<OwnerGameRender
							ballStopped={ballStopped}
							points={points}
							setPoints={setPoints}
						/>
					) : (
						<PlayerGameRender
							ballStopped={ballStopped}
							points={points}
							setPoints={setPoints}
						/>
					)}
				</div>
				<button className="btn-danger mb-10" onClick={handleClick}>
					{ballStopped ? "Resume" : "Pause"}
				</button>
				<button className="btn-primary" onClick={showUsers}>
					Show users
				</button>
			</div>
		</div>
	);
}
