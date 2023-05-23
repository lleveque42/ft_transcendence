import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useUser } from "../../context/UserProvider";
import { ChannelModel } from "../../entities/entities"
import { usePrivateRouteSocket } from "../../context/PrivateRouteProvider";
import { useAlert } from "../../context/AlertProvider";

export default function DirectMessages() {

	const { user ,isAuth, accessToken} = useUser();
	const [directMessagesState, setDirectMessagesState] = useState<ChannelModel[]>([]);
	const {chatSocket} = usePrivateRouteSocket();
	const { showAlert } = useAlert();


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

	async function handleBlock(channel : ChannelModel) {
		const room = channel?.title;
		const id = channel?.id;
		const userTopName = user.userName;
		const userTopId = user.id;
		const userList = channel.members;
		const userId1 = userList.at(0)?.id;
		const userId2 = userList.at(1)?.id;
		const userName1 = userList.at(0)?.userName;
		const userName2 = userList.at(1)?.userName;
		let userBottomName = "";
		let userBottomId = 0;
		if (userId1 && userId2 && userName1 && userName2){
			userBottomId = (userId1 === user.id) ? userId2 : userId1;
			userBottomName = (userName1 === user.userName) ? userName2 : userName1;
		}
		const mode = "block";
		const data = {userTopName , userTopId, userBottomName, userBottomId}
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
				isAuth();
				showAlert("success", "You've just blocked " + userBottomName);
			}
		} catch (e) {
			console.error("Error blocking from user");
		}
	  }

  const directMessageList = directMessagesState.map((channel) => {
	const members = channel.members;
	let membersDetails;
	if (members){
		membersDetails = members.map((member) => {
			return ( member.id !== user.id &&
				<p key={member.id}>{member.userName}</p>
				);
			});
			
			return (
				<div key={channel.id} className="d-flex flex-raw justify-content align-items">
					<NavLink key={channel.id} className={``}  to={`/chat/direct_messages/${channel.title}`} >
						{membersDetails}	
					</NavLink >
					<button onClick={() => handleBlock(channel)} className="btn-danger ml-10">
						Block
					</button>
				</div>
	);
	}
	return (<p key={"0"}></p>)
  });

useEffect(() => {
	const DirectMessagesListener = (chan: ChannelModel) => {
		const {id,
			title,
			type,
			mode,
			ownerId,
			members,
			messages,
			operators,
			banList} = chan;
			setDirectMessagesState([...directMessagesState, {id, title, type, mode, ownerId, members, messages, operators, banList}]);
	}
	chatSocket?.on("receivedDirectMessage", DirectMessagesListener);
	return () => {
		chatSocket?.off("receivedDirectMessage", DirectMessagesListener);
	}
}, [chatSocket, directMessagesState])

	return (
		<div className="container d-flex flex-column justify-content align-items">
			<div className="title">Chat messages</div>
			<div>
				<ChatNav/>
				{
					<>
						<h1 className={`mt-20`}>Private messages ({directMessagesState.length})</h1>
						<ul className="List m-20">{directMessageList}</ul>
						<NavLink className={`btn-primary m-10 d-flex flex-column justify-content align-items`}  to='/chat/direct_messages/new_dm' >
							New Direct Messages
						</NavLink>
					</>
				}
			</div>
		</div>
	);
}
