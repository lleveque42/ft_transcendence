import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useUser } from "../../context/UserProvider";

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
					.then((chans) => {
						setChannelsState(chans);
					});
			} catch (e) {}
		})();
	}, [user.userName, accessToken]);

	const channelsList = channelsState.map(({ id, title, ownerId }) => (
		<li key={id}>
			<div className="d-flex flex-row m-10 justify-content-space-between">
				<NavLink className={``} to={`/chat/channels/${title}`}>
					<span>{title}</span>
				</NavLink>
				{user.id === ownerId && (
					<>
						<div className="d-flex flex-row">
							<NavLink
								className={`btn-primary`}
								to={`/chat/channels/edit_channel/${title}`}
							>
								Edit
							</NavLink>
							<button className="btn-danger ml-10">Delete</button>
						</div>
					</>
				)}
			</div>
		</li>
	));

	return (
		<div className="d-flex flex-column align-items flex-1">
			<div className="title mt-20">Channels</div>
			<div>
				<ChatNav />
				{
					<>
						<h1 className="mt-20">Channels ({channelsState.length})</h1>
						<ul className="List m-20">{channelsList}</ul>
						<NavLink
							className={`btn-primary m-10 d-flex flex-column justify-content align-items`}
							to="/chat/channels/new_channel"
						>
							New Channel
						</NavLink>
						<NavLink
							className={`btn-primary m-10 d-flex flex-column justify-content align-items`}
							to="/chat/channels/join_channel"
						>
							Join Channel
						</NavLink>
					</>
				}
			</div>
		</div>
	);
}
