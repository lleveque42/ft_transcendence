import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserProvider";
import { ChannelModel } from "../../entities/entities";
import { usePrivateRouteSocket } from "../../context/PrivateRouteProvider";
import { useAlert } from "../../context/AlertProvider";
import styles from "./DirectMessages.module.scss";

export default function DirectMessages() {
	const { user, isAuth, accessToken } = useUser();
	const [directMessagesState, setDirectMessagesState] = useState<
		ChannelModel[]
	>([]);
	const { chatSocket } = usePrivateRouteSocket();
	const { showAlert } = useAlert();
	const navigate = useNavigate();

	useEffect(() => {
		(async () => {
			try {
				await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/channels/dm/${user.userName}`,
					{
						credentials: "include",
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					},
				)
					.then((res) => res.json())
					.then((chans) => {
						setDirectMessagesState(chans);
					});
			} catch (e) {}
		})();
	}, [user.userName, accessToken]);

	async function handleBlock(channel: ChannelModel) {
		const room = channel?.title;
		const id = channel?.id;
		const userTopName = user.userName;
		const userTopId = user.id;
		const userList = channel.members;
		const userId1 = userList.at(0)?.id;
		const userId2 = userList.at(1)?.id;
		const userName1 = userList.at(0)?.userName;
		const userName2 = userList.at(1)?.userName;
		let userBottomName = "";
		let userBottomId = 0;
		if (userId1 && userId2 && userName1 && userName2) {
			userBottomId = userId1 === user.id ? userId2 : userId1;
			userBottomName = userName1 === user.userName ? userName2 : userName1;
		}
		const match = user.blockList.filter((el) => {
			return el.id === userBottomId;
		});
		const boolMatch: boolean = match.length > 0 ? true : false;
		if (boolMatch) {
			showAlert("error", userBottomName + " is already blocked");
			return;
		}
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
					},
					body: JSON.stringify(data),
				},
			);
			chatSocket?.emit("blockUser", toEmit);
			if (res.status === 201) {
				isAuth();
				showAlert("success", "You've just blocked " + userBottomName);
			}
		} catch (e) {
			console.error("Error blocking from user");
		}
	}

	const directMessageList = directMessagesState.map((channel) => {
		const members = channel.members;

		// const members = [
		// 	{ id: 1, userName: "Denis" },
		// 	{ id: 2, userName: "Denis" },
		// 	{ id: 3, userName: "Denis" },
		// 	{ id: 4, userName: "Denis" },
		// 	{ id: 5, userName: "Denis" },
		// 	{ id: 6, userName: "Denis" },
		// 	{ id: 7, userName: "Denis" },
		// 	{ id: 8, userName: "Denis" },
		// 	{ id: 9, userName: "Denis" },
		// 	{ id: 10, userName: "Denis" },
		// 	{ id: 11, userName: "Denis" },
		// 	{ id: 12, userName: "Denis" },
		// 	{ id: 13, userName: "Denis" },
		// 	{ id: 14, userName: "Denis" },
		// 	{ id: 15, userName: "Denis" },
		// 	{ id: 17, userName: "Denis" },
		// 	{ id: 16, userName: "Denis" },
		// 	{ id: 18, userName: "Denis" },
		// 	{ id: 19, userName: "Denis" },
		// ];
		// let membersDetails;
		if (members) {
			return members.map((member) => {
				return (
					member.id !== user.id && (
						<li className={styles.listElems} key={member.id}>
							<p
								onClick={() =>
									navigate(`/chat/direct_messages/${channel.title}`)
								}
							>
								{member.userName}
							</p>
						</li>
					)
				);
			});
			// return (
			// 	<div
			// 		key={channel.id}
			// 		className="d-flex flex-row justify-content align-items"
			// 	>
			// 		<NavLink
			// 			key={channel.id}
			// 			className={``}
			// 			to={`/chat/direct_messages/${channel.title}`}
			// 		>
			// 			{membersDetails}
			// 		</NavLink>

			// 		<button
			// 			onClick={() => handleBlock(channel)}
			// 			className="btn-danger ml-10"
			// 		>
			// 			Block
			// 		</button>
			// 	</div>
			// );
		}
		return <p key={"0"}></p>;
	});

	/* const directMessageList = directMessagesState.map((channel) => {
		const members = channel.members;
		if (members) {
			return members.map((member) => {
				return (
					member.id !== user.id && (
						<p
							className={styles.listElems}
							key={member.id}
							onClick={() => navigate(`/chat/direct_messages/${channel.title}`)}
						>
							{member.userName}
						</p>
					)
				);
			});
		}
		return <p key={"0"}></p>;
	}); */

	useEffect(() => {
		const DirectMessagesListener = (chan: ChannelModel) => {
			const {
				id,
				title,
				type,
				mode,
				ownerId,
				members,
				messages,
				operators,
				banList,
				mutedList,
			} = chan;
			setDirectMessagesState([
				...directMessagesState,
				{
					id,
					title,
					type,
					mode,
					ownerId,
					members,
					messages,
					operators,
					banList,
					mutedList,
				},
			]);
		};

		chatSocket?.on("userJoinedDM", DirectMessagesListener);
		chatSocket?.on("receivedDirectMessage", DirectMessagesListener);
		return () => {
			chatSocket?.off("receivedDirectMessage", DirectMessagesListener);
			chatSocket?.off("userJoinedDM", DirectMessagesListener);
		};
	}, [chatSocket, directMessagesState]);

	return (
		<div className="d-flex flex-column align-items flex-1">
			<div className="title mt-20">Chat</div>
			<ChatNav />
			{
				<>
					<div className={`${styles.dmListContainer}`}>
						<h2 className="d-flex justify-content p-10">
							Private messages ({directMessagesState.length})
						</h2>
						{directMessageList.length ? (
							<ul>{directMessageList}</ul>
						) : (
							<p className="d-flex justify-content align-items m-10">
								No private messages...
							</p>
						)}
					</div>
					<div className="d-flex justify-content">
						<NavLink
							className={`${styles.newDmBtn} btn-primary d-flex justify-content mt-10 p-5`}
							to="/chat/direct_messages/new_dm"
						>
							New Direct Messages
						</NavLink>
					</div>
				</>
			}
		</div>
	);
}
