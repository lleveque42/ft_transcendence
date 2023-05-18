import { useEffect, useState } from "react";
import Loader from "react-loaders";
import { getAllUsersRequest, toggleFriendshipRequest } from "../../api";
import { useAlert, useUser } from "../../context";
import { Friend, NewUserName, UserStatus } from "../../types";
import styles from "./Users.module.scss";
import { useNavigate } from "react-router-dom";
import trimUserName from "../../utils/trimUserName";
import { usePrivateRouteSocket } from "../../context/PrivateRouteProvider";

type UsersList = {
	id: number;
	userName: string;
	isFriend: boolean;
	status: UserStatus | null;
};

export default function Users() {
	const { accessToken, user, isAuth } = useUser();
	const { socket } = usePrivateRouteSocket();
	const { showAlert } = useAlert();
	const navigate = useNavigate();
	const [isLoading, setIsloading] = useState<boolean>(true);
	const [usersList, setUsersList] = useState<UsersList[]>([]);

	function sortUsersList(list: UsersList[]) {
		if (list.length > 1) {
			list.sort((a: UsersList, b: UsersList) =>
				a.userName.localeCompare(b.userName),
			);
		}
		return list;
	}

	function updateUserInList(userToUpdate: NewUserName | Friend | UsersList) {
		const userInList = usersList.find((u) => u.id === userToUpdate.id);
		if (!userInList) return;

		const userUpdated: UsersList = { ...userInList, ...userToUpdate };
		const newUsersList = [
			...usersList.filter((u) => u.id !== userInList.id),
			userUpdated,
		];
		setUsersList(sortUsersList(newUsersList));
	}

	function updateUsersFriends() {
		let list: UsersList[] = [];
		list = usersList.map((u) => {
			if (u.isFriend) {
				const friend = user.friends.find((f) => f.id === u.id);
				if (!friend) return;
				u.status = friend.status;
				u.userName = friend.userName;
			}
			return u;
		}) as UsersList[];
		setUsersList(() => sortUsersList(list));
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
				showAlert("warning", "Removed from friends");
			} else if (res.ok) {
				await isAuth();
				updateUsersListFriendship(userId, true);
				showAlert("info", "Added to friends");
			} else showAlert("error", "A problem occured, try again later");
		} catch (e) {
			console.error("Error remove from friend: ", e);
			showAlert("error", "A problem occured, try again later");
		}
	}

	function cleanUsersList(data: { id: number; userName: string }[]) {
		let list: UsersList[] = [];
		list = data
			.filter((u: { id: number; userName: string }) => u.id !== user.id)
			.map((u: { id: number; userName: string }) => {
				const friend: Friend | undefined = user.friends.find(
					(f: Friend) => f.id === u.id,
				);
				const newUser: UsersList = {
					...u,
					isFriend: friend ? true : false,
					status: friend ? friend.status : null,
				};
				return newUser;
			});
		setUsersList(sortUsersList(list));
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
		// return () => {
		// 	socket?.off("userNameUpdatedUsersList");
		// };
	}, [user.friends]);

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
								className={` ${styles.nobodyTitle} d-flex flex-1 justify-content mt-20`}
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
										<i
											className={`${styles.playIcon} fa-solid fa-gamepad ml-20`}
											onClick={() => navigate("/play")}
										/>
										<i
											className={`${styles.dmIcon} fa-solid fa-envelope ml-20 mr-20`}
											onClick={() => navigate("/chat")}
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
