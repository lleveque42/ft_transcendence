import ChatNav from "../../../components/Chat/ChatNav/ChatNav";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../../context/UserProvider";
import { KeyboardEvent } from "react";
import Message from "../../../components/Message/Message";
import { MessageModel } from "../../../entities/entities";
import { usePrivateRouteSocket } from "../../../context/PrivateRouteProvider";
import { useAlert } from "../../../context/AlertProvider";
import { NewUserName } from "../../../types";
import styles from "./DirectMessage.module.scss";
import trimUserName from "../../../utils/trimUserName";
import Loader from "react-loaders";
import Input from "../../../components/Input/Input";

export default function DirectMessage() {
	const { user, accessToken } = useUser();
	const { socket, chatSocket } = usePrivateRouteSocket();
	const navigate = useNavigate();
	const { showAlert } = useAlert();
	const [value, setValue] = useState("");
	const [messagesState, setMessagesState] = useState<Array<MessageModel>>([]);
	const [messagesList, setMessagesList] = useState<JSX.Element[]>([]);
	const [otherUser, setOtherUser] = useState<{
		id: number;
		userName: string;
	}>({ id: -1, userName: "User" });
	const { id } = useParams();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const res = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/channels/dm/chan/${id}`,
					{
						credentials: "include",
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					},
				);
				if (res.ok) {
					const data: {
						msgs: MessageModel[];
						otherUser: { id: number; userName: string };
					} = await res.json();
					setMessagesState(data.msgs);
					setOtherUser(data.otherUser);
				} else {
					showAlert(
						"error",
						"You tried to enter a dm with no rights to do so. Be careful young entrepeneur!!",
					);
					navigate("/chat/direct_messages/");
				}
			} catch (e) {
				console.error(e);
				navigate("/chat/direct_messages/");
			}
			setIsLoading(false);
		})();
		// eslint-disable-next-line
	}, [accessToken, id, navigate]);

	useEffect(() => {
		setMessagesList(
			messagesState.map(({ id, author, content }) => {
				const match = user.blockList.filter((el) => {
					return el.id === author.id;
				});
				const boolMatch: boolean = match.length > 0 ? true : false;
				return !boolMatch ? (
					<li className="m-5" key={id}>
						<Message
							allMessages={messagesState}
							// removeMessages={setMessagesState}
							username={author.userName}
							content={content}
						/>
					</li>
				) : (
					<li key={id}>Blocked Message from {author.userName}</li>
				);
			}),
		);
	}, [messagesState, user.blockList]);

	const messageListener = (msg: MessageModel) => {
		const { id, authorId, author, content } = msg;
		setMessagesState([...messagesState, { id, authorId, author, content }]);
	};

	useEffect(() => {
		chatSocket?.on("receivedMessage", messageListener);
		socket?.on("userNameUpdatedDm", (userSender: NewUserName) => {
			if (userSender.id === otherUser?.id) setOtherUser(userSender);
		});
		return () => {
			chatSocket?.off("receivedMessage", messageListener);
			socket?.off("userNameUpdatedDm");
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [messageListener, messagesList, messagesState]);

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter" && value !== "") {
			chatSocket?.emit("chanMessage", { room: id, message: value });
			setValue("");
			const inputValue: HTMLElement | null = document.getElementById("newMsg");
			if (inputValue != null) {
				inputValue.nodeValue = "";
			}
		}
	};

	return (
		<>
			{isLoading ? (
				<Loader
					type="line-scale-pulse-out"
					innerClassName="container d-flex align-items"
					active
				/>
			) : (
				<div className={`d-flex flex-column align-items flex-1`}>
					<div className="title mt-20">Chat</div>
					<ChatNav />
					<div className={`${styles.dmHeader} d-flex flex-row mt-30`}>
						<h2
							onClick={() => navigate(`/user/${otherUser?.userName}`)}
							className="d-flex"
						>
							{trimUserName(otherUser?.userName as string)}
						</h2>
						<p className="d-flex ml-5">({messagesList.length})</p>
						<button
							onClick={() =>
								socket?.emit("sendGameInvite", {
									sender: user.id,
									invited: otherUser?.id,
								})
							}
							className="d-flex btn btn-reverse-primary p-5 ml-30"
						>
							Invite to play
						</button>
					</div>
					<div className={styles.messagesList}>
						{messagesState.length ? (
							<ul className="mt-10">{messagesList}</ul>
						) : (
							<p className="mt-20">
								Start the conversation with {otherUser?.userName}
							</p>
						)}
					</div>
					<Input
						icon="fa-brands fa-telegram"
						type="text"
						name="message"
						placeholder="Message"
						value={value}
						onChange={(e: any) => {
							setValue(e.target.value);
						}}
					/>
				</div>
			)}
		</>
	);
}
