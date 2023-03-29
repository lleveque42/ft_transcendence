import React, { useState } from "react";

type FormValues = {
	username: string;
	email: string;
	password: string;
};

const initialFormValues: FormValues = {
	username: "",
	email: "",
	password: "",
};

export default function Signup() {
	const [formValues, setFormValues] = useState<FormValues>(initialFormValues);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormValues({ ...formValues, [name]: value });
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log(formValues);
		// TODO: Submit form to server
	};

	return (
		<form onSubmit={handleSubmit}>
			<label>
				Username:
				<input
					type="text"
					name="username"
					value={formValues.username}
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
}
