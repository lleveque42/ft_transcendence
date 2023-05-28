import styles from "./Default.module.scss";

interface DefaultProps {
	joinQueue: () => void;
}

export function Default({ joinQueue }: DefaultProps) {
	return (
		<>
			<div className="title">
				PONG
				<h2 className={`${styles.underTitleGame} underTitle mb-20`}>Game</h2>
			</div>
			<div className={`${styles.buttonContainer} mb-50`}>
				<button
					className="btn-primary d-flex flex-column align-items justify-content pl-10 pr-10 p-5"
					onClick={joinQueue}
				>
					<div className={styles.buttonText}>Find game</div>
					<div className={styles.buttonIcon}>
						<i className="fa-solid fa-gamepad"></i>
					</div>
				</button>
			</div>
		</>
	);
}
