

import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import { useEffect, useState } from "react";
import Message from "../../components/Message/Message";
import { NavLink, useParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import { useUser } from "../../context/UserProvider";


export default function DirectMessages() {
  
	const { accessToken, user } = useUser();
	const [socket, setSocket] = useState<Socket>();
	
	const [directMessagesState, setDirectMessagesState] = useState([]);
	
	// Make the user to join the rooms of his DMs
	
	const directMessagesNames = directMessagesState.map(({ title}) => (title));
	
	for (const chan of directMessagesNames){
		socket?.emit('joinChatRoom', chan)
	}
	
	// Put this shit in a context
	useEffect(() => {
		const newSocket = io(`${process.env.REACT_APP_CHAT_URL}`);
		setSocket(newSocket);
	}, [setSocket])

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
				.then(
				(chans) => {
					setDirectMessagesState(chans);
					console.log(chans);
				}
				);
            } catch (e) {
			}
        })();
    }, [user.userName, accessToken]);
	
	const { id } = useParams();
	
	const DirectMessagesList = directMessagesState.map(({ username, content }) => (
		<li key={username}>
			<div>
			<NavLink className={``}  to={`/chat/direct_messages/${username}`} >
				<span>
					{username}
				</span>
			</NavLink>
				<button>
					Delete
				</button>
			</div>
		</li>
	  ));
	


	return (
		<div className="container d-flex flex-column justify-content align-items">
			<div className="title">Chat messages</div>
			<div>
					<ChatNav/>
					{
						// (id ?
						// <>
						// 	<p>Display {id} conversation</p>
						// 	<MessageDisplay></MessageDisplay>
						// 	<button>See profile</button>
						// 	<button>Delete conversations</button>
						// 	<input onKeyDown={handleKeyDown}
						// 		onChange={(e)=>{setValue(e.target.value)}} 
						// 		type="text" 
						// 		placeholder={`Reply to ${id}`}/>
						// </> 
						// :
						<>
							<h1>Messages ({DirectMessagesList.length})</h1>
							<ul className="List">{DirectMessagesList}</ul>
							<NavLink className={``}  to='/chat/direct_messages/new_dm' >
								New Direct Messages
            				</NavLink>
						</>
						// )
					}
			</div>
		</div>
	);
}