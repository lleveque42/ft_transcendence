import { Socket } from "socket.io-client";
import { GameSocketContext } from "../../../context/GameSocketProvider";
import { GameStatus } from "../../../types/gameStatus.type";
import OwnerGameRender from "../../OwnerView/OwnerGameRender";
import PlayerGameRender from "../../PlayerView/PlayerGameRender";
import styles from "../../../Play.module.scss";
import { useUser } from "../../../../../context";

interface GameProps {
	showGames: () => void; // tmp
	gameStatus: GameStatus;
	gameSocket: Socket | null;
}

export default function Game({ showGames, gameStatus, gameSocket }: GameProps) {
	const { user } = useUser();

	return (
		<>
			<div
				className={`${styles.sizeContainer} d-flex flex-column align-items justify-content`}
			>
				<div
					className={`${styles.pointContainer} d-flex flex-row align-items justify-content-space-between`}
				>
					<div className={styles.leftPoints}>{gameStatus.playerScore} {gameStatus.owner ? "adversaire" : user.userName}</div>
					<div className={styles.rightPoints}>{gameStatus.owner ? user.userName : "adversaire"} {gameStatus.ownerScore}</div>
				</div>
				<div className={`${styles.gameContainer}`}>
					{gameStatus.owner ? (
						<GameSocketContext.Provider value={{ gameSocket }}>
							<OwnerGameRender
								room={gameStatus.room}
								accelerator={gameStatus.accelerator}
							/>
						</GameSocketContext.Provider>
					) : (
						<GameSocketContext.Provider value={{ gameSocket }}>
							<PlayerGameRender room={gameStatus.room} />
						</GameSocketContext.Provider>
					)}
				</div>
			</div>
			<button className="btn-primary mb-10" onClick={showGames}>
				Show ongoing games
			</button>
		</>
	);
}
