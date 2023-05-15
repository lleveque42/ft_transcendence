import React from "react";
import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";
import { useUser } from "../../context/UserProvider";
import { usePrivateRouteSocket } from "../../context/PrivateRouteProvider";

type FormValues = {
	userId: number;
	channelId: number;
};

export default function JoinChannel() {
  
	const { accessToken, user } = useUser();	
	const [channelsState, setChannelsState] = useState([]);
	
	const socket = usePrivateRouteSocket();
	
	const navigate = useNavigate();
	
	useEffect(() => {
		(async () => {
			try {
				await fetch(`http://localhost:3000/channels`, {
					credentials: "include",
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				})
				.then((res) => res.json())
				.then(
				(chans) => {
					setChannelsState(chans);
				}
				);
            } catch (e) {
			}
        })();
    }, [user.userName, accessToken]);
	
	async function handleClick(event: MouseEvent) {
		const target = event.target as HTMLButtonElement;
		const value = target.value;
		const channelId = parseInt(value);
		const userId = user.id;
		const formValues: FormValues = {
			userId: userId,
			channelId: channelId,
		}
		try {
			const res = await fetch("http://localhost:3000/channels/join_channel", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formValues),
			});
			socket.chatSocket?.emit("joinChatRoom", target.textContent);
			if (res.status === 201) {
				navigate("/chat/channels");
			} else if (res.ok) {
				navigate("/chat/channels");
            }
		} catch (e) {
			console.error("Error joining channel");
		}
	  }
	  
	const buttons = document.querySelectorAll('button');
	buttons.forEach(button => button.addEventListener('click', handleClick));
	  
	const channelsList = channelsState.map(({ id, title, ownerId}) => (
		<li key={id}>
			<div>
			{ ( user.id !== ownerId) ?
				<>
					<button className={` btn-primary m-10`} value={id}>
						{title}
					</button>
				</>
			:
				<>
					{/* <NavLink className={`m-10`}  to={`/chat/channels/${title}`} >
						<span>
							{title}
						</span>
					</NavLink> */}
				</>
			}
			</div>
		</li>
	));
	
	return (
		<div className="container d-flex flex-column justify-content align-items">
			<div className="title">Chat channels</div>
			<div>
					<ChatNav/>
					{
						<>
							<h1>Channels ({channelsState.length})</h1>
							<ul className="List">{channelsList}</ul>
						</>
					}
			</div>
		</div>
	);
}