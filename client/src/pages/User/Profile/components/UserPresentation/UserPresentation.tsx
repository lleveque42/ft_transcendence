import { useNavigate } from "react-router-dom";
import { useAlert, useUser } from "../../../../../context";
import styles from "./UserPresentation.module.scss";

type UserProfileType = {
	userProfile: {
		userName: string;
		firstName: string;
		lastName: string;
		email: string;
	};
	userProfileAvatar: string;
};

const UserPresentation = ({
	userProfile,
	userProfileAvatar,
}: UserProfileType) => {
	const { accessToken } = useUser();
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
				body: JSON.stringify({username: userName}),
			});
			if (res.ok) {
				showAlert("info", "Added to friends");
			} else {
				console.log("ERRRRRROOOOOORRRR");
			}
		} catch (e) {
			console.error("Error add to friend: ", e);
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
				<button
					className="btn btn-reverse-primary p-5 mt-20"
					onClick={addToFriend}
				>
					Add to friend
				</button>
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
