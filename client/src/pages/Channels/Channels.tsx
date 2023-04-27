import React from "react";

import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import { useUser } from "../../context/UserProvider";

export default function Channels() {
  
	const { accessToken, user } = useUser();
	const [socket, setSocket] = useState<Socket>();
	const [value, setValue] = useState("");
	
	const [channelsState, setChannelsState] = useState([]);

	useEffect(() => {
        (async () => {
            try {
                await fetch(`http://localhost:3000/channels/`, {
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
    }, []);
	
	const { id } = useParams();
	
	const channelsList = channelsState.map(({ title, type, id , ownerId, members}) => (

		<li key={title}>
			<div>{title}</div>
		</li>
	  ));
	  
	//   const messageListener = (sender: string, message: string) => {
	// 	setChannels([...channels, { username: sender, socket:"", content: message}]);
	//   }
	  
	// useEffect(() => {
	//   const newSocket = io("http://localhost:8001");
	//   setSocket(newSocket);
	// }, [setSocket])

	// useEffect(() => {
	// 	socket?.on("private_message", messageListener);
	// 	return () => {
	// 	  socket?.off("private_message", messageListener);
	// 	}
	//   // eslint-disable-next-line react-hooks/exhaustive-deps
	//   }, [messageListener])

	// const handleKeyDown =  (event : KeyboardEvent<HTMLInputElement>) => {
	// 	if (event.key === "Enter"){
	// 		socket?.emit("private_message", {sender: user.userName, message: value, socket: socket.id, receiver: id});
	// 	}
	// };

	return (
		<div className="container d-flex flex-column justify-content align-items">
			<div className="title">Chat channels</div>
			<div>
					<ChatNav/>
					{
						(id ?
						<>
							<p>Display {id} channel</p>
						</> 
						:<>
							<h1>Channels ({channelsState.length})</h1>
						  <ul className="List">{channelsList}</ul>
						</>)
					}
					<NavLink className={``}  to='/chat/channels/new_channel' >
						New Channel
            		</NavLink>
			</div>
		</div>
	);
}