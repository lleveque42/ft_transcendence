import { useNavigate } from "react-router-dom";
import styles from "./UserStats.module.scss";

export default function UserStats() {
	const navigate = useNavigate();

	return (
		<>
			<div className={`${styles.statsContainer} d-flex`}>
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
			<div className={`${styles.listTitle} d-flex w-100`}>
				<p className={`flex-1 pl-20 p-5`}>Opponent</p>
				<p className={`flex-1 pl-20 p-5`}>Result</p>
				<p className={`flex-1 pl-20 p-5`}>Score</p>
			</div>
			<div className={`${styles.listContainer}`}>
				<ul>
					<li className={`${styles.listElem} d-flex p-5`}>
						<p
							className="flex-1 pl-20"
							onClick={() => {
								navigate("/user/arudy");
							}}
						>
							Denis
						</p>
						<p className={`${styles.winColor} flex-1 pl-30`}>Win</p>
						<p className="flex-1 pl-30">10/2</p>
					</li>
					<li className={`${styles.listElem} d-flex p-5`}>
						<p
							className="flex-1 pl-20"
							onClick={() => {
								navigate("/user/arudy");
							}}
						>
							Denis
						</p>
						<p className={`${styles.loseColor} flex-1 pl-30`}>Lose</p>
						<p className="flex-1 pl-30">2/10</p>
					</li>
					<li className={`${styles.listElem} d-flex p-5`}>
						<p
							className="flex-1 pl-20"
							onClick={() => {
								navigate("/user/arudy");
							}}
						>
							Denis
						</p>
						<p className={`${styles.winColor} flex-1 pl-30`}>Win</p>
						<p className="flex-1 pl-30">10/2</p>
					</li>
					<li className={`${styles.listElem} d-flex p-5`}>
						<p
							className="flex-1 pl-20"
							onClick={() => {
								navigate("/user/arudy");
							}}
						>
							Denis
						</p>
						<p className={`${styles.loseColor} flex-1 pl-30`}>Lose</p>
						<p className="flex-1 pl-30">2/10</p>
					</li>
					<li className={`${styles.listElem} d-flex p-5`}>
						<p
							className="flex-1 pl-20"
							onClick={() => {
								navigate("/user/arudy");
							}}
						>
							Denis
						</p>
						<p className={`${styles.winColor} flex-1 pl-30`}>Win</p>
						<p className="flex-1 pl-30">10/2</p>
					</li>
					<li className={`${styles.listElem} d-flex p-5`}>
						<p
							className="flex-1 pl-20"
							onClick={() => {
								navigate("/user/arudy");
							}}
						>
							Denis
						</p>
						<p className={`${styles.loseColor} flex-1 pl-30`}>Lose</p>
						<p className="flex-1 pl-30">2/10</p>
					</li>
					<li className={`${styles.listElem} d-flex p-5`}>
						<p
							className="flex-1 pl-20"
							onClick={() => {
								navigate("/user/arudy");
							}}
						>
							Denis
						</p>
						<p className={`${styles.winColor} flex-1 pl-30`}>Win</p>
						<p className="flex-1 pl-30">10/2</p>
					</li>
					<li className={`${styles.listElem} d-flex p-5`}>
						<p
							className="flex-1 pl-20"
							onClick={() => {
								navigate("/user/arudy");
							}}
						>
							Denis
						</p>
						<p className={`${styles.loseColor} flex-1 pl-30`}>Lose</p>
						<p className="flex-1 pl-30">2/10</p>
					</li>
					<li className={`${styles.listElem} d-flex p-5`}>
						<p
							className="flex-1 pl-20"
							onClick={() => {
								navigate("/user/arudy");
							}}
						>
							Denis
						</p>
						<p className={`${styles.winColor} flex-1 pl-30`}>Win</p>
						<p className="flex-1 pl-30">10/2</p>
					</li>
					<li className={`${styles.listElem} d-flex p-5`}>
						<p
							className="flex-1 pl-20"
							onClick={() => {
								navigate("/user/arudy");
							}}
						>
							Denis
						</p>
						<p className={`${styles.loseColor} flex-1 pl-30`}>Lose</p>
						<p className="flex-1 pl-30">2/10</p>
					</li>
					<li className={`${styles.listElem} d-flex p-5`}>
						<p
							className="flex-1 pl-20"
							onClick={() => {
								navigate("/user/arudy");
							}}
						>
							Denis
						</p>
						<p className={`${styles.winColor} flex-1 pl-30`}>Win</p>
						<p className="flex-1 pl-30">10/2</p>
					</li>
					<li className={`${styles.listElem} d-flex p-5`}>
						<p
							className="flex-1 pl-20"
							onClick={() => {
								navigate("/user/arudy");
							}}
						>
							Denis
						</p>
						<p className={`${styles.loseColor} flex-1 pl-30`}>Lose</p>
						<p className="flex-1 pl-30">2/10</p>
					</li>
					<li className={`${styles.listElem} d-flex p-5`}>
						<p
							className="flex-1 pl-20"
							onClick={() => {
								navigate("/user/arudy");
							}}
						>
							Denis
						</p>
						<p className={`${styles.winColor} flex-1 pl-30`}>Win</p>
						<p className="flex-1 pl-30">10/2</p>
					</li>
					<li className={`${styles.listElem} d-flex p-5`}>
						<p
							className="flex-1 pl-20"
							onClick={() => {
								navigate("/user/arudy");
							}}
						>
							Denis
						</p>
						<p className={`${styles.loseColor} flex-1 pl-30`}>Lose</p>
						<p className="flex-1 pl-30">2/10</p>
					</li>
					<li className={`${styles.listElem} d-flex p-5`}>
						<p
							className="flex-1 pl-20"
							onClick={() => {
								navigate("/user/arudy");
							}}
						>
							Denis
						</p>
						<p className={`${styles.winColor} flex-1 pl-30`}>Win</p>
						<p className="flex-1 pl-30">10/2</p>
					</li>
					<li className={`${styles.listElem} d-flex p-5`}>
						<p
							className="flex-1 pl-20"
							onClick={() => {
								navigate("/user/arudy");
							}}
						>
							Denis
						</p>
						<p className={`${styles.loseColor} flex-1 pl-30`}>Lose</p>
						<p className="flex-1 pl-30">2/10</p>
					</li>
					<li className={`${styles.listElem} d-flex p-5`}>
						<p
							className="flex-1 pl-20"
							onClick={() => {
								navigate("/user/arudy");
							}}
						>
							Denis
						</p>
						<p className={`${styles.winColor} flex-1 pl-30`}>Win</p>
						<p className="flex-1 pl-30">10/2</p>
					</li>
					<li className={`${styles.listElem} d-flex p-5`}>
						<p
							className="flex-1 pl-20"
							onClick={() => {
								navigate("/user/arudy");
							}}
						>
							Denis
						</p>
						<p className={`${styles.loseColor} flex-1 pl-30`}>Lose</p>
						<p className="flex-1 pl-30">2/10</p>
					</li>
				</ul>
			</div>
		</>
	);
}
