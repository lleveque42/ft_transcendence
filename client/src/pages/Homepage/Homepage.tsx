// import styles from "./Homepage.module.scss";

import { usePrivateRouteSocket } from "../../context/PrivateRouteProvider";



export default function Homepage() {
	const { socket } = usePrivateRouteSocket();

	function handleClick() {
		socket!.emit("showUsers");
	}

	return (
		<div className="d-flex flex-column justify-content align-items flex-1">
			<div className="title">PONG</div>
			<h2 className="underTitle mb-20">Homepage</h2>
			<button onClick={handleClick}>Show users</button>
		</div>
	);
}
