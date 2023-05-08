import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useUser } from "../../context/UserProvider";
import { ChannelModel } from "../../entities/entities"

export default function DirectMessages() {

	const { user , accessToken} = useUser();
	const [directMessagesState, setDirectMessagesState] = useState<ChannelModel[]>([]);


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
	
const membersList = directMessagesState.map((channel) => {
	const members = channel.members;
	const membersDetails = members.map((member) => {
	  return ( member.id !== user.id &&
		  <p key={member.id}>{member.userName}</p>
	  );
	});

	return (
		<NavLink key={channel.id}  className={``}  to={`/chat/direct_messages/${channel.title}`} >
			{membersDetails}	
		</NavLink >
	);
  });

	return (
		<div className="container d-flex flex-column justify-content align-items">
			<div className="title">Chat messages</div>
			<div>
					<ChatNav/>
					{
						<>
							<h1>Private messages ({directMessagesState.length})</h1>
							<ul className="List">{membersList}</ul>
							<NavLink className={``}  to='/chat/direct_messages/new_dm' >
								New Direct Messages
            				</NavLink>
						</>
					}
			</div>
		</div>
	);
}
