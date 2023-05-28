import { useEffect, useState } from "react";
import Loader from "react-loaders";
import {
	createDmRequest,
	delDmRequest,
	getAllUsersRequest,
	toggleFriendshipRequest,
	usersListDmRequest,
} from "../../api";
import { useAlert, useUser } from "../../context";
import { Friend, NewUserName, UserStatus } from "../../types";
import styles from "./Users.module.scss";
import { useNavigate } from "react-router-dom";
import trimUserName from "../../utils/trimUserName";
import { usePrivateRouteSocket } from "../../context/PrivateRouteProvider";
import { UserModel } from "../../entities/entities";

type UsersList = {
	id: number;
	userName: string;
	isFriend: boolean;
	status: UserStatus | null;
};

export default function Users() {
	const { accessToken, user, isAuth } = useUser();
	const { socket, chatSocket } = usePrivateRouteSocket();
	const { showAlert } = useAlert();
	const navigate = useNavigate();
	// const [invited, setInvited] = useState<boolean>(false);
	const [isLoading, setIsloading] = useState<boolean>(true);
	const [usersList, setUsersList] = useState<UsersList[]>([]);

	function sortUsersList(list: UsersList[]): UsersList[] {
		return list.sort((a: UsersList, b: UsersList) =>
			a.userName.localeCompare(b.userName),
		);
	}

	function updateUserInList(userToUpdate: NewUserName | Friend | UsersList) {
		setUsersList((prevUsersList) => {
			const updatedList = prevUsersList.map((u) => {
				if (u.id === userToUpdate.id) return { ...u, ...userToUpdate };
				return u;
			});
			return sortUsersList(updatedList);
		});
	}

	function updateUsersFriends() {
		setUsersList((prevUsersList) => {
			const updatedList = prevUsersList.map((u) => {
				if (u.isFriend) {
					const friend = user.friends.find((f) => f.id === u.id);
					if (friend)
						return { ...u, status: friend.status, userName: friend.userName };
				}
				return u;
			});
			return sortUsersList(updatedList);
		});
	}

	function updateUsersListFriendship(userId: number, nowFriend: boolean) {
		const userToUpdate = usersList.find((u) => u.id === userId);
		if (!userToUpdate) return;
		userToUpdate.isFriend = nowFriend;
		if (nowFriend) {
			socket?.once("getUserStatus", (status: UserStatus) => {
				userToUpdate.status = status;
				updateUserInList(userToUpdate);
			});
			socket?.emit("askUserStatus", userToUpdate.userName);
		} else {
			userToUpdate.status = null;
			updateUserInList(userToUpdate);
		}
	}

	async function toggleFriendship(
		method: string,
		userName: string,
		userId: number,
	) {
		try {
			const res = await toggleFriendshipRequest(accessToken, userName, method);
			if (method === "DELETE" && res.status === 204) {
				await isAuth();
				updateUsersListFriendship(userId, false);
				showAlert("warning", `${userName} removed from friends.`);
			} else if (res.ok) {
				await isAuth();
				updateUsersListFriendship(userId, true);
				showAlert("info", `${userName} added to friends.`);
			} else showAlert("error", "A problem occured, try again later.");
		} catch (e) {
			console.error("Error remove from friend: ", e);
			showAlert("error", "A problem occured, try again later.");
		}
	}

	function cleanUsersList(data: { id: number; userName: string }[]) {
		const list = data
			.filter((u: { id: number; userName: string }) => u.id !== user.id)
			.map((u: { id: number; userName: string }) => ({
				...u,
				isFriend: user.friends.some((f: Friend) => f.id === u.id),
				status: user.friends.find((f: Friend) => f.id === u.id)?.status || null,
			}));
		setUsersList(sortUsersList(list));
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
			showAlert("error", "An error occured, try again later.");
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
			showAlert("error", `You or ${friendUserName} have blocked each other.`);
		} catch (e) {
			showAlert("error", "An error occured, try again later.");
			console.error(e);
		}
	}

	useEffect(() => {
		async function getAllUsers() {
			const res = await getAllUsersRequest(accessToken);
			if (res.ok) {
				const data = await res.json();
				cleanUsersList(data);
			}
			setIsloading(false);
		}
		getAllUsers();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		updateUsersFriends();
		socket?.on("userNameUpdatedUsersList", (userSender: NewUserName) => {
			updateUserInList(userSender);
		});
		return () => {
			socket?.off("userNameUpdatedUsersList");
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket, user.friends]);

	return (
		<>
			{isLoading ? (
				<Loader
					type="line-scale-pulse-out"
					innerClassName="container d-flex align-items private-loader"
					active
				/>
			) : (
				<>
					<div className="title mt-20 mb-20">Find Friends</div>

					{!usersList.length ? (
						<>
							<h1
								className={`${styles.nobodyTitle} d-flex flex-1 justify-content mt-20`}
							>
								You are alone...
							</h1>
							<Loader
								type="ball-zig-zag"
								innerClassName="nobody-loader"
								active
							/>
						</>
					) : (
						<div
							className={`${styles.listContainer} d-flex flex-1 justify-content mt-30`}
						>
							<ul>
								{usersList.map((u: UsersList, i: number) => (
									<li className="d-flex p-10 ml-5" key={i}>
										<span
											className={`${styles.statusBadge} ${
												u.isFriend
													? u.status === UserStatus.ONLINE
														? styles.online
														: u.status === UserStatus.INGAME
														? styles.ingame
														: styles.offline
													: styles.noStatus
											}`}
										/>
										<h3
											className="flex-1 pl-5"
											onClick={() => navigate(`/user/${u.userName}`)}
										>
											{trimUserName(u.userName)}
										</h3>
										{u.isFriend ? (
											<i
												className={`${styles.minusIcon} fa-solid fa-user-minus`}
												onClick={() =>
													toggleFriendship("DELETE", u.userName, u.id)
												}
											/>
										) : (
											<i
												className={`${styles.plusIcon} fa-solid fa-user-plus`}
												onClick={() =>
													toggleFriendship("PATCH", u.userName, u.id)
												}
											/>
										)}
										{(u.isFriend && u.status === UserStatus.ONLINE) ||
										!u.isFriend ? (
											<i
												className={`${styles.gamepadIcon} fa-solid fa-gamepad ml-20`}
												onClick={() => {
													// if (!invited) {
													socket?.emit("sendGameInvite", {
														sender: user.id,
														invited: u.id,
													});
													// 	setInvited(true);
													// 	setTimeout(() => {
													// 		setInvited(false);
													// 	});
													// } else showAlert("error", "You just invited this user.")
												}}
											/>
										) : (
											<i
												className={`${styles.gamepadDisconnectedIcon} fa-solid fa-gamepad ml-20`}
											/>
										)}
										<i
											className={`${styles.dmIcon} fa-solid fa-envelope ml-20 mr-20`}
											onClick={() => handleDmRedir(u.id, u.userName)}
										/>
									</li>
								))}
							</ul>
						</div>
					)}
				</>
			)}
		</>
	);
}
