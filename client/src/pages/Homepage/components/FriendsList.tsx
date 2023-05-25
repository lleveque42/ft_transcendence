import { useNavigate } from "react-router-dom";
import { useAlert, useUser } from "../../../context";
import styles from "./FriendsList.module.scss";
import { UserStatus } from "../../../types/UserStatus.enum";
import trimUserName from "../../../utils/trimUserName";
import { usePrivateRouteSocket } from "../../../context/PrivateRouteProvider";
import {
	createDmRequest,
	delDmRequest,
	usersListDmRequest,
} from "../../../api";
import { UserModel } from "../../../entities/entities";

export default function FriendsList() {
	const { user, accessToken } = useUser();
	const { socket } = usePrivateRouteSocket();
	const { showAlert } = useAlert();
	const navigate = useNavigate();

	function sendGameInvite(invited: number) {
		socket?.emit("sendGameInvite", { sender: user.id, invited });
	}

	async function handleDmRedir(friendId: number, friendUserName: string) {
		const type = "DM";
		const mode = "Public";
		const password = "";
		const title =
			user.id < friendId ? user.id + "_" + friendId : friendId + "_" + user.id;

		try {
			const res = await createDmRequest(accessToken, {
				title,
				mode,
				password,
				type,
				id1: user.id,
				id2: friendId,
			});
			if (res.ok) {
				const data = await res.json();
				if (data === "Duplicate") {
					navigate(`/chat/direct_messages/${title}`);
					return;
				}
				const users = await usersListDmRequest(accessToken);
				if (users.ok) {
					const usersJoinbale: {
						id: number;
						userName: string;
						blockList: UserModel[];
					}[] = await users.json();
					console.log(usersJoinbale);

					if (usersJoinbale.some((u) => u.id === user.id)) {
						navigate(`/chat/direct_messages/${title}`);
						return;
					} else {
						await delDmRequest(title, accessToken);
						showAlert(
							"error",
							`You or ${friendUserName} have blocked each other`,
						);
					}
				}
			}
		} catch (e) {
			console.error(e);
		}
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
											onClick={() => sendGameInvite(f.id)}
										/>
									) : (
										<i
											className={`${styles.gamepadDisconnected} d-flex flex-1 justify-content fa-solid fa-gamepad mr-5`}
										/>
									)}
									<i
										className="d-flex flex-1 justify-content fa-solid fa-envelope"
										onClick={() => handleDmRedir(f.id, f.userName)}
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
