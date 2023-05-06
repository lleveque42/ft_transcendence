import React, { useEffect } from "react";

import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserProvider";
import Input from "../../components/Input/Input";


type FormValues = {
	title: string;
	mode: string;
	password: string;
    type: string;
    username: string;
};

const initialFormValues: FormValues = {
    title: "",
	mode: "public",
	password: "",
    type: "",
	username: "",
};


export default function NewDM() {
  
	const { accessToken, user } = useUser();
	
	const [usersState, setUsersState] = useState<{ id: number; userName: string }[]>([]);
	
	
    const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
	const navigate = useNavigate();

	function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target;
		setFormValues({ ...formValues, [name]: value });
	}

	useEffect(() => {
		(async () => {
			try {
				await fetch("http://localhost:3000/channels/users_list/test", {
				// await fetch(`http://localhost:3000/channels/users_list/${user.userName}`, {
					credentials: "include",
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				})
				.then((res) => res.json())
				.then(
				(users) => {
					setUsersState(users);
				}
				);
            } catch (e) {
			}
        })();
    }, [user.userName, accessToken]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
        formValues.username = user.userName;
        formValues.type = "DM";
		formValues.mode = "Public";
		formValues.password = "";
		try {
			const res = await fetch("http://localhost:3000/channels/create_dm", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formValues),
			});
			if (res.status === 201) {
				navigate("/chat/direct_messages");
			} else if (res.ok) {
				navigate(`chat/direct_messages/${user.userName}_{james}`);
            }
		} catch (e) {
			console.error("Error create dm");
		}
	}

	const userList = usersState.map((el) => (
		<li key={el.id}>{el.userName}</li>
		// <option value={el.id}>{el.userName}{el.id}</option>
	));

	// const userOptions = usersState.map((el) => (
	// 	// <li key={el.id}>{el.userName}</li>
	// 	<option value={el.id}>{el.userName}</option>
	// ));
return (
		<div className="container d-flex flex-column justify-content align-items">
			<div className="title">Start a new private chat</div>
			<div>
				<ChatNav/>
				<form
					onSubmit={handleSubmit}
					className="d-flex flex-column align-items justify-content p-20"
				>
				{/* <Input
					icon="fa-solid fa-at"
					type="text"
					name="title"
					placeholder="Username"
					value={formValues.title}
					onChange={handleInputChange}
				/> */}
				<div>
					{/* <input type="text" placeholder="Search users" onChange={handleInputChange} /> */}
					{/* <button onClick={handleSearch}>Search</button> */}
					<ul>
						{userList}
					</ul>
					{/* <label htmlFor="pet-select">Choose a user:</label>
					<select name="pets" id="pet-select">
					<option value="selected" selected>--Please choose an option--</option>
						{userOptions}
					</select> */}
				</div>
				<div
					className={` d-flex flex-row justify-content-space-between mb-30`}
				>
					<button className="btn-primary" type="submit">
						Create
					</button>
				</div>
			</form>
			</div>
		</div>
	);
}