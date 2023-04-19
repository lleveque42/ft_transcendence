import SettingsForm from "../../../components/Forms/SettingsForm/SettingsForm";
import { useUser } from "../../../context/UserProvider";
import default_avatar from "../../../assets/images/punk.png";
import styles from "./Settings.module.scss";

export default function Settings() {
	const { user } = useUser();

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
					<img
						src={
							user.avatar === "" || !user.avatar ? default_avatar : user.avatar
						}
						alt="Avatar"
					/>
				</div>
			</div>
		</>
	);
}
