import { MessageModel } from "../../entities/entities";
import { useUser } from "../../context/UserProvider";
import styles from "./Message.module.scss";
import trimUserName from "../../utils/trimUserName";

// Destructuring props in the function arguments.
export default function Message({
	allMessages,
	username,
	content,
}: {
	allMessages: MessageModel[];
	username: string;
	content: string;
}) {
	const { user } = useUser();
	return user.userName === username ? (
		<>
			<span
				className={` ${styles.messageContainer} d-flex flex-column flex-end`}
			>
				<p>{content}</p>
			</span>
		</>
	) : (
		<>
			<span
				className={` ${styles.messageContainer} d-flex flex-column flex-begin`}
			>
				<p>{content}</p>
				<small>{trimUserName(username)}</small>
			</span>
		</>
	);
}
