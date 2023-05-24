import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserProvider";
import { ChannelModel } from "../../entities/entities";
import { usePrivateRouteSocket } from "../../context/PrivateRouteProvider";
import styles from "./DirectMessages.module.scss";

export default function DirectMessages() {
	const { user, accessToken } = useUser();
	const [directMessagesState, setDirectMessagesState] = useState<
		ChannelModel[]
	>([]);
	const { chatSocket } = usePrivateRouteSocket();
	const navigate = useNavigate();

	useEffect(() => {
		(async () => {
			try {
				await fetch(`http://localhost:3000/channels/dm/${user.userName}`, {
					credentials: "include",
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				})
					.then((res) => res.json())
					.then((chans) => {
						setDirectMessagesState(chans);
					});
			} catch (e) {}
		})();
	}, [user.userName, accessToken]);

	const directMessageList = directMessagesState.map((channel) => {
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
	});

	useEffect(() => {
		const DirectMessagesListener = (chan: ChannelModel) => {
			const { id, title, type, mode, ownerId, members, messages } = chan;
			setDirectMessagesState([
				...directMessagesState,
				{ id, title, type, mode, ownerId, members, messages },
			]);
		};
		chatSocket?.on("receivedDirectMessage", DirectMessagesListener);
		return () => {
			chatSocket?.off("receivedDirectMessage", DirectMessagesListener);
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
								No private messages...{" "}
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
