import React, { useEffect } from "react";
import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserProvider";
import { usePrivateRouteSocket } from "../../context/PrivateRouteProvider";
import { useAlert } from "../../context/AlertProvider";
import { UserModel } from "../../entities/entities";
import styles from "./DirectMessages.module.scss";

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
	id1: 0,
	id2: 0,
};

export default function NewDM() {
	const { accessToken, user } = useUser();
	const [usersState, setUsersState] = useState<{ id: number; userName: string ; blockList: UserModel[]}[]>([]);
	const [usersList, setUsersList] = useState<JSX.Element[]>([]);
	const socket = usePrivateRouteSocket();
	const { showAlert } = useAlert();
	const navigate = useNavigate();
	const {chatSocket} = usePrivateRouteSocket();

	useEffect(() => {
		(async () => {
			try {
				await fetch(`${process.env.REACT_APP_BACKEND_URL}/channels/users_list/retrieve`, {
					credentials: "include",
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				})
					.then((res) => res.json())
					.then((users) => {
						setUsersState(users);
					});
			} catch (e) {}
		})();
	}, [user.userName, accessToken]);

	async function handleClick(event: React.MouseEvent<HTMLLIElement>) {
		event.preventDefault();
		const target = event.target as HTMLParagraphElement;
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
			const res : Response= await fetch(`${process.env.REACT_APP_BACKEND_URL}/channels/create_join_dm`, {
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
				}
				navigate("/chat/direct_messages");
				return true;
			}
		} catch (e) {
			console.error("Error joining channel");
		}
	}

	const userList = usersState.filter((u) => u.id !== user.id);

	useEffect(() => {
	setUsersList(usersState.map((el) => {
		const match = user.blockList.filter((b) =>{
			return (el.id === b.id);
		} )
		console.log(match.length);
		
		const boolMatch : boolean = match.length > 0 ? true : false;
		return ( !boolMatch ?
			<li key={el.id} id={el.id.toString(10)} onClick={handleClick} >{el.userName}</li>
			:
			<li key={el.id}>
				<span className={"barre"}>	
					{el.userName}
				</span>
			</li>
			)
		}));
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
					{usersList.length !== 0 ?
						<ul>
							{usersList}
						</ul>
					:
						<div>
							There is no private messages avalaible for you
						</div>
					}
				</div>
				</div>
		</div>
	)
}
	{/* return (
		<div className="d-flex flex-column align-items flex-1">
			<div className="title mt-20">New DM</div>
			<ChatNav />
			<div className={`${styles.dmListContainer}`}>
				{userList.length ? (
					<ul>
						{userList.map((u, i) => (
							<p
								key={u.id}
								id={u.id.toString(10)}
								onClick={handleClick}
								className={styles.listElems}
							>
								{u.userName}
							</p>
						))}
					</ul>
				) : (
					<div className="d-flex align-items justify-content m-30">
						There are no new private messages avalaible for you...
					</div>
				)}
			</div>) */}
