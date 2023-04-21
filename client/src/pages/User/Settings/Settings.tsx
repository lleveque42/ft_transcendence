import SettingsForm from "../../../components/Forms/SettingsForm/SettingsForm";
import { useUser } from "../../../context/UserProvider";
import default_avatar from "../../../assets/images/punk.png";
import styles from "./Settings.module.scss";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

export default function Settings() {
	const { user, accessToken } = useUser();
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [userAvatar, setUserAvatar] = useState<string>("");

	function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
		const files = e.target.files;
		if (files && files[0]) setSelectedFile(files[0]);
	}

	async function handleSubmitAvatar(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		console.log(selectedFile);
		if (!selectedFile) return;

		const formData = new FormData();
		formData.append("file", selectedFile);

		try {
			const res = await fetch("http://localhost:3000/user/upload/avatar", {
				method: "PATCH",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				body: formData,
			});
			if (res.ok) {
				console.log("RES OK");
			} else {
				const body = await res.json();
				alert(body.message);
			}
		} catch (e) {
			console.error("Error submit new avatar", e);
		}
	}

	useEffect(() => {
		async function getAvatar() {
			try {
				const res = await fetch("http://localhost:3000/user/avatar", {
					credentials: "include",
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});
				if (res.ok) {
					const data = await res.blob();
					setUserAvatar(URL.createObjectURL(data));
				} else {
					console.error("Can't load avatar, default avatar is used");
					setUserAvatar(default_avatar);
				}
			} catch (e) {
				console.error("Error get User Avatar", e);
			}
		}
		getAvatar();
	}, [accessToken]);

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
