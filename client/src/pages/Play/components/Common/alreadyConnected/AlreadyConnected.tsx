import styles from "../../../Play.module.scss";

export default function AlreadyConnected() {
	return (
		<>
			<div className={`${styles.textContainer} underTitle mb-20`}>
				<div className="title">PONG</div>
				<div className="underTitle">Already connected</div>
			</div>
			<div className={`${styles.alertContainer} underTitle mb-30`}>
				You are already playing on another device or browser. <br />
				<br /> Please disconnect from this other session and try again. <br />
				<br /> You will be redirected, please do not refresh. If the problem
				persists, wait 15 seconds.
			</div>
		</>
	);
}
