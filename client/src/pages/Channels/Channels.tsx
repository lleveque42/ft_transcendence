import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserProvider";
import { usePrivateRouteSocket } from "../../context/PrivateRouteProvider";
import { ChannelModel } from "../../entities/entities";
import { useAlert } from "../../context/AlertProvider";
import styles from "./Channels.module.scss";
import trimUserName from "../../utils/trimUserName";

export default function Channels() {
	const { accessToken, user } = useUser();
	const { chatSocket } = usePrivateRouteSocket();
	const { showAlert } = useAlert();
	const [channelsState, setChannelsState] = useState<ChannelModel[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		(async () => {
			try {
				await fetch(
					`${process.env.REACT_APP_BACKEND_URL}/channels/${user.userName}`,
					{
						credentials: "include",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${accessToken}`,
						},
					},
				)
					.then((res) => res.json())
					.then((chans) => {
						setChannelsState(chans);
					});
			} catch (e) {}
		})();
	}, [user.userName, accessToken]);

	async function handleLeaveClick(userName: string, id: number, room: string) {
		const data = { userName, id, room };
		const mode = "leave";
		const toEmit = { id, room, userName, mode };
		try {
			const res = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/channels/leave`,
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
			} else {
				const data = await res.json();
				showAlert("error", data.message);
			}
		} catch (e) {
			console.error("Error leaving channel");
		}
	}

	const channelsList = channelsState.map(({ id, title, ownerId, mode }) => {
		const chanTitle = title;
		return (
			<li className={styles.listElems} key={id}>
				<p>{trimUserName(title)}</p>
				<div>
					<button
						className="btn btn-primary pl-10 pr-10 mr-10"
						onClick={() => navigate(`/chat/channels/${title}`)}
					>
						Message
					</button>
					{user.id === ownerId && (
						<button
							className="btn btn-reverse-primary pl-10 pr-10 mr-10"
							onClick={() => navigate(`/chat/channels/edit_channel/${title}`)}
						>
							Edit
						</button>
					)}
					<button
						onClick={() => handleLeaveClick(user.userName, user.id, chanTitle)}
						className="btn btn-reverse-danger pl-10 pr-10"
					>
						Leave
					</button>
				</div>
			</li>
		);
	});

	useEffect(() => {
		const inviteListener = (chan: ChannelModel, userId: number) => {
			if (userId === user.id) {
				setChannelsState([...channelsState, chan]);
			}
		};
		const leftListener = (
			chan: ChannelModel,
			username: string,
			mode: string,
		) => {
			if (username === user.userName && (mode === "ban" || mode === "kick")) {
				showAlert("error", "You've been " + mode + " from " + chan.title);
				const filterChans = channelsState.filter((el) => {
					return el.id !== chan.id;
				});
				setChannelsState(filterChans);
			}
		};
		chatSocket?.on("newInvitedChan", inviteListener);
		chatSocket?.on("newLeftChan", leftListener);
		return () => {
			chatSocket?.off("newInvitedChan");
			chatSocket?.off("newLeftChan");
		};
	}, [chatSocket, channelsState, user.id, user.userName, showAlert]);

	useEffect(() => {
		const chanListener = (
			chan: ChannelModel,
			username: string,
			mode: string,
		) => {
			if (username === user.userName && mode === "leave") {
				console.log("Delete one netry");
				setChannelsState(channelsState.filter((c) => c.id !== chan.id));
			} else if (username !== user.userName && mode === "leave") {
				showAlert("success", username + " leaved the channel");
			}
		};
		chatSocket?.on("kickOrBanOrLeaveFromChannel", chanListener);
		return () => {
			chatSocket?.off("kickOrBanOrLeaveFromChannel");
		};
	}, [channelsState, chatSocket, showAlert, user.userName]);

	return (
		<div className="d-flex flex-column align-items flex-1">
			<div className="title mt-20">Channels</div>
			<ChatNav />
			<>
				<div className={styles.channelsListContainer}>
					<h2 className="d-flex justify-content p-10">
						My Channels ({channelsState.length})
					</h2>
					{channelsList.length ? (
						<ul>{channelsList}</ul>
					) : (
						<p className="d-flex justify-content align-items m-10">
							No channels joinned...
						</p>
					)}
				</div>
				<div className="d-flex flex-row justify-content align-items mt-10">
					<NavLink
						className={`${styles.channelsBtn} btn btn-reverse-primary p-5`}
						to="/chat/channels/new_channel"
					>
						New Channel
					</NavLink>
					<NavLink
						className={`${styles.channelsBtn} btn-primary ml-5 p-5`}
						to="/chat/channels/join_channel"
					>
						Join Channel
					</NavLink>
				</div>
			</>
		</div>
	);
}
