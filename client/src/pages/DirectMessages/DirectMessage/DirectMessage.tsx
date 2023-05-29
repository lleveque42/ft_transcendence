import ChatNav from "../../../components/Chat/ChatNav/ChatNav";
import { useEffect, useRef, useState } from "react";
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
import useAvatar from "../../../hooks/useAvatar";

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
	const messagesListRef = useRef<HTMLDivElement>(null);
	// const [ownerAvatar, setOwnerAvatar] = useState<string>("");
	const [otherAvatar, setOtherAvatar] = useState<string>("");

	// useAvatar(accessToken, setOwnerAvatar, setIsLoading, user.userName);

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		const trimedValue = value.trim();
		if (event.key === "Enter" && trimedValue.length > 0) {
			chatSocket?.emit("chanMessage", { room: id, message: value });
			setValue("");
			const inputValue: HTMLElement | null = document.getElementById("newMsg");
			if (inputValue != null) {
				inputValue.nodeValue = "";
			}
		}
	};

	const messageListener = (msg: MessageModel) => {
		const { id, authorId, author, content } = msg;
		setMessagesState([...messagesState, { id, authorId, author, content }]);
	};

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
							username={author.userName}
							content={content}
						/>
					</li>
				) : (
					<li className="m-5" key={id}>
						<span
							className={` ${styles.blockedMessageContainer} d-flex flex-column flex-begin`}
						>
							<p>Blocked message</p>
							<small>{trimUserName(author.userName)}</small>
						</span>
					</li>
				);
			}),
		);
		if (messagesListRef.current)
			messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight;
	}, [messagesState, user.blockList]);

	useEffect(() => {
		chatSocket?.on("receivedMessage", messageListener);
		socket?.on("userNameUpdatedDm", (userSender: NewUserName) => {
			if (userSender.id === otherUser?.id) setOtherUser(userSender);
		});
		if (messagesListRef.current)
			messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight;
		return () => {
			chatSocket?.off("receivedMessage", messageListener);
			socket?.off("userNameUpdatedDm");
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [messageListener, messagesList, messagesState]);

	useAvatar(accessToken, setOtherAvatar, setIsLoading, otherUser.userName);

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
					<div className={`${styles.title} title mt-20`}>Chat</div>
					<ChatNav />
					<div
						className={`${styles.dmHeader} d-flex flex-row align-items justify-content mt-20`}
					>
						<div className="d-flex align-items justify-content">
							<img
								src={otherAvatar}
								alt="otherAvatar"
								onClick={() => navigate(`/user/${otherUser?.userName}`)}
							/>
							<h2 onClick={() => navigate(`/user/${otherUser?.userName}`)}>
								{trimUserName(otherUser?.userName as string)}
							</h2>
							<small className="ml-5">({messagesList.length})</small>
						</div>
						<button
							onClick={() =>
								socket?.emit("sendGameInvite", {
									sender: user.id,
									invited: otherUser?.id,
								})
							}
							className="btn btn-reverse-play p-5 ml-auto"
						>
							Invite to play
						</button>
					</div>
					<div className={`${styles.messagesList} mb-10`} ref={messagesListRef}>
						{messagesList.length ? (
							<ul className="mt-10">{messagesList}</ul>
						) : (
							<p className="d-flex justify-content mt-20 p-10">
								Start the conversation with {trimUserName(otherUser?.userName)}
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
						onKeyDown={handleKeyDown}
					/>
				</div>
			)}
		</>
	);
}
