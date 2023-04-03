import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

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

export default function Signup() {
	const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
	const navigate = useNavigate();
	const [cookie] = useCookies(["_jwt"]);

	console.log("SIGNUP");
	// useEffect(() => {
	// 	if (cookie["_jwt"]) navigate("/");
	// });

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
		<>
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
					Email:
					<input
						type="email"
						name="email"
						value={formValues.email}
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
				<button className="btn btn-primary" type="submit">
					Submit
				</button>
			</form>
			<button
				className="btn btn-primary"
				onClick={() => {
					// removeCookie("_jwt", { path: "/" });
					navigate("/login");
				}}
			>
				Login
			</button>
		</>
	);
}
