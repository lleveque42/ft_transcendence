import { useNavigate } from "react-router-dom";
import { useAlert, useUser } from "../../../../../context";
import styles from "./UserPresentation.module.scss";
import { Dispatch, SetStateAction } from "react";

type UserProfileType = {
	userProfile: {
		userName: string;
		firstName: string;
		lastName: string;
		email: string;
	};
	userProfileAvatar: string;
	isFriend: boolean;
	setIsFriend: Dispatch<SetStateAction<boolean>>;
};

const UserPresentation = ({
	userProfile,
	userProfileAvatar,
	isFriend,
	setIsFriend,
}: UserProfileType) => {
	const { accessToken, isAuth } = useUser();
	const { userName, firstName, lastName, email } = userProfile;
	const { showAlert } = useAlert();
	const { user } = useUser();
	const navigate = useNavigate();
	const isOnline = true; // To del

	async function addToFriend() {
		try {
			const res = await fetch("http://localhost:3000/user/friend", {
				credentials: "include",
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username: userName }),
			});
			if (res.ok) {
				showAlert("info", "Added to friends");
				isAuth(); // Not sure
			} else {
				const data = await res.json();
				console.log("Error add to friend: ", data.status);
			}
		} catch (e) {
			console.error("Error add to friend: ", e);
		}
	}

	async function removeFromFriend() {
		try {
			const res = await fetch("http://localhost:3000/user/friend", {
				credentials: "include",
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username: userName }),
			});
			if (res.status === 204) {
				showAlert("warning", "Removed from friends");
				isAuth(); // Not sure
				setIsFriend(false);
			} else {
				const data = await res.json();
				console.log("Error remove from friend: ", data.status);
			}
		} catch (e) {
			console.error("Error remove from friend: ", e);
		}
	}

	return (
		<div className={`${styles.presentationContainer} d-flex flex-column`}>
			<div className={styles.avatarContainer}>
				<img src={userProfileAvatar} alt="" />
				<div
					className={`${styles.statusBadge} ${
						isOnline ? styles.online : styles.offline
					}`}
				></div>
				<div className={`${styles.userInfosTextContainer}`}>
					{firstName !== "" && lastName !== "" && (
						<h1 className="mt-10">
							{firstName} {lastName}
						</h1>
					)}
					<h3>{email}</h3>
				</div>
			</div>
			{user.userName !== userName ? (
				isFriend ? (
					<button
						className="btn btn-reverse-danger p-5 mt-20"
						onClick={removeFromFriend}
					>
						Remove from friends
					</button>
				) : (
					<button
						className="btn btn-reverse-primary p-5 mt-20"
						onClick={addToFriend}
					>
						Add to friends
					</button>
				)
			) : (
				<button
					className="btn btn-reverse-primary p-5 mt-20"
					onClick={() => navigate("/settings")}
				>
					Go to settings
				</button>
			)}
		</div>
	);
};

export default UserPresentation;
