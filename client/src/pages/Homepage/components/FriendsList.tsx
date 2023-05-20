import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context";
import styles from "./FriendsList.module.scss";
import { UserStatus } from "../../../types/UserStatus.enum";
import trimUserName from "../../../utils/trimUserName";
import { usePrivateRouteSocket } from "../../../context/PrivateRouteProvider";

export default function FriendsList() {
	const { user } = useUser();
	const { socket } = usePrivateRouteSocket();
	const navigate = useNavigate();

	function sendInvite(invited: number) {
		socket?.emit("sendGameInvite", { sender: user.id, invited });
	}

	return (
		<>
			<h3 className="underTitle mt-10">My Friends</h3>
			<div className={styles.friendsList}>
				{user.friends.length !== 0 ? (
					<>
						<ul className={`pl-5 pr-5`}>
							<li className={`${styles.listElem} d-flex p-5 mb-10`}>
								<span className={`${styles.titleStatusBadge}`} />
								<h4 className="flex-1 pl-5">Login</h4>
								<h4 className="pr-10 pl-5">|</h4>
								<h4 className="d-flex flex-1 justify-content mr-5">Play</h4>
								<h4 className="d-flex flex-1 justify-content">Dm</h4>
							</li>
							{user.friends.map((f, i) => (
								<li className={` ${styles.listElem} d-flex p-5`} key={i}>
									<span
										className={`${styles.statusBadge} ${
											f.status === UserStatus.ONLINE
												? styles.online
												: f.status === UserStatus.INGAME
												? styles.ingame
												: styles.offline
										}`}
									/>
									<p
										className="flex-1 pl-5"
										onClick={() => navigate(`/user/${f.userName}`)}
									>
										{trimUserName(f.userName)}
									</p>
									<p className="pr-10 pl-5">|</p>
									{f.status === UserStatus.ONLINE ? (
										<i
											className={`${styles.gamepad} d-flex flex-1 justify-content fa-solid fa-gamepad mr-5`}
											onClick={() => sendInvite(f.id)}
										/>
									) : (
										<i
											className={`${styles.gamepadDisconnected} d-flex flex-1 justify-content fa-solid fa-gamepad mr-5`}
										/>
									)}
									<i
										className="d-flex flex-1 justify-content fa-solid fa-envelope"
										onClick={() => navigate("/chat")}
									/>
								</li>
							))}
						</ul>
					</>
				) : (
					<h4 className="mt-20 pl-5">No friends :(</h4>
				)}
			</div>
		</>
	);
}
