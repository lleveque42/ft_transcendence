import React, { useEffect } from "react";
import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserProvider";
import { usePrivateRouteSocket } from "../../context/PrivateRouteProvider";
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
	const [usersState, setUsersState] = useState<
		{ id: number; userName: string }[]
	>([]);
	const socket = usePrivateRouteSocket();
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
					.then((users) => {
						setUsersState(users);
					});
			} catch (e) {}
		})();
	}, [user.userName, accessToken]);

	async function handleClick(event: React.MouseEvent<HTMLParagraphElement>) {
		event.preventDefault();
		const target = event.target as HTMLParagraphElement;
		const userId = target.id;
		let formValues: FormValues = initialFormValues;
		formValues.id1 = user.id;
		formValues.id2 = parseInt(userId);
		formValues.title = user.id + "_" + userId;
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
			socket.chatSocket?.emit("joinDMRoom", {
				room: formValues.title,
				userId2: formValues.id2,
			});
			if (res.status === 201) {
				navigate("/chat/direct_messages");
				return true;
			} else if (res.ok) {
				navigate("/chat/direct_messages");
				return true;
			}
		} catch (e) {
			console.error("Error joining channel");
		}
	}
	const userList = usersState.filter((u) => u.id !== user.id);

	return (
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
			</div>
		</div>
	);
}
