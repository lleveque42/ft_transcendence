import React, { useEffect } from "react";
import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserProvider";
import { usePrivateRouteSocket } from "../../context/PrivateRouteProvider";
import { useAlert } from "../../context/AlertProvider";

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
	const [usersList, setUsersList] = useState<JSX.Element[]>([]);
	const socket = usePrivateRouteSocket();
	const { showAlert } = useAlert();
	const navigate = useNavigate();
	const {chatSocket} = usePrivateRouteSocket();

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
		const userId = target.id;
		let formValues: FormValues = initialFormValues;
		formValues.id1 = user.id;
		formValues.id2 = parseInt(userId);
		if (formValues.id1 < formValues.id2){
			formValues.title = user.id  + "_" + userId;
		} else {
			formValues.title = userId  + "_" + user.id;			
		}
        formValues.type = "DM";
		formValues.mode = "Public";
		formValues.password = "";
		try {
			const res : Response= await fetch("http://localhost:3000/channels/create_join_dm", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formValues),
			});
			if (res.status === 201) {
				const body = await res.json();
				if (body != null && body === "Duplicate"){
					showAlert("error", "This conversation already exists");
				}
				else {
					showAlert("success", "A private message connection is established");
					socket.chatSocket?.emit("joinDMRoom",{room: formValues.title, userId2: formValues.id2, userId: formValues.id1});
					//navigate("/chat/channels");
				}
				navigate("/chat/direct_messages");
				return true;
			}
		} catch (e) {
			console.error("Error joining channel");
		}
	};

	useEffect(() => {
	setUsersList(usersState.map((el) => 
				( 
					<li key={el.id} id={el.id.toString(10)} onClick={handleClick} >{el.userName}</li>
				))
		);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [usersState])

	useEffect(() => {
		const usersListener = (userId: number) => {
			setUsersState(usersState.filter(usr => usr.id !== userId));
		}
		chatSocket?.on("userExpel", usersListener);
		return () => {
		  chatSocket?.off("userExpel");
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chatSocket, usersState])
	
return (
		<div className="container d-flex flex-column justify-content align-items">
			<div className="title">Start a new private chat</div>
			<div>
				<ChatNav/>
				<div className="d-flex flex-column align-items justify-content p-20">
					{/* <input type="text" placeholder="Search users" onChange={handleInputChange} /> */}
					{/* <button onClick={handleSearch}>Search</button> */}
					{usersList.length !== 0 ?
						<ul>
							{usersList}
						</ul>
					:
						<div>
							There is no private messages avalaible for you
						</div>
					}
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