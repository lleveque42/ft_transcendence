import styles from "./Login.module.scss";

export default function Login() {
	function handleLoginFortyTwoClick(e: React.MouseEvent) {
		e.preventDefault();
		window.location.href = process.env.REACT_APP_URL42 as string;
	}

	return (
		<>
			<div
				className={`${styles.loginContainer} d-flex flex-column align-items justify-content`}
			>
				<div className="title mb-30">
					PONG<h2 className="underTitle">Login</h2>
				</div>
				<div
					className={`${styles.card} d-flex flex-column align-items justify-content`}
					onClick={handleLoginFortyTwoClick}
				>
					<div
						className={`${styles.btn} btn d-flex flex-column justify-content align-items pl-10 pr-10 p-5 `}
					>
						<div className={styles.buttonText}>Login with 42</div>
						<div className={styles.buttonIcon}>
							<i className="fa-solid fa-right-to-bracket"></i>{" "}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
