import { useState } from "react";
import GameRender from "../../components/Game/GameRender";
import styles from "./GameTest.module.scss";

export default function GameTest() {
	const [points, setPoints] = useState({ left: 0, right: 0 });
	const [ballStopped, setBallStopped] = useState(true);

	function handleClick() {
		setBallStopped(!ballStopped);
	}

	return (
		<div
			className={`container ${styles.gamePage} d-flex flex-column align-items justify-content`}
		>
			<div className="title mb-30">
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
				<div className={`container ${styles.gameContainer} mb-30`}>
					<GameRender
						ballStopped={ballStopped}
						points={points}
						setPoints={setPoints}
					/>
				</div>
			</div>
			<button className="btn-danger" onClick={handleClick}>
				{" "}
				{ballStopped ? "Resume" : "Pause"}
			</button>
		</div>
	);
}
