import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserProvider";
import { usePrivateRouteSocket } from "../../context/PrivateRouteProvider";
import { ChannelModel } from "../../entities/entities";

type FormValues = {
	userId: number;
	channelId: number;
};

export default function JoinChannel() {
	const { accessToken, user } = useUser();
	const [channelsState, setChannelsState] = useState<ChannelModel[]>([]);
	const {chatSocket} = usePrivateRouteSocket();
	const socket = usePrivateRouteSocket();

	const navigate = useNavigate();

	useEffect(() => {
		(async () => {
			try {
				await fetch(`${process.env.REACT_APP_BACKEND_URL}/channels/join`, {
					credentials: "include",
					headers: {
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
		const chanListener = (chan: ChannelModel, username: string, mode : string) => {
			setChannelsState([...channelsState , chan ]);
		}
		chatSocket?.on("addChannelToJoin", chanListener)
		return () => {
			chatSocket?.off("addChannelToJoin",);
		}
	  }, [chatSocket, channelsState])

	async function handleClick(channelId: number, title: string) {
		const formValues: FormValues = {
			userId: user.id,
			channelId: channelId,
		};
		try {
			const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/channels/join_channel`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formValues),
			});
			socket.chatSocket?.emit("joinChatRoom", title);
			if (res.status === 201) {
				navigate(`/chat/channels/${title}`);
			}else {
				// to dooooooooo
			}
		} catch (e) {
			console.error("Error joining channel");
		}
	}

	const channelsList = channelsState.map(({ id, title, ownerId }) => {
		return (
			<li key={id}>
			<div>
				{user.id !== ownerId ? (
					<>
						<button className={` btn-primary m-10`} value={id} onClick={()=> handleClick(id, title)}>
							{title}
						</button>
					</>
				) : (
					<>
					</>
				)}
			</div>
		</li>
)} );

	return (
		<div className="d-flex flex-column align-items flex-1">
			<div className="title mt-20">Join channels</div>
			<ChatNav />
			{
				<>
					<h1>Channels ({channelsState.length})</h1>
					<ul>{channelsList}</ul>
				</>
			}
		</div>
	);
}
