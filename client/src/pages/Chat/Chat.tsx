import { useNavigate } from "react-router-dom";
import styles from "./Chat.module.scss";
import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import ChatEmptyContainer from "../../components/Chat/ChatEmptyContainer/ChatEmptyContainer";

export default function Chathome() {
	const navigate = useNavigate();


	const bool = true;
	return (
		<div className="container d-flex flex-column justify-content align-items">
			<div className="title">Chat</div>
			<div
				className={`${styles.btnContainer} d-flex justify-content-space-between align-items mb-30`}
				>
				<div>{bool ? 
					<>
						{/* Insert all elements of the chat */}
						<ChatNav/>
						<ChatEmptyContainer/>
					</>
					: 
					<>
						{/* <p>"The user isn’t logged in"</p>
						<button onClick={()=>{navigate("/login")}} >Go back</button> */}
					</>
					}
				</div>
			</div>
		</div>
	);
}
