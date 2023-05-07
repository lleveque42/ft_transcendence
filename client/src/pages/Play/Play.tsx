import { useEffect, useState } from "react";
import OwnerGameRender from "./components/OwnerView/OwnerGameRender";
import PlayerGameRender from "./components/PlayerView/PlayerGameRender";
import styles from "./Play.module.scss";
// import { Socket, io } from "socket.io-client";
// import { useUser } from "../../context";
import { useGameSocket } from "./context/GameSocketProvider";
import { GameSocketContext } from "./context/GameSocketProvider";

export default function Play() {
	const [points, setPoints] = useState({ left: 0, right: 0 });
	const [ballStopped, setBallStopped] = useState(true);
	const [inQueue, setInQueue] = useState(false);
	const [inGame, setInGame] = useState(false);
	const [owner, setOwner] = useState(false);
	const [room, setRoom] = useState("");
	const [gameEnded, setGameEnded] = useState(false);
	const [win, setWin] = useState(false);
	const { gameSocket } = useGameSocket();

	function handleClick() {
		setBallStopped(!ballStopped);
	}

	function joinQueue() {
		if (gameSocket) {
			gameSocket.emit("joinQueue");
			gameSocket.once("queuedSuccess", () => {
				setInQueue(true);
			});
			gameSocket.once("queuedFail", () => {
				console.log("QUEUE FAIL");
			});
			gameSocket.once("queuedAlready", () => {
				setInQueue(true);
			});
		}
		// else could not join game/ redirect to login ?
	}

	function showUsers() {
		gameSocket?.emit("showUsers");
	}

	function playAgain() {
		setGameEnded(false);
		setWin(false);
		joinQueue();
	}

	function backToPlay() {
		setGameEnded(false);
		setWin(false);
	}

	useEffect(() => {
		gameSocket?.once("joinedGame", (room: string) => {
			setRoom(room);
			setInGame(true);
			setInQueue(false);
		});
		gameSocket?.once("gameOwner", (bool: boolean) => {
			setOwner(bool);
		});
		if (inGame) {
			gameSocket?.on("playerScored", () => {
				setPoints({ left: points.left + 1, right: points.right });
			});
			gameSocket?.on("ownerScored", () => {
				setPoints({ left: points.left, right: points.right + 1 });
			});
			gameSocket?.once("gameEnded", () => {
				setInGame(false);
				setGameEnded(true);
				setPoints({ left: 0, right: 0 });
				gameSocket?.off("playerScored");
				gameSocket?.off("ownerScored");
			});
			gameSocket?.once("gameWin", () => {
				setWin(true);
			});
		}
		return () => {
			gameSocket?.removeAllListeners();
			// gameSocket?.off("queuedSuccess");
			// gameSocket?.off("queuedFail");
			// gameSocket?.off("queuedAlready");
		};
	});

	return (
		<div
			className={`container ${styles.gamePage} d-flex flex-column align-items justify-content`}
		>
			{!inGame && !gameEnded && (
				<>
					<div className="title">
						Pong <h2 className="underTitle mb-20">Game</h2>
					</div>
					<button className="btn-primary mb-10" onClick={showUsers}>
						Show users
					</button>
					<button className="btn-primary mb-10" onClick={joinQueue}>
						Play
					</button>
				</>
			)}
			{inQueue && (
				<div
					className={`${styles.sizeContainer} d-flex flex-column align-items justify-content mb-20`}
				>
					IN QUEUE
				</div>
			)}
			{inGame && (
				<>
					<div
						className={`${styles.sizeContainer} d-flex flex-column align-items justify-content`}
					>
						<div
							className={`${styles.pointContainer} d-flex flex-row align-items justify-content-space-between`}
						>
							<div className={styles.leftPoints}>{points.left} p</div>
							<div className={styles.rightPoints}>o {points.right}</div>
						</div>
						<div className={`${styles.gameContainer}`}>
							{owner ? (
								<GameSocketContext.Provider value={{ gameSocket }}>
									<OwnerGameRender ballStopped={ballStopped} room={room} />
								</GameSocketContext.Provider>
							) : (
								<GameSocketContext.Provider value={{ gameSocket }}>
									<PlayerGameRender room={room} />
								</GameSocketContext.Provider>
							)}
						</div>
					</div>
					<button className="btn-danger mb-10" onClick={handleClick}>
						{ballStopped ? "Resume" : "Pause"}
					</button>
				</>
			)}
			{gameEnded && win && (
				<div
					className={`${styles.sizeContainer} d-flex flex-column align-items justify-content mb-20`}
				>
					WIN
				</div>
			)}
			{gameEnded && !win && (
				<div
					className={`${styles.sizeContainer} d-flex flex-column align-items justify-content mb-20`}
				>
					LOSE
				</div>
			)}
			{gameEnded && (
				<>
					<button className="btn-primary mb-10" onClick={playAgain}>
						Play again
					</button>
					<button className="btn-primary mb-10" onClick={backToPlay}>
						Go back
					</button>
				</>
			)}
		</div>
	);
}
