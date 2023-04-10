

import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import { useEffect, useState } from "react";
import Message from "../../components/Message/Message";
import { useParams } from "react-router-dom";
import MessageDisplay from "../../components/Message/MessageDisplay/MessageDisplay";


export default function DirectMessages() {

	const [messages, setMessages] = useState([
		{
			username: 'gilbert',
			content: 'Salut toi'
		},
		{
			username: 'lorie',
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

	useEffect(() => {		
	});

	return (
		<div className="container d-flex flex-column justify-content align-items">
			<div className="title">Chat messages</div>
			<div
				>
					<ChatNav/>
					{
						(id ?
						<>
							<p>Display {id} conversation</p>
							<MessageDisplay></MessageDisplay>
							<button>See profile</button>
							<button>Delete conversations</button>
							<input type="text" placeholder={`Reply to ${id}`}/>
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