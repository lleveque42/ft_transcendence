import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context";
import styles from "./FriendsList.module.scss";

export default function FriendsList() {
	const { user } = useUser();
	const navigate = useNavigate();

	const friends = [
		{ userName: "aefgh" },
		{ userName: "abcdefgh" },
		{ userName: "abcdefgh" },
		{ userName: "abcdefgh" },
		{ userName: "abcdefgh" },
		{ userName: "abcdefgh" },
		{ userName: "abcdefgh" },
		{ userName: "abcdefgh" },
		{ userName: "abcdefgh" },
		{ userName: "abcdefgh" },
		{ userName: "abcdefgh" },
		{ userName: "abcdefgh" },
		{ userName: "abcdefgh" },
		{ userName: "abcdefgh" },
		{ userName: "abcdefgh" },
		{ userName: "abcdefgh" },
		{ userName: "abcdefgh" },
		{ userName: "abcdefgh" },
		{ userName: "abcdefgh" },
		{ userName: "abcdefgh" },
		{ userName: "abcdefgh" },
		{ userName: "abcdefgh" },
		{ userName: "abcdefgh" },
		{ userName: "abcdefgh" },
		{ userName: "abcdefgh" },
		{ userName: "abcdefgh" },
	];

	return (
		<>
			<h3 className="underTitle mt-10">My Friends</h3>
			<div className={styles.friendsList}>
				{friends.length !== 0 ? (
					<>
						<div
							// className={`${styles.listTitle} d-flex justify-content-space-between mb-5 pr-5`}
						>
							<li
								className={` ${styles.listElem} d-flex justify-content-space-between p-5`}
							>
								<p>Login</p>
								<p>|</p>
								<p>Play</p>
								<p>Dm</p>
							</li>
						</div>
						<ul className={`${styles.listElem} pl-5 pr-5`}>
							{friends.map((f, i) => (
								<li
									className={` ${styles.listElem} d-flex justify-content-space-between p-5`}
									key={i}
								>
									<p className="flex-1" onClick={() => navigate(`/user/${f.userName}`)}>
										{f.userName}
									</p>
									<p className="flex-1" >|</p>
									<i
										className="flex-1 fa-solid fa-gamepad"
										onClick={() => navigate("/play")}
									></i>
									<i
										className="flex-1 fa-solid fa-envelope"
										onClick={() => navigate("/chat")}
									></i>
								</li>
							))}
						</ul>
					</>
				) : (
					<h4 className="mt-20 pl-5">No friends :(</h4>
				)}
			</div>
		</>
	);
}
