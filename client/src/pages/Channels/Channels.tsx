import React from "react";

import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import { useEffect, useState } from "react";
import { NavLink} from "react-router-dom";
import { useUser } from "../../context/UserProvider";
// import { usePrivateRouteSocket } from "../../context/PrivateRouteProvider";

export default function Channels() {
  
	const { accessToken, user } = useUser();
	const [channelsState, setChannelsState] = useState([]);
	
	useEffect(() => {
		(async () => {
			try {
				await fetch(`http://localhost:3000/channels/${user.userName}`, {
					credentials: "include",
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				})
				.then((res) => res.json())
				.then(
				(chans) => {
					setChannelsState(chans);
				}
				);
            } catch (e) {
			}
        })();
    }, [user.userName, accessToken]);

	const channelsList = channelsState.map(({ id, title, ownerId}) => (
		<li key={id}>
			<div>
			<NavLink className={``}  to={`/chat/channels/${title}`} >
				<span>
					{title}
				</span>
			</NavLink>
			{ user.id === ownerId &&
				<>
					<button>
						Delete
					</button>
				</>
			}
			</div>
		</li>
	));
	
	return (
		<div className="container d-flex flex-column justify-content align-items">
			<div className="title">Chat channels</div>
			<div>
					<ChatNav/>
					{
						<>
							<h1>Channels ({channelsState.length})</h1>
							<ul className="List">{channelsList}</ul>
							<NavLink className={``}  to='/chat/channels/new_channel' >
								New Channel
            				</NavLink>
							<NavLink className={``}  to='/chat/channels/join_channel' >
								Join Channel
            				</NavLink>
						</>
					}
			</div>
		</div>
	);
}