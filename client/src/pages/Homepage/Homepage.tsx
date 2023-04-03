import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import styles from "./Homepage.module.scss";

export default function Homepage() {
	const [cookie, , removeCookie] = useCookies(["_jwt"]);
	const navigate = useNavigate();

	useEffect(() => {
		if (!cookie["_jwt"]) navigate("/login");
	});

	function handleClickRemoveCookie() {
		removeCookie("_jwt");
	}

	// async fuction handleClickDeleteAllDatabase() {
		// faire une requete a l'api pour delete tous les users
	// }

	return (
		<div className="container d-flex flex-column justify-content align-items">
			<div className="title">PONG</div>
			<h2 className="underTitle mb-20">Homepage</h2>
			<div
				className={`${styles.btnContainer} d-flex justify-content-space-between align-items mb-30`}
			>
				<button
					className={`btn-danger ${styles.removeCookieButton}`}
					onClick={handleClickRemoveCookie}
				>
					Remove login cookie
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
