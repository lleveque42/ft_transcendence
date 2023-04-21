import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserProvider";
import styles from "./Header.module.scss";
import default_avatar from "../../assets/images/punk.png";
import { useEffect, useRef, useState } from "react";

export default function Header() {
	const navigate = useNavigate();
	const { logout, user } = useUser();
	const [openMenu, setOpenMenu] = useState<boolean>(false);
	const menuRef = useRef<HTMLDivElement>(null);

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

	return (
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

				<div className={`${styles.menuContainer}`} ref={menuRef}>
					<div
						className={`${styles.menuTrigger} d-flex align-items`}
						onClick={() => setOpenMenu(!openMenu)}
					>
						<img src={default_avatar} alt="Avatar" />
					</div>
					<div
						className={`${styles.dropdownMenu} ${
							openMenu ? styles.active : styles.inactive
						}`}
					>
						<h3>Hey {user.userName}!</h3>
						<ul>
							<li
								className={`${styles.dropdownItem}`}
								onClick={() => {
									navigate("/editprofile");
								}}
							>
								<button>My Profile</button>
							</li>
							<li
								className={`${styles.dropdownItem}`}
								onClick={() => {
									navigate("/settings");
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
	);
}
