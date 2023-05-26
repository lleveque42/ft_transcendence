import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import { useEffect, useRef, useState } from "react";
import useAvatar from "../../hooks/useAvatar";
import { useUser } from "../../context";
import logo from "../../assets/images/pongLogo.png";
import trimUserName from "../../utils/trimUserName";

export default function Header() {
	const navigate = useNavigate();
	const { logout, user, accessToken } = useUser();
	const [openMenu, setOpenMenu] = useState<boolean>(false);
	const [userAvatar, setUserAvatar] = useState<string>("");
	const menuRef = useRef<HTMLDivElement>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const location = useLocation();
	const playMatch = location.pathname.startsWith("/play");
	const channelsMatch = location.pathname.startsWith("/chat");
	const usersMatch = location.pathname.startsWith("/user");

	const signout = () => {
		logout();
		navigate("/login");
	};

	useEffect(() => {
		const handle = (e: any) => {
			if (menuRef.current && !menuRef.current.contains(e.target)) {
				setOpenMenu(false);
			}
		};
		document.addEventListener("mousedown", handle);
		return () => document.removeEventListener("mousedown", handle);
	});

	useAvatar(accessToken, setUserAvatar, setIsLoading, user.userName);

	return (
		<>
			{isLoading ? (
				<></>
			) : (
				<header>
					<div className={`${styles.headerContainer} d-flex align-items`}>
						<div
							className={`${styles.headerNav} d-flex align-items justify-content-space-between`}
						>
							<img
								src={logo}
								alt=""
								className={styles.logo}
								onClick={() => {
									navigate("/");
								}}
							/>
							<h3
								className={`${playMatch ? styles.activeNavLink : styles.play}`}
								onClick={() => navigate("/play")}
							>
								PLAY
							</h3>
							<h3
								className={`${
									channelsMatch ? styles.activeNavLink : styles.chat
								}`}
								onClick={() => navigate("/chat/direct_messages")}
							>
								CHAT
							</h3>
							<h3
								className={`${
									usersMatch ? styles.activeNavLink : styles.users
								}`}
								onClick={() => navigate("/users")}
							>
								USERS
							</h3>
						</div>

						<div className="d-flex align-end" ref={menuRef}>
							<div
								className={`${styles.menuTrigger} d-flex ${
									openMenu ? styles.menuTriggerActive : ""
								}`}
								onClick={() => setOpenMenu(!openMenu)}
							>
								<img src={userAvatar} alt="Avatar" />
							</div>
							<div
								className={`${styles.dropdownMenu} ${
									openMenu ? styles.active : styles.inactive
								}`}
							>
								<h3>Hey {trimUserName(user.userName)}</h3>
								<ul>
									<li
										className={`${styles.dropdownItem}`}
										onClick={() => {
											navigate("/user/" + user.userName);
											setOpenMenu(false);
										}}
									>
										<button>Profile</button>
									</li>
									<li
										className={`${styles.dropdownItem}`}
										onClick={() => {
											navigate("/settings");
											setOpenMenu(false);
										}}
									>
										<button>Settings</button>
									</li>
									<li className={`${styles.dropdownItem}`} onClick={signout}>
										<button>Log out</button>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</header>
			)}
		</>
	);
}
