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
	const { userName, firstName, lastName, email } = userProfile;
	const { showAlert } = useAlert();
	const { user } = useUser();
	const navigate = useNavigate();
	const isOnline = true; // To del

	return (
		<div className={styles.leftSide}>
			<div className={styles.avatarContainer}>
				<img src={userProfileAvatar} alt="" />
				<div
					className={`${styles.statusBadge} ${
						isOnline ? styles.online : styles.offline
					}`}
				></div>
			</div>
			{firstName !== "" && lastName !== "" && (
				<h1 className="mt-10">
					{firstName} {lastName}
				</h1>
			)}
			<h3>{email}</h3>
			{user.userName !== userName ? (
				<button
					className="btn btn-reverse-primary p-5 mt-20"
					onClick={() =>
						showAlert("info", `${userName} is now in your friends list`)
					}
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
