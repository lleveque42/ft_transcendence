import { useEffect } from "react";
import ChatNav from "../../../components/Chat/ChatNav/ChatNav";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserProvider";
import { usePrivateRouteSocket } from "../../../context/PrivateRouteProvider";
import { useAlert } from "../../../context/AlertProvider";
import { UserModel } from "../../../entities/entities";
import { createDmRequest, usersListDmRequest } from "../../../api";
import styles from "./NewDM.module.scss";
import trimUserName from "../../../utils/trimUserName";

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
		{ id: number; userName: string; blockList: UserModel[] }[]
	>([]);
	const [usersList, setUsersList] = useState<JSX.Element[]>([]);
	const socket = usePrivateRouteSocket();
	const { showAlert } = useAlert();
	const navigate = useNavigate();
	const { chatSocket } = usePrivateRouteSocket();

	useEffect(() => {
		(async () => {
			try {
				const res = await usersListDmRequest(accessToken);
				if (res.ok) {
					const data = await res.json();
					setUsersState(data);
				}
			} catch (e) {
				console.error("Error get users list retrieve", e);
				showAlert("error", "An error occured, try again later");
			}
		})();
	}, [user.userName, accessToken, showAlert]);

	async function createDm(userId: number) {
		const formValues: FormValues = initialFormValues;
		formValues.id1 = user.id;
		formValues.id2 = userId;
		if (formValues.id1 < formValues.id2) {
			formValues.title = user.id + "_" + userId;
		} else {
			formValues.title = userId + "_" + user.id;
		}
		formValues.type = "DM";
		formValues.mode = "Public";
		formValues.password = "";
		try {
			const res = await createDmRequest(accessToken, formValues);
			if (res.status === 201 || res.status === 302) {
				showAlert("success", "Enjoy your chat :)");
				socket.chatSocket?.emit("joinDMRoom", {
					room: formValues.title,
					userId2: formValues.id2,
					userId: formValues.id1,
				});
				navigate(`/chat/direct_messages/${formValues.title}`);
			} else showAlert("error", "An error occured, try again later");
		} catch (e) {
			showAlert("error", "An error occured, try again later");
			console.error("Error joining channel");
		}
	}

	useEffect(() => {
		setUsersList(
			usersState.map((el) => {
				return (
					<li className={styles.listElems} key={el.id} id={el.id.toString(10)}>
						<p>{trimUserName(el.userName)}</p>
						<button
							className="btn btn-reverse-primary pl-10 pr-10"
							onClick={() => createDm(el.id)}
						>
							Message
						</button>
					</li>
				);
			}),
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [usersState]);

	useEffect(() => {
		const usersListener = (userId: number) => {
			setUsersState(usersState.filter((usr) => usr.id !== userId));
		};
		chatSocket?.on("userExpel", usersListener);
		return () => {
			chatSocket?.off("userExpel");
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chatSocket, usersState]);

	return (
		<div className="d-flex flex-column align-items flex-1">
			<div className="title mt-20">Talk to someone</div>
			<ChatNav />
			<div className={`${styles.newDmListContainer} d-flex flex-column p-20`}>
				{usersList.length !== 0 ? (
					<ul>{usersList}</ul>
				) : (
					<p className="d-flex flex-column align-items m-10">
						There are no private messages avalaible for you...
					</p>
				)}
			</div>
		</div>
	);
}
