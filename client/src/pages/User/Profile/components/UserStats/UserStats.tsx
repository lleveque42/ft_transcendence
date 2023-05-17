import { useNavigate } from "react-router-dom";
import styles from "./UserStats.module.scss";
import { GameInfosType } from "../../../../../types";
import { useEffect, useState } from "react";

type UserStatsProps = {
	userProfile: {
		wins: number;
		losses: number;
		games: GameInfosType[];
	};
};

export default function UserStats({ userProfile }: UserStatsProps) {
	const navigate = useNavigate();
	const { wins, losses, games } = userProfile;
	const [winRate, setWinRate] = useState<number>(0);

	useEffect(() => {
		function calcWinRate() {
			return games.length !== 0 ? Math.round((wins / games.length) * 100) : 0;
		}
		setWinRate(calcWinRate());
	}, [wins, games]);

	return (
		<>
			<div className={`${styles.statsContainer} d-flex`}>
				<div className="flex-1">
					<p className="pl-20 p-5">Wins</p>
					<h2 className="pl-20">{wins}</h2>
				</div>
				<div className="flex-1">
					<p className="pl-20 p-5">Losses</p>
					<h2 className="pl-20">{losses}</h2>
				</div>
				<div className="flex-1">
					<p className="pl-20 p-5">Win Rate</p>
					<h2 className="pl-20">{winRate}%</h2>
				</div>
			</div>
			{games.length ? (
				<>
					<h2 className={`${styles.titleStats} pl-20 p-10`}>Games History</h2>
					<div className={`${styles.listTitle} d-flex w-100`}>
						<p className={`flex-1 pl-20 p-5`}>Opponent</p>
						<p className={`flex-1 pl-20 p-5`}>Result</p>
						<p className={`flex-1 pl-20 p-5`}>Score (me/opp)</p>
					</div>
					<div className={`${styles.listContainer}`}>
						<ul>
							{games.map((game, i) => (
								<li key={i} className={`${styles.listElem} d-flex p-5`}>
									<p
										className="flex-1 pl-20"
										onClick={() => {
											navigate(`/user/${game.opponentUsername}`);
										}}
									>
										{game.opponentUsername}
									</p>
									{game.won ? (
										<p className={`${styles.winColor} flex-1 pl-30`}>Win</p>
									) : (
										<p className={`${styles.loseColor} flex-1 pl-30`}>Lose</p>
									)}
									<p className="flex-1 pl-30">
										{game.ownScore}/{game.playerScore}
									</p>
								</li>
							))}
						</ul>
					</div>
				</>
			) : (
				<h2 className={`${styles.titleStats} pl-20 p-10`}>No games played...</h2>
			)}
		</>
	);
}
