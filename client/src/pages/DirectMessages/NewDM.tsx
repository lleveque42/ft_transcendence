import React, { useEffect } from "react";

import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserProvider";


type FormValues = {
	title: string;
	mode: string;
	password: string;
    type: string;
    id1: number;
    id2: number;
};

const initialFormValues: FormValues = {
    title: "",
	mode: "public",
	password: "",
    type: "",
	id1 : 0,
	id2 : 0,
};

export default function NewDM() {
  
	const { accessToken, user } = useUser();
	const [usersState, setUsersState] = useState<{ id: number; userName: string }[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		(async () => {
			try {
				await fetch("http://localhost:3000/channels/users_list/retrieve", {
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

	async function handleClick(event: React.MouseEvent<HTMLLIElement>) {
		event.preventDefault();
		const target = event.target as HTMLLIElement;
		const userName = target.textContent;
		const userId = target.id;
		console.log(userName + " at " + userId);
		let formValues: FormValues = initialFormValues;
		formValues.id1 = user.id;
		formValues.id2 = parseInt(userId);
		formValues.title = user.id  + "_" + userId;
        formValues.type = "DM";
		formValues.mode = "Public";
		formValues.password = "";
		try {
			const res = await fetch("http://localhost:3000/channels/create_join_dm", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formValues),
			});
			if (res.status === 201) {
				navigate("/chat/channels");
				return true;
			} else if (res.ok) {
				navigate("/chat/channels");
				return true;
			}
		} catch (e) {
			console.error("Error joining channel");
		}
	};

	const userList = usersState.map((el) => (
		( (user.id !== el.id) &&
			<li key={el.id} id={el.id.toString(10)} onClick={handleClick} >{el.userName}</li>
		)
	));

	// const userOptions = usersState.map((el) => (
	// 	// <li key={el.id}>{el.userName}</li>
	// 	<option key={el.id} value={el.id}>{el.userName}</option>
	// ));
	
return (
		<div className="container d-flex flex-column justify-content align-items">
			<div className="title">Start a new private chat</div>
			<div>
				<ChatNav/>
				<div className="d-flex flex-column align-items justify-content p-20">
					{/* <input type="text" placeholder="Search users" onChange={handleInputChange} /> */}
					{/* <button onClick={handleSearch}>Search</button> */}
					<ul>
						{userList}
					</ul>
					{/* <label htmlFor="pet-select">Choose a user:</label>
					<select name="pets" id="pet-select">
					<option key="0" value="selected">--Please choose an option--</option>
						{userOptions}
					</select>
				</div>
				<div
					className={` d-flex flex-row justify-content-space-between mb-30`}
				>
					<button className="btn-primary" type="submit">
						Join
					</button> */}
				</div>
			</div>
		</div>
	);
}