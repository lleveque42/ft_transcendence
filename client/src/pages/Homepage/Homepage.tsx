import { useNavigate } from "react-router-dom";
import styles from "./Homepage.module.scss";

export default function Homepage() {
	const navigate = useNavigate();

	// async fuction handleClickDeleteAllDatabase() {
	// faire une requete a l'api pour delete tous les users
	// }

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

	return (
		<div className="container d-flex flex-column justify-content align-items">
			<div className="title">PONG</div>
			<h2 className="underTitle mb-20">Homepage</h2>
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
					// onClick={handleClickDeleteAllDatabase}
				>
					Empty users db
				</button>
			</div>
		</div>
	);
}
