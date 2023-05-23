
import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import Message from "../../components/Message/Message";
import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../context/UserProvider";
import { KeyboardEvent } from "react"
import { ChannelModel, MessageModel } from "../../entities/entities";
import { usePrivateRouteSocket } from "../../context/PrivateRouteProvider";
import { useAlert } from "../../context/AlertProvider";

export default function Channel() {
  
	const { user, isAuth, accessToken } = useUser();
	const {chatSocket} = usePrivateRouteSocket();
	const { id } = useParams();
	const { showAlert } = useAlert();
	const [value, setValue] = useState("");
	const [infoBool, setInfoBool] = useState(false);
	const [userBool, setuserBool] = useState(false);
	const [messagesState, setMessagesState] = useState<Array<MessageModel>>([]);
	const [messagesList, setMessagesList] = useState<JSX.Element[]>([]);
	const [chanInfo, setChanInfo] = useState<ChannelModel>();
	const [currentUserName, setCurrentUserName] = useState("");
	const [currentUserId, setCurrentUserId] = useState(0);
	const [currentUserAdmin, setCurrentUserAdmin] = useState(false);
	const [isOp, setOp] = useState(false);
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
		chanInfo?.operators.forEach((op)=>{
			if (op.id === userId){
				setCurrentUserAdmin(true);
			}
		});
		setuserBool(true);
		setInfoBool(false);
	}
			
	const chanClick = document.querySelectorAll('h1');
	chanClick.forEach(chan => chan.addEventListener('click', handleChanClick));

	useEffect(() => {
	setMessagesList(messagesState.map(({ id, author, content }) => 
	{
		const match = user.blockList.filter((el) =>{
			return (el.id === author.id);
		} )
		const boolMatch : boolean = match.length > 0 ? true : false;
		return ( !boolMatch ?
			<li  onClick={() => handleMsgClick(author.userName, author.id)} key={id}>
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
			setValue("");
			const inputValue : HTMLElement | null = document.getElementById("newMsg");
			if (inputValue!= null){
				inputValue.nodeValue = "";
			}
		}
	};
	
	useEffect(() => {
		chatSocket?.on("errorSendingMessage", (username:string)=>{
			console.log("Error username : " + username);
			if (username === user.userName){
				showAlert("error", "You're not able to send a message in this channel, sorry :(");
			}
		});
		return () => {
		  chatSocket?.off("errorSendingMessage",);
		}
	  // eslint-disable-next-line react-hooks/exhaustive-deps
	  }, [messagesList, messagesState])

		
	async function handleKick(userName : string, userId: number) {
		const id = chanInfo?.id;
		const room = chanInfo?.title;
		const data = {userName, id}
		const mode = "kick";
		const toEmit = {id, room, userName, mode}
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
			chatSocket?.emit("blockUser", toEmit);			
			if (res.status === 201) {
				setInfoBool(true);
				setuserBool(false);
			}
		} catch (e) {
			console.error("Error kicking from channel");
		}
	  }

	  async function handleBlock(userTopName:string, userTopId: number, userBottomName : string, userBottomId: number) {
		const room = chanInfo?.title;
		const id = chanInfo?.id;
		const mode = "block";
		const data = {userTopName, userTopId, userBottomName, userBottomId}
		const toEmit = {id, room, userTopName, mode}
		try {
			const res = await fetch("http://localhost:3000/user/block", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			})
			chatSocket?.emit("blockUser", toEmit);			
			if (res.status === 201) {
				showAlert("success", userBottomName + " has been blocked");
				setInfoBool(true);
				setuserBool(false);
				isAuth();
			}
		} catch (e) {
			console.error("Error blocking from user");
		}
	  }

	  async function handleBan(userName : string, userId: number) {
		const id = chanInfo?.id;
		const room = chanInfo?.title;
		const data = {userName, id}
		const mode = "ban";
		const toEmit = {id, room, userName, mode}
		if (chanInfo?.ownerId === userId){
			showAlert("error", "Error, you can't kick, ban or mute the channel owner bro");
			return ;
		}
		try {
			const res = await fetch("http://localhost:3000/channels/ban", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			})
			chatSocket?.emit("exitChatRoom", toEmit);			
			if (res.status === 201) {
				showAlert("success", userName + " has been banned");
				setInfoBool(true);
				setuserBool(false);
			}
		} catch (e) {
			console.error("Error bannishing from channel");
		}
	  }

	  async function handleMute(userName : string, userId: number) {
		const id = chanInfo?.id;
		const room = chanInfo?.title;
		const data = {userName, id}
		const mode = "ban";
		const toEmit = {id, room, userName, mode}
		if (chanInfo?.ownerId === userId){
			showAlert("error", "Error, you can't kick, ban or mute the channel owner bro");
			return ;
		}
		try {
			const res = await fetch("http://localhost:3000/channels/mute", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			})
			// chatSocket?.emit("exitChatRoom", toEmit);			
			if (res.status === 201) {
				showAlert("success", userName + " has been muted for 10 seconds");
				setInfoBool(true);
				setuserBool(false);
			}
		} catch (e) {
			console.error("Error muting from channel");
		}
	  }

	  async function handleAdmin(userName : string, userId: number) {
		const id = chanInfo?.id;
		const room = chanInfo?.title;
		const data = {userName, id}
		const mode = "admin";
		const toEmit = {id, room, userName, mode}
		try {
			const res = await fetch("http://localhost:3000/channels/admin", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			})
			chatSocket?.emit("adminChatRoom", toEmit);
			if (res.status === 201) {
				setInfoBool(true);
				setuserBool(false);
			}
		} catch (e) {
			console.error("Error adminishing from channel");
		}
	  }

	  useEffect(() => {
		const chanListener = (chan: ChannelModel, username: string, mode : string) => {
			if (username === user.userName && (mode === "ban" || mode === "kick")){
				showAlert("error","You've been"+ mode + " from " + chan.title);
				navigate(-1);
			}
			else if (username === user.userName && mode === "admin"){
				showAlert("success","You've been made "+ mode + " of " + chan.title);
			}else if (username !== user.userName && mode === "leave") {
				showAlert("success",username + " leaved the channel");
			}
			setChanInfo(chan);
		}
		chatSocket?.on("kickOrBanOrLeaveFromChannel", chanListener)
		chatSocket?.on("userJoinedChan", chanListener)
		chatSocket?.on("adminJoinedChan", chanListener)
		return () => {
			chatSocket?.off("kickOrBanOrLeaveFromChannel",);
			chatSocket?.off("userJoinedChan",);
			chatSocket?.off("adminJoinedChan",);
		}
	  }, [chatSocket, navigate, showAlert, user.userName])
	  
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
						<input id="newMsg" className={`btn-primary m-20 d-flex flex-column justify-content align-items`} onKeyDown={handleKeyDown}
						onChange={(e)=>{setValue(e.target.value)}}  type="text" placeholder="Write a message" value={value}/>
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
								<button onClick={() => handleBlock(user.userName, user.id, currentUserName, currentUserId)} className="btn-danger ml-10">
									Block
								</button>
								{
									user.id === chanInfo.ownerId && !currentUserAdmin &&
									<button onClick={() => handleAdmin(currentUserName, currentUserId)} className="btn-primary ml-10">
										Admin
									</button>
								}
								{ isOp &&
								<>
									<button id="Kick" onClick={() => handleKick(currentUserName, currentUserId)} className="btn-danger ml-10">
										Kick
									</button>
									<button id="Ban" onClick={() => handleBan(currentUserName, currentUserId)} className="btn-danger ml-10">
										Ban
									</button>
									<button id="Mute" onClick={() => handleMute(currentUserName, currentUserId)} className="btn-danger ml-10">
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