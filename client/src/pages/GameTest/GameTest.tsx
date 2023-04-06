import GameRender from "../../components/Game/GameRender";
import styles from "./GameTest.module.scss";

// const speed: number = 0.005;

export default function GameTest() {
	return (
		<div className={`container ${styles.gamePage} d-flex flex-column align-items justify-content`}>
			<div className="title mb-30">Pong <h2 className="underTitle">Game</h2></div>
			<div className={`container ${styles.gameContainer} mb-30`}>
				<GameRender />
			</div>
		</div>
	);
}
