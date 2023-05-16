
import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../../context/UserProvider";
import { KeyboardEvent } from "react"
import Message from "../../components/Message/Message";
import { ChannelModel, MessageModel } from "../../entities/entities";
import { usePrivateRouteSocket } from "../../context/PrivateRouteProvider";

export default function Channel() {
  
	const { accessToken } = useUser();
	const {chatSocket} = usePrivateRouteSocket();
	
	
	const [value, setValue] = useState("");
	const [infoBool, setInfoBool] = useState(false);
	const [messagesState, setMessagesState] = useState<Array<MessageModel>>([]);
	const [ messagesList, setMessagesList] = useState<JSX.Element[]>([]);
	const [chanInfo, setChanInfo] = useState<ChannelModel>();
	 
	const { id } = useParams();
	
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

	async function handleChanClick(event: MouseEvent) {
		try {
			await fetch(`http://localhost:3000/channels/edit/${id}`, {
				credentials: "include",
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
			.then((res) => res.json())
				.then(
				(chan) => {
					setInfoBool(true);
					setChanInfo(chan);
				}
				);
		} catch (e) {
			console.error("Error getting chan info");
		}
	  }
	  
	  async function handleMsgClick(event: MouseEvent) {
		try {
			console.log("Click on a user");
		} catch (e) {
			console.error("Error getting chan info");
		}
	  }

	const chanClick = document.querySelectorAll('h1');
	chanClick.forEach(chan => chan.addEventListener('click', handleChanClick));

	const messageClick = document.querySelectorAll('li');
	messageClick.forEach(chan => chan.addEventListener('click', handleMsgClick));

	useEffect(() => {
	setMessagesList(messagesState.map(({ id, author, content }) => 
	{
		return (
			<li key={id}>
			<Message
				allMessages={messagesState}
				// removeMessages={setMessagesState}
				username ={author.userName}
				content={content}
				/>
			</li>
		)
	}
	  ));
	},[messagesState]);

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
		}
	};
	
	return (
		<div className="container d-flex flex-column justify-content align-items">
			<div className="title">Chat channels</div>
			<div>
					<ChatNav/>
					<h1 className="m-20">{id}</h1>
					<div className="d-flex flex-row justify-content-space-between">
						<div className="d-flex flex-column">
					{
						(
							<>
							<div className="d-flex flex-column justify-content">
								<ul className="List">{messagesList}</ul>
							</div>
						</> 
						)
					}
					<input className={`btn-primary m-20 d-flex flex-column justify-content align-items`} onKeyDown={handleKeyDown}
					onChange={(e)=>{setValue(e.target.value)}}  type="text" placeholder="Write a message" />
					</div>
					{
						 infoBool &&
						<div className="d-flex flex-column">
							<div>
								<h2>
									Users List
								</h2>
								<ul>
								{chanInfo?.members.map((member)=>{
									const username = member.userName;
									const userId = member.id;
									return (
										<li key={userId}>
											{username}
											<button className="btn-danger ml-10">
												Kick
											</button>
											<button className="btn-danger ml-10">
												Ban
											</button>
											<button className="btn-danger ml-10">
												Mute
											</button>
											<button className="btn-primary ml-10">
												Play
											</button>
										</li>
									)
								})}
								</ul>
							</div>
						</div>
					}
				</div>
			</div>
		</div>
	);
}