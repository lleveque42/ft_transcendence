import ChatNav from "../../../components/Chat/ChatNav/ChatNav";
import Message from "../../../components/Message/Message";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../../context/UserProvider";
import { KeyboardEvent } from "react";
import {
	ChannelModel,
	MessageModel,
	UserModel,
} from "../../../entities/entities";
import { usePrivateRouteSocket } from "../../../context/PrivateRouteProvider";
import { useAlert } from "../../../context/AlertProvider";
import { isAfter } from "date-fns";
import styles from "./Channel.module.scss";
import Input from "../../../components/Input/Input";
import trimUserName from "../../../utils/trimUserName";

export default function Channel() {
	const { user, isAuth, accessToken } = useUser();
	const { chatSocket, socket } = usePrivateRouteSocket();
	const { id } = useParams();
	const { showAlert } = useAlert();
	const [value, setValue] = useState("");
	const [messagesState, setMessagesState] = useState<Array<MessageModel>>([]);
	const [authenticate, setAuthenticate] = useState(false);
	const [inviteState, setInviteState] = useState<Array<UserModel>>([]);
	const [messagesList, setMessagesList] = useState<JSX.Element[]>([]);
	const [chanInfo, setChanInfo] = useState<ChannelModel>();
	const [currentUserName, setCurrentUserName] = useState("");
	const [currentUserId, setCurrentUserId] = useState(0);
	// const [currentUserAdmin, setCurrentUserAdmin] = useState(false);
	const [currentUserBlocked, setCurrentUserBlocked] = useState(false);
	const [isOp, setOp] = useState(false);
	const [currentTime, setCurrentTime] = useState(new Date());
	const navigate = useNavigate();
	const messagesListRef = useRef<HTMLDivElement>(null);
	const [modalInvite, setModalInvite] = useState<boolean>(false);
	const [manageUserModal, setManageUserModal] = useState<boolean>(false);

	useEffect(() => {
		(async () => {
			try {
				await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/channels/chan/${id}`,
					{
						credentials: "include",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${accessToken}`,
						},
					},
				)
					.then((res) => res.json())
					.then((messages) => {
						setMessagesState(messages);
					});
				await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/channels/edit/${id}`,
					{
						credentials: "include",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${accessToken}`,
						},
					},
				)
					.then((res) => res.json())
					.then((chan) => {
						setChanInfo(chan);
					});
			} catch (e) {
				showAlert(
					"error",
					"You tried to enter a channel with no rights to do so. Be careful young entrepeneur!!",
				);
				navigate("/chat/channels/");
			}
		})();
	}, [accessToken, id, showAlert, navigate]);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);
		return () => {
			clearInterval(timer);
		};
	}, []);

	function handleMsgClick(userName: string, userId: number) {
		if (userName === user.userName) return;
		setCurrentUserName(userName);
		setCurrentUserId(userId);
		chanInfo?.operators.forEach((op) => {
			if (op.id === userId) {
				// setCurrentUserAdmin(true);
			}
		});
		if (user.blockList.some((el) => el.userName === userName)) {
			setCurrentUserBlocked(true);
		} else {
			setCurrentUserBlocked(false);
		}
		setManageUserModal(!manageUserModal);
	}

	useEffect(() => {
		setMessagesList(
			messagesState.map(({ id, author, content }) => {
				const match = user.blockList.filter((el) => {
					return el.id === author.id;
				});
				const boolMatch: boolean = match.length > 0 ? true : false;
				return !boolMatch ? (
					<li
						className="m-5"
						key={id}
						onClick={() => handleMsgClick(author.userName, author.id)}
					>
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
							<p>blocked message</p>
							<small>{trimUserName(author.userName)}</small>
						</span>
					</li>
				);
			}),
		);
		if (messagesListRef.current)
			messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [messagesState]);

	useEffect(() => {
		chanInfo?.operators.map((op) => {
			if (op.id === user.id) {
				setOp(true);
			}
			return "";
		});
	}, [chanInfo?.operators, isOp, user.id]);

	useEffect(() => {
		const messageListener = (msg: MessageModel) => {
			const { id, authorId, author, content } = msg;
			setMessagesState([...messagesState, { id, authorId, author, content }]);
		};
		chatSocket?.on("receivedMessage", messageListener);
		if (messagesListRef.current)
			messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight;
		return () => {
			chatSocket?.off("receivedMessage", messageListener);
		};
	}, [messagesList, messagesState, chatSocket]);

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter" && value !== "") {
			const data = chanInfo?.mutedList?.filter(
				(mutedUser) => mutedUser.userId === user.id,
			);
			const retrieveDate = data?.at(0)?.muteExpiration;
			let newDate = currentTime;
			let unMuted: boolean = false;
			if (retrieveDate) newDate = new Date(retrieveDate);
			if (newDate) unMuted = isAfter(currentTime.getTime(), newDate.getTime());
			if (
				!chanInfo?.mutedList?.some(
					(mutedUser) => mutedUser.userId === user.id,
				) ||
				unMuted
			) {
				chatSocket?.emit("chanMessage", { room: id, message: value });
				setValue("");
				const inputValue: HTMLElement | null =
					document.getElementById("newMsg");
				if (inputValue != null) {
					inputValue.nodeValue = "";
				}
			} else showAlert("error", "You are currently muted");
		}
	};

	const handleKeyDownPassword = async (
		event: KeyboardEvent<HTMLInputElement>,
	) => {
		if (event.key === "Enter" && value && value !== "") {
			const data = { chanId: chanInfo?.id, secret: value };
			try {
				const res = await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/channels/secret`,
					{
						method: "POST",
						credentials: "include",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${accessToken}`,
						},
						body: JSON.stringify(data),
					},
				);
				if (res.status === 201) {
					showAlert("success", "Password valid, please enter");
					setValue("");
					const inputValue: HTMLElement | null =
						document.getElementById("newMsg");
					if (inputValue != null) {
						inputValue.nodeValue = "";
					}
					setAuthenticate(true);
				} else {
					showAlert("error", "Invalid password, little gourgandin");
					setValue("");
					const inputValue: HTMLElement | null =
						document.getElementById("newMsg");
					if (inputValue != null) {
						inputValue.nodeValue = "";
					}
				}
			} catch (e) {
				console.error("Error kicking from channel");
			}
		}
	};

	useEffect(() => {
		chatSocket?.on("errorSendingMessage", (username: string) => {
			if (username === user.userName) {
				showAlert(
					"error",
					"You're not able to send a message in this channel, sorry :(",
				);
			}
		});
		return () => {
			chatSocket?.off("errorSendingMessage");
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [messagesList, messagesState]);

	async function handleKick(userName: string, userId: number) {
		const id = chanInfo?.id;
		const room = chanInfo?.title;
		const data = { userName, id };
		const mode = "kick";
		const toEmit = { id, room, userName, mode };
		if (chanInfo?.ownerId === userId) {
			showAlert(
				"error",
				"Error, you can't kick, ban or mute the channel owner bro",
			);
			return;
		}
		try {
			const res = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/channels/kick`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
					body: JSON.stringify(data),
				},
			);
			if (res.status === 201) {
				chatSocket?.emit("exitChatRoom", toEmit);
				showAlert("success", userName + " has been kicked");
				setManageUserModal(false);
				isAuth();
			} else {
				const data = await res.json();
				showAlert("error", data.message);
			}
		} catch (e) {
			console.error("Error kicking from channel");
		}
	}

	async function handleBlock(
		userTopName: string,
		userTopId: number,
		userBottomName: string,
		userBottomId: number,
	) {
		const room = chanInfo?.title;
		const id = chanInfo?.id;
		const mode = "block";
		const data = { userTopName, userTopId, userBottomName, userBottomId };
		const toEmit = { id, room, userTopName, mode };
		try {
			const res = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/user/block`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
					body: JSON.stringify(data),
				},
			);
			if (res.status === 201) {
				chatSocket?.emit("blockUser", toEmit);
				showAlert("success", "Operation success");
				setManageUserModal(false);
				isAuth();
			} else if (res.status === 403) {
				showAlert("error", "User already blocked");
			} else {
				const data = await res.json();
				showAlert("error", data.message);
			}
		} catch (e) {
			console.error("Error blocking from user");
		}
	}

	async function handleBan(userName: string, userId: number) {
		const id = chanInfo?.id;
		const room = chanInfo?.title;
		const data = { userName, id };
		const mode = "ban";
		const toEmit = { id, room, userName, mode };
		if (chanInfo?.ownerId === userId) {
			showAlert(
				"error",
				"Error, you can't kick, ban or mute the channel owner bro",
			);
			return;
		}
		try {
			const res = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/channels/ban`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
					body: JSON.stringify(data),
				},
			);
			chatSocket?.emit("exitChatRoom", toEmit);
			if (res.status === 201) {
				showAlert("success", userName + " has been banned");
				setManageUserModal(false);
			} else {
				const data = await res.json();
				showAlert("error", data.message);
			}
		} catch (e) {
			console.error("Error bannishing from channel");
		}
	}

	async function handleMute(userName: string, userId: number) {
		const chanId = chanInfo?.id;
		const mutedEnd = new Date(currentTime.getTime() + 30000);
		const data = { chanId, userId, mutedEnd };
		const mode = "mute";
		const toEmit = { id, userId, userName, mode };
		if (chanInfo?.ownerId === userId) {
			showAlert(
				"error",
				"Error, you can't kick, ban or mute the channel owner bro",
			);
			return;
		}
		try {
			const res = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/channels/mute`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
					body: JSON.stringify(data),
				},
			);
			if (res.status === 201) {
				chatSocket?.emit("MuteInChatRoom", toEmit);
				showAlert("success", userName + " has been muted for 30 seconds");
				setManageUserModal(false);
			} else {
				const data = await res.json();
				showAlert("error", data.message);
			}
		} catch (e) {
			console.error("Error muting from channel");
		}
	}

	async function handleAdmin(userName: string, userId: number) {
		const id = chanInfo?.id;
		const room = chanInfo?.title;
		const data = { userName, id };
		const mode = "admin";
		const toEmit = { id, room, userName, mode };
		try {
			const res = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/channels/admin`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
					body: JSON.stringify(data),
				},
			);
			if (res.status === 201) {
				chatSocket?.emit("adminChatRoom", toEmit);
				setManageUserModal(false);
			} else {
				const data = await res.json();
				showAlert("error", data.message);
			}
		} catch (e) {
			console.error("Error adminishing from channel");
		}
	}

	async function handleInviteClick() {
		if (!chanInfo?.title) {
			return;
		}
		const data = { title: chanInfo?.title };
		try {
			await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/channels/retrieve_invite_list`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
					body: JSON.stringify(data),
				},
			)
				.then((res) => res.json())
				.then((users) => {
					setInviteState(users);
				});
		} catch (e) {
			console.error("Error retieving invite users from channel");
		}
		setModalInvite(!modalInvite);
	}

	async function handleInviteUser(userId: number) {
		if (!chanInfo?.title || !userId) {
			return;
		}
		const data = { title: chanInfo?.title, userId };
		const toEmit = { room: chanInfo.title, userId: userId };
		try {
			const res: Response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/channels/invite`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
					body: JSON.stringify(data),
				},
			);
			if (res.status === 201) {
				chatSocket?.emit("addUserToChan", toEmit);
				setModalInvite(!modalInvite);
			} else {
				const data = await res.json();
				showAlert("error", data.message);
			}
			navigate(`/chat/channels/${chanInfo?.title}`);
		} catch (e) {
			console.error("Error adding user to chan");
		}
	}

	// useEffect(() => {
	// 	const joinedListener = (chan: ChannelModel) => {
	// 		setChanInfo(chan);
	// 	};
	// 	chatSocket?.on("userJoinedChan", joinedListener);
	// 	return () => {
	// 		chatSocket?.off("userJoinedChan");
	// 	};
	// }, [chanInfo, chatSocket]);

	useEffect(() => {
		const inviteListener = (chan: ChannelModel, user: UserModel) => {
			setInviteState(
				inviteState.filter((userCompare) => userCompare.id !== user.id),
			);
		};
		chatSocket?.on("removeFromInviteList", inviteListener);
		return () => {
			chatSocket?.off("removeFromInviteList");
		};
	}, [chanInfo, chatSocket, inviteState]);

	useEffect(() => {
		const chanListener = (
			chan: ChannelModel,
			username: string,
			mode: string,
		) => {
			if (username === user.userName && (mode === "ban" || mode === "kick")) {
				showAlert("error", "You've been" + mode + " from " + chan.title);
				navigate(-1);
			} else if (username === user.userName && mode === "admin") {
				showAlert("success", "You've been made " + mode + " of " + chan.title);
			} else if (
				username !== user.userName &&
				mode === "leave" &&
				chanInfo?.title === chan.title
			) {
				showAlert("success", username + " leaved the channel");
			} else if (
				username === user.userName &&
				mode === "mute" &&
				chan.title === chanInfo?.title
			) {
				showAlert("success", "You've been muted 30 seconds from this channel");
			} else if (chanInfo?.title === chan.title) {
				setChanInfo(chan);
			} else {
				return;
			}
			setChanInfo(chan);
		};

		const updateUsernameListener = (data: {
			id: number;
			userName: string;
			oldUserName: string;
		}) => {
			setChanInfo((chan) => {
				// eslint-disable-next-line
				const updatedUser = chan?.members.filter((user) => {
					if (user.id === data.id) return (user.userName = data.userName);
				});
				return chan;
			});
		};
		socket?.on("userNameUpdatedChannel", updateUsernameListener);
		chatSocket?.on("kickOrBanOrLeaveFromChannel", chanListener);
		chatSocket?.on("userJoinedChan", chanListener);
		chatSocket?.on("adminJoinedChan", chanListener);
		chatSocket?.on("refreshMute", chanListener);
		return () => {
			socket?.off("userNameUpdatedChannel");
			chatSocket?.off("kickOrBanOrLeaveFromChannel");
			chatSocket?.off("userJoinedChan");
			chatSocket?.off("adminJoinedChan");
			chatSocket?.off("refreshMute");
		};
	}, [chatSocket, socket, navigate, showAlert, user.userName, chanInfo?.title]);

	return (
		<div className="d-flex flex-column align-items flex-1">
			<div className="title mt-20">Channels</div>
			<ChatNav />
			{chanInfo?.mode === "Protected" && !authenticate ? (
				<>
					<div className="d-flex flex-column align-items mt-20">
						<h2 className="mb-20">
							Password for {trimUserName(chanInfo.title)}
						</h2>
						<Input
							icon="fa-solid fa-lock"
							type="password"
							name="secret"
							placeholder="Password"
							value={value}
							onChange={(e: any) => {
								setValue(e.target.value);
							}}
							onKeyDown={handleKeyDownPassword}
						/>
					</div>
				</>
			) : (
				<div>
					<div className="d-flex flex-row mt-10 flex-1">
						<div className="d-flex flex-column justify-content align-items">
							<div className="w-100 d-flex flex-row justify-content-space-between">
								<h2 className="ml-10">{chanInfo?.title}</h2>
								<div
									className={`btn-reverse-primary d-flex align-items pl-10 pr-10 mr-10`}
									onClick={() => {
										handleInviteClick();
									}}
								>
									Invite
								</div>
							</div>
							<div
								className={`${styles.channelContainer} d-flex flex-column mb-10`}
							>
								<div
									className={`${styles.channelMessagesList}`}
									ref={messagesListRef}
								>
									{messagesList.length ? (
										<ul>{messagesList}</ul>
									) : (
										<p className="d-flex justify-content mt-20 p-10">
											Start the conversation
										</p>
									)}
								</div>
							</div>
							<Input
								id="newMsg"
								type="text"
								name="message"
								value={value}
								placeholder="Message"
								icon="fa-brands fa-telegram"
								onKeyDown={handleKeyDown}
								onChange={(e: any) => {
									setValue(e.target.value);
								}}
							/>
						</div>
						<div className={`d-flex ${styles.usersList} flex-column ml-5`}>
							<h2 className="ml-10 m-5">Users</h2>
							<ul>
								{chanInfo?.members.map((member) => {
									const username = member.userName;
									const userId = member.id;
									return (
										<li
											onClick={() => handleMsgClick(username, userId)}
											key={userId}
											className="ml-10 m-5"
										>
											{trimUserName(username)}
										</li>
									);
								})}
							</ul>
						</div>
					</div>
					{manageUserModal && (
						<div
							className={`${styles.manageUserModal} d-flex flex-column`}
							onClick={() => {
								setManageUserModal(!manageUserModal);
							}}
						>
							<div
								className={`${styles.manageUserModalContent} d-flex flex-column justify-content align-items`}
								onClick={(e) => {
									e.stopPropagation();
								}}
							>
								<h2 className="mt-10 mb-20">
									Manage {trimUserName(currentUserName)}
								</h2>
								<button
									className="btn btn-primary"
									onClick={() => navigate(`/user/${currentUserName}`)}
								>
									See Profile
								</button>
								<button
									className="btn btn-play mt-10"
									onClick={() => {
										socket?.emit("sendGameInvite", {
											sender: user.id,
											invited: currentUserId,
										});
										setManageUserModal(!manageUserModal);
									}}
								>
									Invite to Play
								</button>
								{!currentUserBlocked ? (
									<button
										onClick={() =>
											handleBlock(
												user.userName,
												user.id,
												currentUserName,
												currentUserId,
											)
										}
										className="btn btn-reverse-danger mt-10"
									>
										Block
									</button>
								) : (
									<button
										onClick={() =>
											handleBlock(
												user.userName,
												user.id,
												currentUserName,
												currentUserId,
											)
										}
										className="btn btn-reverse-danger mt-10"
									>
										Unblock
									</button>
								)}
								{/* <button
									onClick={() =>
										handleBlock(
											user.userName,
											user.id,
											currentUserName,
											currentUserId,
										)
									}
									className="btn btn-reverse-danger mt-10"
								>
									Block
								</button> */}
								{/* {user.id === chanInfo?.ownerId && !currentUserAdmin && (
									<button
										onClick={() => handleAdmin(currentUserName, currentUserId)}
										className="btn btn-reverse-success mt-10"
									>
										Admin
									</button>
								)} */}
								{isOp && (
									<>
										<button
											onClick={() =>
												handleAdmin(currentUserName, currentUserId)
											}
											className="btn btn-primary pl-10 pr-10 p-5 mt-10"
										>
											Admin
										</button>
										<button
											id="Kick"
											onClick={() => handleKick(currentUserName, currentUserId)}
											className="btn btn-danger mt-10"
										>
											Kick
										</button>
										<button
											id="Ban"
											onClick={() => handleBan(currentUserName, currentUserId)}
											className="btn btn-danger mt-10"
										>
											Ban
										</button>
										<button
											id="Mute"
											onClick={() => handleMute(currentUserName, currentUserId)}
											className="btn btn-reverse-chat mt-10"
										>
											Mute
										</button>
									</>
								)}
								<button
									onClick={() => setManageUserModal(!manageUserModal)}
									className="btn btn-primary mt-10"
								>
									Close
								</button>
							</div>
						</div>
					)}
					{modalInvite && (
						<div
							className={`${styles.modalInvite} d-flex flex-column`}
							onClick={() => {
								setModalInvite(!modalInvite);
							}}
						>
							<div
								className={styles.modalInviteContent}
								onClick={(e) => {
									e.stopPropagation();
								}}
							>
								<h2 className="mb-20">Invite List</h2>
								<ul>
									{inviteState.map((member) => {
										return (
											<li
												onClick={() => handleInviteUser(member.id)}
												key={member.id}
											>
												{trimUserName(member.userName)}
											</li>
										);
									})}
								</ul>
								<button
									onClick={() => setModalInvite(!modalInvite)}
									className="btn btn-primary mt-10"
								>
									Close
								</button>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
