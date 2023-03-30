import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import { useCookies } from "react-cookie";
import { useEffect } from "react";

export default function Login() {
	const navigate = useNavigate();
	const [cookie] = useCookies(["_jwt"]);

	useEffect(() => {
		if (cookie["_jwt"]) navigate("/");
	});

	return (
		<>
			<h1>Login</h1>
			<button
				onClick={() => {
					navigate("/signup");
				}}
			>
				Signup Page
			</button>
			<LoginForm />
		</>
	);
}
