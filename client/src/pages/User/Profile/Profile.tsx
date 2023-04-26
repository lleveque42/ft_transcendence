import { useNavigate, useParams } from "react-router-dom";
import styles from "./Profile.module.scss";
import { useEffect, useState } from "react";
import { useAlert, useUser } from "../../../context";
import Loader from "react-loaders";
import useAvatar from "../../../hooks/useAvatar";

export default function Profile() {
	const { accessToken } = useUser();
	const { showAlert } = useAlert();
	const navigate = useNavigate();
	const { username } = useParams();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [userProfile, setUserProfile] = useState<any>(null);
	const [userAvatar, setUserAvatar] = useState<string>("");

	useEffect(() => {
		const getUserProfile = async () => {
			try {
				const res = await fetch(
					`http://localhost:3000/user/infos/${username}`,
					{
						credentials: "include",
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					},
				);
				if (res.ok) {
					console.log("RES OK");
					setUserProfile(username);
				} else {
					navigate("/");
					showAlert("error", "User not found");
				}
			} catch (e) {
				console.error("Error user profile", e);
			}
			setIsLoading(false);
		};
		getUserProfile();
	});

	useAvatar(accessToken, setUserAvatar, setIsLoading, userProfile);

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
						<h2 className="underTitle mb-20">{username}</h2>
					</div>
					<div className="d-flex flex-row flex-1">
						<div
							className={`${styles.userPresentationContainer} d-flex flex-column align-items justify-content`}
						>
							<h1>Coucou</h1>
						</div>
						<div
							className={`${styles.userStatsContainer} d-flex flex-column align-items justify-content`}
						>
							<h1>Ca va</h1>
							{/* <img src={} alt="Avatar" /> */}
						</div>
					</div>
				</>
			)}
		</>
	);
}
