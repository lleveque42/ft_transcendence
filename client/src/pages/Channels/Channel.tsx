import React from "react";

import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import { useUser } from "../../context/UserProvider";
import { KeyboardEvent } from "react"
import Message from "../../components/Message/Message";
import { MessageModel, UserModel } from "../../entities/entities";

export default function Channel() {
  
	const { accessToken, user } = useUser();
	const [socket, setSocket] = useState<Socket>();
	const [value, setValue] = useState("");
	const [messagesState, setMessagesState] = useState<Array<MessageModel>>([]);
	
	const { id } = useParams();
	
	
	//	Put this shit in a context
	useEffect(() => {
		const newSocket = io(`${process.env.REACT_APP_CHAT_URL}`);
		setSocket(newSocket);
	}, [setSocket])
	
	//	Put this shit in a context
	useEffect(() => {
		socket?.emit('joinChatRoom', id)
	}, [socket, id])
	
	useEffect(() => {
	(async () => {
			try {
				await fetch(`http://localhost:3000/channels/chan/${id}`, {
					credentials: "include",
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				})
				.then((res) => res.json())
				.then(
				(messages) => {
					setMessagesState(messages);
				}
				);
            } catch (e) {
			}
        })();
    }, [accessToken, id]);

	
	const messagesList = messagesState.map(({ id, author, content }) => (
		<li key={id}>
		  <Message
			allMessages={messagesState}
			removeMessages={setMessagesState}
			username ={author.userName}
			content={content}
			/>
		</li>
	  ));
	  
	  const messageListener = (id : number, date: Date, authorId: number, author: UserModel, content: string) => {
		  setMessagesState([...messagesState, {id, date, authorId, author, content}]);
	  }
	  
	useEffect(() => {
		socket?.on("receivedMessage", messageListener);
		return () => {
		  socket?.off("receivedMessage", messageListener);
		}
	  // eslint-disable-next-line react-hooks/exhaustive-deps
	  }, [messageListener])

	const handleKeyDown =  (event : KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter"){
			socket?.emit("chanMessage", {room: id, sender: user.userName, message: value});
		}
	};
	
	return (
		<div className="container d-flex flex-column justify-content align-items">
			<div className="title">Chat channels</div>
			<div>
					<ChatNav/>
					{
						(
						<>
							<h1>Messages ({messagesList.length})</h1>
							<ul className="List">{messagesList}</ul>
							<input onKeyDown={handleKeyDown}
								onChange={(e)=>{setValue(e.target.value)}}  type="text" placeholder="Write a message" />
						</> 
						)
					}
			</div>
		</div>
	);
}