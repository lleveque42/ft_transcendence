import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserProvider";
import { ChannelModel } from "../../entities/entities"
import { usePrivateRouteSocket } from "../../context/PrivateRouteProvider";

export default function DirectMessages() {

	const { user , accessToken} = useUser();
	const [directMessagesState, setDirectMessagesState] = useState<ChannelModel[]>([]);
	const {chatSocket} = usePrivateRouteSocket();

	const navigate = useNavigate();

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

  const directMessageList = directMessagesState.map((channel) => {
	const members = channel.members;
	let membersDetails;
	console.log("Rendering directMessageList");
	if (members){
		membersDetails = members.map((member) => {
			return ( member.id !== user.id &&
				<p key={member.id}>{member.userName}</p>
				);
			});
			
			return (
				<NavLink key={channel.id}  className={``}  to={`/chat/direct_messages/${channel.title}`} >
			{membersDetails}	
		</NavLink >
	);
	}
	return (<p key={"0"}></p>)
  });

  const DirectMessagesListener = (chan: ChannelModel) => {
	const {id,
		title,
		type,
		ownerId,
		members,
		messages} = chan;
		setDirectMessagesState([...directMessagesState, {id, title, type, ownerId, members, messages}]);
		console.log("Adding a new DM to directMessagesState");
		navigate("/chat/direct_messages");
}

useEffect(() => {
	chatSocket?.on("receivedDirectMessage", DirectMessagesListener);
	return () => {
		chatSocket?.off("receivedDirectMessage", DirectMessagesListener);
	}
	// eslint-disable-next-line react-hooks/exhaustive-deps
}, [DirectMessagesListener,setDirectMessagesState])

	return (
		<div className="container d-flex flex-column justify-content align-items">
			<div className="title">Chat messages</div>
			<div>
					<ChatNav/>
					{
						<>
							<h1>Private messages ({directMessagesState.length})</h1>
							<ul className="List">{directMessageList}</ul>
							<NavLink className={``}  to='/chat/direct_messages/new_dm' >
								New Direct Messages
            				</NavLink>
						</>
					}
			</div>
		</div>
	);
}
