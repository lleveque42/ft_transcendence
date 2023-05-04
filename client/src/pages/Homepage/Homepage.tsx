// import styles from "./Homepage.module.scss";

import { useNavigate } from "react-router-dom";
import { usePrivateRouteSocket } from "../../context/PrivateRouteProvider";



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
		<div className="d-flex flex-column justify-content align-items flex-1">
			<div className="title">PONG</div>
			<h2 className="underTitle mb-20">Homepage</h2>
			<button className="btn-primary mb-10" onClick={showUsers}>Show users</button>
			<button className="btn-primary mb-10" onClick={handlePlay}>Play</button>
		</div>
	);
}
