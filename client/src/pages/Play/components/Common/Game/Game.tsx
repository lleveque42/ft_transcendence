import { Socket } from "socket.io-client";
import { GameSocketContext } from "../../../context/GameSocketProvider";
import { GameStatus } from "../../../types/gameStatus.type";
import OwnerGameRender from "../../OwnerView/OwnerGameRender";
import PlayerGameRender from "../../PlayerView/PlayerGameRender";
import styles from "../../../Play.module.scss";
import styles2 from "./Game.module.scss";
import { MapStatus } from "../../../enums/MapStatus";
import trimUserName from "../../../../../utils/trimUserName";
import { useState } from "react";
import { useUser } from "../../../../../context";
import useAvatar from "../../../../../hooks/useAvatar";

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
	const { user, accessToken } = useUser();
	const [playerAvatar, setPlayerAvatar] = useState<string>("");
	const [ownerAvatar, setOwnerAvatar] = useState<string>("");
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useAvatar(
		accessToken,
		setOwnerAvatar,
		setIsLoading,
		gameStatus.ownerUserName,
	);
	useAvatar(
		accessToken,
		setPlayerAvatar,
		setIsLoading,
		gameStatus.playerUserName,
	);

	return (
		<>
			<div
				className={`${styles.sizeContainer} d-flex flex-column align-items justify-content`}
			>
				<div className={`${styles2.textContainer} underTitle flex-1 mb-20`}>
					<div className="title">PONG</div>
					<div className="underTitle">Game</div>
				</div>
				<div
					className={`${styles.pointContainer} d-flex flex-row align-items justify-content-space-between`}
				>
					<div className={`${styles.points}`}>
						<div
							className={`${styles.playerPoints} d-flex flex-column align-items justify-content`}
						>
							<img src={playerAvatar} alt="playerAvatar" />
							<div>
								{user.userName === gameStatus.playerUserName
									? "You"
									: trimUserName(gameStatus.playerUserName)}
							</div>
						</div>
						<div className={styles.score}>{gameStatus.playerScore}</div>
					</div>
					<div className={styles.delimiter}>:</div>
					<div className={`${styles.points}`}>
						<div className={styles.score}>{gameStatus.ownerScore}</div>
						<div
							className={`${styles.ownerPoints} d-flex flex-column align-items justify-content`}
						>
							<img src={ownerAvatar} alt="ownerAvatar" />
							<div>
								{user.userName === gameStatus.ownerUserName
									? "You"
									: trimUserName(gameStatus.ownerUserName)}
							</div>
						</div>
					</div>
				</div>
				<div className={`${styles.gameContainer} mb-30`}>
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
