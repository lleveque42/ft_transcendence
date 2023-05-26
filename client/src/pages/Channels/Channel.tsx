import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import Message from "../../components/Message/Message";
import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../context/UserProvider";
import { KeyboardEvent } from "react"
import { ChannelModel, MessageModel, UserModel } from "../../entities/entities";
import { usePrivateRouteSocket } from "../../context/PrivateRouteProvider";
import { useAlert } from "../../context/AlertProvider";
import { isAfter } from 'date-fns';

export default function Channel() {
  
	const { user, isAuth, accessToken } = useUser();
	const {chatSocket, socket} = usePrivateRouteSocket();
	const { id } = useParams();
	const { showAlert } = useAlert();
	const [value, setValue] = useState("");
	const [infoBool, setInfoBool] = useState(false);
	const [userBool, setuserBool] = useState(false);
	const [inviteBool, setInviteBool] = useState(false);
	const [messagesState, setMessagesState] = useState<Array<MessageModel>>([]);
	const [authenticate, setAuthenticate] = useState(false);
	const [inviteState, setInviteState] = useState<Array<UserModel>>([]);
	const [messagesList, setMessagesList] = useState<JSX.Element[]>([]);
	const [chanInfo, setChanInfo] = useState<ChannelModel>();
	const [currentUserName, setCurrentUserName] = useState("");
	const [currentUserId, setCurrentUserId] = useState(0);
	const [currentUserAdmin, setCurrentUserAdmin] = useState(false);
	const [isOp, setOp] = useState(false);
	const [currentTime, setCurrentTime] = useState(new Date());
	const navigate = useNavigate();

	useEffect(() => {
		(async () => {
			try {
				await fetch(`${process.env.REACT_APP_BACKEND_URL}/channels/chan/${id}`, {
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
				})
				.then((res) => res.json())
				.then(
				(messages) => {
					setMessagesState(messages);
				}
				);
				await fetch(`${process.env.REACT_APP_BACKEND_URL}/channels/edit/${id}`, {
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
				})
				.then((res) => res.json())
					.then(
					(chan) => {
						setuserBool(false);
						setInviteBool(false);
						setInfoBool(true);
						setChanInfo(chan);
					}
					);
            } catch (e) {
				showAlert("error", "You tried to enter a channel with no rights to do so. Be careful young entrepeneur!!");
				navigate("/chat/channels/");
			}

        })();
    }, [accessToken, id, showAlert, navigate]);

	useEffect(() => {
		const timer = setInterval(() => {
		  setCurrentTime(new Date());
		}, 1000);
		return () => {
		  clearInterval(timer)
		};
	  }, []);

	function handleChanClick(event: MouseEvent) {
		setuserBool(false);
		setInfoBool(true);
		setInviteBool(false);
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
		setInviteBool(false);
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
			const data = chanInfo?.mutedList?.filter((mutedUser) => mutedUser.userId === user.id);
			const retrieveDate = data?.at(0)?.muteExpiration;
			let newDate = currentTime;
			let unMuted: boolean = false;
			if (retrieveDate){
				newDate = new Date(retrieveDate);
			}
			if (newDate){
				unMuted = isAfter(currentTime.getTime(), newDate.getTime());
			}
			if (unMuted){
				// Might be worthy to delete the mutedList item
			}
			if (!chanInfo?.mutedList?.some((mutedUser) => mutedUser.userId === user.id) || unMuted){
				chatSocket?.emit("chanMessage", {room: id, message: value});
				setValue("");
				const inputValue : HTMLElement | null = document.getElementById("newMsg");
				if (inputValue!= null){
					inputValue.nodeValue = "";
				}
			}
			else{
				showAlert("error", "You are currently muted");
			}
		}
	};

	const handleKeyDownPassword = async (event : KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter" && value && value !== ""){
			const data = {chanId : chanInfo?.id, secret : value};
			try {
				const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/channels/secret`, {
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
					body: JSON.stringify(data),
				})		
				if (res.status === 201) {
					showAlert("success", "Password valid, please enter");
					setValue("");
					const inputValue : HTMLElement | null = document.getElementById("newMsg");
					if (inputValue!= null){
						inputValue.nodeValue = "";
					}
					setAuthenticate(true);
					setInfoBool(true);
					setuserBool(false);
					setInviteBool(false);
				}
				else{
					showAlert("error", "Invalid password, little gourgandin");
					setValue("");
					const inputValue : HTMLElement | null = document.getElementById("newMsg");
					if (inputValue!= null){
						inputValue.nodeValue = "";
					}
				}
			} catch (e) {
				console.error("Error kicking from channel");
			}
		}
	};
	
	useEffect(() => {
		chatSocket?.on("errorSendingMessage", (username:string)=>{
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
			const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/channels/kick`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify(data),
			})
			chatSocket?.emit("blockUser", toEmit);			
			if (res.status === 201) {
				setInfoBool(true);
				setuserBool(false);
				setInviteBool(false);
			}
			else{
				// To dOOOOOOOOOOOOOO
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
			const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/block`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify(data),
			})
			chatSocket?.emit("blockUser", toEmit);			
			if (res.status === 201) {
				showAlert("success", userBottomName + " has been blocked");
				setInfoBool(true);
				setuserBool(false);
				setInviteBool(false);
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
			const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/channels/ban`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify(data),
			})
			chatSocket?.emit("exitChatRoom", toEmit);			
			if (res.status === 201) {
				showAlert("success", userName + " has been banned");
				setInfoBool(true);
				setuserBool(false);
				setInviteBool(false);
			}
			else {
				// To dooooooooooooooo
			}
		} catch (e) {
			console.error("Error bannishing from channel");
		}
	  }

	  async function handleMute(userName : string, userId: number) {
		const chanId = chanInfo?.id;
		const mutedEnd = new Date(currentTime.getTime() + 30000);
		const data = {chanId, userId, mutedEnd};
		const mode = "mute";
		const toEmit = {id, userId, userName, mode}
		if (chanInfo?.ownerId === userId){
			showAlert("error", "Error, you can't kick, ban or mute the channel owner bro");
			return ;
		}
		try {
			const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/channels/mute`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify(data),
			})
			if (res.status === 201) {
				chatSocket?.emit("MuteInChatRoom", toEmit);			
				showAlert("success", userName + " has been muted for 30 seconds");
				setInfoBool(true);
				setuserBool(false);
				setInviteBool(false);
			}
			else {
				// To dooooooooooooooo
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
			const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/channels/admin`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify(data),
			})
			chatSocket?.emit("adminChatRoom", toEmit);
			if (res.status === 201) {
				setInfoBool(true);
				setuserBool(false);
				setInviteBool(false);
			}
			else {
				// To dooooooooooooooo
			}
		} catch (e) {
			console.error("Error adminishing from channel");
		}
	  }

	  async function handleReturnToList() {
		setInfoBool(true);
		setuserBool(false);
		setInviteBool(false);
	  }

	  async function handleInviteListClick() {
		if (!chanInfo?.title){ return }
		const data = {title : chanInfo?.title};
		try {
			await fetch(`${process.env.REACT_APP_BACKEND_URL}/channels/retrieve_invite_list`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify(data),
			})
			.then((res) => res.json())
			.then(
				(users) => {
					setInviteState(users);
				}
				);
			} catch (e) {
				console.error("Error retieving invite users from channel");
			}
			setInviteBool(true);
			setInfoBool(false);
			setuserBool(false)
	  }

	  async function handleInviteClick(userId : number) {
		if (!chanInfo?.title || !userId){ return }
		const data = {title : chanInfo?.title, userId };
		const toEmit = { room : chanInfo.title, userId : userId};
		try {
			const res : Response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/channels/invite`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify(data),
			})
			if (res.status === 201) {
				chatSocket?.emit("addUserToChan", toEmit);

				setInfoBool(true);
				setuserBool(false);
				setInviteBool(false);
			}
			else {
				// To dooooooooooooooo
			}
			navigate(`/chat/channels/${chanInfo?.title}`);
			} catch (e) {
				console.error("Error adding user to chan");
			}
	  }

	  useEffect(() => {
		const joinedListener = (chan: ChannelModel) => {
			setChanInfo(chan);
		}
		chatSocket?.on("userJoinedChan", joinedListener)
		return () => {
			chatSocket?.off("userJoinedChan",);
		}
	  }, [chanInfo, chatSocket])

	  useEffect(() => {
		const inviteListener = (chan: ChannelModel, user : UserModel) => {
			setInviteState(inviteState.filter(userCompare => userCompare.id !== user.id));
		}
		chatSocket?.on("removeFromInviteList", inviteListener)
		return () => {
			chatSocket?.off("removeFromInviteList",);
		}
	  }, [chanInfo, chatSocket, inviteState])

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
				}else if (username === user.userName && mode === "mute") {
				showAlert("success", "You've been muted 30 seconds from this channel");
			}
			setChanInfo(chan);
		}
		const updateUsernameListener = (data : {id : number, userName : string}) => {
			setChanInfo((chan) => {
				// eslint-disable-next-line
				const updatedUser = chan?.members.filter((user)=>{if (user.id === data.id) return user.userName = data.userName});
				console.log(updatedUser);				
				return chan; 
			});
		}

		socket?.on("userNameUpdatedChannel", updateUsernameListener)
		chatSocket?.on("kickOrBanOrLeaveFromChannel", chanListener)
		chatSocket?.on("userJoinedChan", chanListener)
		chatSocket?.on("adminJoinedChan", chanListener)
		chatSocket?.on("refreshMute", chanListener)
		return () => {
			socket?.off("userNameUpdatedChannel",);
			chatSocket?.off("kickOrBanOrLeaveFromChannel",);
			chatSocket?.off("userJoinedChan",);
			chatSocket?.off("adminJoinedChan",);
			chatSocket?.off("refreshMute",);
		}
	  }, [chatSocket, socket, navigate, showAlert, user.userName])

	return (
		<div className="container d-flex flex-column justify-content align-items">
			<div className="title">Chat channels</div>
			<div>
			<ChatNav/>
					<h1 className="m-20">{id}</h1>
					<div className="d-flex flex-raw justify-content-space-between">
						{ (chanInfo?.mode === "Protected" && !authenticate) ?
							<>
							<div className="d-flex flex-column justify-content-space-between">
								<h1>Enter the secret password</h1>
								<input className={`btn-primary m-20 d-flex flex-column justify-content align-items`} onKeyDown={handleKeyDownPassword}
								type="password" name="secret" id="secret"
								onChange={(e)=>{setValue(e.target.value)}} value={value}/>
							</div>
							</>
							:
							<>
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
							<div className={`btn-primary m-20`} onClick={() => {handleInviteListClick()}}>
							Invite
							</div>
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
							<button className="btn-primary ml-10" onClick={
								()=> socket?.emit(
									"sendGameInvite", 
									{
										sender : user.id, 
										invited : currentUserId
									}
								)}>
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
								<button onClick={() => handleReturnToList()} className="btn-primary ml-10">
								Return
								</button>
								</div>
							}
						{ inviteBool && chanInfo &&
							<div className="d-flex flex-column">
							<div className={`btn-primary m-20`} onClick={() => {
								handleInviteListClick()}}>
								Invite
								</div>
								<div>
								<h2 className="ml-10">
								Invite List
								</h2>
								<ul>
								{inviteState.map((member)=>{							
									return (
										<li onClick={() => handleInviteClick(member.id)} key={member.id} className="ml-10">
												{member.userName}
											</li>
										)
									})}
								</ul>
								</div>
						</div>
					}
					</>
				}
				</div>
			</div>
		</div>
	);
}
