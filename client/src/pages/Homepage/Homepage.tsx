import styles from "./Homepage.module.scss";
import { useNavigate } from "react-router-dom";
import FriendsList from "./components/FriendsList/FriendsList";
import Stats from "./components/Stats/Stats";
import { useUser } from "../../context";
import { useEffect } from "react";
import Maps from "./components/Maps/Maps";

export default function Homepage() {
	const navigate = useNavigate();
	const { isAuth } = useUser();

	function handlePlay() {
		navigate("/play");
	}

	useEffect(() => {
		isAuth();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<div
				className={`${styles.homepageContainer} d-flex flex-row justify-content align-items flex-1`}
			>
				<div
					className={`${styles.leftContainer} d-flex flex-column justify-content align-items`}
				>
					<div className={`${styles.friendsContainer} d-flex flex-column`}>
						<FriendsList />
					</div>
				</div>
				<div
					className={`${styles.mainContainer} d-flex flex-column align-items justify-content`}
				>
					<div
						className={`${styles.titleContainer} d-flex flex-column justify-content align-items`}
					>
						<div className="title">PONG</div>
						<div className="underTitle">The game</div>
					</div>
					<div
						className={`${styles.buttonContainer} d-flex flex-column align-items justify-content`}
					>
						<button
							className={`btn-primary pl-10 pr-10 p-5 ${styles.play}`}
							onClick={handlePlay}
						>
							<div className={styles.buttonText}>Play</div>
							<div className={styles.buttonIcon}>
								<i className="fa-solid fa-gamepad"></i>
							</div>
						</button>
						<button
							className={`btn-primary pl-10 pr-10 p-5 ${styles.chat}`}
							onClick={() => navigate("/chat/direct_messages")}
						>
							<div className={styles.buttonText}>Chat</div>
							<div className={styles.buttonIcon}>
								<i className="fa-sharp fa-solid fa-comments"></i>
							</div>
						</button>
						<button
							className={`btn-primary pl-10 pr-10 p-5 ${styles.users}`}
							onClick={() => navigate("/users")}
						>
							<div className={styles.buttonText}>Users</div>
							<div className={styles.buttonIcon}>
								<i className="fa-solid fa-users"></i>
							</div>
						</button>
					</div>
				</div>
				<div
					className={`${styles.rightContainer} d-flex flex-column justify-content align-items`}
				>
					<div className={`${styles.statsContainer} d-flex flex-column mb-20`}>
						<Stats />
					</div>
					<div className={`${styles.mapsContainer} d-flex flex-column`}>
						<Maps />
					</div>
				</div>
			</div>
		</>
	);
}
