import { useParams } from "react-router-dom";
import styles from "./Profile.module.scss";

export default function Profile() {
	const { username } = useParams();

	
	return (
		<>
			<div className="d-flex flex-column mt-20">
				<div className="title">Profile</div>
				<h2 className="underTitle mb-20">{username}</h2>
			</div>
			<div className="d-flex flex-row flex-1">
				<div
					className={`${styles.userPresentationContainer} d-flex flex-column align-items justify-content`}
				>
					<h1>Coucou</h1>
				</div>
				<div
					className={`${styles.userStatsContainer} d-flex flex-column align-items justify-content`}
				>
					<h1>Ca va</h1>
					{/* <img src={} alt="Avatar" /> */}
				</div>
			</div>
		</>
	);
}
