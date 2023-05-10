import { useEffect, useState } from "react";
import styles from "./Play.module.scss";
// import { Socket, io } from "socket.io-client";
// import { useUser } from "../../context";
import { useGameSocket } from "./context/GameSocketProvider";
import {
	GameStatus,
	alreadyInGame,
	defaultGameStatus,
	gameEnded,
	gameStarted,
	incrementOwnerScore,
	incrementPlayerScore,
	joinedGame,
} from "./types/gameStatus.type";
import { GameUserStatus } from "./enums/UserStatus";
import { useUser } from "../../context";
import Countdown from "./components/Common/Countdown";
import Game from "./components/Common/Game";
import { Default } from "./components/Common/Default";
import Queue from "./components/Common/Queue";

export default function Play() {
	const { user } = useUser();
	const { gameSocket } = useGameSocket();
	const [ballServer, setBallServer] = useState<boolean>(false);
	const [userStatus, setUserStatus] = useState<GameUserStatus>(
		GameUserStatus.notConnected,
	);
	const [gameStatus, setGameStatus] = useState<GameStatus>(defaultGameStatus);

	function joinQueue() {
		if (gameSocket) {
			gameSocket.emit("joinQueue");
			gameSocket.once("queuedStatus", (success: boolean, err: string) => {
				if (success === true) {
					setGameStatus(defaultGameStatus);
					setUserStatus(GameUserStatus.inQueue);
				} else {
					console.log("Queue failed? try again? : err = " + err);
					setUserStatus(GameUserStatus.connected);
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
		setUserStatus(GameUserStatus.connected);
	}

	useEffect(() => {
		switch (userStatus) {
			case GameUserStatus.notConnected:
				gameSocket?.on("connectionStatusError", () =>
					gameSocket?.emit("getConnectionStatus"),
				);
				gameSocket?.once(
					"connectionStatus",
					(
						status: {
							inQueue: boolean;
							inGame: boolean;
						},
						game: {
							room: string;
							ownerId: number;
							playerId: number;
							ownerScore: number;
							playerScore: number;
						},
					) => {
						gameSocket?.removeListener("connectionStatusError");
						if (status.inQueue) {
							setGameStatus(defaultGameStatus);
							setUserStatus(GameUserStatus.inQueue);
						} else if (status.inGame) {
							setGameStatus(
								alreadyInGame(
									gameStatus,
									user,
									game.room,
									game.ownerScore,
									game.playerScore,
									game.ownerId,
									game.playerId,
								),
							);
							setUserStatus(GameUserStatus.inGame);
						} else setUserStatus(GameUserStatus.connected);
					},
				);
				gameSocket?.emit("getConnectionStatus");
				break;
			case GameUserStatus.connected:
			case GameUserStatus.gameWinner:
			case GameUserStatus.gameLoser:
				gameSocket?.once("queuedStatus", (success: boolean, err: string) => {
					if (success === true) {
						setGameStatus(defaultGameStatus);
						setUserStatus(GameUserStatus.inQueue);
					} else {
						console.log("Queue failed? try again? : err = " + err);
						setUserStatus(GameUserStatus.connected);
					}
				});
				break;
			case GameUserStatus.inQueue:
				gameSocket?.once("leftQueue", () => {
					setUserStatus(GameUserStatus.connected);
					gameSocket.removeListener("joinedGame");
				});
				gameSocket?.once(
					"joinedGame",
					(
						room: string,
						ownerId: number,
						playerId: number,
						ownerClient: string,
					) => {
						let ballServer: boolean = ownerClient === gameSocket.id;
						setGameStatus(
							joinedGame(gameStatus, user, room, ownerId, playerId, ballServer),
						);
						setUserStatus(GameUserStatus.waitingGameStart);
						gameSocket.removeListener("leftQueue");
					},
				);
				break;
			case GameUserStatus.waitingGameStart:
				setTimeout(() => {
					setUserStatus(GameUserStatus.inGame);
					setGameStatus(gameStarted(gameStatus));
				}, 3000);
				break;
			case GameUserStatus.inGame:
				gameSocket?.on("scoreUpdate", (ownerScored: boolean) => {
					if (ownerScored) setGameStatus(incrementOwnerScore(gameStatus));
					else setGameStatus(incrementPlayerScore(gameStatus));
				});
				gameSocket?.once("gameEnded", (winner: number) => {
					gameSocket!.off("scoreUpdate");
					let newUserStatus: GameUserStatus;
					user.id === winner
						? (newUserStatus = GameUserStatus.gameWinner)
						: (newUserStatus = GameUserStatus.gameLoser);
					setUserStatus(newUserStatus);
					setGameStatus(gameEnded(gameStatus));
				});
				break;
		}
		return () => {
			gameSocket?.removeAllListeners();
		};
	}, [userStatus, gameSocket, gameStatus, user]);

	return (
		<div
			className={`container ${styles.gamePage} d-flex flex-column align-items justify-content`}
		>
			{userStatus === GameUserStatus.notConnected && <>Connecting...</>}
			{userStatus === GameUserStatus.connected && (
				<Default showUsers={showUsers} joinQueue={joinQueue} />
			)}
			{userStatus === GameUserStatus.inQueue && (
				<Queue gameSocket={gameSocket} setGameUserStatus={setUserStatus} />
			)}
			{userStatus === GameUserStatus.waitingGameStart && <Countdown />}
			{userStatus === GameUserStatus.inGame && (
				<Game
					showGames={showGames}
					gameStatus={gameStatus}
					gameSocket={gameSocket}
				/>
			)}
			{userStatus === GameUserStatus.gameWinner && (
				<div
					className={`${styles.sizeContainer} d-flex flex-column align-items justify-content mb-20`}
				>
					WIN
				</div>
			)}
			{userStatus === GameUserStatus.gameLoser && (
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
							joinQueue();
						}}
					>
						Play again
					</button>
					<button className="btn-primary mb-10" onClick={backToPlay}>
						Go back
					</button>
				</>
			)}
			<button
				className="btn-primary mb-10"
				onClick={() => {
					gameSocket?.emit("showUsers");
				}}
			>
				Show users
			</button>
			<button className="btn-primary mb-10" onClick={showGameStatus}>
				Show game status
			</button>
		</div>
	);
}
