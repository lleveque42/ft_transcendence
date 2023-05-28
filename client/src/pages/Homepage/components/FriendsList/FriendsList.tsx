import { useNavigate } from "react-router-dom";
import { useAlert, useUser } from "../../../../context";
import styles from "./FriendsList.module.scss";
import { UserStatus } from "../../../../types/UserStatus.enum";
import trimUserName from "../../../../utils/trimUserName";
import { usePrivateRouteSocket } from "../../../../context/PrivateRouteProvider";
import {
	createDmRequest,
	delDmRequest,
	usersListDmRequest,
} from "../../../../api";
import { UserModel } from "../../../../entities/entities";

export default function FriendsList() {
	const { user, accessToken } = useUser();
	const { socket, chatSocket } = usePrivateRouteSocket();
	const { showAlert } = useAlert();
	const navigate = useNavigate();

	function sendGameInvite(invited: number) {
		socket?.emit("sendGameInvite", { sender: user.id, invited });
	}

	async function checkJoinbaleUsers(userToDmId: number): Promise<boolean> {
		try {
			const users = await usersListDmRequest(accessToken);
			if (users.ok) {
				const usersJoinable: {
					id: number;
					userName: string;
					blockList: UserModel[];
				}[] = await users.json();
				if (usersJoinable.some((u) => u.id === userToDmId)) return true;
			}
		} catch (e) {
			showAlert("error", "An error occured, try again later");
			console.error(e);
		}
		return false;
	}

	async function handleDmRedir(userToDmId: number, friendUserName: string) {
		const type = "DM";
		const mode = "Public";
		const password = "";
		const title =
			user.id < userToDmId
				? user.id + "_" + userToDmId
				: userToDmId + "_" + user.id;
		const canJoinUser = await checkJoinbaleUsers(userToDmId);
		try {
			const res = await createDmRequest(accessToken, {
				title,
				mode,
				password,
				type,
				id1: user.id,
				id2: userToDmId,
			});
			if (res.status === 302) {
				navigate(`/chat/direct_messages/${title}`);
				return;
			} else if (res.status === 201 && canJoinUser) {
				chatSocket?.emit("joinDMRoom", {
					room: title,
					userId2: userToDmId,
					userId: user.id,
				});
				navigate(`/chat/direct_messages/${title}`);
				return;
			}
			await delDmRequest(title, accessToken);
			showAlert("error", `You or ${friendUserName} have blocked each other`);
		} catch (e) {
			showAlert("error", "An error occured, try again later");
			console.error(e);
		}
	}

	return (
		<>
			<h3 className={`underTitle mt-10 mb-10 ${styles.friends}`}>My Friends</h3>
			<div className={styles.friendsList}>
				{user.friends.length !== 0 ? (
					<>
						<ul className={`pl-5 pr-5 mt-5`}>
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
					<div className="d-flex flex-column align-items justify-content">
						<h4 className={`${styles.noFriends} mt-20 mb-20 pl-5`}>
							No friends :(
						</h4>
						<button
							className={`btn-primary mb-10 pl-10 pr-10 p-5 ${styles.findFriends}`}
							onClick={() => navigate("/users")}
						>
							<i className="fa-solid fa-magnifying-glass"></i> Find friends
						</button>
					</div>
				)}
			</div>
		</>
	);
}
