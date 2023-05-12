import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useUser } from "../../context/UserProvider";
import { ChannelModel } from "../../entities/entities"
import { usePrivateRouteSocket } from "../../context/PrivateRouteProvider";

export default function DirectMessages() {

	const { user , accessToken} = useUser();
	const [directMessagesState, setDirectMessagesState] = useState<ChannelModel[]>([]);
	const {chatSocket} = usePrivateRouteSocket();

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

useEffect(() => {
	const DirectMessagesListener = (chan: ChannelModel) => {
		const {id,
			title,
			type,
			mode,
			ownerId,
			members,
			messages} = chan;
			setDirectMessagesState([...directMessagesState, {id, title, type, mode, ownerId, members, messages}]);
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
