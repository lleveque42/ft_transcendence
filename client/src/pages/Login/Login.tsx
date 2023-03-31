import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import "./login.scss";

export default function Login() {
	const navigate = useNavigate();
	const [cookie] = useCookies(["_jwt"]);

	useEffect(() => {
		if (cookie["_jwt"]) navigate("/");
	});

	return (
		<>
			<div className="loginContainer d-flex flex-column align-items justify-content">
				{/* <h1>Login</h1> */}
				{/* <button
				onClick={() => {
					navigate("/signup");
				}}
			>
				Signup Page
			</button> */}
				<div className="title mb-30">PONG</div>
				<div className="d-flex flex-column align-items justify-content">
					<LoginForm />
					<div className="mb-10">or</div>
					<a
						href={process.env.REACT_APP_URL42}
						className="btn d-flex flex-column justify-content align-items"
					>
						<p className="btn-Text">Login with 42</p>
						<div className="btn-Two">
							<p className="btn-Text2">
								<i className="fa-solid fa-right-to-bracket"></i>
							</p>
						</div>
					</a>
				</div>
			</div>
		</>
	);
}
