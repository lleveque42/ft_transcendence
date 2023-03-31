import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./loginForm.scss";

type FormValues = {
	userName: string;
	password: string;
};

const initialFormValues: FormValues = {
	userName: "",
	password: "",
};

export default function LoginForm() {
	const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
	const navigate = useNavigate();

	function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target;
		setFormValues({ ...formValues, [name]: value });
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		try {
			const response = await fetch("http://localhost:3000/auth/login", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formValues),
			});
			if (response.ok) navigate("/");
			else if (response.status === 403) alert("Credentials incorrect");
		} catch (e) {
			console.error("ERROR FETCH");
		}
	}

	return (
		<div>
			<form
				onSubmit={handleSubmit}
				className="d-flex flex-column align-items justify-content"
			>
				<label className="d-flex align-items">
					<i className="fa-solid fa-user"></i>
					<input
						type="text"
						name="userName"
						placeholder="Username..."
						value={formValues.userName}
						onChange={handleInputChange}
					/>
				</label>
				<label className="d-flex align-items">
					<i className="fa-solid fa-lock"></i>
					<input
						type="password"
						name="password"
						placeholder="Password..."
						value={formValues.password}
						onChange={handleInputChange}
					/>
				</label>
				<button className="mb-10 btn-primary" type="submit">
					Submit
				</button>
			</form>
		</div>
	);
}
