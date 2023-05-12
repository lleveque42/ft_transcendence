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
	gamePaused,
	gameStarted,
	gameUnpaused,
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
import { useNavigate } from "react-router-dom";

export default function Play() {
	const { user } = useUser();
	const navigate = useNavigate();
	const { gameSocket } = useGameSocket();
	const [gameUserStatus, setGameUserStatus] = useState<GameUserStatus>(
		GameUserStatus.notConnected,
	);
	const [gameStatus, setGameStatus] = useState<GameStatus>(defaultGameStatus);

	function joinQueue() {
		if (gameSocket) {
			gameSocket.emit("joinQueue");
			gameSocket.once("queuedStatus", (success: boolean, err: string) => {
				if (success === true) {
					setGameStatus(defaultGameStatus);
					setGameUserStatus(GameUserStatus.inQueue);
				} else {
					console.log("Queue failed? try again? : err = " + err);
					setGameUserStatus(GameUserStatus.connected);
				}
			});
		}
		// else could not join game/ redirect to login ?
	}

	function backToPlay() {
		setGameStatus(defaultGameStatus);
		setGameUserStatus(GameUserStatus.connected);
	}

	function notConnected() {
		gameSocket?.on("connectionStatusError", () =>
			gameSocket?.emit("getConnectionStatus"),
		);
		gameSocket?.once(
			"connectionStatus",
			(
				status: { success: boolean; inGame: boolean },
				game: {
					room: string;
					ownerId: number;
					playerId: number;
					ownerScore: number;
					playerScore: number;
				},
			) => {
				gameSocket?.removeListener("connectionStatusError");
				if (!status.success) {
					setGameUserStatus(GameUserStatus.alreadyConnected);
					gameSocket.disconnect();
					setTimeout(() => navigate("/"), 5000);
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
					setGameUserStatus(GameUserStatus.waitingGameRestart);
				} else setGameUserStatus(GameUserStatus.connected);
			},
		);
		gameSocket?.emit("getConnectionStatus");
	}

	function connected() {
		gameSocket?.once("queuedStatus", (success: boolean, err: string) => {
			if (success === true) {
				setGameStatus(defaultGameStatus);
				setGameUserStatus(GameUserStatus.inQueue);
			} else {
				console.log("Queue failed? try again? : err = " + err);
				setGameUserStatus(GameUserStatus.connected);
			}
		});
	}

	function inQueue() {
		gameSocket?.once(
			"joinedGame",
			(room: string, ownerId: number, playerId: number) => {
				setGameStatus(joinedGame(gameStatus, user, room, ownerId, playerId));
				setGameUserStatus(GameUserStatus.waitingGameStart);
				gameSocket.removeListener("leftQueue");
			},
		);
	}

	function waitingToStart() {
		setTimeout(() => {
			setGameUserStatus(GameUserStatus.inGame);
			setGameStatus(gameStarted(gameStatus));
		}, 3000);
	}

	function inGame() {
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
			setGameUserStatus(newUserStatus);
			setGameStatus(gameEnded(gameStatus));
		});
		gameSocket?.once("disconnection", () => {
			gameSocket!.off("scoreUpdate");
			setGameUserStatus(GameUserStatus.waitingOpponentReconnection);
			setGameStatus(gamePaused(gameStatus));
		});
	}

	function waitingOpponentReconnection() {
		gameSocket?.once("reconnection", () => {
			setGameStatus(gameUnpaused(gameStatus));
			setGameUserStatus(GameUserStatus.waitingGameRestart);
		});
		gameSocket?.once("gameEnded", (winner) => {
			let newUserStatus: GameUserStatus;
			user.id === winner
				? (newUserStatus = GameUserStatus.gameWinner)
				: (newUserStatus = GameUserStatus.gameLoser);
			setGameUserStatus(newUserStatus);
			setGameStatus(gameUnpaused(gameStatus));
			setGameStatus(gameEnded(gameStatus));
		});
	}

	useEffect(() => {
		switch (gameUserStatus) {
			case GameUserStatus.notConnected:
				notConnected();
				break;
			case GameUserStatus.connected:
			case GameUserStatus.gameWinner:
			case GameUserStatus.gameLoser:
				connected();
				break;
			case GameUserStatus.inQueue:
				inQueue();
				break;
			case GameUserStatus.waitingGameStart:
			case GameUserStatus.waitingGameRestart:
				waitingToStart();
				break;
			case GameUserStatus.inGame:
				inGame();
				break;
			case GameUserStatus.waitingOpponentReconnection:
				waitingOpponentReconnection();
				break;
		}
		return () => {
			gameSocket?.removeAllListeners();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gameUserStatus, gameSocket, gameStatus, user]);

	return (
		<div
			className={`container ${styles.gamePage} d-flex flex-column align-items justify-content`}
		>
			{gameUserStatus === GameUserStatus.notConnected && <>Connecting...</>}
			{gameUserStatus === GameUserStatus.alreadyConnected && (
				<>
					You are already playing on another device or browser. Please
					disconnect from this other session and try again. You will be
					redirected, please do not refresh.
				</>
			)}
			{gameUserStatus === GameUserStatus.connected && (
				<Default
					showUsers={() => gameSocket?.emit("showUsers")}
					joinQueue={joinQueue}
				/>
			)}
			{gameUserStatus === GameUserStatus.inQueue && (
				<Queue gameSocket={gameSocket} setGameUserStatus={setGameUserStatus} />
			)}
			{gameUserStatus === GameUserStatus.waitingGameStart && (
				<>
					<div>Game starting...</div>
					<Countdown />
				</>
			)}
			{gameUserStatus === GameUserStatus.waitingGameRestart && (
				<>
					<div>Game restarting...</div>
					<Countdown />
				</>
			)}
			{gameUserStatus === GameUserStatus.inGame && (
				<Game
					showGames={() => gameSocket?.emit("showGames")}
					gameStatus={gameStatus}
					gameSocket={gameSocket}
				/>
			)}
			{gameUserStatus === GameUserStatus.waitingOpponentReconnection && (
				<div
					className={`${styles.sizeContainer} d-flex flex-column align-items justify-content mb-20`}
				>
					WAITING FOR OPPONENT RECONNECTION
				</div>
			)}
			{gameUserStatus === GameUserStatus.gameWinner && (
				<div
					className={`${styles.sizeContainer} d-flex flex-column align-items justify-content mb-20`}
				>
					WIN
				</div>
			)}
			{gameUserStatus === GameUserStatus.gameLoser && (
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
			<button
				className="btn-primary mb-10"
				onClick={() => console.log(gameStatus)}
			>
				Show game status
			</button>
		</div>
	);
}
