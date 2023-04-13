import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import styles from "./Header.module.scss";
import photo from "../../assets/images/medium_arudy.jpg";
import { useEffect, useRef, useState } from "react";

export default function Header() {
	const navigate = useNavigate();
	const { logout } = useAuth();
	const [openMenu, setOpenMenu] = useState<boolean>(false);
	const menuRef = useRef<HTMLDivElement>(null);

	const signout = () => {
		logout();
		navigate("/login");
	};

	async function handleClickDeleteAllDatabase() {
		// To del

		try {
			const res = await fetch("http://localhost:3000/user/temporary_dropdb", {
				method: "DELETE",
				credentials: "include",
			});
			if (res.status === 410) {
				signout();
			}
		} catch (e) {
			console.error("Error remove users DB: ", e);
		}
	}

	useEffect(() => {
		const handle = (e: Event) => {
			// if (!menuRef.current.contains(e.target)) setOpenMenu(false);
		};
		document.addEventListener("mousedown", handle);
		return () => document.addEventListener("mousedown", handle);
	});

	return (
		<header>
			<div
				className={`${styles.headerContainer} d-flex align-items justify-content-space-between`}
			>
				<h2 className={`${styles.title} pl-10`}>FT_TRANSCENDENCE</h2>

				<div className={`${styles.menuContainer}`} ref={menuRef}>
					<div
						className={`${styles.menuTrigger} d-flex align-items`}
						onClick={() => setOpenMenu(!openMenu)}
					>
						<img src={photo} />
					</div>

					<div className={`${styles.dropDown}`}>
						{/* ${open? 'active' : 'inactive'} */}
						<ul>
							<li className={`${styles.menuItem}`}>
								<button
									className="btn btn-primary mr-5"
									onClick={() => {
										navigate("/editprofile");
									}}
								>
									Edit Profile
								</button>
							</li>
							<li className={`${styles.menuItem}`}>
								<button className="btn-danger mr-5" onClick={signout}>
									Logout
								</button>
							</li>
						</ul>
					</div>

					{/* <button
						className="btn btn-primary mr-5"
						onClick={() => {
							navigate("/");
						}}
					>
						Homepage
					</button>
					<button
						className="btn-danger mr-5"
						onClick={handleClickDeleteAllDatabase}
					>
						Empty users db
					</button> */}
				</div>
			</div>
		</header>
	);
}
