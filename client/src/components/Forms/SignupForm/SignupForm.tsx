import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../Input/Input";
import styles from "./SignupForm.module.scss";
import { signupRequest } from "../../../api";

type FormValues = {
	userName: string;
	email: string;
	password: string;
};

const initialFormValues: FormValues = {
	userName: "",
	email: "",
	password: "",
};

export default function SignupForm() {
	const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
	const navigate = useNavigate();

	function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target;
		setFormValues({ ...formValues, [name]: value });
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		try {
			const res = await signupRequest(formValues);
			if (res.status === 201) {
				navigate("/settings");
			} else if (res.ok) {
				navigate("/");
			} else alert("Email taken");
		} catch (e) {
			console.error("Error Signup");
		}
	}

	return (
		<div className={styles.formContainer}>
			<form
				onSubmit={handleSubmit}
				className="d-flex flex-column align-items justify-content"
			>
				<Input
					icon="fa-solid fa-user"
					type="text"
					name="userName"
					placeholder="Username"
					value={formValues.userName}
					onChange={handleInputChange}
				/>
				<Input
					icon="fa-solid fa-envelope"
					type="email"
					name="email"
					placeholder="Email"
					value={formValues.email}
					onChange={handleInputChange}
				/>
				<Input
					icon="fa-solid fa-lock"
					type="password"
					name="password"
					placeholder="Password"
					value={formValues.password}
					onChange={handleInputChange}
				/>
				<div
					className={`${styles.buttonContainer} d-flex flex-row justify-content-space-between mb-30`}
				>
					<button
						className="btn-reverse-primary"
						type="button"
						onClick={() => {
							navigate("/login");
						}}
					>
						Back to Login
					</button>
					<button className="btn-primary" type="submit">
						Signup
					</button>
				</div>
			</form>
		</div>
	);
}
