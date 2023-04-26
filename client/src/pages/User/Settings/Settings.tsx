import SettingsForm from "../../../components/Forms/SettingsForm/SettingsForm";
import styles from "./Settings.module.scss";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAvatar from "../../../hooks/useAvatar";
import { userUploadAvatar } from "../../../api";
import Loader from "react-loaders";
import { useAlert, useUser } from "../../../context";

export default function Settings() {
	const navigate = useNavigate();
	const { showAlert } = useAlert();
	const { user, accessToken } = useUser();
	const [userAvatar, setUserAvatar] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(true);

	async function handleSubmitAvatar(e: ChangeEvent<HTMLInputElement>) {
		e.preventDefault();
		const files = e.target.files;
		if (!files || !files[0]) return;

		const formData = new FormData();
		formData.append("file", files[0]);
		try {
			const res = await userUploadAvatar(accessToken, formData);
			if (res.ok) {
				navigate(0);
				showAlert("success", "Avatar updated");
			} else {
				const body = await res.json();
				showAlert("error", body.message);
			}
		} catch (e) {
			console.error("Error submit new avatar", e);
		}
	}

	useAvatar(accessToken, setUserAvatar, setIsLoading, user.userName);

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
						<div className="title">Settings</div>
						<h2 className="underTitle mb-20">{user.userName}</h2>
					</div>
					<div className="d-flex flex-row flex-1">
						<div
							className={`${styles.formContainer} d-flex flex-column align-items justify-content`}
						>
							<SettingsForm />
						</div>
						<div
							className={`${styles.avatarContainer} d-flex flex-column align-items justify-content`}
						>
							<label className={styles.avatarLabel} htmlFor="file">
								<span>Change your profile picture</span>
							</label>
							<input id="file" type="file" onChange={handleSubmitAvatar} />
							<img src={userAvatar} alt="Avatar" />
						</div>
					</div>
				</>
			)}
		</>
	);
}
