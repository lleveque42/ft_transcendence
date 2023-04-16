import { useState } from "react";
import { useUser } from "../../../context/UserProvider";
import Input from "../../Input/Input";
import styles from "./SettingsForm.module.scss";
import { useNavigate } from "react-router-dom";

type ComponentProps = {
	onUserNameChange: (newUsername: string) => void;
};

export default function SettingsForm(props: ComponentProps) {
	const { accessToken, user } = useUser();
	const [newUserName, setNewUserName] = useState<string>(user.userName);
	const navigate = useNavigate();

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		// Need some check of userName bedfore sending req
		if (newUserName === user.userName) return;
		try {
			const res = await fetch("http://localhost:3000/user/settings", {
				method: "PATCH",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ newUserName }),
			});
			if (!res.ok) {
				const data = await res.json();
				alert(data.message);
			} else {
				console.log("OK USERNAME");
				navigate("/settings");
				// props.onUserNameChange(newUserName);
				// setNewUserName(newUserName);
			}
		} catch (e) {
			console.error("Error update userName", e);
		}
	}

	async function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		setNewUserName(e.target.value);
	}
	return (
		<>
			<form
				onSubmit={handleSubmit}
				className={`${styles.settingsForm} d-flex flex-column align-items justify-content}`}
			>
				<Input
					icon="fa-solid fa-user"
					type="text"
					name="userName"
					placeholder="Username"
					value={newUserName}
					onChange={handleInputChange}
				/>
				<Input
					icon="fa-solid fa-envelope"
					type="email"
					name="email"
					placeholder="Email"
					value={user.email}
					onChange={handleInputChange}
				/>
				<Input
					icon="fa-solid fa-user"
					type="text"
					name="firstName"
					placeholder="firstName"
					value={user.firstName ? user.firstName : "Denis"}
					onChange={handleInputChange}
				/>
				<Input
					icon="fa-solid fa-user"
					type="text"
					name="lastName"
					placeholder="lastName"
					value={user.lastName ? user.lastName : "Brognard"}
					onChange={handleInputChange}
				/>
				<div className={"d-flex flex-row justify-content-space-between mt-10"}>
					<button className="btn-primary p-5 m-5" type="submit">
						Update changes
					</button>
					<button className="btn-reverse-primary p-5 m-5" type="button">
						Enable 2FA
					</button>
				</div>
			</form>
		</>
	);
}
