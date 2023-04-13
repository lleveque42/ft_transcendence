import styles from "./Homepage.module.scss";

export default function Homepage() {
	return (
		<div className="d-flex flex-column justify-content align-items flex-1">
			<div className="title">PONG</div>
			<h2 className="underTitle mb-20">Homepage</h2>
			<div
				className={`${styles.btnContainer} d-flex justify-content-space-between align-items mb-30`}
			></div>
		</div>
	);
}
