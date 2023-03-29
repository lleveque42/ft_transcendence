// import { FormEvent, useRef } from "react";
import React, { useState } from "react";

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

	function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target;
		setFormValues({ ...formValues, [name]: value });
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		try {
			const response = await fetch("http://localhost:3000/auth/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formValues),
			});
			// console.log(response);
			// const token = await response.json();
			// console.log(token);
			// document.cookie = "jwt=" + token.access_token;
		} catch (e) {
			console.error("ERROR FETCH");
		}

		// TODO: Submit form to server
	}

	return (
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
			<button type="submit">Submit</button>
		</form>
	);

	// const userRef = useRef<HTMLInputElement>();
	// const passwordRef = useRef();
	// const usernameRef = useRef();
	// const firstnameRef = useRef();
	// const lastnameRef = useRef();

	// const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
	// 	e.preventDefault();

	// };

	// return (
	// 	<>
	// 		<h1>Signup</h1>
	// 		<form onSubmit={handleSubmit} className="d-flex flex-column">
	// 			<label htmlFor="userName">Username</label>
	// 			<input ref={userRef} type="text" />

	// 			<label htmlFor="email">Email</label>
	// 			<input type="email" />

	// 			<label htmlFor="password">Password</label>
	// 			<input type="password" />

	// 			<label htmlFor="firstName">First Name</label>
	// 			<input type="text" />

	// 			<label htmlFor="lastName">Last Name</label>
	// 			<input type="text" />

	// 			<button>Submit</button>
	// 		</form>
	// 	</>
	// );
}
