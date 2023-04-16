import { useEffect, useState } from "react";
import SettingsForm from "../../../components/Forms/SettingsForm/SettingsForm";
import { useUser } from "../../../context/UserProvider";
import styles from "./Settings.module.scss";

export default function Settings() {
	const { user } = useUser();
	const [userName, setUserName] = useState(user.userName);

	const handleUserNameChange = (newUserName: string) =>
		setUserName(newUserName);

	useEffect(() => {}, [userName]);

	return (
		<>
			<div className="d-flex flex-column mt-20">
				<div className="title">Settings</div>
				<h2 className="underTitle mb-20">{userName}</h2>
			</div>
			<div className="d-flex flex-row flex-1">
				<div
					className={`${styles.formContainer} d-flex flex-column align-items justify-content`}
				>
					<SettingsForm onUserNameChange={handleUserNameChange} />
				</div>
				<div
					className={`${styles.avatarContainer} d-flex flex-column align-items justify-content`}
				>
					<h1>AVATAR</h1>
				</div>
			</div>
		</>
	);
}
