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
			<h2 className={`${styles.titleStats} pl-20 p-10`}>Games History</h2>
			<div
				className={`d-flex flex-row justify-content-space-between w-100`}
			>
				<p className={`${styles.listTitle} flex-1 pl-20 p-5`}>Opponent</p>
				<p className={`${styles.listTitle} flex-1 pl-20 p-5`}>Result</p>
				<p className={`${styles.listTitle} flex-1 pl-20 p-5`}>Score</p>
			</div>
			<div className={`${styles.listContainer} b2`}>
				<ul>
					<li
						className={`${styles.listElem} d-flex flex-row justify-content-space-between ml-20 mr-20 p-5`}
					>
						<p className="flex-1">1</p>
						<p className="flex-1 pl-20">2</p>
						<p className="flex-1 pl-30">3</p>
					</li>
				</ul>
			</div>
		</>
	);
}
