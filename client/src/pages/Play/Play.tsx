import { useEffect, useState } from "react";
import styles from "./Play.module.scss";
// import { Socket, io } from "socket.io-client";
// import { useUser } from "../../context";
import { useGameSocket } from "./context/GameSocketProvider";
import {
	GameStatus,
	defaultGameStatus,
	gameEnded,
	gameStarted,
	incrementOwnerScore,
	incrementPlayerScore,
	joinedGame,
} from "./types/gameStatus.type";
import { UserStatus } from "./enums/UserStatus";
import { useUser } from "../../context";
import Countdown from "./components/Common/Countdown";
import Game from "./components/Common/Game";
import { Default } from "./components/Common/Default";
import Queue from "./components/Common/Queue";

export default function Play() {
	const { user } = useUser();
	const { gameSocket } = useGameSocket();
	// const [connectionStatus, setConnectionStatus] = useState(0); //si inGame ou inqueue à la connexion
	const [userStatus, setUserStatus] = useState<UserStatus>(
		UserStatus.connected,
	);
	const [gameStatus, setGameStatus] = useState<GameStatus>(defaultGameStatus);

	function joinQueue(again: boolean) {
		if (gameSocket) {
			gameSocket.emit("joinQueue");
			gameSocket.once("queuedStatus", (success: boolean, err: string) => {
				if (success === true) {
					setGameStatus(defaultGameStatus);
					setUserStatus(UserStatus.inQueue);
				} else {
					console.log("Queue failed? try again? : err = " + err);
					setUserStatus(UserStatus.connected);
				}
			});
		}
		// else could not join game/ redirect to login ?
	}

	function showUsers() {
		gameSocket?.emit("showUsers");
	}

	function showGames() {
		gameSocket?.emit("showGames");
	}

	function showGameStatus() {
		console.log(gameStatus);
	}

	function backToPlay() {
		setGameStatus(defaultGameStatus);
		setUserStatus(UserStatus.connected);
	}

	useEffect(() => {
		console.log(userStatus);
		gameSocket?.once(
			"joinedGame",
			(room: string, ownerId: number, playerId: number) => {
				setGameStatus(joinedGame(gameStatus, user, room, ownerId, playerId));
				setUserStatus(UserStatus.waitingGameStart);
			},
		);
		if (userStatus === UserStatus.waitingGameStart) {
			setTimeout(() => {
				setUserStatus(UserStatus.inGame);
				setGameStatus(gameStarted(gameStatus));
			}, 3000);
		}
		if (userStatus === UserStatus.inGame) {
			gameSocket?.on("scoreUpdate", (ownerScored: boolean) => {
				if (ownerScored) setGameStatus(incrementOwnerScore(gameStatus));
				else setGameStatus(incrementPlayerScore(gameStatus));
			});
			gameSocket?.once("gameEnded", (winner: number) => {
				gameSocket!.off("scoreUpdate");
				let newUserStatus: UserStatus;
				user.id === winner
					? (newUserStatus = UserStatus.gameWinner)
					: (newUserStatus = UserStatus.gameLoser);
				setUserStatus(newUserStatus);
				setGameStatus(gameEnded(gameStatus));
			});
		}
		return () => {
			gameSocket?.removeAllListeners();
		};
	}, [userStatus, gameSocket, gameStatus, user]);

	return (
		<div
			className={`container ${styles.gamePage} d-flex flex-column align-items justify-content`}
		>
			{userStatus === UserStatus.connected && (
				<Default showUsers={showUsers} joinQueue={joinQueue} />
			)}
			{userStatus === UserStatus.inQueue && (
				<Queue gameSocket={gameSocket} setUserStatus={setUserStatus} />
			)}
			{userStatus === UserStatus.waitingGameStart && <Countdown />}
			{userStatus === UserStatus.inGame && (
				<Game
					showGames={showGames}
					gameStatus={gameStatus}
					gameSocket={gameSocket}
				/>
			)}
			{userStatus === UserStatus.gameWinner && (
				<div
					className={`${styles.sizeContainer} d-flex flex-column align-items justify-content mb-20`}
				>
					WIN
				</div>
			)}
			{userStatus === UserStatus.gameLoser && (
				<div
					className={`${styles.sizeContainer} d-flex flex-column align-items justify-content mb-20`}
				>
					LOSE
				</div>
			)}
			{gameStatus.ended && (
				<>
					<button
						className="btn-primary mb-10"
						onClick={() => {
							joinQueue(true);
						}}
					>
						Play again
					</button>
					<button className="btn-primary mb-10" onClick={backToPlay}>
						Go back
					</button>
				</>
			)}
			<button className="btn-primary mb-10" onClick={showGameStatus}>
				Show game status
			</button>
		</div>
	);
}
