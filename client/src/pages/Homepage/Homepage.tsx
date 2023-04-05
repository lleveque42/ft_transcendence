import { useNavigate } from "react-router-dom";
import styles from "./Homepage.module.scss";
import useLogout from "../../hooks/useLogout";

export default function Homepage() {
	const logout = useLogout();
	const navigate = useNavigate();

	const signout = async () => {
		await logout();
		navigate("/login");
	}

	async function handleClickDeleteAllDatabase() {
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
			</div>
		</div>
	);
}
