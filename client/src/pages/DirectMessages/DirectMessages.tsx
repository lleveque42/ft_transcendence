import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useUser } from "../../context/UserProvider";

export default function DirectMessages() {

	const { user , accessToken} = useUser();
	
	const [directMessagesState, setDirectMessagesState] = useState([]);
	
	// Make the user to join the rooms of his DMs
	
	const directMessagesNames = directMessagesState.map(({ title}) => (title));
	

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
	
	const DirectMessagesList = directMessagesState.map(({ username, content }) => (
		<li key={username}>
			<div>
			<NavLink className={``}  to={`/chat/direct_messages/${username}`} >
				<span>
					{username}
				</span>
			</NavLink>
				<button>
					Delete
				</button>
			</div>
		</li>
	  ));
	


	return (
		<div className="container d-flex flex-column justify-content align-items">
			<div className="title">Chat messages</div>
			<div>
					<ChatNav/>
					{
						<>
							<h1>Messages ({DirectMessagesList.length})</h1>
							<ul className="List">{DirectMessagesList}</ul>
							<NavLink className={``}  to='/chat/direct_messages/new_dm' >
								New Direct Messages
            				</NavLink>
						</>
					}
			</div>
		</div>
	);
}
