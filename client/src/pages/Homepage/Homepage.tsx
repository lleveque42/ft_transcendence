import styles from "./Homepage.module.scss";
import { useNavigate } from "react-router-dom";
import { usePrivateRouteSocket } from "../../context/PrivateRouteProvider";
import FriendsList from "./components/FriendsList";

export default function Homepage() {
	const { socket } = usePrivateRouteSocket();
	const navigate = useNavigate();

	function showUsers() {
		socket!.emit("showUsers");
	}

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
						Play
					</button>
					<button
						className="btn-primary mt-5 mb-10 pl-10 pr-10 p-5"
						onClick={showUsers}
					>
						Show users
					</button>
				</div>
			</div>
		</>
	);
}
