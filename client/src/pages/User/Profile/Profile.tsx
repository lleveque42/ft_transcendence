import { useNavigate, useParams } from "react-router-dom";
import styles from "./Profile.module.scss";
import { useEffect, useState } from "react";
import { useAlert, useUser } from "../../../context";
import Loader from "react-loaders";
import default_avatar from "../../../assets/images/punk.png";
import { userAvatarRequest, userProfileInfosRequest } from "../../../api";
import UserStats from "./components/UserStats/UserStats";
import UserPresentation from "./components/UserPresentation/UserPresentation";

type UserProfileType = {
	userName: string;
	firstName: string;
	lastName: string;
	email: string;
};

const UserProfileValues: UserProfileType = {
	userName: "",
	firstName: "",
	lastName: "",
	email: "",
};

export default function Profile() {
	const { accessToken } = useUser();
	const { showAlert } = useAlert();
	const navigate = useNavigate();
	const { username } = useParams();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [userProfile, setUserProfile] =
		useState<UserProfileType>(UserProfileValues);
	const [userProfileAvatar, setUserProfileAvatar] = useState<string>("");

	useEffect(() => {
		const getUserProfile = async () => {
			try {
				const res = await userProfileInfosRequest(accessToken, username);
				if (res.ok) {
					const data = await res.json();
					setUserProfile(data);
				} else {
					navigate("/");
					showAlert("error", "User not found");
				}
			} catch (e) {
				console.error("Error user profile", e);
			}
			// setIsLoading(false);
		};
		getUserProfile();
	}, [username, accessToken, showAlert, navigate]);

	useEffect(() => {
		const getUserAvatar = async () => {
			try {
				const res = await userAvatarRequest(accessToken, userProfile.userName);
				if (res.ok) {
					if (res.headers.get("content-type") === "application/octet-stream") {
						const data = await res.blob();
						setUserProfileAvatar(URL.createObjectURL(data));
					} else if (res.headers.get("content-type")?.includes("text/html")) {
						const data = await res.text();
						setUserProfileAvatar(data);
					} else {
						console.log("Can't load avatar, default avatar is used");
						setUserProfileAvatar(default_avatar);
					}
				} else {
					console.error("Can't load avatar, default avatar is used");
					setUserProfileAvatar(default_avatar);
				}
			} catch (e) {
				console.error("Error get User Avatar", e);
			}
			setIsLoading(false);
		};
		if (userProfile.userName) getUserAvatar();
	}, [userProfile, accessToken]);

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
					<div className="d-flex flex-column mt-20">
						<div className="title">Profile</div>
						<h2 className="underTitle">{userProfile.userName}</h2>
					</div>
					<div className="d-flex flex-row flex-1">
						<div
							className={`${styles.userPresentationContainer} d-flex flex-column align-items`}
						>
							<UserPresentation
								userProfile={userProfile}
								userProfileAvatar={userProfileAvatar}
							/>
						</div>
						<div
							className={`${styles.userStatsContainer} d-flex flex-column`}
						>
							<UserStats />
						</div>
					</div>
				</>
			)}
		</>
	);
}
