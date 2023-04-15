

import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import { useEffect, useState } from "react";
import Message from "../../components/Message/Message";
import { useParams } from "react-router-dom";
import MessageDisplay from "../../components/Message/MessageDisplay/MessageDisplay";
import { KeyboardEvent } from "react"
import { Socket, io } from "socket.io-client";
import { useUser } from "../../context/UserProvider";


export default function DirectMessages() {
  
	const { accessToken, user } = useUser();
	const [socket, setSocket] = useState<Socket>();
	const [value, setValue] = useState("");
	
	const [messages, setMessages] = useState([
		{
			username: 'gilbert',
			socket: "",
			content: 'Salut toi'
		},
		{
			username: 'wakka',
			socket : "",
			content: 'Bonjour'
		}
	]);
	
	const { id } = useParams();
	
	const messagesList = messages.map(({ username, content }) => (
		<li key={username}>
		  <Message
			allMessages={messages}
			removeMessages={setMessages}
			username ={username}
			content={content}
			/>
		</li>
	  ));
	  

	  const messageListener = (sender: string, message: string) => {
		setMessages([...messages, { username: sender, socket:"", content: message}]);
	  }
	  
	useEffect(() => {
	  const newSocket = io("http://localhost:8001");
	  setSocket(newSocket);
	}, [setSocket])

	useEffect(() => {
		socket?.on("private_message", messageListener);
		return () => {
		  socket?.off("private_message", messageListener);
		}
	  // eslint-disable-next-line react-hooks/exhaustive-deps
	  }, [messageListener])

	const handleKeyDown =  (event : KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter"){
			socket?.emit("private_message", {sender: user.userName, message: value, socket: socket.id, receiver: id});
		}
	};

	return (
		<div className="container d-flex flex-column justify-content align-items">
			<div className="title">Chat messages</div>
			<div>
					<ChatNav/>
					{
						(id ?
						<>
							<p>Display {id} conversation</p>
							<MessageDisplay></MessageDisplay>
							<button>See profile</button>
							<button>Delete conversations</button>
							<input onKeyDown={handleKeyDown}
								onChange={(e)=>{setValue(e.target.value)}} 
								type="text" 
								placeholder={`Reply to ${id}`}/>
						</> 
						:<>
							<h1>Messages ({messages.length})</h1>
						  <ul className="List">{messagesList}</ul>
						</>)
					}
			</div>
		</div>
	);
}