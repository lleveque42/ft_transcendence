import React from "react";

import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import { useEffect, useState } from "react";
import Message from "../../components/Message/Message";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import MessageDisplay from "../../components/Message/MessageDisplay/MessageDisplay";
import { KeyboardEvent } from "react"
import { Socket, io } from "socket.io-client";
import { useUser } from "../../context/UserProvider";
import Input from "../../components/Input/Input";


type FormValues = {
	title: string;
	password: string;
    type: string;
    username: string;
};

const initialFormValues: FormValues = {
    title: "",
	password: "",
    type: "",
	username: "",
};


export default function Newhannel() {
  
	const { accessToken, user } = useUser();
	const [socket, setSocket] = useState<Socket>();
	const [value, setValue] = useState("");
	
    const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
	const navigate = useNavigate();

	function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target;
		setFormValues({ ...formValues, [name]: value });
	}
	
	const { id } = useParams();

	useEffect(() => {
	  const newSocket = io("http://localhost:8001");
	  setSocket(newSocket);
	}, [setSocket])

      async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
        formValues.username = user.userName;
        formValues.type = "Channel";
		try {
			const res = await fetch("http://localhost:3000/channels/create_channel", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formValues),
			});
			if (res.status === 201) {
				navigate("/chat/channels");
			} else if (res.ok) {
				navigate("/chat/channels");
            }
		} catch (e) {
			console.error("Error create channel");
		}
	}

return (
		<div className="container d-flex flex-column justify-content align-items">
			<div className="title">Add a new channel</div>
			<div>
					<ChatNav/>
					<form
				onSubmit={handleSubmit}
				className="d-flex flex-column align-items justify-content p-20"
			>
				<Input
					icon="fa-solid fa-at"
					type="text"
					name="title"
					placeholder="Title"
					value={formValues.title}
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