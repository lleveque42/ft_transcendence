import LoginForm from "../../components/Forms/LoginForm/LoginForm";
import { useEffect, useState } from "react";
import styles from "./Login.module.scss";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Login() {
	const naviagte = useNavigate();
	const { auth } = useAuth();
	const [hasBeenClicked, setHasBeenClicked] = useState<Boolean>(false);

	// useEffect(() => {
	// 	if (auth !== "ok") naviagte("/");
	// }, [auth]);

	function handleLoginFortyTwoClick(e: React.MouseEvent) {
		setHasBeenClicked(!hasBeenClicked);
		e.preventDefault();
		let tID = setTimeout(function () {
			window.location.href = process.env.REACT_APP_URL42 as string;
			window.clearTimeout(tID);
		}, 250);
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
				>
					<LoginForm />
					<div className="mb-10">or</div>
					<a
						href={process.env.REACT_APP_URL42}
						className={`${styles.btn} d-flex flex-column justify-content align-items`}
						onClick={handleLoginFortyTwoClick}
					>
						<p
							className={`${
								hasBeenClicked ? styles.clickedText : styles.btnText
							}`}
						>
							Login with 42
						</p>
						<div
							className={`${
								hasBeenClicked ? styles.clickedBtn2 : styles.btnTwo
							}`}
						>
							<p
								className={`${
									hasBeenClicked ? styles.clickedText2 : styles.btnText2
								}`}
							>
								<i className="fa-solid fa-right-to-bracket"></i>
							</p>
						</div>
					</a>
				</div>
			</div>
		</>
	);
}
