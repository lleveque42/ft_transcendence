import ChatNav from "../../../components/Chat/ChatNav/ChatNav";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserProvider";
import { usePrivateRouteSocket } from "../../../context/PrivateRouteProvider";
import { ChannelModel, UserModel } from "../../../entities/entities";
import { useAlert } from "../../../context/AlertProvider";
import styles from "./JoinChannel.module.scss";
import trimUserName from "../../../utils/trimUserName";

type FormValues = {
	userId: number;
	channelId: number;
};

export default function JoinChannel() {
	const { accessToken, user } = useUser();
	const [channelsState, setChannelsState] = useState<ChannelModel[]>([]);
	const { chatSocket } = usePrivateRouteSocket();
	const socket = usePrivateRouteSocket();
	const { showAlert } = useAlert();

	const navigate = useNavigate();

	useEffect(() => {
		(async () => {
			try {
				await fetch(`${process.env.REACT_APP_BACKEND_URL}/channels/join`, {
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
				})
					.then((res) => res.json())
					.then((chans) => {
						setChannelsState(chans);
					});
			} catch (e) {}
		})();
	}, [user.userName, accessToken]);

	useEffect(() => {
		const chanListener = (
			chan: ChannelModel,
			username: string,
			mode: string,
		) => {
			const match = channelsState.some((el) => {
				return el.id === chan.id;
			});
			if (!match && chan.mode === "Public") {
				setChannelsState([...channelsState, chan]);
			} else if (match && (mode === "Private" || mode === "Protected")) {
				const filterChans = channelsState.filter((el) => {
					return el.id !== chan.id;
				});
				setChannelsState(filterChans);
			}
		};

		const removeFromJoinListener = (
			chan: ChannelModel,
			username: string,
			mode: string,
		) => {
			const filterChans = channelsState.filter((el) => {
				return el.id !== chan.id;
			});
			setChannelsState(filterChans);
		};
		chatSocket?.on("addChannelToJoin", chanListener);
		chatSocket?.on("removeFromJoin", removeFromJoinListener);
		return () => {
			chatSocket?.off("addChannelToJoin");
			chatSocket?.off("removeFromJoin");
		};
	}, [chatSocket, channelsState]);

	useEffect(() => {
		const inviteListener = (chan: ChannelModel, user: UserModel) => {
			setChannelsState(
				channelsState.filter((userCompare) => userCompare.id !== user.id),
			);
		};
		chatSocket?.on("removeFromInviteList", inviteListener);
		return () => {
			chatSocket?.off("removeFromInviteList");
		};
	}, [channelsState, chatSocket]);

	async function handleClick(channelId: number, title: string) {
		const formValues: FormValues = {
			userId: user.id,
			channelId: channelId,
		};
		try {
			const res = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/channels/join_channel`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
					body: JSON.stringify(formValues),
				},
			);
			if (res.status === 201) {
				socket.chatSocket?.emit("joinChatRoom", title);
				showAlert("success", `You've been add to the chan`);
				navigate(`/chat/channels/${title}`);
			} else {
				const data = await res.json();
				showAlert("error", data.message);
				navigate(`/chat/channels/${title}`);
			}
		} catch (e) {
			console.error("Error joining channel");
		}
	}

	const channelsList = channelsState.map(({ id, title, ownerId }) => {
		return (
			<li className={styles.listElems} key={id}>
				{user.id !== ownerId ? (
					<>
						<p className="ml-5">{trimUserName(title)}</p>
						<button
							className="btn btn-primary mr-10"
							value={id}
							onClick={() => handleClick(id, title)}
						>
							Join channel
						</button>
					</>
				) : (
					<></>
				)}
			</li>
		);
	});

	return (
		<div className="d-flex flex-column align-items flex-1">
			<div className="title mt-20">Join channels</div>
			<ChatNav />
			<div className={styles.joinChannelListContainer}>
				{channelsList.length ? (
					<>
						<h2 className="d-flex justify-content p-10">
							Channels available ({channelsState.length})
						</h2>
						<ul>{channelsList}</ul>
					</>
				) : (
					<p className="d-flex flex-column align-items m-20">
						There are no channels avalaible for you...
					</p>
				)}
			</div>
		</div>
	);
}
