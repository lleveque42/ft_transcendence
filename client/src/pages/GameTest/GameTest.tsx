import { useEffect, useState } from "react";
import OwnerGameRender from "../../components/Game/OwnerViewComponents/OwnerGameRender";
import PlayerGameRender from "../../components/Game/PlayerViewComponents/PlayerGameRender";
import styles from "./GameTest.module.scss";
import { Socket, io } from "socket.io-client";
import { useUser } from "../../context";
import { GameSocketContext } from "../../context/GameSocketProvider";

export default function GameTest() {
	const [points, setPoints] = useState({ left: 0, right: 0 });
	const [ballStopped, setBallStopped] = useState(true);
	const { user } = useUser();
	const [socket, setSocket] = useState<Socket | null>(null);

	const owner: boolean = true;

	function handleClick() {
		setBallStopped(!ballStopped);
	}

	const gameSocketValue = { socket };

	return (
		<GameSocketContext.Provider value={gameSocketValue}>
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
					<button className="btn-danger" onClick={handleClick}>
						{ballStopped ? "Resume" : "Pause"}
					</button>
				</div>
			</div>
		</GameSocketContext.Provider>
	);
}
