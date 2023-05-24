import styles from "./ChatNav.module.scss";
import { NavLink, useLocation } from "react-router-dom";

export default function ChatNav() {
	const location = useLocation();
	const directMessagesMatch = location.pathname.startsWith(
		"/chat/direct_messages",
	);
	const channelsMatch = location.pathname.startsWith("/chat/channels");

	return (
		<>
			<div className={`${styles.navContainer} d-flex flex-row mt-20`}>
				<NavLink
					className={`${styles.navLink} ${
						directMessagesMatch ? styles.activeNavLink : ""
					} p-20`}
					to="/chat/direct_messages"
				>
					Messages
				</NavLink>
				<NavLink
					className={`${styles.navLink} ${
						channelsMatch ? styles.activeNavLink : ""
					} p-20`}
					to="/chat/channels"
				>
					Channels
				</NavLink>
			</div>
		</>
	);
}
