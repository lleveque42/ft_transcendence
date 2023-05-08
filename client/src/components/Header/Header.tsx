import { useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import { useEffect, useRef, useState } from "react";
import useAvatar from "../../hooks/useAvatar";
import { useUser } from "../../context";

export default function Header() {
	const navigate = useNavigate();
	const { logout, user, accessToken } = useUser();
	const [openMenu, setOpenMenu] = useState<boolean>(false);
	const [userAvatar, setUserAvatar] = useState<string>("");
	const menuRef = useRef<HTMLDivElement>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const signout = () => {
		logout();
		navigate("/login");
	};

	function trimUserName(userName: string): string {
		let displayUserName: string = userName;
		if (displayUserName.length > 10)
			displayUserName = displayUserName.substring(0, 10) + "...";
		return displayUserName;
	}

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
					<div
						className={`${styles.headerContainer} d-flex align-items justify-content-space-between`}
					>
						<h2
							className={`${styles.title} pl-10`}
							onClick={() => {
								navigate("/");
							}}
						>
							FT_TRANSCENDENCE
						</h2>

						<div ref={menuRef}>
							<div
								className={`${styles.menuTrigger} d-flex align-items`}
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
