import SettingsForm from "../../../components/Forms/SettingsForm/SettingsForm";
import { useUser } from "../../../context/UserProvider";
import styles from "./Settings.module.scss";
import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAvatar from "../../../hooks/useAvatar";
import { userUploadAvatar } from "../../../api";

export default function Settings() {
	const navigate = useNavigate();
	const { user, accessToken } = useUser();
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [userAvatar, setUserAvatar] = useState<string>("");

	function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
		const files = e.target.files;
		if (files && files[0]) setSelectedFile(files[0]);
	}

	async function handleSubmitAvatar(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!selectedFile) return;
		const formData = new FormData();
		formData.append("file", selectedFile);
		try {
			const res = await userUploadAvatar(accessToken, formData);
			if (res.ok) {
				navigate(0);
			} else {
				const body = await res.json();
				alert(body.message);
			}
		} catch (e) {
			console.error("Error submit new avatar", e);
		}
	}

	useAvatar(accessToken, setUserAvatar);

	return (
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
					<img src={userAvatar} alt="Avatar" />
					<div>
						<form onSubmit={handleSubmitAvatar}>
							<label>
								Select a new pp
								<input type="file" onChange={handleFileSelect} />
							</label>
							<button type="submit" className="d-flex btn btn-primary p-5">
								Send
							</button>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}
