import { Socket } from "socket.io-client";
import { GameSocketContext } from "../../../context/GameSocketProvider";
import { GameStatus } from "../../../types/gameStatus.type";
import OwnerGameRender from "../../OwnerView/OwnerGameRender";
import PlayerGameRender from "../../PlayerView/PlayerGameRender";
import styles from "../../../Play.module.scss";
import { MapStatus } from "../../../enums/MapStatus";
// import trimUserName from "../../../../../utils/trimUserName";
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
	const { accessToken } = useUser();
	const [playerAvatar, setPlayerAvatar] = useState<string>("");
	const [ownerAvatar, setOwnerAvatar] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useAvatar(accessToken, setOwnerAvatar, setIsLoading, "a");
	useAvatar(accessToken, setPlayerAvatar, setIsLoading, "b");

	return (
		<>
			<div
				className={`${styles.sizeContainer} d-flex flex-column align-items justify-content`}
			>
				<div
					className={`${styles.pointContainer} d-flex flex-row align-items justify-content-space-between`}
				>
					<div className={styles.points}>
						{/* {gameStatus.playerScore} {trimUserName(gameStatus.playerUserName)} */}
						<img src={playerAvatar} alt="Avatar" />
						{gameStatus.playerScore}
						 {/* {trimUserName("lleewvuviuygvquywgduqwygdqwyud")} */}
					</div>
					<div className={styles.points}>
						{/* {trimUserName("cqweiugdqiowydgqowudgqwuoyg")}  */}
						{gameStatus.ownerScore}
						<img src={ownerAvatar} alt="Avatar" />
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
