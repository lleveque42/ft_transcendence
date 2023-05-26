import { Socket } from "socket.io-client";
import { GameSocketContext } from "../../../context/GameSocketProvider";
import { GameStatus } from "../../../types/gameStatus.type";
import OwnerGameRender from "../../OwnerView/OwnerGameRender";
import PlayerGameRender from "../../PlayerView/PlayerGameRender";
import styles from "../../../Play.module.scss";
import { MapStatus } from "../../../enums/MapStatus";

interface GameProps {
	gameStatus: GameStatus;
	gameSocket: Socket | null;
	accelerator: boolean;
	map: MapStatus;
}

export default function Game({
	gameStatus,
	gameSocket,
	accelerator,
	map,
}: GameProps) {
	return (
		<>
			<div
				className={`${styles.sizeContainer} d-flex flex-column align-items justify-content`}
			>
				<div
					className={`${styles.pointContainer} d-flex flex-row align-items justify-content-space-between`}
				>
					<div className={styles.leftPoints}>
						{gameStatus.playerScore} {gameStatus.playerUserName}
					</div>
					<div className={styles.rightPoints}>
						{gameStatus.ownerUserName} {gameStatus.ownerScore}
					</div>
				</div>
				<div className={`${styles.gameContainer}`}>
					{gameStatus.owner ? (
						<GameSocketContext.Provider value={{ gameSocket }}>
							<OwnerGameRender
								room={gameStatus.room}
								accelerator={accelerator}
								map={map}
							/>
						</GameSocketContext.Provider>
					) : (
						<GameSocketContext.Provider value={{ gameSocket }}>
							<PlayerGameRender room={gameStatus.room} map={map} />
						</GameSocketContext.Provider>
					)}
				</div>
			</div>
		</>
	);
}
