import styles from "./UserStats.module.scss";

export default function UserStats() {
	return (
		<>
			<div
				className={`${styles.statsContainer} d-flex flex-row justify-content-space-between w-100`}
			>
				<div className="flex-1">
					<p className="pl-20 p-5">Wins</p>
					<h2 className="pl-20">12</h2>
				</div>
				<div className="flex-1">
					<p className="pl-20 p-5">Loses</p>
					<h2 className="pl-20">12</h2>
				</div>
				<div className="flex-1">
					<p className="pl-20 p-5">Win Rate</p>
					<h2 className="pl-20">100%</h2>
				</div>
			</div>
			<h1>User Stats</h1>
		</>
	);
}
