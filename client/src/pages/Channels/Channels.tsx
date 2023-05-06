import React from "react";

import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import { useEffect, useState } from "react";
import { NavLink} from "react-router-dom";
import { useUser } from "../../context/UserProvider";
// import { usePrivateRouteSocket } from "../../context/PrivateRouteProvider";

export default function Channels() {
  
	const { accessToken, user } = useUser();
	// const {chatSocket} = usePrivateRouteSocket();
	
	const [channelsState, setChannelsState] = useState([]);
	//const [membersState, setMembersState] = useState([]);
	//const [messagesState, setMessagesState] = useState([]);
	
	// Make the user to join the rooms of his channels
	
	const channelNames = channelsState.map(({ title}) => (title));
	
	// useEffect(() => {
	// 	for (const chan of channelNames){
	// 		chatSocket?.emit('joinChatRoom', chan)
	// 	}
	// }, [channelNames, chatSocket])
	
	useEffect(() => {
		(async () => {
			try {
				await fetch(`http://localhost:3000/channels/${user.userName}`, {
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
	
	// useEffect(() => {
	// 	(async () => {
	// 		try {
	// 			setMembersState(channelsState.map(({members}) => {return members}));
    //         } catch (e) {
	// 		}
    //     })();
    // }, []);
	
	// useEffect(() => {
	// 	(async () => {
	// 		try {
	// 			setMessagesState(channelsState.map(({message}) => {return message}));
    //         } catch (e) {
	// 		}
    //     })();
    // }, [channelsState]);
	
	// const channelMessages = channelsState.map(({messages}) => {return messages});
	//console.log(channelMessages);
	
	// const messagesList = messages.map(({ username, content }) => (
	// 	<li key={username}>
	// 	  <Message
	// 		allMessages={channelMessages}
	// 		removeMessages={setMessages}
	// 		username ={username}
	// 		content={content}
	// 		/>
	// 	</li>
	//   ));

	// const messageListener = (sender: string, message: string) => {
	// 	setMessages([...messages, { username: sender, content: message}]);
	//   }

	// useEffect(() => {
	// 	socket?.on("receivedMessage", messageListener);
	// 	return () => {
	// 	  socket?.off("receivedMessage", messageListener);
	// 	}
	//   // eslint-disable-next-line react-hooks/exhaustive-deps
	//   }, [messageListener])

	// const handleKeyDown =  (event : KeyboardEvent<HTMLInputElement>) => {
	// 	if (event.key === "Enter"){
	// 		socket?.emit("chanMessage", {room: id, sender: user.userName, message: value});
	// 	}
	// };
	
	// const channelsMembers = channelsState.map(({members}) => {return members});
	// console.log(channelsMembers);
	// console.log(channelsMembers[0]);
	
	//const channelMessages = setMessages(channelsState.map(({message}) => {return message}));

	const channelsList = channelsState.map(({ id, title, ownerId}) => (
		<li key={id}>
			<div>
			<NavLink className={``}  to={`/chat/channels/${title}`} >
				<span>
					{title}
				</span>
			</NavLink>
			{ user.id === ownerId &&
				<>
					<button>
						Delete
					</button>
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
							<NavLink className={``}  to='/chat/channels/new_channel' >
								New Channel
            				</NavLink>
							<NavLink className={``}  to='/chat/channels/join_channel' >
								Join Channel
            				</NavLink>
						</>
					}
			</div>
		</div>
	);
}