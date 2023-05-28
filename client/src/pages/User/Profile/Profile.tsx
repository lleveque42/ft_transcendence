import styles from "./Profile.module.scss";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAlert, useUser } from "../../../context";
import { userAvatarRequest, userProfileInfosRequest } from "../../../api";
import Loader from "react-loaders";
import default_avatar from "../../../assets/images/punk.png";
import UserStats from "./components/UserStats/UserStats";
import UserPresentation from "./components/UserPresentation/UserPresentation";
import {
	NewUserName,
	UserProfileType,
	UserProfileValues,
} from "../../../types";
import { usePrivateRouteSocket } from "../../../context/PrivateRouteProvider";

export default function Profile() {
	const { accessToken, user } = useUser();
	const { socket } = usePrivateRouteSocket();
	const { showAlert } = useAlert();
	const navigate = useNavigate();
	const { username } = useParams();
	const [userProfile, setUserProfile] =
		useState<UserProfileType>(UserProfileValues);
	const [userProfileAvatar, setUserProfileAvatar] = useState<string>("");
	const [isFriend, setIsFriend] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const location = useLocation();

	useEffect(() => {
		const getUserProfile = async () => {
			try {
				const res = await userProfileInfosRequest(accessToken, username);
				if (res.ok) {
					const data = await res.json();
					setUserProfile(data);
					if (user.friends.find((f) => f.userName === data.userName))
						setIsFriend(true);
					else setIsFriend(false);
				} else {
					navigate("/");
					showAlert("error", "User not found.");
				}
			} catch (e) {
				console.error("Error user profile.", e);
			}
		};
		const getUserAvatar = async () => {
			try {
				const res = await userAvatarRequest(accessToken, username as string);
				if (res.ok) {
					if (res.headers.get("content-type") === "application/octet-stream") {
						const data = await res.blob();
						setUserProfileAvatar(URL.createObjectURL(data));
					} else if (res.headers.get("content-type")?.includes("text/html")) {
						const data = await res.text();
						setUserProfileAvatar(data);
					} else setUserProfileAvatar(default_avatar);
				} else {
					console.error("Can't load avatar, default avatar is used.");
					setUserProfileAvatar(default_avatar);
				}
			} catch (e) {
				console.error("Error get User Avatar.", e);
				setUserProfileAvatar(default_avatar);
			}
		};

		if (username) {
			getUserProfile();
			getUserAvatar();
			setIsLoading(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [username, accessToken, user.friends, showAlert, navigate, isFriend]);

	useEffect(() => {
		socket?.on(
			"userNameUpdatedProfile",
			(userSender: NewUserName & { oldUserName: string }) => {
				const pathParts = location.pathname.split("/");
				const currentUsername = pathParts[pathParts.length - 1];
				if (currentUsername === userSender.oldUserName)
					navigate(`/user/${userSender.userName}`);
			},
		);
		return () => {
			socket?.off("userNameUpdatedProfile");
		};
	}, [socket, location, navigate]);

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
					<div className={`${styles.titleContainer} d-flex flex-column mt-20`}>
						<div className="title">Profile</div>
						<h2 className="underTitle">{userProfile.userName}</h2>
					</div>
					<div className={`${styles.profileContainer} d-flex flex-row flex-1`}>
						<div
							className={`${styles.userPresentationContainer} d-flex flex-column align-items`}
						>
							<UserPresentation
								userProfile={userProfile}
								userProfileAvatar={userProfileAvatar}
								isFriend={isFriend}
							/>
						</div>
						<div className={`${styles.userStatsContainer} d-flex flex-column`}>
							<UserStats
								userProfile={userProfile}
								setUserProfile={setUserProfile}
							/>
						</div>
					</div>
				</>
			)}
		</>
	);
}
