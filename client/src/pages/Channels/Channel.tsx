
import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useUser } from "../../context/UserProvider";
import { KeyboardEvent } from "react"
import Message from "../../components/Message/Message";
import { ChannelModel, MessageModel } from "../../entities/entities";
import { usePrivateRouteSocket } from "../../context/PrivateRouteProvider";

export default function Channel() {
  
	const { user, accessToken } = useUser();
	const {chatSocket} = usePrivateRouteSocket();
	
	
	const [value, setValue] = useState("");
	const [infoBool, setInfoBool] = useState(false);
	const [userBool, setuserBool] = useState(false);
	const [messagesState, setMessagesState] = useState<Array<MessageModel>>([]);
	const [messagesList, setMessagesList] = useState<JSX.Element[]>([]);
	const [chanInfo, setChanInfo] = useState<ChannelModel>();
	const [currentUserName, setCurrentUserName] = useState("");
	const [isOp, setOp] = useState(false);
	 
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
				await fetch(`http://localhost:3000/channels/edit/${id}`, {
				credentials: "include",
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				})
				.then((res) => res.json())
					.then(
					(chan) => {
						setuserBool(false);
						setInfoBool(true);
						setChanInfo(chan);
					}
					);
            } catch (e) {
			}

        })();
    }, [accessToken, id]);

	function handleChanClick(event: MouseEvent) {
		setuserBool(false);
		setInfoBool(true);
	}
	
	function handleMsgClick(userName: string) {
		if (userName === user.userName)
		{return}
		setCurrentUserName(userName);
		setuserBool(true);
		setInfoBool(false);
	}
			
	const chanClick = document.querySelectorAll('h1');
	chanClick.forEach(chan => chan.addEventListener('click', handleChanClick));

	// const messageClick = document.querySelectorAll('li');
	// messageClick.forEach(chan => chan.addEventListener('click', handleMsgClick));

	useEffect(() => {
	setMessagesList(messagesState.map(({ id, author, content }) => 
	{
		return (
			<li  onClick={() => handleMsgClick(author.userName)} key={id}>
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
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[messagesState]);

	useEffect(()=>{	
		chanInfo?.operators.map((op)=>{
			if (op.id === user.id){
				setOp(true);	
			}
			return ("");
		})
	}, [chanInfo?.operators, isOp, user.id])
	

	useEffect(() => {
		const messageListener = (msg: MessageModel) => {
			const {id, authorId, author, content} = msg
			setMessagesState([...messagesState, {id, authorId, author, content}]);
		}
		chatSocket?.on("receivedMessage", messageListener);
		return () => {
		  chatSocket?.off("receivedMessage", messageListener);
		}
	}, [messagesList, messagesState, chatSocket])

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
								<h2 className="ml-10">
									Users List
								</h2>
								<ul>
								{chanInfo?.members.map((member)=>{
									const username = member.userName;
									const userId = member.id;
									return (
										<li onClick={() => handleMsgClick(username)} key={userId} className="ml-10">
											{username}
										</li>
									)
								})}
								</ul>
							</div>
						</div>
					}
					{ userBool && chanInfo &&
						<div className="d-flex flex-column">
							<h2 className="ml-10">
								Manage {currentUserName}
							</h2>
							<NavLink className="btn-primary ml-10 d-flex justify-content" to="">
								Profile
							</NavLink>
							<button className="btn-primary ml-10">
								Play
							</button>
							{
								user.id === chanInfo.ownerId && 
								<button className="btn-primary ml-10">
									Admin
								</button>
							}
							{ isOp &&
							<>
								<button className="btn-danger ml-10">
									Kick
								</button>
								<button className="btn-danger ml-10">
									Ban
								</button>
								<button className="btn-danger ml-10">
									Mute
								</button>
							</>
							}
							
						</div>
					}
				</div>
			</div>
		</div>
	);
}