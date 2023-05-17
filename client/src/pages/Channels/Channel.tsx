
import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../context/UserProvider";
import { KeyboardEvent } from "react"
import Message from "../../components/Message/Message";
import { ChannelModel, MessageModel } from "../../entities/entities";
import { usePrivateRouteSocket } from "../../context/PrivateRouteProvider";
import { useAlert } from "../../context/AlertProvider";

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
	const [currentUserId, setCurrentUserId] = useState(0);
	const [isOp, setOp] = useState(false);
	
	 
	const { id } = useParams();
	const { showAlert } = useAlert();
	const navigate = useNavigate();


	
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
	
	function handleMsgClick(userName: string, userId: number) {
		if (userName === user.userName)
		{return}
		setCurrentUserName(userName);
		setCurrentUserId(userId);
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
			<li  onClick={() => handleMsgClick(author.userName, author.id)} key={id}>
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

		
	async function handleKick(userName : string, userId: number) {
		const id = chanInfo?.id;
		const room = chanInfo?.title;
		const data = {userName, id}
		const tets = {id, room,userName}
		if (chanInfo?.ownerId === userId){
			showAlert("error", "Error, you can't kick, ban or mute the channel owner bro");
			return ;
		}
		try {
			const res = await fetch("http://localhost:3000/channels/kick", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			})
			// .then(res => res.json()).then(chan => {
			// 	setChanInfo(chan);
			// });
			chatSocket?.emit("exitChatRoom", tets);
			console.log("Emitted");
			
			if (res.status === 201) {
				setInfoBool(true);
				setuserBool(false);
			} else if (res.ok) {
				// navigate("/chat/channels");
            }
		} catch (e) {
			console.error("Error kicking from channel");
		}
	  }
	  useEffect(() => {
		chatSocket?.on("kickOrBanFromChannel", (username:string)=>{
			if (username === user.userName){
				navigate(-1);
			}
			// Mettre a jour la liste de users
		});
		return () => {
		  chatSocket?.off("kickOrBanFromChannel",);
		}
	  // eslint-disable-next-line react-hooks/exhaustive-deps
	  }, [messagesList, messagesState])
	  
	
	
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
										<li onClick={() => handleMsgClick(username, userId)} key={userId} className="ml-10">
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
							<NavLink className="btn-primary ml-10 d-flex justify-content" to={`/user/${currentUserName}`}>
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
								<button id="Kick" onClick={() => handleKick(currentUserName, currentUserId)} className="btn-danger ml-10">
									Kick
								</button>
								<button id="Ban" className="btn-danger ml-10">
									Ban
								</button>
								<button id="Mute" className="btn-danger ml-10">
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