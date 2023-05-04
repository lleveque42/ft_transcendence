import { useInRouterContext, useNavigate } from "react-router-dom";
import styles from "./Chat.module.scss";
import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import ChatEmptyContainer from "../../components/Chat/ChatEmptyContainer/ChatEmptyContainer";
import { useUser } from "../../context/UserProvider";
import { useEffect, useState } from "react";
import { log } from "console";
import { ChatSocketContext } from "../../context/ChatSocketProvider";
import { Socket } from "socket.io-client";

export default function Chathome() {
	const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [userState, setUserState] = useState({
		email:''
	});
	const [socket, setSocket] = useState<Socket | null>(null);


	const { accessToken, user } = useUser();

	useEffect(() => {
        (async () => {
            try {
                await fetch(`http://localhost:3000/user/${user.userName}`, {
				credentials: "include",
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
			.then((res) => res.json())
			.then(
				(user) => {
					setUserState(user);
				}
			);
            } catch (e) {
                setError(true);
            }
        })();
    }, [accessToken, user.userName]);

	const chatSocketValue = { socket };
	const {email} = userState;
	// console.log("email " + email);
	
	const bool = true;
	
	return (
		<ChatSocketContext.Provider value={chatSocketValue}>
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
		</ChatSocketContext.Provider>
	);
}
