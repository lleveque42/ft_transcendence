import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../context/UserProvider";
import { KeyboardEvent } from "react"
import Message from "../../components/Message/Message";
import { MessageModel } from "../../entities/entities";
import { usePrivateRouteSocket } from "../../context/PrivateRouteProvider";

export default function DirectMessage() {
  
	const { user, accessToken } = useUser();
	const {chatSocket} = usePrivateRouteSocket();
	const navigate = useNavigate();
	
	const [value, setValue] = useState("");
	const [messagesState, setMessagesState] = useState<Array<MessageModel>>([]);
	const [messagesList, setMessagesList] = useState<JSX.Element[]>([]);
	 
	const { id } = useParams();
	
	useEffect(() => {
	(async () => {
			try {
				await fetch(`http://localhost:3000/channels/dm/chan/${id}`, {
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
				navigate("/chat/direct_messages/");
			}
        })();
    }, [accessToken, id, navigate]);


	useEffect(() => {
	setMessagesList(messagesState.map(({ id, author, content }) => {

		const match = user.blockList.filter((el) =>{
			return (el.id === author.id);
		} )
		const boolMatch : boolean = match.length > 0 ? true : false;
		return ( !boolMatch ?
			<li key={id}>
				<Message
					allMessages={messagesState}
					// removeMessages={setMessagesState}
					username ={author.userName}
					content={content}
				/>
			</li>
			:
			<li key={id}>
				Blocked Message from {author.userName}
			</li>
		)
	}))},[messagesState, user.blockList]);

	const messageListener = (msg: MessageModel) => {
	const {id, authorId, author, content} = msg
	setMessagesState([...messagesState, {id, authorId, author, content}]);
	}

	useEffect(() => {
		chatSocket?.on("receivedMessage", messageListener);
		return () => {
		  chatSocket?.off("receivedMessage", messageListener);
		}
	  // eslint-disable-next-line react-hooks/exhaustive-deps
	  }, [messageListener, messagesList, messagesState])

	const handleKeyDown =  (event : KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter" && value !== ""){
			chatSocket?.emit("chanMessage", {room: id, message: value});
			setValue("");
			const inputValue : HTMLElement | null = document.getElementById("newMsg");
			if (inputValue!= null){
				inputValue.nodeValue = "";
			}
		}
	};
	
	return (
		<div className="container d-flex flex-column justify-content align-items">
			<div className="title">Chat channels</div>
			<div>
				<ChatNav/>
				{ messagesState.entries() &&
					(
					<>
						<h1>Messages ({messagesList.length})</h1>
						<ul className="List">{messagesList}</ul>
					</> 
					)
				}
			</div>
				<input className={`btn-primary m-20 d-flex flex-column justify-content align-items`} onKeyDown={handleKeyDown}
				onChange={(e)=>{setValue(e.target.value)}}  type="text" placeholder="Write a message" id="newMsg" value={value} />
		</div>
	);
}