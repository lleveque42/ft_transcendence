import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context";
import styles from "./FriendsList.module.scss";
import { UserStatus } from "../../../types/UserStatus.enum";

export default function FriendsList() {
	const { user } = useUser();
	const navigate = useNavigate();

	function trimUserName(userName: string): string {
		let displayUserName: string = userName;
		if (displayUserName.length > 10)
			displayUserName = displayUserName.substring(0, 10) + "...";
		return displayUserName;
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
									<i
										className="d-flex flex-1 justify-content fa-solid fa-gamepad mr-5"
										onClick={() => navigate("/play")}
									/>
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
