import { useEffect, useState } from "react";
import styles from "./Play.module.scss";
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
import { useAlert, useUser } from "../../context";
import Countdown from "./components/Common/Countdown/Countdown";
import Game from "./components/Common/Game/Game";
import { Default } from "./components/Common/Default/Default";
import Queue from "./components/Common/Queue/Queue";
import { useNavigate } from "react-router-dom";
import Options from "./components/Common/Options/Options";
import NotConnected from "./components/Common/NotConnected/NotConnected";
import { MapStatus } from "./enums/MapStatus";
import { usePrivateRouteSocket } from "../../context/PrivateRouteProvider";
import ReadyToStart from "./components/Common/ReadyToStart/ReadyToStart";
import GameCancelled from "./components/Common/GameCancelled/GameCancelled";
import WaitingOpponentReconnection from "./components/Common/WaitingOpponentReconnection/WaitingOpponentReconnection";
import GameWinner from "./components/Common/GameWinner/GameWinner";
import GameLoser from "./components/Common/GameLoser/GameLoser";
import DetectedAfk from "./components/Common/DetectedAfk/DetectedAfk";
import AlreadyConnected from "./components/Common/alreadyConnected/AlreadyConnected";

export default function Play() {
	const { user } = useUser();
	const navigate = useNavigate();
	const { socket } = usePrivateRouteSocket();
	const { showAlert } = useAlert();
	const { gameSocket } = useGameSocket();
	const [mapOption, setMapOption] = useState<MapStatus>(MapStatus.default);
	const [acceleratorOption, setAcceleratorOption] = useState<boolean>(false);
	const [gameUserStatus, setGameUserStatus] = useState<GameUserStatus>(
		GameUserStatus.notConnected,
	);
	const [gameStatus, setGameStatus] = useState<GameStatus>(defaultGameStatus);

	function joinQueue() {
		if (gameSocket) {
			gameSocket.emit("joinQueue");
		}
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
				status: {
					success: boolean;
					inGame: boolean;
					afk?: boolean | false;
					inOption?: boolean | false;
				},
				game: {
					room: string;
					ownerId: number;
					ownerUserName: string;
					playerId: number;
					playerUserName: string;
					ownerScore: number;
					playerScore: number;
					accelerator: boolean;
					map: MapStatus;
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
							game.ownerUserName,
							game.playerId,
							game.playerUserName,
							game.map,
							game.accelerator,
						),
					);
					setAcceleratorOption(game.accelerator);
					setMapOption(game.map);
					setGameUserStatus(GameUserStatus.waitingGameRestart);
				} else if (status.inOption) {
					setGameStatus(
						alreadyInGame(
							gameStatus,
							user,
							game.room,
							game.ownerScore,
							game.playerScore,
							game.ownerId,
							game.ownerUserName,
							game.playerId,
							game.playerUserName,
							game.map,
							game.accelerator,
						),
					);
					setGameUserStatus(GameUserStatus.choosingOptions);
				} else if (status.afk) setGameUserStatus(GameUserStatus.detectedAfk);
				else setGameUserStatus(GameUserStatus.connected);
				if (status.inGame || status.inOption)
					socket?.emit("userStatusInGame", {
						ownerId: game.ownerId,
						playerId: game.playerId,
						inGame: true,
					});
				gameSocket?.off("privateGameDisconnection");
			},
		);
		gameSocket?.once("privateGameDisconnection", () => {
			setGameUserStatus(GameUserStatus.gameCancelled);
		});
		gameSocket?.emit("getConnectionStatus");
	}

	function connected() {
		gameSocket?.once("queuedStatus", (success: boolean, err: string) => {
			if (success === true) {
				setGameStatus(defaultGameStatus);
				setGameUserStatus(GameUserStatus.inQueue);
			} else {
				showAlert("error", "Could not join queue, try again.");
				setGameUserStatus(GameUserStatus.connected);
			}
		});
	}

	function inQueue() {
		gameSocket?.once(
			"joinedGame",
			(
				room: string,
				ownerId: number,
				ownerUserName: string,
				playerId: number,
				playerUserName: string,
			) => {
				setGameStatus(
					joinedGame(
						gameStatus,
						user,
						room,
						ownerId,
						ownerUserName,
						playerId,
						playerUserName,
					),
				);
				setGameUserStatus(GameUserStatus.choosingOptions);
				gameSocket.removeListener("leftQueue");
				if (ownerId === user.id) {
					socket?.emit("userStatusInGame", {
						ownerId,
						playerId,
						inGame: true,
					});
				}
			},
		);
	}

	function choosingOptions() {
		gameSocket?.once("gameCancelled", () => {
			setGameUserStatus(GameUserStatus.gameCancelled);
			setGameStatus(gameEnded(gameStatus));
			socket?.emit("userStatusInGame", {
				ownerId: gameStatus.ownerId,
				playerId: gameStatus.playerId,
				inGame: false,
			});
		});
	}

	function readyToStart() {
		gameSocket?.off("gameCancelled");
		gameSocket?.once(
			"bothPlayersReady",
			(accelerator: boolean, map: number) => {
				setAcceleratorOption(accelerator);
				setMapOption(map);
				setGameUserStatus(GameUserStatus.waitingGameStart);
				gameSocket!.off("gameCancelled");
			},
		);
		gameSocket?.once("gameCancelled", () => {
			setGameUserStatus(GameUserStatus.gameCancelled);
			setGameStatus(gameEnded(gameStatus));
			socket?.emit("userStatusInGame", {
				ownerId: gameStatus.ownerId,
				playerId: gameStatus.playerId,
				inGame: false,
			});
			gameSocket!.off("bothPlayersReady");
		});
	}

	function waitingToStart() {
		let opponentDisconnected = false;
		setTimeout(() => {
			if (!opponentDisconnected) {
				gameSocket!.off("disconnection");
				setGameUserStatus(GameUserStatus.inGame);
				setGameStatus(gameStarted(gameStatus));
			}
		}, 3000);
		gameSocket?.once("disconnection", () => {
			setGameUserStatus(GameUserStatus.waitingOpponentReconnection);
			setGameStatus(gamePaused(gameStatus));
			opponentDisconnected = true;
		});
	}

	function inGame() {
		gameSocket?.on("scoreUpdate", (ownerScored: boolean) => {
			if (ownerScored) setGameStatus(incrementOwnerScore(gameStatus));
			else setGameStatus(incrementPlayerScore(gameStatus));
		});
		gameSocket?.once("gameEnded", (winner: number) => {
			gameSocket!.off("scoreUpdate");
			gameSocket!.off("disconnection");
			let newUserStatus: GameUserStatus;
			user.id === winner
				? (newUserStatus = GameUserStatus.gameWinner)
				: (newUserStatus = GameUserStatus.gameLoser);
			setGameUserStatus(newUserStatus);
			setGameStatus(gameEnded(gameStatus));
			if (gameStatus.ownerId === user.id) {
				socket?.emit("userStatusInGame", {
					ownerId: gameStatus.ownerId,
					playerId: gameStatus.playerId,
					inGame: false,
				});
			}
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
			gameSocket!.off("gameEnded");
		});
		gameSocket?.once("gameEnded", (winner) => {
			let newUserStatus: GameUserStatus;
			user.id === winner
				? (newUserStatus = GameUserStatus.gameWinner)
				: (newUserStatus = GameUserStatus.gameLoser);
			setGameUserStatus(newUserStatus);
			setGameStatus(gameUnpaused(gameStatus));
			setGameStatus(gameEnded(gameStatus));
			socket?.emit("userStatusInGame", {
				ownerId: gameStatus.ownerId,
				playerId: gameStatus.playerId,
				inGame: false,
			});
			gameSocket!.off("reconnection");
		});
	}

	function handleVisibilityChange() {
		if (document.visibilityState === "hidden") navigate("/playMinimized");
	}

	useEffect(() => {
		document.addEventListener("visibilitychange", handleVisibilityChange);
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
			case GameUserStatus.choosingOptions:
				choosingOptions();
				break;
			case GameUserStatus.readyToStart:
				readyToStart();
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
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			gameSocket?.removeAllListeners();
			if (gameUserStatus === GameUserStatus.waitingOpponentReconnection) {
				socket?.emit("userStatusInGame", {
					ownerId: gameStatus.ownerId,
					playerId: gameStatus.playerId,
					inGame: false,
				});
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gameUserStatus, gameSocket, gameStatus, user]);

	return (
		<div
			className={`${styles.gamePage} d-flex flex-column align-items justify-content`}
		>
			{gameUserStatus === GameUserStatus.notConnected && <NotConnected />}
			{gameUserStatus === GameUserStatus.alreadyConnected && (
				<AlreadyConnected />
			)}
			{gameUserStatus === GameUserStatus.connected && (
				<Default joinQueue={joinQueue} />
			)}
			{gameUserStatus === GameUserStatus.inQueue && (
				<Queue gameSocket={gameSocket} setGameUserStatus={setGameUserStatus} />
			)}
			{gameUserStatus === GameUserStatus.choosingOptions && (
				<Options
					gameSocket={gameSocket}
					setGameUserStatus={setGameUserStatus}
					setAcceleratorOption={setAcceleratorOption}
					setMapOption={setMapOption}
				/>
			)}
			{gameUserStatus === GameUserStatus.readyToStart && <ReadyToStart />}
			{gameUserStatus === GameUserStatus.gameCancelled && <GameCancelled />}
			{gameUserStatus === GameUserStatus.waitingGameStart && <Countdown />}
			{gameUserStatus === GameUserStatus.waitingGameRestart && <Countdown />}
			{gameUserStatus === GameUserStatus.inGame && (
				<Game
					gameStatus={gameStatus}
					gameSocket={gameSocket}
					accelerator={acceleratorOption}
					map={mapOption}
				/>
			)}
			{gameUserStatus === GameUserStatus.waitingOpponentReconnection && (
				<WaitingOpponentReconnection />
			)}
			{gameUserStatus === GameUserStatus.gameWinner && <GameWinner />}
			{gameUserStatus === GameUserStatus.gameLoser && <GameLoser />}
			{gameUserStatus === GameUserStatus.detectedAfk && <DetectedAfk />}
			{(gameUserStatus === GameUserStatus.gameCancelled ||
				gameStatus.ended) && (
				<div
					className={`${styles.buttonContainer} d-flex flex-row justify-content-space-between align-items`}
				>
					<button
						className="btn-primary d-flex flex-column align-items justify-content pl-10 pr-10 p-5 mb-50"
						onClick={() => {
							joinQueue();
						}}
					>
						<div className={styles.buttonText}>Play again</div>
						<div className={styles.buttonIcon}>
							<i className="fa-solid fa-gamepad"></i>
						</div>
					</button>
					<button
						className="btn-primary d-flex flex-column align-items justify-content pl-10 pr-10 p-5 mb-50"
						onClick={backToPlay}
					>
						<div className={styles.buttonText}>Go back</div>
						<div className={styles.buttonIcon}>
							<i className="fa-solid fa-backward"></i>
						</div>
					</button>
				</div>
			)}
		</div>
	);
}
