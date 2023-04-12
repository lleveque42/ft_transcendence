import { useNavigate } from "react-router-dom";
import styles from "./Homepage.module.scss";
import { useCookies } from "react-cookie";
import { useEffect } from "react";

export default function Homepage() {
	const [cookie, , ] = useCookies(["_jwt"]);
	const navigate = useNavigate();

	useEffect(() => {
		if (!cookie["_jwt"]) navigate("/login");
	});

	async function handleClickDeleteAllDatabase() {
		// Need to logout user
		try {
			const res = await fetch("http://localhost:3000/user/temporary_dropdb", {
				method: "DELETE",
				credentials: "include",
			});
			if (res.status === 410) {
				logout();
				// navigate("/login");
			}
		} catch (e) {
			console.error("Error remove users DB: ", e);
		}
	}

	async function logout() {
		try {
			const res = await fetch("http://localhost:3000/auth/logout", {
				method: "POST",
				credentials: "include",
			});
			if (res.status === 204) navigate("/login");
		} catch (e) {
			console.error("Error logout: ", e);
		}
	}

	function handlePlay(): void {

	}

	return (
		<div className="container d-flex flex-column justify-content align-items">
			<div className="title">PONG</div>
			<h2 className="underTitle mb-20">Homepage</h2>
			<button
					className={`btn-primary ${styles.removeCookieButton} mb-20`}
					onClick={handlePlay}
				>
					Play
				</button>
			<div
				className={`${styles.btnContainer} d-flex justify-content-space-between align-items mb-30`}
			>
				<button
					className={`btn-danger ${styles.removeCookieButton}`}
					onClick={logout}
				>
					Logout
				</button>
				<button
					className={`btn-danger ${styles.removeCookieButton}`}
					onClick={handleClickDeleteAllDatabase}
				>
					Empty users db
				</button>
			</div>
		</div>
	);
}
