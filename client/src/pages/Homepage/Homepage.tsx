import styles from "./Homepage.module.scss";
import { useNavigate } from "react-router-dom";
import FriendsList from "./components/FriendsList";
import { useState } from "react";

export default function Homepage() {
	const navigate = useNavigate();
	const [hover, setHover] = useState<boolean>(false);

	function handlePlay() {
		navigate("/play");
	}

	return (
		<>
			<div className="d-flex flex-column align-items mt-20">
				<div className="title">PONG</div>
				<h2 className="underTitle mb-20">Homepage</h2>
			</div>
			<div className={`${styles.homepageContainer} d-flex flex-row flex-1`}>
				<div className={`${styles.friendsContainer} d-flex flex-column`}>
					<FriendsList />
				</div>
				<div
					className={`${styles.homepageButtonContainer} d-flex flex-column align-items justify-content`}
				>
					<button
						className="btn-primary mb-10 pl-10 pr-10 p-5"
						onClick={handlePlay}
					>
						<i className="fa-solid fa-gamepad"></i>
						Play
					</button>
					<button
						className="btn-primary mb-10 pl-10 pr-10 p-5"
						onClick={handlePlay}
					>
						<i className="fa-sharp fa-solid fa-comments"></i>
						Chat
					</button>
					<button
						className="btn-primary mb-10 pl-10 pr-10 p-5"
						onClick={handlePlay}
						onMouseEnter={() => (setHover(true))}
						onMouseLeave={() => (setHover(false))}
					>
						<i className="fa-solid fa-users"></i>
						{hover && "Users"}
					</button>
				</div>
			</div>
		</>
	);
}
