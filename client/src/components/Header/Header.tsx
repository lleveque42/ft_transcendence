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
						<img
							src={logo}
							alt=""
							className={styles.logo}
							onClick={() => {
								navigate("/");
							}}
						/>
						<div className={`${styles.headerNav} d-flex align-items ml-30`}>
							<h3
								className={`${usersMatch ? styles.activeNavLink : ""}`}
								onClick={() => navigate("/users")}
							>
								Users
							</h3>
							<h3
								className={`${channelsMatch ? styles.activeNavLink : ""} ml-20`}
								onClick={() => navigate("/chat/direct_messages")}
							>
								Chat
							</h3>
						</div>

						<div className="d-flex align-end" ref={menuRef}>
							<div
								className={`${styles.menuTrigger} d-flex`}
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
										<button>My Profile</button>
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
										<button>Logout</button>
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
