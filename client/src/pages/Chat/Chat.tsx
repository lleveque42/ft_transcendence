import styles from "./Chat.module.scss";
import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import ChatEmptyContainer from "../../components/Chat/ChatEmptyContainer/ChatEmptyContainer";
import { useUser } from "../../context";

export default function Chathome() {
	const { user } = useUser();

	console.log(user.friends);

	return (
		<div className="container d-flex flex-column justify-content align-items">
			<div className="title">Chat</div>
			<div
				className={`${styles.btnContainer} d-flex justify-content-space-between align-items mb-30`}
			>
				<div>
					<>
						{/* Insert all elements of the chat */}
						<ChatNav />
						<ChatEmptyContainer />
					</>
				</div>
			</div>
		</div>
	);
}
