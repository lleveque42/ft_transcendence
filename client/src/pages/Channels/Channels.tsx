import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useUser } from "../../context/UserProvider";
import { usePrivateRouteSocket } from "../../context/PrivateRouteProvider";
import { ChannelModel } from "../../entities/entities";
import { useAlert } from "../../context/AlertProvider";

export default function Channels() {
	const { accessToken, user } = useUser();
	const {chatSocket} = usePrivateRouteSocket();
	const { showAlert } = useAlert();
	const [channelsState, setChannelsState] = useState<ChannelModel[]>([]);
	
	useEffect(() => {
		(async () => {
			try {
				await fetch(`${process.env.REACT_APP_BACKEND_URL}/channels/${user.userName}`, {
					credentials: "include",
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				})
					.then((res) => res.json())
					.then((chans) => {
						setChannelsState(chans);
					});
			} catch (e) {
			}
		})();
	}, [user.userName, accessToken]);

	async function handleLeaveClick(userName : string, id: number, room: string) {
		
		const data = {userName, id, room}
		const mode = "leave";
		const toEmit = {id, room, userName, mode}
		try {
			const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/channels/leave`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			})
			if (res.status === 201) {
				chatSocket?.emit("exitChatRoom", toEmit);
			}
		} catch (e) {
			console.error("Error leaving channel");
		}
	  }

	const channelsList = channelsState.map(({ id, title, ownerId}) => {
		const chanTitle = title;
		return (
		<li key={id}>
			<div className="d-flex flex-row m-10 justify-content-space-between">	
				<NavLink className={``}  to={`/chat/channels/${title}`} >
					<span>
						{title}
					</span>
				</NavLink>
				<div className="d-flex flex-row" >
					{ user.id === ownerId &&
						<NavLink className={`btn-primary`}  to={`/chat/channels/edit_channel/${title}`} >
									Edit
							</NavLink>
					}		
					<button  onClick={() => handleLeaveClick(user.userName, user.id, chanTitle )} className="btn-danger ml-10">
						Leave
					</button>
				</div>
			</div>
		</li>
	)});

	useEffect(() => {
		const inviteListener = (chan: ChannelModel, userId : number) => {
			if (userId === user.id){	
				setChannelsState([...channelsState, chan]);
			}
		}
		chatSocket?.on("newInvitedChan", inviteListener)
		return () => {
			chatSocket?.off("newInvitedChan",);
		}
	  }, [chatSocket, channelsState, user.id])

	useEffect(() => {
		const chanListener = (chan: ChannelModel, username: string, mode : string) => {
			if (username === user.userName && mode === "leave"){
				setChannelsState(channelsState.filter(c => c.id !== chan.id));
			}else if (username !== user.userName && mode === "leave") {
				showAlert("success",username + " leaved the channel");
			}
		}
		chatSocket?.on("kickOrBanOrLeaveFromChannel", chanListener)
		return () => {
			chatSocket?.off("kickOrBanOrLeaveFromChannel",);
		}
	  }, [channelsState, chatSocket, showAlert, user.userName])

	return (
		<div className="d-flex flex-column align-items flex-1">
			<div className="title mt-20">Channels</div>
			<div>
				<ChatNav />
				{
					<>
						<h1 className="mt-20">Channels ({channelsState.length})</h1>
						<ul className="List m-20">{channelsList}</ul>
						<NavLink
							className={`btn-primary m-10 d-flex flex-column justify-content align-items`}
							to="/chat/channels/new_channel"
						>
							New Channel
						</NavLink>
						<NavLink
							className={`btn-primary m-10 d-flex flex-column justify-content align-items`}
							to="/chat/channels/join_channel"
						>
							Join Channel
						</NavLink>
					</>
				}
			</div>
		</div>
	);
}
