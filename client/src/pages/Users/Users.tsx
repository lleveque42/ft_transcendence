import { useEffect, useState } from "react";
import Loader from "react-loaders";
import { getAllUsersRequest, toggleFriendshipRequest } from "../../api";
import { useAlert, useUser } from "../../context";
import { Friend, UserStatus } from "../../types";
import styles from "./Users.module.scss";
import { useNavigate } from "react-router-dom";
import trimUserName from "../../utils/trimUserName";

type UsersList = {
	userName: string;
	isFriend: boolean;
	status: UserStatus | null;
};

export default function Users() {
	const { accessToken, user, isAuth } = useUser();
	const { showAlert } = useAlert();
	const navigate = useNavigate();
	const [isLoading, setIsloading] = useState<boolean>(true);
	const [usersList, setUsersList] = useState<any>([]);

	function cleanUsersList(data: any) {
		let list: UsersList[] = [];
		list = data
			.filter((u: UsersList) => u.userName !== user.userName)
			.map((u: UsersList) => {
				const friend: Friend | undefined = user.friends.find(
					(f: any) => f.userName === u.userName,
				);
				if (friend) {
					u.isFriend = true;
					u.status = friend.status;
				} else {
					u.isFriend = false;
					u.status = null;
				}
				return u;
			});
		setUsersList(list);
	}

	async function toggleFriendship(method: string, userName: string) {
		try {
			const res = await toggleFriendshipRequest(accessToken, userName, method);
			if (method === "DELETE" && res.status === 204) {
				isAuth();
				showAlert("warning", "Removed from friends");
			} else if (res.ok) {
				isAuth();
				showAlert("info", "Added to friends");
			} else showAlert("error", "A problem occured, try again later");
		} catch (e) {
			console.error("Error remove from friend: ", e);
			showAlert("error", "A problem occured, try again later");
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
		// eslint-disable-next-line
	}, [user]);

	// Order by username

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
												u.status
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
												onClick={() => toggleFriendship("DELETE", u.userName)}
											/>
										) : (
											<i
												className={`${styles.plusIcon} fa-solid fa-user-plus`}
												onClick={() => toggleFriendship("PATCH", u.userName)}
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
