import { useNavigate } from "react-router-dom";
import styles from "./Homepage.module.scss";
import { useAuth } from "../../context/AuthProvider";

export default function Homepage() {
	const { logout } = useAuth();
	const navigate = useNavigate();

	const signout = () => {
		logout();
		navigate("/login");
	};

	async function handleClickDeleteAllDatabase() {	// To del

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

	return (
		<div className="container d-flex flex-column justify-content align-items">
			<div className="title">PONG</div>
			<h2 className="underTitle mb-20">Homepage</h2>
			<div
				className={`${styles.btnContainer} d-flex justify-content-space-between align-items mb-30`}
			>
				<button
					className={`btn-danger ${styles.removeCookieButton}`}
					onClick={signout}
				>
					Logout
				</button>
				<button
					className={`btn-danger ${styles.removeCookieButton}`}
					onClick={handleClickDeleteAllDatabase}
				>
					Empty users db
				</button>
				<button
					className={`btn-danger ${styles.removeCookieButton}`}
					onClick={() => {
						navigate("/editprofile");
					}}
				>
					Edit Profile
				</button>
			</div>
		</div>
	);
}
