import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

type FormValues = {
	userName: string;
	password: string;
};

const initialFormValues: FormValues = {
	userName: "",
	password: "",
};

export default function Login() {
	const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
	const [cookie] = useCookies(["_jwt"]);
	const navigate = useNavigate();

	console.log(cookie["_jwt"]);
	useEffect(() => {
		if (cookie["_jwt"]) navigate("/");
	}, []);

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
		<>
			<h1>Login</h1>
			<button
				onClick={() => {
					navigate("/signup");
				}}
			>
				Signup Page
			</button>

			<form onSubmit={handleSubmit}>
				<label>
					Username:
					<input
						type="text"
						name="userName"
						value={formValues.userName}
						onChange={handleInputChange}
					/>
				</label>
				<br />
				<label>
					Password:
					<input
						type="password"
						name="password"
						value={formValues.password}
						onChange={handleInputChange}
					/>
				</label>
				<br />
				<button type="submit">Submit</button>
			</form>
		</>
	);
}
