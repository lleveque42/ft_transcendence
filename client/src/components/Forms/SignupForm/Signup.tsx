import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../Input/Input";
import styles from "./SignupForm.module.scss";

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
			const response = await fetch("http://localhost:3000/auth/signup", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formValues),
			});
			if (response.ok) navigate("/");
			else if (response.status === 403) alert("Credentials taken");
		} catch (e) {
			console.error("ERROR FETCH");
		}
	}

	return (
		<div className={styles.formContainer}>
			<form
				className="d-flex flex-column align-items justify-content"
				onSubmit={handleSubmit}
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
				<button className="btn-primary" type="submit">
					Signup
				</button>
			</form>
		</div>
	);
}
