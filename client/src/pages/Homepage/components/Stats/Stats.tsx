import { useUser } from "../../../../context";
import styles from "./Stats.module.scss";

export default function Stats() {
	const { user } = useUser();

	return (
		<>
			<h3 className={`underTitle mt-10 mb-10 ${styles.stats}`}>My Stats</h3>
			<div className={`${styles.statsList} d-flex flex-column`}>
				<div>
					<span className={`${styles.wins}`}>Wins :&nbsp;</span>
					<p>{user.wins}</p>
				</div>
				<div>
					<span className={`${styles.defeats}`}>Defeats :&nbsp;</span>
					<p>{user.losses}</p>
				</div>
				<div>
					<span className={`${styles.winRate}`}>Win Rate :&nbsp;</span>
					<p>{(user.wins / (user.wins + user.losses) * 100).toFixed(0) + "%"}</p>
				</div>
			</div>
		</>
	);
}
